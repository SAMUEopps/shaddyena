/*import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: { type: String, required: true },

    phone: { type: String, required: true },

    amount: { type: Number, required: true },

    // First log from STK Push API
    stkRequest: { type: Object, default: {} },

    // Second log from Callback
    stkCallback: { type: Object, default: {} },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    mpesaReceipt: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||mongoose.model("Payment", PaymentSchema);*/

import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // Who paid (vendor)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Who referred the payer (nullable)
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    planId: { type: String, required: true },

    phone: { type: String, required: true },

    amount: { type: Number, required: true },

    // Locked referral bonus (IMPORTANT)
    referralBonus: {
      type: Number,
      default: 0,
    },

    referralBonusPaid: {
      type: Boolean,
      default: false,
    },

    stkRequest: { type: Object, default: {} },
    stkCallback: { type: Object, default: {} },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
      index: true,
    },

    mpesaReceipt: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
