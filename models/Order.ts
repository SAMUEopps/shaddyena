// Updated Order Model with ObjectId support
/*import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: Types.ObjectId; // Changed from string to ObjectId
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  suborders: {
    vendorId: string;
    shopId: string;
    items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
    amount: number;
    commission: number;
    netAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  }[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  mpesaTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, unique: true, required: true },
  draftToken: { type: String, required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Now using ObjectId
  items: [{
    productId: { type: String, required: true },
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  suborders: [{
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    items: [{
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }],
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    }
  }],
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  currency: { type: String, default: 'KES' },
  paymentMethod: { type: String, default: 'M-PESA' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: 'Kenya' },
    phone: { type: String, required: true },
    instructions: { type: String }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  mpesaTransactionId: { type: String }
}, { timestamps: true });

// Update indexes for better performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });
OrderSchema.index({ createdAt: -1 }); // Add this for better sorting performance

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);*/

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: Types.ObjectId;
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  suborders: {
    vendorId: string;
    shopId: string;
    riderId?: Types.ObjectId; // NEW: Delivery guy assigned
    deliveryFee: number; // NEW: Fee for delivery
    riderPayoutStatus: 'PENDING' | 'PAID' | 'HOLD'; // NEW: Rider payment status
    items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
    amount: number;
    commission: number;
    netAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: Date;
      actualTime?: Date;
      notes?: string;
      confirmationCode?: string; // OTP for customer confirmation
    };
  }[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  deliveryFeeTotal: number; // NEW: Sum of all delivery fees
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  mpesaTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, unique: true, required: true },
  draftToken: { type: String, required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  suborders: [{
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    riderId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User with role 'delivery'
    deliveryFee: { type: Number, default: 0 },
    riderPayoutStatus: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'PAID', 'HOLD'],
      default: 'PENDING'
    },
    items: [{
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }],
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    },
    deliveryDetails: {
      pickupAddress: { type: String },
      dropoffAddress: { type: String, required: false },
      estimatedTime: { type: Date },
      actualTime: { type: Date },
      notes: { type: String },
      confirmationCode: { type: String } // 4-6 digit OTP
    }
  }],
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  deliveryFeeTotal: { type: Number, default: 0 }, // Sum of suborder delivery fees
  currency: { type: String, default: 'KES' },
  paymentMethod: { type: String, default: 'M-PESA' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: 'Kenya' },
    phone: { type: String, required: true },
    instructions: { type: String }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  mpesaTransactionId: { type: String }
}, { timestamps: true });

// Indexes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });
OrderSchema.index({ 'suborders.riderId': 1 });
OrderSchema.index({ 'suborders.status': 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save hook to update deliveryFeeTotal
OrderSchema.pre('save', function(next) {
  if (this.isModified('suborders')) {
    this.deliveryFeeTotal = this.suborders.reduce((sum, suborder) => sum + (suborder.deliveryFee || 0), 0);
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);