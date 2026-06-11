// app/api/investments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import InvestmentFund from '@/models/InvestmentFund';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';

    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (status) query.status = status;

    const funds = await InvestmentFund.find(query).sort({ createdAt: -1 });

    // Calculate percentage funded for each fund
    const fundsWithPercentage = funds.map(fund => ({
      ...fund.toObject(),
      fundedPercentage: (fund.currentFundAmount / fund.totalFundTarget) * 100,
    }));

    return NextResponse.json(fundsWithPercentage);
  } catch (error: any) {
    console.error('Fetch investments error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch investments' }, { status: 500 });
  }
}