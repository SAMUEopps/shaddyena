// app/api/callback/services/order.service.ts

import mongoose from 'mongoose';
import Order from '@/shd-models/models/Order';
import Product from '@/shd-models/models/Product';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import Delivery from '@/shd-models/models/Delivery';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { calculateDeliveryFee, generateReference } from '../utils/helpers';
import { createLogger } from '../utils/logger';

const logger = createLogger('OrderPaymentService');

/**
 * Service for processing order payments
 * Handles: Updating order status, vendor balances, creating deliveries, stock updates
 */
export class OrderPaymentService extends BasePaymentService {
  /**
   * Process payment for one or multiple orders
   */
  async processPayment(
    transaction: TransactionDocument,
    receiptNumber: string,
    amount: number,
    phoneNumber: string
  ): Promise<PaymentResult> {
    return this.executeTransaction(async (session) => {
      try {
        // Update transaction
        await this.markTransactionSuccess(transaction, receiptNumber, {
          amount,
          phoneNumber
        }, session);

        // Get order details from metadata
        const orderIds = transaction.metadata?.orders || [];
        const customerId = transaction.metadata?.customerId;
        const referredBy = transaction.metadata?.referredBy;

        logger.info(`Processing ${orderIds.length} orders for payment ${receiptNumber}`);

        // Process each order
        const updatedOrders = await this.processOrders(
          orderIds,
          transaction,
          //customerId,
          session
        );

        // Handle referral commission if applicable
        if (referredBy && customerId) {
          await this.handleReferralCommission(
            referredBy,
            transaction.amount,
            session
          );
        }

        logger.info(`Successfully processed ${updatedOrders.length} orders: ${updatedOrders.join(', ')}`);
        return { success: true, data: { updatedOrders } };
      } catch (error) {
        logger.error('Error processing order payment:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }

  /**
   * Process individual orders
   */
  private async processOrders(
    orderIds: string[],
    transaction: TransactionDocument,
    //customerId: string,
    session: mongoose.ClientSession
  ): Promise<string[]> {
    const updatedOrders: string[] = [];

    for (const orderId of orderIds) {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        logger.warn(`Order ${orderId} not found, skipping...`);
        continue;
      }

      const vendor = await Vendor.findById(order.vendorId).session(session);
      if (!vendor) {
        logger.warn(`Vendor ${order.vendorId} not found, skipping...`);
        continue;
      }

      // Create delivery if not exists
      if (!order.deliveryId) {
        await this.createDelivery(order, vendor, session);
      }

      // Update order status
      await this.updateOrder(order, transaction, session);

      // Update product stock
      await this.updateProductStock(order.products, session);

      // Update vendor balances
      await this.updateVendorBalances(order, vendor, session);

      updatedOrders.push(order.orderNumber);
      logger.info(`Order ${order.orderNumber} marked as paid with immediate payout available`);
    }

    return updatedOrders;
  }

  /**
   * Create delivery record for an order
   */
  private async createDelivery(
    order: any,
    vendor: any,
    session: mongoose.ClientSession
  ): Promise<void> {
    const customer = await User.findById(order.customerId).session(session);
    
    const delivery = await Delivery.create([{
      orderId: order._id,
      customerName: customer?.name || 'Customer',
      customerPhone: order.deliveryPhone || customer?.phoneNumber || 'N/A',
      pickupLocation: vendor?.businessLocation || 'Vendor Location',
      dropoffLocation: order.deliveryAddress,
      status: 'pending',
      distance: 0,
      earnings: calculateDeliveryFee(order.totalAmount),
      estimatedTime: '30 min',
      createdAt: new Date()
    }], { session });

    order.deliveryId = delivery[0]._id;
    order.deliveryStatus = 'pending';
  }

  /**
   * Update order with payment details
   */
  private async updateOrder(
    order: any,
    transaction: TransactionDocument,
    session: mongoose.ClientSession
  ): Promise<void> {
    order.isPaid = true;
    order.transactionId = transaction.transactionId;
    order.status = 'processing';
    order.isImmediatePayoutAvailable = true;
    await order.save({ session });
  }

  /**
   * Update product stock levels
   */
  private async updateProductStock(
    products: Array<{ productId: string; quantity: number }>,
    session: mongoose.ClientSession
  ): Promise<void> {
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
  }

  /**
   * Update vendor balances
   */
  private async updateVendorBalances(
    order: any,
    vendor: any,
    session: mongoose.ClientSession
  ): Promise<void> {
    const immediateAmount = order.immediateWithdrawable || (order.vendorAmount * 0.8);
    const pendingAmount = order.pendingWithdrawable || (order.vendorAmount * 0.2);

    vendor.availableBalance = (vendor.availableBalance || 0) + immediateAmount;
    vendor.pendingBalance = (vendor.pendingBalance || 0) + pendingAmount;
    vendor.totalRevenue = (vendor.totalRevenue || 0) + order.vendorAmount;
    vendor.lifetimeEarnings = (vendor.lifetimeEarnings || 0) + order.vendorAmount;
    vendor.totalEarned = vendor.totalRevenue;
    vendor.pendingPayout = vendor.pendingBalance;

    await vendor.save({ session });

    logger.info(`Vendor ${vendor.businessName} balance updated`, {
      available: vendor.availableBalance,
      pending: vendor.pendingBalance,
      totalRevenue: vendor.totalRevenue
    });
  }

  /**
   * Handle referral commission
   */
  private async handleReferralCommission(
    referredBy: string,
    amount: number,
    session: mongoose.ClientSession
  ): Promise<void> {
    const commissionAmount = amount * 0.005; // 0.5% of total

    await User.findByIdAndUpdate(
      referredBy,
      {
        $inc: {
          referralCommissionEarnings: commissionAmount,
          referralEarnings: commissionAmount,
          availableBalance: commissionAmount
        }
      },
      { session }
    );

    logger.info(`Added ${commissionAmount} referral commission to user ${referredBy}`);
  }
}