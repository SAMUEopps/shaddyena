// app/api/investments/my-investments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import UserInvestment from '@/models/UserInvestment';
import InvestmentFund from '@/models/InvestmentFund';
import { Types } from 'mongoose';

interface IUserInvestment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fundId: Types.ObjectId;
  investedAmount: number;
  returnRate: number;
  expectedReturn: number;
  maturityDate: Date;
  status: 'active' | 'completed' | 'withdrawn' | 'pending';
  returnsPaid: boolean;
  actualReturn?: number;
  withdrawnAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IInvestmentFund {
  _id: Types.ObjectId;
  title: string;
  category: string;
  description: string;
  minimumInvestment: number;
  durationMonths: number;
  projectedReturnRate: number;
  totalFundTarget: number;
  currentFundAmount: number;
  status: string;
}

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

    const investments = await UserInvestment.find({ userId })
        .sort({ createdAt: -1 })
        .lean() as unknown as IUserInvestment[];

    // Get fund details for each investment
    const investmentsWithFunds = await Promise.all(
      investments.map(async (investment) => {
        const fund = await InvestmentFund.findById(investment.fundId).lean() as IInvestmentFund | null;
        const isMatured = new Date() >= new Date(investment.maturityDate);
        
        return {
          _id: investment._id,
          investedAmount: investment.investedAmount,
          expectedReturn: investment.expectedReturn,
          returnRate: investment.returnRate,
          maturityDate: investment.maturityDate,
          status: investment.status,
          createdAt: investment.createdAt,
          updatedAt: investment.updatedAt,
          isMatured,
          fund: fund ? {
            _id: fund._id,
            title: fund.title,
            category: fund.category,
            description: fund.description,
            minimumInvestment: fund.minimumInvestment,
            durationMonths: fund.durationMonths,
            projectedReturnRate: fund.projectedReturnRate,
          } : null,
        };
      })
    );

    const summary = {
      totalInvested: investmentsWithFunds.reduce((sum, inv) => sum + inv.investedAmount, 0),
      totalExpectedReturns: investmentsWithFunds.reduce((sum, inv) => sum + inv.expectedReturn, 0),
      activeInvestments: investmentsWithFunds.filter(inv => inv.status === 'active').length,
      completedInvestments: investmentsWithFunds.filter(inv => inv.status === 'completed').length,
    };

    return NextResponse.json({
      investments: investmentsWithFunds,
      summary,
    });
  } catch (error: any) {
    console.error('My investments error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch investments' }, { status: 500 });
  }
}