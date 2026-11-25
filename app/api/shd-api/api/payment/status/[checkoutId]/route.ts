// // // // // app/api/shd-api/api/payment/status/[checkoutId]/route.ts
// // // // import { NextRequest, NextResponse } from 'next/server';
// // // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// // // // import Transaction from '@/shd-models/models/Transaction';
// // // // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// // // // export async function GET(
// // // //   req: NextRequest,
// // // //   { params }: { params: { checkoutId: string } }
// // // // ) {
// // // //   try {
// // // //     await connectToDatabase();
    
// // // //     const token = req.headers.get('authorization')?.split(' ')[1];
// // // //     if (!token) {
// // // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // // //     }

// // // //     const decoded = verifyToken(token);
// // // //     if (!decoded) {
// // // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // // //     }

// // // //     const { checkoutId } = params;

// // // //     // Find transaction
// // // //     const transaction = await Transaction.findOne({ 
// // // //       checkoutRequestId: checkoutId,
// // // //       userId: decoded.userId
// // // //     });

// // // //     if (!transaction) {
// // // //       return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
// // // //     }

// // // //     const mpesaService = new MpesaPaymentService(decoded.userId);
// // // //     const result = await mpesaService.queryPaymentStatus(checkoutId);

// // // //     return NextResponse.json({
// // // //       status: result.status,
// // // //       message: result.message,
// // // //       transaction: {
// // // //         id: transaction._id,
// // // //         amount: transaction.amount,
// // // //         purpose: transaction.purpose,
// // // //         createdAt: transaction.createdAt
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Payment status error:', error);
// // // //     return NextResponse.json(
// // // //       { error: 'Failed to check payment status' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // // app/api/shd-api/api/payment/status/[checkoutId]/route.ts
// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// // // import Transaction from '@/shd-models/models/Transaction';
// // // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// // // export async function GET(
// // //   req: NextRequest,
// // //   { params }: { params: { checkoutId: string } }
// // // ) {
// // //   try {
// // //     await connectToDatabase();
    
// // //     const token = req.headers.get('authorization')?.split(' ')[1];
// // //     if (!token) {
// // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // //     }

// // //     const decoded = verifyToken(token);
// // //     if (!decoded) {
// // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // //     }

// // //     const { checkoutId } = params;

// // //     // Find transaction
// // //     const transaction = await Transaction.findOne({ 
// // //       checkoutRequestId: checkoutId,
// // //       userId: decoded.userId
// // //     });

// // //     if (!transaction) {
// // //       return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
// // //     }

// // //     // Check if transaction is already completed
// // //     if (transaction.status === 'success') {
// // //       return NextResponse.json({
// // //         status: 'success',
// // //         message: 'Payment completed successfully',
// // //         transaction: {
// // //           id: transaction._id,
// // //           amount: transaction.amount,
// // //           purpose: transaction.purpose,
// // //           receiptNumber: transaction.receiptNumber,
// // //           createdAt: transaction.createdAt
// // //         }
// // //       });
// // //     }

// // //     if (transaction.status === 'failed') {
// // //       return NextResponse.json({
// // //         status: 'failed',
// // //         message: transaction.errorMessage || 'Payment failed',
// // //         transaction: {
// // //           id: transaction._id,
// // //           amount: transaction.amount,
// // //           purpose: transaction.purpose,
// // //           createdAt: transaction.createdAt
// // //         }
// // //       });
// // //     }

// // //     // Query M-Pesa for status
// // //     const mpesaService = new MpesaPaymentService(decoded.userId);
// // //     const result = await mpesaService.queryPaymentStatus(checkoutId);

// // //     return NextResponse.json({
// // //       status: result.status,
// // //       message: result.message,
// // //       transaction: {
// // //         id: transaction._id,
// // //         amount: transaction.amount,
// // //         purpose: transaction.purpose,
// // //         receiptNumber: transaction.receiptNumber,
// // //         createdAt: transaction.createdAt
// // //       }
// // //     });

// // //   } catch (error: any) {
// // //     console.error('Payment status error:', error);
// // //     return NextResponse.json(
// // //       { error: error.message || 'Failed to check payment status' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // import { NextRequest, NextResponse } from 'next/server';
// // import { verifyToken } from '@/shd-lib/lib/auth';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// // import Transaction from '@/shd-models/models/Transaction';
// // import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// // export async function GET(
// //   req: NextRequest,
// //   { params }: { params: Promise<{ checkoutId: string }> }
// // ) {
// //   try {
// //     await connectToDatabase();

// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     if (!token) {
// //       return NextResponse.json(
// //         { error: 'Unauthorized' },
// //         { status: 401 }
// //       );
// //     }

// //     const decoded = verifyToken(token);
// //     if (!decoded) {
// //       return NextResponse.json(
// //         { error: 'Unauthorized' },
// //         { status: 401 }
// //       );
// //     }

// //     // ✅ Next.js 15+ requires awaiting params
// //     const { checkoutId } = await params;

// //     // Find transaction
// //     const transaction = await Transaction.findOne({
// //       checkoutRequestId: checkoutId,
// //       userId: decoded.userId,
// //     });

// //     if (!transaction) {
// //       return NextResponse.json(
// //         { error: 'Transaction not found' },
// //         { status: 404 }
// //       );
// //     }

// //     // Check if transaction is already completed
// //     if (transaction.status === 'success') {
// //       return NextResponse.json({
// //         status: 'success',
// //         message: 'Payment completed successfully',
// //         transaction: {
// //           id: transaction._id,
// //           amount: transaction.amount,
// //           purpose: transaction.purpose,
// //           receiptNumber: transaction.receiptNumber,
// //           createdAt: transaction.createdAt,
// //         },
// //       });
// //     }

// //     if (transaction.status === 'failed') {
// //       return NextResponse.json({
// //         status: 'failed',
// //         message: transaction.errorMessage || 'Payment failed',
// //         transaction: {
// //           id: transaction._id,
// //           amount: transaction.amount,
// //           purpose: transaction.purpose,
// //           createdAt: transaction.createdAt,
// //         },
// //       });
// //     }

// //     // Query M-Pesa for latest status
// //     const mpesaService = new MpesaPaymentService(decoded.userId);
// //     const result = await mpesaService.queryPaymentStatus(checkoutId);

// //     return NextResponse.json({
// //       status: result.status,
// //       message: result.message,
// //       transaction: {
// //         id: transaction._id,
// //         amount: transaction.amount,
// //         purpose: transaction.purpose,
// //         receiptNumber: transaction.receiptNumber,
// //         createdAt: transaction.createdAt,
// //       },
// //     });

// //   } catch (error: any) {
// //     console.error('Payment status error:', error);

// //     return NextResponse.json(
// //       {
// //         error: error.message || 'Failed to check payment status',
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }


// // app/api/shd-api/api/payment/status/[checkoutId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// import Transaction from '@/shd-models/models/Transaction';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { checkoutId: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { checkoutId } = params;
//     console.log(`🔍 Checking payment status for checkout: ${checkoutId}`);

//     // Find transaction
//     const transaction = await Transaction.findOne({ 
//       checkoutRequestId: checkoutId,
//       userId: decoded.userId
//     });

//     if (!transaction) {
//       console.error('Transaction not found for checkout ID:', checkoutId);
//       return NextResponse.json({ 
//         status: 'pending', 
//         message: 'Transaction not found' 
//       }, { status: 404 });
//     }

//     console.log(`📋 Transaction found:`, {
//       id: transaction._id,
//       status: transaction.status,
//       type: transaction.type,
//       receiptNumber: transaction.receiptNumber
//     });

//     // If transaction is already completed in database
//     if (transaction.status === 'success') {
//       console.log('✅ Transaction already marked as success in database');
//       return NextResponse.json({
//         status: 'success',
//         message: 'Payment completed successfully',
//         transaction: {
//           id: transaction._id,
//           amount: transaction.amount,
//           purpose: transaction.purpose,
//           receiptNumber: transaction.receiptNumber,
//           createdAt: transaction.createdAt
//         }
//       });
//     }

//     if (transaction.status === 'failed') {
//       console.log('❌ Transaction marked as failed in database');
//       return NextResponse.json({
//         status: 'failed',
//         message: transaction.errorMessage || 'Payment failed',
//         transaction: {
//           id: transaction._id,
//           amount: transaction.amount,
//           purpose: transaction.purpose,
//           createdAt: transaction.createdAt
//         }
//       });
//     }

//     // If transaction is pending, query M-Pesa for status
//     try {
//       console.log('📡 Querying M-Pesa for status...');
//       const mpesaService = new MpesaPaymentService(decoded.userId);
//       const result = await mpesaService.queryPaymentStatus(checkoutId);
      
//       console.log('📊 M-Pesa query result:', result);

//       // Check if the callback already updated the transaction
//       const updatedTransaction = await Transaction.findOne({ 
//         checkoutRequestId: checkoutId,
//         userId: decoded.userId
//       });

//       if (updatedTransaction.status === 'success') {
//         return NextResponse.json({
//           status: 'success',
//           message: 'Payment completed successfully',
//           transaction: {
//             id: updatedTransaction._id,
//             amount: updatedTransaction.amount,
//             purpose: updatedTransaction.purpose,
//             receiptNumber: updatedTransaction.receiptNumber,
//             createdAt: updatedTransaction.createdAt
//           }
//         });
//       }

//       return NextResponse.json({
//         status: result.status || 'pending',
//         message: result.message || 'Payment pending',
//         transaction: {
//           id: transaction._id,
//           amount: transaction.amount,
//           purpose: transaction.purpose,
//           receiptNumber: transaction.receiptNumber,
//           createdAt: transaction.createdAt
//         }
//       });

//     } catch (mpesaError: any) {
//       console.error('M-Pesa status query error:', mpesaError);
      
//       // Check if transaction was updated by callback
//       const updatedTransaction = await Transaction.findOne({ 
//         checkoutRequestId: checkoutId,
//         userId: decoded.userId
//       });

//       if (updatedTransaction.status === 'success') {
//         return NextResponse.json({
//           status: 'success',
//           message: 'Payment completed successfully',
//           transaction: {
//             id: updatedTransaction._id,
//             amount: updatedTransaction.amount,
//             purpose: updatedTransaction.purpose,
//             receiptNumber: updatedTransaction.receiptNumber,
//             createdAt: updatedTransaction.createdAt
//           }
//         });
//       }

//       return NextResponse.json({
//         status: 'pending',
//         message: 'Still processing...',
//         transaction: {
//           id: transaction._id,
//           amount: transaction.amount,
//           purpose: transaction.purpose,
//           createdAt: transaction.createdAt
//         }
//       });
//     }

//   } catch (error: any) {
//     console.error('Payment status error:', error);
//     return NextResponse.json(
//       { 
//         status: 'pending', 
//         message: error.message || 'Failed to check payment status' 
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/payment/status/[checkoutId]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';

// import Transaction from '@/shd-models/models/Transaction';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';


// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ checkoutId: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const token = req.headers
//       .get('authorization')
//       ?.split(' ')[1];


//     if (!token) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }


//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }


//     const { checkoutId } = await params;


//     console.log(
//       `🔍 Checking payment status: ${checkoutId}`
//     );


//     let transaction = await Transaction.findOne({
//       checkoutRequestId: checkoutId,
//       userId: decoded.userId
//     });


//     if (!transaction) {
//       return NextResponse.json(
//         {
//           status: 'pending',
//           message: 'Transaction not found'
//         },
//         { status: 404 }
//       );
//     }



//     console.log("📋 Transaction:", {
//       id: transaction._id,
//       status: transaction.status,
//       type: transaction.type
//     });



//     // Already completed
//     if (transaction.status === "success") {

//       return NextResponse.json({
//         status: "success",
//         message: "Payment completed",
//         transaction
//       });

//     }



//     // Already failed
//     if (transaction.status === "failed") {

//       return NextResponse.json({
//         status: "failed",
//         message:
//           transaction.errorMessage ||
//           "Payment failed",
//         transaction
//       });

//     }



//     try {

//       const service =
//         new MpesaPaymentService(decoded.userId);


//       const result =
//         await service.queryPaymentStatus(checkoutId);



//       // Reload latest transaction
//       transaction =
//         await Transaction.findOne({
//           checkoutRequestId: checkoutId
//         });



//       return NextResponse.json({

//         status:
//           transaction?.status || result.status,

//         message:
//           result.message ||
//           "Payment pending",

//         transaction

//       });


//     } catch(error:any){


//       console.log(
//         "M-Pesa query failed:",
//         error.message
//       );


//       return NextResponse.json({

//         status:"pending",

//         message:
//           "Waiting for payment confirmation",

//         transaction

//       });


//     }


//   } catch(error:any){

//     console.error(
//       "Payment status error:",
//       error
//     );


//     return NextResponse.json(
//       {
//         status:"pending",
//         message:error.message
//       },
//       {
//         status:500
//       }
//     );

//   }
// }


// app/api/shd-api/api/payment/status/[checkoutId]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Transaction from '@/shd-models/models/Transaction';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ checkoutId: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { checkoutId } = await params;

//     // ✅ scope by user via metadata.userId (Transaction has no userId field)
//     const transaction = await Transaction.findOne({
//       checkoutRequestId: checkoutId,
//       'metadata.userId': decoded.userId,
//     });

//     if (!transaction) {
//       return NextResponse.json(
//         { status: 'pending', message: 'Transaction not found' },
//         { status: 404 }
//       );
//     }

//     // terminal states
//     if (transaction.status === 'success') {
//       return NextResponse.json({
//         status: 'success',
//         message: 'Payment completed',
//         transaction,
//       });
//     }
//     if (transaction.status === 'failed' || transaction.status === 'cancelled') {
//       return NextResponse.json({
//         status: transaction.status,
//         message: transaction.errorMessage || 'Payment failed',
//         transaction,
//       });
//     }

//     // still pending → ask M-Pesa
//     try {
//       // ✅ organizationId is required by the service constructor
//       const service = new MpesaPaymentService(
//         decoded.userId,
//         transaction.organizationId.toString()
//       );

//       const result = await service.queryPaymentStatus(checkoutId);

//       const updated = await Transaction.findById(transaction._id);

//       return NextResponse.json({
//         status: updated?.status || result.status,
//         message: result.message || 'Payment pending',
//         transaction: updated,
//       });
//     } catch (error: any) {
//       console.log('M-Pesa query failed:', error.message);
//       return NextResponse.json({
//         status: 'pending',
//         message: 'Waiting for payment confirmation',
//         transaction,
//       });
//     }
//   } catch (error: any) {
//     console.error('Payment status error:', error);
//     return NextResponse.json(
//       { status: 'pending', message: error.message },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/payment/status/[checkoutId]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Transaction from '@/shd-models/models/Transaction';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ checkoutId: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { checkoutId } = await params;

//     const transaction = await Transaction.findOne({
//       checkoutRequestId: checkoutId,
//       'metadata.userId': decoded.userId,
//     });

//     if (!transaction) {
//       // ✅ CHANGED: return 200 with pending, not 404. The deposit route may
//       // not have written checkoutRequestId yet when the first poll fires.
//       // Returning 404 caused the client to silently miss the success status.
//       return NextResponse.json({
//         status: 'pending',
//         message: 'Transaction not found yet',
//       });
//     }

//     // Terminal states — short-circuit, no M-Pesa query
//     if (transaction.status === 'success') {
//       return NextResponse.json({
//         status: 'success',
//         message: 'Payment completed',
//         transaction,
//       });
//     }
//     if (transaction.status === 'failed' || transaction.status === 'cancelled') {
//       return NextResponse.json({
//         status: transaction.status,
//         message: transaction.errorMessage || 'Payment failed',
//         transaction,
//       });
//     }

//     // Still pending → ask M-Pesa
//     try {
//       const service = new MpesaPaymentService(
//         decoded.userId,
//         transaction.organizationId.toString()
//       );
//       const result = await service.queryPaymentStatus(checkoutId);
//       const updated = await Transaction.findById(transaction._id);

//       return NextResponse.json({
//         status: updated?.status || result.status,
//         message: result.message || 'Payment pending',
//         transaction: updated,
//       });
//     } catch (error: any) {
//       console.log('M-Pesa query failed:', error.message);
//       // ✅ CHANGED: if the error is *fatal* (e.g. the transaction was already
//       // marked success by the callback), surface that instead of hiding it.
//       const fresh = await Transaction.findById(transaction._id);
//       if (fresh && fresh.status === 'success') {
//         return NextResponse.json({
//           status: 'success',
//           message: 'Payment completed',
//           transaction: fresh,
//         });
//       }
//       if (fresh && (fresh.status === 'failed' || fresh.status === 'cancelled')) {
//         return NextResponse.json({
//           status: fresh.status,
//           message: fresh.errorMessage || 'Payment failed',
//           transaction: fresh,
//         });
//       }
//       return NextResponse.json({
//         status: 'pending',
//         message: 'Waiting for payment confirmation',
//         transaction: fresh,
//       });
//     }
//   } catch (error: any) {
//     console.error('Payment status error:', error);
//     return NextResponse.json(
//       { status: 'pending', message: error.message },
//       { status: 200 }
//     );
//   }
// }


// app/api/shd-api/api/payment/status/[checkoutId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// ✅ In-memory throttle per checkoutRequestId.
// Prevents hammering Daraja's stkpushquery (which 429s aggressively).
const lastQueryAt = new Map<string, number>();
const QUERY_INTERVAL_MS = 30_000; // at most one Daraja query per 30s per checkout

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ checkoutId: string }> }
) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { checkoutId } = await params;

    const transaction = await Transaction.findOne({
      checkoutRequestId: checkoutId,
      'metadata.userId': decoded.userId,
    });

    if (!transaction) {
      return NextResponse.json({
        status: 'pending',
        message: 'Transaction not found yet',
      });
    }

    // Terminal states — never touch Daraja again
    if (transaction.status === 'success') {
      return NextResponse.json({
        status: 'success',
        message: 'Payment completed',
        transaction,
      });
    }
    if (transaction.status === 'failed' || transaction.status === 'cancelled') {
      return NextResponse.json({
        status: transaction.status,
        message: transaction.errorMessage || 'Payment failed',
        transaction,
      });
    }

    // ── Still pending. Decide whether to ask Daraja this time. ──
    const now = Date.now();
    const last = lastQueryAt.get(checkoutId) || 0;
    const dueForQuery = now - last >= QUERY_INTERVAL_MS;

    if (!dueForQuery) {
      // Cheap path: return DB state without a Daraja call.
      return NextResponse.json({
        status: 'pending',
        message: 'Waiting for payment confirmation',
        transaction,
      });
    }

    lastQueryAt.set(checkoutId, now);

    try {
      const service = new MpesaPaymentService(
        decoded.userId,
        transaction.organizationId.toString()
      );
      const result = await service.queryPaymentStatus(checkoutId);
      const updated = await Transaction.findById(transaction._id);

      // Clear throttle once terminal so the map doesn't grow forever
      if (updated && (updated.status === 'success' || updated.status === 'failed')) {
        lastQueryAt.delete(checkoutId);
      }

      return NextResponse.json({
        status: updated?.status || result.status,
        message: result.message || 'Payment pending',
        transaction: updated,
      });
    } catch (error: any) {
      // 429 = Daraja rate limit. Treat as "keep waiting", NOT failure.
      const isRateLimited =
        error?.response?.status === 429 ||
        error?.status === 429 ||
        /429/.test(error?.message || '');

      const fresh = await Transaction.findById(transaction._id);

      if (fresh && fresh.status === 'success') {
        lastQueryAt.delete(checkoutId);
        return NextResponse.json({
          status: 'success',
          message: 'Payment completed',
          transaction: fresh,
        });
      }
      if (fresh && (fresh.status === 'failed' || fresh.status === 'cancelled')) {
        lastQueryAt.delete(checkoutId);
        return NextResponse.json({
          status: fresh.status,
          message: fresh.errorMessage || 'Payment failed',
          transaction: fresh,
        });
      }

      return NextResponse.json({
        status: 'pending',
        message: isRateLimited
          ? 'Waiting for M-Pesa confirmation (rate-limited)'
          : 'Waiting for payment confirmation',
        transaction: fresh,
      });
    }
  } catch (error: any) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { status: 'pending', message: error.message },
      { status: 200 }
    );
  }
}