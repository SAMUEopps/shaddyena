import mongoose from "mongoose";

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

export default mongoose.models.Payment ||mongoose.model("Payment", PaymentSchema);