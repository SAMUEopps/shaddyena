// app/api/admin/wallet/payouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const marketerId = searchParams.get('marketerId');
    const limit = Math.min(Number(searchParams.get('limit') || 25), 100);

    const query: any = {};
    if (marketerId) query.marketerId = marketerId;

    const payouts = await MarketerWithdrawal.find(query)
      .populate('marketerId', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ payouts });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load payouts', details: error.message },
      { status: 500 }
    );
  }
}