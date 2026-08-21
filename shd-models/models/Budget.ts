// // shd-models/models/Budget.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IBudget extends Document {
//   allocatedAmount: number;
//   spentAmount: number;
//   platformFees: number;
//   remainingAmount: number;
//   weekStart: string;
//   weekEnd: string;
//   status: 'active' | 'closed' | 'overdrawn';
//   createdBy: mongoose.Types.ObjectId;
//   organizationId: mongoose.Types.ObjectId;
//   metadata?: any;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const BudgetSchema = new Schema<IBudget>({
//   allocatedAmount: { type: Number, default: 0 },
//   spentAmount: { type: Number, default: 0 },
//   platformFees: { type: Number, default: 0 },
//   remainingAmount: { type: Number, default: 0 },
//   weekStart: { type: String, required: true },
//   weekEnd: { type: String, required: true },
//   status: { 
//     type: String, 
//     enum: ['active', 'closed', 'overdrawn'],
//     default: 'active'
//   },
//   createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
//   metadata: { type: Schema.Types.Mixed },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// BudgetSchema.index({ status: 1 });
// BudgetSchema.index({ organizationId: 1 });
// BudgetSchema.index({ weekStart: 1, weekEnd: 1 });

// export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

// shd-models/models/Budget.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  allocatedAmount: number;
  spentAmount: number;
  platformFees: number;
  remainingAmount: number;
  weekStart: string;
  weekEnd: string;
  status: 'active' | 'closed' | 'overdrawn';
  createdBy: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  allocatedAmount: { type: Number, default: 0 },
  spentAmount: { type: Number, default: 0 },
  platformFees: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  weekStart: { type: String, required: true },
  weekEnd: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'overdrawn'],
    default: 'active'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BudgetSchema.index({ status: 1 });
BudgetSchema.index({ organizationId: 1 });
BudgetSchema.index({ weekStart: 1, weekEnd: 1 });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);