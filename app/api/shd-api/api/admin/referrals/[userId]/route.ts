// app/api/admin/referrals/[userId]/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ userId: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { userId } = await params;
    
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get the user with their referrals
    const user = await User.findById(userId)
      .select('name email phoneNumber referralCode referredBy referrals referralEarnings referralCommissionEarnings referralSubscriptionEarnings isMember isVerified createdAt');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get detailed info about referred users
    const referredUsers = await User.find({
      referralCode: { $in: user.referrals || [] }
    }).select('name email phoneNumber referralCode isVerified isMember createdAt');

    // Get the referrer (who referred this user)
    let referrer = null;
    if (user.referredBy) {
      referrer = await User.findOne({ referralCode: user.referredBy })
        .select('name email phoneNumber referralCode isMember isVerified');
    }

    // Calculate referral stats for this user
    const stats = {
      totalReferrals: user.referrals?.length || 0,
      totalEarnings: user.referralEarnings || 0,
      totalCommission: user.referralCommissionEarnings || 0,
      totalSubscription: user.referralSubscriptionEarnings || 0,
      activeReferrals: referredUsers.filter(u => u.isVerified).length,
      memberReferrals: referredUsers.filter(u => u.isMember).length
    };

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        isMember: user.isMember,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      referrer,
      referredUsers,
      stats
    });

  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user referrals' },
      { status: 500 }
    );
  }
}