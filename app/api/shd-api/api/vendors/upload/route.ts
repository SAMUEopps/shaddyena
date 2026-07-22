// app/api/vendors/upload/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { deleteFromCloudinary, uploadToCloudinary } from '@/shd-lib/lib/cloudinary';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Vendor from '@/shd-models/models/Vendor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;
    const imageType = formData.get('type') as string; // 'profile' or 'cover'

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!imageType || !['profile', 'cover'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "profile" or "cover"' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.' },
        { status: 400 }
      );
    }

    // Delete old image from Cloudinary if exists
    const oldPublicId = imageType === 'profile' 
      ? vendor.profileImagePublicId 
      : vendor.coverImagePublicId;

    if (oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    // Upload new image to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());
    const folder = imageType === 'profile' ? 'vendors/profiles' : 'vendors/covers';
    const uploadResult = await uploadToCloudinary(buffer, folder);

    // Update vendor with new image
    const updateData = imageType === 'profile' 
      ? {
          profileImage: uploadResult.secure_url,
          profileImagePublicId: uploadResult.public_id,
        }
      : {
          coverImage: uploadResult.secure_url,
          coverImagePublicId: uploadResult.public_id,
        };

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `${imageType} image uploaded successfully`,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      vendor: updatedVendor,
    });

  } catch (error) {
    console.error('Vendor image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageType = searchParams.get('type'); // 'profile' or 'cover'

    if (!imageType || !['profile', 'cover'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "profile" or "cover"' },
        { status: 400 }
      );
    }

    const publicId = imageType === 'profile' 
      ? vendor.profileImagePublicId 
      : vendor.coverImagePublicId;

    if (!publicId) {
      return NextResponse.json(
        { error: 'No image to delete' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // Remove from vendor record
    const updateData = imageType === 'profile'
      ? {
          profileImage: null,
          profileImagePublicId: null,
        }
      : {
          coverImage: null,
          coverImagePublicId: null,
        };

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `${imageType} image removed successfully`,
      vendor: updatedVendor,
    });

  } catch (error) {
    console.error('Delete vendor image error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}