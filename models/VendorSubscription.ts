// models/VendorSubscription.ts
/*import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorSubscription extends Document {
  vendorId: mongoose.Types.ObjectId;
  tier: 'basic' | 'growth' | 'pro' | 'elite';
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: mongoose.Types.ObjectId;
  
  // Usage tracking for the current month
  monthlyUsage: {
    todayDealsUsed: number;
    bestSellersUsed: number;
    newArrivalsUsed: number;
    clearanceUsed: number;
    giftCardsCreated: number;
    month: Date; // Reference month
  };
  
  // History of featured products
  featuredProducts: {
    productId: mongoose.Types.ObjectId;
    category: 'todayDeal' | 'bestSeller' | 'newArrival' | 'clearance' | 'giftCard';
    featuredAt: Date;
    expiresAt: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorSubscriptionSchema = new Schema<IVendorSubscription>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    tier: { 
      type: String, 
      enum: ['basic', 'growth', 'pro', 'elite'], 
      required: true,
      default: 'basic'
    },
    status: { 
      type: String, 
      enum: ['active', 'expired', 'cancelled', 'pending'], 
      default: 'pending'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    
    monthlyUsage: {
      todayDealsUsed: { type: Number, default: 0 },
      bestSellersUsed: { type: Number, default: 0 },
      newArrivalsUsed: { type: Number, default: 0 },
      clearanceUsed: { type: Number, default: 0 },
      giftCardsCreated: { type: Number, default: 0 },
      month: { type: Date, default: () => new Date() },
    },
    
    featuredProducts: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      category: { 
        type: String, 
        enum: ['todayDeal', 'bestSeller', 'newArrival', 'clearance', 'giftCard']
      },
      featuredAt: { type: Date, default: Date.now },
      expiresAt: { type: Date, required: true },
    }],
  },
  { timestamps: true }
);

// Indexes
VendorSubscriptionSchema.index({ vendorId: 1, status: 1 });
VendorSubscriptionSchema.index({ endDate: 1 });
VendorSubscriptionSchema.index({ 'monthlyUsage.month': 1 });

export default mongoose.models.VendorSubscription || 
  mongoose.model<IVendorSubscription>('VendorSubscription', VendorSubscriptionSchema);*/

  // models/VendorSubscription.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorSubscription extends Document {
  vendorId: mongoose.Types.ObjectId;
  tier: 'basic' | 'growth' | 'pro' | 'elite';
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'grace_period';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: mongoose.Types.ObjectId;
  paymentHistory: {
    paymentId: mongoose.Types.ObjectId;
    planId: string;
    amount: number;
    paidAt: Date;
    validUntil: Date;
  }[];
  
  // Usage tracking for the current month
  monthlyUsage: {
    todayDealsUsed: number;
    bestSellersUsed: number;
    newArrivalsUsed: number;
    clearanceUsed: number;
    giftCardsCreated: number;
    month: Date;
    lastResetAt: Date;
  };
  
  // History of featured products
  featuredProducts: {
    productId: mongoose.Types.ObjectId;
    category: 'todayDeal' | 'bestSeller' | 'newArrival' | 'clearance' | 'giftCard';
    featuredAt: Date;
    expiresAt: Date;
  }[];
  
  // Grace period tracking
  gracePeriodEndsAt?: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorSubscriptionSchema = new Schema<IVendorSubscription>(
  {
    vendorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },
    tier: { 
      type: String, 
      enum: ['basic', 'growth', 'pro', 'elite'], 
      required: true,
      default: 'basic'
    },
    status: { 
      type: String, 
      enum: ['active', 'expired', 'cancelled', 'pending', 'grace_period'], 
      default: 'pending'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    paymentHistory: [{
      paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
      planId: { type: String, required: true },
      amount: { type: Number, required: true },
      paidAt: { type: Date, required: true },
      validUntil: { type: Date, required: true },
    }],
    
    monthlyUsage: {
      todayDealsUsed: { type: Number, default: 0 },
      bestSellersUsed: { type: Number, default: 0 },
      newArrivalsUsed: { type: Number, default: 0 },
      clearanceUsed: { type: Number, default: 0 },
      giftCardsCreated: { type: Number, default: 0 },
      month: { type: Date, default: () => new Date() },
      lastResetAt: { type: Date, default: () => new Date() },
    },
    
    featuredProducts: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      category: { 
        type: String, 
        enum: ['todayDeal', 'bestSeller', 'newArrival', 'clearance', 'giftCard']
      },
      featuredAt: { type: Date, default: Date.now },
      expiresAt: { type: Date, required: true },
    }],
    
    gracePeriodEndsAt: { type: Date },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
VendorSubscriptionSchema.index({ vendorId: 1, status: 1 });
VendorSubscriptionSchema.index({ endDate: 1 });
VendorSubscriptionSchema.index({ 'monthlyUsage.month': 1 });
VendorSubscriptionSchema.index({ status: 1, endDate: 1 });

export default mongoose.models.VendorSubscription || 
  mongoose.model<IVendorSubscription>('VendorSubscription', VendorSubscriptionSchema);