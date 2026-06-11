// models/SavingsTransaction.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISavingsTransaction extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'investment' | 'interest' | 'refund';
  paymentMethod?: 'mpesa' | 'bank' | 'cash';
  reference: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
  createdAt: Date;
}

const savingsTransactionSchema = new Schema<ISavingsTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'MembershipUser', required: true },
    accountId: { type: Schema.Types.ObjectId, ref: 'SavingsAccount', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'investment', 'interest', 'refund'], required: true },
    paymentMethod: { type: String, enum: ['mpesa', 'bank', 'cash'] },
    reference: { type: String, required: true, unique: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

savingsTransactionSchema.index({ userId: 1 });
savingsTransactionSchema.index({ accountId: 1 });
savingsTransactionSchema.index({ reference: 1 });
savingsTransactionSchema.index({ createdAt: -1 });

export default mongoose.models.SavingsTransaction || mongoose.model<ISavingsTransaction>('SavingsTransaction', savingsTransactionSchema);