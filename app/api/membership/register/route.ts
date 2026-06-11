// app/api/membership/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';

function generateMembershipNumber(): string {
  const prefix = 'SHD';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, phone, nationalId, password, contributionType, contributionAmount } = body;

    // Validate required fields
    if (!name || !email || !phone || !nationalId || !password || !contributionType || !contributionAmount) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await MembershipUser.findOne({ $or: [{ email }, { nationalId }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email, phone or national ID' }, { status: 400 });
    }

    // Validate contribution amount
    if (contributionAmount < 100) {
      return NextResponse.json({ message: 'Minimum contribution is KES 100' }, { status: 400 });
    }

    // Create membership user
    const membershipNumber = generateMembershipNumber();
    const user = await MembershipUser.create({
      name,
      email,
      phone,
      nationalId,
      password,
      membershipNumber,
      isVerified: true,
    });

    // Create savings account
    const savingsAccount = await SavingsAccount.create({
      userId: user._id,
      contributionType,
      contributionAmount,
      totalSaved: 0,
      availableBalance: 0,
      investedBalance: 0,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'member' },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        membershipNumber: user.membershipNumber,
      },
      savingsAccount: {
        id: savingsAccount._id,
        contributionType: savingsAccount.contributionType,
        contributionAmount: savingsAccount.contributionAmount,
      },
    });

    response.cookies.set('membershipToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 500 });
  }
}