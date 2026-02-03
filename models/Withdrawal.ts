import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWithdrawal extends Document {
  vendorId: Types.ObjectId;
  orderId: string;
  ledgerEntryId: Types.ObjectId;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  type: 'IMMEDIATE' | 'REGULAR';
  reason?: string;
  adminNotes?: string;
  processedBy?: Types.ObjectId;
  processedAt?: Date;
  mpesaReceipt?: string;
  admin: {
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectedBy?: Types.ObjectId;
    rejectedAt?: Date;
    rejectionReason?: string;
  };
  vendor: {
    mpesaNumber: string;
    name: string;
    businessName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true },
  ledgerEntryId: { type: Schema.Types.ObjectId, ref: 'Ledger', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'],
    default: 'PENDING'
  },
  type: {
    type: String,
    enum: ['IMMEDIATE', 'REGULAR'],
    default: 'REGULAR'
  },
  reason: { type: String },
  adminNotes: { type: String },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date },
  mpesaReceipt: { type: String },
  admin: {
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String }
  },
  vendor: {
    mpesaNumber: { type: String, required: true },
    name: { type: String, required: true },
    businessName: { type: String }
  }
}, { timestamps: true });

// Indexes
WithdrawalSchema.index({ vendorId: 1, status: 1 });
WithdrawalSchema.index({ orderId: 1 });
WithdrawalSchema.index({ status: 1, createdAt: -1 });
WithdrawalSchema.index({ 'vendor.mpesaNumber': 1 });
WithdrawalSchema.index({ ledgerEntryId: 1 }, { unique: true }); // Prevent multiple withdrawals for same ledger entry

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);