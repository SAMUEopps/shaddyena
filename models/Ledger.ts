/*import mongoose, { Document, Schema } from 'mongoose';

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

export default mongoose.models.Ledger || mongoose.model<ILedger>('Ledger', LedgerSchema);*/

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILedger extends Document {
  type: 'VENDOR_PAYOUT' | 'REFERRAL_COMMISSION' | 'PLATFORM_COMMISSION';
  //type: 'VENDOR_PAYOUT' | 'REFERRAL_COMMISSION';
  vendorId?: string; // Only for VENDOR_PAYOUT
  shopId?: string;   // Only for VENDOR_PAYOUT
  referrerId?: Types.ObjectId | string;       // Only for REFERRAL_COMMISSION, allow string temporarily
  referredVendorId?: Types.ObjectId | string; // Only for REFERRAL_COMMISSION, allow string temporarily
  orderId: string;
  draftToken: string;
  amount: number;
  //commission?: number; // Only for VENDOR_PAYOUT
  netAmount?: number;  // Only for VENDOR_PAYOUT
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';
  payoutRef?: string;
  failureReason?: string;
  scheduledAt: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerSchema = new Schema<ILedger>(
  {
    type: {
      type: String,
      //enum: ['VENDOR_PAYOUT', 'REFERRAL_COMMISSION'],
      enum: ['VENDOR_PAYOUT', 'REFERRAL_COMMISSION', 'PLATFORM_COMMISSION'],
      required: true,
    },
    vendorId: { type: String }, // Only for VENDOR_PAYOUT
    shopId: { type: String },   // Only for VENDOR_PAYOUT

    // For referrals, we allow either ObjectId or string to prevent crashes
    referrerId: {
      type: Schema.Types.Mixed, 
      ref: 'User', 
      required: function () { return this.type === 'REFERRAL_COMMISSION'; },
    },
    referredVendorId: {
      type: Schema.Types.Mixed, 
      ref: 'User',
      required: function () { return this.type === 'REFERRAL_COMMISSION'; },
    },

    orderId: { type: String, required: true },
    draftToken: { type: String, required: true },
    amount: { type: Number, required: true },
    //commission: { type: Number }, // Only for VENDOR_PAYOUT
    netAmount: { type: Number },  // Only for VENDOR_PAYOUT
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    payoutRef: { type: String },
    failureReason: { type: String },
    scheduledAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for faster queries
LedgerSchema.index({ type: 1 });
LedgerSchema.index({ vendorId: 1 });
LedgerSchema.index({ referrerId: 1 });
LedgerSchema.index({ orderId: 1 });
LedgerSchema.index({ draftToken: 1 });
LedgerSchema.index({ status: 1 });
LedgerSchema.index({ scheduledAt: 1 });

export default mongoose.models.Ledger || mongoose.model<ILedger>('Ledger', LedgerSchema);
