// app/api/earnings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import UserInvestment from '@/models/UserInvestment';
import SavingsTransaction from '@/models/SavingsTransaction';

async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get all completed investments with returns
    const completedInvestments = await UserInvestment.find({
      userId,
      status: 'completed',
      returnsPaid: true,
    });

    const totalEarnings = completedInvestments.reduce((sum, inv) => sum + (inv.actualReturn || inv.expectedReturn), 0);

    // Get interest transactions
    const interestTransactions = await SavingsTransaction.find({
      userId,
      type: 'interest',
      status: 'completed',
    });

    const earningsBreakdown = {
      totalEarnings,
      fromInvestments: totalEarnings,
      fromReferrals: 0, // Add referral earnings if applicable
      fromBonuses: 0,
    };

    const recentEarnings = await SavingsTransaction.find({
      userId,
      type: 'interest',
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      earnings: earningsBreakdown,
      recentEarnings,
    });
  } catch (error: any) {
    console.error('Earnings error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch earnings' }, { status: 500 });
  }
}