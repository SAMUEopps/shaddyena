// // // // import mongoose, { Schema, Document } from 'mongoose';

// // // // export interface ITransaction extends Document {
// // // //   transactionId: string;
// // // //   receiptNumber: string;
// // // //   phoneNumber: string;
// // // //   amount: number;
// // // //   status: 'pending' | 'success' | 'failed' | 'cancelled';
// // // //   type: 'collection' | 'payout' | 'refund';
// // // //   orderId?: mongoose.Types.ObjectId;
// // // //   vendorId?: mongoose.Types.ObjectId;
// // // //   metadata: any;
// // // //   createdAt: Date;
// // // //   updatedAt: Date;
// // // // }

// // // // const TransactionSchema = new Schema<ITransaction>({
// // // //   transactionId: { type: String, required: true, unique: true },
// // // //   receiptNumber: { type: String },
// // // //   phoneNumber: { type: String, required: true },
// // // //   amount: { type: Number, required: true },
// // // //   status: { 
// // // //     type: String, 
// // // //     enum: ['pending', 'success', 'failed', 'cancelled'],
// // // //     default: 'pending'
// // // //   },
// // // //   type: { 
// // // //     type: String, 
// // // //     enum: ['collection', 'payout', 'refund'],
// // // //     required: true
// // // //   },
// // // //   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
// // // //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
// // // //   metadata: { type: Schema.Types.Mixed },
// // // //   createdAt: { type: Date, default: Date.now },
// // // //   updatedAt: { type: Date, default: Date.now }
// // // // });

// // // // export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// // // // shd-models/models/Transaction.ts
// // // import mongoose, { Schema, Document } from 'mongoose';

// // // export interface ITransaction extends Document {
// // //   transactionId: string;
// // //   checkoutRequestId?: string; // M-Pesa checkout request ID
// // //   receiptNumber: string;
// // //   phoneNumber: string;
// // //   amount: number;
// // //   status: 'pending' | 'success' | 'failed' | 'cancelled';
// // //   type: 'collection' | 'payout' | 'refund' | 'membership' | 'savings' | 'investment';
// // //   purpose?: 'membership' | 'savings' | 'investment' | 'order' | 'withdrawal';
// // //   orderId?: mongoose.Types.ObjectId;
// // //   vendorId?: mongoose.Types.ObjectId;
// // //   userId?: mongoose.Types.ObjectId; // Add user reference
// // //   accountReference?: string; // For tracking payments
// // //   metadata: any;
// // //   errorMessage?: string;
// // //   createdAt: Date;
// // //   updatedAt: Date;
// // // }

// // // const TransactionSchema = new Schema<ITransaction>({
// // //   transactionId: { type: String, required: true, unique: true },
// // //   checkoutRequestId: { type: String }, // For STK Push
// // //   receiptNumber: { type: String },
// // //   phoneNumber: { type: String, required: true },
// // //   amount: { type: Number, required: true },
// // //   status: { 
// // //     type: String, 
// // //     enum: ['pending', 'success', 'failed', 'cancelled'],
// // //     default: 'pending'
// // //   },
// // //   type: { 
// // //     type: String, 
// // //     enum: ['collection', 'payout', 'refund', 'membership', 'savings', 'investment'],
// // //     required: true
// // //   },
// // //   purpose: { 
// // //     type: String, 
// // //     enum: ['membership', 'savings', 'investment', 'order', 'withdrawal']
// // //   },
// // //   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
// // //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
// // //   userId: { type: Schema.Types.ObjectId, ref: 'User' },
// // //   accountReference: { type: String },
// // //   metadata: { type: Schema.Types.Mixed },
// // //   errorMessage: { type: String },
// // //   createdAt: { type: Date, default: Date.now },
// // //   updatedAt: { type: Date, default: Date.now }
// // // });

// // // // Add indexes for faster queries
// // // TransactionSchema.index({ transactionId: 1 });
// // // TransactionSchema.index({ checkoutRequestId: 1 });
// // // TransactionSchema.index({ userId: 1 });
// // // TransactionSchema.index({ accountReference: 1 });
// // // TransactionSchema.index({ status: 1 });

// // // export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// // // shd-models/models/Transaction.ts - Ensure accountReference is included
// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface ITransaction extends Document {
// //   transactionId: string;
// //   checkoutRequestId?: string;
// //   receiptNumber: string;
// //   phoneNumber: string;
// //   amount: number;
// //   status: 'pending' | 'success' | 'failed' | 'cancelled';
// //   type: 'order' | 'membership' | 'savings' | 'investment' | 'payout' | 'refund' | 'advertisement' | 'subscription';
// //   purpose?: string;
// //   orderId?: mongoose.Types.ObjectId;
// //   vendorId?: mongoose.Types.ObjectId;
// //   userId?: mongoose.Types.ObjectId;
// //   accountReference?: string; // IMPORTANT: For C2B matching
// //   metadata: any;
// //   errorMessage?: string;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const TransactionSchema = new Schema<ITransaction>({
// //   transactionId: { type: String, required: true, unique: true },
// //   checkoutRequestId: { type: String },
// //   receiptNumber: { type: String },
// //   phoneNumber: { type: String, required: true },
// //   amount: { type: Number, required: true },
// //   status: { 
// //     type: String, 
// //     enum: ['pending', 'success', 'failed', 'cancelled'],
// //     default: 'pending'
// //   },
// //   type: { 
// //     type: String, 
// //     enum: ['order', 'membership', 'savings', 'investment', 'payout', 'refund', 'advertisement', 'subscription'],
// //     required: true
// //   },
// //   purpose: { type: String },
// //   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
// //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
// //   userId: { type: Schema.Types.ObjectId, ref: 'User' },
// //   accountReference: { type: String }, // For C2B Pay Bill matching
// //   metadata: { type: Schema.Types.Mixed },
// //   errorMessage: { type: String },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Add indexes for faster queries
// // TransactionSchema.index({ transactionId: 1 });
// // TransactionSchema.index({ checkoutRequestId: 1 });
// // TransactionSchema.index({ accountReference: 1 }); // Index for C2B lookups
// // TransactionSchema.index({ userId: 1 });
// // TransactionSchema.index({ status: 1 });

// // export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// // shd-models/models/Transaction.ts
// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface ITransaction extends Document {
// //   transactionId: string;
// //   checkoutRequestId?: string;
// //   receiptNumber: string;
// //   phoneNumber: string;
// //   amount: number;
// //   status: 'pending' | 'success' | 'failed' | 'cancelled'| 'processing';
// //   type: 'order' | 'membership' | 'savings' | 'investment' | 'payout' | 'refund' | 'advertisement' | 'subscription' | 'petty_cash_deposit' | 'petty_cash_payout';
// //   purpose?: string;
// //   orderId?: mongoose.Types.ObjectId;
// //   vendorId?: mongoose.Types.ObjectId;
// //   userId?: mongoose.Types.ObjectId;
// //   accountReference?: string; // IMPORTANT: For C2B matching
// //   budgetId?: mongoose.Types.ObjectId; // Link to budget
// //   metadata: any;
// //   errorMessage?: string;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const TransactionSchema = new Schema<ITransaction>({
// //   transactionId: { type: String, required: true, unique: true },
// //   checkoutRequestId: { type: String },
// //   receiptNumber: { type: String },
// //   phoneNumber: { type: String, required: true },
// //   amount: { type: Number, required: true },
// //   status: { 
// //     type: String, 
// //     enum: ['pending', 'success', 'failed', 'cancelled','processing'],
// //     default: 'pending'
// //   },
// //   type: { 
// //     type: String, 
// //     enum: ['order', 'membership', 'savings', 'investment', 'payout', 'refund', 'advertisement', 'subscription', 'petty_cash_deposit', 'petty_cash_payout'],
// //     required: true
// //   },
// //   purpose: { type: String },
// //   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
// //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
// //   userId: { type: Schema.Types.ObjectId, ref: 'User' },
// //   accountReference: { type: String }, // For C2B Pay Bill matching
// //   budgetId: { type: Schema.Types.ObjectId, ref: 'Budget' }, // Link to budget
// //   metadata: { type: Schema.Types.Mixed },
// //   errorMessage: { type: String },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Add indexes for faster queries
// // TransactionSchema.index({ transactionId: 1 });
// // TransactionSchema.index({ checkoutRequestId: 1 });
// // TransactionSchema.index({ accountReference: 1 }); // Index for C2B lookups
// // TransactionSchema.index({ userId: 1 });
// // TransactionSchema.index({ status: 1 });
// // TransactionSchema.index({ budgetId: 1 });

// // export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);







// // shd-models/models/Transaction.ts

// import mongoose, { Schema, Document, Model } from 'mongoose';

// /**
//  * Transaction status
//  *
//  * pending     → Transaction created but not yet submitted
//  * processing  → Provider is processing it
//  * success     → Successfully completed
//  * failed      → Provider rejected/failed the transaction
//  * cancelled   → Transaction was cancelled
//  */
// export type TransactionStatus =
//   | 'pending'
//   | 'processing'
//   | 'success'
//   | 'failed'
//   | 'cancelled';

// /**
//  * High-level financial operation.
//  *
//  * payment  → Money paid for something
//  * deposit  → Money coming into an organization's account
//  * payout   → Money being sent out
//  * refund   → Money being returned
//  */
// export type TransactionType =
//   | 'payment'
//   | 'deposit'
//   | 'payout'
//   | 'refund';

// /**
//  * Business reason/category for the transaction.
//  *
//  * These categories are intentionally independent from
//  * the transaction type.
//  *
//  * Example:
//  *
//  * type: 'payout'
//  * category: 'petty_cash'
//  *
//  * type: 'payment'
//  * category: 'order'
//  */
// export type TransactionCategory =
//   | 'order'
//   | 'membership'
//   | 'savings'
//   | 'investment'
//   | 'petty_cash'
//   | 'advertisement'
//   | 'subscription'
//   | 'vendor_payout'
//   | 'customer_payment'
//   | 'other';

// /**
//  * Payment provider.
//  *
//  * This allows Shaddyna to eventually support multiple
//  * payment providers without changing the transaction model.
//  */
// export type PaymentProvider =
//   | 'mpesa'
//   | 'paystack'
//   | 'stripe'
//   | 'paypal'
//   | 'other';

// /**
//  * Transaction document
//  */
// export interface ITransaction extends Document {
//   /**
//    * Shaddyna's internal unique transaction ID.
//    *
//    * Example:
//    * txn_01KABC123XYZ
//    */
//   transactionId: string;

//   /**
//    * The organization that owns this transaction.
//    *
//    * Example:
//    * Malex
//    * Linkchem
//    * Shaddyna
//    */
//   organizationId: mongoose.Types.ObjectId;

//   /**
//    * High-level financial operation.
//    */
//   type: TransactionType;

//   /**
//    * Business purpose/category.
//    */
//   category: TransactionCategory;

//   /**
//    * Amount involved in the transaction.
//    */
//   amount: number;

//   /**
//    * Currency.
//    *
//    * Default is KES.
//    */
//   currency: string;

//   /**
//    * Current transaction state.
//    */
//   status: TransactionStatus;

//   /**
//    * Customer/employee phone number where applicable.
//    *
//    * Not every transaction will have a phone number,
//    * therefore this is optional.
//    */
//   phoneNumber?: string;

//   /**
//    * Account reference used for C2B transactions.
//    *
//    * Example:
//    *
//    * EXP-10091
//    * INV-10001
//    * CUSTOMER-123
//    */
//   accountReference?: string;

//   /**
//    * Reference generated by the external organization.
//    *
//    * Example:
//    *
//    * Malex:
//    * EXP-10091
//    *
//    * Linkchem:
//    * ORDER-8891
//    */
//   externalReference?: string;

//   /**
//    * ID of the entity in the external organization's
//    * database.
//    *
//    * Example:
//    *
//    * Malex ExpenseRequest._id
//    */
//   externalEntityId?: string;

//   /**
//    * Type/name of the external entity.
//    *
//    * Example:
//    *
//    * expense_request
//    * invoice
//    * order
//    * payroll
//    */
//   externalEntityType?: string;

//   /**
//    * Payment provider used to process the transaction.
//    */
//   provider?: PaymentProvider;

//   /**
//    * Transaction ID/reference returned by the provider.
//    *
//    * For M-Pesa this could be the M-Pesa transaction
//    * reference/receipt depending on the flow.
//    */
//   providerTransactionId?: string;

//   /**
//    * M-Pesa CheckoutRequestID for STK Push transactions.
//    */
//   checkoutRequestId?: string;

//   /**
//    * Payment provider receipt number.
//    *
//    * For M-Pesa this can contain the M-Pesa receipt.
//    */
//   receiptNumber?: string;

//   /**
//    * Human-readable description of the transaction.
//    */
//   purpose?: string;

//   /**
//    * Additional transaction information.
//    *
//    * This is intentionally flexible because different
//    * organizations/providers may require different data.
//    *
//    * Example:
//    *
//    * {
//    *   employeeId: "EMP-1001",
//    *   department: "Finance",
//    *   budgetCode: "PETTY-2026"
//    * }
//    */
//   metadata?: Record<string, any>;

//   /**
//    * Error returned by provider or Shaddyna.
//    */
//   errorMessage?: string;

//   /**
//    * Idempotency key supplied by the organization.
//    *
//    * Prevents duplicate payments when a client retries
//    * the same request.
//    *
//    * Example:
//    *
//    * EXP-10091
//    */
//   idempotencyKey?: string;

//   /**
//    * Timestamps.
//    */
//   createdAt: Date;
//   updatedAt: Date;
// }


// /**
//  * Transaction Schema
//  */
// const TransactionSchema = new Schema<ITransaction>(
//   {
//     /**
//      * Shaddyna internal transaction ID.
//      */
//     transactionId: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       index: true,
//     },

//     /**
//      * Organization that owns this transaction.
//      *
//      * IMPORTANT:
//      * This is what allows Shaddyna to serve multiple
//      * organizations safely.
//      */
//     organizationId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Organization',
//       required: true,
//       index: true,
//     },

//     /**
//      * High-level transaction operation.
//      */
//     type: {
//       type: String,
//       enum: [
//         'payment',
//         'deposit',
//         'payout',
//         'refund',
//       ],
//       required: true,
//       index: true,
//     },

//     /**
//      * Business category.
//      */
//     category: {
//       type: String,
//       enum: [
//         'order',
//         'membership',
//         'savings',
//         'investment',
//         'petty_cash',
//         'advertisement',
//         'subscription',
//         'vendor_payout',
//         'customer_payment',
//         'other',
//       ],
//       required: true,
//       index: true,
//     },

//     /**
//      * Amount.
//      */
//     amount: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     /**
//      * Currency.
//      */
//     currency: {
//       type: String,
//       required: true,
//       default: 'KES',
//       uppercase: true,
//       trim: true,
//     },

//     /**
//      * Transaction status.
//      */
//     status: {
//       type: String,
//       enum: [
//         'pending',
//         'processing',
//         'success',
//         'failed',
//         'cancelled',
//       ],
//       default: 'pending',
//       required: true,
//       index: true,
//     },

//     /**
//      * Phone number involved in the transaction.
//      *
//      * Optional because not every transaction is phone-based.
//      */
//     phoneNumber: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * C2B account reference.
//      */
//     accountReference: {
//       type: String,
//       trim: true,
//       index: true,
//     },

//     /**
//      * External organization's reference.
//      *
//      * Example:
//      *
//      * Malex → EXP-10091
//      */
//     externalReference: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * External organization's database entity ID.
//      */
//     externalEntityId: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * External entity type.
//      *
//      * Example:
//      * expense_request
//      * invoice
//      * order
//      */
//     externalEntityType: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * Payment provider.
//      */
//     provider: {
//       type: String,
//       enum: [
//         'mpesa',
//         'paystack',
//         'stripe',
//         'paypal',
//         'other',
//       ],
//       index: true,
//     },

//     /**
//      * Transaction reference from provider.
//      */
//     providerTransactionId: {
//       type: String,
//       trim: true,
//       index: true,
//     },

//     /**
//      * M-Pesa CheckoutRequestID.
//      */
//     checkoutRequestId: {
//       type: String,
//       trim: true,
//       index: true,
//     },

//     /**
//      * Provider receipt number.
//      */
//     receiptNumber: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * Human-readable purpose.
//      */
//     purpose: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * Flexible additional information.
//      */
//     metadata: {
//       type: Schema.Types.Mixed,
//       default: {},
//     },

//     /**
//      * Error information.
//      */
//     errorMessage: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * Prevents duplicate requests.
//      */
//     idempotencyKey: {
//       type: String,
//       trim: true,
//     },

//     /**
//      * Created timestamp.
//      */
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },

//     /**
//      * Updated timestamp.
//      */
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


// /**
//  * ============================================================
//  * INDEXES
//  * ============================================================
//  */

// /**
//  * Quickly retrieve an organization's transactions.
//  *
//  * Example:
//  *
//  * "Give me all Malex transactions."
//  */
// TransactionSchema.index({
//   organizationId: 1,
//   createdAt: -1,
// });


// /**
//  * Organization + status.
//  *
//  * Example:
//  *
//  * "Give me Malex's pending transactions."
//  */
// TransactionSchema.index({
//   organizationId: 1,
//   status: 1,
// });


// /**
//  * Organization + category.
//  *
//  * Example:
//  *
//  * "Give me Malex's petty cash transactions."
//  */
// TransactionSchema.index({
//   organizationId: 1,
//   category: 1,
// });


// /**
//  * Organization + external reference.
//  *
//  * This is useful for finding a transaction from
//  * the organization's own system.
//  */
// TransactionSchema.index({
//   organizationId: 1,
//   externalReference: 1,
// });


// /**
//  * Organization + account reference.
//  *
//  * Particularly useful for C2B transactions.
//  */
// TransactionSchema.index({
//   organizationId: 1,
//   accountReference: 1,
// });


// /**
//  * Provider transaction lookup.
//  *
//  * Useful when processing callbacks.
//  */
// TransactionSchema.index({
//   provider: 1,
//   providerTransactionId: 1,
// });


// /**
//  * CheckoutRequestID lookup.
//  *
//  * Useful for M-Pesa STK callbacks.
//  */
// TransactionSchema.index({
//   checkoutRequestId: 1,
// });


// /**
//  * Idempotency protection.
//  *
//  * The same organization cannot create two transactions
//  * using the same idempotency key.
//  *
//  * sparse: true means transactions without an
//  * idempotency key are allowed.
//  */
// TransactionSchema.index(
//   {
//     organizationId: 1,
//     idempotencyKey: 1,
//   },
//   {
//     unique: true,
//     sparse: true,
//   }
// );


// /**
//  * Export model safely for Next.js hot reload.
//  */
// const Transaction: Model<ITransaction> =
//   mongoose.models.Transaction ||
//   mongoose.model<ITransaction>('Transaction', TransactionSchema);

// export default Transaction;

// shd-models/models/Transaction.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * ============================================================
 * TRANSACTION TYPES
 * ============================================================
 */

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled';

export type TransactionType =
  | 'payment'
  | 'deposit'
  | 'payout'
  | 'refund';

export type TransactionCategory =
  | 'order'
  | 'membership'
  | 'savings'
  | 'investment'
  | 'petty_cash'
  | 'advertisement'
  | 'subscription'
  | 'vendor_payout'
  | 'customer_payment'
  | 'other';

export type PaymentProvider =
  | 'mpesa'
  | 'paystack'
  | 'stripe'
  | 'paypal'
  | 'other';

/**
 * ============================================================
 * TRANSACTION DOCUMENT
 * ============================================================
 */

export interface ITransaction extends Document {
  /**
   * Shaddyna's internal unique transaction identifier.
   *
   * Example:
   * TXN-1787928913090-7510
   */
  transactionId: string;

  /**
   * Organization that owns this transaction.
   */
  organizationId: mongoose.Types.ObjectId;

  /**
   * High-level financial operation.
   */
  type: TransactionType;

  /**
   * Business reason/category.
   */
  category: TransactionCategory;

  /**
   * Transaction amount.
   */
  amount: number;

  /**
   * Currency.
   */
  currency: string;

  /**
   * Current transaction state.
   */
  status: TransactionStatus;

  /**
   * Phone number involved in the transaction.
   */
  phoneNumber?: string;

  /**
   * Account/reference used by the payment flow.
   */
  accountReference?: string;

  /**
   * Reference supplied by the external organization.
   */
  externalReference?: string;

  /**
   * ID of the external organization's entity.
   */
  externalEntityId?: string;

  /**
   * Type of external entity.
   *
   * Examples:
   * expense_request
   * invoice
   * order
   * payroll
   */
  externalEntityType?: string;

  /**
   * Payment provider.
   */
  provider?: PaymentProvider;

  /**
   * Provider transaction reference.
   *
   * For M-Pesa this may be the M-Pesa receipt number.
   */
  providerTransactionId?: string;

  /**
   * M-Pesa STK CheckoutRequestID.
   */
  checkoutRequestId?: string;

  /**
   * Provider receipt number.
   */
  receiptNumber?: string;

  /**
   * Human-readable transaction purpose.
   */
  purpose?: string;

  /**
   * Flexible transaction metadata.
   */
  metadata?: Record<string, any>;

  /**
   * Error returned by provider or Shaddyna.
   */
  errorMessage?: string;

  /**
   * Client supplied idempotency key.
   *
   * Optional.
   *
   * When supplied, the same organization cannot
   * create another transaction with the same key.
   */
  idempotencyKey?: string;

  /**
   * Timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================================
 * TRANSACTION SCHEMA
 * ============================================================
 */

const TransactionSchema = new Schema<ITransaction>(
  {
    /**
     * ========================================================
     * INTERNAL TRANSACTION ID
     * ========================================================
     */

    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /**
     * ========================================================
     * ORGANIZATION
     * ========================================================
     */

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    /**
     * ========================================================
     * TRANSACTION TYPE
     * ========================================================
     */

    type: {
      type: String,
      enum: [
        'payment',
        'deposit',
        'payout',
        'refund',
      ],
      required: true,
    },

    /**
     * ========================================================
     * CATEGORY
     * ========================================================
     */

    category: {
      type: String,
      enum: [
        'order',
        'membership',
        'savings',
        'investment',
        'petty_cash',
        'advertisement',
        'subscription',
        'vendor_payout',
        'customer_payment',
        'other',
      ],
      required: true,
    },

    /**
     * ========================================================
     * AMOUNT
     * ========================================================
     */

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * ========================================================
     * CURRENCY
     * ========================================================
     */

    currency: {
      type: String,
      required: true,
      default: 'KES',
      uppercase: true,
      trim: true,
    },

    /**
     * ========================================================
     * STATUS
     * ========================================================
     */

    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'success',
        'failed',
        'cancelled',
      ],
      required: true,
      default: 'pending',
    },

    /**
     * ========================================================
     * PHONE NUMBER
     * ========================================================
     */

    phoneNumber: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * ACCOUNT REFERENCE
     * ========================================================
     */

    accountReference: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * EXTERNAL REFERENCE
     * ========================================================
     */

    externalReference: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * EXTERNAL ENTITY
     * ========================================================
     */

    externalEntityId: {
      type: String,
      trim: true,
    },

    externalEntityType: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * PAYMENT PROVIDER
     * ========================================================
     */

    provider: {
      type: String,
      enum: [
        'mpesa',
        'paystack',
        'stripe',
        'paypal',
        'other',
      ],
    },

    /**
     * ========================================================
     * PROVIDER TRANSACTION ID
     * ========================================================
     */

    providerTransactionId: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * M-PESA CHECKOUT REQUEST ID
     * ========================================================
     */

    checkoutRequestId: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * RECEIPT NUMBER
     * ========================================================
     */

    receiptNumber: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * PURPOSE
     * ========================================================
     */

    purpose: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * METADATA
     * ========================================================
     */

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    /**
     * ========================================================
     * ERROR MESSAGE
     * ========================================================
     */

    errorMessage: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * IDEMPOTENCY KEY
     * ========================================================
     *
     * Optional.
     *
     * IMPORTANT:
     * Do NOT make this unique at field level.
     *
     * The compound partial index below handles uniqueness
     * per organization.
     */

    idempotencyKey: {
      type: String,
      trim: true,
    },

    /**
     * ========================================================
     * TIMESTAMPS
     * ========================================================
     *
     * timestamps: true below automatically maintains these.
     */

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ============================================================
 * INDEXES
 * ============================================================
 */

/**
 * Organization transaction history.
 *
 * Used for:
 * - transaction lists
 * - statements
 * - dashboards
 */
TransactionSchema.index({
  organizationId: 1,
  createdAt: -1,
});

/**
 * Organization + status.
 *
 * Example:
 * Find all pending petty cash transactions.
 */
TransactionSchema.index({
  organizationId: 1,
  status: 1,
});

/**
 * Organization + category.
 *
 * Example:
 * Find all petty cash transactions.
 */
TransactionSchema.index({
  organizationId: 1,
  category: 1,
});

/**
 * Organization + external reference.
 *
 * Allows external systems to find their transaction.
 */
TransactionSchema.index({
  organizationId: 1,
  externalReference: 1,
});

/**
 * Organization + account reference.
 *
 * Useful for C2B and account-based payment flows.
 */
TransactionSchema.index({
  organizationId: 1,
  accountReference: 1,
});

/**
 * Provider + provider transaction ID.
 *
 * Useful when processing provider callbacks.
 */
TransactionSchema.index({
  provider: 1,
  providerTransactionId: 1,
});

/**
 * CheckoutRequestID.
 *
 * Very important for M-Pesa STK callbacks.
 */
TransactionSchema.index({
  checkoutRequestId: 1,
});

/**
 * ============================================================
 * IDEMPOTENCY INDEX
 * ============================================================
 *
 * IMPORTANT:
 *
 * The same organization cannot use the same idempotency key
 * more than once.
 *
 * BUT transactions without an idempotency key are completely
 * allowed.
 *
 * Example:
 *
 * organization A + "ABC123"  → allowed
 * organization A + "ABC123"  → rejected
 *
 * organization A + no key    → allowed
 * organization A + no key    → allowed
 * organization A + no key    → allowed
 *
 * organization B + "ABC123"  → allowed
 *
 * This is intentionally a PARTIAL unique index instead of
 * sparse:true because we don't want null values participating
 * in the uniqueness constraint.
 */
TransactionSchema.index(
  {
    organizationId: 1,
    idempotencyKey: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: {
        $exists: true,
        $type: 'string',
      },
    },
  }
);

/**
 * ============================================================
 * MODEL EXPORT
 * ============================================================
 *
 * Prevents OverwriteModelError during Next.js development
 * and hot reloads.
 */

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;