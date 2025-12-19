import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import User from '@/models/user';
import VendorEarnings from '@/models/VendorEarnings';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Authentication
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

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId).select('-password');
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Search filter (by order ID or vendor name)
    let searchFilter: any[] = [];
    if (search) {
      searchFilter = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'vendorId.firstName': { $regex: search, $options: 'i' } },
        { 'vendorId.lastName': { $regex: search, $options: 'i' } },
        { 'vendorId.businessName': { $regex: search, $options: 'i' } }
      ];
    }

    const query = searchFilter.length > 0 
      ? { $and: [filter, { $or: searchFilter }] }
      : filter;

    // Fetch earnings with vendor details
    const [earnings, total] = await Promise.all([
      VendorEarnings.find(query)
        .populate('vendorId', 'firstName lastName email businessName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VendorEarnings.countDocuments(query)
    ]);

    return NextResponse.json({
      earnings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });

  } catch (error) {
    console.error('Error fetching all earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}