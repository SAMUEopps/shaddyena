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

    // Check if user exists (include password field for email lookup)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true // Only allow active users
    }).select('email firstName lastName role isActive');

    if (!user) {
      // Security: Return generic message even if user doesn't exist
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a reset link shortly.',
      });
    }

    // Check if user is verified (optional)
    // if (!user.isVerified) {
    //   return NextResponse.json({
    //     error: 'Please verify your email before resetting password',
    //   }, { status: 400 });
    // }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set expiry to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store or update token in database
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
        // Remove any existing tokens for this user
        setDefaultsOnInsert: true 
      }
    );

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // Send email
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
    
    // Log the error for debugging (in production, use proper logging)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', error);
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}