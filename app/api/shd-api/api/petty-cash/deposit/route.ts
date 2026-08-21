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

// app/api/petty-cash/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { initSTKPush } from '@/shd-lib/lib/mpesa';
import Transaction from '@/shd-models/models/Transaction';
import Budget from '@/shd-models/models/Budget';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Helper to verify JWT token from request
async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
    
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { amount, phoneNumber, budgetId } = await req.json();

    console.log('Deposit request:', { amount, phoneNumber, budgetId, userId: auth.userId });

    // Validate input
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

    // Validate phone number
    const cleanPhone = phoneNumber.replace(/[+\s]/g, '');
    if (!/^254[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify budget exists if provided
    let budget = null;
    let budgetObjectId = null;
    if (budgetId) {
      budget = await Budget.findById(budgetId);
      console.log('Found budget:', budget);
      
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
    } else {
      // If no budgetId provided, try to find an active budget for the user
      // This is a fallback - you might want to handle this differently
      const activeBudget = await Budget.findOne({ 
        status: 'active',
        createdBy: new mongoose.Types.ObjectId(auth.userId)
      });
      
      if (activeBudget) {
        budgetObjectId = activeBudget._id;
        budget = activeBudget;
        console.log('Using fallback active budget:', activeBudget._id);
      }
    }

    // Generate unique reference for this deposit
    const accountReference = `PC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create transaction record first (pending status)
    const transaction = await Transaction.create({
      transactionId,
      accountReference,
      type: 'petty_cash_deposit',
      status: 'pending',
      amount: amount,
      phoneNumber: cleanPhone,
      userId: new mongoose.Types.ObjectId(auth.userId),
      budgetId: budgetObjectId, // Make sure this is saved
      purpose: `Petty Cash Deposit${budget ? ` - Budget ${budget.weekStart} to ${budget.weekEnd}` : ''}`,
      metadata: {
        budgetId: budgetId || null,
        budgetObjectId: budgetObjectId ? budgetObjectId.toString() : null,
        description: `Petty Cash Deposit${budget ? ` for budget ${budget.weekStart} to ${budget.weekEnd}` : ''}`,
        accountReference,
        depositType: 'petty_cash',
        initiatedBy: auth.userId,
        initiatedAt: new Date().toISOString()
      }
    });

    console.log('Transaction created with budgetId:', transaction.budgetId);

    // Initiate STK Push
    const stkResult = await initSTKPush(
      cleanPhone,
      amount,
      accountReference
    );

    if (!stkResult || stkResult.ResponseCode !== '0') {
      // Update transaction as failed
      transaction.status = 'failed';
      transaction.errorMessage = stkResult?.ResponseDescription || 'STK push failed';
      await transaction.save();

      return NextResponse.json({
        success: false,
        error: stkResult?.ResponseDescription || 'Failed to initiate STK push',
        checkoutRequestId: stkResult?.CheckoutRequestID,
      }, { status: 400 });
    }

    // Update transaction with checkout request ID
    transaction.checkoutRequestId = stkResult.CheckoutRequestID;
    transaction.metadata.checkoutRequestId = stkResult.CheckoutRequestID;
    await transaction.save();

    return NextResponse.json({
      success: true,
      message: 'STK push sent successfully. Please check your phone and enter your M-Pesa PIN.',
      checkoutRequestId: stkResult.CheckoutRequestID,
      transactionId: transaction._id,
      accountReference,
      budgetId: budgetObjectId
    });

  } catch (error: any) {
    console.error('Petty Cash deposit error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check deposit status
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const transactionId = searchParams.get('transactionId');
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!transactionId && !checkoutRequestId) {
      return NextResponse.json(
        { success: false, error: 'TransactionId or CheckoutRequestId required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let transaction;
    if (transactionId) {
      transaction = await Transaction.findById(transactionId);
    } else if (checkoutRequestId) {
      transaction = await Transaction.findOne({ checkoutRequestId });
    }

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check if user owns this transaction
    if (transaction.userId?.toString() !== auth.userId) {
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
        amount: transaction.amount,
        receiptNumber: transaction.receiptNumber,
        status: transaction.status,
        createdAt: transaction.createdAt,
        accountReference: transaction.accountReference,
        checkoutRequestId: transaction.checkoutRequestId,
        budgetId: transaction.budgetId
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