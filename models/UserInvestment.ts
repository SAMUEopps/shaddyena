// models/UserInvestment.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserInvestment extends Document {
  userId: Types.ObjectId;
  fundId: Types.ObjectId;
  investedAmount: number;
  returnRate: number;
  expectedReturn: number;
  maturityDate: Date;
  status: 'active' | 'completed' | 'withdrawn' | 'pending';
  returnsPaid: boolean;
  actualReturn?: number;
  withdrawnAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userInvestmentSchema = new Schema<IUserInvestment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'MembershipUser', required: true },
    fundId: { type: Schema.Types.ObjectId, ref: 'InvestmentFund', required: true },
    investedAmount: { type: Number, required: true },
    returnRate: { type: Number, required: true },
    expectedReturn: { type: Number, required: true },
    maturityDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'withdrawn', 'pending'], default: 'pending' },
    returnsPaid: { type: Boolean, default: false },
    actualReturn: { type: Number },
    withdrawnAt: { type: Date },
  },
  { timestamps: true }
);

userInvestmentSchema.index({ userId: 1 });
userInvestmentSchema.index({ fundId: 1 });
userInvestmentSchema.index({ status: 1 });
userInvestmentSchema.index({ maturityDate: 1 });

export default mongoose.models.UserInvestment || mongoose.model<IUserInvestment>('UserInvestment', userInvestmentSchema);