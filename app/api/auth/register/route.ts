import User from '@/models/user';
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
}