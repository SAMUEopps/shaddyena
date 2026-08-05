// shd-models/models/Withdrawal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
  vendorId: mongoose.Types.ObjectId;
  amount: number;
  method: 'MPESA' | 'BANK';
  phoneNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference: string;
  transactionId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['MPESA', 'BANK'], required: true },
  phoneNumber: { type: String },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  reference: { type: String, required: true, unique: true },
  transactionId: { type: String },
  errorMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);