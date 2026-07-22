// C:\Users\USER\Desktop\Projects\my-app\app\api\membership\dashboard\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Investment from '@/shd-models/models/Investment';
import Savings from '@/shd-models/models/Savings';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';


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