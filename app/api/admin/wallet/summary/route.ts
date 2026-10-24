// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// import Transaction from '@/shd-models/models/Transaction';
// import { WalletService } from '@/shd-lib/lib/walletService';
// import MarketerEarning from '@/shd-models/models/MarketerEarning';

// export async function GET(req: NextRequest) {
//   await connectToDatabase();
//   const { searchParams } = new URL(req.url);
//   const organizationId = searchParams.get('organizationId');
//   if (!organizationId) return NextResponse.json({ error: 'organizationId required' }, { status: 400 });

//   const wallet = await new WalletService().getOrCreate(organizationId);

//   // Aggregate unpaid earnings per marketer
//   const owed = await MarketerEarning.aggregate([
//     { $match: { organizationId: new (require('mongoose').Types.ObjectId)(organizationId),
//                 status: { $in: ['accrued', 'approved'] } } },
//     { $group: { _id: '$marketerId', owed: { $sum: '$amount' } } },
//   ]);

//   const recent = await Transaction.find({
//     organizationId,
//     category: { $in: ['wallet_deposit', 'marketer_payout'] },
//   })
//     .sort({ createdAt: -1 })
//     .limit(20)
//     .lean();

//   return NextResponse.json({ wallet, owed, recent });
// }



import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import { WalletService } from '@/shd-lib/lib/walletService';
import MarketerEarning from '@/shd-models/models/MarketerEarning';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId required' },
        { status: 400 }
      );
    }

    // Validate the organization ID before querying MongoDB.
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json(
        { error: 'Invalid organizationId' },
        { status: 400 }
      );
    }

    const organizationObjectId = new mongoose.Types.ObjectId(
      organizationId
    );

    // Retrieve or initialize the organization's wallet.
    const wallet = await new WalletService().getOrCreate(
      organizationId
    );

    // Aggregate unpaid earnings by marketer.
    const owed = await MarketerEarning.aggregate([
      {
        $match: {
          organizationId: organizationObjectId,
          status: { $in: ['accrued', 'approved'] },
        },
      },
      {
        $group: {
          _id: '$marketerId',
          owed: { $sum: '$amount' },
        },
      },
    ]);

    // Retrieve recent wallet deposits and marketer payouts.
    const recent = await Transaction.find({
      organizationId: organizationObjectId,
      category: {
        $in: ['wallet_deposit', 'marketer_payout'],
      },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      wallet,
      owed,
      recent,
    });
  } catch (error) {
    console.error('Wallet summary error:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve wallet summary' },
      { status: 500 }
    );
  }
}
