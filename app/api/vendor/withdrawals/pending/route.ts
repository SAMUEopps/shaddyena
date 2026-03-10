// app/api/vendor/withdrawals/pending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Withdrawal from '@/models/Withdrawal';

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

    const pendingWithdrawals = await Withdrawal.find({
      vendorId,
      status: { $in: ['PENDING', 'APPROVED'] }
    })
    .select('_id amount status createdAt')
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json(pendingWithdrawals);
  } catch (error) {
    console.error('Error fetching pending withdrawals:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}