// import mongoose, { Schema, Document } from 'mongoose';

// export interface IOrder extends Document {
//   orderNumber: string;
//   customerId: mongoose.Types.ObjectId;
//   vendorId: mongoose.Types.ObjectId;
//   products: Array<{
//     productId: mongoose.Types.ObjectId;
//     name: string;
//     quantity: number;
//     price: number;
//   }>;
//   totalAmount: number;
//   commission: number;
//   vendorAmount: number;
//   status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
//   deliveryAddress: string;
//   deliveryPhone: string;
//   shippingMethod: string;
//   trackingNumber?: string;
//   transactionId?: string;
//   isPaid: boolean;
//   isPayoutComplete: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const OrderSchema = new Schema<IOrder>({
//   orderNumber: { type: String, required: true, unique: true },
//   customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
//   products: [{
//     productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//     name: String,
//     quantity: Number,
//     price: Number
//   }],
//   totalAmount: { type: Number, required: true },
//   commission: { type: Number, required: true },
//   vendorAmount: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   deliveryAddress: { type: String, required: true },
//   deliveryPhone: { type: String, required: true },
//   shippingMethod: { type: String },
//   trackingNumber: { type: String },
//   transactionId: { type: String },
//   isPaid: { type: Boolean, default: false },
//   isPayoutComplete: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  referredBy?: mongoose.Types.ObjectId; // Add this field
  products: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  platformCommission: number; // 2.5%
  referralCommission: number; // 0.5%
  vendorAmount: number; // 97%
  status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryPhone: string;
  shippingMethod: string;
  trackingNumber?: string;
  transactionId?: string;
  isPaid: boolean;
  isPayoutComplete: boolean;
  referralPayoutComplete: boolean; // Track if referral bonus paid
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' }, // The referrer
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  platformCommission: { type: Number, required: true, default: 0 }, // 2.5%
  referralCommission: { type: Number, required: true, default: 0 }, // 0.5%
  vendorAmount: { type: Number, required: true }, // 97%
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: { type: String, required: true },
  deliveryPhone: { type: String, required: true },
  shippingMethod: { type: String },
  trackingNumber: { type: String },
  transactionId: { type: String },
  isPaid: { type: Boolean, default: false },
  isPayoutComplete: { type: Boolean, default: false },
  referralPayoutComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);