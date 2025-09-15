import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: string;
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

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true, required: true },
    draftToken: { type: String, required: true },
    buyerId: { type: String, required: true },
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
  },
  { timestamps: true }
);

// Index for better query performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);