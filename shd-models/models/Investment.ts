// C:\Users\USER\Desktop\Projects\my-app\models\Investment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'TRANSPORT' | 'MARKETING' | 'TECHNOLOGY' | 'STARTUP';
  amount: number;
  returns: number;
  status: 'active' | 'completed' | 'cancelled';
  duration: number; // in months
  startDate: Date;
  endDate: Date;
  expectedReturn: number;
  actualReturn?: number;
  createdAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['TRANSPORT', 'MARKETING', 'TECHNOLOGY', 'STARTUP'],
    required: true
  },
  amount: { type: Number, required: true },
  returns: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  duration: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  expectedReturn: { type: Number, required: true },
  actualReturn: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);