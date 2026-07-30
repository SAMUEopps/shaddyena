// app/api/shd-api/api/advertisements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Advertisement from '@/shd-models/models/Advertisement';
import Vendor from '@/shd-models/models/Vendor';
import { verifyToken } from '@/shd-lib/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find vendor
    //const vendor = await Vendor.findOne({ userId: user.id });
    const vendor = await Vendor.findOne({ userId: user.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const body = await req.json();
    const { imageUrl,  imagePublicId, title, description, link, startDate, endDate, paymentAmount, durationWeeks } = body;

    // Validate required fields
    if (!imageUrl || !title || !startDate || !endDate || !paymentAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create advertisement
    const advertisement = await Advertisement.create({
      vendorId: vendor._id,
      imageUrl,
      imagePublicId,
      title,
      description,
      link,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      paymentAmount,
      paymentStatus: 'pending',
      isActive: true,
      position: 0,
    });

    return NextResponse.json({
      success: true,
      advertisement,
    });

  } catch (error: any) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json({ error: error.message || 'Failed to create advertisement' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get active advertisements for hero section
    const now = new Date();
    const advertisements = await Advertisement.find({
      isActive: true,
      paymentStatus: 'paid',
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
    .populate('vendorId', 'businessName profileImage')
    .sort({ position: 1, createdAt: -1 })
    .limit(5);

    return NextResponse.json({
      success: true,
      advertisements,
    });

  } catch (error: any) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch advertisements' }, { status: 500 });
  }
}