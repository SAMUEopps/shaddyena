// app/api/auth/profile/route.ts
/*import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email })
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}*/

// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

interface DecodedToken {
  userId: string;
}

/**
 * Helper: authenticate user from JWT cookie
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
 * GET: Fetch authenticated user profile
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticate(req);
    if ('error' in auth) {
      return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const user = auth.user;

    return NextResponse.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      businessName: user.businessName,
      businessType: user.businessType,
      mpesaNumber: user.mpesaNumber,
      isVerified: user.isVerified,
      isActive: user.isActive,

      // Referral fields
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      referralCount: user.referralCount,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update authenticated user profile
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticate(req);
    if ('error' in auth) {
      return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const user = auth.user;
    const updateData = await req.json();

    // Whitelisted fields only
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'avatar',
      'businessName',
      'businessType',
      'mpesaNumber',
    ];

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        businessName: user.businessName,
        businessType: user.businessType,
        mpesaNumber: user.mpesaNumber,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);

    if (error?.code === 11000) {
      return NextResponse.json(
        { message: 'Duplicate field value' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
