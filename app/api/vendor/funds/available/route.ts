// app/api/vendor/funds/available/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Ledger from '@/models/Ledger';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check vendor role
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized - Not a vendor' }, { status: 401 });
    }

    const vendorId = decoded.userId;

    const funds = await Ledger.find({
      vendorId,
      type: 'VENDOR_PAYOUT',
      withdrawalStatus: 'AVAILABLE',
      status: 'PENDING'
    })
    .sort({ scheduledAt: 1 })
    .select('orderId amount netAmount type metadata scheduledAt withdrawalStatus')
    .lean();

    // Format the response
    const formattedFunds = funds.map(fund => ({
      _id: fund._id,
      orderId: fund.orderId,
      amount: fund.amount,
      netAmount: fund.netAmount || fund.amount,
      type: fund.type,
      metadata: fund.metadata || {},
      scheduledAt: fund.scheduledAt,
      withdrawalStatus: fund.withdrawalStatus,
      isAvailable: fund.withdrawalStatus === 'AVAILABLE',
      isImmediateRelease: fund.metadata?.isImmediateRelease || false,
      percentage: fund.metadata?.percentage || 0
    }));

    return NextResponse.json(formattedFunds);
  } catch (error) {
    console.error('Error fetching available funds:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}