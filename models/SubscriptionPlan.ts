// models/SubscriptionPlan.ts
import mongoose, { Schema, Document } from 'mongoose';

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

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);