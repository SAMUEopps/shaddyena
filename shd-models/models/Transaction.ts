import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  receiptNumber: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  type: 'collection' | 'payout' | 'refund';
  orderId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  receiptNumber: { type: String },
  phoneNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  type: { 
    type: String, 
    enum: ['collection', 'payout', 'refund'],
    required: true
  },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);