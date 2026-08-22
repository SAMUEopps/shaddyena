// // app/api/shd-api/api/payouts/timeout/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Withdrawal from '@/shd-models/models/Withdrawal';
// import Vendor from '@/shd-models/models/Vendor';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const body = await req.json();
//     console.log('⏰ B2C Timeout Callback:', JSON.stringify(body, null, 2));

//     const result = body.Result;
//     if (result) {
//       const { ConversationID, ResultDesc } = result;
      
//       const withdrawal = await Withdrawal.findOne({ 
//         transactionId: ConversationID 
//       });

//       if (withdrawal) {
//         withdrawal.status = 'failed';
//         withdrawal.errorMessage = ResultDesc || 'B2C payment timed out';
//         await withdrawal.save();

//         // Refund the amount back to vendor
//         const vendor = await Vendor.findById(withdrawal.vendorId);
//         if (vendor) {
//           vendor.availableBalance = (vendor.availableBalance || 0) + withdrawal.amount;
//           vendor.totalWithdrawn = Math.max(0, (vendor.totalWithdrawn || 0) - withdrawal.amount);
//           await vendor.save();
//           console.log(`💰 Refunded ${withdrawal.amount} to vendor due to timeout`);
//         }
//       }
//     }

//     return NextResponse.json({ success: true });

//   } catch (error) {
//     console.error('B2C Timeout callback error:', error);
//     return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
//   }
// }

// app/api/payouts/timeout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { createLogger } from '@/app/api/c2b-webhook/utils/logger';
import { B2CResultHandler } from '@/app/api/c2b-webhook/handlers/b2c-result.handler';


const logger = createLogger('B2CTimeoutRoute');

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const callbackData = await req.json();
    logger.info('=== B2C TIMEOUT ENDPOINT HIT ===');
    logger.info('Raw timeout data:', JSON.stringify(callbackData, null, 2));

    const handler = new B2CResultHandler();
    const processed = await handler.handleTimeout(callbackData);

    logger.info(`B2C timeout processing completed: ${processed}`);

    // Always return success to M-Pesa
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: 'Success' },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error('B2C timeout callback error:', error);
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: 'Success' },
      { status: 200 }
    );
  }
}