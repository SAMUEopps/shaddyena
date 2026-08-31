// // shd-models/models/ExpenseRequest.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IExpenseRequest extends Document {
//   amount: number;
//   platformFee: number;
//   totalAmount: number;
//   recipientPhone: string;
//   recipientName: string;
//   category: string;
//   description: string;
//   status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed' | 'processing';
//   requesterId: mongoose.Types.ObjectId;
//   approverId?: mongoose.Types.ObjectId;
//   rejectionReason?: string;
//   receiptUrl?: string;
//   mpesaReference?: string;
//   approvedAt?: Date;
//   rejectedAt?: Date;
//   paidAt?: Date;
//   metadata?: any;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ExpenseRequestSchema = new Schema<IExpenseRequest>({
//   amount: { type: Number, required: true },
//   platformFee: { type: Number, default: 0 },
//   totalAmount: { type: Number, required: true },
//   recipientPhone: { type: String, required: true },
//   recipientName: { type: String, default: 'Unknown' },
//   category: { type: String, required: true },
//   description: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'paid', 'failed', 'processing'],
//     default: 'pending'
//   },
//   requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   approverId: { type: Schema.Types.ObjectId, ref: 'User' },
//   rejectionReason: { type: String },
//   receiptUrl: { type: String },
//   mpesaReference: { type: String },
//   approvedAt: { type: Date },
//   rejectedAt: { type: Date },
//   paidAt: { type: Date },
//   metadata: { type: Schema.Types.Mixed },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// ExpenseRequestSchema.index({ requesterId: 1 });
// ExpenseRequestSchema.index({ status: 1 });

// export default mongoose.models.ExpenseRequest || mongoose.model<IExpenseRequest>('ExpenseRequest', ExpenseRequestSchema);


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
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed' | 'processing';
  requesterId: mongoose.Types.ObjectId;
  approverId?: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId; // NEW: Organization reference
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

const ExpenseRequestSchema = new Schema<IExpenseRequest>(
  {
    amount: { 
      type: Number, 
      required: true,
      min: 0
    },
    platformFee: { 
      type: Number, 
      default: 0,
      min: 0
    },
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0
    },
    recipientPhone: { 
      type: String, 
      required: true,
      trim: true
    },
    recipientName: { 
      type: String, 
      default: 'Unknown',
      trim: true
    },
    category: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid', 'failed', 'processing'],
      default: 'pending'
    },
    requesterId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    approverId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    organizationId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Organization', 
      required: true 
    },
    rejectionReason: { 
      type: String,
      trim: true
    },
    receiptUrl: { 
      type: String,
      trim: true
    },
    mpesaReference: { 
      type: String,
      trim: true
    },
    approvedAt: { 
      type: Date 
    },
    rejectedAt: { 
      type: Date 
    },
    paidAt: { 
      type: Date 
    },
    metadata: { 
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true // This will automatically manage createdAt and updatedAt
  }
);

// ============================================================
// INDEXES
// ============================================================

// Organization + Status - for filtering requests by org
ExpenseRequestSchema.index({ 
  organizationId: 1, 
  status: 1 
});

// Organization + CreatedAt - for fetching org requests by date
ExpenseRequestSchema.index({ 
  organizationId: 1, 
  createdAt: -1 
});

// Requester + Organization - for finding a user's requests in an org
ExpenseRequestSchema.index({ 
  requesterId: 1, 
  organizationId: 1 
});

// Status + CreatedAt - for processing pending requests
ExpenseRequestSchema.index({ 
  status: 1, 
  createdAt: -1 
});

// Organization + Category - for category-based reporting
ExpenseRequestSchema.index({ 
  organizationId: 1, 
  category: 1 
});

// ============================================================
// MODEL EXPORT
// ============================================================

export default mongoose.models.ExpenseRequest || 
  mongoose.model<IExpenseRequest>('ExpenseRequest', ExpenseRequestSchema);