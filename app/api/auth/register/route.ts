/*import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, role, phone, businessName, businessType, mpesaNumber } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Validate vendor registration
    if (role === 'vendor' && (!businessName || !businessType)) {
      return NextResponse.json({ 
        message: 'Business name and type are required for vendor registration' 
      }, { status: 400 });
    }

    // Create new user
    const userData: any = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      phone,
      mpesaNumber
    };

    // Add vendor-specific fields
    if (role === 'vendor') {
      userData.businessName = businessName;
      userData.businessType = businessType;
      userData.isVerified = false; // Vendors need admin approval
    }

    const user = await User.create(userData);

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { message: 'User created successfully', user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/






// app/api/auth/register/route.ts
/*import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, role, phone, businessName, businessType, mpesaNumber, referralCode } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Validate vendor registration
    if (role === 'vendor' && (!businessName || !businessType)) {
      return NextResponse.json({ 
        message: 'Business name and type are required for vendor registration' 
      }, { status: 400 });
    }

    // Check if referredBy user exists if referral code is provided
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser) {
        return NextResponse.json(
          { message: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Create new user
    const userData: any = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      phone,
      mpesaNumber,
      referredBy: referralCode || undefined,
    };

    // Add vendor-specific fields
    if (role === 'vendor') {
      userData.businessName = businessName;
      userData.businessType = businessType;
      userData.isVerified = false;
    }

    const user = await User.create(userData);

    // If this user was referred, increment the referrer's count
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { referralCount: 1 }
      });
    }

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: userResponse,
        referralCode: user.referralCode 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/




// app/api/auth/register/route.ts
/*import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, role, phone, businessName, businessType, mpesaNumber, referralCode } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Validate vendor registration
    if (role === 'vendor' && (!businessName || !businessType)) {
      return NextResponse.json({ 
        message: 'Business name and type are required for vendor registration' 
      }, { status: 400 });
    }

    // Check if referredBy user exists if referral code is provided
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser) {
        return NextResponse.json(
          { message: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Create new user
    const userData: any = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      phone,
      mpesaNumber,
    };

    // Add referral data if applicable
    if (referredByUser) {
      userData.referredBy = referredByUser._id;
    }

    // Add vendor-specific fields
    if (role === 'vendor') {
      userData.businessName = businessName;
      userData.businessType = businessType;
      userData.isVerified = false;
    }

    const user = await User.create(userData);

    // If this user was referred, update the referrer's data
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { referralCount: 1 },
        $push: { referrals: user._id }
      });
    }

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: userResponse,
        referralCode: user.referralCode 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/auth/register/route.ts
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, role, phone, businessName, businessType, mpesaNumber, referralCode } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Validate vendor registration
    if (role === 'vendor' && (!businessName || !businessType)) {
      return NextResponse.json({ 
        message: 'Business name and type are required for vendor registration' 
      }, { status: 400 });
    }

    // Check if referredBy user exists if referral code is provided
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode });
      if (!referredByUser) {
        return NextResponse.json(
          { message: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Create new user
    const userData: any = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      phone,
      mpesaNumber,
    };

    // Add referral data if applicable
    if (referredByUser) {
      userData.referredBy = referredByUser.referralCode; // Store the referral code as string
    }

    // Add vendor-specific fields
    if (role === 'vendor') {
      userData.businessName = businessName;
      userData.businessType = businessType;
      userData.isVerified = false;
    }

    const user = await User.create(userData);

    // If this user was referred, increment the referrer's count
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { referralCount: 1 }
      });
      // Note: We can't add to referrals array until schema is updated
    }

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: userResponse,
        referralCode: user.referralCode 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}