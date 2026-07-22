// C:\Users\USER\Desktop\Projects\my-app\models\VendorSubscription.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorSubscription extends Document {
  vendorId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: 'mpesa' | 'card' | 'bank' | 'wallet';
  paymentDetails: any;
  amountPaid: number;
  transactionId?: string;
  features: string[];
  maxProducts: number;
  maxOrders: number;
  commissionRate: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  promoFeatures: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  teamMembers: number;
  storageLimit: number;
  renewalDate?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSubscriptionSchema = new Schema<IVendorSubscription>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank', 'wallet'],
    default: 'mpesa'
  },
  paymentDetails: { type: Schema.Types.Mixed },
  amountPaid: { type: Number, required: true },
  transactionId: { type: String },
  features: [{ type: String }],
  maxProducts: { type: Number, default: 0 },
  maxOrders: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 10 },
  prioritySupport: { type: Boolean, default: false },
  analyticsAccess: { type: Boolean, default: false },
  promoFeatures: { type: Boolean, default: false },
  customDomain: { type: Boolean, default: false },
  apiAccess: { type: Boolean, default: false },
  teamMembers: { type: Number, default: 1 },
  storageLimit: { type: Number, default: 1 },
  renewalDate: { type: Date },
  cancelledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.VendorSubscription || mongoose.model<IVendorSubscription>('VendorSubscription', VendorSubscriptionSchema);