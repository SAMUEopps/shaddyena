// shd-models/models/ExpenseRequest.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseRequest extends Document {
  amount: number;
  platformFee: number;
  totalAmount: number;
  recipientPhone: string;
  recipientName: string;
  category: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed';
  requesterId: mongoose.Types.ObjectId;
  approverId?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  receiptUrl?: string;
  mpesaReference?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  paidAt?: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseRequestSchema = new Schema<IExpenseRequest>({
  amount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  recipientPhone: { type: String, required: true },
  recipientName: { type: String, default: 'Unknown' },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid', 'failed','processing'],
    default: 'pending'
  },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approverId: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  receiptUrl: { type: String },
  mpesaReference: { type: String },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  paidAt: { type: Date },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ExpenseRequestSchema.index({ requesterId: 1 });
ExpenseRequestSchema.index({ status: 1 });

export default mongoose.models.ExpenseRequest || mongoose.model<IExpenseRequest>('ExpenseRequest', ExpenseRequestSchema);