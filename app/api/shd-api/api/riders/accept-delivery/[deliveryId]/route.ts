// C:\Users\USER\Desktop\Projects\my-app\app\api\rider\accept-delivery\[deliveryId]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

import Rider from '@/models/Rider';
import { verifyToken } from '@/lib/auth';
import Delivery from '@/models/Delivery';

export async function POST(
  req: NextRequest,
  { params }: { params: { deliveryId: string } }
) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'rider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rider = await Rider.findOne({ userId: decoded.userId });
    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    // Check if rider is available
    if (!rider.isAvailable) {
      return NextResponse.json(
        { error: 'You are offline. Go online to accept deliveries.' },
        { status: 400 }
      );
    }

    const delivery = await Delivery.findById(params.deliveryId);
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.status !== 'pending') {
      return NextResponse.json(
        { error: 'This delivery is no longer available' },
        { status: 400 }
      );
    }

    // Assign delivery to rider
    delivery.assignedRiderId = rider._id;
    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();
    await delivery.save();

    return NextResponse.json({
      message: 'Delivery accepted successfully',
      delivery
    });

  } catch (error) {
    console.error('Error accepting delivery:', error);
    return NextResponse.json(
      { error: 'Failed to accept delivery' },
      { status: 500 }
    );
  }
}