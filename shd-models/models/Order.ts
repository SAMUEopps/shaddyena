// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IOrder extends Document {
// //   orderNumber: string;
// //   customerId: mongoose.Types.ObjectId;
// //   vendorId: mongoose.Types.ObjectId;
// //   products: Array<{
// //     productId: mongoose.Types.ObjectId;
// //     name: string;
// //     quantity: number;
// //     price: number;
// //   }>;
// //   totalAmount: number;
// //   commission: number;
// //   vendorAmount: number;
// //   status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
// //   deliveryAddress: string;
// //   deliveryPhone: string;
// //   shippingMethod: string;
// //   trackingNumber?: string;
// //   transactionId?: string;
// //   isPaid: boolean;
// //   isPayoutComplete: boolean;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const OrderSchema = new Schema<IOrder>({
// //   orderNumber: { type: String, required: true, unique: true },
// //   customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// //   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
// //   products: [{
// //     productId: { type: Schema.Types.ObjectId, ref: 'Product' },
// //     name: String,
// //     quantity: Number,
// //     price: Number
// //   }],
// //   totalAmount: { type: Number, required: true },
// //   commission: { type: Number, required: true },
// //   vendorAmount: { type: Number, required: true },
// //   status: { 
// //     type: String, 
// //     enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
// //     default: 'pending'
// //   },
// //   deliveryAddress: { type: String, required: true },
// //   deliveryPhone: { type: String, required: true },
// //   shippingMethod: { type: String },
// //   trackingNumber: { type: String },
// //   transactionId: { type: String },
// //   isPaid: { type: Boolean, default: false },
// //   isPayoutComplete: { type: Boolean, default: false },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// // models/Order.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IOrder extends Document {
//   orderNumber: string;
//   customerId: mongoose.Types.ObjectId;
//   vendorId: mongoose.Types.ObjectId;
//   referredBy?: mongoose.Types.ObjectId; // Add this field
//   products: Array<{
//     productId: mongoose.Types.ObjectId;
//     name: string;
//     quantity: number;
//     price: number;
//   }>;
//   totalAmount: number;
//   platformCommission: number; // 2.5%
//   referralCommission: number; // 0.5%
//   vendorAmount: number; // 97%
//   status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
//   deliveryAddress: string;
//   deliveryPhone: string;
//   shippingMethod: string;
//   trackingNumber?: string;
//   transactionId?: string;
//   isPaid: boolean;
//   isPayoutComplete: boolean;
//   referralPayoutComplete: boolean; // Track if referral bonus paid
//   createdAt: Date;
//   updatedAt: Date;
// }

// const OrderSchema = new Schema<IOrder>({
//   orderNumber: { type: String, required: true, unique: true },
//   customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
//   referredBy: { type: Schema.Types.ObjectId, ref: 'User' }, // The referrer
//   products: [{
//     productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//     name: String,
//     quantity: Number,
//     price: Number
//   }],
//   totalAmount: { type: Number, required: true },
//   platformCommission: { type: Number, required: true, default: 0 }, // 2.5%
//   referralCommission: { type: Number, required: true, default: 0 }, // 0.5%
//   vendorAmount: { type: Number, required: true }, // 97%
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
//   referralPayoutComplete: { type: Boolean, default: false },
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
  referredBy?: mongoose.Types.ObjectId;
  products: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryPhone: string;
  shippingMethod: string;
  trackingNumber?: string;
  transactionId?: string;
  isPaid: boolean;
  isPayoutComplete: boolean;
  referralPayoutComplete: boolean;
  platformCommission: number; // 3% or 2.5% depending on referral
  referralCommission: number; // 0.5% if referred
  vendorAmount: number; // 97% of total
  immediateWithdrawable: number; // 80% of vendorAmount (77.6% of total)
  pendingWithdrawable: number; // 20% of vendorAmount (19.4% of total) - released on delivery
  isImmediatePayoutAvailable: boolean; // true once order is paid
  isPendingPayoutReleased: boolean; // true once order is delivered
  // Delivery/Rider fields
  deliveryId?: mongoose.Types.ObjectId;
  riderId?: mongoose.Types.ObjectId;
  assignedRiderId?: mongoose.Types.ObjectId;
  //deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
   deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed';
  riderAssignedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User', required: false},
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  platformCommission: { type: Number, required: true, default: 0 },
  referralCommission: { type: Number, required: true, default: 0 },
  vendorAmount: { type: Number, required: true },
  immediateWithdrawable: { type: Number, default: 0 },
  pendingWithdrawable: { type: Number, default: 0 },
  isImmediatePayoutAvailable: { type: Boolean, default: false },
  isPendingPayoutReleased: { type: Boolean, default: false },
 
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
  // Delivery fields
  deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery' },
  riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
  assignedRiderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
  //deliveryStatus: {
  //  type: String,
  //  enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'],
  //  default: 'pending'
  //},
  deliveryStatus: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'awaiting_confirmation', 'completed'],
    default: 'pending'
  },
  riderAssignedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);