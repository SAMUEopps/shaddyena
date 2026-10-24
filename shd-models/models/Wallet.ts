import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWallet extends Document {
  organizationId: mongoose.Types.ObjectId;
  currency: string;
  /** Funds confirmed by M-Pesa (deposits succeeded, payouts succeeded) */
  balance: number;
  /** balance - pendingPayouts (what admin can actually disburse now) */
  availableBalance: number;
  /** B2C payouts in-flight (pending/processing) */
  pendingPayouts: number;
  /** lifetime totals for reporting */
  totalDeposited: number;
  totalDisbursed: number;
  /** optimistic concurrency */
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      unique: true,
    },
    currency: { type: String, default: 'KES', uppercase: true, trim: true },
    balance: { type: Number, default: 0, min: 0 },
    availableBalance: { type: Number, default: 0, min: 0 },
    pendingPayouts: { type: Number, default: 0, min: 0 },
    totalDeposited: { type: Number, default: 0 },
    totalDisbursed: { type: Number, default: 0 },
    version: { type: Number, default: 0 },
  },
  { timestamps: true }
);

WalletSchema.index({ organizationId: 1 }, { unique: true });

const Wallet: Model<IWallet> =
  mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);

export default Wallet;