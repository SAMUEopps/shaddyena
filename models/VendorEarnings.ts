/*import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorEarning extends Document {
  vendorId: string;
  orderId: string;
  suborderId: string;
  amount: number;          // Gross amount (items total)
  commission: number;      // Platform commission
  netAmount: number;       // Amount after commission (amount - commission)
  status: 'PENDING' | 'AVAILABLE' | 'WITHDRAWN' | 'HOLD';
  withdrawalRequestId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorEarningSchema = new Schema<IVendorEarning>(
  {
    vendorId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    suborderId: { type: String, required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'AVAILABLE', 'WITHDRAWN', 'HOLD'],
      default: 'PENDING'
    },
    withdrawalRequestId: { type: String }
  },
  { timestamps: true }
);

// Indexes for better query performance
VendorEarningSchema.index({ vendorId: 1, status: 1 });
VendorEarningSchema.index({ orderId: 1 });
VendorEarningSchema.index({ createdAt: -1 });

export default mongoose.models.VendorEarning || mongoose.model<IVendorEarning>('VendorEarning', VendorEarningSchema);*/

import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorEarning extends Document {
  vendorId: string;
  orderId: string;
  suborderId: string;
  amount: number;          // Gross amount (items total)
  commission: number;      // Platform commission
  netAmount: number;       // Amount after commission (amount - commission)
  status: 'PENDING' | 'AVAILABLE' | 'WITHDRAWN' | 'HOLD';
  withdrawalRequestId?: string;
  orderDetails: {
    orderId: string;
    buyerName: string;
    buyerEmail: string;
    itemsCount: number;
    createdAt: Date;
  };
  vendorDetails: {
    vendorId: string;
    businessName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VendorEarningSchema = new Schema<IVendorEarning>(
  {
    vendorId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    suborderId: { type: String, required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'AVAILABLE', 'WITHDRAWN', 'HOLD'],
      default: 'PENDING'
    },
    withdrawalRequestId: { type: String },
    orderDetails: {
      orderId: { type: String, required: true },
      buyerName: { type: String, required: true },
      buyerEmail: { type: String, required: true },
      itemsCount: { type: Number, required: true },
      createdAt: { type: Date, required: true }
    },
    vendorDetails: {
      vendorId: { type: String, required: true },
      businessName: { type: String }
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
VendorEarningSchema.index({ vendorId: 1, status: 1 });
VendorEarningSchema.index({ orderId: 1 });
VendorEarningSchema.index({ createdAt: -1 });
VendorEarningSchema.index({ updatedAt: -1 });

export default mongoose.models.VendorEarning || mongoose.model<IVendorEarning>('VendorEarning', VendorEarningSchema);