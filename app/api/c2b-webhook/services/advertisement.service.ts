// app/api/callback/services/advertisement.service.ts

import mongoose from 'mongoose';
import Advertisement from '@/shd-models/models/Advertisement';
import { TransactionDocument, PaymentResult } from '../types';
import { BasePaymentService } from './payment.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('AdvertisementPaymentService');

/**
 * Service for processing advertisement payments
 */
export class AdvertisementPaymentService extends BasePaymentService {
  /**
   * Process advertisement payment
   */
  async processPayment(
    transaction: TransactionDocument,
    receiptNumber: string
  ): Promise<PaymentResult> {
    return this.executeTransaction(async (session) => {
      try {
        // Update transaction
        await this.markTransactionSuccess(transaction, receiptNumber, {}, session);

        const adId = transaction.metadata?.adId;

        if (!adId) {
          throw new Error('Advertisement ID not found');
        }

        const advertisement = await Advertisement.findById(adId).session(session);

        if (!advertisement) {
          throw new Error('Advertisement not found');
        }

        // Prevent duplicate processing
        if (advertisement.paymentStatus === 'paid') {
          logger.warn(`Advertisement ${adId} already paid`);
          return { success: true, message: 'Advertisement already paid' };
        }

        advertisement.paymentStatus = 'paid';
        advertisement.isActive = true;
        await advertisement.save({ session });

        logger.info(`Advertisement ${adId} payment confirmed`);
        return { success: true, data: { advertisement: adId } };
      } catch (error) {
        logger.error('Error processing advertisement payment:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }
}