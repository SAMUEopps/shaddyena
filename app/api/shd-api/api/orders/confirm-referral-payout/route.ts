// app/api/orders/confirm-referral-payout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import ReferralPayout from '@/models/ReferralPayout';
import { verifyToken } from '@/lib/auth';
import { processB2CPayment } from '@/lib/mpesa';

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
    const { orderId } = body;

    const order = await Order.findById(orderId).populate('referredBy');
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order is delivered and has referral commission
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Order must be delivered to process referral payout' },
        { status: 400 }
      );
    }

    if (order.referralPayoutComplete) {
      return NextResponse.json(
        { error: 'Referral payout already processed' },
        { status: 400 }
      );
    }

    if (!order.referredBy || order.referralCommission === 0) {
      return NextResponse.json(
        { error: 'No referral commission to process' },
        { status: 400 }
      );
    }

    // Get referrer
    const referrer = await User.findById(order.referredBy);
    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    // Create referral payout record
    const payout = new ReferralPayout({
      referrerId: referrer._id,
      referredVendorId: order.vendorId,
      orderId: order._id,
      type: 'order_commission',
      amount: order.referralCommission,
      percentage: 0.5,
      status: 'pending'
    });

    await payout.save();

    // Process B2C payment to referrer
    try {
      const mpesaResponse = await processB2CPayment(
        referrer.phoneNumber,
        order.referralCommission,
        'BusinessPayment',
        `Referral commission for order ${order.orderNumber}`,
        `Order: ${order.orderNumber}`
      );

      // Update payout with transaction ID
      payout.transactionId = mpesaResponse.ConversationID || mpesaResponse.OriginatorConversationID;
      payout.status = 'processed';
      payout.processedAt = new Date();
      await payout.save();

      // Update referrer's earnings
      referrer.referralEarnings = (referrer.referralEarnings || 0) + order.referralCommission;
      referrer.referralCommissionEarnings = (referrer.referralCommissionEarnings || 0) + order.referralCommission;
      await referrer.save();

      // Mark order as referral payout complete
      order.referralPayoutComplete = true;
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Referral payout processed successfully',
        payout,
        amount: order.referralCommission
      });

    } catch (mpesaError) {
      console.error('M-Pesa payout failed:', mpesaError);
      payout.status = 'failed';
      await payout.save();
      
      return NextResponse.json(
        { error: 'M-Pesa payout failed. Please retry.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Referral payout error:', error);
    return NextResponse.json(
      { error: 'Failed to process referral payout' },
      { status: 500 }
    );
  }
}