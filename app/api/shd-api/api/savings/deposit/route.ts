// C:\Users\USER\Desktop\Projects\my-app\app\api\savings\deposit\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Savings from '@/models/Savings';
import { verifyToken } from '@/lib/auth';

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
    const { amount, description } = body;

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isMember) {
      return NextResponse.json(
        { error: 'You must be a member to save' },
        { status: 403 }
      );
    }

    // Generate reference number
    const reference = `SAV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create savings record
    const saving = await Savings.create({
      userId: user._id,
      amount,
      type: 'deposit',
      description: description || 'Savings deposit',
      status: 'completed',
      reference
    });

    // Update user balance
    user.totalSavings += amount;
    user.availableBalance += amount;
    await user.save();

    return NextResponse.json({
      message: 'Deposit successful!',
      saving,
      user: {
        totalSavings: user.totalSavings,
        availableBalance: user.availableBalance
      }
    });

  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json(
      { error: 'Failed to process deposit' },
      { status: 500 }
    );
  }
}