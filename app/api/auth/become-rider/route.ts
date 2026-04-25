import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import RiderRequest from '@/models/RiderRequest';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Please login to continue' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a rider
    if (user.role === 'delivery') {
      return NextResponse.json(
        { success: false, message: 'You are already registered as a delivery rider' },
        { status: 400 }
      );
    }

    // Check if user has a pending request
    const existingRequest = await RiderRequest.findOne({
      userId: user._id,
      status: 'pending',
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, message: 'You already have a pending application. Please wait for review.' },
        { status: 400 }
      );
    }

    // Check if user has a rejected request that's less than 30 days old
    const rejectedRequest = await RiderRequest.findOne({
      userId: user._id,
      status: 'rejected',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    if (rejectedRequest) {
      return NextResponse.json(
        { success: false, message: 'Your previous application was rejected. You can reapply after 30 days.' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      fullName,
      phoneNumber,
      email,
      vehicleType,
      vehicleModel,
      vehiclePlate,
      idNumber,
      licenseNumber,
      location,
      emergencyContact,
      emergencyPhone,
      experienceYears,
      availability,
      referralCode,
    } = body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !vehicleType || !vehicleModel || 
        !vehiclePlate || !idNumber || !licenseNumber || !location || 
        !emergencyContact || !emergencyPhone || !experienceYears || !availability) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate phone number format (Kenyan)
    const phoneRegex = /^(07|01)\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX or 01XXXXXXXX)' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists in another rider request
    const existingEmailRequest = await RiderRequest.findOne({
      email: email,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (existingEmailRequest && existingEmailRequest.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'This email is already associated with another application' },
        { status: 400 }
      );
    }

    // Check if ID number already exists in another request
    const existingIdRequest = await RiderRequest.findOne({
      idNumber: idNumber,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (existingIdRequest && existingIdRequest.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'This ID number is already registered' },
        { status: 400 }
      );
    }

    // Create rider request
    const riderRequest = await RiderRequest.create({
      userId: user._id,
      fullName,
      phoneNumber,
      email,
      vehicleType,
      vehicleModel,
      vehiclePlate: vehiclePlate.toUpperCase(),
      idNumber,
      licenseNumber: licenseNumber.toUpperCase(),
      location,
      emergencyContact,
      emergencyPhone,
      experienceYears,
      availability,
      referralCode: referralCode || null,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Your application has been submitted successfully. We will review it within 24-48 hours.',
      data: {
        requestId: riderRequest._id,
        status: riderRequest.status,
      },
    });
  } catch (error) {
    console.error('Error in become-rider API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check application status
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Please login to continue' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check user's rider status
    if (user.role === 'delivery') {
      // Get approved rider request details
      const approvedRequest = await RiderRequest.findOne({ 
        userId: user._id, 
        status: 'approved' 
      }).sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        isRider: true,
        status: 'approved',
        message: 'You are an approved delivery rider',
        data: approvedRequest ? {
          approvedAt: approvedRequest.reviewedAt,
          vehicleType: approvedRequest.vehicleType,
          vehicleModel: approvedRequest.vehicleModel,
          vehiclePlate: approvedRequest.vehiclePlate,
        } : null,
      });
    }

    // Check for existing request
    const request = await RiderRequest.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!request) {
      return NextResponse.json({
        success: true,
        hasApplied: false,
        message: 'You have not applied to become a rider yet',
      });
    }

    return NextResponse.json({
      success: true,
      hasApplied: true,
      status: request.status,
      createdAt: request.createdAt,
      reviewedAt: request.reviewedAt || null,
      adminNotes: request.adminNotes || null,
      message: request.status === 'pending' 
        ? 'Your application is pending review. We will get back to you within 24-48 hours.' 
        : request.status === 'rejected' 
        ? 'Your application was rejected. Please check the admin notes for details.' 
        : 'Your application was approved. You can now start delivering!',
    });
  } catch (error) {
    console.error('Error checking rider status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}