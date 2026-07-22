import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Order from '@/models/Order';
import { queryTransactionStatus } from '@/lib/mpesa';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // M-Pesa callback structure
    const { Body } = body;
    const resultCode = Body.stkCallback.ResultCode;
    const checkoutRequestId = Body.stkCallback.CheckoutRequestID;
    const resultDesc = Body.stkCallback.ResultDesc;

    // Find transaction
    const transaction = await Transaction.findOne({ 
      transactionId: checkoutRequestId 
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = Body.stkCallback.CallbackMetadata.Item;
      const receiptNumber = callbackMetadata.find((item: { Name: string; }) => item.Name === 'ReceiptNumber')?.Value;
      const amount = callbackMetadata.find((item: { Name: string; }) => item.Name === 'Amount')?.Value;
      const phoneNumber = callbackMetadata.find((item: { Name: string; }) => item.Name === 'PhoneNumber')?.Value;

      // Update transaction
      transaction.status = 'success';
      transaction.receiptNumber = receiptNumber;
      transaction.amount = amount;
      transaction.phoneNumber = phoneNumber;
      await transaction.save();

      // Update orders
      const orderIds = transaction.metadata?.orders || [];
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { 
          isPaid: true,
          status: 'processing',
          transactionId: checkoutRequestId
        }
      );

      // Mark products as sold
      for (const orderId of orderIds) {
        const order = await Order.findById(orderId);
        if (order) {
          for (const product of order.products) {
            await Product.findByIdAndUpdate(product.productId, {
              $inc: { stock: -product.quantity }
            });
          }
        }
      }

      return NextResponse.json({ 
        message: 'Payment processed successfully',
        receiptNumber
      });

    } else {
      // Payment failed
      transaction.status = 'failed';
      transaction.metadata = { 
        ...transaction.metadata,
        error: resultDesc 
      };
      await transaction.save();

      // Cancel orders
      const orderIds = transaction.metadata?.orders || [];
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { status: 'cancelled' }
      );

      return NextResponse.json({ 
        error: 'Payment failed',
        reason: resultDesc 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}