// app/api/admin/referrals/update-earnings/route.ts
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
    const { userId, earningsType, amount, action } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {};
    const validEarningsTypes = ['referralEarnings', 'referralCommissionEarnings', 'referralSubscriptionEarnings'];

    if (!validEarningsTypes.includes(earningsType)) {
      return NextResponse.json({ error: 'Invalid earnings type' }, { status: 400 });
    }

    if (action === 'add') {
      updateData[earningsType] = (user[earningsType] || 0) + amount;
    } else if (action === 'set') {
      updateData[earningsType] = amount;
    } else if (action === 'subtract') {
      updateData[earningsType] = Math.max(0, (user[earningsType] || 0) - amount);
    } else {
      return NextResponse.json({ error: 'Invalid action. Use add, set, or subtract' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('name email referralEarnings referralCommissionEarnings referralSubscriptionEarnings');

    return NextResponse.json({
      success: true,
      message: `Earnings updated successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating earnings:', error);
    return NextResponse.json(
      { error: 'Failed to update earnings' },
      { status: 500 }
    );
  }
}