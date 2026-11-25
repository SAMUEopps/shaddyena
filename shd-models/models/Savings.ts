// // C:\Users\USER\Desktop\Projects\my-app\models\Savings.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface ISavings extends Document {
//   userId: mongoose.Types.ObjectId;
//   amount: number;
//   type: 'deposit' | 'withdrawal';
//   description: string;
//   status: 'pending' | 'completed' | 'failed';
//   reference: string;
//   createdAt: Date;
// }

// const SavingsSchema = new Schema<ISavings>({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   amount: { type: Number, required: true },
//   type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
//   description: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   reference: { type: String, unique: true },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.Savings || mongoose.model<ISavings>('Savings', SavingsSchema);

// shd-models/models/Savings.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface ISavings extends Document {
//   userId: mongoose.Types.ObjectId;
//   amount: number;
//   type: 'deposit' | 'withdrawal';
//   description: string;
//   status: 'pending' | 'completed' | 'failed';
//   reference: string;
//   transactionId?: mongoose.Types.ObjectId;
//   createdAt: Date;
// }

// const SavingsSchema = new Schema<ISavings>({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   amount: { type: Number, required: true },
//   type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
//   description: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   reference: { type: String, unique: true },
//   transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.Savings || mongoose.model<ISavings>('Savings', SavingsSchema);

// shd-models/models/Savings.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISavings extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  transactionId?: mongoose.Types.ObjectId;
  checkoutRequestId?: string;
  receiptNumber?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const SavingsSchema = new Schema<ISavings>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  description: { type: String, required: true, default: 'Savings deposit' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  reference: { type: String, unique: true, required: true },
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  checkoutRequestId: { type: String, index: true },
  receiptNumber: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Required for the idempotent $setOnInsert upsert in mpesaPaymentService.
// Unique + sparse so old rows without it don't collide.
SavingsSchema.index(
  { checkoutRequestId: 1 },
  { unique: true, sparse: true }
);

export default mongoose.models.Savings ||
  mongoose.model<ISavings>('Savings', SavingsSchema);