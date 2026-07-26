// app/api/admin/users/stats/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const [
      totalUsers,
      roleStats,
      memberStats,
      verifiedStats,
      totalEarnings
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$isMember', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$isVerified', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { 
          _id: null, 
          totalReferralEarnings: { $sum: '$referralEarnings' },
          totalCommissionEarnings: { $sum: '$referralCommissionEarnings' },
          totalSubscriptionEarnings: { $sum: '$referralSubscriptionEarnings' },
          totalSavings: { $sum: '$totalSavings' },
          totalInvestments: { $sum: '$totalInvestments' },
          totalBalance: { $sum: '$availableBalance' }
        }}
      ])
    ]);

    const getCount = (arr: any[], id: any) => {
      const found = arr.find(item => item._id === id);
      return found ? found.count : 0;
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        roles: roleStats,
        members: {
          members: getCount(memberStats, true),
          nonMembers: getCount(memberStats, false)
        },
        verified: {
          verified: getCount(verifiedStats, true),
          unverified: getCount(verifiedStats, false)
        },
        earnings: totalEarnings[0] || {
          totalReferralEarnings: 0,
          totalCommissionEarnings: 0,
          totalSubscriptionEarnings: 0,
          totalSavings: 0,
          totalInvestments: 0,
          totalBalance: 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}