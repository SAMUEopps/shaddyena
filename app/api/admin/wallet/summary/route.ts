import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';

import Transaction from '@/shd-models/models/Transaction';
import { WalletService } from '@/shd-lib/lib/walletService';
import MarketerEarning from '@/shd-models/models/MarketerEarning';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');
  if (!organizationId) return NextResponse.json({ error: 'organizationId required' }, { status: 400 });

  const wallet = await new WalletService().getOrCreate(organizationId);

  // Aggregate unpaid earnings per marketer
  const owed = await MarketerEarning.aggregate([
    { $match: { organizationId: new (require('mongoose').Types.ObjectId)(organizationId),
                status: { $in: ['accrued', 'approved'] } } },
    { $group: { _id: '$marketerId', owed: { $sum: '$amount' } } },
  ]);

  const recent = await Transaction.find({
    organizationId,
    category: { $in: ['wallet_deposit', 'marketer_payout'] },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({ wallet, owed, recent });
}


