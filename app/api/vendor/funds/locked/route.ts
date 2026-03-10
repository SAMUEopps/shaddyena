// app/api/vendor/funds/locked/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Ledger from '@/models/Ledger';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET as string) as any;
    
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized - Not a vendor' }, { status: 401 });
    }

    const vendorId = decoded.userId;

    // Get all LOCKED funds for this vendor
    const lockedFunds = await Ledger.find({
      vendorId,
      type: 'VENDOR_PAYOUT',
      withdrawalStatus: 'LOCKED',
      status: 'PENDING'
    })
    .sort({ scheduledAt: -1 })
    .lean();

    // Format the response
    const formattedFunds = lockedFunds.map(fund => ({
      _id: fund._id,
      orderId: fund.orderId,
      amount: fund.amount,
      netAmount: fund.netAmount || fund.amount,
      type: fund.type,
      metadata: fund.metadata || {},
      scheduledAt: fund.scheduledAt,
      createdAt: fund.createdAt,
      withdrawalStatus: fund.withdrawalStatus
    }));

    return NextResponse.json(formattedFunds);
  } catch (error) {
    console.error('Error fetching locked funds:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}