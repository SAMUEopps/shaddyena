// // // app/api/petty-cash/requests/[id]/approve/route.ts

// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// // import Budget from '@/shd-models/models/Budget';
// // import Transaction from '@/shd-models/models/Transaction';
// // import { processB2CPayment } from '@/shd-lib/lib/mpesa';
// // import jwt from 'jsonwebtoken';
// // import mongoose from 'mongoose';

// // async function verifyAuth(req: NextRequest) {
// //   try {
// //     const authHeader = req.headers.get('authorization');

// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return {
// //         error: 'No token provided',
// //         status: 401
// //       };
// //     }

// //     const token = authHeader.split(' ')[1];

// //     const decoded = jwt.verify(
// //       token,
// //       process.env.JWT_SECRET || 'secret'
// //     ) as {
// //       userId: string;
// //       role: string;
// //     };

// //     return {
// //       userId: decoded.userId,
// //       role: decoded.role
// //     };
// //   } catch (error) {
// //     return {
// //       error: 'Invalid token',
// //       status: 401
// //     };
// //   }
// // }

// // export async function POST(
// //   req: NextRequest,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     const auth = await verifyAuth(req);

// //     if (auth.error) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: auth.error
// //         },
// //         { status: auth.status }
// //       );
// //     }

// //     // Next.js 15+ dynamic route params
// //     const { id } = await params;

// //     await connectToDatabase();

// //     // Find the request
// //     const request = await ExpenseRequest.findById(id);

// //     if (!request) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: 'Request not found'
// //         },
// //         { status: 404 }
// //       );
// //     }

// //     if (
// //       request.status !== 'pending' &&
// //       request.status !== 'failed'
// //     ) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: 'Request is not pending or failed'
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Get active budget
// //     const budget = await Budget.findOne({
// //       status: 'active',
// //       createdBy: auth.userId
// //     });

// //     if (!budget) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: 'No active budget found'
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Check if budget has enough remaining amount
// //     if (request.totalAmount > budget.remainingAmount) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: `Insufficient budget. Required: KES ${request.totalAmount.toFixed(
// //             2
// //           )}, Available: KES ${budget.remainingAmount.toFixed(2)}`
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // =========================================================
// //     // 1. DEDUCT BUDGET FIRST
// //     // =========================================================

// //     budget.spentAmount =
// //       (budget.spentAmount || 0) + request.amount;

// //     budget.platformFees =
// //       (budget.platformFees || 0) + request.platformFee;

// //     budget.remainingAmount =
// //       budget.allocatedAmount -
// //       budget.spentAmount -
// //       budget.platformFees;

// //     if (budget.remainingAmount < 0) {
// //       budget.status = 'overdrawn';
// //     }

// //     await budget.save();

// //     // =========================================================
// //     // 2. UPDATE REQUEST TO PROCESSING
// //     // =========================================================

// //     const originatorConversationId =
// //       `SHAD_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// //     request.status = 'processing';

// //     request.approverId =
// //       new mongoose.Types.ObjectId(auth.userId);

// //     request.approvedAt = new Date();

// //     request.metadata = {
// //       ...request.metadata,
// //       approvedBy: auth.userId,
// //       approvedAt: new Date().toISOString(),
// //       budgetWasUpdated: true,
// //       originatorConversationId,
// //       processingStarted: new Date().toISOString()
// //     };

// //     await request.save();

// //     // =========================================================
// //     // 3. CREATE TRANSACTION AS PROCESSING
// //     // =========================================================

// //     const transaction = await Transaction.create({
// //       transactionId:
// //         `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,

// //       type: 'petty_cash_payout',

// //       status: 'processing',

// //       amount: request.amount,

// //       phoneNumber: request.recipientPhone,

// //       userId: new mongoose.Types.ObjectId(auth.userId),

// //       budgetId: budget._id,

// //       purpose:
// //         `Petty Cash Payout - ${request.description}`,

// //       metadata: {
// //         requestId: request._id,
// //         description: request.description,
// //         category: request.category,
// //         platformFee: request.platformFee,
// //         totalAmount: request.totalAmount,
// //         originatorConversationId,
// //         initiatedAt: new Date().toISOString()
// //       }
// //     });

// //     // =========================================================
// //     // 4. INITIATE B2C PAYMENT
// //     // =========================================================

// //     try {
// //       const b2cResult = await processB2CPayment(
// //         request.recipientPhone,
// //         request.amount,
// //         'BusinessPayment',
// //         `Petty Cash - ${request.description}`,
// //         `PC-${request._id.toString().slice(-8)}`
// //       );

// //       // =======================================================
// //       // B2C INITIATED SUCCESSFULLY
// //       // =======================================================

// //       if (
// //         b2cResult &&
// //         b2cResult.ResponseCode === '0'
// //       ) {
// //         const finalOriginatorConversationId =
// //           b2cResult.OriginatorConversationID ||
// //           originatorConversationId;

// //         // Update request
// //         request.metadata = {
// //           ...request.metadata,

// //           b2cInitiated: true,

// //           b2cResponse: b2cResult,

// //           conversationId:
// //             b2cResult.ConversationID,

// //           originatorConversationId:
// //             finalOriginatorConversationId
// //         };

// //         await request.save();

// //         // Update transaction
// //         transaction.metadata = {
// //           ...transaction.metadata,

// //           b2cInitiated: true,

// //           b2cResponse: b2cResult,

// //           conversationId:
// //             b2cResult.ConversationID,

// //           originatorConversationId:
// //             finalOriginatorConversationId
// //         };

// //         await transaction.save();

// //         return NextResponse.json({
// //           success: true,

// //           message:
// //             'B2C payment initiated. Waiting for confirmation from M-Pesa.',

// //           request,

// //           transaction,

// //           b2cResult
// //         });
// //       }

// //       // =======================================================
// //       // B2C INITIATION FAILED
// //       // =======================================================

// //       throw new Error(
// //         b2cResult?.ResponseDescription ||
// //         'B2C payment initiation failed'
// //       );

// //     } catch (b2cError: any) {
// //       console.error(
// //         'B2C Payment Error:',
// //         b2cError
// //       );

// //       // =======================================================
// //       // REVERT BUDGET
// //       // =======================================================

// //       budget.spentAmount = Math.max(
// //         0,
// //         (budget.spentAmount || 0) -
// //           request.amount
// //       );

// //       budget.platformFees = Math.max(
// //         0,
// //         (budget.platformFees || 0) -
// //           request.platformFee
// //       );

// //       budget.remainingAmount =
// //         budget.allocatedAmount -
// //         budget.spentAmount -
// //         budget.platformFees;

// //       if (budget.remainingAmount >= 0) {
// //         budget.status = 'active';
// //       }

// //       await budget.save();

// //       // =======================================================
// //       // UPDATE REQUEST AS FAILED
// //       // =======================================================

// //       request.status = 'failed';

// //       request.metadata = {
// //         ...request.metadata,

// //         b2cError:
// //           b2cError.message ||
// //           'B2C payment failed',

// //         failedAt:
// //           new Date().toISOString()
// //       };

// //       await request.save();

// //       // =======================================================
// //       // UPDATE TRANSACTION AS FAILED
// //       // =======================================================

// //       transaction.status = 'failed';

// //       transaction.errorMessage =
// //         b2cError.message ||
// //         'B2C payment failed';

// //       await transaction.save();

// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error:
// //             'Failed to process B2C payment. Please try again.',
// //           details: b2cError.message
// //         },
// //         { status: 500 }
// //       );
// //     }

// //   } catch (error: any) {
// //     console.error(
// //       'Error approving request:',
// //       error
// //     );

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error:
// //           error.message ||
// //           'Internal server error'
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

// function logSuccess(
//   stage: string,
//   data: Record<string, any> = {}
// ) {
//   console.log(
//     JSON.stringify({
//       level: 'SUCCESS',
//       service: 'PettyCashApproval',
//       stage,
//       timestamp: new Date().toISOString(),
//       ...data
//     })
//   );
// }

// function logFailure(
//   stage: string,
//   error: any,
//   data: Record<string, any> = {}
// ) {
//   console.error(
//     JSON.stringify({
//       level: 'FAILURE',
//       service: 'PettyCashApproval',
//       stage,
//       timestamp: new Date().toISOString(),
//       error:
//         error?.message ||
//         error ||
//         'Unknown error',
//       stack: error?.stack,
//       ...data
//     })
//   );
// }

// function logInfo(
//   stage: string,
//   data: Record<string, any> = {}
// ) {
//   console.log(
//     JSON.stringify({
//       level: 'INFO',
//       service: 'PettyCashApproval',
//       stage,
//       timestamp: new Date().toISOString(),
//       ...data
//     })
//   );
// }

// async function verifyAuth(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       logFailure(
//         'AUTH_MISSING',
//         'No authorization token provided'
//       );

//       return {
//         error: 'No token provided',
//         status: 401
//       };
//     }

//     const token = authHeader.split(' ')[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'secret'
//     ) as {
//       userId: string;
//       role: string;
//     };

//     logSuccess('AUTH_VERIFIED', {
//       userId: decoded.userId,
//       role: decoded.role
//     });

//     return {
//       userId: decoded.userId,
//       role: decoded.role
//     };
//   } catch (error) {
//     logFailure(
//       'AUTH_FAILED',
//       error
//     );

//     return {
//       error: 'Invalid token',
//       status: 401
//     };
//   }
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   let requestId: string | undefined;
//   let transactionId: string | undefined;

//   try {
//     // =========================================================
//     // 1. AUTHENTICATION
//     // =========================================================

//     const auth = await verifyAuth(req);

//     if (auth.error) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: auth.error
//         },
//         { status: auth.status }
//       );
//     }

//     // =========================================================
//     // 2. PARAMS
//     // =========================================================

//     const { id } = await params;

//     requestId = id;

//     logInfo('APPROVAL_STARTED', {
//       requestId,
//       userId: auth.userId,
//       role: auth.role
//     });

//     // =========================================================
//     // 3. DATABASE CONNECTION
//     // =========================================================

//     await connectToDatabase();

//     logSuccess('DATABASE_CONNECTED', {
//       requestId
//     });

//     // =========================================================
//     // 4. FIND EXPENSE REQUEST
//     // =========================================================

//     const request = await ExpenseRequest.findById(id);

//     if (!request) {
//       logFailure(
//         'REQUEST_NOT_FOUND',
//         'Expense request not found',
//         {
//           requestId,
//           userId: auth.userId
//         }
//       );

//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Request not found'
//         },
//         { status: 404 }
//       );
//     }

//     logInfo('REQUEST_FOUND', {
//       requestId: request._id.toString(),
//       currentStatus: request.status,
//       amount: request.amount,
//       totalAmount: request.totalAmount,
//       recipientPhone: request.recipientPhone,
//       category: request.category
//     });

//     // =========================================================
//     // 5. VALIDATE STATUS
//     // =========================================================

//     if (
//       request.status !== 'pending' &&
//       request.status !== 'failed'
//     ) {
//       logFailure(
//         'INVALID_REQUEST_STATUS',
//         `Request status is ${request.status}`,
//         {
//           requestId,
//           currentStatus: request.status,
//           userId: auth.userId
//         }
//       );

//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Request is not pending or failed'
//         },
//         { status: 400 }
//       );
//     }

//     // =========================================================
//     // 6. FIND ACTIVE BUDGET
//     // =========================================================

//     const budget = await Budget.findOne({
//       status: 'active',
//       createdBy: auth.userId
//     });

//     if (!budget) {
//       logFailure(
//         'ACTIVE_BUDGET_NOT_FOUND',
//         'No active budget found',
//         {
//           requestId,
//           userId: auth.userId
//         }
//       );

//       return NextResponse.json(
//         {
//           success: false,
//           error: 'No active budget found'
//         },
//         { status: 400 }
//       );
//     }

//     logSuccess('ACTIVE_BUDGET_FOUND', {
//       requestId,
//       budgetId: budget._id.toString(),
//       allocatedAmount: budget.allocatedAmount,
//       spentAmount: budget.spentAmount,
//       platformFees: budget.platformFees,
//       remainingAmount: budget.remainingAmount
//     });

//     // =========================================================
//     // 7. CHECK BUDGET
//     // =========================================================

//     if (request.totalAmount > budget.remainingAmount) {
//       logFailure(
//         'INSUFFICIENT_BUDGET',
//         'Insufficient budget',
//         {
//           requestId,
//           budgetId: budget._id.toString(),
//           requiredAmount: request.totalAmount,
//           availableAmount: budget.remainingAmount,
//           userId: auth.userId
//         }
//       );

//       return NextResponse.json(
//         {
//           success: false,
//           error: `Insufficient budget. Required: KES ${request.totalAmount.toFixed(
//             2
//           )}, Available: KES ${budget.remainingAmount.toFixed(2)}`
//         },
//         { status: 400 }
//       );
//     }

//     // =========================================================
//     // 8. DEDUCT BUDGET
//     // =========================================================

//     const oldBudgetRemaining =
//       budget.remainingAmount;

//     budget.spentAmount =
//       (budget.spentAmount || 0) +
//       request.amount;

//     budget.platformFees =
//       (budget.platformFees || 0) +
//       request.platformFee;

//     budget.remainingAmount =
//       budget.allocatedAmount -
//       budget.spentAmount -
//       budget.platformFees;

//     if (budget.remainingAmount < 0) {
//       budget.status = 'overdrawn';
//     }

//     await budget.save();

//     logSuccess('BUDGET_DEDUCTED', {
//       requestId,
//       budgetId: budget._id.toString(),
//       amount: request.amount,
//       platformFee: request.platformFee,
//       previousRemainingAmount: oldBudgetRemaining,
//       newRemainingAmount: budget.remainingAmount
//     });

//     // =========================================================
//     // 9. UPDATE REQUEST TO PROCESSING
//     // =========================================================

//     const originatorConversationId =
//       `SHAD_${Date.now()}_${Math.floor(
//         Math.random() * 10000
//       )}`;

//     request.status = 'processing';

//     request.approverId =
//       new mongoose.Types.ObjectId(auth.userId);

//     request.approvedAt = new Date();

//     request.metadata = {
//       ...request.metadata,

//       approvedBy: auth.userId,

//       approvedAt:
//         new Date().toISOString(),

//       budgetWasUpdated: true,

//       originatorConversationId,

//       processingStarted:
//         new Date().toISOString()
//     };

//     await request.save();

//     logSuccess('REQUEST_SET_TO_PROCESSING', {
//       requestId,
//       userId: auth.userId,
//       originatorConversationId
//     });

//     // =========================================================
//     // 10. CREATE TRANSACTION
//     // =========================================================

//     const transaction = await Transaction.create({
//       transactionId:
//         `TXN-${Date.now()}-${Math.floor(
//           Math.random() * 10000
//         )}`,

//       type: 'petty_cash_payout',

//       status: 'processing',

//       amount: request.amount,

//       phoneNumber:
//         request.recipientPhone,

//       userId:
//         new mongoose.Types.ObjectId(
//           auth.userId
//         ),

//       budgetId: budget._id,

//       purpose:
//         `Petty Cash Payout - ${request.description}`,

//       metadata: {
//         requestId: request._id,
//         description:
//           request.description,
//         category:
//           request.category,
//         platformFee:
//           request.platformFee,
//         totalAmount:
//           request.totalAmount,
//         originatorConversationId,
//         initiatedAt:
//           new Date().toISOString()
//       }
//     });

//     transactionId =
//       transaction.transactionId;

//     logSuccess('TRANSACTION_CREATED', {
//       requestId,
//       transactionId,
//       transactionMongoId:
//         transaction._id.toString(),
//       amount: request.amount,
//       phoneNumber:
//         request.recipientPhone,
//       status: transaction.status
//     });

//     // =========================================================
//     // 11. INITIATE B2C
//     // =========================================================

//     logInfo('B2C_INITIATION_STARTED', {
//       requestId,
//       transactionId,
//       phoneNumber:
//         request.recipientPhone,
//       amount: request.amount,
//       originatorConversationId
//     });

//     try {
//       const b2cResult =
//         await processB2CPayment(
//           request.recipientPhone,
//           request.amount,
//           'BusinessPayment',
//           `Petty Cash - ${request.description}`,
//           `PC-${request._id
//             .toString()
//             .slice(-8)}`
//         );

//       logInfo('B2C_RESPONSE_RECEIVED', {
//         requestId,
//         transactionId,
//         responseCode:
//           b2cResult?.ResponseCode,
//         responseDescription:
//           b2cResult?.ResponseDescription,
//         conversationId:
//           b2cResult?.ConversationID,
//         originatorConversationId:
//           b2cResult?.OriginatorConversationID
//       });

//       // =======================================================
//       // 12. B2C INITIATED SUCCESSFULLY
//       // =======================================================

//       if (
//         b2cResult &&
//         b2cResult.ResponseCode === '0'
//       ) {
//         const finalOriginatorConversationId =
//           b2cResult.OriginatorConversationID ||
//           originatorConversationId;

//         request.metadata = {
//           ...request.metadata,

//           b2cInitiated: true,

//           b2cResponse:
//             b2cResult,

//           conversationId:
//             b2cResult.ConversationID,

//           originatorConversationId:
//             finalOriginatorConversationId,

//           b2cInitiatedAt:
//             new Date().toISOString()
//         };

//         await request.save();

//         transaction.metadata = {
//           ...transaction.metadata,

//           b2cInitiated: true,

//           b2cResponse:
//             b2cResult,

//           conversationId:
//             b2cResult.ConversationID,

//           originatorConversationId:
//             finalOriginatorConversationId,

//           b2cInitiatedAt:
//             new Date().toISOString()
//         };

//         await transaction.save();

//         logSuccess(
//           'B2C_PAYMENT_INITIATED_SUCCESSFULLY',
//           {
//             requestId,
//             transactionId,
//             amount: request.amount,
//             phoneNumber:
//               request.recipientPhone,
//             conversationId:
//               b2cResult.ConversationID,
//             originatorConversationId:
//               finalOriginatorConversationId,
//             responseCode:
//               b2cResult.ResponseCode
//           }
//         );

//         return NextResponse.json({
//           success: true,

//           message:
//             'B2C payment initiated. Waiting for confirmation from M-Pesa.',

//           request,

//           transaction,

//           b2cResult
//         });
//       }

//       // =======================================================
//       // 13. B2C INITIATION FAILED
//       // =======================================================

//       logFailure(
//         'B2C_INITIATION_REJECTED',
//         b2cResult?.ResponseDescription ||
//           'B2C payment initiation failed',
//         {
//           requestId,
//           transactionId,
//           responseCode:
//             b2cResult?.ResponseCode,
//           responseDescription:
//             b2cResult?.ResponseDescription,
//           conversationId:
//             b2cResult?.ConversationID
//         }
//       );

//       throw new Error(
//         b2cResult?.ResponseDescription ||
//           'B2C payment initiation failed'
//       );

//     } catch (b2cError: any) {

//       // =======================================================
//       // 14. B2C FAILURE
//       // =======================================================

//       logFailure(
//         'B2C_PAYMENT_FAILED',
//         b2cError,
//         {
//           requestId,
//           transactionId,
//           amount: request.amount,
//           phoneNumber:
//             request.recipientPhone
//         }
//       );

//       // =======================================================
//       // 15. REVERT BUDGET
//       // =======================================================

//       const budgetBeforeRevert = {
//         spentAmount:
//           budget.spentAmount,
//         platformFees:
//           budget.platformFees,
//         remainingAmount:
//           budget.remainingAmount
//       };

//       budget.spentAmount =
//         Math.max(
//           0,
//           (budget.spentAmount || 0) -
//             request.amount
//         );

//       budget.platformFees =
//         Math.max(
//           0,
//           (budget.platformFees || 0) -
//             request.platformFee
//         );

//       budget.remainingAmount =
//         budget.allocatedAmount -
//         budget.spentAmount -
//         budget.platformFees;

//       if (budget.remainingAmount >= 0) {
//         budget.status = 'active';
//       }

//       await budget.save();

//       logSuccess(
//         'BUDGET_REVERTED_AFTER_B2C_FAILURE',
//         {
//           requestId,
//           transactionId,
//           budgetId:
//             budget._id.toString(),

//           before:
//             budgetBeforeRevert,

//           after: {
//             spentAmount:
//               budget.spentAmount,
//             platformFees:
//               budget.platformFees,
//             remainingAmount:
//               budget.remainingAmount,
//             status:
//               budget.status
//           }
//         }
//       );

//       // =======================================================
//       // 16. UPDATE REQUEST AS FAILED
//       // =======================================================

//       request.status = 'failed';

//       request.metadata = {
//         ...request.metadata,

//         b2cInitiated: false,

//         b2cError:
//           b2cError.message ||
//           'B2C payment failed',

//         failedAt:
//           new Date().toISOString()
//       };

//       await request.save();

//       logSuccess(
//         'REQUEST_MARKED_FAILED',
//         {
//           requestId,
//           transactionId,
//           error:
//             b2cError.message ||
//             'B2C payment failed'
//         }
//       );

//       // =======================================================
//       // 17. UPDATE TRANSACTION AS FAILED
//       // =======================================================

//       transaction.status = 'failed';

//       transaction.errorMessage =
//         b2cError.message ||
//         'B2C payment failed';

//       transaction.metadata = {
//         ...transaction.metadata,

//         b2cInitiated: false,

//         b2cError:
//           b2cError.message ||
//           'B2C payment failed',

//         failedAt:
//           new Date().toISOString()
//       };

//       await transaction.save();

//       logSuccess(
//         'TRANSACTION_MARKED_FAILED',
//         {
//           requestId,
//           transactionId,
//           error:
//             transaction.errorMessage
//         }
//       );

//       // =======================================================
//       // 18. FINAL FAILURE LOG
//       // =======================================================

//       logFailure(
//         'PETTY_CASH_APPROVAL_FAILED',
//         b2cError,
//         {
//           requestId,
//           transactionId,
//           budgetReverted: true,
//           requestStatus: 'failed',
//           transactionStatus: 'failed'
//         }
//       );

//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             'Failed to process B2C payment. Please try again.',
//           details:
//             b2cError.message
//         },
//         { status: 500 }
//       );
//     }

//   } catch (error: any) {

//     // =========================================================
//     // 19. UNEXPECTED ROUTE ERROR
//     // =========================================================

//     logFailure(
//       'UNEXPECTED_APPROVAL_ERROR',
//       error,
//       {
//         requestId,
//         transactionId
//       }
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error.message ||
//           'Internal server error'
//       },
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
import mongoose from 'mongoose';

// TEMPORARY TEST USER
const TEST_USER_ID = '6a648fb076014722ae88bac6';

// =============================================================
// LOGGING HELPERS
// =============================================================

function logSuccess(
  stage: string,
  data: Record<string, any> = {}
) {
  console.log(
    JSON.stringify({
      level: 'SUCCESS',
      service: 'PettyCashApproval',
      stage,
      timestamp: new Date().toISOString(),
      ...data
    })
  );
}

function logFailure(
  stage: string,
  error: any,
  data: Record<string, any> = {}
) {
  console.error(
    JSON.stringify({
      level: 'FAILURE',
      service: 'PettyCashApproval',
      stage,
      timestamp: new Date().toISOString(),
      error:
        error?.message ||
        error ||
        'Unknown error',
      stack: error?.stack,
      ...data
    })
  );
}

function logInfo(
  stage: string,
  data: Record<string, any> = {}
) {
  console.log(
    JSON.stringify({
      level: 'INFO',
      service: 'PettyCashApproval',
      stage,
      timestamp: new Date().toISOString(),
      ...data
    })
  );
}

// =============================================================
// POST - APPROVE EXPENSE REQUEST
// =============================================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let requestId: string | undefined;
  let transactionId: string | undefined;

  try {

    // =========================================================
    // 1. TEST USER
    // =========================================================

    console.log(
      'Processing petty cash approval for test user:',
      TEST_USER_ID
    );

    // =========================================================
    // 2. PARAMS
    // =========================================================

    const { id } = await params;

    requestId = id;

    logInfo('APPROVAL_STARTED', {
      requestId,
      userId: TEST_USER_ID
    });

    // =========================================================
    // 3. DATABASE CONNECTION
    // =========================================================

    await connectToDatabase();

    logSuccess('DATABASE_CONNECTED', {
      requestId
    });

    // =========================================================
    // 4. FIND EXPENSE REQUEST
    // =========================================================

    const request = await ExpenseRequest.findById(id);

    if (!request) {
      logFailure(
        'REQUEST_NOT_FOUND',
        'Expense request not found',
        {
          requestId,
          userId: TEST_USER_ID
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Request not found'
        },
        { status: 404 }
      );
    }

    logInfo('REQUEST_FOUND', {
      requestId: request._id.toString(),
      currentStatus: request.status,
      amount: request.amount,
      totalAmount: request.totalAmount,
      recipientPhone: request.recipientPhone,
      category: request.category
    });

    // =========================================================
    // 5. VALIDATE STATUS
    // =========================================================

    if (
      request.status !== 'pending' &&
      request.status !== 'failed'
    ) {
      logFailure(
        'INVALID_REQUEST_STATUS',
        `Request status is ${request.status}`,
        {
          requestId,
          currentStatus: request.status,
          userId: TEST_USER_ID
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Request is not pending or failed'
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 6. FIND ACTIVE BUDGET
    // =========================================================

    const budget = await Budget.findOne({
      status: 'active',
      createdBy: TEST_USER_ID
    }).sort({
      createdAt: -1
    });

    if (!budget) {
      logFailure(
        'ACTIVE_BUDGET_NOT_FOUND',
        'No active budget found',
        {
          requestId,
          userId: TEST_USER_ID
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: 'No active budget found'
        },
        { status: 400 }
      );
    }

    logSuccess('ACTIVE_BUDGET_FOUND', {
      requestId,
      budgetId: budget._id.toString(),
      allocatedAmount: budget.allocatedAmount,
      spentAmount: budget.spentAmount,
      platformFees: budget.platformFees,
      remainingAmount: budget.remainingAmount
    });

    // =========================================================
    // 7. CHECK BUDGET
    // =========================================================

    if (
      request.totalAmount >
      budget.remainingAmount
    ) {
      logFailure(
        'INSUFFICIENT_BUDGET',
        'Insufficient budget',
        {
          requestId,
          budgetId: budget._id.toString(),
          requiredAmount: request.totalAmount,
          availableAmount: budget.remainingAmount,
          userId: TEST_USER_ID
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Insufficient budget. Required: KES ${request.totalAmount.toFixed(
              2
            )}, Available: KES ${budget.remainingAmount.toFixed(2)}`
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 8. DEDUCT BUDGET
    // =========================================================

    const oldBudgetRemaining =
      budget.remainingAmount;

    budget.spentAmount =
      (budget.spentAmount || 0) +
      request.amount;

    budget.platformFees =
      (budget.platformFees || 0) +
      request.platformFee;

    budget.remainingAmount =
      budget.allocatedAmount -
      budget.spentAmount -
      budget.platformFees;

    if (budget.remainingAmount < 0) {
      budget.status = 'overdrawn';
    }

    await budget.save();

    logSuccess('BUDGET_DEDUCTED', {
      requestId,
      budgetId: budget._id.toString(),
      amount: request.amount,
      platformFee: request.platformFee,
      previousRemainingAmount:
        oldBudgetRemaining,
      newRemainingAmount:
        budget.remainingAmount
    });

    // =========================================================
    // 9. UPDATE REQUEST TO PROCESSING
    // =========================================================

    const originatorConversationId =
      `SHAD_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}`;

    request.status = 'processing';

    request.approverId =
      new mongoose.Types.ObjectId(
        TEST_USER_ID
      );

    request.approvedAt = new Date();

    request.metadata = {
      ...request.metadata,

      approvedBy: TEST_USER_ID,

      approvedAt:
        new Date().toISOString(),

      budgetWasUpdated: true,

      originatorConversationId,

      processingStarted:
        new Date().toISOString()
    };

    await request.save();

    logSuccess(
      'REQUEST_SET_TO_PROCESSING',
      {
        requestId,
        userId: TEST_USER_ID,
        originatorConversationId
      }
    );

    // =========================================================
    // 10. CREATE TRANSACTION
    // =========================================================

    const transaction =
      await Transaction.create({
        transactionId:
          `TXN-${Date.now()}-${Math.floor(
            Math.random() * 10000
          )}`,

        type: 'petty_cash_payout',

        status: 'processing',

        amount: request.amount,

        phoneNumber:
          request.recipientPhone,

        userId:
          new mongoose.Types.ObjectId(
            TEST_USER_ID
          ),

        budgetId:
          budget._id,

        purpose:
          `Petty Cash Payout - ${request.description}`,

        metadata: {
          requestId:
            request._id,

          description:
            request.description,

          category:
            request.category,

          platformFee:
            request.platformFee,

          totalAmount:
            request.totalAmount,

          originatorConversationId,

          initiatedAt:
            new Date().toISOString()
        }
      });

    transactionId =
      transaction.transactionId;

    logSuccess(
      'TRANSACTION_CREATED',
      {
        requestId,
        transactionId,
        transactionMongoId:
          transaction._id.toString(),
        amount:
          request.amount,
        phoneNumber:
          request.recipientPhone,
        status:
          transaction.status
      }
    );

    // =========================================================
    // 11. INITIATE B2C
    // =========================================================

    logInfo(
      'B2C_INITIATION_STARTED',
      {
        requestId,
        transactionId,
        phoneNumber:
          request.recipientPhone,
        amount:
          request.amount,
        originatorConversationId
      }
    );

    try {

      const b2cResult =
        await processB2CPayment(
          request.recipientPhone,
          request.amount,
          'BusinessPayment',
          `Petty Cash - ${request.description}`,
          `PC-${request._id
            .toString()
            .slice(-8)}`
        );

      logInfo(
        'B2C_RESPONSE_RECEIVED',
        {
          requestId,
          transactionId,
          responseCode:
            b2cResult?.ResponseCode,
          responseDescription:
            b2cResult?.ResponseDescription,
          conversationId:
            b2cResult?.ConversationID,
          originatorConversationId:
            b2cResult?.OriginatorConversationID
        }
      );

      // =======================================================
      // 12. B2C INITIATED SUCCESSFULLY
      // =======================================================

      if (
        b2cResult &&
        b2cResult.ResponseCode === '0'
      ) {

        const finalOriginatorConversationId =
          b2cResult.OriginatorConversationID ||
          originatorConversationId;

        request.metadata = {
          ...request.metadata,

          b2cInitiated: true,

          b2cResponse:
            b2cResult,

          conversationId:
            b2cResult.ConversationID,

          originatorConversationId:
            finalOriginatorConversationId,

          b2cInitiatedAt:
            new Date().toISOString()
        };

        await request.save();

        transaction.metadata = {
          ...transaction.metadata,

          b2cInitiated: true,

          b2cResponse:
            b2cResult,

          conversationId:
            b2cResult.ConversationID,

          originatorConversationId:
            finalOriginatorConversationId,

          b2cInitiatedAt:
            new Date().toISOString()
        };

        await transaction.save();

        logSuccess(
          'B2C_PAYMENT_INITIATED_SUCCESSFULLY',
          {
            requestId,
            transactionId,
            amount:
              request.amount,
            phoneNumber:
              request.recipientPhone,
            conversationId:
              b2cResult.ConversationID,
            originatorConversationId:
              finalOriginatorConversationId,
            responseCode:
              b2cResult.ResponseCode
          }
        );

        return NextResponse.json({
          success: true,

          message:
            'B2C payment initiated. Waiting for confirmation from M-Pesa.',

          request,

          transaction,

          b2cResult
        });
      }

      // =======================================================
      // 13. B2C INITIATION FAILED
      // =======================================================

      logFailure(
        'B2C_INITIATION_REJECTED',
        b2cResult?.ResponseDescription ||
          'B2C payment initiation failed',
        {
          requestId,
          transactionId,
          responseCode:
            b2cResult?.ResponseCode,
          responseDescription:
            b2cResult?.ResponseDescription,
          conversationId:
            b2cResult?.ConversationID
        }
      );

      throw new Error(
        b2cResult?.ResponseDescription ||
          'B2C payment initiation failed'
      );

    } catch (b2cError: any) {

      // =======================================================
      // 14. B2C FAILURE
      // =======================================================

      logFailure(
        'B2C_PAYMENT_FAILED',
        b2cError,
        {
          requestId,
          transactionId,
          amount:
            request.amount,
          phoneNumber:
            request.recipientPhone
        }
      );

      // =======================================================
      // 15. REVERT BUDGET
      // =======================================================

      const budgetBeforeRevert = {
        spentAmount:
          budget.spentAmount,

        platformFees:
          budget.platformFees,

        remainingAmount:
          budget.remainingAmount
      };

      budget.spentAmount =
        Math.max(
          0,
          (budget.spentAmount || 0) -
            request.amount
        );

      budget.platformFees =
        Math.max(
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

      logSuccess(
        'BUDGET_REVERTED_AFTER_B2C_FAILURE',
        {
          requestId,
          transactionId,
          budgetId:
            budget._id.toString(),

          before:
            budgetBeforeRevert,

          after: {
            spentAmount:
              budget.spentAmount,

            platformFees:
              budget.platformFees,

            remainingAmount:
              budget.remainingAmount,

            status:
              budget.status
          }
        }
      );

      // =======================================================
      // 16. UPDATE REQUEST AS FAILED
      // =======================================================

      request.status = 'failed';

      request.metadata = {
        ...request.metadata,

        b2cInitiated: false,

        b2cError:
          b2cError.message ||
          'B2C payment failed',

        failedAt:
          new Date().toISOString()
      };

      await request.save();

      logSuccess(
        'REQUEST_MARKED_FAILED',
        {
          requestId,
          transactionId,
          error:
            b2cError.message ||
            'B2C payment failed'
        }
      );

      // =======================================================
      // 17. UPDATE TRANSACTION AS FAILED
      // =======================================================

      transaction.status = 'failed';

      transaction.errorMessage =
        b2cError.message ||
        'B2C payment failed';

      transaction.metadata = {
        ...transaction.metadata,

        b2cInitiated: false,

        b2cError:
          b2cError.message ||
          'B2C payment failed',

        failedAt:
          new Date().toISOString()
      };

      await transaction.save();

      logSuccess(
        'TRANSACTION_MARKED_FAILED',
        {
          requestId,
          transactionId,
          error:
            transaction.errorMessage
        }
      );

      // =======================================================
      // 18. FINAL FAILURE LOG
      // =======================================================

      logFailure(
        'PETTY_CASH_APPROVAL_FAILED',
        b2cError,
        {
          requestId,
          transactionId,
          budgetReverted: true,
          requestStatus: 'failed',
          transactionStatus: 'failed'
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to process B2C payment. Please try again.',
          details:
            b2cError.message
        },
        { status: 500 }
      );
    }

  } catch (error: any) {

    // =========================================================
    // 19. UNEXPECTED ROUTE ERROR
    // =========================================================

    logFailure(
      'UNEXPECTED_APPROVAL_ERROR',
      error,
      {
        requestId,
        transactionId
      }
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          'Internal server error'
      },
      { status: 500 }
    );
  }
}