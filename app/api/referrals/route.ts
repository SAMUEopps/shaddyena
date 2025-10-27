// app/api/referrals/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies (same as your auth/me endpoint)
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Look up user in DB with populated referral data
    const user = await User.findById(decoded.userId)
      .populate('referredBy', 'firstName lastName referralCode')
      .populate('referrals', 'firstName lastName email createdAt')
      .select('referralCode referralCount referredBy referrals');

    if (!user || !user.isActive) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Format referral data
    const referralData = {
      referrals: user.referrals.map((ref: any) => ({
        _id: ref._id,
        firstName: ref.firstName,
        lastName: ref.lastName,
        email: ref.email,
        createdAt: ref.createdAt
      })),
      referredByUser: user.referredBy ? {
        firstName: user.referredBy.firstName,
        lastName: user.referredBy.lastName,
        referralCode: user.referredBy.referralCode
      } : undefined
    };

    return NextResponse.json(referralData);
  } catch (error: any) {
    console.error('Referral data fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/referrals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Get current user
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get referredBy user if exists (using referral code lookup)
    let referredByUser = null;
    if (currentUser.referredBy) {
      // Since referredBy stores the referral code as string, find user by that code
      referredByUser = await User.findOne({ referralCode: currentUser.referredBy })
        .select('firstName lastName referralCode');
    }

    // Get users who were referred by current user 
    // Since referredBy field stores referral codes as strings, we search by referral code
    const referredUsers = await User.find({ referredBy: currentUser.referralCode })
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 });

    // Format referral data
    const referralData = {
      referrals: referredUsers.map((user: any) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt
      })),
      referredByUser: referredByUser ? {
        firstName: referredByUser.firstName,
        lastName: referredByUser.lastName,
        referralCode: referredByUser.referralCode
      } : undefined,
      // Also include basic stats from current user
      stats: {
        referralCode: currentUser.referralCode,
        referralCount: currentUser.referralCount || 0
      }
    };

    return NextResponse.json(referralData);
  } catch (error: any) {
    console.error('Referral data fetch error:', error);
    
    // More specific error handling
    if (error.name === 'CastError') {
      console.error('Cast error details:', error);
      return NextResponse.json({ 
        message: 'Data format error',
        referrals: [],
        referredByUser: undefined,
        stats: { referralCount: 0, referralCode: '' }
      }, { status: 200 }); // Return 200 with empty data instead of error
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}