import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import SellerRequest from '@/models/SellerRequest';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Look up user in DB
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { businessName, businessType, mpesaNumber } = await req.json();

    // Validate required fields
    if (!businessName || !businessType || !mpesaNumber) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate M-Pesa number format
    const mpesaRegex = /^07\d{8}$/;
    if (!mpesaRegex.test(mpesaNumber)) {
      return NextResponse.json(
        { message: 'Please enter a valid 10-digit M-Pesa number starting with 07' },
        { status: 400 }
      );
    }

    // Check if user is already a vendor
    if (user.role === 'vendor') {
      return NextResponse.json(
        { message: 'You are already a vendor' },
        { status: 400 }
      );
    }

    // Check for existing pending request
    const existingRequest = await SellerRequest.findOne({
      user: user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: 'You already have a pending vendor request' },
        { status: 400 }
      );
    }

    // Create seller request
    const sellerRequest = new SellerRequest({
      user: user._id,
      businessName,
      businessType,
      mpesaNumber
    });

    await sellerRequest.save();

    return NextResponse.json(
      { 
        message: 'Vendor request submitted successfully. Please wait for admin approval.',
        requestId: sellerRequest._id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Become vendor error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}