// app/api/savings/balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import SavingsAccount from '@/models/SavingsAccount';

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

    const savingsAccount = await SavingsAccount.findOne({ userId });
    if (!savingsAccount) {
      return NextResponse.json({ message: 'Savings account not found' }, { status: 404 });
    }

    return NextResponse.json({
      totalSaved: savingsAccount.totalSaved,
      availableBalance: savingsAccount.availableBalance,
      investedBalance: savingsAccount.investedBalance,
      contributionType: savingsAccount.contributionType,
      contributionAmount: savingsAccount.contributionAmount,
    });
  } catch (error: any) {
    console.error('Balance error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch balance' }, { status: 500 });
  }
}