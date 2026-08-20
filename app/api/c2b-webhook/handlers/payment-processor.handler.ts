// app/api/callback/handlers/payment-processor.handler.ts

import { TransactionDocument, PaymentResult } from '../types';
import { OrderPaymentService } from '../services/order.service';
import { MembershipPaymentService } from '../services/membership.service';
import { SavingsPaymentService } from '../services/savings.service';
import { InvestmentPaymentService } from '../services/investment.service';
import { AdvertisementPaymentService } from '../services/advertisement.service';
import { SubscriptionPaymentService } from '../services/subscription.service';
import { FailedPaymentService } from '../services/failed-payment.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('PaymentProcessor');

/**
 * Payment processor that routes to the appropriate service based on transaction type
 */
export class PaymentProcessor {
  private orderService: OrderPaymentService;
  private membershipService: MembershipPaymentService;
  private savingsService: SavingsPaymentService;
  private investmentService: InvestmentPaymentService;
  private advertisementService: AdvertisementPaymentService;
  private subscriptionService: SubscriptionPaymentService;
  private failedService: FailedPaymentService;

  constructor() {
    this.orderService = new OrderPaymentService();
    this.membershipService = new MembershipPaymentService();
    this.savingsService = new SavingsPaymentService();
    this.investmentService = new InvestmentPaymentService();
    this.advertisementService = new AdvertisementPaymentService();
    this.subscriptionService = new SubscriptionPaymentService();
    this.failedService = new FailedPaymentService();
  }

  /**
   * Process a successful payment
   */
  async processSuccess(
    transaction: TransactionDocument,
    receiptNumber: string,
    amount?: number,
    phoneNumber?: string
  ): Promise<PaymentResult> {
    const type = transaction.type;
    logger.info(`Processing successful ${type} payment for transaction ${transaction._id}`);

    const handlers: Record<string, () => Promise<PaymentResult>> = {
      'order': () => this.orderService.processPayment(
        transaction,
        receiptNumber,
        amount || transaction.amount,
        phoneNumber || transaction.phoneNumber
      ),
      'membership': () => this.membershipService.processPayment(
        transaction,
        receiptNumber
      ),
      'savings': () => this.savingsService.processPayment(
        transaction,
        receiptNumber
      ),
      'investment': () => this.investmentService.processPayment(
        transaction,
        receiptNumber
      ),
      'advertisement': () => this.advertisementService.processPayment(
        transaction,
        receiptNumber
      ),
      'subscription': () => this.subscriptionService.processPayment(
        transaction,
        receiptNumber
      )
    };

    const handler = handlers[type];
    if (handler) {
      return await handler();
    }

    // Default handling for unknown types
    logger.warn(`Unknown transaction type: ${type}, using default handling`);
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    await transaction.save();
    return { success: true };
  }

  /**
   * Process a failed payment
   */
  async processFailure(
    transaction: TransactionDocument,
    reason: string
  ): Promise<PaymentResult> {
    logger.warn(`Processing failed ${transaction.type} payment: ${reason}`);
    return await this.failedService.processPayment(transaction, reason);
  }
}