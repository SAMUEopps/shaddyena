// // import mongoose, { Document, Schema, Types } from 'mongoose';

// // export interface IWithdrawal extends Document {
// //   vendorId: Types.ObjectId;
// //   orderId: string;
// //   ledgerEntryId: Types.ObjectId;
// //   amount: number;
// //   status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
// //   type: 'IMMEDIATE' | 'REGULAR';
// //   reason?: string;
// //   adminNotes?: string;
// //   processedBy?: Types.ObjectId;
// //   processedAt?: Date;
// //   mpesaReceipt?: string;
// //   admin: {
// //     approvedBy?: Types.ObjectId;
// //     approvedAt?: Date;
// //     rejectedBy?: Types.ObjectId;
// //     rejectedAt?: Date;
// //     rejectionReason?: string;
// //   };
// //   vendor: {
// //     mpesaNumber: string;
// //     name: string;
// //     businessName?: string;
// //   };
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const WithdrawalSchema = new Schema<IWithdrawal>({
// //   vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// //   orderId: { type: String, required: true },
// //   ledgerEntryId: { type: Schema.Types.ObjectId, ref: 'Ledger', required: true },
// //   amount: { type: Number, required: true },
// //   status: {
// //     type: String,
// //     enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSED'],
// //     default: 'PENDING'
// //   },
// //   type: {
// //     type: String,
// //     enum: ['IMMEDIATE', 'REGULAR'],
// //     default: 'REGULAR'
// //   },
// //   reason: { type: String },
// //   adminNotes: { type: String },
// //   processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
// //   processedAt: { type: Date },
// //   mpesaReceipt: { type: String },
// //   admin: {
// //     approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
// //     approvedAt: { type: Date },
// //     rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
// //     rejectedAt: { type: Date },
// //     rejectionReason: { type: String }
// //   },
// //   vendor: {
// //     mpesaNumber: { type: String, required: true },
// //     name: { type: String, required: true },
// //     businessName: { type: String }
// //   }
// // }, { timestamps: true });

// // // Indexes
// // WithdrawalSchema.index({ vendorId: 1, status: 1 });
// // WithdrawalSchema.index({ orderId: 1 });
// // WithdrawalSchema.index({ status: 1, createdAt: -1 });
// // WithdrawalSchema.index({ 'vendor.mpesaNumber': 1 });
// // WithdrawalSchema.index({ ledgerEntryId: 1 }, { unique: true }); // Prevent multiple withdrawals for same ledger entry

// // export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);

// import mongoose, { Document, Schema, Types } from 'mongoose';

// export interface IWithdrawal extends Document {
//   vendorId: Types.ObjectId;
//   orderId?: string;
//   ledgerEntryId?: Types.ObjectId;

//   amount: number;

//   status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
//   type: 'IMMEDIATE' | 'REGULAR';

//   reason?: string;
//   adminNotes?: string;

//   processedBy?: Types.ObjectId;
//   processedAt?: Date;

//   mpesaReceipt?: string;

//   admin: {
//     approvedBy?: Types.ObjectId;
//     approvedAt?: Date;

//     rejectedBy?: Types.ObjectId;
//     rejectedAt?: Date;

//     rejectionReason?: string;
//   };

//   vendor: {
//     mpesaNumber: string;
//     name: string;
//     businessName?: string;
//   };

//   createdAt: Date;
//   updatedAt: Date;
// }


// const WithdrawalSchema = new Schema<IWithdrawal>(
//   {
//     vendorId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Vendor',
//       required: true
//     },

//     orderId: {
//       type: String
//     },

//     /**
//      * Created after successful ledger posting.
//      * Multiple pending withdrawals can exist without this field.
//      */
//     ledgerEntryId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Ledger'
//     },


//     amount: {
//       type: Number,
//       required: true,
//       min: 0
//     },


//     status: {
//       type: String,
//       enum: [
//         'PENDING',
//         'APPROVED',
//         'REJECTED',
//         'PROCESSED'
//       ],
//       default: 'PENDING'
//     },


//     type: {
//       type: String,
//       enum: [
//         'IMMEDIATE',
//         'REGULAR'
//       ],
//       default: 'REGULAR'
//     },


//     reason: {
//       type: String
//     },


//     adminNotes: {
//       type: String
//     },


//     processedBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User'
//     },


//     processedAt: {
//       type: Date
//     },


//     mpesaReceipt: {
//       type: String
//     },


//     admin: {
//       approvedBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//       },

//       approvedAt: {
//         type: Date
//       },


//       rejectedBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//       },


//       rejectedAt: {
//         type: Date
//       },


//       rejectionReason: {
//         type: String
//       }
//     },


//     vendor: {
//       mpesaNumber: {
//         type: String,
//         required: true
//       },

//       name: {
//         type: String,
//         required: true
//       },

//       businessName: {
//         type: String
//       }
//     }

//   },
//   {
//     timestamps: true
//   }
// );


// // ==========================
// // INDEXES
// // ==========================

// // Vendor withdrawal history
// WithdrawalSchema.index({
//   vendorId: 1,
//   status: 1
// });


// // Search by order
// WithdrawalSchema.index({
//   orderId: 1
// });


// // Latest withdrawals
// WithdrawalSchema.index({
//   status: 1,
//   createdAt: -1
// });


// // Vendor MPESA lookup
// WithdrawalSchema.index({
//   'vendor.mpesaNumber': 1
// });


// // Only enforce uniqueness when ledgerEntryId exists
// WithdrawalSchema.index(
//   {
//     ledgerEntryId: 1
//   },
//   {
//     unique: true,
//     sparse: true
//   }
// );



// export default mongoose.models.Withdrawal ||
//   mongoose.model<IWithdrawal>(
//     'Withdrawal',
//     WithdrawalSchema
//   );

// shd-models/models/Withdrawal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
  vendorId: mongoose.Types.ObjectId;
  amount: number;
  method: 'MPESA' | 'BANK';
  phoneNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference: string;
  transactionId?: string;
  errorMessage?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['MPESA', 'BANK'], required: true },
  phoneNumber: { type: String },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  reference: { type: String, required: true, unique: true },
  transactionId: { type: String },
  errorMessage: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
WithdrawalSchema.index({ vendorId: 1 });
WithdrawalSchema.index({ reference: 1 });
WithdrawalSchema.index({ transactionId: 1 });
WithdrawalSchema.index({ status: 1 });

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);