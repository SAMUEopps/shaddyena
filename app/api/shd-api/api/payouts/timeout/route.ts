// app/api/shd-api/api/payouts/timeout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Withdrawal from '@/shd-models/models/Withdrawal';
import Vendor from '@/shd-models/models/Vendor';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    console.log('⏰ B2C Timeout Callback:', JSON.stringify(body, null, 2));

    const result = body.Result;
    if (result) {
      const { ConversationID, ResultDesc } = result;
      
      const withdrawal = await Withdrawal.findOne({ 
        transactionId: ConversationID 
      });

      if (withdrawal) {
        withdrawal.status = 'failed';
        withdrawal.errorMessage = ResultDesc || 'B2C payment timed out';
        await withdrawal.save();

        // Refund the amount back to vendor
        const vendor = await Vendor.findById(withdrawal.vendorId);
        if (vendor) {
          vendor.availableBalance = (vendor.availableBalance || 0) + withdrawal.amount;
          vendor.totalWithdrawn = Math.max(0, (vendor.totalWithdrawn || 0) - withdrawal.amount);
          await vendor.save();
          console.log(`💰 Refunded ${withdrawal.amount} to vendor due to timeout`);
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('B2C Timeout callback error:', error);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}