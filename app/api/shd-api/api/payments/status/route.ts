import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { queryTransactionStatus } from '@/shd-lib/lib/mpesa';
import Transaction from '@/shd-models/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'CheckoutRequestId required' },
        { status: 400 }
      );
    }

    // Query M-Pesa status
    const statusResponse = await queryTransactionStatus(checkoutRequestId);
    
    // Update transaction status
    const transaction = await Transaction.findOne({ 
      transactionId: checkoutRequestId 
    });

    if (transaction) {
      const resultCode = statusResponse.ResultCode;
      if (resultCode === '0') {
        transaction.status = 'success';
      } else if (resultCode === '1037') {
        transaction.status = 'pending';
      } else {
        transaction.status = 'failed';
      }
      await transaction.save();
    }

    return NextResponse.json({
      checkoutRequestId,
      status: statusResponse.ResultCode,
      description: statusResponse.ResultDesc,
      transaction
    });

  } catch (error) {
    console.error('Status query error:', error);
    return NextResponse.json(
      { error: 'Status query failed' },
      { status: 500 }
    );
  }
}