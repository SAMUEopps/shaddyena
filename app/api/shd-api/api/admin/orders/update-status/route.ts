// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\orders\update-status\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { processVendorPayout } from '@/shd-lib/lib/payout-engine';
import Order from '@/shd-models/models/Order';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(req: NextRequest) {
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
    const { orderId, status } = body;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    // If delivered, process payout
    if (status === 'delivered' && !order.isPayoutComplete) {
      try {
        await processVendorPayout(order._id);
        order.isPayoutComplete = true;
        await order.save();
      } catch (error) {
        console.error('Payout processing error:', error);
      }
    }

    return NextResponse.json({
      message: 'Order status updated',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}