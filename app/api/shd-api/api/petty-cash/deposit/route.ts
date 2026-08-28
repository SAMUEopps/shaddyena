// // app/api/petty-cash/deposit/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { initSTKPush } from '@/shd-lib/lib/mpesa';
// import Transaction from '@/shd-models/models/Transaction';
// import Budget from '@/shd-models/models/Budget';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// // Helper to verify JWT token from request
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

// export async function POST(req: NextRequest) {
//   try {
//     // Authenticate user
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const { amount, phoneNumber, budgetId } = await req.json();

//     // Validate input
//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid amount. Minimum KSh 1' },
//         { status: 400 }
//       );
//     }

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { success: false, error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Validate phone number
//     const cleanPhone = phoneNumber.replace(/[+\s]/g, '');
//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid Kenyan phone number' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Verify budget exists if provided
//     let budget = null;
//     let budgetObjectId = null;
//     if (budgetId) {
//       budget = await Budget.findById(budgetId);
//       if (!budget) {
//         return NextResponse.json(
//           { success: false, error: 'Budget not found' },
//           { status: 404 }
//         );
//       }
//       if (budget.status !== 'active') {
//         return NextResponse.json(
//           { success: false, error: 'Budget is not active' },
//           { status: 400 }
//         );
//       }
//       budgetObjectId = new mongoose.Types.ObjectId(budgetId);
//     }

//     // Generate unique reference for this deposit
//     const accountReference = `PC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//     const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

//     // Create transaction record first (pending status)
//     const transaction = await Transaction.create({
//       transactionId,
//       accountReference,
//       type: 'petty_cash_deposit',
//       status: 'pending',
//       amount: amount,
//       phoneNumber: cleanPhone,
//       userId: new mongoose.Types.ObjectId(auth.userId),
//       budgetId: budgetObjectId,
//       purpose: `Petty Cash Deposit${budget ? ` - Budget ${budget.weekStart} to ${budget.weekEnd}` : ''}`,
//       metadata: {
//         budgetId: budgetId || null,
//         description: `Petty Cash Deposit${budget ? ` for budget ${budget.weekStart} to ${budget.weekEnd}` : ''}`,
//         accountReference,
//         depositType: 'petty_cash',
//         initiatedBy: auth.userId,
//         initiatedAt: new Date().toISOString()
//       }
//     });

//     // Initiate STK Push
//     const stkResult = await initSTKPush(
//       cleanPhone,
//       amount,
//       accountReference
//     );

//     if (!stkResult || stkResult.ResponseCode !== '0') {
//       // Update transaction as failed
//       transaction.status = 'failed';
//       transaction.errorMessage = stkResult?.ResponseDescription || 'STK push failed';
//       await transaction.save();

//       return NextResponse.json({
//         success: false,
//         error: stkResult?.ResponseDescription || 'Failed to initiate STK push',
//         checkoutRequestId: stkResult?.CheckoutRequestID,
//       }, { status: 400 });
//     }

//     // Update transaction with checkout request ID
//     transaction.checkoutRequestId = stkResult.CheckoutRequestID;
//     transaction.metadata.checkoutRequestId = stkResult.CheckoutRequestID;
//     await transaction.save();

//     return NextResponse.json({
//       success: true,
//       message: 'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',
//       checkoutRequestId: stkResult.CheckoutRequestID,
//       transactionId: transaction._id,
//       accountReference,
//     });

//   } catch (error: any) {
//     console.error('Petty Cash deposit error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // GET endpoint to check deposit status
// export async function GET(req: NextRequest) {
//   try {
//     // Authenticate user
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const searchParams = req.nextUrl.searchParams;
//     const transactionId = searchParams.get('transactionId');
//     const checkoutRequestId = searchParams.get('checkoutRequestId');

//     if (!transactionId && !checkoutRequestId) {
//       return NextResponse.json(
//         { success: false, error: 'TransactionId or CheckoutRequestId required' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     let transaction;
//     if (transactionId) {
//       transaction = await Transaction.findById(transactionId);
//     } else if (checkoutRequestId) {
//       transaction = await Transaction.findOne({ checkoutRequestId });
//     }

//     if (!transaction) {
//       return NextResponse.json(
//         { success: false, error: 'Transaction not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user owns this transaction
//     if (transaction.userId?.toString() !== auth.userId) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       status: transaction.status,
//       transaction: {
//         id: transaction._id,
//         amount: transaction.amount,
//         receiptNumber: transaction.receiptNumber,
//         status: transaction.status,
//         createdAt: transaction.createdAt,
//         accountReference: transaction.accountReference,
//         checkoutRequestId: transaction.checkoutRequestId
//       }
//     });

//   } catch (error: any) {
//     console.error('Status check error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // app/api/petty-cash/deposit/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { initSTKPush } from '@/shd-lib/lib/mpesa';
// import Transaction from '@/shd-models/models/Transaction';
// import Budget from '@/shd-models/models/Budget';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// // Helper to verify JWT token from request
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

// export async function POST(req: NextRequest) {
//   try {
//     // Authenticate user
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const { amount, phoneNumber, budgetId } = await req.json();

//     console.log('Deposit request:', { amount, phoneNumber, budgetId, userId: auth.userId });

//     // Validate input
//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid amount. Minimum KSh 1' },
//         { status: 400 }
//       );
//     }

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { success: false, error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Validate phone number
//     const cleanPhone = phoneNumber.replace(/[+\s]/g, '');
//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid Kenyan phone number' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Verify budget exists if provided
//     let budget = null;
//     let budgetObjectId = null;
//     if (budgetId) {
//       budget = await Budget.findById(budgetId);
//       console.log('Found budget:', budget);
      
//       if (!budget) {
//         return NextResponse.json(
//           { success: false, error: 'Budget not found' },
//           { status: 404 }
//         );
//       }
//       if (budget.status !== 'active') {
//         return NextResponse.json(
//           { success: false, error: 'Budget is not active' },
//           { status: 400 }
//         );
//       }
//       budgetObjectId = new mongoose.Types.ObjectId(budgetId);
//     } else {
//       // If no budgetId provided, try to find an active budget for the user
//       // This is a fallback - you might want to handle this differently
//       const activeBudget = await Budget.findOne({ 
//         status: 'active',
//         createdBy: new mongoose.Types.ObjectId(auth.userId)
//       });
      
//       if (activeBudget) {
//         budgetObjectId = activeBudget._id;
//         budget = activeBudget;
//         console.log('Using fallback active budget:', activeBudget._id);
//       }
//     }

//     // Generate unique reference for this deposit
//     const accountReference = `PC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//     const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

//     // Create transaction record first (pending status)
//     const transaction = await Transaction.create({
//       transactionId,
//       accountReference,
//       type: 'petty_cash_deposit',
//       status: 'pending',
//       amount: amount,
//       phoneNumber: cleanPhone,
//       userId: new mongoose.Types.ObjectId(auth.userId),
//       budgetId: budgetObjectId, // Make sure this is saved
//       purpose: `Petty Cash Deposit${budget ? ` - Budget ${budget.weekStart} to ${budget.weekEnd}` : ''}`,
//       metadata: {
//         budgetId: budgetId || null,
//         budgetObjectId: budgetObjectId ? budgetObjectId.toString() : null,
//         description: `Petty Cash Deposit${budget ? ` for budget ${budget.weekStart} to ${budget.weekEnd}` : ''}`,
//         accountReference,
//         depositType: 'petty_cash',
//         initiatedBy: auth.userId,
//         initiatedAt: new Date().toISOString()
//       }
//     });

//     console.log('Transaction created with budgetId:', transaction.budgetId);

//     // Initiate STK Push
//     const stkResult = await initSTKPush(
//       cleanPhone,
//       amount,
//       accountReference
//     );

//     if (!stkResult || stkResult.ResponseCode !== '0') {
//       // Update transaction as failed
//       transaction.status = 'failed';
//       transaction.errorMessage = stkResult?.ResponseDescription || 'STK push failed';
//       await transaction.save();

//       return NextResponse.json({
//         success: false,
//         error: stkResult?.ResponseDescription || 'Failed to initiate STK push',
//         checkoutRequestId: stkResult?.CheckoutRequestID,
//       }, { status: 400 });
//     }

//     // Update transaction with checkout request ID
//     transaction.checkoutRequestId = stkResult.CheckoutRequestID;
//     transaction.metadata.checkoutRequestId = stkResult.CheckoutRequestID;
//     await transaction.save();

//     return NextResponse.json({
//       success: true,
//       message: 'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',
//       checkoutRequestId: stkResult.CheckoutRequestID,
//       transactionId: transaction._id,
//       accountReference,
//       budgetId: budgetObjectId
//     });

//   } catch (error: any) {
//     console.error('Petty Cash deposit error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // GET endpoint to check deposit status
// export async function GET(req: NextRequest) {
//   try {
//     // Authenticate user
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const searchParams = req.nextUrl.searchParams;
//     const transactionId = searchParams.get('transactionId');
//     const checkoutRequestId = searchParams.get('checkoutRequestId');

//     if (!transactionId && !checkoutRequestId) {
//       return NextResponse.json(
//         { success: false, error: 'TransactionId or CheckoutRequestId required' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     let transaction;
//     if (transactionId) {
//       transaction = await Transaction.findById(transactionId);
//     } else if (checkoutRequestId) {
//       transaction = await Transaction.findOne({ checkoutRequestId });
//     }

//     if (!transaction) {
//       return NextResponse.json(
//         { success: false, error: 'Transaction not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user owns this transaction
//     if (transaction.userId?.toString() !== auth.userId) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       status: transaction.status,
//       transaction: {
//         id: transaction._id,
//         amount: transaction.amount,
//         receiptNumber: transaction.receiptNumber,
//         status: transaction.status,
//         createdAt: transaction.createdAt,
//         accountReference: transaction.accountReference,
//         checkoutRequestId: transaction.checkoutRequestId,
//         budgetId: transaction.budgetId
//       }
//     });

//   } catch (error: any) {
//     console.error('Status check error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // app/api/petty-cash/deposit/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { initSTKPush } from '@/shd-lib/lib/mpesa';
// import Transaction from '@/shd-models/models/Transaction';
// import Budget from '@/shd-models/models/Budget';
// import mongoose from 'mongoose';

// // ============================================================
// // TEMPORARY TEST USER
// // REMOVE THIS AND RESTORE JWT AUTHENTICATION AFTER TESTING
// // ============================================================
// const TEST_USER_ID = '6a648fb076014722ae88bac6';

// // Validate the hard-coded ID once
// const TEST_USER_OBJECT_ID = new mongoose.Types.ObjectId(TEST_USER_ID);


// // ============================================================
// // POST - Initiate M-Pesa petty cash deposit
// // ============================================================
// export async function POST(req: NextRequest) {
//   try {
//     // ----------------------------------------------------------
//     // TEMPORARY: use hard-coded test user
//     // ----------------------------------------------------------
//     const userId = TEST_USER_ID;
//     const userObjectId = TEST_USER_OBJECT_ID;

//     const { amount, phoneNumber, budgetId } = await req.json();

//     console.log('========================================');
//     console.log('PETTY CASH DEPOSIT REQUEST');
//     console.log('Test User ID:', userId);
//     console.log('Amount:', amount);
//     console.log('Phone:', phoneNumber);
//     console.log('Budget ID:', budgetId);
//     console.log('========================================');

//     // ----------------------------------------------------------
//     // Validate amount
//     // ----------------------------------------------------------
//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Invalid amount. Minimum KSh 1'
//         },
//         { status: 400 }
//       );
//     }

//     // ----------------------------------------------------------
//     // Validate phone number
//     // ----------------------------------------------------------
//     if (!phoneNumber) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Phone number is required'
//         },
//         { status: 400 }
//       );
//     }

//     const cleanPhone = phoneNumber.replace(/[+\s]/g, '');

//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Invalid Kenyan phone number'
//         },
//         { status: 400 }
//       );
//     }

//     // ----------------------------------------------------------
//     // Connect database
//     // ----------------------------------------------------------
//     await connectToDatabase();

//     // ----------------------------------------------------------
//     // Find budget
//     // ----------------------------------------------------------
//     let budget = null;
//     let budgetObjectId: mongoose.Types.ObjectId | null = null;

//     if (budgetId) {

//       // Validate MongoDB ObjectId before querying
//       if (!mongoose.Types.ObjectId.isValid(budgetId)) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: 'Invalid budget ID'
//           },
//           { status: 400 }
//         );
//       }

//       budget = await Budget.findById(budgetId);

//       console.log('Found budget:', budget?._id);

//       if (!budget) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: 'Budget not found'
//           },
//           { status: 404 }
//         );
//       }

//       if (budget.status !== 'active') {
//         return NextResponse.json(
//           {
//             success: false,
//             error: 'Budget is not active'
//           },
//           { status: 400 }
//         );
//       }

//       budgetObjectId = new mongoose.Types.ObjectId(budgetId);

//     } else {

//       // --------------------------------------------------------
//       // No budget ID supplied.
//       // Find active budget for TEST USER.
//       // --------------------------------------------------------
//       const activeBudget = await Budget.findOne({
//         status: 'active',
//         createdBy: userObjectId
//       }).sort({ createdAt: -1 });

//       if (activeBudget) {
//         budget = activeBudget;
//         budgetObjectId = activeBudget._id;

//         console.log(
//           'Using active test budget:',
//           activeBudget._id
//         );
//       }
//     }

//     // ----------------------------------------------------------
//     // Generate transaction references
//     // ----------------------------------------------------------
//     const timestamp = Date.now();

//     const accountReference =
//       `PC-${timestamp}-${Math.floor(Math.random() * 10000)}`;

//     const transactionId =
//       `TXN-${timestamp}-${Math.floor(Math.random() * 10000)}`;

//     console.log('Account Reference:', accountReference);
//     console.log('Transaction ID:', transactionId);

//     // ----------------------------------------------------------
//     // Create transaction BEFORE STK push
//     // ----------------------------------------------------------
//     const transaction = await Transaction.create({
//       transactionId,

//       accountReference,

//       type: 'petty_cash_deposit',

//       status: 'pending',

//       amount,

//       phoneNumber: cleanPhone,

//       // TEMPORARY TEST USER
//       userId: userObjectId,

//       budgetId: budgetObjectId,

//       purpose:
//         `Petty Cash Deposit${
//           budget
//             ? ` - Budget ${budget.weekStart} to ${budget.weekEnd}`
//             : ''
//         }`,

//       metadata: {
//         budgetId: budgetId || null,

//         budgetObjectId:
//           budgetObjectId
//             ? budgetObjectId.toString()
//             : null,

//         description:
//           `Petty Cash Deposit${
//             budget
//               ? ` for budget ${budget.weekStart} to ${budget.weekEnd}`
//               : ''
//           }`,

//         accountReference,

//         depositType: 'petty_cash',

//         // TEMPORARY TEST USER
//         initiatedBy: userId,

//         initiatedAt: new Date().toISOString()
//       }
//     });

//     console.log(
//       'Transaction created:',
//       transaction._id
//     );

//     console.log(
//       'Transaction budgetId:',
//       transaction.budgetId
//     );

//     // ----------------------------------------------------------
//     // Initiate STK Push
//     // ----------------------------------------------------------
//     console.log('Initiating STK Push...');

//     const stkResult = await initSTKPush(
//       cleanPhone,
//       amount,
//       accountReference
//     );

//     console.log('STK Result:', stkResult);

//     // ----------------------------------------------------------
//     // Handle STK failure
//     // ----------------------------------------------------------
//     if (
//       !stkResult ||
//       stkResult.ResponseCode !== '0'
//     ) {

//       transaction.status = 'failed';

//       transaction.errorMessage =
//         stkResult?.ResponseDescription ||
//         'STK push failed';

//       await transaction.save();

//       return NextResponse.json(
//         {
//           success: false,

//           error:
//             stkResult?.ResponseDescription ||
//             'Failed to initiate STK push',

//           checkoutRequestId:
//             stkResult?.CheckoutRequestID
//         },
//         { status: 400 }
//       );
//     }

//     // ----------------------------------------------------------
//     // Save CheckoutRequestID
//     // ----------------------------------------------------------
//     transaction.checkoutRequestId =
//       stkResult.CheckoutRequestID;

//     transaction.metadata.checkoutRequestId =
//       stkResult.CheckoutRequestID;

//     await transaction.save();

//     console.log(
//       'STK Push successfully initiated'
//     );

//     console.log(
//       'CheckoutRequestID:',
//       stkResult.CheckoutRequestID
//     );

//     // ----------------------------------------------------------
//     // Return response
//     // ----------------------------------------------------------
//     return NextResponse.json({
//       success: true,

//       message:
//         'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',

//       checkoutRequestId:
//         stkResult.CheckoutRequestID,

//       transactionId:
//         transaction._id,

//       accountReference,

//       budgetId:
//         budgetObjectId
//     });

//   } catch (error: any) {

//     console.error(
//       'Petty Cash deposit error:',
//       error
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


// // ============================================================
// // GET - Check deposit transaction status
// // ============================================================
// export async function GET(req: NextRequest) {
//   try {

//     // ----------------------------------------------------------
//     // TEMPORARY: use hard-coded test user
//     // ----------------------------------------------------------
//     const userId = TEST_USER_ID;

//     const searchParams =
//       req.nextUrl.searchParams;

//     const transactionId =
//       searchParams.get('transactionId');

//     const checkoutRequestId =
//       searchParams.get('checkoutRequestId');

//     if (
//       !transactionId &&
//       !checkoutRequestId
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             'TransactionId or CheckoutRequestId required'
//         },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // ----------------------------------------------------------
//     // Find transaction
//     // ----------------------------------------------------------
//     let transaction;

//     if (transactionId) {

//       if (
//         !mongoose.Types.ObjectId.isValid(
//           transactionId
//         )
//       ) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: 'Invalid transaction ID'
//           },
//           { status: 400 }
//         );
//       }

//       transaction =
//         await Transaction.findById(
//           transactionId
//         );

//     } else if (checkoutRequestId) {

//       transaction =
//         await Transaction.findOne({
//           checkoutRequestId
//         });
//     }

//     // ----------------------------------------------------------
//     // Transaction not found
//     // ----------------------------------------------------------
//     if (!transaction) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Transaction not found'
//         },
//         { status: 404 }
//       );
//     }

//     // ----------------------------------------------------------
//     // Make sure transaction belongs to test user
//     // ----------------------------------------------------------
//     if (
//       transaction.userId?.toString() !==
//       userId
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Unauthorized'
//         },
//         { status: 403 }
//       );
//     }

//     // ----------------------------------------------------------
//     // Return transaction status
//     // ----------------------------------------------------------
//     return NextResponse.json({
//       success: true,

//       status:
//         transaction.status,

//       transaction: {
//         id:
//           transaction._id,

//         amount:
//           transaction.amount,

//         receiptNumber:
//           transaction.receiptNumber,

//         status:
//           transaction.status,

//         createdAt:
//           transaction.createdAt,

//         accountReference:
//           transaction.accountReference,

//         checkoutRequestId:
//           transaction.checkoutRequestId,

//         budgetId:
//           transaction.budgetId
//       }
//     });

//   } catch (error: any) {

//     console.error(
//       'Status check error:',
//       error
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



// // app/api/petty-cash/deposit/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { initSTKPush } from '@/shd-lib/lib/mpesa';
// import Transaction from '@/shd-models/models/Transaction';
// import Budget from '@/shd-models/models/Budget';
// import Organization from '@/shd-models/models/Organization';
// import mongoose from 'mongoose';

// // ============================================================
// // TEMPORARY TEST USER
// // REMOVE THIS AND RESTORE JWT AUTHENTICATION AFTER TESTING
// // ============================================================
// const TEST_USER_ID = '6a648fb076014722ae88bac6';
// const TEST_ORG_ID = 'your-test-org-id-here'; // REPLACE WITH ACTUAL ORG ID

// const TEST_USER_OBJECT_ID = new mongoose.Types.ObjectId(TEST_USER_ID);
// const TEST_ORG_OBJECT_ID = new mongoose.Types.ObjectId(TEST_ORG_ID);

// // ============================================================
// // POST - Initiate M-Pesa petty cash deposit
// // ============================================================
// export async function POST(req: NextRequest) {
//   try {
//     const userId = TEST_USER_ID;
//     const userObjectId = TEST_USER_OBJECT_ID;
//     const organizationId = TEST_ORG_OBJECT_ID;

//     const { 
//       amount, 
//       phoneNumber, 
//       budgetId,
//       idempotencyKey
//     } = await req.json();

//     console.log('========================================');
//     console.log('PETTY CASH DEPOSIT REQUEST');
//     console.log('Organization ID:', organizationId);
//     console.log('Amount:', amount);
//     console.log('Phone:', phoneNumber);
//     console.log('Budget ID:', budgetId);
//     console.log('Idempotency Key:', idempotencyKey);
//     console.log('========================================');

//     if (!amount || amount < 1) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid amount. Minimum KSh 1' },
//         { status: 400 }
//       );
//     }

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { success: false, error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     const cleanPhone = phoneNumber.replace(/[+\s]/g, '');

//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid Kenyan phone number. Format: 254XXXXXXXXX' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     const organization = await Organization.findById(organizationId);
//     if (!organization) {
//       return NextResponse.json(
//         { success: false, error: 'Organization not found' },
//         { status: 404 }
//       );
//     }

//     if (idempotencyKey) {
//       const existingTransaction = await Transaction.findOne({
//         organizationId,
//         idempotencyKey
//       });

//       if (existingTransaction) {
//         console.log('Duplicate request detected. Returning existing transaction.');
//         return NextResponse.json({
//           success: true,
//           message: 'Duplicate request detected. Returning existing transaction.',
//           transactionId: existingTransaction._id,
//           status: existingTransaction.status,
//           checkoutRequestId: existingTransaction.checkoutRequestId,
//           accountReference: existingTransaction.accountReference,
//           isDuplicate: true
//         });
//       }
//     }

//     let budget = null;
//     let budgetObjectId: mongoose.Types.ObjectId | null = null;
//     let budgetWeekRange = '';

//     if (budgetId) {
//       if (!mongoose.Types.ObjectId.isValid(budgetId)) {
//         return NextResponse.json(
//           { success: false, error: 'Invalid budget ID' },
//           { status: 400 }
//         );
//       }

//       budget = await Budget.findOne({ _id: budgetId });

//       console.log('Found budget:', budget?._id);

//       if (!budget) {
//         return NextResponse.json(
//           { success: false, error: 'Budget not found' },
//           { status: 404 }
//         );
//       }

//       if (budget.status !== 'active') {
//         return NextResponse.json(
//           { success: false, error: 'Budget is not active' },
//           { status: 400 }
//         );
//       }

//       budgetObjectId = new mongoose.Types.ObjectId(budgetId);
//       budgetWeekRange = ` - Budget ${budget.weekStart} to ${budget.weekEnd}`;
//     } else {
//       const activeBudget = await Budget.findOne({
//         status: 'active',
//         createdBy: userObjectId
//       }).sort({ createdAt: -1 });

//       if (activeBudget) {
//         budget = activeBudget;
//         budgetObjectId = activeBudget._id;
//         budgetWeekRange = ` for budget ${activeBudget.weekStart} to ${activeBudget.weekEnd}`;
//         console.log('Using active budget:', activeBudget._id);
//       }
//     }

//     const timestamp = Date.now();
//     const randomSuffix = Math.floor(Math.random() * 10000);

//     const accountReference = `PC-${timestamp}-${randomSuffix}`;
//     const transactionId = `TXN-${timestamp}-${randomSuffix}`;
//     const externalReference = budgetId ? `BUDGET-${budgetId}` : `DEP-${timestamp}`;

//     console.log('Account Reference:', accountReference);
//     console.log('Transaction ID:', transactionId);
//     console.log('External Reference:', externalReference);

//     const transaction = await Transaction.create({
//       transactionId,
//       organizationId,
//       type: 'deposit',
//       category: 'petty_cash',
//       amount,
//       currency: 'KES',
//       status: 'pending',
//       phoneNumber: cleanPhone,
//       accountReference,
//       externalReference: externalReference,
//       externalEntityId: budgetId || null,
//       externalEntityType: budgetId ? 'budget' : null,
//       provider: 'mpesa',
//       checkoutRequestId: null,
//       purpose: `Petty Cash Deposit${budgetWeekRange}`,
//       idempotencyKey: idempotencyKey || undefined,
//       metadata: {
//         userId: userId,
//         budgetId: budgetId || null,
//         budgetObjectId: budgetObjectId ? budgetObjectId.toString() : null,
//         description: `Petty Cash Deposit${budgetWeekRange}`,
//         accountReference,
//         depositType: 'petty_cash',
//         initiatedBy: userId,
//         initiatedAt: new Date().toISOString(),
//         organizationName: organization.name
//       }
//     });

//     console.log('Transaction created:', transaction._id);
//     console.log('Transaction organizationId:', transaction.organizationId);

//     console.log('Initiating STK Push...');

//     const stkResult = await initSTKPush(
//       cleanPhone,
//       amount,
//       accountReference
//     );

//     console.log('STK Result:', stkResult);

//     if (!stkResult || stkResult.ResponseCode !== '0') {
//       transaction.status = 'failed';
//       transaction.errorMessage = stkResult?.ResponseDescription || 'STK push failed';
//       await transaction.save();

//       return NextResponse.json(
//         {
//           success: false,
//           error: stkResult?.ResponseDescription || 'Failed to initiate STK push',
//           checkoutRequestId: stkResult?.CheckoutRequestID,
//           transactionId: transaction._id
//         },
//         { status: 400 }
//       );
//     }

//     // FIX #2: Ensure metadata exists before assigning properties
//     if (!transaction.metadata) {
//       transaction.metadata = {};
//     }

//     transaction.checkoutRequestId = stkResult.CheckoutRequestID;
//     transaction.status = 'processing';
//     transaction.metadata.checkoutRequestId = stkResult.CheckoutRequestID;
//     transaction.metadata.stkResponse = stkResult;
//     transaction.metadata.stkSentAt = new Date().toISOString();

//     await transaction.save();

//     console.log('STK Push successfully initiated');
//     console.log('CheckoutRequestID:', stkResult.CheckoutRequestID);

//     // FIX #1: Removed duplicate transactionId property
//     return NextResponse.json({
//       success: true,
//       message: 'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',
//       checkoutRequestId: stkResult.CheckoutRequestID,
//       transactionId: transaction.transactionId,  // Only one transactionId now
//       transactionObjectId: transaction._id,        // Use a different key for MongoDB _id
//       accountReference,
//       budgetId: budgetObjectId,
//       status: transaction.status
//     });

//   } catch (error: any) {
//     console.error('Petty Cash deposit error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // ============================================================
// // GET - Check deposit transaction status
// // ============================================================
// export async function GET(req: NextRequest) {
//   try {
//     const userId = TEST_USER_ID;
//     const organizationId = TEST_ORG_OBJECT_ID;

//     const searchParams = req.nextUrl.searchParams;
//     const transactionId = searchParams.get('transactionId');
//     const checkoutRequestId = searchParams.get('checkoutRequestId');
//     const externalReference = searchParams.get('externalReference');

//     if (!transactionId && !checkoutRequestId && !externalReference) {
//       return NextResponse.json(
//         { success: false, error: 'TransactionId, CheckoutRequestId, or ExternalReference required' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     let query: any = { organizationId };

//     if (transactionId) {
//       if (!mongoose.Types.ObjectId.isValid(transactionId)) {
//         return NextResponse.json(
//           { success: false, error: 'Invalid transaction ID' },
//           { status: 400 }
//         );
//       }
//       query._id = transactionId;
//     } else if (checkoutRequestId) {
//       query.checkoutRequestId = checkoutRequestId;
//     } else if (externalReference) {
//       query.externalReference = externalReference;
//     }

//     const transaction = await Transaction.findOne(query);

//     if (!transaction) {
//       return NextResponse.json(
//         { success: false, error: 'Transaction not found' },
//         { status: 404 }
//       );
//     }

//     if (transaction.metadata?.userId?.toString() !== userId) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       status: transaction.status,
//       transaction: {
//         id: transaction._id,
//         transactionId: transaction.transactionId,
//         amount: transaction.amount,
//         currency: transaction.currency,
//         receiptNumber: transaction.receiptNumber,
//         status: transaction.status,
//         createdAt: transaction.createdAt,
//         updatedAt: transaction.updatedAt,
//         accountReference: transaction.accountReference,
//         externalReference: transaction.externalReference,
//         checkoutRequestId: transaction.checkoutRequestId,
//         providerTransactionId: transaction.providerTransactionId,
//         budgetId: transaction.metadata?.budgetId || null,
//         errorMessage: transaction.errorMessage,
//         purpose: transaction.purpose
//       }
//     });

//   } catch (error: any) {
//     console.error('Status check error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


// app/api/petty-cash/deposit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { initSTKPush } from '@/shd-lib/lib/mpesa';
import Transaction from '@/shd-models/models/Transaction';
import Budget from '@/shd-models/models/Budget';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';

// ============================================================
// TEMPORARY TEST CONFIG
// REPLACE WITH ACTUAL VALUES AND RESTORE JWT AUTH AFTER TESTING
// ============================================================
const TEST_USER_ID = '6a648fb076014722ae88bac6';
const TEST_ORG_ID = '000000000000000000000000'; // VALID 24-char hex placeholder

// Lazy ObjectId creation — only runs inside handlers, not at module load
function getTestUserId() {
  return TEST_USER_ID;
}

function getTestOrgId() {
  return TEST_ORG_ID;
}

function getTestUserObjectId() {
  return new mongoose.Types.ObjectId(TEST_USER_ID);
}

function getTestOrgObjectId() {
  return new mongoose.Types.ObjectId(TEST_ORG_ID);
}

// ============================================================
// POST - Initiate M-Pesa petty cash deposit
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const userId = getTestUserId();
    const userObjectId = getTestUserObjectId();
    const organizationId = getTestOrgObjectId();

    const { 
      amount, 
      phoneNumber, 
      budgetId,
      idempotencyKey
    } = await req.json();

    console.log('========================================');
    console.log('PETTY CASH DEPOSIT REQUEST');
    console.log('Organization ID:', organizationId);
    console.log('Amount:', amount);
    console.log('Phone:', phoneNumber);
    console.log('Budget ID:', budgetId);
    console.log('Idempotency Key:', idempotencyKey);
    console.log('========================================');

    if (!amount || amount < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount. Minimum KSh 1' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.replace(/[+\s]/g, '');

    if (!/^254[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number. Format: 254XXXXXXXXX' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (idempotencyKey) {
      const existingTransaction = await Transaction.findOne({
        organizationId,
        idempotencyKey
      });

      if (existingTransaction) {
        console.log('Duplicate request detected. Returning existing transaction.');
        return NextResponse.json({
          success: true,
          message: 'Duplicate request detected. Returning existing transaction.',
          transactionId: existingTransaction._id,
          status: existingTransaction.status,
          checkoutRequestId: existingTransaction.checkoutRequestId,
          accountReference: existingTransaction.accountReference,
          isDuplicate: true
        });
      }
    }

    let budget = null;
    let budgetObjectId: mongoose.Types.ObjectId | null = null;
    let budgetWeekRange = '';

    if (budgetId) {
      if (!mongoose.Types.ObjectId.isValid(budgetId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid budget ID' },
          { status: 400 }
        );
      }

      budget = await Budget.findOne({ _id: budgetId });

      console.log('Found budget:', budget?._id);

      if (!budget) {
        return NextResponse.json(
          { success: false, error: 'Budget not found' },
          { status: 404 }
        );
      }

      if (budget.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Budget is not active' },
          { status: 400 }
        );
      }

      budgetObjectId = new mongoose.Types.ObjectId(budgetId);
      budgetWeekRange = ` - Budget ${budget.weekStart} to ${budget.weekEnd}`;
    } else {
      const activeBudget = await Budget.findOne({
        status: 'active',
        createdBy: userObjectId
      }).sort({ createdAt: -1 });

      if (activeBudget) {
        budget = activeBudget;
        budgetObjectId = activeBudget._id;
        budgetWeekRange = ` for budget ${activeBudget.weekStart} to ${activeBudget.weekEnd}`;
        console.log('Using active budget:', activeBudget._id);
      }
    }

    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);

    const accountReference = `PC-${timestamp}-${randomSuffix}`;
    const transactionId = `TXN-${timestamp}-${randomSuffix}`;
    const externalReference = budgetId ? `BUDGET-${budgetId}` : `DEP-${timestamp}`;

    console.log('Account Reference:', accountReference);
    console.log('Transaction ID:', transactionId);
    console.log('External Reference:', externalReference);

    const transaction = await Transaction.create({
      transactionId,
      organizationId,
      type: 'deposit',
      category: 'petty_cash',
      amount,
      currency: 'KES',
      status: 'pending',
      phoneNumber: cleanPhone,
      accountReference,
      externalReference: externalReference,
      externalEntityId: budgetId || null,
      externalEntityType: budgetId ? 'budget' : null,
      provider: 'mpesa',
      checkoutRequestId: null,
      purpose: `Petty Cash Deposit${budgetWeekRange}`,
      idempotencyKey: idempotencyKey || undefined,
      metadata: {
        userId: userId,
        budgetId: budgetId || null,
        budgetObjectId: budgetObjectId ? budgetObjectId.toString() : null,
        description: `Petty Cash Deposit${budgetWeekRange}`,
        accountReference,
        depositType: 'petty_cash',
        initiatedBy: userId,
        initiatedAt: new Date().toISOString(),
        organizationName: organization.name
      }
    });

    console.log('Transaction created:', transaction._id);
    console.log('Transaction organizationId:', transaction.organizationId);

    console.log('Initiating STK Push...');

    const stkResult = await initSTKPush(
      cleanPhone,
      amount,
      accountReference
    );

    console.log('STK Result:', stkResult);

    if (!stkResult || stkResult.ResponseCode !== '0') {
      transaction.status = 'failed';
      transaction.errorMessage = stkResult?.ResponseDescription || 'STK push failed';
      await transaction.save();

      return NextResponse.json(
        {
          success: false,
          error: stkResult?.ResponseDescription || 'Failed to initiate STK push',
          checkoutRequestId: stkResult?.CheckoutRequestID,
          transactionId: transaction._id
        },
        { status: 400 }
      );
    }

    // Ensure metadata exists before assigning properties
    if (!transaction.metadata) {
      transaction.metadata = {};
    }

    transaction.checkoutRequestId = stkResult.CheckoutRequestID;
    transaction.status = 'processing';
    transaction.metadata.checkoutRequestId = stkResult.CheckoutRequestID;
    transaction.metadata.stkResponse = stkResult;
    transaction.metadata.stkSentAt = new Date().toISOString();

    await transaction.save();

    console.log('STK Push successfully initiated');
    console.log('CheckoutRequestID:', stkResult.CheckoutRequestID);

    return NextResponse.json({
      success: true,
      message: 'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',
      checkoutRequestId: stkResult.CheckoutRequestID,
      transactionId: transaction.transactionId,
      transactionObjectId: transaction._id,
      accountReference,
      budgetId: budgetObjectId,
      status: transaction.status
    });

  } catch (error: any) {
    console.error('Petty Cash deposit error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// GET - Check deposit transaction status
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const userId = getTestUserId();
    const organizationId = getTestOrgObjectId();

    const searchParams = req.nextUrl.searchParams;
    const transactionId = searchParams.get('transactionId');
    const checkoutRequestId = searchParams.get('checkoutRequestId');
    const externalReference = searchParams.get('externalReference');

    if (!transactionId && !checkoutRequestId && !externalReference) {
      return NextResponse.json(
        { success: false, error: 'TransactionId, CheckoutRequestId, or ExternalReference required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let query: any = { organizationId };

    if (transactionId) {
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid transaction ID' },
          { status: 400 }
        );
      }
      query._id = transactionId;
    } else if (checkoutRequestId) {
      query.checkoutRequestId = checkoutRequestId;
    } else if (externalReference) {
      query.externalReference = externalReference;
    }

    const transaction = await Transaction.findOne(query);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.metadata?.userId?.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      status: transaction.status,
      transaction: {
        id: transaction._id,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        receiptNumber: transaction.receiptNumber,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        accountReference: transaction.accountReference,
        externalReference: transaction.externalReference,
        checkoutRequestId: transaction.checkoutRequestId,
        providerTransactionId: transaction.providerTransactionId,
        budgetId: transaction.metadata?.budgetId || null,
        errorMessage: transaction.errorMessage,
        purpose: transaction.purpose
      }
    });

  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}