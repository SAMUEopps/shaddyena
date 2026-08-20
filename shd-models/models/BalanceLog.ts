import mongoose, { Schema, Document } from 'mongoose';

export interface IBalanceLog extends Document {
  shortcode: string;
  conversationID?: string;
  originatorConversationID?: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  resultCode?: string;
  resultDesc?: string;
  error?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BalanceLogSchema = new Schema<IBalanceLog>(
  {
    shortcode: {
      type: String,
      required: true,
      index: true,
    },
    conversationID: {
      type: String,
      sparse: true,
    },
    originatorConversationID: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'TIMEOUT'],
      default: 'PENDING',
      index: true,
    },
    resultCode: {
      type: String,
    },
    resultDesc: {
      type: String,
    },
    error: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

BalanceLogSchema.index({ shortcode: 1, createdAt: -1 });

export default mongoose.models.BalanceLog || 
  mongoose.model<IBalanceLog>('BalanceLog', BalanceLogSchema);