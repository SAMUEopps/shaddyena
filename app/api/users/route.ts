import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    /* -------------------- AUTHENTICATION -------------------- */

    // Get JWT from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch current user
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Admin check
    if (currentUser.role !== 'admin' && currentUser.role !== 'vendor') {
    //if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    /* -------------------- QUERY PARAMS -------------------- */

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    /* -------------------- FILTER -------------------- */

    const filter: any = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    /* -------------------- PAGINATION -------------------- */

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    /* -------------------- RESPONSE -------------------- */

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
