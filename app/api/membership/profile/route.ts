// app/api/membership/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
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

    const user = await MembershipUser.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const savingsAccount = await SavingsAccount.findOne({ userId: user._id });

    return NextResponse.json({
      user,
      savingsAccount,
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}