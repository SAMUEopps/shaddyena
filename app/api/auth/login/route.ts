/*'use server';

import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Find user with password
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const token = sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Remove password from user object
    const userObject = user.toObject();
    delete userObject.password;

    // Set cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userObject,
      token,
    });

    response.cookies.set({
      name: 'token',
      value: token,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Find user with password
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const token = sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Remove password from user object and include referral data
    const userObject = user.toObject();
    delete userObject.password;

    // Set cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        _id: userObject._id,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: userObject.email,
        role: userObject.role,
        phone: userObject.phone,
        avatar: userObject.avatar,
        businessName: userObject.businessName,
        businessType: userObject.businessType,
        mpesaNumber: userObject.mpesaNumber,
        isVerified: userObject.isVerified,
        isActive: userObject.isActive,
        // Include referral data
        referralCode: userObject.referralCode,
        referredBy: userObject.referredBy,
        referralCount: userObject.referralCount,
        createdAt: userObject.createdAt,
        updatedAt: userObject.updatedAt,
      },
      token,
    });

    response.cookies.set({
      name: 'token',
      value: token,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}