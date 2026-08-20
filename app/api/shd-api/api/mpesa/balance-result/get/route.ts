// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Balance from '@/shd-models/models/Balance';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     await connectToDatabase();
    
//     const shortcode = process.env.MPESA_SHORTCODE || '174379';
    
//     // Get the latest balance for this shortcode
//     const latestBalance = await Balance.findOne(
//       { shortcode },
//       {},
//       { sort: { timestamp: -1 } }
//     );
    
//     if (latestBalance) {
//       return NextResponse.json({
//         success: true,
//         balance: {
//           accountName: latestBalance.accountName,
//           amount: latestBalance.balance,
//           currency: latestBalance.currency,
//           fullBalance: latestBalance.fullBalance,
//         },
//         timestamp: latestBalance.timestamp,
//         resultCode: latestBalance.resultCode,
//         resultDesc: latestBalance.resultDesc,
//       });
//     } else {
//       return NextResponse.json(
//         { 
//           success: false,
//           balance: null, 
//           message: 'No balance data available' 
//         },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error('Error retrieving balance:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to retrieve balance' },
//       { status: 500 }
//     );
//   }
// }

import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';
import { NextResponse } from 'next/server';

interface BalanceAccount {
  accountName: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  unclearedBalance: number;
  reservedBalance: number;
}

interface BalanceDocument {
  _id: unknown;
  shortcode: string;
  accountName: string;
  balance: number;
  currency: string;
  fullBalance: BalanceAccount[];
  resultCode: string;
  resultDesc: string;
  timestamp: Date;
}

export async function GET() {
  try {
    await connectToDatabase();

    const shortcode =
      process.env.MPESA_SHORTCODE || '174379';

    /*
     * Explicitly type the query result.
     *
     * This prevents TypeScript from incorrectly treating
     * the result as an array.
     */
    const latestBalance =
      (await Balance.findOne({
        shortcode,
        resultCode: '0',
      })
        .sort({ timestamp: -1 })
        .lean()
        .exec()) as BalanceDocument | null;

    if (!latestBalance) {
      return NextResponse.json(
        {
          success: false,
          balance: null,
          accounts: [],
          message: 'No balance data available',
        },
        { status: 404 }
      );
    }

    /*
     * Safaricom returned all the individual accounts
     * inside fullBalance.
     */
    const accounts: BalanceAccount[] =
      Array.isArray(latestBalance.fullBalance)
        ? latestBalance.fullBalance.map(
            (account) => ({
              accountName:
                account.accountName,

              currency:
                account.currency || 'KES',

              availableBalance:
                Number(
                  account.availableBalance
                ) || 0,

              currentBalance:
                Number(
                  account.currentBalance
                ) || 0,

              unclearedBalance:
                Number(
                  account.unclearedBalance
                ) || 0,

              reservedBalance:
                Number(
                  account.reservedBalance
                ) || 0,
            })
          )
        : [];

    /*
     * Calculate totals from all accounts.
     *
     * Working Account = 31
     * Utility Account = 209
     *
     * Total = 240
     */
    const totalAvailableBalance =
      accounts.reduce(
        (total, account) =>
          total +
          account.availableBalance,
        0
      );

    const totalCurrentBalance =
      accounts.reduce(
        (total, account) =>
          total +
          account.currentBalance,
        0
      );

    const totalUnclearedBalance =
      accounts.reduce(
        (total, account) =>
          total +
          account.unclearedBalance,
        0
      );

    const totalReservedBalance =
      accounts.reduce(
        (total, account) =>
          total +
          account.reservedBalance,
        0
      );

    const currency =
      latestBalance.currency || 'KES';

    console.log(
      '========================================'
    );

    console.log(
      'M-PESA BALANCE RESPONSE'
    );

    console.log({
      totalAvailableBalance,
      totalCurrentBalance,
      totalUnclearedBalance,
      totalReservedBalance,
      currency,
      accounts,
    });

    console.log(
      '========================================'
    );

    return NextResponse.json({
      success: true,

      /*
       * Main balance used by the frontend.
       */
      balance: {
        accountName: 'M-Pesa Total',

        currency,

        availableBalance:
          totalAvailableBalance,

        currentBalance:
          totalCurrentBalance,

        unclearedBalance:
          totalUnclearedBalance,

        reservedBalance:
          totalReservedBalance,
      },

      /*
       * Individual Safaricom accounts.
       */
      accounts,

      timestamp:
        latestBalance.timestamp,

      resultCode:
        String(
          latestBalance.resultCode
        ),

      resultDesc:
        latestBalance.resultDesc,
    });

  } catch (error) {
    console.error(
      'Error retrieving balance:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        balance: null,
        accounts: [],
        error:
          'Failed to retrieve balance',
      },
      {
        status: 500,
      }
    );
  }
}