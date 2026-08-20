// import mongoose, { Schema, Document } from 'mongoose';

// export interface IBalance extends Document {
//   shortcode: string;
//   accountName: string;
//   balance: number;
//   currency: string;
//   fullBalance: string;
//   resultCode: string;
//   resultDesc: string;
//   conversationID?: string;
//   originatorConversationID?: string;
//   transactionID?: string;
//   timestamp: Date;
//   expiresAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const BalanceSchema = new Schema<IBalance>(
//   {
//     shortcode: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     accountName: {
//       type: String,
//       required: true,
//     },
//     balance: {
//       type: Number,
//       required: true,
//     },
//     currency: {
//       type: String,
//       default: 'KES',
//     },
//     fullBalance: {
//       type: String,
//       required: true,
//     },
//     resultCode: {
//       type: String,
//       required: true,
//     },
//     resultDesc: {
//       type: String,
//       required: true,
//     },
//     conversationID: {
//       type: String,
//       sparse: true,
//     },
//     originatorConversationID: {
//       type: String,
//       sparse: true,
//     },
//     transactionID: {
//       type: String,
//       sparse: true,
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//     expiresAt: {
//       type: Date,
//       default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Index for TTL (auto-delete after expiry)
// BalanceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// // Index for querying latest balance
// BalanceSchema.index({ shortcode: 1, timestamp: -1 });

// export default mongoose.models.Balance || mongoose.model<IBalance>('Balance', BalanceSchema);


import mongoose, { Schema, Document } from 'mongoose';

export interface IBalance extends Document {
  shortcode: string;
  accountName: string;
  balance: number;
  currency: string;
  fullBalance: string;
  resultCode: string;
  resultDesc: string;
  conversationID?: string;
  originatorConversationID?: string;
  transactionID?: string;
  timestamp: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BalanceSchema = new Schema<IBalance>(
  {
    shortcode: {
      type: String,
      required: true,
      index: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'KES',
    },
    fullBalance: {
      type: String,
      required: true,
    },
    resultCode: {
      type: String,
      required: true,
    },
    resultDesc: {
      type: String,
      required: true,
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
    timestamp: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  }
);

// Index for TTL (auto-delete after expiry)
BalanceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for querying latest balance
BalanceSchema.index({ shortcode: 1, timestamp: -1 });

export default mongoose.models.Balance || mongoose.model<IBalance>('Balance', BalanceSchema);