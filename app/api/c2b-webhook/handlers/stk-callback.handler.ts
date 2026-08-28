// // app/api/callback/handlers/stk-callback.handler.ts

// import Transaction from '@/shd-models/models/Transaction';
// import { StkCallbackResponse, TransactionDocument } from '../types';
// import { PaymentProcessor } from './payment-processor.handler';
// import { extractStkMetadata } from '../utils/helpers';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('StkCallbackHandler');

// /**
//  * Handler for STK Push callbacks from M-Pesa
//  */
// export class StkCallbackHandler {
//   private paymentProcessor: PaymentProcessor;

//   constructor() {
//     this.paymentProcessor = new PaymentProcessor();
//   }

//   /**
//    * Handle STK Push callback
//    */
//   async handle(callbackData: any): Promise<boolean> {
//     const stkCallback = callbackData.Body?.stkCallback;

//     if (!stkCallback) {
//       logger.warn('No STK callback data found');
//       return false;
//     }

//     const {
//       CheckoutRequestID,
//       ResultCode,
//       ResultDesc,
//       CallbackMetadata
//     } = stkCallback as StkCallbackResponse;

//     logger.info(`Processing STK callback for: ${CheckoutRequestID}`);

//     // Find transaction
//     const transaction = await Transaction.findOne({
//       checkoutRequestId: CheckoutRequestID
//     });

//     if (!transaction) {
//       logger.error(`Transaction not found for checkout ID: ${CheckoutRequestID}`);
//       return false;
//     }

//     // Process based on result code
//     if (String(ResultCode) === '0') {
//       const metadata = extractStkMetadata(CallbackMetadata);
//       const receiptNumber = metadata.MpesaReceiptNumber;

//       logger.info(`Payment successful: ${receiptNumber}`);

//       await this.paymentProcessor.processSuccess(
//         transaction,
//         receiptNumber,
//         metadata.Amount,
//         metadata.PhoneNumber
//       );
//     } else {
//       logger.info(`Payment failed: ${ResultDesc}`);
//       await this.paymentProcessor.processFailure(transaction, ResultDesc);
//     }

//     return true;
//   }
// }


// app/api/callback/handlers/stk-callback.handler.ts
// import Transaction from '@/shd-models/models/Transaction';
// import Budget from '@/shd-models/models/Budget';
// import { StkCallbackResponse, TransactionDocument } from '../types';
// import { PaymentProcessor } from './payment-processor.handler';
// import { extractStkMetadata } from '../utils/helpers';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('StkCallbackHandler');

// /**
//  * Handler for STK Push callbacks from M-Pesa
//  */
// export class StkCallbackHandler {
//   private paymentProcessor: PaymentProcessor;

//   constructor() {
//     this.paymentProcessor = new PaymentProcessor();
//   }

//   /**
//    * Handle STK Push callback
//    */
//   async handle(callbackData: any): Promise<boolean> {
//     const stkCallback = callbackData.Body?.stkCallback;

//     if (!stkCallback) {
//       logger.warn('No STK callback data found');
//       return false;
//     }

//     const {
//       CheckoutRequestID,
//       ResultCode,
//       ResultDesc,
//       CallbackMetadata
//     } = stkCallback as StkCallbackResponse;

//     logger.info(`Processing STK callback for: ${CheckoutRequestID}`);

//     // Find transaction
//     const transaction = await Transaction.findOne({
//       checkoutRequestId: CheckoutRequestID
//     });

//     if (!transaction) {
//       logger.error(`Transaction not found for checkout ID: ${CheckoutRequestID}`);
//       return false;
//     }

//     logger.info(`Found transaction: ${transaction._id}, Type: ${transaction.type}`);

//     // Process based on result code
//     if (String(ResultCode) === '0') {
//       const metadata = extractStkMetadata(CallbackMetadata);
//       const receiptNumber = metadata.MpesaReceiptNumber;

//       logger.info(`Payment successful: ${receiptNumber}`);

//       // Check if this is a Petty Cash deposit
//       if (transaction.type === 'petty_cash_deposit') {
//         return await this.handlePettyCashDepositSuccess(
//           transaction,
//           receiptNumber,
//           metadata,
//           ResultDesc
//         );
//       } else {
//         // Handle other transaction types (orders, membership, etc.)
//         await this.paymentProcessor.processSuccess(
//           transaction,
//           receiptNumber,
//           metadata.Amount,
//           metadata.PhoneNumber
//         );
//       }
//     } else {
//       logger.info(`Payment failed: ${ResultDesc}`);
      
//       // Check if this is a Petty Cash deposit
//       if (transaction.type === 'petty_cash_deposit') {
//         return await this.handlePettyCashDepositFailure(
//           transaction,
//           ResultDesc,
//           String(ResultCode)
//         );
//       } else {
//         await this.paymentProcessor.processFailure(transaction, ResultDesc);
//       }
//     }

//     return true;
//   }

//   /**
//    * Handle successful Petty Cash deposit
//    */
//   private async handlePettyCashDepositSuccess(
//     transaction: any,
//     receiptNumber: string,
//     metadata: any,
//     resultDesc: string
//   ): Promise<boolean> {
//     try {
//       // Extract data from metadata
//       const amount = metadata.Amount || transaction.amount;
//       const phoneNumber = metadata.PhoneNumber || transaction.phoneNumber;

//       logger.info(`Processing Petty Cash deposit success: ${transaction.transactionId}`);

//       // Update transaction
//       transaction.status = 'success';
//       transaction.receiptNumber = receiptNumber;
//       transaction.metadata = {
//         ...transaction.metadata,
//         mpesaReceipt: receiptNumber,
//         transactionDate: new Date().toISOString(),
//         callbackAmount: amount,
//         callbackPhone: phoneNumber,
//         stkCallback: {
//           resultCode: '0',
//           resultDesc: resultDesc,
//           metadata: metadata
//         },
//         depositedAt: new Date().toISOString()
//       };
//       await transaction.save();

//       logger.info(`Petty Cash transaction updated: ${transaction.transactionId}, Receipt: ${receiptNumber}`);

//       // Update budget if budgetId exists
//       if (transaction.budgetId) {
//         await this.updateBudgetWithDeposit(transaction.budgetId, amount, transaction);
//       }

//       // Update user balance if needed (optional)
//       await this.updateUserBalance(transaction.userId, amount, 'add');

//       return true;
//     } catch (error) {
//       logger.error('Error handling Petty Cash deposit success:', error);
//       return false;
//     }
//   }

//   /**
//    * Handle failed Petty Cash deposit
//    */
//   private async handlePettyCashDepositFailure(
//     transaction: any,
//     resultDesc: string,
//     resultCode: string
//   ): Promise<boolean> {
//     try {
//       logger.info(`Processing Petty Cash deposit failure: ${transaction.transactionId}`);

//       // Update transaction as failed
//       transaction.status = 'failed';
//       transaction.errorMessage = resultDesc || 'Payment failed';
//       transaction.metadata = {
//         ...transaction.metadata,
//         stkCallback: {
//           resultCode: resultCode,
//           resultDesc: resultDesc,
//           failedAt: new Date().toISOString()
//         }
//       };
//       await transaction.save();

//       logger.error(`Petty Cash deposit failed: ${transaction.transactionId}, Reason: ${resultDesc}`);
//       return false;
//     } catch (error) {
//       logger.error('Error handling Petty Cash deposit failure:', error);
//       return false;
//     }
//   }

//   /**
//    * Update budget with deposit amount
//    */
//   private async updateBudgetWithDeposit(
//     budgetId: any,
//     amount: number,
//     transaction: any
//   ): Promise<void> {
//     try {
//       const budget = await Budget.findById(budgetId);
      
//       if (!budget) {
//         logger.warn(`Budget ${budgetId} not found for deposit ${transaction.transactionId}`);
//         return;
//       }

//       if (budget.status !== 'active') {
//         logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
//         return;
//       }

//       // Add the deposited amount to the budget
//       budget.allocatedAmount = (budget.allocatedAmount || 0) + amount;
//       budget.remainingAmount = (budget.remainingAmount || 0) + amount;
      
//       // Store deposit history in metadata
//       const depositHistory = budget.metadata?.depositHistory || [];
//       depositHistory.push({
//         amount: amount,
//         transactionId: transaction.transactionId,
//         receiptNumber: transaction.receiptNumber,
//         date: new Date().toISOString(),
//         type: 'stk_deposit'
//       });

//       budget.metadata = {
//         ...budget.metadata,
//         depositHistory: depositHistory,
//         lastDeposit: {
//           amount: amount,
//           transactionId: transaction.transactionId,
//           receiptNumber: transaction.receiptNumber,
//           date: new Date().toISOString()
//         },
//         totalDeposits: (budget.metadata?.totalDeposits || 0) + amount
//       };

//       await budget.save();
      
//       logger.info(`Budget ${budget._id} updated: +${amount} from deposit ${transaction.transactionId}`);
//       logger.info(`Budget now has allocated: ${budget.allocatedAmount}, remaining: ${budget.remainingAmount}`);
//     } catch (error) {
//       logger.error(`Failed to update budget ${budgetId}:`, error);
//       // Don't throw - we want to keep the transaction success even if budget update fails
//     }
//   }

//   /**
//    * Update user's balance (optional - if you track user balances)
//    */
//   private async updateUserBalance(
//     userId: any,
//     amount: number,
//     operation: 'add' | 'subtract'
//   ): Promise<void> {
//     try {
//       // If you have a User model with balance field, update it
//       // This is optional - implement if needed
//       // Example:
//       // const User = await import('@/shd-models/models/User');
//       // const user = await User.default.findById(userId);
//       // if (user) {
//       //   if (operation === 'add') {
//       //     user.availableBalance = (user.availableBalance || 0) + amount;
//       //   } else {
//       //     user.availableBalance = (user.availableBalance || 0) - amount;
//       //   }
//       //   await user.save();
//       // }
//       logger.info(`User ${userId} balance updated: ${operation} ${amount}`);
//     } catch (error) {
//       logger.error(`Failed to update user balance for ${userId}:`, error);
//       // Don't throw - we want to keep the transaction success even if user update fails
//     }
//   }
// }

// app/api/callback/handlers/stk-callback.handler.ts
import Transaction from '@/shd-models/models/Transaction';
import Budget from '@/shd-models/models/Budget';
import { StkCallbackResponse, TransactionDocument } from '../types';
import { PaymentProcessor } from './payment-processor.handler';
import { extractStkMetadata } from '../utils/helpers';
import { createLogger } from '../utils/logger';

const logger = createLogger('StkCallbackHandler');

/**
 * Handler for STK Push callbacks from M-Pesa
 */
export class StkCallbackHandler {
  private paymentProcessor: PaymentProcessor;

  constructor() {
    this.paymentProcessor = new PaymentProcessor();
  }

  /**
   * Handle STK Push callback
   */
  async handle(callbackData: any): Promise<boolean> {
    const stkCallback = callbackData.Body?.stkCallback;

    if (!stkCallback) {
      logger.warn('No STK callback data found');
      return false;
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback as StkCallbackResponse;

    logger.info(`Processing STK callback for: ${CheckoutRequestID}`);

    // Find transaction
    const transaction = await Transaction.findOne({
      checkoutRequestId: CheckoutRequestID
    });

    if (!transaction) {
      logger.error(`Transaction not found for checkout ID: ${CheckoutRequestID}`);
      return false;
    }

    logger.info(`Found transaction: ${transaction._id}, Category: ${transaction.category}, Type: ${transaction.type}`);

    // Process based on result code
    if (String(ResultCode) === '0') {
      const metadata = extractStkMetadata(CallbackMetadata);
      const receiptNumber = metadata.MpesaReceiptNumber;

      logger.info(`Payment successful: ${receiptNumber}`);

      // Check if this is a Petty Cash deposit
      if (transaction.category === 'petty_cash' && transaction.type === 'deposit') {
        return await this.handlePettyCashDepositSuccess(
          transaction as TransactionDocument,
          receiptNumber,
          metadata,
          ResultDesc
        );
      } else {
        // Handle other transaction types (orders, membership, etc.)
        await this.paymentProcessor.processSuccess(
          transaction as TransactionDocument,
          receiptNumber,
          metadata.Amount,
          metadata.PhoneNumber
        );
      }
    } else {
      logger.info(`Payment failed: ${ResultDesc}`);
      
      // Check if this is a Petty Cash deposit
      if (transaction.category === 'petty_cash' && transaction.type === 'deposit') {
        return await this.handlePettyCashDepositFailure(
          transaction as TransactionDocument,
          ResultDesc,
          String(ResultCode)
        );
      } else {
        await this.paymentProcessor.processFailure(transaction as TransactionDocument, ResultDesc);
      }
    }

    return true;
  }

  /**
   * Handle successful Petty Cash deposit
   */
  private async handlePettyCashDepositSuccess(
    transaction: TransactionDocument,
    receiptNumber: string,
    metadata: any,
    resultDesc: string
  ): Promise<boolean> {
    try {
      // Extract data from metadata
      const amount = metadata.Amount || transaction.amount;
      const phoneNumber = metadata.PhoneNumber || transaction.phoneNumber;

      logger.info(`Processing Petty Cash deposit success: ${transaction.transactionId}`);

      // Ensure metadata exists before spreading
      const currentMetadata = transaction.metadata || {};

      // Update transaction
      transaction.status = 'success';
      transaction.receiptNumber = receiptNumber;
      transaction.metadata = {
        ...currentMetadata,
        mpesaReceipt: receiptNumber,
        transactionDate: new Date().toISOString(),
        callbackAmount: amount,
        callbackPhone: phoneNumber,
        stkCallback: {
          resultCode: '0',
          resultDesc: resultDesc,
          metadata: metadata
        },
        depositedAt: new Date().toISOString()
      };
      await transaction.save();

      logger.info(`Petty Cash transaction updated: ${transaction.transactionId}, Receipt: ${receiptNumber}`);

      // Update budget if budgetId exists in metadata or externalEntityId
      const budgetId = currentMetadata.budgetId || transaction.externalEntityId;
      if (budgetId) {
        await this.updateBudgetWithDeposit(budgetId, amount, transaction);
      }

      // Update user balance if needed (optional)
      const userId = currentMetadata.userId;
      if (userId) {
        await this.updateUserBalance(userId, amount, 'add');
      }

      return true;
    } catch (error) {
      logger.error('Error handling Petty Cash deposit success:', error);
      return false;
    }
  }

  /**
   * Handle failed Petty Cash deposit
   */
  private async handlePettyCashDepositFailure(
    transaction: TransactionDocument,
    resultDesc: string,
    resultCode: string
  ): Promise<boolean> {
    try {
      logger.info(`Processing Petty Cash deposit failure: ${transaction.transactionId}`);

      // Ensure metadata exists before spreading
      const currentMetadata = transaction.metadata || {};

      // Update transaction as failed
      transaction.status = 'failed';
      transaction.errorMessage = resultDesc || 'Payment failed';
      transaction.metadata = {
        ...currentMetadata,
        stkCallback: {
          resultCode: resultCode,
          resultDesc: resultDesc,
          failedAt: new Date().toISOString()
        }
      };
      await transaction.save();

      logger.error(`Petty Cash deposit failed: ${transaction.transactionId}, Reason: ${resultDesc}`);
      return false;
    } catch (error) {
      logger.error('Error handling Petty Cash deposit failure:', error);
      return false;
    }
  }

  /**
   * Update budget with deposit amount
   */
  private async updateBudgetWithDeposit(
    budgetId: string,
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
      const budgetMetadata = budget.metadata || {};
      const depositHistory = budgetMetadata.depositHistory || [];
      depositHistory.push({
        amount: amount,
        transactionId: transaction.transactionId,
        receiptNumber: transaction.receiptNumber,
        date: new Date().toISOString(),
        type: 'stk_deposit'
      });

      budget.metadata = {
        ...budgetMetadata,
        depositHistory: depositHistory,
        lastDeposit: {
          amount: amount,
          transactionId: transaction.transactionId,
          receiptNumber: transaction.receiptNumber,
          date: new Date().toISOString()
        },
        totalDeposits: (budgetMetadata.totalDeposits || 0) + amount
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
   * Update user's balance (optional - if you track user balances)
   */
  private async updateUserBalance(
    userId: string,
    amount: number,
    operation: 'add' | 'subtract'
  ): Promise<void> {
    try {
      // If you have a User model with balance field, update it
      // This is optional - implement if needed
      logger.info(`User ${userId} balance updated: ${operation} ${amount}`);
    } catch (error) {
      logger.error(`Failed to update user balance for ${userId}:`, error);
      // Don't throw - we want to keep the transaction success even if user update fails
    }
  }
}