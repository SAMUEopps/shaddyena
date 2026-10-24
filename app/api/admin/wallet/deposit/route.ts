import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import User from '@/shd-models/models/User';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { adminUserId, organizationId, amount, phoneNumber } = await req.json();

    if (!adminUserId || !organizationId) {
      return NextResponse.json({ error: 'Missing adminUserId/organizationId' }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json({ error: 'Invalid organizationId' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const admin = await User.findById(adminUserId).lean();
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    // Create the Transaction BEFORE calling M-Pesa (your service requires this)
    const internalRef = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const [transaction] = await Transaction.create([
      {
        transactionId: internalRef,
        organizationId,
        type: 'deposit',
        category: 'wallet_deposit',
        amount,
        currency: 'KES',
        status: 'pending',
        phoneNumber: phoneNumber,
        accountReference: internalRef,
        provider: 'mpesa',
        purpose: 'Admin wallet deposit',
        metadata: {
          initiatedBy: adminUserId,
          walletDeposit: true,
        },
      },
    ]);

    const svc = new MpesaPaymentService(adminUserId, organizationId);
    const stk = await svc.initiatePaymentWithPhone(
      amount,
      'membership' as any, // purpose is passed for reference prefix; wallet is fine as membership-ish
      phoneNumber ,
      { transactionId: transaction.id.toString(), accountReference: internalRef }
    );

    await Transaction.updateOne(
      { _id: transaction._id },
      {
        $set: {
          checkoutRequestId: stk.checkoutRequestId,
          metadata: {
            ...transaction.metadata,
            merchantRequestId: stk.merchantRequestId,
            checkoutRequestId: stk.checkoutRequestId,
            stkInitiatedAt: new Date().toISOString(),
          },
        },
      }
    );

    return NextResponse.json({
      ok: true,
      transactionId: transaction.id.toString(),
      checkoutRequestId: stk.checkoutRequestId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Deposit initiation failed' },
      { status: 500 }
    );
  }
}