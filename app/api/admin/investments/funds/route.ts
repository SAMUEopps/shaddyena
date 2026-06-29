// app/api/admin/investments/funds/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import InvestmentFund from '@/models/InvestmentFund';
import MembershipUser from '@/models/MembershipUser';
import AdminActivityLog from '@/models/AdminActivityLog';

async function verifyAdmin(req: NextRequest): Promise<any> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await MembershipUser.findById(decoded.userId);
    return user?.role === 'admin' ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    if (!await verifyAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const funds = await InvestmentFund.find().sort({ createdAt: -1 });
    
    // Calculate statistics
    const fundsWithStats = funds.map(fund => ({
      ...fund.toObject(),
      fundedPercentage: (fund.currentFundAmount / fund.totalFundTarget) * 100,
      remainingAmount: Math.max(0, fund.totalFundTarget - fund.currentFundAmount),
    }));

    const stats = {
      totalFunds: funds.length,
      activeFunds: funds.filter(f => f.status === 'active' || f.status === 'funding').length,
      totalTarget: funds.reduce((sum, f) => sum + f.totalFundTarget, 0),
      totalRaised: funds.reduce((sum, f) => sum + f.currentFundAmount, 0),
    };

    return NextResponse.json({
      funds: fundsWithStats,
      stats,
    });
  } catch (error: any) {
    console.error('Admin funds fetch error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch funds' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      category,
      description,
      longDescription,
      minimumInvestment,
      durationMonths,
      projectedReturnRate,
      totalFundTarget,
      features,
    } = body;

    // Validate required fields
    if (!title || !category || !description || !minimumInvestment || !durationMonths || !projectedReturnRate || !totalFundTarget) {
      return NextResponse.json({ message: 'All required fields must be filled' }, { status: 400 });
    }

    const fund = await InvestmentFund.create({
      title,
      category,
      description,
      longDescription,
      minimumInvestment,
      durationMonths,
      projectedReturnRate,
      totalFundTarget,
      currentFundAmount: 0,
      status: 'funding',
      features: features || [],
    });

    // Log activity
    await AdminActivityLog.create({
      adminId: admin.userId,
      action: 'create_fund',
      targetType: 'fund',
      targetId: fund._id,
      details: { fundData: body },
    });

    return NextResponse.json({
      success: true,
      message: 'Investment fund created successfully',
      fund,
    });
  } catch (error: any) {
    console.error('Admin fund creation error:', error);
    return NextResponse.json({ message: error.message || 'Failed to create fund' }, { status: 500 });
  }
}