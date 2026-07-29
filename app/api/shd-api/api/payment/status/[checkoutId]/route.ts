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

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';

import Transaction from '@/shd-models/models/Transaction';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ checkoutId: string }> }
) {
  try {
    await connectToDatabase();

    const token = req.headers
      .get('authorization')
      ?.split(' ')[1];


    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const { checkoutId } = await params;


    console.log(
      `🔍 Checking payment status: ${checkoutId}`
    );


    let transaction = await Transaction.findOne({
      checkoutRequestId: checkoutId,
      userId: decoded.userId
    });


    if (!transaction) {
      return NextResponse.json(
        {
          status: 'pending',
          message: 'Transaction not found'
        },
        { status: 404 }
      );
    }



    console.log("📋 Transaction:", {
      id: transaction._id,
      status: transaction.status,
      type: transaction.type
    });



    // Already completed
    if (transaction.status === "success") {

      return NextResponse.json({
        status: "success",
        message: "Payment completed",
        transaction
      });

    }



    // Already failed
    if (transaction.status === "failed") {

      return NextResponse.json({
        status: "failed",
        message:
          transaction.errorMessage ||
          "Payment failed",
        transaction
      });

    }



    try {

      const service =
        new MpesaPaymentService(decoded.userId);


      const result =
        await service.queryPaymentStatus(checkoutId);



      // Reload latest transaction
      transaction =
        await Transaction.findOne({
          checkoutRequestId: checkoutId
        });



      return NextResponse.json({

        status:
          transaction?.status || result.status,

        message:
          result.message ||
          "Payment pending",

        transaction

      });


    } catch(error:any){


      console.log(
        "M-Pesa query failed:",
        error.message
      );


      return NextResponse.json({

        status:"pending",

        message:
          "Waiting for payment confirmation",

        transaction

      });


    }


  } catch(error:any){

    console.error(
      "Payment status error:",
      error
    );


    return NextResponse.json(
      {
        status:"pending",
        message:error.message
      },
      {
        status:500
      }
    );

  }
}