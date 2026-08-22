// app/api/callback/handlers/b2c-result.handler.ts
import Transaction from '@/shd-models/models/Transaction';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Budget from '@/shd-models/models/Budget';
import { createLogger } from '../utils/logger';
import mongoose from 'mongoose';

const logger = createLogger('B2CResultHandler');

export class B2CResultHandler {
  /**
   * Handle B2C payment result callback
   */
  async handle(callbackData: any): Promise<boolean> {
    try {
      const { Result } = callbackData;
      const {
        ResultCode,
        ResultDesc,
        OriginatorConversationID,
        ConversationID,
        TransactionID,
        ResultParameters
      } = Result;

      logger.info(`Processing B2C result: ${ConversationID}, ResultCode: ${ResultCode}`);

      // Extract the OriginatorConversationID to find the request
      const originatorConvId = OriginatorConversationID || ConversationID;
      
      // Find the expense request by the originator conversation ID
      const request = await ExpenseRequest.findOne({
        'metadata.originatorConversationId': originatorConvId
      });

      if (!request) {
        // Try to find by transaction ID
        const transaction = await Transaction.findOne({
          'metadata.b2cResult.OriginatorConversationID': originatorConvId
        });

        if (!transaction) {
          logger.error(`No transaction found for OriginatorConversationID: ${originatorConvId}`);
          return false;
        }

        // Find the request by transaction reference
        const requestByTransaction = await ExpenseRequest.findOne({
          _id: transaction.metadata?.requestId
        });

        if (!requestByTransaction) {
          logger.error(`No request found for transaction: ${transaction._id}`);
          return false;
        }

        await this.processResult(requestByTransaction, Result);
        return true;
      }

      await this.processResult(request, Result);
      return true;

    } catch (error) {
      logger.error('Error processing B2C result:', error);
      return false;
    }
  }

  /**
   * Process B2C timeout callback
   */
  async handleTimeout(callbackData: any): Promise<boolean> {
    try {
      const { Result } = callbackData;
      const {
        OriginatorConversationID,
        ConversationID,
        ResultDesc
      } = Result;

      logger.info(`Processing B2C timeout: ${ConversationID}`);

      const request = await ExpenseRequest.findOne({
        'metadata.originatorConversationId': OriginatorConversationID
      });

      if (!request) {
        logger.error(`No request found for OriginatorConversationID: ${OriginatorConversationID}`);
        return false;
      }

      // Update request as failed
      request.status = 'failed';
      request.metadata = {
        ...request.metadata,
        b2cTimeout: true,
        b2cError: ResultDesc || 'B2C payment timeout',
        b2cTimeoutData: Result
      };
      await request.save();

      logger.info(`Request ${request._id} marked as failed due to timeout`);
      return true;

    } catch (error) {
      logger.error('Error processing B2C timeout:', error);
      return false;
    }
  }

  /**
   * Process the result for a specific request
   */
  private async processResult(request: any, result: any): Promise<void> {
    const {
      ResultCode,
      ResultDesc,
      TransactionID,
      OriginatorConversationID,
      ConversationID
    } = result;

    if (ResultCode === '0' || ResultCode === '0') {
      // B2C was successful
      logger.info(`B2C payment successful for request ${request._id}`);

      // Update request
      request.status = 'paid';
      request.paidAt = new Date();
      request.mpesaReference = TransactionID || ConversationID;
      request.metadata = {
        ...request.metadata,
        b2cResult: result,
        paidVia: 'M-Pesa B2C',
        paidAt: new Date().toISOString(),
        conversationId: ConversationID,
        transactionId: TransactionID
      };
      await request.save();

      // Update the associated transaction
      const transaction = await Transaction.findOne({
        'metadata.requestId': request._id
      });

      if (transaction) {
        transaction.status = 'success';
        transaction.receiptNumber = TransactionID || ConversationID;
        transaction.metadata = {
          ...transaction.metadata,
          b2cResult: result,
          completedAt: new Date().toISOString()
        };
        await transaction.save();
      }

      logger.info(`Request ${request._id} marked as paid`);

    } else {
      // B2C failed
      logger.error(`B2C payment failed for request ${request._id}: ${ResultDesc}`);

      // Update request as failed
      request.status = 'failed';
      request.metadata = {
        ...request.metadata,
        b2cError: ResultDesc || 'B2C payment failed',
        b2cResult: result,
        failedAt: new Date().toISOString()
      };
      await request.save();

      // Update the associated transaction
      const transaction = await Transaction.findOne({
        'metadata.requestId': request._id
      });

      if (transaction) {
        transaction.status = 'failed';
        transaction.errorMessage = ResultDesc || 'B2C payment failed';
        transaction.metadata = {
          ...transaction.metadata,
          b2cResult: result,
          failedAt: new Date().toISOString()
        };
        await transaction.save();
      }

      // Revert budget changes if payment failed
      await this.revertBudgetChanges(request);
    }
  }

  /**
   * Revert budget changes if payment failed
   */
  private async revertBudgetChanges(request: any): Promise<void> {
    try {
      const budget = await Budget.findOne({
        status: 'active',
        createdBy: request.requesterId
      });

      if (budget) {
        // Only revert if the request was marked as approved before
        if (request.metadata?.budgetWasUpdated) {
          budget.spentAmount = Math.max(0, (budget.spentAmount || 0) - request.amount);
          budget.platformFees = Math.max(0, (budget.platformFees || 0) - request.platformFee);
          budget.remainingAmount = budget.allocatedAmount - budget.spentAmount - budget.platformFees;
          
          if (budget.remainingAmount >= 0) {
            budget.status = 'active';
          }
          
          await budget.save();
          logger.info(`Budget ${budget._id} reverted for failed request ${request._id}`);
        }
      }
    } catch (error) {
      logger.error('Error reverting budget:', error);
    }
  }
}