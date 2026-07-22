// models/ReferralPayout.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralPayout extends Document {
  referrerId: mongoose.Types.ObjectId;
  referredVendorId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  type: 'order_commission' | 'subscription_commission';
  amount: number;
  percentage: number;
  status: 'pending' | 'processed' | 'failed';
  transactionId?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralPayoutSchema = new Schema<IReferralPayout>({
  referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referredVendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'VendorSubscription' },
  type: {
    type: String,
    enum: ['order_commission', 'subscription_commission'],
    required: true
  },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending'
  },
  transactionId: { type: String },
  processedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ReferralPayout || mongoose.model<IReferralPayout>('ReferralPayout', ReferralPayoutSchema);