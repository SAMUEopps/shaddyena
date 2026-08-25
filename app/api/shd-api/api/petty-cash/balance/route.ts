// app/api/petty-cash/balance/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';

// TEMPORARY TEST USER
const TEST_USER_ID = '6a648fb076014722ae88bac6';

// GET - Fetch petty cash balance for the test user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    console.log(
      'Fetching petty cash balance for test user:',
      TEST_USER_ID
    );

    // ---------------------------------------------------------
    // Get all successful petty cash transactions
    // ---------------------------------------------------------

    const transactions = await Transaction.find({
      userId: TEST_USER_ID,

      type: {
        $in: [
          'petty_cash_deposit',
          'petty_cash_payout'
        ]
      },

      status: 'success'
    })
      .sort({ createdAt: -1 })
      .lean();

    // ---------------------------------------------------------
    // Calculate totals
    // ---------------------------------------------------------

    let totalDeposits = 0;
    let totalPayouts = 0;

    for (const transaction of transactions) {
      const amount = Number(transaction.amount || 0);

      if (transaction.type === 'petty_cash_deposit') {
        totalDeposits += amount;
      }

      if (transaction.type === 'petty_cash_payout') {
        totalPayouts += amount;
      }
    }

    // ---------------------------------------------------------
    // Calculate balance
    // ---------------------------------------------------------

    const balance = totalDeposits - totalPayouts;

    // ---------------------------------------------------------
    // Return response
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: {
        balance: Number(balance.toFixed(2)),

        totalDeposits: Number(
          totalDeposits.toFixed(2)
        ),

        totalPayouts: Number(
          totalPayouts.toFixed(2)
        ),

        currency: 'KES',

        transactionCount: transactions.length
      }
    });

  } catch (error: any) {
    console.error(
      'Error fetching petty cash balance:',
      error
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