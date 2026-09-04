// import { NextRequest, NextResponse } from 'next/server';

// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     const { email, password } = body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET || 'secret',
//       { expiresIn: '7d' }
//     );



//     return NextResponse.json({
//   token,
//   user: {
//     id: user._id,
//     name: user.name,
//     phoneNumber: user.phoneNumber,
//     email: user.email,
//     role: user.role,
//     isVerified: user.isVerified,

//     // Membership
//     isMember: user.isMember,
//     memberSince: user.memberSince,
//     totalSavings: user.totalSavings,
//     totalInvestments: user.totalInvestments,
//     availableBalance: user.availableBalance,

//     // Referral
//     referralCode: user.referralCode
//   }
// });

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Login failed' },
//       { status: 500 }
//     );
//   }
// }


// app/api/shd-api/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import { getOrCreateOrganization } from '@/shd-lib/lib/organization';


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get or create organization for this user
    let organization = null;
    try {
      organization = await getOrCreateOrganization(user._id);
    } catch (error) {
      console.error('Error getting organization:', error);
      // Continue even if organization creation fails
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        organizationId: organization?._id?.toString() || null 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Build user response object with all fields
    const userResponse = {
      id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isMember: user.isMember,
      memberSince: user.memberSince,
      totalSavings: user.totalSavings,
      totalInvestments: user.totalInvestments,
      availableBalance: user.availableBalance,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      referralEarnings: user.referralEarnings,
      referralCommissionEarnings: user.referralCommissionEarnings,
      referralSubscriptionEarnings: user.referralSubscriptionEarnings,
      organizationId: organization?._id?.toString() || user.organizationId?.toString() || null,
      organizationName: organization?.name || null
    };

    return NextResponse.json({
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}