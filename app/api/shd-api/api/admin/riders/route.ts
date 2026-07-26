// app/api/admin/riders/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Rider from '@/shd-models/models/Rider';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');
    const isAvailable = searchParams.get('isAvailable');
    const vehicleType = searchParams.get('vehicleType');
    const search = searchParams.get('search');
    
    let query: any = {};
    if (isActive !== null) query.isActive = isActive === 'true';
    if (isAvailable !== null) query.isAvailable = isAvailable === 'true';
    if (vehicleType) query.vehicleType = vehicleType;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { vehicleRegistration: { $regex: search, $options: 'i' } }
      ];
    }

    const riders = await Rider.find(query)
      .populate('userId', 'name email phoneNumber isVerified')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true,
      riders,
      total: riders.length 
    });

  } catch (error) {
    console.error('Error fetching riders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch riders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    
    // Check if user exists
    const user = await User.findById(body.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if rider already exists for this user
    const existingRider = await Rider.findOne({ userId: body.userId });
    if (existingRider) {
      return NextResponse.json({ error: 'User already has a rider profile' }, { status: 400 });
    }

    // Check if national ID already registered
    const existingNationalId = await Rider.findOne({ nationalId: body.nationalId });
    if (existingNationalId) {
      return NextResponse.json({ error: 'National ID already registered' }, { status: 400 });
    }

    // Update user role to rider
    await User.findByIdAndUpdate(body.userId, { role: 'rider' });

    const rider = await Rider.create({
      ...body,
      createdAt: new Date()
    });

    const populatedRider = await Rider.findById(rider._id)
      .populate('userId', 'name email phoneNumber isVerified');

    return NextResponse.json({
      success: true,
      message: 'Rider created successfully',
      rider: populatedRider
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating rider:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create rider' },
      { status: 500 }
    );
  }
}