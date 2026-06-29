// app/api/admin/investments/funds/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import InvestmentFund from '@/models/InvestmentFund';
import MembershipUser from '@/models/MembershipUser';
import AdminActivityLog from '@/models/AdminActivityLog';
import UserInvestment from '@/models/UserInvestment';

async function verifyAdmin(req: NextRequest): Promise<any> {
  const token = req.cookies.get('membershipToken')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    const user = await MembershipUser.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// ==============================
// GET FUND DETAILS
// ==============================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const admin = await verifyAdmin(req);

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const fund = await InvestmentFund.findById(id);

    if (!fund) {
      return NextResponse.json(
        { message: 'Fund not found' },
        { status: 404 }
      );
    }

    const investments = await UserInvestment.find({
      fundId: fund._id,
    })
      .populate('userId', 'name email phone')
      .lean();

    return NextResponse.json({
      ...fund.toObject(),
      fundedPercentage:
        fund.totalFundTarget > 0
          ? (fund.currentFundAmount / fund.totalFundTarget) * 100
          : 0,
      remainingAmount: Math.max(
        0,
        fund.totalFundTarget - fund.currentFundAmount
      ),
      investorCount: investments.length,
      investments,
    });
  } catch (error: any) {
    console.error('Admin fund fetch error:', error);

    return NextResponse.json(
      {
        message: error.message || 'Failed to fetch fund',
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// UPDATE FUND
// ==============================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const admin = await verifyAdmin(req);

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      status,
      totalFundTarget,
      description,
      features,
    } = body;

    const fund = await InvestmentFund.findById(id);

    if (!fund) {
      return NextResponse.json(
        { message: 'Fund not found' },
        { status: 404 }
      );
    }

    const previousStatus = fund.status;

    if (status !== undefined) {
      fund.status = status;
    }

    if (totalFundTarget !== undefined) {
      fund.totalFundTarget = totalFundTarget;
    }

    if (description !== undefined) {
      fund.description = description;
    }

    if (features !== undefined) {
      fund.features = features;
    }

    await fund.save();

    await AdminActivityLog.create({
      adminId: admin.userId,
      action: 'update_fund',
      targetType: 'fund',
      targetId: fund._id,
      details: {
        updatedFields: body,
        previousStatus,
        newStatus: fund.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Fund updated successfully',
      fund,
    });
  } catch (error: any) {
    console.error('Admin fund update error:', error);

    return NextResponse.json(
      {
        message: error.message || 'Failed to update fund',
      },
      {
        status: 500,
      }
    );
  }
}