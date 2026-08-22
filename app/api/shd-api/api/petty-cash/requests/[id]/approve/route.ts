// // // app/api/petty-cash/requests/[id]/approve/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// // import Budget from '@/shd-models/models/Budget';
// // import jwt from 'jsonwebtoken';
// // import mongoose from 'mongoose';

// // async function verifyAuth(req: NextRequest) {
// //   try {
// //     const authHeader = req.headers.get('authorization');
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return { error: 'No token provided', status: 401 };
// //     }

// //     const token = authHeader.split(' ')[1];
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
// //     return { userId: decoded.userId, role: decoded.role };
// //   } catch (error) {
// //     return { error: 'Invalid token', status: 401 };
// //   }
// // }

// // // export async function POST(
// // //   req: NextRequest,
// // //   { params }: { params: { id: string } }
// // // ) {
// // //   try {
// // //     const auth = await verifyAuth(req);
// // //     if (auth.error) {
// // //       return NextResponse.json(
// // //         { success: false, error: auth.error },
// // //         { status: auth.status }
// // //       );
// // //     }

// // //     await connectToDatabase();

// // //     const request = await ExpenseRequest.findById(params.id);

// // //     if (!request) {
// // //       return NextResponse.json(
// // //         { success: false, error: 'Request not found' },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     if (request.status !== 'pending') {
// // //       return NextResponse.json(
// // //         { success: false, error: 'Request is not pending' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Check budget
// // //     const budget = await Budget.findOne({
// // //       status: 'active',
// // //       createdBy: auth.userId
// // //     });

// // //     if (!budget) {
// // //       return NextResponse.json(
// // //         { success: false, error: 'No active budget found' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     if (request.amount > budget.remainingAmount) {
// // //       return NextResponse.json(
// // //         { success: false, error: 'Insufficient budget' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Update request
// // //     request.status = 'approved';
// // //     request.approverId = new mongoose.Types.ObjectId(auth.userId);
// // //     request.approvedAt = new Date();
// // //     await request.save();

// // //     // Update budget
// // //     budget.spentAmount = (budget.spentAmount || 0) + request.amount;
// // //     budget.platformFees = (budget.platformFees || 0) + request.platformFee;
// // //     budget.remainingAmount = budget.allocatedAmount - budget.spentAmount;

// // //     if (budget.remainingAmount < 0) {
// // //       budget.status = 'overdrawn';
// // //     }

// // //     await budget.save();

// // //     return NextResponse.json({
// // //       success: true,
// // //       message: 'Request approved successfully',
// // //       request: request
// // //     });

// // //   } catch (error: any) {
// // //     console.error('Error approving request:', error);
// // //     return NextResponse.json(
// // //       { success: false, error: error.message },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }


// // export async function POST(
// //   req: NextRequest,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     const auth = await verifyAuth(req);

// //     if (auth.error) {
// //       return NextResponse.json(
// //         { success: false, error: auth.error },
// //         { status: auth.status }
// //       );
// //     }

// //     const { id } = await params;

// //     await connectToDatabase();

// //     const request = await ExpenseRequest.findById(id);

// //     if (!request) {
// //       return NextResponse.json(
// //         { success: false, error: 'Request not found' },
// //         { status: 404 }
// //       );
// //     }

// //     if (request.status !== 'pending') {
// //       return NextResponse.json(
// //         { success: false, error: 'Request is not pending' },
// //         { status: 400 }
// //       );
// //     }

// //     // Check budget
// //     const budget = await Budget.findOne({
// //       status: 'active',
// //       createdBy: auth.userId
// //     });

// //     if (!budget) {
// //       return NextResponse.json(
// //         { success: false, error: 'No active budget found' },
// //         { status: 400 }
// //       );
// //     }

// //     if (request.amount > budget.remainingAmount) {
// //       return NextResponse.json(
// //         { success: false, error: 'Insufficient budget' },
// //         { status: 400 }
// //       );
// //     }

// //     // Update request
// //     request.status = 'approved';
// //     request.approverId = new mongoose.Types.ObjectId(auth.userId);
// //     request.approvedAt = new Date();

// //     await request.save();

// //     // Update budget
// //     budget.spentAmount =
// //       (budget.spentAmount || 0) + request.amount;

// //     budget.platformFees =
// //       (budget.platformFees || 0) + request.platformFee;

// //     budget.remainingAmount =
// //       budget.allocatedAmount - budget.spentAmount;

// //     if (budget.remainingAmount < 0) {
// //       budget.status = 'overdrawn';
// //     }

// //     await budget.save();

// //     return NextResponse.json({
// //       success: true,
// //       message: 'Request approved successfully',
// //       request
// //     });

// //   } catch (error: any) {
// //     console.error('Error approving request:', error);

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: error.message
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }


// // app/api/petty-cash/requests/[id]/approve/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// import Budget from '@/shd-models/models/Budget';
// import Transaction from '@/shd-models/models/Transaction';
// import { processB2CPayment } from '@/shd-lib/lib/mpesa';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// // Helper to verify JWT token
// async function verifyAuth(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { error: 'No token provided', status: 401 };
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
//     return { userId: decoded.userId, role: decoded.role };
//   } catch (error) {
//     return { error: 'Invalid token', status: 401 };
//   }
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     await connectToDatabase();

//     // Find the request
//     const request = await ExpenseRequest.findById(params.id);

//     if (!request) {
//       return NextResponse.json(
//         { success: false, error: 'Request not found' },
//         { status: 404 }
//       );
//     }

//     if (request.status !== 'pending') {
//       return NextResponse.json(
//         { success: false, error: 'Request is not pending' },
//         { status: 400 }
//       );
//     }

//     // Get active budget
//     const budget = await Budget.findOne({
//       status: 'active',
//       createdBy: auth.userId
//     });

//     if (!budget) {
//       return NextResponse.json(
//         { success: false, error: 'No active budget found' },
//         { status: 400 }
//       );
//     }

//     // Check if budget has enough remaining amount
//     if (request.totalAmount > budget.remainingAmount) {
//       return NextResponse.json({
//         success: false,
//         error: `Insufficient budget. Required: KES ${request.totalAmount.toFixed(2)}, Available: KES ${budget.remainingAmount.toFixed(2)}`
//       }, { status: 400 });
//     }

//     // Process B2C payment to recipient
//     try {
//       console.log(`Processing B2C payment for request ${request._id}`);
//       console.log(`Recipient: ${request.recipientPhone}, Amount: ${request.amount}`);

//       const b2cResult = await processB2CPayment(
//         request.recipientPhone,
//         request.amount,
//         'BusinessPayment',
//         `Petty Cash - ${request.description}`,
//         `PC-${request._id.toString().slice(-8)}`
//       );

//       console.log('B2C Result:', b2cResult);

//       // Check if B2C was successful
//       if (!b2cResult || b2cResult.ResponseCode !== '0') {
//         // B2C failed, update request as failed
//         request.status = 'failed';
//         request.metadata = {
//           ...request.metadata,
//           b2cError: b2cResult?.ResponseDescription || 'B2C payment failed',
//           b2cResponse: b2cResult
//         };
//         await request.save();

//         return NextResponse.json({
//           success: false,
//           error: 'B2C payment failed. Please try again.',
//           details: b2cResult
//         }, { status: 400 });
//       }

//       // Update budget - deduct amounts
//       budget.spentAmount = (budget.spentAmount || 0) + request.amount;
//       budget.platformFees = (budget.platformFees || 0) + request.platformFee;
//       budget.remainingAmount = budget.allocatedAmount - budget.spentAmount - budget.platformFees;

//       if (budget.remainingAmount < 0) {
//         budget.status = 'overdrawn';
//       }

//       await budget.save();

//       // Update request
//       request.status = 'paid';
//       request.approverId = new mongoose.Types.ObjectId(auth.userId);
//       request.approvedAt = new Date();
//       request.paidAt = new Date();
//       request.mpesaReference = b2cResult.ConversationID || b2cResult.OriginatorConversationID;
//       request.metadata = {
//         ...request.metadata,
//         b2cResult: b2cResult,
//         paidVia: 'M-Pesa B2C',
//         approvedBy: auth.userId,
//         approvedAt: new Date().toISOString(),
//         conversationId: b2cResult.ConversationID,
//         originatorConversationId: b2cResult.OriginatorConversationID
//       };
//       await request.save();

//       // Create transaction record for the payout
//       const transaction = await Transaction.create({
//         transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
//         type: 'petty_cash_payout',
//         status: 'success',
//         amount: request.amount,
//         phoneNumber: request.recipientPhone,
//         userId: new mongoose.Types.ObjectId(auth.userId),
//         budgetId: budget._id,
//         receiptNumber: b2cResult.ConversationID || b2cResult.OriginatorConversationID,
//         purpose: `Petty Cash Payout - ${request.description}`,
//         metadata: {
//           requestId: request._id,
//           description: request.description,
//           category: request.category,
//           platformFee: request.platformFee,
//           totalAmount: request.totalAmount,
//           b2cResult: b2cResult,
//           paidAt: new Date().toISOString()
//         }
//       });

//       return NextResponse.json({
//         success: true,
//         message: 'Request approved and payment sent successfully!',
//         request: request,
//         transaction: transaction,
//         b2cResult: b2cResult
//       });

//     } catch (b2cError: any) {
//       console.error('B2C Payment Error:', b2cError);

//       // Update request as failed
//       request.status = 'failed';
//       request.metadata = {
//         ...request.metadata,
//         b2cError: b2cError.message || 'B2C payment failed',
//         b2cErrorDetails: b2cError.response?.data || b2cError
//       };
//       await request.save();

//       return NextResponse.json({
//         success: false,
//         error: 'Failed to process B2C payment. Please try again.',
//         details: b2cError.message
//       }, { status: 500 });
//     }

//   } catch (error: any) {
//     console.error('Error approving request:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



// app/api/petty-cash/requests/[id]/approve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Budget from '@/shd-models/models/Budget';
import Transaction from '@/shd-models/models/Transaction';
import { processB2CPayment } from '@/shd-lib/lib/mpesa';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/* =========================================================
   AUTHENTICATION
========================================================= */

async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: 'No token provided',
        status: 401,
      };
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as {
      userId: string;
      role: string;
    };

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);

    return {
      error: 'Invalid token',
      status: 401,
    };
  }
}

/* =========================================================
   APPROVE PETTY CASH REQUEST
========================================================= */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /* =====================================================
       AUTH
    ===================================================== */

    const auth = await verifyAuth(req);

    if (auth.error) {
      return NextResponse.json(
        {
          success: false,
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    /* =====================================================
       NEXT.JS 15/16 DYNAMIC PARAMS
    ===================================================== */

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request ID',
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       DATABASE
    ===================================================== */

    await connectToDatabase();

    /* =====================================================
       FIND EXPENSE REQUEST
    ===================================================== */

    const request = await ExpenseRequest.findById(id);

    if (!request) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found',
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       CHECK REQUEST STATUS
    ===================================================== */

    if (
      request.status !== 'pending' &&
      request.status !== 'failed'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request is not pending or failed',
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       FIND ACTIVE BUDGET
    ===================================================== */

    const budget = await Budget.findOne({
      status: 'active',
      createdBy: auth.userId,
    });

    if (!budget) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active budget found',
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CHECK BUDGET
    ===================================================== */

    if (request.totalAmount > budget.remainingAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient budget. Required: KES ${request.totalAmount.toFixed(
            2
          )}, Available: KES ${budget.remainingAmount.toFixed(2)}`,
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       UPDATE BUDGET
    ===================================================== */

    budget.spentAmount =
      (budget.spentAmount || 0) + request.amount;

    budget.platformFees =
      (budget.platformFees || 0) + request.platformFee;

    budget.remainingAmount =
      budget.allocatedAmount -
      budget.spentAmount -
      budget.platformFees;

    if (budget.remainingAmount < 0) {
      budget.status = 'overdrawn';
    }

    await budget.save();

    /* =====================================================
       UPDATE REQUEST
    ===================================================== */

    request.status = 'approved';

    request.approverId = new mongoose.Types.ObjectId(
      auth.userId
    );

    request.approvedAt = new Date();

    request.metadata = {
      ...request.metadata,
      approvedBy: auth.userId,
      approvedAt: new Date().toISOString(),
      budgetWasUpdated: true,
    };

    await request.save();

    /* =====================================================
       CREATE TRANSACTION
    ===================================================== */

    const transaction = await Transaction.create({
      transactionId: `TXN-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,

      type: 'petty_cash_payout',

      status: 'pending',

      amount: request.amount,

      phoneNumber: request.recipientPhone,

      userId: new mongoose.Types.ObjectId(auth.userId),

      budgetId: budget._id,

      purpose: `Petty Cash Payout - ${request.description}`,

      metadata: {
        requestId: request._id,
        description: request.description,
        category: request.category,
        platformFee: request.platformFee,
        totalAmount: request.totalAmount,
        initiatedAt: new Date().toISOString(),
      },
    });

    /* =====================================================
       PROCESS B2C PAYMENT
    ===================================================== */

    try {
      console.log(
        `Processing B2C payment for request ${request._id}`
      );

      console.log(
        `Recipient: ${request.recipientPhone}, Amount: ${request.amount}`
      );

      /* ===================================================
         ORIGINATOR CONVERSATION ID
      =================================================== */

      const originatorConversationId = `SHAD_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}`;

      /* ===================================================
         SAVE INITIAL B2C TRACKING DATA
      =================================================== */

      request.metadata = {
        ...request.metadata,

        originatorConversationId,

        transactionId: transaction._id,
      };

      await request.save();

      /* ===================================================
         INITIATE B2C
      =================================================== */

      const b2cResult = await processB2CPayment(
        request.recipientPhone,
        request.amount,
        'BusinessPayment',
        `Petty Cash - ${request.description}`,
        `PC-${request._id.toString().slice(-8)}`
      );

      console.log('B2C Result:', b2cResult);

      /* ===================================================
         CHECK B2C RESPONSE
      =================================================== */

      if (
        b2cResult &&
        b2cResult.ResponseCode === '0'
      ) {
        /* ===============================================
           UPDATE REQUEST WITH B2C DETAILS
        =============================================== */

        request.metadata = {
          ...request.metadata,

          b2cInitiated: true,

          b2cResponse: b2cResult,

          conversationId:
            b2cResult.ConversationID,

          originatorConversationId:
            b2cResult.OriginatorConversationID ||
            originatorConversationId,
        };

        await request.save();

        /* ===============================================
           UPDATE TRANSACTION
        =============================================== */

        transaction.metadata = {
          ...transaction.metadata,

          b2cInitiated: true,

          b2cResponse: b2cResult,

          conversationId:
            b2cResult.ConversationID,

          originatorConversationId:
            b2cResult.OriginatorConversationID ||
            originatorConversationId,
        };

        await transaction.save();

        /* ===============================================
           IMPORTANT
           
           Do NOT mark as paid here.
           
           M-Pesa callback should confirm the actual
           payment before changing the transaction/request
           to paid.
        =============================================== */

        return NextResponse.json(
          {
            success: true,

            message:
              'B2C payment initiated successfully. Waiting for confirmation from M-Pesa.',

            request,

            transaction,

            b2cResult,
          },
          {
            status: 200,
          }
        );
      }

      /* =================================================
         B2C INITIATION FAILED
      ================================================= */

      throw new Error(
        b2cResult?.ResponseDescription ||
          'B2C payment initiation failed'
      );
    } catch (b2cError: any) {
      console.error(
        'B2C Payment Error:',
        b2cError
      );

      /* =================================================
         REVERT BUDGET
      ================================================= */

      budget.spentAmount = Math.max(
        0,
        (budget.spentAmount || 0) -
          request.amount
      );

      budget.platformFees = Math.max(
        0,
        (budget.platformFees || 0) -
          request.platformFee
      );

      budget.remainingAmount =
        budget.allocatedAmount -
        budget.spentAmount -
        budget.platformFees;

      if (budget.remainingAmount >= 0) {
        budget.status = 'active';
      }

      await budget.save();

      /* =================================================
         UPDATE REQUEST AS FAILED
      ================================================= */

      request.status = 'failed';

      request.metadata = {
        ...request.metadata,

        b2cError:
          b2cError?.message ||
          'B2C payment failed',

        b2cErrorDetails:
          b2cError?.response?.data ||
          b2cError,

        failedAt:
          new Date().toISOString(),
      };

      await request.save();

      /* =================================================
         UPDATE TRANSACTION AS FAILED
      ================================================= */

      transaction.status = 'failed';

      transaction.errorMessage =
        b2cError?.message ||
        'B2C payment failed';

      transaction.metadata = {
        ...transaction.metadata,

        b2cError:
          b2cError?.message ||
          'B2C payment failed',

        failedAt:
          new Date().toISOString(),
      };

      await transaction.save();

      /* =================================================
         RETURN ERROR
      ================================================= */

      return NextResponse.json(
        {
          success: false,

          error:
            'Failed to process B2C payment. Please try again.',

          details:
            b2cError?.message ||
            'B2C payment failed',
        },
        {
          status: 500,
        }
      );
    }
  } catch (error: any) {
    /* ===================================================
       GENERAL ERROR
    =================================================== */

    console.error(
      'Error approving request:',
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}