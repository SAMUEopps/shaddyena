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

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}

/**
 * DELETE: Soft delete authenticated account
 */
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticate(req);
    if ('error' in auth) {
      return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const user = auth.user;

    // Soft delete
    user.isActive = false;
    await user.save();

    // OPTIONAL: clear auth cookie
    const response = NextResponse.json({
      message: 'Account deleted successfully',
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
