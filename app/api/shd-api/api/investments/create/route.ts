// C:\Users\USER\Desktop\Projects\my-app\app\api\investments\create\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Investment from '@/shd-models/models/Investment';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';


const INVESTMENT_RATES = {
  TRANSPORT: { returnRate: 0.15, minAmount: 1000, maxAmount: 100000, duration: 6 },
  MARKETING: { returnRate: 0.12, minAmount: 500, maxAmount: 50000, duration: 4 },
  TECHNOLOGY: { returnRate: 0.20, minAmount: 2000, maxAmount: 200000, duration: 12 },
  STARTUP: { returnRate: 0.25, minAmount: 5000, maxAmount: 500000, duration: 18 }
};

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { type, amount } = body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isMember) {
      return NextResponse.json(
        { error: 'You must be a member to invest' },
        { status: 403 }
      );
    }

    const investmentConfig = INVESTMENT_RATES[type as keyof typeof INVESTMENT_RATES];
    if (!investmentConfig) {
      return NextResponse.json(
        { error: 'Invalid investment type' },
        { status: 400 }
      );
    }

    if (amount < investmentConfig.minAmount || amount > investmentConfig.maxAmount) {
      return NextResponse.json(
        { error: `Amount must be between ${investmentConfig.minAmount} and ${investmentConfig.maxAmount}` },
        { status: 400 }
      );
    }

    if (user.availableBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Calculate expected return
    const expectedReturn = amount * (1 + investmentConfig.returnRate);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + investmentConfig.duration);

    // Create investment
    const investment = await Investment.create({
      userId: user._id,
      type,
      amount,
      status: 'active',
      duration: investmentConfig.duration,
      startDate: new Date(),
      endDate,
      expectedReturn
    });

    // Deduct from user balance
    user.availableBalance -= amount;
    user.totalInvestments += amount;
    await user.save();

    return NextResponse.json({
      message: 'Investment created successfully!',
      investment,
      user: {
        totalInvestments: user.totalInvestments,
        availableBalance: user.availableBalance
      }
    });

  } catch (error) {
    console.error('Investment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}