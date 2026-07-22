// app/api/referral/earnings/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ReferralPayout from '@/shd-models/models/ReferralPayout';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get total referrals count
    const totalReferrals = user.referrals?.length || 0;

    // Get vendor referrals count (users who registered as vendors)
    const vendorReferrals = await User.countDocuments({
      referralCode: { $in: user.referrals || [] },
      role: 'vendor'
    });

    // Get total earnings from payouts
    const payouts = await ReferralPayout.aggregate([
      { $match: { referrerId: user._id } },
      { 
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          pending: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] 
            }
          }
        }
      }
    ]);

    let orderCommissions = 0;
    let subscriptionCommissions = 0;
    let pendingPayouts = 0;

    payouts.forEach((p: { _id: string; total: number; pending: any; }) => {
      if (p._id === 'order_commission') {
        orderCommissions = p.total || 0;
        pendingPayouts += p.pending || 0;
      } else if (p._id === 'subscription_commission') {
        subscriptionCommissions = p.total || 0;
        pendingPayouts += p.pending || 0;
      }
    });

    const totalReferralEarnings = user.referralEarnings || 0;

    return NextResponse.json({
      totalReferralEarnings,
      orderCommissions,
      subscriptionCommissions,
      pendingPayouts,
      totalReferrals,
      vendorReferrals
    });

  } catch (error) {
    console.error('Error fetching referral earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}