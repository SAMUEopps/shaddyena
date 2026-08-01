// app/api/admin/referrals/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { userIds, action, value } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'No users selected' }, { status: 400 });
    }

    let result;
    if (action === 'addReferralEarnings') {
      if (typeof value !== 'number' || value <= 0) {
        return NextResponse.json({ error: 'Invalid earnings amount' }, { status: 400 });
      }
      
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $inc: { referralEarnings: value } }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} users received ${value} in referral earnings`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'addCommissionEarnings') {
      if (typeof value !== 'number' || value <= 0) {
        return NextResponse.json({ error: 'Invalid commission amount' }, { status: 400 });
      }
      
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $inc: { referralCommissionEarnings: value } }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} users received ${value} in commission earnings`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'addSubscriptionEarnings') {
      if (typeof value !== 'number' || value <= 0) {
        return NextResponse.json({ error: 'Invalid subscription amount' }, { status: 400 });
      }
      
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $inc: { referralSubscriptionEarnings: value } }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} users received ${value} in subscription earnings`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'resetEarnings') {
      result = await User.updateMany(
        { _id: { $in: userIds } },
        {
          referralEarnings: 0,
          referralCommissionEarnings: 0,
          referralSubscriptionEarnings: 0
        }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} users had their earnings reset`,
        modifiedCount: result.modifiedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: addReferralEarnings, addCommissionEarnings, addSubscriptionEarnings, resetEarnings' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}