// app/api/callback/services/subscription.service.ts

import mongoose from 'mongoose';
import User from '@/shd-models/models/User';
import Vendor from '@/shd-models/models/Vendor';
import Subscription from '@/shd-models/models/Subscription';
import VendorSubscription from '@/shd-models/models/VendorSubscription';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { calculateSubscriptionEndDate } from '../utils/helpers';
import { createLogger } from '../utils/logger';

const logger = createLogger('SubscriptionPaymentService');

/**
 * Service for processing subscription payments
 */
export class SubscriptionPaymentService extends BasePaymentService {
  /**
   * Process subscription payment
   */
  async processPayment(
    transaction: TransactionDocument,
    receiptNumber: string
  ): Promise<PaymentResult> {
    return this.executeTransaction(async (session) => {
      try {
        // Update transaction
        await this.markTransactionSuccess(transaction, receiptNumber, {}, session);

        const { subscriptionId, vendorId } = transaction.metadata || {};

        if (!subscriptionId || !vendorId) {
          throw new Error('Missing subscription or vendor ID');
        }

        const subscription = await Subscription.findById(subscriptionId).session(session);

        if (!subscription) {
          throw new Error('Subscription plan not found');
        }

        // End existing active subscription
        await this.endExistingSubscription(vendorId, session);

        // Create new vendor subscription
        const vendorSubscription = await this.createVendorSubscription(
          vendorId,
          subscription,
          transaction,
          session
        );

        // Update vendor details
        await this.updateVendor(vendorId, subscription, session);

        // Handle referral commission
        await this.handleReferralCommission(transaction, session);

        logger.info(`Subscription activated for vendor ${vendorId} - Plan: ${subscription.name}`);
        return { success: true, data: { vendorSubscription: vendorSubscription._id } };
      } catch (error) {
        logger.error('Error processing subscription payment:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }

  /**
   * End existing active subscription
   */
  private async endExistingSubscription(
    vendorId: string,
    session: mongoose.ClientSession
  ): Promise<void> {
    const existingVendorSub = await VendorSubscription.findOne({
      vendorId,
      status: 'active'
    }).session(session);

    if (existingVendorSub) {
      existingVendorSub.status = 'expired';
      existingVendorSub.endDate = new Date();
      await existingVendorSub.save({ session });
      logger.info(`Ended existing subscription for vendor ${vendorId}`);
    }
  }

  /**
   * Create new vendor subscription record
   */
  private async createVendorSubscription(
    vendorId: string,
    subscription: any,
    transaction: TransactionDocument,
    session: mongoose.ClientSession
  ): Promise<any> {
    const startDate = new Date();
    const endDate = calculateSubscriptionEndDate(subscription.billingCycle);

    const [vendorSubscription] = await VendorSubscription.create([{
      vendorId,
      subscriptionId: subscription._id,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true,
      paymentMethod: 'mpesa',
      amountPaid: transaction.amount,
      transactionId: transaction._id,
      features: subscription.features,
      maxProducts: subscription.maxProducts,
      maxOrders: subscription.maxOrders,
      commissionRate: subscription.commissionRate,
      prioritySupport: subscription.prioritySupport,
      analyticsAccess: subscription.analyticsAccess,
      promoFeatures: subscription.promoFeatures,
      customDomain: subscription.customDomain,
      apiAccess: subscription.apiAccess,
      teamMembers: subscription.teamMembers,
      storageLimit: subscription.storageLimit,
      renewalDate: endDate
    }], { session });

    return vendorSubscription;
  }

  /**
   * Update vendor with subscription details
   */
  private async updateVendor(
    vendorId: string,
    subscription: any,
    session: mongoose.ClientSession
  ): Promise<void> {
    await Vendor.findByIdAndUpdate(
      vendorId,
      {
        subscriptionId: subscription._id,
        subscriptionStatus: 'active',
        subscriptionTier: subscription.tier,
        subscriptionEndDate: calculateSubscriptionEndDate(subscription.billingCycle)
      },
      { session }
    );
  }

  /**
   * Handle referral commission for subscription
   */
  private async handleReferralCommission(
    transaction: TransactionDocument,
    session: mongoose.ClientSession
  ): Promise<void> {
    const user = await User.findById(transaction.userId).session(session);

    if (user?.referredBy) {
      const referrer = await User.findById(user.referredBy).session(session);

      if (referrer) {
        const commissionAmount = transaction.amount * 0.01; // 1% referral commission
        referrer.referralSubscriptionEarnings = (referrer.referralSubscriptionEarnings || 0) + commissionAmount;
        referrer.referralEarnings = (referrer.referralEarnings || 0) + commissionAmount;
        referrer.availableBalance = (referrer.availableBalance || 0) + commissionAmount;
        await referrer.save({ session });
        logger.info(`Added ${commissionAmount} subscription referral commission to ${referrer.name}`);
      }
    }
  }
}