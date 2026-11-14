// app/api/admin/wallet/marketers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    // Base query: only marketers (optionally scoped to org)
    const query: any = { role: 'marketer' };
    if (organizationId) query.organizationId = organizationId;

    const marketers = await User.find(query)
      .select(
        '_id name email phoneNumber marketerStatus marketerTier ' +
          'totalCommissions totalReferralsMade availableBalance ' +
          'referralEarnings referralCommissionEarnings referralSubscriptionEarnings ' +
          'payoutMethod payoutDetails'
      )
      .sort({ name: 1 })
      .lean();

    // Compute owed = totalCommissions - (sum of completed/processing withdrawals)
    const ids = marketers.map((m: any) => m._id);

    const withdrawalAgg = await MarketerWithdrawal.aggregate([
      {
        $match: {
          marketerId: { $in: ids },
          status: { $in: ['pending', 'processing', 'completed'] },
        },
      },
      {
        $group: {
          _id: '$marketerId',
          disbursed: { $sum: '$amount' },
        },
      },
    ]);

    const disbursedMap = new Map(
      withdrawalAgg.map((w: any) => [String(w._id), w.disbursed])
    );

    const result = marketers.map((m: any) => {
      // totalCommissions is the lifetime earned amount
      const earned = Number(m.totalCommissions || 0);
      const disbursed = Number(disbursedMap.get(String(m._id)) || 0);
      const owed = Math.max(0, earned - disbursed);

      return {
        _id: String(m._id),
        name: m.name,
        email: m.email,
        phoneNumber: m.phoneNumber,
        marketerStatus: m.marketerStatus,
        marketerTier: m.marketerTier,
        totalCommissions: earned,
        totalReferralsMade: m.totalReferralsMade || 0,
        disbursed,
        owed,
        payoutMethod: m.payoutMethod,
        payoutDetails: m.payoutDetails,
      };
    });

    return NextResponse.json({ marketers: result });
  } catch (error: any) {
    console.error('[ADMIN MARKETERS LIST]', error);
    return NextResponse.json(
      { error: 'Failed to load marketers', details: error.message },
      { status: 500 }
    );
  }
}


