// app/api/payment-status/[orderRef]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderRef: string }> }
) {
  try {
    await dbConnect();

    const { orderRef } = await context.params; // 🔥 FIXED

    // Check both OrderDraft and Order collections
    const draft = await OrderDraft.findOne({ shortRef: orderRef });
    const order = await Order.findOne({
      'payment.mpesaTransactionId': { $exists: true }
    });

    if (order) {
      return NextResponse.json({
        status: 'success',
        orderId: order.orderId,
        paid: true
      });
    }

    if (draft) {
      return NextResponse.json({
        status: draft.status,
        paid: draft.status === 'CONFIRMED'
      });
    }

    return NextResponse.json({ status: 'not_found', paid: false });
  } catch (error) {
    return NextResponse.json({ status: 'error', paid: false });
  }
}
