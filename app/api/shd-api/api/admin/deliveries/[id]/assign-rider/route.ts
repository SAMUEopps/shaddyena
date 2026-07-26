// app/api/admin/deliveries/[id]/assign-rider/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Delivery from '@/shd-models/models/Delivery';
import Rider from '@/shd-models/models/Rider';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
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
    const { riderId } = body;

    if (!riderId) {
      return NextResponse.json({ error: 'Rider ID required' }, { status: 400 });
    }

    // Check if delivery exists
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if rider exists
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    // Check if rider is available
    if (!rider.isAvailable || !rider.isActive) {
      return NextResponse.json({ error: 'Rider is not available' }, { status: 400 });
    }

    // Update delivery
    delivery.assignedRiderId = riderId;
    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();
    await delivery.save();

    const updatedDelivery = await Delivery.findById(id)
      .populate('orderId', 'orderNumber totalAmount items')
      .populate('assignedRiderId', 'fullName phoneNumber vehicleType');

    return NextResponse.json({
      success: true,
      message: 'Rider assigned successfully',
      delivery: updatedDelivery
    });

  } catch (error) {
    console.error('Error assigning rider:', error);
    return NextResponse.json(
      { error: 'Failed to assign rider' },
      { status: 500 }
    );
  }
}