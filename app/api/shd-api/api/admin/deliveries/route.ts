// app/api/admin/deliveries/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Delivery from '@/shd-models/models/Delivery';
import Order from '@/shd-models/models/Order';
import Rider from '@/shd-models/models/Rider';
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
    const status = searchParams.get('status');
    const riderId = searchParams.get('riderId');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let query: any = {};
    if (status) query.status = status;
    if (riderId) query.assignedRiderId = riderId;
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { pickupLocation: { $regex: search, $options: 'i' } },
        { dropoffLocation: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const deliveries = await Delivery.find(query)
      .populate('orderId', 'orderNumber totalAmount items')
      .populate('assignedRiderId', 'fullName phoneNumber vehicleType')
      .sort({ createdAt: -1 });

    // Get counts for each status
    const statusCounts = await Delivery.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({ 
      success: true,
      deliveries,
      total: deliveries.length,
      statusCounts
    });

  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
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
    
    // Check if order exists
    const order = await Order.findById(body.orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if rider exists if assigned
    if (body.assignedRiderId) {
      const rider = await Rider.findById(body.assignedRiderId);
      if (!rider) {
        return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
      }
    }

    // Generate unique confirmation code
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const delivery = await Delivery.create({
      ...body,
      confirmationCode,
      codeGeneratedAt: new Date(),
      codeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
    });

    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('orderId', 'orderNumber totalAmount items')
      .populate('assignedRiderId', 'fullName phoneNumber vehicleType');

    return NextResponse.json({
      success: true,
      message: 'Delivery created successfully',
      delivery: populatedDelivery
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating delivery:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Confirmation code already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create delivery' },
      { status: 500 }
    );
  }
}