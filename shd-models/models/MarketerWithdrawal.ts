// shd-models/models/MarketerWithdrawal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketerWithdrawal extends Document {
  marketerId: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  amount: number;
  method: 'MPESA' | 'BANK';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference: string;
  transactionId?: string;
  phoneNumber?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  remarks?: string;
  errorMessage?: string;
  processedBy?: mongoose.Types.ObjectId; // admin userId
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MarketerWithdrawalSchema = new Schema<IMarketerWithdrawal>(
  {
    marketerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['MPESA', 'BANK'], required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    reference: { type: String, required: true, unique: true },
    transactionId: String,
    phoneNumber: String,
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    remarks: String,
    errorMessage: String,
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.MarketerWithdrawal ||
  mongoose.model<IMarketerWithdrawal>(
    'MarketerWithdrawal',
    MarketerWithdrawalSchema
  );