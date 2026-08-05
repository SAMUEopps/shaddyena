// app/api/shd-api/api/vendors/withdrawals/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';

import Vendor from '@/shd-models/models/Vendor';
import Withdrawal from '@/shd-models/models/Withdrawal';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const withdrawals = await Withdrawal.find({ vendorId: vendor._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ withdrawals });

  } catch (error) {
    console.error('Fetch withdrawals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}