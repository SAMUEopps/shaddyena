// app/api/callback/services/savings.service.ts

import mongoose from 'mongoose';
import User from '@/shd-models/models/User';
import Savings from '@/shd-models/models/Savings';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { generateReference } from '../utils/helpers';
import { createLogger } from '../utils/logger';

const logger = createLogger('SavingsPaymentService');

/**
 * Service for processing savings deposit payments
 */
export class SavingsPaymentService extends BasePaymentService {
  /**
   * Process savings deposit payment
   */
  async processPayment(
    transaction: TransactionDocument,
    receiptNumber: string
  ): Promise<PaymentResult> {
    return this.executeTransaction(async (session) => {
      try {
        // Update transaction
        await this.markTransactionSuccess(transaction, receiptNumber, {}, session);

        const user = await User.findById(transaction.userId).session(session);

        if (!user) {
          throw new Error('User not found');
        }

        if (!user.isMember) {
          throw new Error('User must be a member to save');
        }

        const description = transaction.metadata?.description || 'Savings deposit';
        const reference = generateReference('SAV');

        // Create savings record
        await Savings.create([{
          userId: user._id,
          amount: transaction.amount,
          type: 'deposit',
          description,
          status: 'completed',
          reference,
          transactionId: transaction._id
        }], { session });

        // Update user balance
        user.totalSavings = (user.totalSavings || 0) + transaction.amount;
        user.availableBalance = (user.availableBalance || 0) + transaction.amount;
        await user.save({ session });

        logger.info(`Savings deposit of ${transaction.amount} for user ${user.name}`);
        return { success: true, data: { user: user._id } };
      } catch (error) {
        logger.error('Error processing savings payment:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }
}