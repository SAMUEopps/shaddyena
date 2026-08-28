// // app/api/callback/services/petty-cash.service.ts


// import Budget from '@/shd-models/models/Budget';
// import { TransactionDocument, PaymentResult } from '../types';
// import { createLogger } from '../utils/logger';
// import mongoose from 'mongoose';

// const logger = createLogger('PettyCashService');

// export class PettyCashPaymentService {
//   /**
//    * Process a successful Petty Cash deposit
//    */
//   async processDeposit(
//     transaction: TransactionDocument,
//     receiptNumber: string,
//     amount: number,
//     phoneNumber: string
//   ): Promise<PaymentResult> {
//     try {
//       logger.info(`Processing Petty Cash deposit: ${transaction.transactionId}`);

//       // Update transaction
//       transaction.status = 'success';
//       transaction.receiptNumber = receiptNumber;
//       transaction.metadata = {
//         ...transaction.metadata,
//         mpesaReceipt: receiptNumber,
//         depositedAt: new Date().toISOString(),
//         processedAmount: amount,
//         processedPhone: phoneNumber,
//         paymentMethod: 'mpesa_stk'
//       };
//       await transaction.save();

//       // Update budget if budgetId exists
//       if (transaction.budgetId) {
//         await this.updateBudgetWithDeposit(
//           transaction.budgetId,
//           amount,
//           transaction
//         );
//       }

//       // Update user balance (optional)
//       await this.updateUserBalance(
//         transaction.userId,
//         amount,
//         'add',
//         transaction.transactionId
//       );

//       logger.info(`Petty Cash deposit successful: ${transaction.transactionId}`);
//       return {
//         success: true,
//         message: 'Deposit processed successfully',
//         data: {
//           transactionId: transaction.transactionId,
//           receiptNumber: receiptNumber,
//           amount: amount
//         }
//       };
//     } catch (error: any) {
//       logger.error(`Error processing Petty Cash deposit: ${error.message}`);
//       return {
//         success: false,
//         message: error.message || 'Failed to process deposit'
//       };
//     }
//   }

//   /**
//    * Process a successful Petty Cash payout
//    */
//   async processPayout(
//     transaction: TransactionDocument,
//     receiptNumber: string,
//     amount: number,
//     phoneNumber: string
//   ): Promise<PaymentResult> {
//     try {
//       logger.info(`Processing Petty Cash payout: ${transaction.transactionId}`);

//       // Update transaction
//       transaction.status = 'success';
//       transaction.receiptNumber = receiptNumber;
//       transaction.metadata = {
//         ...transaction.metadata,
//         mpesaReceipt: receiptNumber,
//         paidAt: new Date().toISOString(),
//         processedAmount: amount,
//         processedPhone: phoneNumber,
//         paymentMethod: 'mpesa_b2c'
//       };
//       await transaction.save();

//       // Update budget - deduct from spent amount
//       if (transaction.budgetId) {
//         await this.updateBudgetWithPayout(
//           transaction.budgetId,
//           amount,
//           transaction
//         );
//       }

//       // Update user balance (optional)
//       await this.updateUserBalance(
//         transaction.userId,
//         amount,
//         'subtract',
//         transaction.transactionId
//       );

//       logger.info(`Petty Cash payout successful: ${transaction.transactionId}`);
//       return {
//         success: true,
//         message: 'Payout processed successfully',
//         data: {
//           transactionId: transaction.transactionId,
//           receiptNumber: receiptNumber,
//           amount: amount
//         }
//       };
//     } catch (error: any) {
//       logger.error(`Error processing Petty Cash payout: ${error.message}`);
//       return {
//         success: false,
//         message: error.message || 'Failed to process payout'
//       };
//     }
//   }

//   /**
//    * Process a failed Petty Cash transaction
//    */
//   async processFailure(
//     transaction: TransactionDocument,
//     reason: string
//   ): Promise<PaymentResult> {
//     try {
//       logger.info(`Processing Petty Cash failure: ${transaction.transactionId}`);

//       transaction.status = 'failed';
//       transaction.errorMessage = reason;
//       transaction.metadata = {
//         ...transaction.metadata,
//         failedAt: new Date().toISOString(),
//         failureReason: reason
//       };
//       await transaction.save();

//       return {
//         success: false,
//         message: reason || 'Transaction failed'
//       };
//     } catch (error: any) {
//       logger.error(`Error processing Petty Cash failure: ${error.message}`);
//       return {
//         success: false,
//         message: error.message || 'Failed to process failure'
//       };
//     }
//   }

//   /**
//    * Update budget with deposit amount
//    */
//   private async updateBudgetWithDeposit(
//     budgetId: mongoose.Types.ObjectId | string,
//     amount: number,
//     transaction: TransactionDocument
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
//         type: 'mpesa_deposit',
//         phoneNumber: transaction.phoneNumber
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
//         totalDeposits: (budget.metadata?.totalDeposits || 0) + amount,
//         lastActivity: {
//           type: 'deposit',
//           amount: amount,
//           date: new Date().toISOString(),
//           transactionId: transaction.transactionId
//         }
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
//    * Update budget with payout amount
//    */
//   private async updateBudgetWithPayout(
//     budgetId: mongoose.Types.ObjectId | string,
//     amount: number,
//     transaction: TransactionDocument
//   ): Promise<void> {
//     try {
//       const budget = await Budget.findById(budgetId);
      
//       if (!budget) {
//         logger.warn(`Budget ${budgetId} not found for payout ${transaction.transactionId}`);
//         return;
//       }

//       if (budget.status !== 'active') {
//         logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
//         return;
//       }

//       // Deduct from spent amount
//       budget.spentAmount = (budget.spentAmount || 0) + amount;
//       budget.remainingAmount = (budget.remainingAmount || 0) - amount;
      
//       // Check if budget is overdrawn
//       if (budget.remainingAmount < 0) {
//         budget.status = 'overdrawn';
//       }

//       // Store payout history in metadata
//       const payoutHistory = budget.metadata?.payoutHistory || [];
//       payoutHistory.push({
//         amount: amount,
//         transactionId: transaction.transactionId,
//         receiptNumber: transaction.receiptNumber,
//         date: new Date().toISOString(),
//         type: 'mpesa_payout',
//         phoneNumber: transaction.phoneNumber
//       });

//       budget.metadata = {
//         ...budget.metadata,
//         payoutHistory: payoutHistory,
//         lastPayout: {
//           amount: amount,
//           transactionId: transaction.transactionId,
//           receiptNumber: transaction.receiptNumber,
//           date: new Date().toISOString()
//         },
//         totalPayouts: (budget.metadata?.totalPayouts || 0) + amount,
//         lastActivity: {
//           type: 'payout',
//           amount: amount,
//           date: new Date().toISOString(),
//           transactionId: transaction.transactionId
//         }
//       };

//       await budget.save();
      
//       logger.info(`Budget ${budget._id} updated: -${amount} from payout ${transaction.transactionId}`);
//       logger.info(`Budget now has spent: ${budget.spentAmount}, remaining: ${budget.remainingAmount}`);
//     } catch (error) {
//       logger.error(`Failed to update budget ${budgetId}:`, error);
//       // Don't throw - we want to keep the transaction success even if budget update fails
//     }
//   }

//   /**
//    * Update user's balance (optional - if you track user balances)
//    */
//   private async updateUserBalance(
//     userId: mongoose.Types.ObjectId | string,
//     amount: number,
//     operation: 'add' | 'subtract',
//     transactionId: string
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
//       //   logger.info(`User ${userId} balance updated: ${operation} ${amount}`);
//       // }
      
//       // For now, just log it
//       logger.info(`User ${userId} balance ${operation}: ${amount} (Transaction: ${transactionId})`);
//     } catch (error) {
//       logger.error(`Failed to update user balance for ${userId}:`, error);
//       // Don't throw - we want to keep the transaction success even if user update fails
//     }
//   }
// }


// // app/api/callback/services/petty-cash.service.ts
// import Transaction from '@/shd-models/models/Transaction';
// import Budget from '@/shd-models/models/Budget';
// import { TransactionDocument, PaymentResult } from '../types';
// import { createLogger } from '../utils/logger';
// import mongoose from 'mongoose';

// const logger = createLogger('PettyCashService');

// export class PettyCashPaymentService {
//   /**
//    * Process a successful Petty Cash deposit
//    */
//   async processDeposit(
//     transaction: TransactionDocument,
//     receiptNumber: string,
//     amount: number,
//     phoneNumber: string
//   ): Promise<PaymentResult> {
//     try {
//       logger.info(`Processing Petty Cash deposit: ${transaction.transactionId}`);
//       logger.info(`Transaction budgetId: ${transaction.budgetId}`);
//       logger.info(`Transaction metadata: ${JSON.stringify(transaction.metadata)}`);

//       // Update transaction
//       transaction.status = 'success';
//       transaction.receiptNumber = receiptNumber;
//       transaction.metadata = {
//         ...transaction.metadata,
//         mpesaReceipt: receiptNumber,
//         depositedAt: new Date().toISOString(),
//         processedAmount: amount,
//         processedPhone: phoneNumber,
//         paymentMethod: 'mpesa_stk'
//       };
//       await transaction.save();

//       // Update budget if budgetId exists
//       let budgetUpdated = false;
      
//       if (transaction.budgetId) {
//         logger.info(`Attempting to update budget: ${transaction.budgetId}`);
//         budgetUpdated = await this.updateBudgetWithDeposit(
//           transaction.budgetId,
//           amount,
//           transaction
//         );
//       } else {
//         logger.warn('No budgetId found on transaction, checking metadata...');
        
//         // Check if budgetId is in metadata
//         const metadataBudgetId = transaction.metadata?.budgetId || transaction.metadata?.budgetObjectId;
//         if (metadataBudgetId) {
//           logger.info(`Found budgetId in metadata: ${metadataBudgetId}`);
//           budgetUpdated = await this.updateBudgetWithDeposit(
//             metadataBudgetId,
//             amount,
//             transaction
//           );
//         } else {
//           // Try to find an active budget for the user
//           logger.info('No budgetId found, searching for active budget...');
//           const activeBudget = await Budget.findOne({ 
//             status: 'active',
//             createdBy: transaction.userId
//           });
          
//           if (activeBudget) {
//             logger.info(`Found active budget: ${activeBudget._id}`);
//             budgetUpdated = await this.updateBudgetWithDeposit(
//               activeBudget._id,
//               amount,
//               transaction
//             );
//           } else {
//             logger.warn('No active budget found for user');
//           }
//         }
//       }

//       // Update user balance (optional)
//       await this.updateUserBalance(
//         transaction.userId,
//         amount,
//         'add',
//         transaction.transactionId
//       );

//       logger.info(`Petty Cash deposit successful: ${transaction.transactionId}`);
//       logger.info(`Budget updated: ${budgetUpdated}`);
      
//       return {
//         success: true,
//         message: 'Deposit processed successfully',
//         data: {
//           transactionId: transaction.transactionId,
//           receiptNumber: receiptNumber,
//           amount: amount,
//           budgetUpdated: budgetUpdated
//         }
//       };
//     } catch (error: any) {
//       logger.error(`Error processing Petty Cash deposit: ${error.message}`);
//       logger.error(error.stack);
//       return {
//         success: false,
//         message: error.message || 'Failed to process deposit'
//       };
//     }
//   }

//   /**
//    * Update budget with deposit amount
//    */
//   private async updateBudgetWithDeposit(
//     budgetId: mongoose.Types.ObjectId | string,
//     amount: number,
//     transaction: TransactionDocument
//   ): Promise<boolean> {
//     try {
//       // Convert to ObjectId if string
//       const budgetObjectId = typeof budgetId === 'string' 
//         ? new mongoose.Types.ObjectId(budgetId) 
//         : budgetId;
      
//       logger.info(`Looking for budget: ${budgetObjectId}`);
      
//       const budget = await Budget.findById(budgetObjectId);
      
//       if (!budget) {
//         logger.warn(`Budget ${budgetId} not found for deposit ${transaction.transactionId}`);
//         return false;
//       }

//       logger.info(`Found budget: ${budget._id}, Status: ${budget.status}`);
//       logger.info(`Current budget - Allocated: ${budget.allocatedAmount}, Remaining: ${budget.remainingAmount}`);

//       if (budget.status !== 'active') {
//         logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
//         return false;
//       }

//       // Add the deposited amount to the budget
//       const previousAllocated = budget.allocatedAmount || 0;
//       const previousRemaining = budget.remainingAmount || 0;
      
//       budget.allocatedAmount = previousAllocated + amount;
//       budget.remainingAmount = previousRemaining + amount;
      
//       // Store deposit history in metadata
//       const depositHistory = budget.metadata?.depositHistory || [];
//       depositHistory.push({
//         amount: amount,
//         transactionId: transaction.transactionId,
//         receiptNumber: transaction.receiptNumber,
//         date: new Date().toISOString(),
//         type: 'mpesa_deposit',
//         phoneNumber: transaction.phoneNumber
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
//         totalDeposits: (budget.metadata?.totalDeposits || 0) + amount,
//         lastActivity: {
//           type: 'deposit',
//           amount: amount,
//           date: new Date().toISOString(),
//           transactionId: transaction.transactionId
//         }
//       };

//       await budget.save();
      
//       logger.info(`Budget ${budget._id} updated successfully!`);
//       logger.info(`Budget now - Allocated: ${budget.allocatedAmount} (was ${previousAllocated}), Remaining: ${budget.remainingAmount} (was ${previousRemaining})`);
      
//       return true;
//     } catch (error) {
//       logger.error(`Failed to update budget ${budgetId}:`, error);
//       logger.error("");
//       return false;
//     }
//   }

//   /**
//    * Update user's balance (optional - if you track user balances)
//    */
//   private async updateUserBalance(
//     userId: mongoose.Types.ObjectId | string,
//     amount: number,
//     operation: 'add' | 'subtract',
//     transactionId: string
//   ): Promise<void> {
//     try {
//       // If you have a User model with balance field, update it
//       // For now, just log it
//       logger.info(`User ${userId} balance ${operation}: ${amount} (Transaction: ${transactionId})`);
//     } catch (error) {
//       logger.error(`Failed to update user balance for ${userId}:`, error);
//     }
//   }

//   /**
//    * Process a failed Petty Cash transaction
//    */
//   async processFailure(
//     transaction: TransactionDocument,
//     reason: string
//   ): Promise<PaymentResult> {
//     try {
//       logger.info(`Processing Petty Cash failure: ${transaction.transactionId}`);

//       transaction.status = 'failed';
//       transaction.errorMessage = reason;
//       transaction.metadata = {
//         ...transaction.metadata,
//         failedAt: new Date().toISOString(),
//         failureReason: reason
//       };
//       await transaction.save();

//       return {
//         success: false,
//         message: reason || 'Transaction failed'
//       };
//     } catch (error: any) {
//       logger.error(`Error processing Petty Cash failure: ${error.message}`);
//       return {
//         success: false,
//         message: error.message || 'Failed to process failure'
//       };
//     }
//   }

//   /**
//    * Process a successful Petty Cash payout
//    */
//   async processPayout(
//     transaction: TransactionDocument,
//     receiptNumber: string,
//     amount: number,
//     phoneNumber: string
//   ): Promise<PaymentResult> {
//     try {
//       logger.info(`Processing Petty Cash payout: ${transaction.transactionId}`);

//       // Update transaction
//       transaction.status = 'success';
//       transaction.receiptNumber = receiptNumber;
//       transaction.metadata = {
//         ...transaction.metadata,
//         mpesaReceipt: receiptNumber,
//         paidAt: new Date().toISOString(),
//         processedAmount: amount,
//         processedPhone: phoneNumber,
//         paymentMethod: 'mpesa_b2c'
//       };
//       await transaction.save();

//       // Update budget - deduct from spent amount
//       if (transaction.budgetId) {
//         await this.updateBudgetWithPayout(
//           transaction.budgetId,
//           amount,
//           transaction
//         );
//       }

//       // Update user balance (optional)
//       await this.updateUserBalance(
//         transaction.userId,
//         amount,
//         'subtract',
//         transaction.transactionId
//       );

//       logger.info(`Petty Cash payout successful: ${transaction.transactionId}`);
//       return {
//         success: true,
//         message: 'Payout processed successfully',
//         data: {
//           transactionId: transaction.transactionId,
//           receiptNumber: receiptNumber,
//           amount: amount
//         }
//       };
//     } catch (error: any) {
//       logger.error(`Error processing Petty Cash payout: ${error.message}`);
//       return {
//         success: false,
//         message: error.message || 'Failed to process payout'
//       };
//     }
//   }

//   /**
//    * Update budget with payout amount
//    */
//   private async updateBudgetWithPayout(
//     budgetId: mongoose.Types.ObjectId | string,
//     amount: number,
//     transaction: TransactionDocument
//   ): Promise<void> {
//     try {
//       const budget = await Budget.findById(budgetId);
      
//       if (!budget) {
//         logger.warn(`Budget ${budgetId} not found for payout ${transaction.transactionId}`);
//         return;
//       }

//       if (budget.status !== 'active') {
//         logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
//         return;
//       }

//       // Deduct from spent amount
//       budget.spentAmount = (budget.spentAmount || 0) + amount;
//       budget.remainingAmount = (budget.remainingAmount || 0) - amount;
      
//       // Check if budget is overdrawn
//       if (budget.remainingAmount < 0) {
//         budget.status = 'overdrawn';
//       }

//       // Store payout history in metadata
//       const payoutHistory = budget.metadata?.payoutHistory || [];
//       payoutHistory.push({
//         amount: amount,
//         transactionId: transaction.transactionId,
//         receiptNumber: transaction.receiptNumber,
//         date: new Date().toISOString(),
//         type: 'mpesa_payout',
//         phoneNumber: transaction.phoneNumber
//       });

//       budget.metadata = {
//         ...budget.metadata,
//         payoutHistory: payoutHistory,
//         lastPayout: {
//           amount: amount,
//           transactionId: transaction.transactionId,
//           receiptNumber: transaction.receiptNumber,
//           date: new Date().toISOString()
//         },
//         totalPayouts: (budget.metadata?.totalPayouts || 0) + amount,
//         lastActivity: {
//           type: 'payout',
//           amount: amount,
//           date: new Date().toISOString(),
//           transactionId: transaction.transactionId
//         }
//       };

//       await budget.save();
      
//       logger.info(`Budget ${budget._id} updated: -${amount} from payout ${transaction.transactionId}`);
//       logger.info(`Budget now has spent: ${budget.spentAmount}, remaining: ${budget.remainingAmount}`);
//     } catch (error) {
//       logger.error(`Failed to update budget ${budgetId}:`, error);
//     }
//   }
// }



// app/api/callback/services/petty-cash.service.ts

import Transaction from '@/shd-models/models/Transaction';
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
      // Ensure metadata exists
      const metadata = transaction.metadata || {};

      logger.info(`Processing Petty Cash deposit: ${transaction.transactionId}`);
      logger.info(`Transaction metadata: ${JSON.stringify(metadata)}`);

      // Update transaction
      transaction.status = 'success';
      transaction.receiptNumber = receiptNumber;
      transaction.metadata = {
        ...metadata,
        mpesaReceipt: receiptNumber,
        depositedAt: new Date().toISOString(),
        processedAmount: amount,
        processedPhone: phoneNumber,
        paymentMethod: 'mpesa_stk'
      };
      await transaction.save();

      // Update budget if budgetId exists in metadata or externalEntityId
      let budgetUpdated = false;
      const budgetId = metadata.budgetId || metadata.budgetObjectId || transaction.externalEntityId;

      if (budgetId) {
        logger.info(`Attempting to update budget: ${budgetId}`);
        budgetUpdated = await this.updateBudgetWithDeposit(
          budgetId,
          amount,
          transaction
        );
      } else {
        logger.warn('No budgetId found in transaction metadata or externalEntityId');

        // Try to find an active budget for the user
        const userId = metadata.userId;
        if (userId) {
          logger.info(`Searching for active budget for user: ${userId}`);
          const activeBudget = await Budget.findOne({
            status: 'active',
            createdBy: userId
          });

          if (activeBudget) {
            logger.info(`Found active budget: ${activeBudget._id}`);
            budgetUpdated = await this.updateBudgetWithDeposit(
              activeBudget._id,
              amount,
              transaction
            );
          } else {
            logger.warn('No active budget found for user');
          }
        } else {
          logger.warn('No userId found in transaction metadata, cannot search for active budget');
        }
      }

      // Update user balance (optional)
      const userId = metadata.userId;
      if (userId) {
        await this.updateUserBalance(
          userId,
          amount,
          'add',
          transaction.transactionId
        );
      } else {
        logger.warn('No userId in metadata, skipping user balance update');
      }

      logger.info(`Petty Cash deposit successful: ${transaction.transactionId}`);
      logger.info(`Budget updated: ${budgetUpdated}`);

      return {
        success: true,
        message: 'Deposit processed successfully',
        data: {
          transactionId: transaction.transactionId,
          receiptNumber: receiptNumber,
          amount: amount,
          budgetUpdated: budgetUpdated
        }
      };
    } catch (error: any) {
      logger.error(`Error processing Petty Cash deposit: ${error.message}`);
      logger.error(error.stack);
      return {
        success: false,
        message: error.message || 'Failed to process deposit'
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
  ): Promise<boolean> {
    try {
      // Convert to ObjectId if string
      const budgetObjectId = typeof budgetId === 'string'
        ? new mongoose.Types.ObjectId(budgetId)
        : budgetId;

      logger.info(`Looking for budget: ${budgetObjectId}`);

      const budget = await Budget.findById(budgetObjectId);

      if (!budget) {
        logger.warn(`Budget ${budgetId} not found for deposit ${transaction.transactionId}`);
        return false;
      }

      logger.info(`Found budget: ${budget._id}, Status: ${budget.status}`);
      logger.info(`Current budget - Allocated: ${budget.allocatedAmount}, Remaining: ${budget.remainingAmount}`);

      if (budget.status !== 'active') {
        logger.warn(`Budget ${budgetId} is not active (status: ${budget.status})`);
        return false;
      }

      // Add the deposited amount to the budget
      const previousAllocated = budget.allocatedAmount || 0;
      const previousRemaining = budget.remainingAmount || 0;

      budget.allocatedAmount = previousAllocated + amount;
      budget.remainingAmount = previousRemaining + amount;

      // Store deposit history in metadata
      const budgetMetadata = budget.metadata || {};
      const depositHistory = budgetMetadata.depositHistory || [];
      depositHistory.push({
        amount: amount,
        transactionId: transaction.transactionId,
        receiptNumber: transaction.receiptNumber,
        date: new Date().toISOString(),
        type: 'mpesa_deposit',
        phoneNumber: transaction.phoneNumber
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
        totalDeposits: (budgetMetadata.totalDeposits || 0) + amount,
        lastActivity: {
          type: 'deposit',
          amount: amount,
          date: new Date().toISOString(),
          transactionId: transaction.transactionId
        }
      };

      await budget.save();

      logger.info(`Budget ${budget._id} updated successfully!`);
      logger.info(`Budget now - Allocated: ${budget.allocatedAmount} (was ${previousAllocated}), Remaining: ${budget.remainingAmount} (was ${previousRemaining})`);

      return true;
    } catch (error) {
      logger.error(`Failed to update budget ${budgetId}:`, error);
      return false;
    }
  }

  /**
   * Update user's balance (optional - if you track user balances)
   */
  private async updateUserBalance(
    userId: string,
    amount: number,
    operation: 'add' | 'subtract',
    transactionId: string
  ): Promise<void> {
    try {
      // If you have a User model with balance field, update it
      // For now, just log it
      logger.info(`User ${userId} balance ${operation}: ${amount} (Transaction: ${transactionId})`);
    } catch (error) {
      logger.error(`Failed to update user balance for ${userId}:`, error);
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

      // Ensure metadata exists
      const metadata = transaction.metadata || {};

      transaction.status = 'failed';
      transaction.errorMessage = reason;
      transaction.metadata = {
        ...metadata,
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
   * Process a successful Petty Cash payout
   */
  async processPayout(
    transaction: TransactionDocument,
    receiptNumber: string,
    amount: number,
    phoneNumber: string
  ): Promise<PaymentResult> {
    try {
      // Ensure metadata exists
      const metadata = transaction.metadata || {};

      logger.info(`Processing Petty Cash payout: ${transaction.transactionId}`);

      // Update transaction
      transaction.status = 'success';
      transaction.receiptNumber = receiptNumber;
      transaction.metadata = {
        ...metadata,
        mpesaReceipt: receiptNumber,
        paidAt: new Date().toISOString(),
        processedAmount: amount,
        processedPhone: phoneNumber,
        paymentMethod: 'mpesa_b2c'
      };
      await transaction.save();

      // Update budget - deduct from spent amount
      const budgetId = metadata.budgetId || metadata.budgetObjectId || transaction.externalEntityId;
      if (budgetId) {
        await this.updateBudgetWithPayout(
          budgetId,
          amount,
          transaction
        );
      } else {
        logger.warn('No budgetId found for payout');
      }

      // Update user balance (optional)
      const userId = metadata.userId;
      if (userId) {
        await this.updateUserBalance(
          userId,
          amount,
          'subtract',
          transaction.transactionId
        );
      } else {
        logger.warn('No userId in metadata, skipping user balance update');
      }

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
      const budgetMetadata = budget.metadata || {};
      const payoutHistory = budgetMetadata.payoutHistory || [];
      payoutHistory.push({
        amount: amount,
        transactionId: transaction.transactionId,
        receiptNumber: transaction.receiptNumber,
        date: new Date().toISOString(),
        type: 'mpesa_payout',
        phoneNumber: transaction.phoneNumber
      });

      budget.metadata = {
        ...budgetMetadata,
        payoutHistory: payoutHistory,
        lastPayout: {
          amount: amount,
          transactionId: transaction.transactionId,
          receiptNumber: transaction.receiptNumber,
          date: new Date().toISOString()
        },
        totalPayouts: (budgetMetadata.totalPayouts || 0) + amount,
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
    }
  }
}