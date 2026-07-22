import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';


export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { orderId } = body;

    const order = await Order.findOne({
      _id: orderId,
      customerId: decoded.userId
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'shipped') {
      return NextResponse.json(
        { error: 'Order cannot be confirmed yet' },
        { status: 400 }
      );
    }

    // Update order status to delivered
    order.status = 'delivered';
    order.updatedAt = new Date();
    await order.save();

    // Trigger payout
    await triggerPayout(order._id);

    return NextResponse.json({
      message: 'Order confirmed successfully',
      order
    });

  } catch (error) {
    console.error('Order confirmation error:', error);
    return NextResponse.json(
      { error: 'Order confirmation failed' },
      { status: 500 }
    );
  }
}

async function triggerPayout(orderId: string) {
  try {
    // Call payout API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });

    if (!response.ok) {
      console.error('Payout trigger failed for order:', orderId);
    }
  } catch (error) {
    console.error('Payout trigger error:', error);
  }
}