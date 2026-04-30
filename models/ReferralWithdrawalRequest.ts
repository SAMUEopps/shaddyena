// models/WithdrawalRequest.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralWithdrawalRequest extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  withdrawalMethod: 'MPESA' | 'BANK' | 'WALLET';
  withdrawalDetails: {
    phone?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  requestedAt: Date;
  processedAt?: Date;
  transactionId?: string;
  notes?: string;
  rejectionReason?: string;
}

const ReferralWithdrawalRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 100 },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  withdrawalMethod: {
    type: String,
    enum: ['MPESA', 'BANK', 'WALLET'],
    required: true
  },
  withdrawalDetails: {
    phone: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String }
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  transactionId: { type: String },
  notes: { type: String },
  rejectionReason: { type: String }
}, { timestamps: true });

export default mongoose.models.ReferralWithdrawalRequest || 
  mongoose.model<IReferralWithdrawalRequest>('ReferralWithdrawalRequest', ReferralWithdrawalRequestSchema);