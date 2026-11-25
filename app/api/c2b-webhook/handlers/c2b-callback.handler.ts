// // app/api/callback/handlers/c2b-callback.handler.ts

// import Transaction from '@/shd-models/models/Transaction';
// import { C2BCallbackData, TransactionDocument } from '../types';
// import { PaymentProcessor } from './payment-processor.handler';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('C2bCallbackHandler');

// /**
//  * Handler for C2B Pay Bill callbacks from M-Pesa
//  */
// export class C2bCallbackHandler {
//   private paymentProcessor: PaymentProcessor;

//   constructor() {
//     this.paymentProcessor = new PaymentProcessor();
//   }

//   /**
//    * Handle C2B callback
//    */
//   async handle(callbackData: C2BCallbackData): Promise<boolean> {
//     logger.info('Processing C2B Pay Bill callback');

//     const {
//       TransID,
//       TransAmount,
//       BillRefNumber,
//       MSISDN,
//       BusinessShortCode,
//       FirstName,
//       LastName
//     } = callbackData;

//     logger.info(`C2B Callback: TransID: ${TransID}, BillRefNumber: ${BillRefNumber}`);

//     // Find transaction by BillRefNumber
//     let transaction = await this.findTransaction(BillRefNumber);

//     if (!transaction) {
//       logger.error(`Transaction not found for BillRefNumber: ${BillRefNumber}`);
//       return false;
//     }

//     logger.info(`Found transaction: ${transaction._id}, Type: ${transaction.type}`);

//     // Update transaction with C2B data
//     transaction.receiptNumber = TransID;
//     transaction.metadata = {
//       ...transaction.metadata,
//       mpesaReceipt: TransID,
//       transactionDate: new Date().toISOString(),
//       c2bCallback: {
//         TransactionType: callbackData.TransactionType,
//         TransID,
//         TransTime: callbackData.TransTime,
//         TransAmount,
//         BusinessShortCode,
//         BillRefNumber,
//         OrgAccountBalance: callbackData.OrgAccountBalance,
//         MSISDN,
//         FirstName,
//         LastName
//       }
//     };

//     // Process payment
//     const amount = parseFloat(TransAmount);
//     const phoneNumber = MSISDN || transaction.phoneNumber;

//     const result = await this.paymentProcessor.processSuccess(
//       transaction,
//       TransID,
//       amount,
//       phoneNumber
//     );

//     if (result.success) {
//       logger.info(`C2B ${transaction.type} payment processed successfully`);
//     } else {
//       logger.error(`Failed to process C2B ${transaction.type} payment: ${result.message}`);
//     }

//     return result.success;
//   }

//   /**
//    * Find transaction by various reference fields
//    */
//   private async findTransaction(billRefNumber: string): Promise<TransactionDocument | null> {
//     // Try by accountReference
//     let transaction = await Transaction.findOne({
//       accountReference: billRefNumber
//     });

//     // Try by metadata.accountReference
//     if (!transaction) {
//       transaction = await Transaction.findOne({
//         'metadata.accountReference': billRefNumber
//       });
//     }

//     // Try by metadata.checkoutRequestId
//     if (!transaction) {
//       transaction = await Transaction.findOne({
//         'metadata.checkoutRequestId': billRefNumber
//       });
//     }

//     return transaction;
//   }
// }


// // app/api/callback/handlers/c2b-callback.handler.ts

// import Transaction from '@/shd-models/models/Transaction';
// import { C2BCallbackData, TransactionDocument } from '../types';
// import { PaymentProcessor } from './payment-processor.handler';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('C2bCallbackHandler');

// /**
//  * Handler for C2B Pay Bill callbacks from M-Pesa
//  */
// export class C2bCallbackHandler {
//   private paymentProcessor: PaymentProcessor;

//   constructor() {
//     this.paymentProcessor = new PaymentProcessor();
//   }

//   /**
//    * Handle C2B callback
//    */
//   async handle(callbackData: C2BCallbackData): Promise<boolean> {
//     logger.info('Processing C2B Pay Bill callback');

//     const {
//       TransID,
//       TransAmount,
//       BillRefNumber,
//       MSISDN,
//       BusinessShortCode,
//       FirstName,
//       LastName
//     } = callbackData;

//     logger.info(`C2B Callback: TransID: ${TransID}, BillRefNumber: ${BillRefNumber}`);

//     // Find transaction by BillRefNumber
//     const transaction = await this.findTransaction(BillRefNumber);

//     if (!transaction) {
//       logger.error(`Transaction not found for BillRefNumber: ${BillRefNumber}`);
//       return false;
//     }

//     logger.info(`Found transaction: ${transaction._id}, Type: ${transaction.type}`);

//     // FIXED: Ensure metadata exists before spreading
//     const currentMetadata = transaction.metadata || {};

//     // Update transaction with C2B data
//     transaction.receiptNumber = TransID;
//     transaction.metadata = {
//       ...currentMetadata,
//       mpesaReceipt: TransID,
//       transactionDate: new Date().toISOString(),
//       c2bCallback: {
//         TransactionType: callbackData.TransactionType,
//         TransID,
//         TransTime: callbackData.TransTime,
//         TransAmount,
//         BusinessShortCode,
//         BillRefNumber,
//         OrgAccountBalance: callbackData.OrgAccountBalance,
//         MSISDN,
//         FirstName,
//         LastName
//       }
//     };

//     // Process payment
//     const amount = parseFloat(TransAmount);
//     const phoneNumber = MSISDN || transaction.phoneNumber || '';

//     const result = await this.paymentProcessor.processSuccess(
//       transaction,
//       TransID,
//       amount,
//       phoneNumber
//     );

//     if (result.success) {
//       logger.info(`C2B ${transaction.type} payment processed successfully`);
//     } else {
//       logger.error(`Failed to process C2B ${transaction.type} payment: ${result.message}`);
//     }

//     return result.success;
//   }

//   /**
//    * Find transaction by various reference fields
//    */
//   private async findTransaction(billRefNumber: string): Promise<TransactionDocument | null> {
//     // Try by accountReference
//     let transaction = await Transaction.findOne({
//       accountReference: billRefNumber
//     });

//     // Try by metadata.accountReference
//     if (!transaction) {
//       transaction = await Transaction.findOne({
//         'metadata.accountReference': billRefNumber
//       });
//     }

//     // Try by metadata.checkoutRequestId
//     if (!transaction) {
//       transaction = await Transaction.findOne({
//         'metadata.checkoutRequestId': billRefNumber
//       });
//     }

//     return transaction as TransactionDocument | null;
//   }
// }


// app/api/callback/handlers/c2b-callback.handler.ts
import mongoose from 'mongoose';
import Transaction from '@/shd-models/models/Transaction';
import User from '@/shd-models/models/User';
import Savings from '@/shd-models/models/Savings';
import { createLogger } from '../utils/logger';

const logger = createLogger('C2bCallbackHandler');

export class C2bCallbackHandler {
  async handle(callbackData: any): Promise<boolean> {
    const transId: string = callbackData.TransID;
    const billRef: string = callbackData.BillRefNumber;
    const transTime: string = callbackData.TransTime;

    logger.info(`C2B callback: TransID=${transId} BillRef=${billRef}`);

    if (!transId || !billRef) {
      logger.error('C2B missing TransID or BillRefNumber', callbackData);
      return false;
    }

    // Idempotency on the M-Pesa receipt
    const alreadyCredited = await Transaction.findOne({
      receiptNumber: transId,
    }).lean();
    if (alreadyCredited) {
      logger.info(`C2B receipt ${transId} already processed`);
      return true;
    }

    // Join on accountReference. Fallback to metadata for legacy rows.
    const transaction =
      (await Transaction.findOne({
        accountReference: billRef,
        status: { $in: ['pending', 'processing'] },
      })) ||
      (await Transaction.findOne({
        'metadata.accountReference': billRef,
        status: { $in: ['pending', 'processing'] },
      }));

    if (!transaction) {
      logger.error(`Transaction not found for BillRefNumber: ${billRef}`);
      return false;
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const tx = await Transaction.findById(transaction._id).session(session);
      if (!tx) throw new Error('Transaction vanished');
      if (tx.status === 'success') {
        await session.abortTransaction();
        return true;
      }

      const userId = tx.metadata?.userId;
      if (!userId) throw new Error('User ID missing from transaction metadata');

      const user = await User.findById(userId).session(session);
      if (!user) throw new Error('User not found');

      // Avoid double-credit if STK callback also inserted a Savings row
      const existing = tx.checkoutRequestId
        ? await Savings.findOne({ checkoutRequestId: tx.checkoutRequestId }).session(session)
        : null;

      if (!existing) {
        await Savings.create(
          [
            {
              userId: user._id,
              organizationId: tx.organizationId,
              amount: tx.amount,
              type: 'deposit',
              description: tx.metadata?.description || 'Savings deposit',
              status: 'completed',
              reference: `SAV-${transId}`,
              transactionId: tx._id,
              receiptNumber: transId,
              checkoutRequestId: tx.checkoutRequestId,
              metadata: {
                ...(tx.metadata || {}),
                mpesaReceipt: transId,
                source: 'c2b',
                transTime,
              },
            },
          ],
          { session }
        );

        user.totalSavings = (user.totalSavings || 0) + tx.amount;
        user.availableBalance = (user.availableBalance || 0) + tx.amount;
        await user.save({ session });
      }

      tx.status = 'success';
      tx.receiptNumber = transId;
      tx.provider = 'mpesa';
      tx.metadata = {
        ...(tx.metadata || {}),
        mpesaReceipt: transId,
        source: 'c2b',
        processedAt: new Date().toISOString(),
      };
      await tx.save({ session });

      await session.commitTransaction();
      logger.info(`C2B credited: user=${user._id} amount=${tx.amount} receipt=${transId}`);
      return true;
    } catch (err: any) {
      await session.abortTransaction();
      logger.error('C2B processing failed', err);
      return false;
    } finally {
      session.endSession();
    }
  }
}