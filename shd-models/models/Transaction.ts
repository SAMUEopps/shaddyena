// // // import mongoose, { Schema, Document } from 'mongoose';

// // // export interface ITransaction extends Document {
// // //   transactionId: string;
// // //   receiptNumber: string;
// // //   phoneNumber: string;
// // //   amount: number;
// // //   status: 'pending' | 'success' | 'failed' | 'cancelled';
// // //   type: 'collection' | 'payout' | 'refund';
// // //   orderId?: mongoose.Types.ObjectId;
// // //   vendorId?: mongoose.Types.ObjectId;
// // //   metadata: any;
// // //   createdAt: Date;
// // //   updatedAt: Date;
// // // }

// // // const TransactionSchema = new Schema<ITransaction>({
// // //   transactionId: { type: String, required: true, unique: true },
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
// // //     enum: ['collection', 'payout', 'refund'],
// // //     required: true
// // //   },
// // //   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
// // //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
// // //   metadata: { type: Schema.Types.Mixed },
// // //   createdAt: { type: Date, default: Date.now },
// // //   updatedAt: { type: Date, default: Date.now }
// // // });

// // // export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// // // shd-models/models/Transaction.ts
// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface ITransaction extends Document {
// //   transactionId: string;
// //   checkoutRequestId?: string; // M-Pesa checkout request ID
// //   receiptNumber: string;
// //   phoneNumber: string;
// //   amount: number;
// //   status: 'pending' | 'success' | 'failed' | 'cancelled';
// //   type: 'collection' | 'payout' | 'refund' | 'membership' | 'savings' | 'investment';
// //   purpose?: 'membership' | 'savings' | 'investment' | 'order' | 'withdrawal';
// //   orderId?: mongoose.Types.ObjectId;
// //   vendorId?: mongoose.Types.ObjectId;
// //   userId?: mongoose.Types.ObjectId; // Add user reference
// //   accountReference?: string; // For tracking payments
// //   metadata: any;
// //   errorMessage?: string;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const TransactionSchema = new Schema<ITransaction>({
// //   transactionId: { type: String, required: true, unique: true },
// //   checkoutRequestId: { type: String }, // For STK Push
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
// //     enum: ['collection', 'payout', 'refund', 'membership', 'savings', 'investment'],
// //     required: true
// //   },
// //   purpose: { 
// //     type: String, 
// //     enum: ['membership', 'savings', 'investment', 'order', 'withdrawal']
// //   },
// //   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
// //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
// //   userId: { type: Schema.Types.ObjectId, ref: 'User' },
// //   accountReference: { type: String },
// //   metadata: { type: Schema.Types.Mixed },
// //   errorMessage: { type: String },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Add indexes for faster queries
// // TransactionSchema.index({ transactionId: 1 });
// // TransactionSchema.index({ checkoutRequestId: 1 });
// // TransactionSchema.index({ userId: 1 });
// // TransactionSchema.index({ accountReference: 1 });
// // TransactionSchema.index({ status: 1 });

// // export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// // shd-models/models/Transaction.ts - Ensure accountReference is included
// import mongoose, { Schema, Document } from 'mongoose';

// export interface ITransaction extends Document {
//   transactionId: string;
//   checkoutRequestId?: string;
//   receiptNumber: string;
//   phoneNumber: string;
//   amount: number;
//   status: 'pending' | 'success' | 'failed' | 'cancelled';
//   type: 'order' | 'membership' | 'savings' | 'investment' | 'payout' | 'refund' | 'advertisement' | 'subscription';
//   purpose?: string;
//   orderId?: mongoose.Types.ObjectId;
//   vendorId?: mongoose.Types.ObjectId;
//   userId?: mongoose.Types.ObjectId;
//   accountReference?: string; // IMPORTANT: For C2B matching
//   metadata: any;
//   errorMessage?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const TransactionSchema = new Schema<ITransaction>({
//   transactionId: { type: String, required: true, unique: true },
//   checkoutRequestId: { type: String },
//   receiptNumber: { type: String },
//   phoneNumber: { type: String, required: true },
//   amount: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'success', 'failed', 'cancelled'],
//     default: 'pending'
//   },
//   type: { 
//     type: String, 
//     enum: ['order', 'membership', 'savings', 'investment', 'payout', 'refund', 'advertisement', 'subscription'],
//     required: true
//   },
//   purpose: { type: String },
//   orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
//   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
//   userId: { type: Schema.Types.ObjectId, ref: 'User' },
//   accountReference: { type: String }, // For C2B Pay Bill matching
//   metadata: { type: Schema.Types.Mixed },
//   errorMessage: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Add indexes for faster queries
// TransactionSchema.index({ transactionId: 1 });
// TransactionSchema.index({ checkoutRequestId: 1 });
// TransactionSchema.index({ accountReference: 1 }); // Index for C2B lookups
// TransactionSchema.index({ userId: 1 });
// TransactionSchema.index({ status: 1 });

// export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// shd-models/models/Transaction.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  checkoutRequestId?: string;
  receiptNumber: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  type: 'order' | 'membership' | 'savings' | 'investment' | 'payout' | 'refund' | 'advertisement' | 'subscription' | 'petty_cash_deposit' | 'petty_cash_payout';
  purpose?: string;
  orderId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  accountReference?: string; // IMPORTANT: For C2B matching
  budgetId?: mongoose.Types.ObjectId; // Link to budget
  metadata: any;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  checkoutRequestId: { type: String },
  receiptNumber: { type: String },
  phoneNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  type: { 
    type: String, 
    enum: ['order', 'membership', 'savings', 'investment', 'payout', 'refund', 'advertisement', 'subscription', 'petty_cash_deposit', 'petty_cash_payout'],
    required: true
  },
  purpose: { type: String },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  accountReference: { type: String }, // For C2B Pay Bill matching
  budgetId: { type: Schema.Types.ObjectId, ref: 'Budget' }, // Link to budget
  metadata: { type: Schema.Types.Mixed },
  errorMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for faster queries
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ checkoutRequestId: 1 });
TransactionSchema.index({ accountReference: 1 }); // Index for C2B lookups
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ budgetId: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);