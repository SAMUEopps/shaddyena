// app/api/vendors/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const vendor = await Vendor.findOne({ userId: decoded.userId })
      .populate('userId', 'name email')
      .lean();

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ vendor });
  } catch (error) {
    console.error('Fetch vendor profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      businessName,
      ownerName,
      phoneNumber,
      businessLocation,
      payoutMethod,
      payoutDetails,
      profileImage,
      profileImagePublicId,
      coverImage,
      coverImagePublicId,
    } = body;

    const vendor = await Vendor.findOne({ userId: decoded.userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (businessName !== undefined) vendor.businessName = businessName;
    if (ownerName !== undefined) vendor.ownerName = ownerName;
    if (phoneNumber !== undefined) vendor.phoneNumber = phoneNumber;
    if (businessLocation !== undefined) vendor.businessLocation = businessLocation;
    if (payoutMethod !== undefined) vendor.payoutMethod = payoutMethod;
    if (payoutDetails !== undefined) {
      vendor.payoutDetails = {
        ...vendor.payoutDetails,
        ...payoutDetails,
      };
    }
    if (profileImage !== undefined) vendor.profileImage = profileImage;
    if (profileImagePublicId !== undefined) vendor.profileImagePublicId = profileImagePublicId;
    if (coverImage !== undefined) vendor.coverImage = coverImage;
    if (coverImagePublicId !== undefined) vendor.coverImagePublicId = coverImagePublicId;

    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      vendor,
    });
  } catch (error) {
    console.error('Update vendor profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor profile' },
      { status: 500 }
    );
  }
}