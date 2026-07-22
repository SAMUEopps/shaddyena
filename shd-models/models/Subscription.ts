// C:\Users\USER\Desktop\Projects\my-app\models\Subscription.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  name: string;
  description: string;
  tier: 'basic' | 'premium' | 'enterprise' | 'custom';
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  maxProducts: number;
  maxOrders: number;
  commissionRate: number; // percentage
  prioritySupport: boolean;
  analyticsAccess: boolean;
  promoFeatures: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  teamMembers: number;
  storageLimit: number; // in GB
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tier: {
    type: String,
    enum: ['basic', 'premium', 'enterprise', 'custom'],
    required: true
  },
  price: { type: Number, required: true },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
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
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);