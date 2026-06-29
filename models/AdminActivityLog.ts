// models/AdminActivityLog.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAdminActivityLog extends Document {
  adminId: Types.ObjectId;
  action: string;
  targetType: 'user' | 'savings' | 'investment' | 'transaction' | 'fund';
  targetId?: Types.ObjectId;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const adminActivityLogSchema = new Schema<IAdminActivityLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'MembershipUser', required: true },
    action: { type: String, required: true },
    targetType: { 
      type: String, 
      enum: ['user', 'savings', 'investment', 'transaction', 'fund'],
      required: true 
    },
    targetId: { type: Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

adminActivityLogSchema.index({ adminId: 1, createdAt: -1 });
adminActivityLogSchema.index({ targetType: 1, targetId: 1 });

export default mongoose.models.AdminActivityLog || mongoose.model<IAdminActivityLog>('AdminActivityLog', adminActivityLogSchema);