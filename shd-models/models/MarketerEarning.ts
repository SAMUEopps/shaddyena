import mongoose, { Schema, Document, Model } from 'mongoose';

export type EarningStatus = 'accrued' | 'approved' | 'paid' | 'void';

export interface IMarketerEarning extends Document {
  organizationId: mongoose.Types.ObjectId;
  marketerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: EarningStatus;
  sourceType?: string;      // 'sale' | 'bonus' | 'referral'
  sourceId?: string;        // order id, lead id, etc
  description?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  paidAt?: Date;
  payoutTransactionId?: mongoose.Types.ObjectId; // ref Transaction
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MarketerEarningSchema = new Schema<IMarketerEarning>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    marketerId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount:        { type: Number, required: true, min: 0 },
    currency:      { type: String, default: 'KES', uppercase: true },
    status:        { type: String, enum: ['accrued', 'approved', 'paid', 'void'], default: 'accrued', index: true },
    sourceType:    { type: String, trim: true },
    sourceId:      { type: String, trim: true },
    description:   { type: String, trim: true },
    approvedBy:    { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt:    Date,
    paidAt:        Date,
    payoutTransactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    metadata:      { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

MarketerEarningSchema.index({ organizationId: 1, marketerId: 1, status: 1 });

const MarketerEarning: Model<IMarketerEarning> =
  mongoose.models.MarketerEarning ||
  mongoose.model<IMarketerEarning>('MarketerEarning', MarketerEarningSchema);

export default MarketerEarning;