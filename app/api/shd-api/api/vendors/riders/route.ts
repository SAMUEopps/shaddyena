// app/api/vendors/riders/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Rider from '@/shd-models/models/Rider';
import User from '@/shd-models/models/User';
import Vendor from '@/shd-models/models/Vendor';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get vendor
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Get all available riders
    const riders = await Rider.find({
      isActive: true,
      isAvailable: true,
    }).populate('userId', 'name phoneNumber email');

    // Format rider data
    const formattedRiders = riders.map(rider => ({
      id: rider._id,
      userId: rider.userId._id,
      name: rider.fullName || rider.userId.name,
      phone: rider.phoneNumber || rider.userId.phoneNumber,
      email: rider.email || rider.userId.email,
      vehicleType: rider.vehicleType,
      vehicleRegistration: rider.vehicleRegistration,
      rating: rider.rating || 5.0,
      totalDeliveries: rider.totalDeliveries || 0,
      currentLocation: rider.currentLocation,
      deliveryRadius: rider.deliveryRadius || 10
    }));

    return NextResponse.json({
      success: true,
      riders: formattedRiders
    });

  } catch (error) {
    console.error('Error fetching riders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch riders' },
      { status: 500 }
    );
  }
}