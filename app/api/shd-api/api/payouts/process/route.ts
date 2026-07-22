import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { processB2BPayment, processB2CPayment } from '@/shd-lib/lib/mpesa';
import Order from '@/shd-models/models/Order';
import Payout from '@/shd-models/models/Payout';
import Transaction from '@/shd-models/models/Transaction';
import Vendor from '@/shd-models/models/Vendor';
import { NextRequest, NextResponse } from 'next/server';


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

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.isPayoutComplete) {
      return NextResponse.json(
        { error: 'Payout already processed' },
        { status: 400 }
      );
    }

    // Get vendor payout preferences
    const vendor = await Vendor.findById(order.vendorId);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Create payout record
    const payout = await Payout.create({
      orderId: order._id,
      vendorId: vendor._id,
      amount: order.vendorAmount,
      commission: order.commission,
      totalPayout: order.vendorAmount,
      payoutMethod: vendor.payoutMethod,
      payoutDetails: vendor.payoutDetails,
      status: 'processing'
    });

    // Process payout based on method
    let payoutResult;
    switch (vendor.payoutMethod) {
      case 'MPESA':
        payoutResult = await processB2CPayment(
          vendor.payoutDetails.mpesaNumber || vendor.phoneNumber,
          order.vendorAmount,
          'BusinessPayment',
          `Payout for Order ${order.orderNumber}`
        );
        break;

      case 'POCHI':
        // For Pochi, we'd use a different API
        // For now, we'll use B2C to a Pochi number
        payoutResult = await processB2CPayment(
          vendor.payoutDetails.pochiNumber || vendor.phoneNumber,
          order.vendorAmount,
          'BusinessPayment',
          `Payout for Order ${order.orderNumber}`
        );
        break;

      case 'TILL':
        payoutResult = await processB2BPayment(
          vendor.payoutDetails.tillNumber,
          order.orderNumber,
          order.vendorAmount,
          'BusinessBuyGoods'
        );
        break;

      case 'PAYBILL':
        payoutResult = await processB2BPayment(
          vendor.payoutDetails.paybillNumber,
          vendor.payoutDetails.paybillAccount || order.orderNumber,
          order.vendorAmount,
          'BusinessPayBill'
        );
        break;

      default:
        throw new Error('Invalid payout method');
    }

    // Update payout record
    payout.status = 'completed';
    payout.transactionId = payoutResult.ConversationID || payoutResult.CheckoutRequestID;
    await payout.save();

    // Update order
    order.isPayoutComplete = true;
    order.updatedAt = new Date();
    await order.save();

    // Create transaction record
    await Transaction.create({
      transactionId: payoutResult.ConversationID || payoutResult.CheckoutRequestID,
      phoneNumber: vendor.phoneNumber,
      amount: order.vendorAmount,
      status: 'success',
      type: 'payout',
      orderId: order._id,
      vendorId: vendor._id,
      metadata: { payoutMethod: vendor.payoutMethod }
    });

    // Update vendor earnings
    vendor.totalEarned += order.vendorAmount;
    await vendor.save();

    return NextResponse.json({
      message: 'Payout processed successfully',
      payout,
      result: payoutResult
    });

  } catch (error: any) {
    console.error('Payout processing error:', error);
    
    // Mark payout as failed if we have a payout record
    if (error?.payoutId) {
      await Payout.findByIdAndUpdate(error.payoutId, {
        status: 'failed',
        errorMessage: error?.message,
        retryCount: { $inc: 1 }
      });
    }

    return NextResponse.json(
      { error: 'Payout processing failed' },
      { status: 500 }
    );
  }
}