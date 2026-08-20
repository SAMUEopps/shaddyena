import mongoose, { Schema, Document } from 'mongoose';

export interface ITransactionLog extends Document {
  transactionType: 'BALANCE_QUERY' | 'STK_PUSH' | 'B2C' | 'B2B' | 'REVERSAL';
  shortcode: string;
  conversationID?: string;
  originatorConversationID?: string;
  transactionID?: string;
  requestPayload: any;
  responsePayload?: any;
  webhookPayload?: any;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  resultCode?: string;
  resultDesc?: string;
  error?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionLogSchema = new Schema<ITransactionLog>(
  {
    transactionType: {
      type: String,
      enum: ['BALANCE_QUERY', 'STK_PUSH', 'B2C', 'B2B', 'REVERSAL'],
      required: true,
      index: true,
    },
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
    transactionID: {
      type: String,
      sparse: true,
    },
    requestPayload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    responsePayload: {
      type: Schema.Types.Mixed,
    },
    webhookPayload: {
      type: Schema.Types.Mixed,
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

// Index for efficient querying
TransactionLogSchema.index({ shortcode: 1, transactionType: 1, createdAt: -1 });

export default mongoose.models.TransactionLog || 
  mongoose.model<ITransactionLog>('TransactionLog', TransactionLogSchema);