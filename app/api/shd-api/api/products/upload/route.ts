// app/api/products/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { upload } from '@/lib/multer';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import Product from '@/models/Product';
import Vendor from '@/models/Vendor';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get vendor profile
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const productId = formData.get('productId') as string;
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to vendor
    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { error: 'Invalid product ID' },
          { status: 400 }
        );
      }

      const product = await Product.findOne({
        _id: productId,
        vendorId: vendor._id,
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found or you do not have permission' },
          { status: 404 }
        );
      }

      // Delete old image from Cloudinary if exists
      if (product.imagePublicId) {
        try {
          await deleteFromCloudinary(product.imagePublicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, 'products');

    // If updating existing product
    if (productId) {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          image: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id,
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully',
        product: updatedProduct,
        imageUrl: uploadResult.secure_url,
      });
    }

    // For new product, just return the upload info
    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Configure to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};