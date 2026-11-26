// // // C:\Users\USER\Desktop\Projects\my-app\app\api\investments\create\route.ts
// // import { verifyToken } from '@/shd-lib/lib/auth';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import Investment from '@/shd-models/models/Investment';
// // import User from '@/shd-models/models/User';
// // import { NextRequest, NextResponse } from 'next/server';


// // const INVESTMENT_RATES = {
// //   TRANSPORT: { returnRate: 0.15, minAmount: 1000, maxAmount: 100000, duration: 6 },
// //   MARKETING: { returnRate: 0.12, minAmount: 500, maxAmount: 50000, duration: 4 },
// //   TECHNOLOGY: { returnRate: 0.20, minAmount: 2000, maxAmount: 200000, duration: 12 },
// //   STARTUP: { returnRate: 0.25, minAmount: 5000, maxAmount: 500000, duration: 18 }
// // };

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDatabase();
    
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     if (!token) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const decoded = verifyToken(token);
// //     if (!decoded) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const body = await req.json();
// //     const { type, amount } = body;

// //     const user = await User.findById(decoded.userId);
// //     if (!user) {
// //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //     }

// //     if (!user.isMember) {
// //       return NextResponse.json(
// //         { error: 'You must be a member to invest' },
// //         { status: 403 }
// //       );
// //     }

// //     const investmentConfig = INVESTMENT_RATES[type as keyof typeof INVESTMENT_RATES];
// //     if (!investmentConfig) {
// //       return NextResponse.json(
// //         { error: 'Invalid investment type' },
// //         { status: 400 }
// //       );
// //     }

// //     if (amount < investmentConfig.minAmount || amount > investmentConfig.maxAmount) {
// //       return NextResponse.json(
// //         { error: `Amount must be between ${investmentConfig.minAmount} and ${investmentConfig.maxAmount}` },
// //         { status: 400 }
// //       );
// //     }

// //     if (user.availableBalance < amount) {
// //       return NextResponse.json(
// //         { error: 'Insufficient balance' },
// //         { status: 400 }
// //       );
// //     }

// //     // Calculate expected return
// //     const expectedReturn = amount * (1 + investmentConfig.returnRate);
// //     const endDate = new Date();
// //     endDate.setMonth(endDate.getMonth() + investmentConfig.duration);

// //     // Create investment
// //     const investment = await Investment.create({
// //       userId: user._id,
// //       type,
// //       amount,
// //       status: 'active',
// //       duration: investmentConfig.duration,
// //       startDate: new Date(),
// //       endDate,
// //       expectedReturn
// //     });

// //     // Deduct from user balance
// //     user.availableBalance -= amount;
// //     user.totalInvestments += amount;
// //     await user.save();

// //     return NextResponse.json({
// //       message: 'Investment created successfully!',
// //       investment,
// //       user: {
// //         totalInvestments: user.totalInvestments,
// //         availableBalance: user.availableBalance
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Investment creation error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to create investment' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/shd-api/api/investments/create/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';
// import Investment from '@/shd-models/models/Investment';
// import User from '@/shd-models/models/User';
// import { NextRequest, NextResponse } from 'next/server';

// const INVESTMENT_RATES = {
//   TRANSPORT: { returnRate: 0.15, minAmount: 1000, maxAmount: 100000, duration: 6 },
//   MARKETING: { returnRate: 0.12, minAmount: 500, maxAmount: 50000, duration: 4 },
//   TECHNOLOGY: { returnRate: 0.20, minAmount: 2000, maxAmount: 200000, duration: 12 },
//   STARTUP: { returnRate: 0.25, minAmount: 5000, maxAmount: 500000, duration: 18 }
// };

// export async function POST(req: NextRequest) {
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

//     const body = await req.json();
//     const { type, amount } = body;

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (!user.isMember) {
//       return NextResponse.json(
//         { error: 'You must be a member to invest' },
//         { status: 403 }
//       );
//     }

//     const investmentConfig = INVESTMENT_RATES[type as keyof typeof INVESTMENT_RATES];
//     if (!investmentConfig) {
//       return NextResponse.json(
//         { error: 'Invalid investment type' },
//         { status: 400 }
//       );
//     }

//     if (amount < investmentConfig.minAmount || amount > investmentConfig.maxAmount) {
//       return NextResponse.json(
//         { error: `Amount must be between ${investmentConfig.minAmount} and ${investmentConfig.maxAmount}` },
//         { status: 400 }
//       );
//     }

//     // Calculate expected return
//     const expectedReturn = amount * (1 + investmentConfig.returnRate);
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + investmentConfig.duration);

//     // Create investment record first
//     const investment = await Investment.create({
//       userId: user._id,
//       type,
//       amount,
//       status: 'pending',
//       duration: investmentConfig.duration,
//       startDate: new Date(),
//       endDate,
//       expectedReturn
//     });

//     // Initialize M-Pesa payment
//     const mpesaService = new MpesaPaymentService(user._id);
    
//     const paymentResult = await mpesaService.initiatePayment(
//       amount,
//       'investment',
//       {
//         investmentId: investment._id,
//         investmentType: type,
//         expectedReturn: expectedReturn,
//         duration: investmentConfig.duration
//       }
//     );

//     return NextResponse.json({
//       message: 'Investment created. Please complete M-Pesa payment.',
//       investment,
//       payment: {
//         checkoutRequestId: paymentResult.checkoutRequestId,
//         transactionId: paymentResult.transactionId,
//         phoneNumber: user.phoneNumber
//       }
//     });

//   } catch (error) {
//     console.error('Investment creation error:', error);
//     return NextResponse.json(
//       { error:'Failed to create investment' },
//       { status: 500 }
//     );
//   }
// }

// // app/api/shd-api/api/investments/create/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';
// import Investment from '@/shd-models/models/Investment';
// import User from '@/shd-models/models/User';

// import { NextRequest, NextResponse } from 'next/server';

// const INVESTMENT_RATES = {
//   TRANSPORT: { returnRate: 0.15, minAmount: 10, maxAmount: 100000, duration: 6 },
//   MARKETING: { returnRate: 0.12, minAmount: 10, maxAmount: 50000, duration: 4 },
//   TECHNOLOGY: { returnRate: 0.20, minAmount: 10, maxAmount: 200000, duration: 12 },
//   STARTUP: { returnRate: 0.25, minAmount: 10, maxAmount: 500000, duration: 18 }
// };

// export async function POST(req: NextRequest) {
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

//     const body = await req.json();
//     const { type, amount, organizationId } = body; 

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (!user.isMember) {
//       return NextResponse.json(
//         { error: 'You must be a member to invest' },
//         { status: 403 }
//       );
//     }

//     const investmentConfig = INVESTMENT_RATES[type as keyof typeof INVESTMENT_RATES];
//     if (!investmentConfig) {
//       return NextResponse.json(
//         { error: 'Invalid investment type' },
//         { status: 400 }
//       );
//     }

//     if (amount < investmentConfig.minAmount || amount > investmentConfig.maxAmount) {
//       return NextResponse.json(
//         { error: `Amount must be between ${investmentConfig.minAmount} and ${investmentConfig.maxAmount}` },
//         { status: 400 }
//       );
//     }

//     // Calculate expected return
//     const expectedReturn = amount * (1 + investmentConfig.returnRate);
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + investmentConfig.duration);

//     // Create investment record first (pending status)
//     const investment = await Investment.create({
//       userId: user._id,
//       type,
//       amount,
//       status: 'pending',
//       duration: investmentConfig.duration,
//       startDate: new Date(),
//       endDate,
//       expectedReturn
//     });

//     try {
//       // Initialize M-Pesa payment
//       const mpesaService = new MpesaPaymentService(user._id,organizationId);
      
//       const paymentResult = await mpesaService.initiatePayment(
//         amount,
//         'investment',
//         {
//           investmentId: investment._id,
//           investmentType: type,
//           expectedReturn: expectedReturn,
//           duration: investmentConfig.duration,
//           investmentName: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
//         }
//       );

//       return NextResponse.json({
//         message: 'Investment created. Please complete M-Pesa payment.',
//         investment,
//         payment: {
//           checkoutRequestId: paymentResult.checkoutRequestId,
//           transactionId: paymentResult.transactionId,
//           phoneNumber: user.phoneNumber
//         }
//       });

//     } catch (mpesaError: any) {
//       // If M-Pesa fails, mark investment as cancelled
//       await Investment.findByIdAndUpdate(investment._id, { status: 'cancelled' });
      
//       return NextResponse.json(
//         { error: mpesaError.message || 'Failed to initiate payment' },
//         { status: 500 }
//       );
//     }

//   } catch (error: any) {
//     console.error('Investment creation error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create investment' },
//       { status: 500 }
//     );
//   }
// }


// // app/api/shd-api/api/investments/create/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';
// import Investment from '@/shd-models/models/Investment';
// import User from '@/shd-models/models/User';
// import Transaction from '@/shd-models/models/Transaction';
// import mongoose from 'mongoose';

// import { NextRequest, NextResponse } from 'next/server';

// const INVESTMENT_RATES = {
//   TRANSPORT: { returnRate: 0.15, minAmount: 10, maxAmount: 100000, duration: 6 },
//   MARKETING: { returnRate: 0.12, minAmount: 10, maxAmount: 50000, duration: 4 },
//   TECHNOLOGY: { returnRate: 0.20, minAmount: 10, maxAmount: 200000, duration: 12 },
//   STARTUP: { returnRate: 0.25, minAmount: 10, maxAmount: 500000, duration: 18 },
// };

// export async function POST(req: NextRequest) {
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

//     const body = await req.json();
//     const { type, amount, organizationId } = body;

//     // ── Fail fast on organizationId ───────────────────────────
//     if (!organizationId) {
//       return NextResponse.json(
//         { error: 'organizationId is required' },
//         { status: 400 }
//       );
//     }
//     if (!mongoose.Types.ObjectId.isValid(organizationId)) {
//       return NextResponse.json(
//         { error: 'Invalid organizationId' },
//         { status: 400 }
//       );
//     }

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (!user.isMember) {
//       return NextResponse.json(
//         { error: 'You must be a member to invest' },
//         { status: 403 }
//       );
//     }

//     const investmentConfig = INVESTMENT_RATES[type as keyof typeof INVESTMENT_RATES];
//     if (!investmentConfig) {
//       return NextResponse.json(
//         { error: 'Invalid investment type' },
//         { status: 400 }
//       );
//     }

//     if (amount < investmentConfig.minAmount || amount > investmentConfig.maxAmount) {
//       return NextResponse.json(
//         {
//           error: `Amount must be between ${investmentConfig.minAmount} and ${investmentConfig.maxAmount}`,
//         },
//         { status: 400 }
//       );
//     }

//     // ── Calculate expected return ─────────────────────────────
//     const expectedReturn = amount * (1 + investmentConfig.returnRate);
//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + investmentConfig.duration);

//     // ── 1. Create investment (pending) ────────────────────────
//     const investment = await Investment.create({
//       userId: user._id,
//       type,
//       amount,
//       status: 'pending',
//       duration: investmentConfig.duration,
//       startDate: new Date(),
//       endDate,
//       expectedReturn,
//     });

//     // ── 2. Create transaction (pending) ───────────────────────
//     // Both must exist before STK push — the service looks up
//     // Transaction by metadata.transactionId.
//     const accountReference = `INV-${Date.now()}-${Math.random()
//       .toString(36)
//       .substring(2, 7)
//       .toUpperCase()}`;

//     let transaction;
//     try {
//       transaction = await Transaction.create({
//         transactionId: `TXN-${Date.now()}-${Math.random()
//           .toString(36)
//           .substring(2, 7)
//           .toUpperCase()}`,
//         organizationId: new mongoose.Types.ObjectId(organizationId),
//         type: 'payment',            // schema enum: payment | deposit | payout | order | refund
//         category: 'investment',     // schema enum includes 'investment'
//         amount,
//         currency: 'KES',
//         status: 'pending',
//         phoneNumber: user.phoneNumber,
//         accountReference,
//         provider: 'mpesa',
//         purpose: 'investment',
//         metadata: {
//           userId: user._id.toString(),
//           organizationId,
//           investmentId: investment._id.toString(),
//           investmentType: type,
//           expectedReturn,
//           duration: investmentConfig.duration,
//           investmentName:
//             type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
//         },
//       });
//     } catch (txErr: any) {
//       // roll back the investment row if we can't even start the tx
//       await Investment.findByIdAndUpdate(investment._id, { status: 'cancelled' });
//       return NextResponse.json(
//         { error: txErr.message || 'Failed to create transaction' },
//         { status: 500 }
//       );
//     }

//     // ── 3. Kick off STK push ──────────────────────────────────
//     try {
//       const mpesaService = new MpesaPaymentService(
//         user._id.toString(),
//         organizationId
//       );

//       const paymentResult = await mpesaService.initiatePayment(amount, 'investment', {
//         // required by the service:
//         transactionId: transaction.id.toString(),
//         userId: user._id.toString(),
//         organizationId,
//         // flow-specific:
//         investmentId: investment._id.toString(),
//         investmentType: type,
//         expectedReturn,
//         duration: investmentConfig.duration,
//         investmentName:
//           type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
//         accountReference,
//       });

//       return NextResponse.json({
//         message: 'Investment created. Please complete M-Pesa payment.',
//         investment,
//         payment: {
//           checkoutRequestId: paymentResult.checkoutRequestId,
//           transactionId: paymentResult.transactionId,
//           phoneNumber: user.phoneNumber,
//         },
//       });
//     } catch (mpesaError: any) {
//       // ── 4. Roll back both rows on STK failure ────────────────
//       await Investment.findByIdAndUpdate(investment._id, { status: 'cancelled' });
//       await Transaction.findByIdAndUpdate(transaction._id, {
//         status: 'failed',
//         errorMessage: mpesaError.message || 'Failed to initiate payment',
//       });

//       return NextResponse.json(
//         { error: mpesaError.message || 'Failed to initiate payment' },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error('Investment creation error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create investment' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/investments/create/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Investment from '@/shd-models/models/Investment';
import User from '@/shd-models/models/User';
import Savings from '@/shd-models/models/Savings'; // for the audit trail
import mongoose from 'mongoose';

import { NextRequest, NextResponse } from 'next/server';

const INVESTMENT_RATES = {
  TRANSPORT:  { returnRate: 0.15, minAmount: 10, maxAmount: 100000, duration: 6 },
  MARKETING:  { returnRate: 0.12, minAmount: 10, maxAmount: 50000,  duration: 4 },
  TECHNOLOGY: { returnRate: 0.20, minAmount: 10, maxAmount: 200000, duration: 12 },
  STARTUP:    { returnRate: 0.25, minAmount: 10, maxAmount: 500000, duration: 18 },
};

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const body = await req.json();
    const { type, amount, organizationId } = body;

    if (!organizationId || !mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json(
        { error: 'organizationId is required and must be valid' },
        { status: 400 }
      );
    }

    const investmentConfig = INVESTMENT_RATES[type as keyof typeof INVESTMENT_RATES];
    if (!investmentConfig) {
      return NextResponse.json({ error: 'Invalid investment type' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < investmentConfig.minAmount ||
      numericAmount > investmentConfig.maxAmount
    ) {
      return NextResponse.json(
        {
          error: `Amount must be between ${investmentConfig.minAmount} and ${investmentConfig.maxAmount}`,
        },
        { status: 400 }
      );
    }

    // Lock the user row so concurrent invests can't overdraw
    const user = await User.findById(decoded.userId).session(session);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.isMember) {
      return NextResponse.json(
        { error: 'You must be a member to invest' },
        { status: 403 }
      );
    }

    if ((user.availableBalance || 0) < numericAmount) {
      return NextResponse.json(
        {
          error: `Insufficient savings. Available: KSh ${(
            user.availableBalance || 0
          ).toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    // ── Atomically debit the balance (guard against race) ─────
    const debited = await User.findOneAndUpdate(
      {
        _id: user._id,
        availableBalance: { $gte: numericAmount },
      },
      {
        $inc: {
          availableBalance: -numericAmount,
          totalInvestments: numericAmount,
        },
      },
      { new: true, session }
    );

    if (!debited) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // ── Compute return schedule ───────────────────────────────
    const expectedReturn = numericAmount * (1 + investmentConfig.returnRate);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + investmentConfig.duration);

    // ── Create the active investment ──────────────────────────
    const [investment] = await Investment.create(
      [
        {
          userId: user._id,
          type,
          amount: numericAmount,
          status: 'active',
          duration: investmentConfig.duration,
          startDate,
          endDate,
          expectedReturn,
        },
      ],
      { session }
    );

    // ── Savings ledger entry (debit) for audit trail ──────────
    await Savings.create(
      [
        {
          userId: user._id,
          organizationId,
          amount: numericAmount,
          type: 'withdrawal', // or 'investment' if your enum supports it
          description: `Investment – ${type}`,
          status: 'completed',
          reference: `INV-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)
            .toUpperCase()}`,
          metadata: { investmentId: investment._id.toString() },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json({
      message: 'Investment successful',
      investment,
      balance: {
        availableBalance: debited.availableBalance,
        totalInvestments: debited.totalInvestments,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Investment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create investment' },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}