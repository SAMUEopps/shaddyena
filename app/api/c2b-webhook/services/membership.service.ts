// // app/api/callback/services/membership.service.ts

// import mongoose from 'mongoose';
// import User from '@/shd-models/models/User';
// import Savings from '@/shd-models/models/Savings';
// import { TransactionDocument, PaymentResult } from '../types';
// import { BasePaymentService } from './payment.service';
// import { generateReference } from '../utils/helpers';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('MembershipPaymentService');

// /**
//  * Service for processing membership activation payments
//  */
// export class MembershipPaymentService extends BasePaymentService {
//   /**
//    * Process membership activation payment
//    */
//   async processPayment(
//     transaction: TransactionDocument,
//     receiptNumber: string
//   ): Promise<PaymentResult> {
//     return this.executeTransaction(async (session) => {
//       try {
//         const user = await User.findById(transaction.userId).session(session);

//         if (!user) {
//           throw new Error('User not found');
//         }

//         // Prevent duplicate activation
//         if (user.isMember) {
//           logger.warn(`${user.name} already activated membership`);
//           await this.markTransactionSuccess(transaction, receiptNumber, {}, session);
//           return { success: true, message: 'User already a member' };
//         }

//         // Create savings record
//         const reference = generateReference('MEM');
//         await Savings.create([{
//           userId: user._id,
//           amount: transaction.amount,
//           type: 'deposit',
//           description: 'Initial membership deposit',
//           status: 'completed',
//           reference,
//           transactionId: transaction._id
//         }], { session });

//         // Activate membership
//         user.isMember = true;
//         user.memberSince = new Date();
//         user.totalSavings = (user.totalSavings || 0) + transaction.amount;
//         user.availableBalance = (user.availableBalance || 0) + transaction.amount;
//         await user.save({ session });

//         // Update transaction
//         await this.markTransactionSuccess(transaction, receiptNumber, {
//           activatedAt: new Date()
//         }, session);

//         logger.info(`Membership activated for ${user.name}`);
//         return { success: true, data: { user: user._id } };
//       } catch (error) {
//         logger.error('Membership activation failed:', error);
//         return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
//       }
//     });
//   }
// }

// app/api/callback/services/membership.service.ts

import mongoose from 'mongoose';
import User from '@/shd-models/models/User';
import Savings from '@/shd-models/models/Savings';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { generateReference } from '../utils/helpers';
import { createLogger } from '../utils/logger';

const logger = createLogger('MembershipPaymentService');

/**
 * Service for processing membership activation payments
 */
export class MembershipPaymentService extends BasePaymentService {
  /**
   * Process membership activation payment
   */
  async processPayment(
    transaction: TransactionDocument,
    receiptNumber: string
  ): Promise<PaymentResult> {
    return this.executeTransaction(async (session) => {
      try {
        // Ensure metadata exists
        const metadata = transaction.metadata || {};

        // Get userId from metadata (not top-level)
        const userId = metadata.userId;
        if (!userId) {
          throw new Error('User ID not found in transaction metadata');
        }

        const user = await User.findById(userId).session(session);

        if (!user) {
          throw new Error('User not found');
        }

        // Prevent duplicate activation
        if (user.isMember) {
          logger.warn(`${user.name || user.email || userId} already activated membership`);
          await this.markTransactionSuccess(transaction, receiptNumber, {}, session);
          return { success: true, message: 'User already a member' };
        }

        // Create savings record
        const reference = generateReference('MEM');
        await Savings.create([{
          userId: user._id,
          amount: transaction.amount,
          type: 'deposit',
          description: 'Initial membership deposit',
          status: 'completed',
          reference,
          transactionId: transaction._id
        }], { session });

        // Activate membership
        user.isMember = true;
        user.memberSince = new Date();
        user.totalSavings = (user.totalSavings || 0) + transaction.amount;
        user.availableBalance = (user.availableBalance || 0) + transaction.amount;
        await user.save({ session });

        // Update transaction
        await this.markTransactionSuccess(transaction, receiptNumber, {
          activatedAt: new Date()
        }, session);

        logger.info(`Membership activated for ${user.name || user.email || userId}`);
        return { success: true, data: { user: user._id } };
      } catch (error) {
        logger.error('Membership activation failed:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }
}