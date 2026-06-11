// models/InvestmentFund.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestmentFund extends Document {
  title: string;
  category: 'marketing' | 'transport' | 'tech' | 'startup';
  description: string;
  longDescription?: string;
  minimumInvestment: number;
  durationMonths: number;
  projectedReturnRate: number; // as percentage
  totalFundTarget: number;
  currentFundAmount: number;
  expectedReturnAmount?: number;
  startDate?: Date;
  endDate?: Date;
  status: 'active' | 'funding' | 'closed' | 'completed';
  features?: string[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const investmentFundSchema = new Schema<IInvestmentFund>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['marketing', 'transport', 'tech', 'startup'], required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    minimumInvestment: { type: Number, required: true, min: 5000 },
    durationMonths: { type: Number, required: true },
    projectedReturnRate: { type: Number, required: true },
    totalFundTarget: { type: Number, required: true },
    currentFundAmount: { type: Number, default: 0 },
    expectedReturnAmount: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'funding', 'closed', 'completed'], default: 'funding' },
    features: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

investmentFundSchema.index({ category: 1 });
investmentFundSchema.index({ status: 1 });

export default mongoose.models.InvestmentFund || mongoose.model<IInvestmentFund>('InvestmentFund', investmentFundSchema);