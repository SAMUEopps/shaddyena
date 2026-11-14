// app/api/shd-api/api/mpesa/b2c/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import MarketerWithdrawal from '@/shd-models/models/MarketerWithdrawal';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const result = body?.Result;
    if (!result) {
      return NextResponse.json({ ok: true });
    }

    const conversationId =
      result.ConversationID || result.ConversationID;
    const success = Number(result.ResultCode) === 0;
    const receipt = result.TransactionReceipt || undefined;
    const errorMessage =
      success
        ? undefined
        : result.ResultDesc || 'B2C payment failed';

    // Update the wallet transaction
    const txn = await Transaction.findOneAndUpdate(
      { providerTransactionId: conversationId, provider: 'mpesa' },
      {
        $set: {
          status: success ? 'success' : 'failed',
          receiptNumber: receipt,
          errorMessage,
          metadata: {
            // preserve existing keys
            // (findOneAndUpdate with $set on metadata replaces;
            //  use $mergeObjects or read-then-write if you need to preserve)
          },
        },
      },
      { new: true }
    );

    // Update the marketer withdrawal
    if (txn?.metadata?.marketerId) {
      await MarketerWithdrawal.findOneAndUpdate(
        { transactionId: conversationId },
        {
          $set: {
            status: success ? 'completed' : 'failed',
            errorMessage,
          },
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[B2C CALLBACK]', err);
    return NextResponse.json({ ok: true });
  }
}