// app/models/ReferralWithdrawal.ts
import mongoose from "mongoose";

export interface IReferralWithdrawal extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "approved" | "completed" | "rejected";
  mpesaTransactionCode?: string;
  paymentMethod: "mpesa" | "bank";
  phoneNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  adminNotes?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  requestedAt: Date;
  completedAt?: Date;
}

const ReferralWithdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
      index: true,
    },
    mpesaTransactionCode: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["mpesa", "bank"],
      required: true,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    adminNotes: {
      type: String,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for performance
ReferralWithdrawalSchema.index({ userId: 1, status: 1 });
ReferralWithdrawalSchema.index({ createdAt: -1 });

export default mongoose.models.ReferralWithdrawal ||
  mongoose.model<IReferralWithdrawal>(
    "ReferralWithdrawal",
    ReferralWithdrawalSchema
  );