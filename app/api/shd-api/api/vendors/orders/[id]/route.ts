// app/api/shd-api/api/vendors/orders/[id]/route.ts

import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Order from '@/shd-models/models/Order';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const vendor = await Vendor.findOne({ userId: decoded.userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Next.js dynamic params must be awaited
    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      vendorId: vendor._id,
    })
      .populate('customerId', 'name phoneNumber email')
      .populate(
        'riderId',
        'name phone vehicleType rating totalDeliveries'
      );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedOrder = {
      ...order.toObject(),
      rider: order.riderId || null,
      riderId: undefined,
    };

    return NextResponse.json({
      order: formattedOrder,
    });
  } catch (error) {
    console.error('Fetch order details error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
