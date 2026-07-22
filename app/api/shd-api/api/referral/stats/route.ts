// C:\Users\USER\Desktop\Projects\my-app\app\api\referral\stats\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

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

    const user = await User.findById(decoded.userId)
      .select('referralCode referrals referralEarnings name email phoneNumber role');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get details of referred users
    const referredUsers = await User.find({
      referredBy: user.referralCode
    }).select('name email phoneNumber role isVerified createdAt');

    // Count vendors among referrals
    //const vendorCount = referredUsers.filter(u => u.role === 'vendor').length;

    
    // app/api/referral/stats/route.ts (Update)
    // Update the vendor count calculation
    const vendorCount = await User.countDocuments({
      referredBy: user.referralCode,
      role: 'vendor'
    });

    return NextResponse.json({
      referralCode: user.referralCode,
      totalReferrals: user.referrals?.length || 0,
      referralEarnings: user.referralEarnings || 0,
      referredUsers: referredUsers,
      vendorCount: vendorCount,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${user.referralCode}`
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}