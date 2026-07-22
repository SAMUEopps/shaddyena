import mongoose, { Schema, Document } from 'mongoose';

export interface IPayout extends Document {
  orderId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  amount: number;
  commission: number;
  totalPayout: number;
  payoutMethod: string;
  payoutDetails: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  commission: { type: Number, required: true },
  totalPayout: { type: Number, required: true },
  payoutMethod: { type: String, required: true },
  payoutDetails: { type: Schema.Types.Mixed },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: { type: String },
  errorMessage: { type: String },
  retryCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payout || mongoose.model<IPayout>('Payout', PayoutSchema);