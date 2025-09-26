import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';
import Shop from '@/models/shop';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Only vendors can access their products
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get vendor's shop first
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }

    // Get products with pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const products = await Product.find({ vendorId: decoded.userId, shopId: shop._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ vendorId: decoded.userId, shopId: shop._id });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Only vendors can create products
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get vendor's shop
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found. Please create a shop first.' },
        { status: 400 }
      );
    }

    const productData = await req.json();

    // Validate required category fields
    if (!productData.category) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // Create new product with shopName included
    const product = await Product.create({
      ...productData,
      vendorId: decoded.userId,
      shopId: shop._id,
      shopName: shop.businessName, // <-- Save shop name
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
