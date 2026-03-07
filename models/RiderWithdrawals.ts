// models/Withdrawal.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IRiderWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  userRole: 'delivery' | 'vendor';
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'M-PESA' | 'BANK_TRANSFER';
  phoneNumber?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode?: string;
  };
  reference?: string;
  mpesaReceipt?: string;
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RiderWithdrawalSchema = new Schema<IRiderWithdrawal>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userRole: { 
    type: String, 
    enum: ['delivery', 'vendor'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: [50, 'Minimum withdrawal amount is 50'] 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: { 
    type: String, 
    enum: ['M-PESA', 'BANK_TRANSFER'],
    required: true 
  },
  phoneNumber: { 
    type: String,
    required: function(this: IRiderWithdrawal) {
      return this.paymentMethod === 'M-PESA';
    }
  },
  bankDetails: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    branchCode: { type: String }
  },
  reference: { 
    type: String,
    unique: true,
    sparse: true
  },
  mpesaReceipt: { 
    type: String 
  },
  processedAt: { 
    type: Date 
  },
  notes: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Indexes
RiderWithdrawalSchema.index({ userId: 1, createdAt: -1 });
RiderWithdrawalSchema.index({ status: 1 });
RiderWithdrawalSchema.index({ reference: 1 });

export default mongoose.models.Withdrawal || mongoose.model<IRiderWithdrawal>('RiderWithdrawal', RiderWithdrawalSchema);