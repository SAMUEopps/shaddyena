// // app/api/callback/handlers/b2c-result.handler.ts
// import Transaction from '@/shd-models/models/Transaction';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// import Budget from '@/shd-models/models/Budget';
// import { createLogger } from '../utils/logger';
// import mongoose from 'mongoose';

// const logger = createLogger('B2CResultHandler');

// export class B2CResultHandler {
//   /**
//    * Handle B2C payment result callback
//    */
//   async handle(callbackData: any): Promise<boolean> {
//     try {
//       logger.info('=== B2C RESULT CALLBACK RECEIVED ===');
//       logger.info('Full callback data:', JSON.stringify(callbackData, null, 2));

//       const { Result } = callbackData;
      
//       if (!Result) {
//         logger.error('No Result object in callback');
//         return false;
//       }

//       const {
//         ResultCode,
//         ResultDesc,
//         OriginatorConversationID,
//         ConversationID,
//         TransactionID
//       } = Result;

//       logger.info(`B2C Result - ConversationID: ${ConversationID}, ResultCode: ${ResultCode}`);

//       // Find the request by OriginatorConversationID
//       const request = await ExpenseRequest.findOne({
//         'metadata.originatorConversationId': OriginatorConversationID
//       });

//       if (!request) {
//         logger.error(`No request found for OriginatorConversationID: ${OriginatorConversationID}`);
//         return false;
//       }

//       logger.info(`Found request: ${request._id}, Current status: ${request.status}`);

//       // Find the associated transaction
//       const transaction = await Transaction.findOne({
//         'metadata.requestId': request._id
//       });

//       if (ResultCode === '0' || String(ResultCode) === '0') {
//         // SUCCESS - Payment completed
//         logger.info(`✅ B2C payment successful for request ${request._id}`);

//         // Update request
//         request.status = 'paid';
//         request.paidAt = new Date();
//         request.mpesaReference = TransactionID || ConversationID;
//         request.metadata = {
//           ...request.metadata,
//           b2cResult: Result,
//           paidVia: 'M-Pesa B2C',
//           paidAt: new Date().toISOString(),
//           transactionId: TransactionID,
//           conversationId: ConversationID,
//           resultCode: ResultCode,
//           resultDesc: ResultDesc
//         };
//         await request.save();

//         // Update transaction
//         if (transaction) {
//           transaction.status = 'success';
//           transaction.receiptNumber = TransactionID || ConversationID;
//           transaction.metadata = {
//             ...transaction.metadata,
//             b2cResult: Result,
//             completedAt: new Date().toISOString(),
//             transactionId: TransactionID
//           };
//           await transaction.save();
//           logger.info(`Transaction ${transaction._id} updated to success`);
//         } else {
//           logger.warn(`No transaction found for request ${request._id}`);
//         }

//         logger.info(`✅ Request ${request._id} marked as paid`);
//         return true;

//       } else {
//         // FAILURE - Payment failed
//         logger.error(`❌ B2C payment failed for request ${request._id}: ${ResultDesc}`);

//         // Update request as failed
//         request.status = 'failed';
//         request.metadata = {
//           ...request.metadata,
//           b2cError: ResultDesc || 'B2C payment failed',
//           b2cResult: Result,
//           failedAt: new Date().toISOString(),
//           resultCode: ResultCode,
//           resultDesc: ResultDesc
//         };
//         await request.save();

//         // Update transaction
//         if (transaction) {
//           transaction.status = 'failed';
//           transaction.errorMessage = ResultDesc || 'B2C payment failed';
//           transaction.metadata = {
//             ...transaction.metadata,
//             b2cResult: Result,
//             failedAt: new Date().toISOString()
//           };
//           await transaction.save();
//         }

//         // REVERT BUDGET
//         await this.revertBudget(request);

//         logger.info(`❌ Request ${request._id} marked as failed, budget reverted`);
//         return true;
//       }

//     } catch (error) {
//       logger.error('Error processing B2C result:', error);
//       return false;
//     }
//   }

//   /**
//    * Handle B2C timeout callback
//    */
//   async handleTimeout(callbackData: any): Promise<boolean> {
//     try {
//       logger.info('=== B2C TIMEOUT CALLBACK RECEIVED ===');
//       logger.info('Timeout data:', JSON.stringify(callbackData, null, 2));

//       const { Result } = callbackData;
      
//       if (!Result) {
//         logger.error('No Result object in timeout callback');
//         return false;
//       }

//       const {
//         OriginatorConversationID,
//         ConversationID,
//         ResultDesc
//       } = Result;

//       logger.info(`B2C Timeout - ConversationID: ${ConversationID}`);

//       const request = await ExpenseRequest.findOne({
//         'metadata.originatorConversationId': OriginatorConversationID
//       });

//       if (!request) {
//         logger.error(`No request found for OriginatorConversationID: ${OriginatorConversationID}`);
//         return false;
//       }

//       // Update request as failed
//       request.status = 'failed';
//       request.metadata = {
//         ...request.metadata,
//         b2cTimeout: true,
//         b2cError: ResultDesc || 'B2C payment timeout',
//         b2cTimeoutData: Result,
//         failedAt: new Date().toISOString()
//       };
//       await request.save();

//       // Update transaction
//       const transaction = await Transaction.findOne({
//         'metadata.requestId': request._id
//       });

//       if (transaction) {
//         transaction.status = 'failed';
//         transaction.errorMessage = ResultDesc || 'B2C payment timeout';
//         transaction.metadata = {
//           ...transaction.metadata,
//           b2cTimeout: true,
//           failedAt: new Date().toISOString()
//         };
//         await transaction.save();
//       }

//       // REVERT BUDGET
//       await this.revertBudget(request);

//       logger.info(`Request ${request._id} marked as failed due to timeout, budget reverted`);
//       return true;

//     } catch (error) {
//       logger.error('Error processing B2C timeout:', error);
//       return false;
//     }
//   }

//   /**
//    * Revert budget changes if payment failed
//    */
//   private async revertBudget(request: any): Promise<void> {
//     try {
//       // Only revert if budget was updated
//       if (!request.metadata?.budgetWasUpdated) {
//         logger.info(`Budget was not updated for request ${request._id}, skipping revert`);
//         return;
//       }

//       const budget = await Budget.findOne({
//         status: 'active',
//         createdBy: request.requesterId
//       });

//       if (budget) {
//         const previousSpent = budget.spentAmount || 0;
//         const previousFees = budget.platformFees || 0;
        
//         budget.spentAmount = Math.max(0, previousSpent - request.amount);
//         budget.platformFees = Math.max(0, previousFees - request.platformFee);
//         budget.remainingAmount = budget.allocatedAmount - budget.spentAmount - budget.platformFees;
        
//         if (budget.remainingAmount >= 0) {
//           budget.status = 'active';
//         }
        
//         await budget.save();
//         logger.info(`✅ Budget ${budget._id} reverted for failed request ${request._id}`);
//         logger.info(`Budget reverted: spent ${previousSpent} → ${budget.spentAmount}, fees ${previousFees} → ${budget.platformFees}`);
//       } else {
//         logger.warn(`No active budget found for user ${request.requesterId}`);
//       }
//     } catch (error) {
//       logger.error('Error reverting budget:', error);
//     }
//   }
// }


import Transaction from '@/shd-models/models/Transaction';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Budget from '@/shd-models/models/Budget';
import { createLogger } from '../utils/logger';

const logger = createLogger('B2CResultHandler');

export class B2CResultHandler {
  /**
   * ============================================================
   * HANDLE B2C RESULT CALLBACK
   * ============================================================
   */
  async handle(callbackData: any): Promise<boolean> {
    try {
      logger.info('=== B2C RESULT CALLBACK RECEIVED ===');
      logger.info(
        'Full callback data:',
        JSON.stringify(callbackData, null, 2)
      );

      const { Result } = callbackData || {};

      if (!Result) {
        logger.error('No Result object in callback');
        return false;
      }

      const {
        ResultCode,
        ResultDesc,
        OriginatorConversationID,
        ConversationID,
        TransactionID,
        ResultParameters
      } = Result;

      logger.info(
        `B2C Result - ConversationID: ${ConversationID}, ResultCode: ${ResultCode}`
      );

      // ==========================================================
      // EXTRACT RESULT PARAMETERS
      // ==========================================================

      const parameters = ResultParameters?.ResultParameter || [];

      const getResultParameter = (key: string) => {
        const parameter = parameters.find(
          (item: any) => item?.Key === key
        );

        return parameter?.Value;
      };

      const transactionAmount = Number(
        getResultParameter('TransactionAmount') || 0
      );

      const transactionReceipt =
        getResultParameter('TransactionReceipt') ||
        TransactionID ||
        null;

      const receiverPartyPublicName =
        getResultParameter('ReceiverPartyPublicName') || null;

      const transactionCompletedDateTime =
        getResultParameter('TransactionCompletedDateTime') || null;

      const recipientIsRegistered =
        getResultParameter('B2CRecipientIsRegisteredCustomer') || null;

      logger.info(
        `B2C payment details - Amount: ${transactionAmount}, Receipt: ${transactionReceipt}`
      );

      // ==========================================================
      // FIND EXPENSE REQUEST
      // ==========================================================

      const request = await ExpenseRequest.findOne({
        'metadata.originatorConversationId': OriginatorConversationID
      });

      if (!request) {
        logger.error(
          `No request found for OriginatorConversationID: ${OriginatorConversationID}`
        );

        return false;
      }

      logger.info(
        `Found request: ${request._id}, Current status: ${request.status}`
      );

      // ==========================================================
      // FIND TRANSACTION
      // ==========================================================
      //
      // IMPORTANT:
      // metadata.requestId was stored as a STRING:
      //
      // "6a9586a2e80ba07ebd50deff"
      //
      // Therefore do NOT query with request._id directly.
      //
      // We first use request._id.toString().
      //
      // We also have fallback lookups using the M-Pesa
      // conversation identifiers.
      // ==========================================================

      const requestIdString = request._id.toString();

      let transaction = await Transaction.findOne({
        'metadata.requestId': requestIdString
      });

      // Fallback 1: OriginatorConversationID
      if (!transaction && OriginatorConversationID) {
        transaction = await Transaction.findOne({
          'metadata.originatorConversationId': OriginatorConversationID
        });
      }

      // Fallback 2: ConversationID
      if (!transaction && ConversationID) {
        transaction = await Transaction.findOne({
          providerTransactionId: ConversationID
        });
      }

      if (!transaction) {
        logger.error(
          `No transaction found for request ${requestIdString}`
        );

        return false;
      }

      logger.info(
        `Found transaction: ${transaction._id}, Current status: ${transaction.status}`
      );

      // ==========================================================
      // SUCCESS
      // ==========================================================

      if (String(ResultCode) === '0') {
        logger.info(
          `✅ B2C payment successful for request ${request._id}`
        );

        // --------------------------------------------------------
        // IDEMPOTENCY
        // --------------------------------------------------------
        //
        // Safaricom/webhook infrastructure can potentially deliver
        // the same callback more than once.
        //
        // Never process an already successful transaction again.
        // --------------------------------------------------------

        if (transaction.status === 'success') {
          logger.info(
            `Transaction ${transaction.transactionId} is already successful.`
          );

          return true;
        }

        // ========================================================
        // UPDATE TRANSACTION
        // ========================================================

        transaction.status = 'success';

        // Actual M-Pesa receipt
        transaction.providerTransactionId =
          TransactionID || transaction.providerTransactionId;

        transaction.receiptNumber =
          transactionReceipt ||
          TransactionID ||
          transaction.receiptNumber;

        transaction.metadata = {
          ...transaction.metadata,

          b2cCompleted: true,

          b2cResult: Result,

          resultCode: ResultCode,
          resultDesc: ResultDesc,

          conversationId: ConversationID,
          originatorConversationId: OriginatorConversationID,

          mpesaTransactionId: TransactionID,
          transactionReceipt,

          transactionAmount,

          receiverPartyPublicName,
          transactionCompletedDateTime,
          recipientIsRegistered,

          completedAt: new Date().toISOString()
        };

        await transaction.save();

        logger.info(
          `✅ Transaction ${transaction.transactionId} marked SUCCESS`
        );

        logger.info(
          `M-Pesa receipt: ${transaction.receiptNumber}`
        );

        // ========================================================
        // UPDATE EXPENSE REQUEST
        // ========================================================

        request.status = 'paid';
        request.paidAt = new Date();

        request.mpesaReference =
          transactionReceipt ||
          TransactionID ||
          ConversationID;

        request.metadata = {
          ...request.metadata,

          b2cCompleted: true,
          b2cResult: Result,

          paidVia: 'M-Pesa B2C',

          paidAt: new Date().toISOString(),

          transactionId: transaction.transactionId,

          mpesaTransactionId: TransactionID,

          transactionReceipt,

          conversationId: ConversationID,

          originatorConversationId: OriginatorConversationID,

          resultCode: ResultCode,
          resultDesc: ResultDesc,

          transactionAmount,

          receiverPartyPublicName,
          transactionCompletedDateTime,
          recipientIsRegistered
        };

        await request.save();

        logger.info(
          `✅ Expense request ${request._id} marked as PAID`
        );

        logger.info(
          JSON.stringify({
            level: 'SUCCESS',
            service: 'B2CResultHandler',
            stage: 'PAYMENT_COMPLETED',
            requestId: request._id.toString(),
            transactionId: transaction.transactionId,
            transactionMongoId: transaction.id.toString(),
            amount: transaction.amount,
            transactionStatus: transaction.status,
            requestStatus: request.status,
            mpesaTransactionId: TransactionID,
            receiptNumber: transaction.receiptNumber
          })
        );

        return true;
      }

      // ==========================================================
      // FAILURE
      // ==========================================================

      logger.error(
        `❌ B2C payment failed for request ${request._id}: ${ResultDesc}`
      );

      // ----------------------------------------------------------
      // IDEMPOTENCY
      // ----------------------------------------------------------

      if (
        transaction.status === 'failed' ||
        request.status === 'failed'
      ) {
        logger.info(
          `Request ${request._id} / transaction ${transaction.transactionId} already failed.`
        );

        return true;
      }

      // ==========================================================
      // UPDATE REQUEST
      // ==========================================================

      request.status = 'failed';

      request.metadata = {
        ...request.metadata,

        b2cCompleted: false,

        b2cError:
          ResultDesc ||
          'B2C payment failed',

        b2cResult: Result,

        failedAt: new Date().toISOString(),

        resultCode: ResultCode,
        resultDesc: ResultDesc,

        conversationId: ConversationID,
        originatorConversationId: OriginatorConversationID
      };

      await request.save();

      // ==========================================================
      // UPDATE TRANSACTION
      // ==========================================================

      transaction.status = 'failed';

      transaction.errorMessage =
        ResultDesc ||
        'B2C payment failed';

      transaction.metadata = {
        ...transaction.metadata,

        b2cCompleted: false,

        b2cResult: Result,

        failedAt: new Date().toISOString(),

        resultCode: ResultCode,
        resultDesc: ResultDesc,

        conversationId: ConversationID,
        originatorConversationId: OriginatorConversationID
      };

      await transaction.save();

      // ==========================================================
      // REVERT BUDGET
      // ==========================================================

      await this.revertBudget(request);

      logger.info(
        `❌ Request ${request._id} marked as failed, budget reverted`
      );

      return true;

    } catch (error) {
      logger.error(
        'Error processing B2C result:',
        error
      );

      return false;
    }
  }

  /**
   * ============================================================
   * HANDLE B2C TIMEOUT CALLBACK
   * ============================================================
   */
  async handleTimeout(callbackData: any): Promise<boolean> {
    try {
      logger.info('=== B2C TIMEOUT CALLBACK RECEIVED ===');

      logger.info(
        'Timeout data:',
        JSON.stringify(callbackData, null, 2)
      );

      const { Result } = callbackData || {};

      if (!Result) {
        logger.error(
          'No Result object in timeout callback'
        );

        return false;
      }

      const {
        OriginatorConversationID,
        ConversationID,
        ResultDesc
      } = Result;

      logger.info(
        `B2C Timeout - ConversationID: ${ConversationID}`
      );

      // ==========================================================
      // FIND REQUEST
      // ==========================================================

      const request = await ExpenseRequest.findOne({
        'metadata.originatorConversationId':
          OriginatorConversationID
      });

      if (!request) {
        logger.error(
          `No request found for OriginatorConversationID: ${OriginatorConversationID}`
        );

        return false;
      }

      // ==========================================================
      // FIND TRANSACTION
      // ==========================================================

      const requestIdString =
        request._id.toString();

      let transaction = await Transaction.findOne({
        'metadata.requestId': requestIdString
      });

      if (!transaction && ConversationID) {
        transaction = await Transaction.findOne({
          providerTransactionId: ConversationID
        });
      }

      // ==========================================================
      // IDEMPOTENCY
      // ==========================================================

      if (
        transaction?.status === 'success' ||
        request.status === 'paid'
      ) {
        logger.info(
          `Ignoring timeout because payment ${request._id} is already successful.`
        );

        return true;
      }

      // ==========================================================
      // UPDATE REQUEST
      // ==========================================================

      request.status = 'failed';

      request.metadata = {
        ...request.metadata,

        b2cTimeout: true,

        b2cError:
          ResultDesc ||
          'B2C payment timeout',

        b2cTimeoutData: Result,

        failedAt: new Date().toISOString()
      };

      await request.save();

      // ==========================================================
      // UPDATE TRANSACTION
      // ==========================================================

      if (transaction) {
        transaction.status = 'failed';

        transaction.errorMessage =
          ResultDesc ||
          'B2C payment timeout';

        transaction.metadata = {
          ...transaction.metadata,

          b2cTimeout: true,

          failedAt: new Date().toISOString(),

          timeoutData: Result
        };

        await transaction.save();
      }

      // ==========================================================
      // REVERT BUDGET
      // ==========================================================

      await this.revertBudget(request);

      logger.info(
        `Request ${request._id} marked as failed due to timeout, budget reverted`
      );

      return true;

    } catch (error) {
      logger.error(
        'Error processing B2C timeout:',
        error
      );

      return false;
    }
  }

  /**
   * ============================================================
   * REVERT BUDGET
   * ============================================================
   */
  private async revertBudget(
    request: any
  ): Promise<void> {
    try {
      // ----------------------------------------------------------
      // Prevent double reversal
      // ----------------------------------------------------------

      if (request.metadata?.budgetReverted) {
        logger.info(
          `Budget already reverted for request ${request._id}, skipping.`
        );

        return;
      }

      // ----------------------------------------------------------
      // Only revert if budget was updated
      // ----------------------------------------------------------

      if (!request.metadata?.budgetWasUpdated) {
        logger.info(
          `Budget was not updated for request ${request._id}, skipping revert`
        );

        return;
      }

      const budget = await Budget.findOne({
        status: 'active',
        createdBy: request.requesterId
      });

      if (!budget) {
        logger.warn(
          `No active budget found for user ${request.requesterId}`
        );

        return;
      }

      const previousSpent =
        budget.spentAmount || 0;

      const previousFees =
        budget.platformFees || 0;

      budget.spentAmount = Math.max(
        0,
        previousSpent - request.amount
      );

      budget.platformFees = Math.max(
        0,
        previousFees - request.platformFee
      );

      budget.remainingAmount =
        budget.allocatedAmount -
        budget.spentAmount -
        budget.platformFees;

      if (budget.remainingAmount >= 0) {
        budget.status = 'active';
      }

      await budget.save();

      // Mark the request so a duplicate callback
      // cannot revert the budget again.

      request.metadata = {
        ...request.metadata,

        budgetReverted: true,

        budgetRevertedAt:
          new Date().toISOString(),

        budgetRevertedAmount:
          request.amount,

        budgetRevertedFee:
          request.platformFee
      };

      await request.save();

      logger.info(
        `✅ Budget ${budget._id} reverted for failed request ${request._id}`
      );

      logger.info(
        `Budget reverted: spent ${previousSpent} → ${budget.spentAmount}, fees ${previousFees} → ${budget.platformFees}`
      );

    } catch (error) {
      logger.error(
        'Error reverting budget:',
        error
      );
    }
  }
}
