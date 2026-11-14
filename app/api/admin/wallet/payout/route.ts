// // app/api/admin/wallet/payout/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';
// import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';
// import { processB2CPayment } from '@/shd-lib/lib/mpesa';

// const LOG = '[ADMIN PAYOUT]';

// function formatPhoneNumber(phone: string) {
//   return phone
//     .replace(/\s+/g, '')
//     .replace('+', '')
//     .replace(/^0/, '254');
// }

// export async function POST(req: NextRequest) {
//   const requestId = `PAYREQ-${Date.now()}`;
//   console.log(`${LOG} ${requestId} Incoming payout request`);

//   try {
//     await connectToDatabase();

//     // Auth
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { marketerId, amount, phoneNumber, remarks } = body;

//     if (!marketerId) {
//       return NextResponse.json(
//         { error: 'marketerId is required' },
//         { status: 400 }
//       );
//     }
//     if (typeof amount !== 'number' || amount <= 0) {
//       return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
//     }

//     // Load marketer — must be a marketer role
//     const marketer = await User.findOne({
//       _id: marketerId,
//       role: 'marketer',
//     });
//     if (!marketer) {
//       return NextResponse.json(
//         { error: 'Marketer not found' },
//         { status: 404 }
//       );
//     }

//     // Compute owed = totalCommissions - already disbursed (pending/processing/completed)
//     const agg = await MarketerWithdrawal.aggregate([
//       {
//         $match: {
//           marketerId: marketer._id,
//           status: { $in: ['pending', 'processing', 'completed'] },
//         },
//       },
//       { $group: { _id: null, total: { $sum: '$amount' } } },
//     ]);
//     const disbursed = Number(agg[0]?.total || 0);
//     const owed = Math.max(
//       0,
//       Number(marketer.totalCommissions || 0) - disbursed
//     );

//     if (amount > owed) {
//       return NextResponse.json(
//         {
//           error: 'Amount exceeds marketer owed balance',
//           owed,
//           requested: amount,
//         },
//         { status: 400 }
//       );
//     }

//     const reference = `MPAY-${Date.now()}-${Math.random()
//       .toString(36)
//       .substring(2, 7)
//       .toUpperCase()}`;

//     const payoutPhone =
//       phoneNumber ||
//       marketer.payoutDetails?.phoneNumber ||
//       marketer.phoneNumber;

//     if (!payoutPhone) {
//       return NextResponse.json(
//         { error: 'Phone number required for payout' },
//         { status: 400 }
//       );
//     }

//     // Create record
//     const withdrawal = await MarketerWithdrawal.create({
//       marketerId: marketer._id,
//       organizationId: marketer.organizationId,
//       amount,
//       method: 'MPESA',
//       status: 'pending',
//       reference,
//       phoneNumber: formatPhoneNumber(payoutPhone),
//       remarks: remarks || undefined,
//       processedBy: decoded.userId,
//     });

//     console.log(`${LOG} ${requestId} Withdrawal created`, withdrawal._id);

//     // Call B2C
//     try {
//       const result = await processB2CPayment(
//         formatPhoneNumber(payoutPhone),
//         amount,
//         'BusinessPayment',
//         `Marketer payout - ${marketer.name}`,
//         `Payout ${reference}`
//       );

//       withdrawal.transactionId =
//         result.ConversationID || result.conversationID;
//       withdrawal.status = 'processing';
//       await withdrawal.save();

//       console.log(`${LOG} ${requestId} B2C initiated`, {
//         transactionId: withdrawal.transactionId,
//       });

//       return NextResponse.json({
//         success: true,
//         message: 'Payout initiated successfully',
//         withdrawal,
//         transactionId: withdrawal.transactionId,
//       });
//     } catch (error: any) {
//       console.error(`${LOG} ${requestId} B2C failed`, error.message);

//       withdrawal.status = 'failed';
//       withdrawal.errorMessage = error.message || 'B2C payment failed';
//       await withdrawal.save();

//       return NextResponse.json(
//         { error: 'Failed to process payout', details: error.message },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error(`${LOG} ${requestId} Fatal error`, error.message);
//     return NextResponse.json(
//       { error: 'Failed to process payout', details: error.message },
//       { status: 500 }
//     );
//   }
// }


// // app/api/admin/wallet/payout/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import User from '@/shd-models/models/User';
// import Transaction from '@/shd-models/models/Transaction';
// import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';
// import { processB2CPayment } from '@/shd-lib/lib/mpesa';
// import { getAdminWalletSummary } from '@/shd-lib/lib/adminWallet';

// const LOG = '[ADMIN PAYOUT]';

// function formatPhoneNumber(phone: string) {
//   return phone.replace(/\s+/g, '').replace('+', '').replace(/^0/, '254');
// }

// export async function POST(req: NextRequest) {
//   const requestId = `PAYREQ-${Date.now()}`;
//   console.log(`${LOG} ${requestId} Incoming payout request`);

//   try {
//     await connectToDatabase();

//     // ---- Auth ----
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const {
//       marketerId,
//       amount,
//       phoneNumber,
//       remarks,
//       organizationId,
//       idempotencyKey,
//     } = body;

//     // ---- Basic validation ----
//     if (!marketerId) {
//       return NextResponse.json(
//         { error: 'marketerId is required' },
//         { status: 400 }
//       );
//     }
//     if (typeof amount !== 'number' || amount <= 0) {
//       return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
//     }
//     if (!organizationId) {
//       return NextResponse.json(
//         { error: 'organizationId is required' },
//         { status: 400 }
//       );
//     }

//     // ---- Load marketer ----
//     const marketer = await User.findOne({
//       _id: marketerId,
//       role: 'marketer',
//     });
//     if (!marketer) {
//       return NextResponse.json(
//         { error: 'Marketer not found' },
//         { status: 404 }
//       );
//     }

//     // ---- Business rule: amount <= marketer.owed ----
//     const agg = await MarketerWithdrawal.aggregate([
//       {
//         $match: {
//           marketerId: marketer._id,
//           status: { $in: ['pending', 'processing', 'completed'] },
//         },
//       },
//       { $group: { _id: null, total: { $sum: '$amount' } } },
//     ]);
//     const alreadyDisbursed = Number(agg[0]?.total || 0);
//     const owed = Math.max(
//       0,
//       Number(marketer.totalCommissions || 0) - alreadyDisbursed
//     );

//     if (amount > owed) {
//       return NextResponse.json(
//         {
//           error: `Amount exceeds marketer owed (KES ${owed.toLocaleString()})`,
//           owed,
//           requested: amount,
//         },
//         { status: 400 }
//       );
//     }

//     // ---- Financial rule: amount <= admin wallet available ----
//     const wallet = await getAdminWalletSummary(organizationId);
//     if (amount > wallet.availableBalance) {
//       return NextResponse.json(
//         {
//           error: `Insufficient wallet balance (available KES ${wallet.availableBalance.toLocaleString()})`,
//           availableBalance: wallet.availableBalance,
//           requested: amount,
//         },
//         { status: 400 }
//       );
//     }

//     // ---- Payout phone ----
//     const payoutPhone =
//       phoneNumber ||
//       marketer.payoutDetails?.phoneNumber ||
//       marketer.phoneNumber;

//     if (!payoutPhone) {
//       return NextResponse.json(
//         { error: 'Phone number required for payout' },
//         { status: 400 }
//       );
//     }

//     const reference = `MPAY-${Date.now()}-${Math.random()
//       .toString(36)
//       .substring(2, 7)
//       .toUpperCase()}`;

//     // ---- Create the wallet transaction (reserves funds) ----
//     // Status starts at 'pending' so the wallet summary reserves the amount
//     // via `pendingPayouts` before we even call B2C.
//     const [walletTxn] = await Transaction.create([
//       {
//         transactionId: reference,
//         organizationId,
//         type: 'payout',
//         category: 'marketer_payout',
//         amount,
//         currency: 'KES',
//         status: 'pending',
//         phoneNumber: formatPhoneNumber(payoutPhone),
//         accountReference: reference,
//         provider: 'mpesa',
//         purpose: `Marketer payout — ${marketer.name}`,
//         idempotencyKey: idempotencyKey || undefined,
//         metadata: {
//           marketerId: String(marketer._id),
//           marketerName: marketer.name,
//           initiatedBy: decoded.userId,
//           remarks: remarks || null,
//         },
//       },
//     ]);

//     // ---- Create marketer-withdrawal record ----
//     const withdrawal = await MarketerWithdrawal.create({
//       marketerId: marketer._id,
//       organizationId,
//       amount,
//       method: 'MPESA',
//       status: 'pending',
//       reference,
//       phoneNumber: formatPhoneNumber(payoutPhone),
//       remarks: remarks || undefined,
//       processedBy: decoded.userId,
//       metadata: { walletTransactionId: String(walletTxn._id) },
//     });

//     console.log(`${LOG} ${requestId} Records created`, {
//       withdrawalId: withdrawal._id,
//       walletTxnId: walletTxn._id,
//     });

//     // ---- Call B2C ----
//     try {
//       const result = await processB2CPayment(
//         formatPhoneNumber(payoutPhone),
//         amount,
//         'BusinessPayment',
//         `Marketer payout - ${marketer.name}`,
//         `Payout ${reference}`
//       );

//       const transactionId =
//         result.ConversationID || result.conversationID;

//       // Mark both records as 'processing'
//       withdrawal.transactionId = transactionId;
//       withdrawal.status = 'processing';

//       await Promise.all([
//         withdrawal.save(),
//         Transaction.updateOne(
//           { _id: walletTxn._id },
//           {
//             $set: {
//               status: 'processing',
//               providerTransactionId: transactionId,
//               metadata: {
//                 ...(walletTxn.metadata || {}),
//                 b2cInitiatedAt: new Date().toISOString(),
//                 conversationId: transactionId,
//                 originatorConversationId:
//                   result.OriginatorConversationID ||
//                   result.originatorConversationID,
//               },
//             },
//           }
//         ),
//       ]);

//       console.log(`${LOG} ${requestId} B2C initiated`, { transactionId });

//       return NextResponse.json({
//         success: true,
//         message: 'Payout initiated successfully',
//         withdrawal,
//         walletTransactionId: String(walletTxn._id),
//         transactionId,
//         wallet: await getAdminWalletSummary(organizationId),
//       });
//     } catch (error: any) {
//       console.error(`${LOG} ${requestId} B2C failed`, error.message);

//       // Roll back both records → funds become available again
//       withdrawal.status = 'failed';
//       withdrawal.errorMessage = error.message || 'B2C payment failed';

//       await Promise.all([
//         withdrawal.save(),
//         Transaction.updateOne(
//           { _id: walletTxn._id },
//           {
//             $set: {
//               status: 'failed',
//               errorMessage: error.message || 'B2C payment failed',
//             },
//           }
//         ),
//       ]);

//       return NextResponse.json(
//         { error: 'Failed to process payout', details: error.message },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error(`${LOG} ${requestId} Fatal error`, error.message);
//     return NextResponse.json(
//       { error: 'Failed to process payout', details: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/admin/wallet/payout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import User from '@/shd-models/models/User';
import { processB2CPayment } from '@/shd-lib/lib/mpesa';

const DEPOSIT_CREDIT_CATEGORIES = ['wallet_deposit'];
const PAYOUT_DEBIT_CATEGORIES = ['marketer_payout'];

async function computeWalletBalance(organizationId: string) {
  // Only count successful transactions
  const [credits, debits] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: 'success',
          category: { $in: DEPOSIT_CREDIT_CATEGORIES },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          // Payouts reserve funds while pending/processing too
          status: { $in: ['pending', 'processing', 'success'] },
          category: { $in: PAYOUT_DEBIT_CATEGORIES },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const credited = credits[0]?.total ?? 0;
  const debited = debits[0]?.total ?? 0;
  return { credited, debited, available: credited - debited };
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const {
      adminUserId,
      organizationId,
      marketerId,
      amount,
      phoneNumber,
      remarks,
      idempotencyKey,
    } = await req.json();

    // ---------------- Validation ----------------
    if (!adminUserId || !organizationId || !marketerId) {
      return NextResponse.json(
        { error: 'Missing adminUserId/organizationId/marketerId' },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json({ error: 'Invalid organizationId' }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(marketerId)) {
      return NextResponse.json({ error: 'Invalid marketerId' }, { status: 400 });
    }

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required for B2C payout' },
        { status: 400 }
      );
    }

    // ---------------- Lookups ----------------
    const [admin, marketer] = await Promise.all([
      User.findById(adminUserId).lean(),
      User.findById(marketerId).lean(),
    ]);

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    if (!marketer) {
      return NextResponse.json({ error: 'Marketer not found' }, { status: 404 });
    }

    // ---------------- Idempotency ----------------
    if (idempotencyKey) {
      const existing = await Transaction.findOne({
        organizationId,
        idempotencyKey,
      }).lean();
      if (existing) {
        return NextResponse.json({
          ok: true,
          idempotent: true,
          transactionId: existing.transactionId,
          checkoutRequestId: existing.providerTransactionId,
        });
      }
    }

    // ---------------- Balance check (wallet_deposit only) ----------------
    const { available } = await computeWalletBalance(organizationId);
    if (amt > available) {
      return NextResponse.json(
        {
          error: `Insufficient wallet balance. Available: KES ${available.toLocaleString()}`,
          available,
        },
        { status: 400 }
      );
    }

    // ---------------- Create transaction first ----------------
    const internalRef = `PAY-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const [transaction] = await Transaction.create([
      {
        transactionId: internalRef,
        organizationId,
        type: 'payout',
        category: 'marketer_payout',
        amount: amt,
        currency: 'KES',
        status: 'pending',
        phoneNumber,
        accountReference: internalRef,
        provider: 'mpesa',
        purpose: `Marketer payout${remarks ? ` — ${remarks}` : ''}`,
        idempotencyKey: idempotencyKey || undefined,
        metadata: {
          initiatedBy: adminUserId,
          marketerId: String(marketerId),
          //marketerName: marketer.name,
          //marketerEmail: marketer.email,
          remarks: remarks || null,
          walletPayout: true,
          fundedFrom: 'wallet_deposit',
        },
      },
    ]);

    // ---------------- Call Safaricom B2C ----------------
    let b2cResponse: any;
    try {
      b2cResponse = await processB2CPayment(
        phoneNumber,
        amt,
        'BusinessPayment',
        remarks || `Shaddyna marketer payout ${internalRef}`,
        internalRef
      );
    } catch (b2cError: any) {
      // Mark transaction failed immediately if Safaricom rejects the request
      const errorMessage =
        b2cError?.response?.data?.errorMessage ||
        b2cError?.response?.data?.ResponseDescription ||
        b2cError?.message ||
        'B2C initiation failed';

      await Transaction.updateOne(
        { _id: transaction._id },
        {
          $set: {
            status: 'failed',
            errorMessage,
            metadata: {
              ...transaction.metadata,
              b2cInitiationError: b2cError?.response?.data || null,
              failedAt: new Date().toISOString(),
            },
          },
        }
      );

      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    // ---------------- Persist M-Pesa identifiers ----------------
    const originatorConversationId =
      b2cResponse?.OriginatorConversationID || null;
    const conversationId = b2cResponse?.ConversationID || null;

    await Transaction.updateOne(
      { _id: transaction._id },
      {
        $set: {
          status: 'processing',
          providerTransactionId:
            conversationId || transaction.providerTransactionId,
          metadata: {
            ...transaction.metadata,
            originatorConversationId,
            conversationId,
            b2cResponse,
            b2cInitiatedAt: new Date().toISOString(),
          },
        },
      }
    );

    return NextResponse.json({
      ok: true,
      transactionId: transaction.id.toString(),
      originatorConversationId,
      conversationId,
    });
  } catch (err: any) {
    console.error('Payout route error:', err);
    return NextResponse.json(
      { error: err.message || 'Payout initiation failed' },
      { status: 500 }
    );
  }
}