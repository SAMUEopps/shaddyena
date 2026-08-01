// app/api/admin/referrals/route.ts
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'referralEarnings';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minReferrals = parseInt(searchParams.get('minReferrals') || '0');
    const hasReferred = searchParams.get('hasReferred');

    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { referralCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (hasReferred === 'true') {
      query.referrals = { $exists: true, $ne: [] };
    } else if (hasReferred === 'false') {
      query.$or = [
        { referrals: { $exists: false } },
        { referrals: { $size: 0 } }
      ];
    }

    if (minReferrals > 0) {
      query.referrals = { $size: { $gte: minReferrals } };
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('name email phoneNumber referralCode referredBy referrals referralEarnings referralCommissionEarnings referralSubscriptionEarnings isMember isVerified createdAt')
      .sort(sortOptions);

    // Get referral statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalWithReferrals: { 
            $sum: { 
              $cond: [{ $gt: [{ $size: { $ifNull: ['$referrals', []] } }, 0] }, 1, 0] 
            } 
          },
          totalReferrals: { $sum: { $size: { $ifNull: ['$referrals', []] } } },
          totalReferralEarnings: { $sum: '$referralEarnings' },
          totalReferralCommission: { $sum: '$referralCommissionEarnings' },
          totalReferralSubscription: { $sum: '$referralSubscriptionEarnings' },
          avgReferralsPerUser: { $avg: { $size: { $ifNull: ['$referrals', []] } } },
          maxReferrals: { $max: { $size: { $ifNull: ['$referrals', []] } } }
        }
      }
    ]);

    // Get top referrers
    const topReferrers = await User.aggregate([
      { $match: { referrals: { $exists: true, $ne: [] } } },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          referralCode: 1,
          referralCount: { $size: '$referrals' },
          referralEarnings: 1,
          referralCommissionEarnings: 1,
          referralSubscriptionEarnings: 1,
          isMember: 1,
          isVerified: 1
        }
      },
      { $sort: { referralCount: -1 } },
      { $limit: 10 }
    ]);

    // Get referral earning distribution
    const earningDistribution = await User.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$referralEarnings' },
          totalCommission: { $sum: '$referralCommissionEarnings' },
          totalSubscription: { $sum: '$referralSubscriptionEarnings' },
          avgEarnings: { $avg: '$referralEarnings' },
          avgCommission: { $avg: '$referralCommissionEarnings' },
          avgSubscription: { $avg: '$referralSubscriptionEarnings' },
          maxEarnings: { $max: '$referralEarnings' },
          maxCommission: { $max: '$referralCommissionEarnings' },
          maxSubscription: { $max: '$referralSubscriptionEarnings' }
        }
      }
    ]);

    // Get referral tree depth stats (basic)
    const referralTreeStats = await User.aggregate([
      { $match: { referredBy: { $ne: null } } },
      {
        $group: {
          _id: '$referredBy',
          referralsCount: { $sum: 1 }
        }
      },
      { $sort: { referralsCount: -1 } },
      { $limit: 20 }
    ]);

    return NextResponse.json({
      success: true,
      referrals: users,
      total: users.length,
      stats: stats[0] || {
        totalUsers: 0,
        totalWithReferrals: 0,
        totalReferrals: 0,
        totalReferralEarnings: 0,
        totalReferralCommission: 0,
        totalReferralSubscription: 0,
        avgReferralsPerUser: 0,
        maxReferrals: 0
      },
      topReferrers,
      earningDistribution: earningDistribution[0] || {
        totalEarnings: 0,
        totalCommission: 0,
        totalSubscription: 0,
        avgEarnings: 0,
        avgCommission: 0,
        avgSubscription: 0,
        maxEarnings: 0,
        maxCommission: 0,
        maxSubscription: 0
      },
      referralTreeStats
    });

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}