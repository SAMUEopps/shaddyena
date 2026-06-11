// app/api/savings/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';
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

function generateReference(): string {
  return `DEP_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, paymentMethod = 'mpesa' } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ message: 'Minimum deposit is KES 100' }, { status: 400 });
    }

    const savingsAccount = await SavingsAccount.findOne({ userId });
    if (!savingsAccount) {
      return NextResponse.json({ message: 'Savings account not found' }, { status: 404 });
    }

    const reference = generateReference();

    // Create transaction record
    const transaction = await SavingsTransaction.create({
      userId,
      accountId: savingsAccount._id,
      amount,
      type: 'deposit',
      paymentMethod,
      reference,
      status: 'pending',
    });

    // Here you would integrate with M-Pesa STK Push
    // For now, we'll simulate a successful payment
    // In production, you'd call M-Pesa API and update status via webhook

    // Simulate successful payment
    transaction.status = 'completed';
    await transaction.save();

    // Update savings account
    savingsAccount.totalSaved += amount;
    savingsAccount.availableBalance += amount;
    await savingsAccount.save();

    return NextResponse.json({
      success: true,
      message: 'Deposit successful',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        reference: transaction.reference,
        status: transaction.status,
      },
      newBalance: savingsAccount.availableBalance,
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ message: error.message || 'Deposit failed' }, { status: 500 });
  }
}