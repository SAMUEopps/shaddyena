// shd-models/models/Organization.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  settings: {
    weeklyBudget: number;
    monthlyBudget: number;
    approvalThresholds: {
      admin: number;
      director: number;
    };
    categories: Array<{
      name: string;
      maxAmount: number;
      isActive: boolean;
    }>;
    platformFeePercentage: number;
    feeBearer: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  settings: {
    weeklyBudget: { type: Number, default: 10000 },
    monthlyBudget: { type: Number, default: 40000 },
    approvalThresholds: {
      admin: { type: Number, default: 5000 },
      director: { type: Number, default: 20000 }
    },
    categories: [{
      name: { type: String, required: true },
      maxAmount: { type: Number, default: 5000 },
      isActive: { type: Boolean, default: true }
    }],
    platformFeePercentage: { type: Number, default: 0 },
    feeBearer: { type: String, enum: ['payer', 'recipient', 'platform'], default: 'payer' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);