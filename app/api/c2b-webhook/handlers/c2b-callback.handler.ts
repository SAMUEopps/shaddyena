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


// app/api/callback/handlers/c2b-callback.handler.ts

import Transaction from '@/shd-models/models/Transaction';
import { C2BCallbackData, TransactionDocument } from '../types';
import { PaymentProcessor } from './payment-processor.handler';
import { createLogger } from '../utils/logger';

const logger = createLogger('C2bCallbackHandler');

/**
 * Handler for C2B Pay Bill callbacks from M-Pesa
 */
export class C2bCallbackHandler {
  private paymentProcessor: PaymentProcessor;

  constructor() {
    this.paymentProcessor = new PaymentProcessor();
  }

  /**
   * Handle C2B callback
   */
  async handle(callbackData: C2BCallbackData): Promise<boolean> {
    logger.info('Processing C2B Pay Bill callback');

    const {
      TransID,
      TransAmount,
      BillRefNumber,
      MSISDN,
      BusinessShortCode,
      FirstName,
      LastName
    } = callbackData;

    logger.info(`C2B Callback: TransID: ${TransID}, BillRefNumber: ${BillRefNumber}`);

    // Find transaction by BillRefNumber
    const transaction = await this.findTransaction(BillRefNumber);

    if (!transaction) {
      logger.error(`Transaction not found for BillRefNumber: ${BillRefNumber}`);
      return false;
    }

    logger.info(`Found transaction: ${transaction._id}, Type: ${transaction.type}`);

    // FIXED: Ensure metadata exists before spreading
    const currentMetadata = transaction.metadata || {};

    // Update transaction with C2B data
    transaction.receiptNumber = TransID;
    transaction.metadata = {
      ...currentMetadata,
      mpesaReceipt: TransID,
      transactionDate: new Date().toISOString(),
      c2bCallback: {
        TransactionType: callbackData.TransactionType,
        TransID,
        TransTime: callbackData.TransTime,
        TransAmount,
        BusinessShortCode,
        BillRefNumber,
        OrgAccountBalance: callbackData.OrgAccountBalance,
        MSISDN,
        FirstName,
        LastName
      }
    };

    // Process payment
    const amount = parseFloat(TransAmount);
    const phoneNumber = MSISDN || transaction.phoneNumber || '';

    const result = await this.paymentProcessor.processSuccess(
      transaction,
      TransID,
      amount,
      phoneNumber
    );

    if (result.success) {
      logger.info(`C2B ${transaction.type} payment processed successfully`);
    } else {
      logger.error(`Failed to process C2B ${transaction.type} payment: ${result.message}`);
    }

    return result.success;
  }

  /**
   * Find transaction by various reference fields
   */
  private async findTransaction(billRefNumber: string): Promise<TransactionDocument | null> {
    // Try by accountReference
    let transaction = await Transaction.findOne({
      accountReference: billRefNumber
    });

    // Try by metadata.accountReference
    if (!transaction) {
      transaction = await Transaction.findOne({
        'metadata.accountReference': billRefNumber
      });
    }

    // Try by metadata.checkoutRequestId
    if (!transaction) {
      transaction = await Transaction.findOne({
        'metadata.checkoutRequestId': billRefNumber
      });
    }

    return transaction as TransactionDocument | null;
  }
}