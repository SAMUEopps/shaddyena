import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISellerRequest extends Document {
  user: Types.ObjectId;
  businessName: string;
  businessType: string;
  mpesaNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sellerRequestSchema = new Schema<ISellerRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      required: true,
      trim: true
    },
    mpesaNumber: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
sellerRequestSchema.index({ user: 1 });
sellerRequestSchema.index({ status: 1 });
sellerRequestSchema.index({ createdAt: -1 });
sellerRequestSchema.index({ user: 1, status: 1 });

// Prevent duplicate pending requests
sellerRequestSchema.index({ user: 1 }, { 
  unique: true, 
  partialFilterExpression: { status: 'pending' } 
});

export default mongoose.models.SellerRequest || mongoose.model<ISellerRequest>('SellerRequest', sellerRequestSchema);