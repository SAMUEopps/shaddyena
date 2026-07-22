// C:\Users\USER\Desktop\Projects\my-app\app\api\referral\generate\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user already has a referral code, return it
    if (user.referralCode) {
      return NextResponse.json({ 
        referralCode: user.referralCode,
        message: 'Existing referral code'
      });
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existingUser = await User.findOne({ referralCode });
      if (!existingUser) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique referral code' },
        { status: 500 }
      );
    }

    user.referralCode = referralCode;
    await user.save();

    return NextResponse.json({ 
      referralCode,
      message: 'Referral code generated successfully'
    });
  } catch (error) {
    console.error('Referral generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    );
  }
}