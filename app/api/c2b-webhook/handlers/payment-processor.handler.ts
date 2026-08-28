// // app/api/callback/handlers/payment-processor.handler.ts

// import { TransactionDocument, PaymentResult } from '../types';
// import { OrderPaymentService } from '../services/order.service';
// import { MembershipPaymentService } from '../services/membership.service';
// import { SavingsPaymentService } from '../services/savings.service';
// import { InvestmentPaymentService } from '../services/investment.service';
// import { AdvertisementPaymentService } from '../services/advertisement.service';
// import { SubscriptionPaymentService } from '../services/subscription.service';
// import { FailedPaymentService } from '../services/failed-payment.service';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('PaymentProcessor');

// /**
//  * Payment processor that routes to the appropriate service based on transaction type
//  */
// export class PaymentProcessor {
//   private orderService: OrderPaymentService;
//   private membershipService: MembershipPaymentService;
//   private savingsService: SavingsPaymentService;
//   private investmentService: InvestmentPaymentService;
//   private advertisementService: AdvertisementPaymentService;
//   private subscriptionService: SubscriptionPaymentService;
//   private failedService: FailedPaymentService;

//   constructor() {
//     this.orderService = new OrderPaymentService();
//     this.membershipService = new MembershipPaymentService();
//     this.savingsService = new SavingsPaymentService();
//     this.investmentService = new InvestmentPaymentService();
//     this.advertisementService = new AdvertisementPaymentService();
//     this.subscriptionService = new SubscriptionPaymentService();
//     this.failedService = new FailedPaymentService();
//   }

//   /**
//    * Process a successful payment
//    */
//   async processSuccess(
//     transaction: TransactionDocument,
//     receiptNumber: string,
//     amount?: number,
//     phoneNumber?: string
//   ): Promise<PaymentResult> {
//     const type = transaction.type;
//     logger.info(`Processing successful ${type} payment for transaction ${transaction._id}`);

//     const handlers: Record<string, () => Promise<PaymentResult>> = {
//       'order': () => this.orderService.processPayment(
//         transaction,
//         receiptNumber,
//         amount || transaction.amount,
//         phoneNumber || transaction.phoneNumber
//       ),
//       'membership': () => this.membershipService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'savings': () => this.savingsService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'investment': () => this.investmentService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'advertisement': () => this.advertisementService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'subscription': () => this.subscriptionService.processPayment(
//         transaction,
//         receiptNumber
//       )
//     };

//     const handler = handlers[type];
//     if (handler) {
//       return await handler();
//     }

//     // Default handling for unknown types
//     logger.warn(`Unknown transaction type: ${type}, using default handling`);
//     transaction.status = 'success';
//     transaction.receiptNumber = receiptNumber;
//     await transaction.save();
//     return { success: true };
//   }

//   /**
//    * Process a failed payment
//    */
//   async processFailure(
//     transaction: TransactionDocument,
//     reason: string
//   ): Promise<PaymentResult> {
//     logger.warn(`Processing failed ${transaction.type} payment: ${reason}`);
//     return await this.failedService.processPayment(transaction, reason);
//   }
// }


// app/api/callback/handlers/payment-processor.handler.ts

// import { TransactionDocument, PaymentResult } from '../types';
// import { OrderPaymentService } from '../services/order.service';
// import { MembershipPaymentService } from '../services/membership.service';
// import { SavingsPaymentService } from '../services/savings.service';
// import { InvestmentPaymentService } from '../services/investment.service';
// import { AdvertisementPaymentService } from '../services/advertisement.service';
// import { SubscriptionPaymentService } from '../services/subscription.service';
// import { FailedPaymentService } from '../services/failed-payment.service';

// import { createLogger } from '../utils/logger';
// import { PettyCashPaymentService } from '../services/petty-cash.service';

// const logger = createLogger('PaymentProcessor');

// /**
//  * Payment processor that routes to the appropriate service based on transaction type
//  */
// export class PaymentProcessor {
//   private orderService: OrderPaymentService;
//   private membershipService: MembershipPaymentService;
//   private savingsService: SavingsPaymentService;
//   private investmentService: InvestmentPaymentService;
//   private advertisementService: AdvertisementPaymentService;
//   private subscriptionService: SubscriptionPaymentService;
//   private failedService: FailedPaymentService;
//   private pettyCashService: PettyCashPaymentService;

//   constructor() {
//     this.orderService = new OrderPaymentService();
//     this.membershipService = new MembershipPaymentService();
//     this.savingsService = new SavingsPaymentService();
//     this.investmentService = new InvestmentPaymentService();
//     this.advertisementService = new AdvertisementPaymentService();
//     this.subscriptionService = new SubscriptionPaymentService();
//     this.failedService = new FailedPaymentService();
//     this.pettyCashService = new PettyCashPaymentService();
//   }

//   /**
//    * Process a successful payment
//    */
//   async processSuccess(
//     transaction: TransactionDocument,
//     receiptNumber: string,
//     amount?: number,
//     phoneNumber?: string
//   ): Promise<PaymentResult> {
//     const type = transaction.type;
//     logger.info(`Processing successful ${type} payment for transaction ${transaction._id}`);

//     const handlers: Record<string, () => Promise<PaymentResult>> = {
//       'order': () => this.orderService.processPayment(
//         transaction,
//         receiptNumber,
//         amount || transaction.amount,
//         phoneNumber || transaction.phoneNumber
//       ),
//       'membership': () => this.membershipService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'savings': () => this.savingsService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'investment': () => this.investmentService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'advertisement': () => this.advertisementService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'subscription': () => this.subscriptionService.processPayment(
//         transaction,
//         receiptNumber
//       ),
//       'petty_cash_deposit': () => this.pettyCashService.processDeposit(
//         transaction,
//         receiptNumber,
//         amount || transaction.amount,
//         phoneNumber || transaction.phoneNumber
//       ),
//       'petty_cash_payout': () => this.pettyCashService.processPayout(
//         transaction,
//         receiptNumber,
//         amount || transaction.amount,
//         phoneNumber || transaction.phoneNumber
//       )
//     };

//     const handler = handlers[type];
//     if (handler) {
//       return await handler();
//     }

//     // Default handling for unknown types
//     logger.warn(`Unknown transaction type: ${type}, using default handling`);
//     transaction.status = 'success';
//     transaction.receiptNumber = receiptNumber;
//     transaction.metadata = {
//       ...transaction.metadata,
//       processedAt: new Date().toISOString(),
//       receiptNumber: receiptNumber
//     };
//     await transaction.save();
//     return { success: true, message: 'Transaction processed successfully' };
//   }

//   /**
//    * Process a failed payment
//    */
//   async processFailure(
//     transaction: TransactionDocument,
//     reason: string
//   ): Promise<PaymentResult> {
//     logger.warn(`Processing failed ${transaction.type} payment: ${reason}`);
    
//     // Check if it's a Petty Cash transaction
//     if (transaction.type === 'petty_cash_deposit' || transaction.type === 'petty_cash_payout') {
//       return await this.pettyCashService.processFailure(transaction, reason);
//     }
    
//     return await this.failedService.processPayment(transaction, reason);
//   }
// }


// app/api/callback/handlers/payment-processor.handler.ts

import { TransactionDocument, PaymentResult } from '../types';
import { OrderPaymentService } from '../services/order.service';
import { MembershipPaymentService } from '../services/membership.service';
import { SavingsPaymentService } from '../services/savings.service';
import { InvestmentPaymentService } from '../services/investment.service';
import { AdvertisementPaymentService } from '../services/advertisement.service';
import { SubscriptionPaymentService } from '../services/subscription.service';
import { FailedPaymentService } from '../services/failed-payment.service';
import { PettyCashPaymentService } from '../services/petty-cash.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('PaymentProcessor');

/**
 * Payment processor that routes to the appropriate service based on transaction category
 */
export class PaymentProcessor {
  private orderService: OrderPaymentService;
  private membershipService: MembershipPaymentService;
  private savingsService: SavingsPaymentService;
  private investmentService: InvestmentPaymentService;
  private advertisementService: AdvertisementPaymentService;
  private subscriptionService: SubscriptionPaymentService;
  private failedService: FailedPaymentService;
  private pettyCashService: PettyCashPaymentService;

  constructor() {
    this.orderService = new OrderPaymentService();
    this.membershipService = new MembershipPaymentService();
    this.savingsService = new SavingsPaymentService();
    this.investmentService = new InvestmentPaymentService();
    this.advertisementService = new AdvertisementPaymentService();
    this.subscriptionService = new SubscriptionPaymentService();
    this.failedService = new FailedPaymentService();
    this.pettyCashService = new PettyCashPaymentService();
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
    const category = transaction.category;
    const type = transaction.type;
    
    logger.info(`Processing successful ${category} (${type}) payment for transaction ${transaction._id}`);

    const transactionAmount = amount ?? transaction.amount;
    const transactionPhone = phoneNumber || transaction.phoneNumber || '';

    // Route by category (business purpose), not type (financial direction)
    const handlers: Record<string, () => Promise<PaymentResult>> = {
      'order': () => this.orderService.processPayment(
        transaction,
        receiptNumber,
        transactionAmount,
        transactionPhone
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
      ),
      'petty_cash': () => {
        // Petty cash uses type to distinguish deposit vs payout
        if (type === 'payout') {
          return this.pettyCashService.processPayout(
            transaction,
            receiptNumber,
            transactionAmount,
            transactionPhone
          );
        }
        // Default to deposit for 'deposit' type or any other type
        return this.pettyCashService.processDeposit(
          transaction,
          receiptNumber,
          transactionAmount,
          transactionPhone
        );
      }
    };

    const handler = handlers[category];
    if (handler) {
      return await handler();
    }

    // Default handling for unknown categories
    logger.warn(`Unknown transaction category: ${category}, using default handling`);
    
    // Ensure metadata exists before spreading
    const currentMetadata = transaction.metadata || {};
    
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    transaction.metadata = {
      ...currentMetadata,
      processedAt: new Date().toISOString(),
      receiptNumber: receiptNumber
    };
    await transaction.save();
    
    return { success: true, message: 'Transaction processed successfully' };
  }

  /**
   * Process a failed payment
   */
  async processFailure(
    transaction: TransactionDocument,
    reason: string
  ): Promise<PaymentResult> {
    logger.warn(`Processing failed ${transaction.category} payment: ${reason}`);
    
    // Check if it's a Petty Cash transaction by category
    if (transaction.category === 'petty_cash') {
      return await this.pettyCashService.processFailure(transaction, reason);
    }
    
    return await this.failedService.processPayment(transaction, reason);
  }
}