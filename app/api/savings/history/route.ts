// app/api/savings/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import SavingsTransaction from '@/models/SavingsTransaction';
import SavingsAccount from '@/models/SavingsAccount';

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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    const query: any = { userId };
    if (type) query.type = type;

    const transactions = await SavingsTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SavingsTransaction.countDocuments(query);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('History error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch history' }, { status: 500 });
  }
}