import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import PasswordResetToken from '@/models/PasswordResetToken';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await PasswordResetToken.findOne({
      token: { $exists: true },
      expiresAt: { $gt: new Date() }
    }).populate('userId', 'email isActive');

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new reset link.' },
        { status: 400 }
      );
    }

    // Verify the token (compare with bcrypt)
    const isValidToken = await bcrypt.compare(token, resetToken.token);
    if (!isValidToken) {
      // Delete invalid token
      await PasswordResetToken.findByIdAndDelete(resetToken._id);
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Check if user is active
    const user = resetToken.userId as any;
    if (!user?.isActive) {
      return NextResponse.json(
        { error: 'Account is not active. Please contact support.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    // Delete the used token
    await PasswordResetToken.findByIdAndDelete(resetToken._id);

    // Also delete any other tokens for this user (cleanup)
    await PasswordResetToken.deleteMany({
      userId: resetToken.userId,
    });

    return NextResponse.json({
      message: 'Password reset successful! You can now log in with your new password.',
      success: true,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    // Log the error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', error);
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}