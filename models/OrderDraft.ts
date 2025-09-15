import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderDraft extends Document {
  token: string;
  prefix: string;
  version: string;
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  vendorSplits: {
    vendorId: string;
    shopId: string;
    amount: number;
    commission: number;
    netAmount: number;
  }[];
  totalAmount: number;
  currency: string;
  buyerId: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'VALIDATED' | 'CONFIRMED' | 'FAILED' | 'EXPIRED';
  mpesaTransactionId?: string;
  createdAt: Date;
  expiresAt: Date;
}

const OrderDraftSchema = new Schema<IOrderDraft>(
  {
    token: { type: String, unique: true, required: true },
    prefix: { type: String, default: 'SHD' },
    version: { type: String, default: 'V1' },
    items: [{
      productId: { type: String, required: true },
      vendorId: { type: String, required: true },
      shopId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }],
    vendorSplits: [{
      vendorId: { type: String, required: true },
      shopId: { type: String, required: true },
      amount: { type: Number, required: true },
      commission: { type: Number, required: true },
      netAmount: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    buyerId: { type: String, required: true },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true, default: 'Kenya' },
      phone: { type: String, required: true },
      instructions: { type: String }
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'VALIDATED', 'CONFIRMED', 'FAILED', 'EXPIRED'],
      default: 'PENDING'
    },
    mpesaTransactionId: { type: String },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// Index for better query performance
OrderDraftSchema.index({ token: 1 });
OrderDraftSchema.index({ buyerId: 1 });
OrderDraftSchema.index({ status: 1 });
OrderDraftSchema.index({ expiresAt: 1 });

export default mongoose.models.OrderDraft || mongoose.model<IOrderDraft>('OrderDraft', OrderDraftSchema);