import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVendorEarnings extends Document {
  vendorId: Types.ObjectId;
  orderId: string;
  suborderId: Types.ObjectId;
  amount: number; // Total amount for this suborder
  commission: number; // Platform commission
  netAmount: number; // Amount after commission (vendor earnings)
  status: 'PENDING' | 'PAID' | 'WITHDRAWN';
  withdrawalRequestId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VendorEarningsSchema = new Schema<IVendorEarnings>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true },
    suborderId: { type: Schema.Types.ObjectId, ref: 'Order.suborders', required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'WITHDRAWN'],
      default: 'PENDING'
    },
    withdrawalRequestId: { type: Schema.Types.ObjectId, ref: 'WithdrawalRequest' }
  },
  { timestamps: true }
);

VendorEarningsSchema.index({ vendorId: 1, status: 1 });
VendorEarningsSchema.index({ orderId: 1 });
VendorEarningsSchema.index({ suborderId: 1 });

export default mongoose.models.VendorEarnings || mongoose.model<IVendorEarnings>('VendorEarnings', VendorEarningsSchema);