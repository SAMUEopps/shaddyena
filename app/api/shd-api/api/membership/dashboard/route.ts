// C:\Users\USER\Desktop\Projects\my-app\app\api\membership\dashboard\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Savings from '@/models/Savings';
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get investments
    const investments = await Investment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent savings
    const recentSavings = await Savings.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      user: {
        name: user.name,
        isMember: user.isMember,
        memberSince: user.memberSince,
        totalSavings: user.totalSavings,
        totalInvestments: user.totalInvestments,
        availableBalance: user.availableBalance
      },
      investments,
      recentSavings
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}