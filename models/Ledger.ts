import mongoose, { Document, Schema } from 'mongoose';

export interface ILedger extends Document {
  vendorId: string;
  shopId: string;
  orderId: string;
  draftToken: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';
  payoutRef?: string;
  scheduledAt: Date;
  paidAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerSchema = new Schema<ILedger>(
  {
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    orderId: { type: String, required: true },
    draftToken: { type: String, required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED'],
      default: 'PENDING'
    },
    payoutRef: { type: String },
    scheduledAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    failureReason: { type: String }
  },
  { timestamps: true }
);

// Index for better query performance
LedgerSchema.index({ vendorId: 1 });
LedgerSchema.index({ orderId: 1 });
LedgerSchema.index({ draftToken: 1 });
LedgerSchema.index({ status: 1 });
LedgerSchema.index({ scheduledAt: 1 });

export default mongoose.models.Ledger || mongoose.model<ILedger>('Ledger', LedgerSchema);