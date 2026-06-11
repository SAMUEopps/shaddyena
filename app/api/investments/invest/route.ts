// app/api/investments/invest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';
import InvestmentFund from '@/models/InvestmentFund';
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

function generateReference(): string {
  return `INV_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fundId, amount } = body;

    if (!fundId || !amount) {
      return NextResponse.json({ message: 'Fund ID and amount are required' }, { status: 400 });
    }

    // Get fund details
    const fund = await InvestmentFund.findById(fundId);
    if (!fund) {
      return NextResponse.json({ message: 'Investment fund not found' }, { status: 404 });
    }

    if (fund.status !== 'funding' && fund.status !== 'active') {
      return NextResponse.json({ message: 'This fund is not open for investment' }, { status: 400 });
    }

    if (amount < fund.minimumInvestment) {
      return NextResponse.json({ message: `Minimum investment is KES ${fund.minimumInvestment.toLocaleString()}` }, { status: 400 });
    }

    // Get savings account
    const savingsAccount = await SavingsAccount.findOne({ userId });
    if (!savingsAccount) {
      return NextResponse.json({ message: 'Savings account not found' }, { status: 404 });
    }

    if (savingsAccount.availableBalance < amount) {
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    // Calculate expected return
    const expectedReturn = (amount * fund.projectedReturnRate) / 100;
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + fund.durationMonths);

    // Create investment record
    const investment = await UserInvestment.create({
      userId,
      fundId,
      investedAmount: amount,
      returnRate: fund.projectedReturnRate,
      expectedReturn,
      maturityDate,
      status: 'active',
    });

    // Update savings account
    savingsAccount.availableBalance -= amount;
    savingsAccount.investedBalance += amount;
    await savingsAccount.save();

    // Update fund current amount
    fund.currentFundAmount += amount;
    await fund.save();

    // Create transaction record
    const reference = generateReference();
    await SavingsTransaction.create({
      userId,
      accountId: savingsAccount._id,
      amount,
      type: 'investment',
      reference,
      description: `Investment in ${fund.title}`,
      status: 'completed',
      metadata: { fundId: fund._id, fundTitle: fund.title },
    });

    return NextResponse.json({
      success: true,
      message: 'Investment successful',
      investment: {
        id: investment._id,
        fundTitle: fund.title,
        investedAmount: investment.investedAmount,
        expectedReturn: investment.expectedReturn,
        maturityDate: investment.maturityDate,
      },
      newBalance: savingsAccount.availableBalance,
    });
  } catch (error: any) {
    console.error('Investment error:', error);
    return NextResponse.json({ message: error.message || 'Investment failed' }, { status: 500 });
  }
}