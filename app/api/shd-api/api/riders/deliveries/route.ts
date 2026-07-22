// C:\Users\USER\Desktop\Projects\my-app\app\api\rider\deliveries\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import Rider from '@/models/Rider';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
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

    // Get all deliveries for this rider
    const deliveries = await Delivery.find({
      $or: [
        { assignedRiderId: rider._id },
        { status: 'pending' } // Available deliveries
      ]
    })
    .populate('orderId')
    .sort({ createdAt: -1 })
    .limit(50);

    // Format deliveries for frontend
    const formattedDeliveries = deliveries.map(delivery => ({
      id: delivery._id,
      orderId: delivery.orderId?._id || delivery.orderId,
      customerName: delivery.customerName || 'Customer',
      customerPhone: delivery.customerPhone || 'N/A',
      pickupLocation: delivery.pickupLocation || 'N/A',
      dropoffLocation: delivery.dropoffLocation || 'N/A',
      status: delivery.status || 'pending',
      distance: delivery.distance || 0,
      earnings: delivery.earnings || 0,
      createdAt: delivery.createdAt,
      estimatedTime: delivery.estimatedTime || '30 min'
    }));

    return NextResponse.json(formattedDeliveries);

  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}