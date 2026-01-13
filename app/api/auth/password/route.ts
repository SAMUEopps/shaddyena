import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

interface DecodedToken {
  userId: string;
}

/**
 * Authenticate user via JWT cookie
 */
async function authenticate(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return { error: 'Not authenticated', status: 401 };
  }

  let decoded: DecodedToken;
  try {
    decoded = verify(token, process.env.JWT_SECRET as string) as DecodedToken;
  } catch {
    return { error: 'Invalid token', status: 401 };
  }

  // Explicitly select password
  const user = await User.findById(decoded.userId).select('+password');
  if (!user || !user.isActive) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}

/**
 * PUT: Change password
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticate(req);
    if ('error' in auth) {
      return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = auth.user;

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password (hashing handled by model middleware)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
