// models/SubscriptionPlan.ts
/*import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'quarter';
  features: string[];
  popular?: boolean;
  badge?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  period: {
    type: String,
    enum: ['month', 'year', 'quarter'],
    default: 'month',
    required: true,
  },
  features: [{
    type: String,
    required: true,
  }],
  popular: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    enum: ['Star', 'TrendingUp', 'Rocket', 'Crown', 'Zap', 'Award'],
    default: 'Star',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add index for faster queries
SubscriptionPlanSchema.index({ order: 1, isActive: -1 });
SubscriptionPlanSchema.index({ popular: -1 });

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);*/


// models/SubscriptionPlan.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'quarter';
  features: string[]; // Display features shown to users
  popular?: boolean;
  badge?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  
  // NEW: Feature capabilities for the plan
  capabilities: {
    canFeatureTodayDeals: boolean;
    canFeatureBestSellers: boolean;
    canFeatureNewArrivals: boolean;
    canFeatureClearance: boolean;
    canFeatureGiftCards: boolean;
    maxTodayDealsPerMonth: number;
    maxBestSellersPerMonth: number;
    maxNewArrivalsPerMonth: number;
    maxClearanceItemsPerMonth: number;
    maxGiftCardsPerMonth: number;
    maxProducts: number;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  period: {
    type: String,
    enum: ['month', 'year', 'quarter'],
    default: 'month',
    required: true,
  },
  features: [{
    type: String,
    required: true,
  }],
  popular: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    enum: ['Star', 'TrendingUp', 'Rocket', 'Crown', 'Zap', 'Award'],
    default: 'Star',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // NEW: Capabilities schema
  capabilities: {
    canFeatureTodayDeals: { type: Boolean, default: false },
    canFeatureBestSellers: { type: Boolean, default: false },
    canFeatureNewArrivals: { type: Boolean, default: true },
    canFeatureClearance: { type: Boolean, default: false },
    canFeatureGiftCards: { type: Boolean, default: false },
    maxTodayDealsPerMonth: { type: Number, default: 0 },
    maxBestSellersPerMonth: { type: Number, default: 0 },
    maxNewArrivalsPerMonth: { type: Number, default: 5 },
    maxClearanceItemsPerMonth: { type: Number, default: 0 },
    maxGiftCardsPerMonth: { type: Number, default: 0 },
    maxProducts: { type: Number, default: 50 },
    prioritySupport: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

SubscriptionPlanSchema.index({ order: 1, isActive: -1 });
SubscriptionPlanSchema.index({ popular: -1 });

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);