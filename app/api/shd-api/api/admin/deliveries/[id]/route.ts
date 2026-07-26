// app/api/admin/deliveries/[id]/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Delivery from '@/shd-models/models/Delivery';
import Rider from '@/shd-models/models/Rider';
import { NextRequest, NextResponse } from 'next/server';

// Next.js 15+ requires async params
type Params = Promise<{ id: string }>;

export async function GET(
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

    const delivery = await Delivery.findById(id)
      .populate('orderId', 'orderNumber totalAmount items customerId')
      .populate('assignedRiderId', 'fullName phoneNumber vehicleType rating');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, delivery });

  } catch (error) {
    console.error('Error fetching delivery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    
    // Check if delivery exists
    const existingDelivery = await Delivery.findById(id);
    if (!existingDelivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if rider exists if assigning
    if (body.assignedRiderId && body.assignedRiderId !== existingDelivery.assignedRiderId?.toString()) {
      const rider = await Rider.findById(body.assignedRiderId);
      if (!rider) {
        return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
      }
    }

    // Update status timestamps based on status
    const statusTimestamps: any = {};
    if (body.status === 'accepted' && existingDelivery.status !== 'accepted') {
      statusTimestamps.acceptedAt = new Date();
    }
    if (body.status === 'picked_up' && existingDelivery.status !== 'picked_up') {
      statusTimestamps.pickedUpAt = new Date();
    }
    if (body.status === 'in_transit' && existingDelivery.status !== 'in_transit') {
      statusTimestamps.inTransitAt = new Date();
    }
    if (body.status === 'delivered' && existingDelivery.status !== 'delivered') {
      statusTimestamps.deliveredAt = new Date();
    }
    if (body.status === 'completed' && existingDelivery.status !== 'completed') {
      statusTimestamps.completedAt = new Date();
    }

    const updateData = {
      ...body,
      ...statusTimestamps
    };

    const delivery = await Delivery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('orderId', 'orderNumber totalAmount items')
    .populate('assignedRiderId', 'fullName phoneNumber vehicleType');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      delivery,
      message: 'Delivery updated successfully' 
    });

  } catch (error) {
    console.error('Error updating delivery:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const delivery = await Delivery.findByIdAndDelete(id);

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Delivery deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting delivery:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery' },
      { status: 500 }
    );
  }
}