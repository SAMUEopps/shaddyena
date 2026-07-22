// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     const { name, phoneNumber, email, password, role } = body;

//     // Check if user exists
//     const existingUser = await User.findOne({ 
//       $or: [{ email }, { phoneNumber }] 
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       phoneNumber,
//       email,
//       password: hashedPassword,
//       role: role || 'customer',
//       isVerified: true // In production, verify via SMS
//     });

//     return NextResponse.json({
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         phoneNumber: user.phoneNumber,
//         email: user.email,
//         role: user.role
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Registration failed' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\my-app\app\api\auth\register\route.ts
import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';

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
    const body = await req.json();
    const { name, phoneNumber, email, password, role, referralCode } = body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Validate referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code for new user
    let newReferralCode = generateReferralCode();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existingUser = await User.findOne({ referralCode: newReferralCode });
      if (!existingUser) {
        isUnique = true;
      } else {
        newReferralCode = generateReferralCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate referral code' },
        { status: 500 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      role: role || 'customer',
      isVerified: true,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
      referrals: [],
      referralEarnings: 0
    });

    // Add user to referrer's referrals list
    if (referrer) {
      await User.findByIdAndUpdate(
        referrer._id,
        { 
          $push: { referrals: user._id },
          // If the new user is a vendor, add referral earnings
          ...(role === 'vendor' ? { $inc: { referralEarnings: 100 } } : {})
        }
      );
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        referredBy: user.referredBy
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}