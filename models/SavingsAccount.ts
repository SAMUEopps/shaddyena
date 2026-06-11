// models/SavingsAccount.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISavingsAccount extends Document {
  userId: Types.ObjectId;
  contributionType: 'daily' | 'weekly' | 'monthly';
  contributionAmount: number;
  totalSaved: number;
  availableBalance: number;
  investedBalance: number;
  status: 'active' | 'frozen' | 'closed';
  lastContributionDate?: Date;
  nextContributionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const savingsAccountSchema = new Schema<ISavingsAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'MembershipUser', required: true },
    contributionType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    contributionAmount: { type: Number, required: true, min: 100 },
    totalSaved: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    investedBalance: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'frozen', 'closed'], default: 'active' },
    lastContributionDate: { type: Date },
    nextContributionDate: { type: Date },
  },
  { timestamps: true }
);

savingsAccountSchema.index({ userId: 1 });
savingsAccountSchema.index({ status: 1 });

export default mongoose.models.SavingsAccount || mongoose.model<ISavingsAccount>('SavingsAccount', savingsAccountSchema);