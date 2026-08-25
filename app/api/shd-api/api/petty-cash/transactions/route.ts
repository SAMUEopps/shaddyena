// app/api/petty-cash/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';

// TEMPORARY TEST USER
const TEST_USER_ID = '6a648fb076014722ae88bac6';

// GET - Fetch all petty cash transactions for the test user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    console.log(
      'Fetching petty cash transactions for test user:',
      TEST_USER_ID
    );

    const transactions = await Transaction.find({
      userId: TEST_USER_ID,
      type: {
        $in: [
          'petty_cash_deposit',
          'petty_cash_payout'
        ]
      }
    })
      .sort({ createdAt: -1 })
      .lean();

    // Transform transactions to include category and description
    const transformedTransactions = transactions.map(t => {
      let category = 'Other';
      let description = t.purpose || 'Transaction';
      
      if (t.type === 'petty_cash_deposit') {
        category = 'Fund';
        description = t.purpose || 'M-Pesa Deposit';
      } else if (t.type === 'petty_cash_payout') {
        category = t.metadata?.category || 'Expense';
        description = t.purpose || t.metadata?.description || 'Expense';
      }

      return {
        ...t,
        category,
        description,
        amount: t.type === 'petty_cash_deposit' ? t.amount : -t.amount,
        type: t.type === 'petty_cash_deposit' ? 'fund' : 'expense'
      };
    });

    return NextResponse.json({
      success: true,
      transactions: transformedTransactions,
      count: transformedTransactions.length
    });

  } catch (error: any) {
    console.error(
      'Error fetching petty cash transactions:',
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