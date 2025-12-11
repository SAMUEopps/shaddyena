"use server";

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import PasswordResetToken from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true
    }).select('email firstName lastName role isActive');

    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a reset link shortly.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordResetToken.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        token: hashedToken,
        expiresAt,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail({
      email: user.email,
      resetUrl,
      userName: `${user.firstName} ${user.lastName}`,
    });

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a reset link shortly.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
