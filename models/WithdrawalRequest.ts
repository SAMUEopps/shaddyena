import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  vendorId: Types.ObjectId;
  vendor: {
    firstName: string;
    lastName: string;
    businessName?: string;
    mpesaNumber?: string;
  };
  earningsIds: Types.ObjectId[]; // Array of VendorEarnings IDs
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  adminNotes?: string;
  processedAt?: Date;
  processedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      businessName: { type: String },
      mpesaNumber: { type: String }
    },
    earningsIds: [{
      type: Schema.Types.ObjectId,
      ref: 'VendorEarnings',
      required: true
    }],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'],
      default: 'PENDING'
    },
    adminNotes: { type: String },
    processedAt: { type: Date },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

WithdrawalRequestSchema.index({ vendorId: 1 });
WithdrawalRequestSchema.index({ status: 1 });
WithdrawalRequestSchema.index({ createdAt: -1 });

export default mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);