// // app/api/payouts/result/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Withdrawal from '@/shd-models/models/Withdrawal';
// import Vendor from '@/shd-models/models/Vendor';
// import mongoose from 'mongoose';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const callbackData = await req.json();
//     console.log('📥 Received B2C Result Callback:', JSON.stringify(callbackData, null, 2));

//     const { Result } = callbackData;
    
//     if (!Result) {
//       console.error('❌ Invalid B2C callback format - missing Result');
//       return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
//     }

//     const {
//       ConversationID,
//       OriginatorConversationID,
//       ResultCode,
//       ResultDesc,
//       ResultParameters
//     } = Result;

//     console.log(`B2C Result Callback Details:
//       - ConversationID: ${ConversationID}
//       - OriginatorConversationID: ${OriginatorConversationID}
//       - ResultCode: ${ResultCode}
//       - ResultDesc: ${ResultDesc}`);

//     // Find the withdrawal by transactionId (ConversationID)
//     const withdrawal = await Withdrawal.findOne({
//       transactionId: ConversationID
//     });

//     if (!withdrawal) {
//       console.error(`❌ Withdrawal not found for ConversationID: ${ConversationID}`);
//       return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
//     }

//     console.log(`📦 Found withdrawal: ${withdrawal._id}, Status: ${withdrawal.status}`);

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Extract transaction details from ResultParameters
//       let mpesaReceipt = '';
//       let transactionAmount = 0;
//       let transactionDate = '';

//       if (ResultParameters && ResultParameters.ResultParameter) {
//         ResultParameters.ResultParameter.forEach((param: any) => {
//           if (param.Key === 'ReceiptNo') {
//             mpesaReceipt = param.Value;
//           } else if (param.Key === 'TransactionAmount') {
//             transactionAmount = parseFloat(param.Value);
//           } else if (param.Key === 'TransactionDateTime') {
//             transactionDate = param.Value;
//           }
//         });
//       }

//       if (String(ResultCode) === '0') {
//         // SUCCESSFUL B2C TRANSACTION
//         console.log(`✅ B2C Payment successful! Receipt: ${mpesaReceipt}`);

//         // Update withdrawal status to 'completed' (matches your model)
//         withdrawal.status = 'completed';
//         withdrawal.transactionId = ConversationID;
//         withdrawal.metadata = {
//           ...withdrawal.metadata,
//           mpesaReceipt,
//           transactionAmount,
//           transactionDate,
//           b2cResult: {
//             ConversationID,
//             OriginatorConversationID,
//             ResultCode,
//             ResultDesc,
//             completedAt: new Date()
//           }
//         };

//         await withdrawal.save({ session });
//         console.log(`💰 Withdrawal ${withdrawal._id} marked as completed`);

//       } else {
//         // FAILED B2C TRANSACTION
//         console.error(`❌ B2C Payment failed: ${ResultDesc}`);

//         // Update withdrawal status to 'failed' (matches your model)
//         withdrawal.status = 'failed';
//         withdrawal.errorMessage = ResultDesc || 'B2C payment failed';
//         withdrawal.metadata = {
//           ...withdrawal.metadata,
//           b2cResult: {
//             ConversationID,
//             OriginatorConversationID,
//             ResultCode,
//             ResultDesc,
//             failedAt: new Date()
//           }
//         };

//         await withdrawal.save({ session });

//         // REFUND the money back to vendor since B2C failed
//         const vendor = await Vendor.findById(withdrawal.vendorId).session(session);
//         if (vendor) {
//           vendor.availableBalance = (vendor.availableBalance || 0) + withdrawal.amount;
//           vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) - withdrawal.amount;
//           await vendor.save({ session });
//           console.log(`🔄 Refunded ${withdrawal.amount} back to vendor ${vendor.businessName}`);
//         }

//         console.log(`❌ Withdrawal ${withdrawal._id} marked as failed and refunded`);
//       }

//       await session.commitTransaction();
//       console.log(`✅ B2C callback processed successfully for withdrawal ${withdrawal._id}`);

//     } catch (error) {
//       await session.abortTransaction();
//       console.error('❌ Error processing B2C callback:', error);
//       throw error;
//     } finally {
//       session.endSession();
//     }

//     return NextResponse.json(
//       { ResultCode: 0, ResultDesc: "Success" },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('❌ B2C Result Callback error:', error);
//     return NextResponse.json(
//       { ResultCode: 0, ResultDesc: "Success" },
//       { status: 200 }
//     );
//   }
// }

// app/api/payouts/result/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { createLogger } from '@/app/api/c2b-webhook/utils/logger';
import { B2CResultHandler } from '@/app/api/c2b-webhook/handlers/b2c-result.handler';

const logger = createLogger('B2CResultRoute');

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const callbackData = await req.json();
    logger.info('=== B2C RESULT ENDPOINT HIT ===');
    logger.info('Raw callback data:', JSON.stringify(callbackData, null, 2));

    const handler = new B2CResultHandler();
    const processed = await handler.handle(callbackData);

    logger.info(`B2C result processing completed: ${processed}`);

    // Always return success to M-Pesa
    return NextResponse.json(
      { 
        ResultCode: 0, 
        ResultDesc: processed ? 'Success' : 'Processed with warnings' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error('B2C result callback error:', error);
    // Always return success to M-Pesa to prevent retries
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: 'Success' },
      { status: 200 }
    );
  }
}