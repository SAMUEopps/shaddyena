import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { processB2BPayment, processB2CPayment } from '@/shd-lib/lib/mpesa';
import Payout from '@/shd-models/models/Payout';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { payoutId } = body;

    const payout = await Payout.findById(payoutId);
    if (!payout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      );
    }

    if (payout.status !== 'failed') {
      return NextResponse.json(
        { error: 'Only failed payouts can be retried' },
        { status: 400 }
      );
    }

    // Process payout based on method
    let result;
    switch (payout.payoutMethod) {
      case 'MPESA':
        result = await processB2CPayment(
          payout.payoutDetails.mpesaNumber,
          payout.totalPayout,
          'BusinessPayment',
          `Retry Payout ${payout._id}`
        );
        break;

      case 'POCHI':
        result = await processB2CPayment(
          payout.payoutDetails.pochiNumber,
          payout.totalPayout,
          'BusinessPayment',
          `Retry Payout ${payout._id}`
        );
        break;

      case 'TILL':
        result = await processB2BPayment(
          payout.payoutDetails.tillNumber,
          payout.orderId.toString(),
          payout.totalPayout,
          'BusinessBuyGoods'
        );
        break;

      case 'PAYBILL':
        result = await processB2BPayment(
          payout.payoutDetails.paybillNumber,
          payout.payoutDetails.paybillAccount || payout.orderId.toString(),
          payout.totalPayout,
          'BusinessPayBill'
        );
        break;
    }

    payout.status = 'completed';
    payout.transactionId = result.ConversationID || result.CheckoutRequestID;
    payout.retryCount += 1;
    await payout.save();

    return NextResponse.json({
      message: 'Payout retry successful',
      payout
    });

  } catch (error) {
    console.error('Payout retry error:', error);
    return NextResponse.json(
      { error: 'Payout retry failed' },
      { status: 500 }
    );
  }
}