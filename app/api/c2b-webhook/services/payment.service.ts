// app/api/callback/services/payment.service.ts

import mongoose from 'mongoose';
import { TransactionDocument, PaymentResult } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('PaymentService');

/**
 * Base service for handling payment processing
 * Provides common functionality for all payment types
 */
export abstract class BasePaymentService {
  protected session: mongoose.ClientSession | null = null;

  /**
   * Start a new MongoDB transaction session
   */
  protected async startSession(): Promise<mongoose.ClientSession> {
    if (!this.session) {
      this.session = await mongoose.startSession();
      this.session.startTransaction();
    }
    return this.session;
  }

  /**
   * Commit the current transaction
   */
  protected async commitTransaction(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction();
    }
  }

  /**
   * Abort the current transaction
   */
  protected async abortTransaction(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction();
    }
  }

  /**
   * End the current session
   */
  protected async endSession(): Promise<void> {
    if (this.session) {
      await this.session.endSession();
      this.session = null;
    }
  }

  /**
   * Execute a transaction with automatic error handling
   */
  protected async executeTransaction<T>(
    callback: (session: mongoose.ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await this.startSession();
    
    try {
      const result = await callback(session);
      await this.commitTransaction();
      return result;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  /**
   * Update transaction status to success
   */
  protected async markTransactionSuccess(
    transaction: TransactionDocument,
    receiptNumber: string,
    metadata?: Record<string, any>,
    session?: mongoose.ClientSession
  ): Promise<void> {
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    if (metadata) {
      transaction.metadata = {
        ...transaction.metadata,
        ...metadata,
        mpesaReceipt: receiptNumber
      };
    }
    await transaction.save({ session });
    logger.info(`Transaction ${transaction._id} marked as success`, { receiptNumber });
  }

  /**
   * Update transaction status to failed
   */
  protected async markTransactionFailed(
    transaction: TransactionDocument,
    errorMessage: string,
    session?: mongoose.ClientSession
  ): Promise<void> {
    transaction.status = 'failed';
    transaction.errorMessage = errorMessage;
    await transaction.save({ session });
    logger.warn(`Transaction ${transaction._id} marked as failed`, { errorMessage });
  }

  /**
   * Abstract method to process payment - must be implemented by child classes
   */
  abstract processPayment(
    transaction: TransactionDocument,
    receiptNumber: string,
    amount?: number,
    phoneNumber?: string
  ): Promise<PaymentResult>;
}