import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import RiderRequest from '@/models/RiderRequest';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'pending';
    const search = searchParams.get('search') || '';

    // Build filter
    const filter: any = {};

    if (status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { idNumber: { $regex: search, $options: 'i' } },
        { vehiclePlate: { $regex: search, $options: 'i' } },
      ];
    }

    // Get paginated requests
    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      RiderRequest.find(filter)
        .populate('userId', 'firstName lastName email role phone')
        .populate('reviewedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RiderRequest.countDocuments(filter),
    ]);

    // Get statistics
    const stats = await RiderRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    stats.forEach((stat) => {
      if (stat._id === 'pending') statsMap.pending = stat.count;
      if (stat._id === 'approved') statsMap.approved = stat.count;
      if (stat._id === 'rejected') statsMap.rejected = stat.count;
    });

    // Get additional stats for admin dashboard
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayApplications = await RiderRequest.countDocuments({
      createdAt: { $gte: today },
    });

    return NextResponse.json({
      success: true,
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: statsMap,
      todayApplications,
    });
  } catch (error) {
    console.error('Error fetching rider requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rider requests' },
      { status: 500 }
    );
  }
}