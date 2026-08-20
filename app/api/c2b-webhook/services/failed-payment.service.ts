// app/api/callback/services/failed-payment.service.ts

import mongoose from 'mongoose';
import Order from '@/shd-models/models/Order';
import Advertisement from '@/shd-models/models/Advertisement';
import Investment from '@/shd-models/models/Investment';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('FailedPaymentService');

/**
 * Service for handling failed payments
 * Reverts any pending actions based on transaction type
 */
export class FailedPaymentService extends BasePaymentService {
  /**
   * Process a failed payment
   */
  async processPayment(
    transaction: TransactionDocument,
    reason: string
  ): Promise<PaymentResult> {
    return this.executeTransaction(async (session) => {
      try {
        // Update transaction status
        transaction.status = 'failed';
        transaction.errorMessage = reason;
        await transaction.save({ session });

        // Handle specific transaction types
        const handlers: Record<string, (session: mongoose.ClientSession) => Promise<void>> = {
          'order': this.handleOrderFailure.bind(this, transaction, session),
          'advertisement': this.handleAdvertisementFailure.bind(this, transaction, session),
          'investment': this.handleInvestmentFailure.bind(this, transaction, session)
        };

        if (transaction.type && handlers[transaction.type]) {
          await handlers[transaction.type](session);
        } else {
          logger.info(`No specific failure handling for type: ${transaction.type}`);
        }

        logger.info(`Failed payment processed for transaction ${transaction._id}`);
        return { success: true };
      } catch (error) {
        logger.error('Error processing failed payment:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }

  /**
   * Handle order failure - cancel orders
   */
  private async handleOrderFailure(
    transaction: TransactionDocument,
    session: mongoose.ClientSession
  ): Promise<void> {
    const orderIds = transaction.metadata?.orders || [];

    for (const orderId of orderIds) {
      await Order.findByIdAndUpdate(
        orderId,
        {
          status: 'cancelled',
          isPaid: false
        },
        { session }
      );
    }

    logger.info(`Orders ${orderIds} cancelled due to payment failure`);
  }

  /**
   * Handle advertisement failure - revert to pending
   */
  private async handleAdvertisementFailure(
    transaction: TransactionDocument,
    session: mongoose.ClientSession
  ): Promise<void> {
    if (transaction.metadata?.adId) {
      await Advertisement.findByIdAndUpdate(
        transaction.metadata.adId,
        {
          paymentStatus: 'pending',
          isActive: false
        },
        { session }
      );
      logger.info(`Advertisement ${transaction.metadata.adId} payment failed`);
    }
  }

  /**
   * Handle investment failure - cancel investment
   */
  private async handleInvestmentFailure(
    transaction: TransactionDocument,
    session: mongoose.ClientSession
  ): Promise<void> {
    if (transaction.metadata?.investmentId) {
      await Investment.findByIdAndUpdate(
        transaction.metadata.investmentId,
        { status: 'cancelled' },
        { session }
      );
      logger.info(`Investment ${transaction.metadata.investmentId} cancelled due to payment failure`);
    }
  }
}