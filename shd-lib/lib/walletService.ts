import mongoose from 'mongoose';
import Transaction from '@/shd-models/models/Transaction';
import MarketerEarning from '@/shd-models/models/MarketerEarning';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Wallet from '@/shd-models/models/Wallet';

export class WalletService {
  /** Get or create the org wallet */
  async getOrCreate(organizationId: string) {
    await connectToDatabase();
    return Wallet.findOneAndUpdate(
      { organizationId },
      { $setOnInsert: { organizationId, currency: 'KES' } },
      { upsert: true, new: true }
    );
  }

  /**
   * CREDIT on successful deposit.
   * Must be idempotent — callbacks can arrive twice.
   */
  async creditDeposit(params: {
    organizationId: string;
    amount: number;
    transactionId: string;      // Mongo _id of Transaction
    transactionRef: string;     // human transactionId
    receipt?: string;
  }) {
    const wallet = await this.getOrCreate(params.organizationId);

    // idempotency — has this deposit already been applied?
    const alreadyApplied = (wallet as any).appliedDeposits?.includes(
      params.transactionId
    );
    if (alreadyApplied) return wallet;

    wallet.balance += params.amount;
    wallet.availableBalance += params.amount;
    wallet.totalDeposited += params.amount;

    // keep a small ring buffer for idempotency (or use a separate collection)
    (wallet as any).appliedDeposits = [
      ...((wallet as any).appliedDeposits || []),
      params.transactionId,
    ].slice(-500);

    await wallet.save();
    return wallet;
  }

  /**
   * RESERVE funds at payout initiation.
   * Throws if insufficient available balance.
   */
  async reservePayout(params: {
    organizationId: string;
    amount: number;
    transactionId: string;
  }) {
    const wallet = await this.getOrCreate(params.organizationId);

    if (wallet.availableBalance < params.amount) {
      throw new Error(
        `Insufficient wallet balance. Available: ${wallet.availableBalance}, required: ${params.amount}`
      );
    }

    wallet.availableBalance -= params.amount;
    wallet.pendingPayouts += params.amount;

    await wallet.save();
    return wallet;
  }

  /**
   * COMMIT on B2C success — the reserve becomes actual spend.
   */
  async commitPayout(params: {
    organizationId: string;
    amount: number;
  }) {
    const wallet = await this.getOrCreate(params.organizationId);

    wallet.pendingPayouts = Math.max(0, wallet.pendingPayouts - params.amount);
    wallet.balance = Math.max(0, wallet.balance - params.amount);
    wallet.totalDisbursed += params.amount;

    await wallet.save();
    return wallet;
  }

  /**
   * REFUND on B2C failure/timeout — release the reserve back to available.
   */
  async refundPayout(params: {
    organizationId: string;
    amount: number;
  }) {
    const wallet = await this.getOrCreate(params.organizationId);

    wallet.pendingPayouts = Math.max(0, wallet.pendingPayouts - params.amount);
    wallet.availableBalance += params.amount;

    await wallet.save();
    return wallet;
  }

  /** Mark a set of earnings as paid by a specific payout transaction */
  async markEarningsPaid(earningIds: string[], payoutTransactionId: string) {
    if (!earningIds.length) return;
    await MarketerEarning.updateMany(
      { _id: { $in: earningIds } },
      {
        $set: {
          status: 'paid',
          paidAt: new Date(),
          payoutTransactionId,
        },
      }
    );
  }
}