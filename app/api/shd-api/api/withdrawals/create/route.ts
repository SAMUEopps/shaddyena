// app/api/shd-api/api/withdrawals/create/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { processB2CPayment } from '@/shd-lib/lib/mpesa';
import User from '@/shd-models/models/User';
import Savings from '@/shd-models/models/Savings';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

const MIN_WITHDRAWAL = 50; // KSh — raise if B2C minimums require it
const MAX_WITHDRAWAL = 50000;

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDatabase();

    // ── Auth ───────────────────────────────────────────────────
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Body ───────────────────────────────────────────────────
    const body = await req.json();
    const { amount, organizationId, phoneNumber } = body;

    if (!organizationId || !mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json(
        { error: 'organizationId is required and must be valid' },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < MIN_WITHDRAWAL) {
      return NextResponse.json(
        { error: `Minimum withdrawal is KSh ${MIN_WITHDRAWAL}` },
        { status: 400 }
      );
    }
    if (numericAmount > MAX_WITHDRAWAL) {
      return NextResponse.json(
        { error: `Maximum withdrawal is KSh ${MAX_WITHDRAWAL}` },
        { status: 400 }
      );
    }

    // ── Load + validate user ───────────────────────────────────
    const user = await User.findById(decoded.userId).session(session);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.isMember) {
      return NextResponse.json(
        { error: 'You must be a member to withdraw' },
        { status: 403 }
      );
    }

    const payoutPhone = (phoneNumber || user.phoneNumber || '').trim();
    if (!payoutPhone) {
      return NextResponse.json(
        { error: 'No phone number on file — provide phoneNumber' },
        { status: 400 }
      );
    }
    if (!/^(?:254|\+254|0)?7\d{8}$/.test(payoutPhone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
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

    // ── Atomically debit (race-safe) ───────────────────────────
    const debited = await User.findOneAndUpdate(
      { _id: user._id, availableBalance: { $gte: numericAmount } },
      { $inc: { availableBalance: -numericAmount } },
      { new: true, session }
    );
    if (!debited) {
      await session.abortTransaction();
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // ── Ledger row (pending until B2C result callback) ─────────
    const reference = `WDR-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const [savings] = await Savings.create(
      [
        {
          userId: user._id,
          organizationId,
          amount: numericAmount,
          type: 'withdrawal',
          description: 'Savings withdrawal via M-Pesa B2C',
          status: 'pending',
          reference,
          metadata: { payoutPhone, initiatedAt: new Date().toISOString() },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // ── Fire B2C outside the DB transaction ────────────────────
    // NOTE: If this throws, we must refund. Do NOT wrap in the session.
    try {
      const b2c = await processB2CPayment(
        payoutPhone,
        numericAmount,
        'BusinessPayment',
        'Shaddyna savings withdrawal',
        reference
      );

      // Persist the conversation ID so the result callback can match it
      const originatorId =
        b2c?.OriginatorConversationID ||
        b2c?.ConversationID ||
        b2c?.originatorConversationID;

      await Savings.findByIdAndUpdate(savings._id, {
        $set: {
          'metadata.b2c': b2c,
          'metadata.b2cOriginatorId': originatorId,
        },
      });

      return NextResponse.json({
        message:
          'Withdrawal initiated. You will receive the funds on your phone shortly.',
        withdrawal: {
          reference,
          amount: numericAmount,
          phoneNumber: payoutPhone,
          status: 'pending',
        },
        balance: { availableBalance: debited.availableBalance },
        provider: {
          originatorConversationId: originatorId,
          responseCode: b2c?.ResponseCode,
          responseDescription: b2c?.ResponseDescription,
        },
      });
    } catch (b2cError: any) {
      // ── Refund the debit + mark the ledger row failed ────────
      await User.findByIdAndUpdate(user._id, {
        $inc: { availableBalance: numericAmount },
      });
      await Savings.findByIdAndUpdate(savings._id, {
        status: 'failed',
        $set: {
          'metadata.b2cError':
            b2cError?.response?.data || b2cError?.message || 'B2C failed',
        },
      });

      console.error('B2C withdrawal failed:', b2cError?.response?.data || b2cError);
      return NextResponse.json(
        {
          error:
            b2cError?.response?.data?.errorMessage ||
            b2cError?.message ||
            'Failed to initiate withdrawal',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error('Withdrawal creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create withdrawal' },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}