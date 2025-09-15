import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Shop from '@/models/shop';
import User from '@/models/user';

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

    // Only vendors can access their shop
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get vendor's shop
    const shop = await Shop.findOne({ vendorId: decoded.userId });
    
    if (!shop) {
      // If no shop exists, check if we have user data to prefill
      const user = await User.findById(decoded.userId);
      if (user) {
        return NextResponse.json({
          exists: false,
          prefilledData: {
            businessName: user.businessName,
            businessType: user.businessType,
            contact: {
              email: user.email,
              phone: user.phone
            }
          }
        });
      }
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true, shop });
  } catch (error) {
    console.error('Error fetching shop:', error);
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

    // Only vendors can create shops
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const shopData = await req.json();
    
    // Check if shop already exists
    const existingShop = await Shop.findOne({ vendorId: decoded.userId });
    if (existingShop) {
      return NextResponse.json({ message: 'Shop already exists' }, { status: 400 });
    }

    // Create new shop
    const shop = await Shop.create({
      ...shopData,
      vendorId: decoded.userId
    });

    return NextResponse.json({ 
      message: 'Shop created successfully', 
      shop 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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

    // Only vendors can update their shop
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const shopData = await req.json();
    
    // Update shop
    const shop = await Shop.findOneAndUpdate(
      { vendorId: decoded.userId },
      { ...shopData },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Shop updated successfully', 
      shop 
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}