// app/api/callback/services/investment.service.ts

import mongoose from 'mongoose';
import User from '@/shd-models/models/User';
import Investment from '@/shd-models/models/Investment';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('InvestmentPaymentService');

/**
 * Service for processing investment payments
 */
export class InvestmentPaymentService extends BasePaymentService {
  /**
   * Process investment payment
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
          throw new Error('User must be a member to invest');
        }

        const investment = await Investment.findById(transaction.metadata?.investmentId).session(session);

        if (!investment) {
          throw new Error('Investment not found');
        }

        // Check sufficient balance
        if ((user.availableBalance || 0) < transaction.amount) {
          throw new Error('Insufficient balance');
        }

        // Deduct from user balance
        user.availableBalance = (user.availableBalance || 0) - transaction.amount;
        user.totalInvestments = (user.totalInvestments || 0) + transaction.amount;
        await user.save({ session });

        // Activate investment
        investment.status = 'active';
        investment.startDate = new Date();
        await investment.save({ session });

        logger.info(`Investment of ${transaction.amount} activated for user ${user.name}`);
        return { success: true, data: { user: user._id, investment: investment._id } };
      } catch (error) {
        logger.error('Error processing investment payment:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }
}