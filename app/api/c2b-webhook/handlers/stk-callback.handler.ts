// app/api/callback/handlers/stk-callback.handler.ts

import Transaction from '@/shd-models/models/Transaction';
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

    // Process based on result code
    if (String(ResultCode) === '0') {
      const metadata = extractStkMetadata(CallbackMetadata);
      const receiptNumber = metadata.MpesaReceiptNumber;

      logger.info(`Payment successful: ${receiptNumber}`);

      await this.paymentProcessor.processSuccess(
        transaction,
        receiptNumber,
        metadata.Amount,
        metadata.PhoneNumber
      );
    } else {
      logger.info(`Payment failed: ${ResultDesc}`);
      await this.paymentProcessor.processFailure(transaction, ResultDesc);
    }

    return true;
  }
}