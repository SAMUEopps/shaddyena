// app/api/admin/wallet/payout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';
import { processB2CPayment } from '@/shd-lib/lib/mpesa';

const LOG = '[ADMIN PAYOUT]';

function formatPhoneNumber(phone: string) {
  return phone
    .replace(/\s+/g, '')
    .replace('+', '')
    .replace(/^0/, '254');
}

export async function POST(req: NextRequest) {
  const requestId = `PAYREQ-${Date.now()}`;
  console.log(`${LOG} ${requestId} Incoming payout request`);

  try {
    await connectToDatabase();

    // Auth
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { marketerId, amount, phoneNumber, remarks } = body;

    if (!marketerId) {
      return NextResponse.json(
        { error: 'marketerId is required' },
        { status: 400 }
      );
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Load marketer — must be a marketer role
    const marketer = await User.findOne({
      _id: marketerId,
      role: 'marketer',
    });
    if (!marketer) {
      return NextResponse.json(
        { error: 'Marketer not found' },
        { status: 404 }
      );
    }

    // Compute owed = totalCommissions - already disbursed (pending/processing/completed)
    const agg = await MarketerWithdrawal.aggregate([
      {
        $match: {
          marketerId: marketer._id,
          status: { $in: ['pending', 'processing', 'completed'] },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const disbursed = Number(agg[0]?.total || 0);
    const owed = Math.max(
      0,
      Number(marketer.totalCommissions || 0) - disbursed
    );

    if (amount > owed) {
      return NextResponse.json(
        {
          error: 'Amount exceeds marketer owed balance',
          owed,
          requested: amount,
        },
        { status: 400 }
      );
    }

    const reference = `MPAY-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    const payoutPhone =
      phoneNumber ||
      marketer.payoutDetails?.phoneNumber ||
      marketer.phoneNumber;

    if (!payoutPhone) {
      return NextResponse.json(
        { error: 'Phone number required for payout' },
        { status: 400 }
      );
    }

    // Create record
    const withdrawal = await MarketerWithdrawal.create({
      marketerId: marketer._id,
      organizationId: marketer.organizationId,
      amount,
      method: 'MPESA',
      status: 'pending',
      reference,
      phoneNumber: formatPhoneNumber(payoutPhone),
      remarks: remarks || undefined,
      processedBy: decoded.userId,
    });

    console.log(`${LOG} ${requestId} Withdrawal created`, withdrawal._id);

    // Call B2C
    try {
      const result = await processB2CPayment(
        formatPhoneNumber(payoutPhone),
        amount,
        'BusinessPayment',
        `Marketer payout - ${marketer.name}`,
        `Payout ${reference}`
      );

      withdrawal.transactionId =
        result.ConversationID || result.conversationID;
      withdrawal.status = 'processing';
      await withdrawal.save();

      console.log(`${LOG} ${requestId} B2C initiated`, {
        transactionId: withdrawal.transactionId,
      });

      return NextResponse.json({
        success: true,
        message: 'Payout initiated successfully',
        withdrawal,
        transactionId: withdrawal.transactionId,
      });
    } catch (error: any) {
      console.error(`${LOG} ${requestId} B2C failed`, error.message);

      withdrawal.status = 'failed';
      withdrawal.errorMessage = error.message || 'B2C payment failed';
      await withdrawal.save();

      return NextResponse.json(
        { error: 'Failed to process payout', details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error(`${LOG} ${requestId} Fatal error`, error.message);
    return NextResponse.json(
      { error: 'Failed to process payout', details: error.message },
      { status: 500 }
    );
  }
}