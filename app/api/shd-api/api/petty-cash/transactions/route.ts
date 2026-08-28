// // app/api/petty-cash/transactions/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Transaction from '@/shd-models/models/Transaction';

// // TEMPORARY TEST USER
// const TEST_USER_ID = '6a648fb076014722ae88bac6';

// // GET - Fetch all petty cash transactions for the test user
// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     console.log(
//       'Fetching petty cash transactions for test user:',
//       TEST_USER_ID
//     );

//     const transactions = await Transaction.find({
//       userId: TEST_USER_ID,
//       type: {
//         $in: [
//           'petty_cash_deposit',
//           'petty_cash_payout'
//         ]
//       }
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     // Transform transactions to include category and description
//     const transformedTransactions = transactions.map(t => {
//       let category = 'Other';
//       let description = t.purpose || 'Transaction';
      
//       if (t.type === 'petty_cash_deposit') {
//         category = 'Fund';
//         description = t.purpose || 'M-Pesa Deposit';
//       } else if (t.type === 'petty_cash_payout') {
//         category = t.metadata?.category || 'Expense';
//         description = t.purpose || t.metadata?.description || 'Expense';
//       }

//       return {
//         ...t,
//         category,
//         description,
//         amount: t.type === 'petty_cash_deposit' ? t.amount : -t.amount,
//         type: t.type === 'petty_cash_deposit' ? 'fund' : 'expense'
//       };
//     });

//     return NextResponse.json({
//       success: true,
//       transactions: transformedTransactions,
//       count: transformedTransactions.length
//     });

//   } catch (error: any) {
//     console.error(
//       'Error fetching petty cash transactions:',
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


// app/api/petty-cash/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import mongoose from 'mongoose';

// TEMPORARY TEST USER
const TEST_USER_ID = '6a648fb076014722ae88bac6';
const TEST_ORG_ID = 'your-test-org-id-here'; // REPLACE WITH ACTUAL ORG ID

// GET - Fetch all petty cash transactions for the test user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    console.log('Fetching petty cash transactions for test user:', TEST_USER_ID);

    const transactions = await Transaction.find({
      organizationId: new mongoose.Types.ObjectId(TEST_ORG_ID),
      category: 'petty_cash',
      type: { $in: ['deposit', 'payout'] },
      $or: [
        { 'metadata.userId': TEST_USER_ID },
        { 'metadata.initiatedBy': TEST_USER_ID }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    // Transform transactions to include display category and description
    const transformedTransactions = transactions.map(t => {
      const metadata = t.metadata || {};
      let displayCategory = 'Other';
      let description = t.purpose || 'Transaction';

      if (t.type === 'deposit') {
        displayCategory = 'Fund';
        description = t.purpose || metadata.description || 'M-Pesa Deposit';
      } else if (t.type === 'payout') {
        displayCategory = metadata.category || 'Expense';
        description = t.purpose || metadata.description || 'Expense';
      }

      return {
        ...t,
        displayCategory,
        description,
        amount: t.type === 'deposit' ? t.amount : -(t.amount || 0),
        displayType: t.type === 'deposit' ? 'fund' : 'expense'
      };
    });

    return NextResponse.json({
      success: true,
      transactions: transformedTransactions,
      count: transformedTransactions.length
    });

  } catch (error: any) {
    console.error('Error fetching petty cash transactions:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}