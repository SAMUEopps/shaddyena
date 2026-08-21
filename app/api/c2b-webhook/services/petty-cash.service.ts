// app/api/callback/services/petty-cash.service.ts


import Budget from '@/shd-models/models/Budget';
import { TransactionDocument, PaymentResult } from '../types';
import { createLogger } from '../utils/logger';
import mongoose from 'mongoose';

const logger = createLogger('PettyCashService');

export class PettyCashPaymentService {
  /**
   * Process a successful Petty Cash deposit
   */
  async processDeposit(
    transaction: TransactionDocument,
    receiptNumber: string,
    amount: number,
    phoneNumber: string
  ): Promise<PaymentResult> {
    try {
      logger.info(`Processing Petty Cash deposit: ${transaction.transactionId}`);

      // Update transaction
      transaction.status = 'success';
      transaction.receiptNumber = receiptNumber;
      transaction.metadata = {
        ...transaction.metadata,
        mpesaReceipt: receiptNumber,
        depositedAt: new Date().toISOString(),
        processedAmount: amount,
        processedPhone: phoneNumber,
        paymentMethod: 'mpesa_stk'
      };
      await transaction.save();

      // Update budget if budgetId exists
      if (transaction.budgetId) {
        await this.updateBudgetWithDeposit(
          transaction.budgetId,
          amount,
          transaction
        );
      }

      // Update user balance (optional)
      await this.updateUserBalance(
        transaction.userId,
        amount,
        'add',
        transaction.transactionId
      );

      logger.info(`Petty Cash deposit successful: ${transaction.transactionId}`);
      return {
        success: true,
        message: 'Deposit processed successfully',
        data: {
          transactionId: transaction.transactionId,
          receiptNumber: receiptNumber,
          amount: amount
        }
      };
    } catch (error: any) {
      logger.error(`Error processing Petty Cash deposit: ${error.message}`);
      return {
        success: false,
        message: error.message || 'Failed to process deposit'
      };
    }
  }

  /**
   * Process a successful Petty Cash payout
   */
  async processPayout(
    transaction: TransactionDocument,
    receiptNumber: string,
    amount: number,
    phoneNumber: string
  ): Promise<PaymentResult> {
    try {
      logger.info(`Processing Petty Cash payout: ${transaction.transactionId}`);

      // Update transaction
      transaction.status = 'success';
      transaction.receiptNumber = receiptNumber;
      transaction.metadata = {
        ...transaction.metadata,
        mpesaReceipt: receiptNumber,
        paidAt: new Date().toISOString(),
        processedAmount: amount,
        processedPhone: phoneNumber,
        paymentMethod: 'mpesa_b2c'
      };
      await transaction.save();

      // Update budget - deduct from spent amount
      if (transaction.budgetId) {
        await this.updateBudgetWithPayout(
          transaction.budgetId,
          amount,
          transaction
        );
      }

      // Update user balance (optional)
      await this.updateUserBalance(
        transaction.userId,
        amount,
        'subtract',
        transaction.transactionId
      );

      logger.info(`Petty Cash payout successful: ${transaction.transactionId}`);
      return {
        success: true,
        message: 'Payout processed successfully',
        data: {
          transactionId: transaction.transactionId,
          receiptNumber: receiptNumber,
          amount: amount
        }
      };
    } catch (error: any) {
      logger.error(`Error processing Petty Cash payout: ${error.message}`);
      return {
        success: false,
        message: error.message || 'Failed to process payout'
      };
    }
  }

  /**
   * Process a failed Petty Cash transaction
   */
  async processFailure(
    transaction: TransactionDocument,
    reason: string
  ): Promise<PaymentResult> {
    try {
      logger.info(`Processing Petty Cash failure: ${transaction.transactionId}`);

      transaction.status = 'failed';
      transaction.errorMessage = reason;
      transaction.metadata = {
        ...transaction.metadata,
        failedAt: new Date().toISOString(),
        failureReason: reason
      };
      await transaction.save();

      return {
        success: false,
        message: reason || 'Transaction failed'
      };
    } catch (error: any) {
      logger.error(`Error processing Petty Cash failure: ${error.message}`);
      return {
        success: false,
        message: error.message || 'Failed to process failure'
      };
    }
  }

  /**
   * Update budget with deposit amount
   */
  private async updateBudgetWithDeposit(
    budgetId: mongoose.Types.ObjectId | string,
    amount: number,
    transaction: TransactionDocument
  ): Promise<void> {
    try {
      const budget = await Budget.findById(budgetId);
      
      if (!budget) {
        logger.warn(`Budget ${budgetId} not found for deposit ${transaction.transactionId}`);
        return;
      }

      if (budget.status !== 'active') {
        logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
        return;
      }

      // Add the deposited amount to the budget
      budget.allocatedAmount = (budget.allocatedAmount || 0) + amount;
      budget.remainingAmount = (budget.remainingAmount || 0) + amount;
      
      // Store deposit history in metadata
      const depositHistory = budget.metadata?.depositHistory || [];
      depositHistory.push({
        amount: amount,
        transactionId: transaction.transactionId,
        receiptNumber: transaction.receiptNumber,
        date: new Date().toISOString(),
        type: 'mpesa_deposit',
        phoneNumber: transaction.phoneNumber
      });

      budget.metadata = {
        ...budget.metadata,
        depositHistory: depositHistory,
        lastDeposit: {
          amount: amount,
          transactionId: transaction.transactionId,
          receiptNumber: transaction.receiptNumber,
          date: new Date().toISOString()
        },
        totalDeposits: (budget.metadata?.totalDeposits || 0) + amount,
        lastActivity: {
          type: 'deposit',
          amount: amount,
          date: new Date().toISOString(),
          transactionId: transaction.transactionId
        }
      };

      await budget.save();
      
      logger.info(`Budget ${budget._id} updated: +${amount} from deposit ${transaction.transactionId}`);
      logger.info(`Budget now has allocated: ${budget.allocatedAmount}, remaining: ${budget.remainingAmount}`);
    } catch (error) {
      logger.error(`Failed to update budget ${budgetId}:`, error);
      // Don't throw - we want to keep the transaction success even if budget update fails
    }
  }

  /**
   * Update budget with payout amount
   */
  private async updateBudgetWithPayout(
    budgetId: mongoose.Types.ObjectId | string,
    amount: number,
    transaction: TransactionDocument
  ): Promise<void> {
    try {
      const budget = await Budget.findById(budgetId);
      
      if (!budget) {
        logger.warn(`Budget ${budgetId} not found for payout ${transaction.transactionId}`);
        return;
      }

      if (budget.status !== 'active') {
        logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
        return;
      }

      // Deduct from spent amount
      budget.spentAmount = (budget.spentAmount || 0) + amount;
      budget.remainingAmount = (budget.remainingAmount || 0) - amount;
      
      // Check if budget is overdrawn
      if (budget.remainingAmount < 0) {
        budget.status = 'overdrawn';
      }

      // Store payout history in metadata
      const payoutHistory = budget.metadata?.payoutHistory || [];
      payoutHistory.push({
        amount: amount,
        transactionId: transaction.transactionId,
        receiptNumber: transaction.receiptNumber,
        date: new Date().toISOString(),
        type: 'mpesa_payout',
        phoneNumber: transaction.phoneNumber
      });

      budget.metadata = {
        ...budget.metadata,
        payoutHistory: payoutHistory,
        lastPayout: {
          amount: amount,
          transactionId: transaction.transactionId,
          receiptNumber: transaction.receiptNumber,
          date: new Date().toISOString()
        },
        totalPayouts: (budget.metadata?.totalPayouts || 0) + amount,
        lastActivity: {
          type: 'payout',
          amount: amount,
          date: new Date().toISOString(),
          transactionId: transaction.transactionId
        }
      };

      await budget.save();
      
      logger.info(`Budget ${budget._id} updated: -${amount} from payout ${transaction.transactionId}`);
      logger.info(`Budget now has spent: ${budget.spentAmount}, remaining: ${budget.remainingAmount}`);
    } catch (error) {
      logger.error(`Failed to update budget ${budgetId}:`, error);
      // Don't throw - we want to keep the transaction success even if budget update fails
    }
  }

  /**
   * Update user's balance (optional - if you track user balances)
   */
  private async updateUserBalance(
    userId: mongoose.Types.ObjectId | string,
    amount: number,
    operation: 'add' | 'subtract',
    transactionId: string
  ): Promise<void> {
    try {
      // If you have a User model with balance field, update it
      // This is optional - implement if needed
      // Example:
      // const User = await import('@/shd-models/models/User');
      // const user = await User.default.findById(userId);
      // if (user) {
      //   if (operation === 'add') {
      //     user.availableBalance = (user.availableBalance || 0) + amount;
      //   } else {
      //     user.availableBalance = (user.availableBalance || 0) - amount;
      //   }
      //   await user.save();
      //   logger.info(`User ${userId} balance updated: ${operation} ${amount}`);
      // }
      
      // For now, just log it
      logger.info(`User ${userId} balance ${operation}: ${amount} (Transaction: ${transactionId})`);
    } catch (error) {
      logger.error(`Failed to update user balance for ${userId}:`, error);
      // Don't throw - we want to keep the transaction success even if user update fails
    }
  }
}