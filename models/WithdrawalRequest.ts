/*import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  vendorId: string;
  vendorDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mpesaNumber?: string;
    businessName?: string;
  };
  earnings: {
    earningId: string;
    amount: number;
  }[];
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  adminNotes?: string;
  mpesaTransactionId?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    vendorId: { type: String, required: true, index: true },
    vendorDetails: {
      firstName: { type: String, required: false },
      lastName: { type: String, required: false },
      email: { type: String, required: false },
      phone: { type: String, required: false },
      mpesaNumber: { type: String },
      businessName: { type: String }
    },
    earnings: [{
      earningId: { type: String, required: true },
      amount: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'],
      default: 'PENDING'
    },
    adminNotes: { type: String },
    mpesaTransactionId: { type: String },
    processedBy: { type: String },
    processedAt: { type: Date }
  },
  { timestamps: true }
);

// Indexes for better query performance
WithdrawalRequestSchema.index({ vendorId: 1, status: 1 });
WithdrawalRequestSchema.index({ status: 1 });
WithdrawalRequestSchema.index({ createdAt: -1 });

export default mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);*/

import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  vendorId: string;
  vendorDetails: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    mpesaNumber?: string;
    businessName?: string;
  };
  earnings: {
    earningId: string;
    amount: number;
  }[];
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  adminNotes?: string;
  mpesaTransactionId?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    vendorId: { type: String, required: true, index: true },
    vendorDetails: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      mpesaNumber: { type: String },
      businessName: { type: String }
    },
    earnings: [{
      earningId: { type: String, required: true },
      amount: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'],
      default: 'PENDING'
    },
    adminNotes: { type: String },
    mpesaTransactionId: { type: String },
    processedBy: { type: String },
    processedAt: { type: Date }
  },
  { 
    timestamps: true,
    // Add this to handle existing documents
    strict: 'throw' // or 'false' if you want to be more lenient
  }
);

// Indexes for better query performance
WithdrawalRequestSchema.index({ vendorId: 1, status: 1 });
WithdrawalRequestSchema.index({ status: 1 });
WithdrawalRequestSchema.index({ createdAt: -1 });

// Add validation to ensure earnings array is not empty
WithdrawalRequestSchema.pre('validate', function(next) {
  if (this.earnings.length === 0) {
    next(new Error('Withdrawal request must have at least one earning'));
  } else {
    next();
  }
});

export default mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);