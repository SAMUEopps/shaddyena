// C:\Users\USER\Desktop\Projects\my-app\app\api\membership\activate\route.ts
import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { verifyToken } from '@/shd-lib/lib/auth';
import User from '@/shd-models/models/User';
import Savings from '@/shd-models/models/Savings';

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
    const { password, initialDeposit } = body;

    // Validate initial deposit (minimum 100)
    if (!initialDeposit || initialDeposit < 100) {
      return NextResponse.json(
        { error: 'Minimum initial deposit is KSh 100' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already a member
    if (user.isMember) {
      return NextResponse.json(
        { error: 'You are already a member' },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Generate reference number
    const reference = `MEM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create savings record for initial deposit
    const saving = await Savings.create({
      userId: user._id,
      amount: initialDeposit,
      type: 'deposit',
      description: 'Initial membership deposit',
      status: 'completed',
      reference
    });

    // Update user to member
    user.isMember = true;
    user.memberSince = new Date();
    user.totalSavings = initialDeposit;
    user.availableBalance = initialDeposit;
    await user.save();

    return NextResponse.json({
      message: 'Membership activated successfully!',
      user: {
        id: user._id,
        name: user.name,
        isMember: user.isMember,
        memberSince: user.memberSince,
        totalSavings: user.totalSavings,
        availableBalance: user.availableBalance
      },
      saving
    });

  } catch (error) {
    console.error('Membership activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate membership' },
      { status: 500 }
    );
  }
}