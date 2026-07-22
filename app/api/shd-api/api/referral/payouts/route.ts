// app/api/referral/payouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ReferralPayout from '@/models/ReferralPayout';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const payouts = await ReferralPayout.find({ referrerId: decoded.userId })
      .populate('orderId', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ payouts });

  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}