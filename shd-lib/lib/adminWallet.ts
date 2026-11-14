// shd-lib/lib/adminWallet.ts
import mongoose from 'mongoose';
import Transaction from '@/shd-models/models/Transaction';

export type AdminWalletSummary = {
  balance: number;            // total deposits (success)
  availableBalance: number;   // deposits - paid out - reserved
  pendingPayouts: number;     // sum of pending/processing payouts
  totalDeposited: number;     // sum of successful deposits
  totalDisbursed: number;     // sum of successful payouts
  currency: string;
};

/**
 * Computes the admin wallet balance for an organization.
 *
 * Rules:
 *  - `wallet_deposit` in `success`  → increases balance
 *  - `marketer_payout` in `success` → decreases balance
 *  - `marketer_payout` in `pending` or `processing` → reserved
 *    (subtracted from availableBalance so we don't double-spend)
 *  - anything `failed` / `cancelled` → ignored
 */
export async function getAdminWalletSummary(
  organizationId: string | mongoose.Types.ObjectId
): Promise<AdminWalletSummary> {
  const orgId = new mongoose.Types.ObjectId(String(organizationId));

  const rows = await Transaction.aggregate([
    {
      $match: {
        organizationId: orgId,
        category: { $in: ['wallet_deposit', 'marketer_payout'] },
        status: { $in: ['pending', 'processing', 'success'] },
      },
    },
    {
      $group: {
        _id: {
          category: '$category',
          status: '$status',
        },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const acc = (cat: string, st: string) =>
    Number(
      rows.find(
        (r) => r._id.category === cat && r._id.status === st
      )?.total ?? 0
    );

  const depositsSuccess = acc('wallet_deposit', 'success');
  const depositsPending = acc('wallet_deposit', 'pending') +
                          acc('wallet_deposit', 'processing');

  const payoutSuccess   = acc('marketer_payout', 'success');
  const payoutReserved  = acc('marketer_payout', 'pending') +
                          acc('marketer_payout', 'processing');

  const balance = depositsSuccess;                    // cleared funds in
  const totalDisbursed = payoutSuccess;
  const pendingPayouts = payoutReserved;

  // Available = cleared deposits − already paid − currently in-flight
  const availableBalance = Math.max(
    0,
    depositsSuccess - payoutSuccess - payoutReserved
  );

  return {
    balance,
    availableBalance,
    pendingPayouts,
    totalDeposited: depositsSuccess + depositsPending,
    totalDisbursed,
    currency: 'KES',
  };
}