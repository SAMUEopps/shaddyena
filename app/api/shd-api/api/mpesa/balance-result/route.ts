// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import Balance from '@/shd-models/models/Balance';
// // import TransactionLog from '@/shd-models/models/TransactionLog';
// // import { NextRequest, NextResponse } from 'next/server';


// // export async function POST(request: NextRequest) {
// //   try {
// //     await connectToDatabase();
    
// //     const body = await request.json();
    
// //     console.log('=== BALANCE RESULT WEBHOOK ===');
// //     console.log('Received balance result:', JSON.stringify(body, null, 2));
    
// //     // Parse the balance from the response
// //     let balanceData = null;
// //     let accountBalance = null;
// //     let resultCode = body.ResultCode;
// //     let resultDesc = body.ResultDesc;
// //     let conversationID = body.ConversationID;
// //     let originatorConversationID = body.OriginatorConversationID;
// //     let transactionID = body.TransactionID;
    
// //     if (body.ResultParameters && body.ResultParameters.ResultParameter) {
// //       const params = body.ResultParameters.ResultParameter;
      
// //       // Find the balance parameter
// //       if (Array.isArray(params)) {
// //         const balanceParam = params.find((p: any) => p.Key === 'AccountBalance');
// //         if (balanceParam) {
// //           balanceData = balanceParam.Value;
          
// //           // Try to parse the balance - format is usually "Working Account|Amount|Currency"
// //           if (balanceData) {
// //             const parts = balanceData.split('|');
// //             if (parts.length >= 2) {
// //               accountBalance = {
// //                 accountName: parts[0] || 'Working Account',
// //                 amount: parseFloat(parts[1]) || 0,
// //                 currency: parts[2] || 'KES',
// //                 fullBalance: balanceData,
// //               };
// //             }
// //           }
// //         }
// //       }
// //     }
    
// //     console.log('Parsed Balance:', accountBalance);
    
// //     // Update transaction log
// //     if (conversationID) {
// //       await TransactionLog.findOneAndUpdate(
// //         { conversationID },
// //         {
// //           webhookPayload: body,
// //           status: resultCode === '0' ? 'SUCCESS' : 'FAILED',
// //           resultCode,
// //           resultDesc,
// //           transactionID,
// //           timestamp: new Date(),
// //         }
// //       );
// //     }
    
// //     // Store the balance in MongoDB
// //     if (accountBalance && resultCode === '0') {
// //       await Balance.create({
// //         shortcode: body.PartyA || process.env.MPESA_SHORTCODE || '174379',
// //         accountName: accountBalance.accountName,
// //         balance: accountBalance.amount,
// //         currency: accountBalance.currency,
// //         fullBalance: accountBalance.fullBalance,
// //         resultCode,
// //         resultDesc,
// //         conversationID,
// //         originatorConversationID,
// //         transactionID,
// //         timestamp: new Date(),
// //       });
      
// //       console.log('Balance stored successfully:', accountBalance);
// //     } else {
// //       console.log('Balance query failed or no balance data:', { resultCode, resultDesc });
      
// //       // Store failed balance attempt
// //       await Balance.create({
// //         shortcode: body.PartyA || process.env.MPESA_SHORTCODE || '174379',
// //         accountName: 'Unknown',
// //         balance: 0,
// //         currency: 'KES',
// //         fullBalance: balanceData || 'No balance data',
// //         resultCode,
// //         resultDesc,
// //         conversationID,
// //         originatorConversationID,
// //         transactionID,
// //         timestamp: new Date(),
// //       });
// //     }
    
// //     // Acknowledge receipt
// //     return NextResponse.json({
// //       success: true,
// //       message: 'Balance result processed',
// //     });
    
// //   } catch (error) {
// //     console.error('Balance result webhook error:', error);
// //     return NextResponse.json(
// //       { success: false, error: 'Failed to process balance result' },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Balance from '@/shd-models/models/Balance';
// import TransactionLog from '@/shd-models/models/TransactionLog';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     await connectToDatabase();

//     const body = await request.json();

//     console.log('=== BALANCE RESULT WEBHOOK ===');
//     console.log(
//       'Received balance result:',
//       JSON.stringify(body, null, 2)
//     );

//     // Safaricom wraps the actual response inside Result
//     const result = body?.Result;

//     if (!result) {
//       console.error('Invalid balance callback: Result object missing');

//       return NextResponse.json({
//         success: false,
//         message: 'Invalid balance callback',
//       });
//     }

//     // Correct location of these values
//     const resultCode = Number(result.ResultCode);
//     const resultDesc = result.ResultDesc;

//     const conversationID = result.ConversationID;
//     const originatorConversationID =
//       result.OriginatorConversationID;

//     const transactionID = result.TransactionID;

//     // Get ResultParameters
//     const params =
//       result.ResultParameters?.ResultParameter || [];

//     // Find AccountBalance parameter
//     const balanceParam = Array.isArray(params)
//       ? params.find(
//           (param: any) => param.Key === 'AccountBalance'
//         )
//       : null;

//     let balanceData: string | null = null;

//     if (balanceParam) {
//       balanceData = String(balanceParam.Value);
//     }

//     console.log('Raw AccountBalance:', balanceData);

//     // Parse individual accounts
//     const accounts: Array<{
//       accountName: string;
//       currency: string;
//       availableBalance: number;
//       currentBalance: number;
//       unclearedBalance: number;
//       reservedBalance: number;
//     }> = [];

//     if (balanceData) {
//       const accountStrings = balanceData.split('&');

//       for (const accountString of accountStrings) {
//         const parts = accountString.split('|');

//         if (parts.length >= 4) {
//           const [
//             accountName,
//             currency,
//             availableBalance,
//             currentBalance,
//             unclearedBalance,
//             reservedBalance,
//           ] = parts;

//           accounts.push({
//             accountName: accountName || 'Unknown',
//             currency: currency || 'KES',
//             availableBalance: Number(availableBalance) || 0,
//             currentBalance: Number(currentBalance) || 0,
//             unclearedBalance: Number(unclearedBalance) || 0,
//             reservedBalance: Number(reservedBalance) || 0,
//           });
//         }
//       }
//     }

//     console.log(
//       'Parsed Accounts:',
//       JSON.stringify(accounts, null, 2)
//     );

//     // Calculate total current balance
//     const totalBalance = accounts.reduce(
//       (total, account) =>
//         total + account.currentBalance,
//       0
//     );

//     const currency =
//       accounts[0]?.currency || 'KES';

//     console.log('Total Balance:', totalBalance);
//     console.log('Currency:', currency);

//     // Update transaction log
//     if (conversationID) {
//       await TransactionLog.findOneAndUpdate(
//         { conversationID },
//         {
//           webhookPayload: body,
//           status:
//             resultCode === 0
//               ? 'SUCCESS'
//               : 'FAILED',
//           resultCode,
//           resultDesc,
//           transactionID,
//           timestamp: new Date(),
//         },
//         {
//           upsert: false,
//         }
//       );
//     }

//     // Store successful balance
//     if (resultCode === 0 && accounts.length > 0) {
//       await Balance.create({
//         shortcode:
//           process.env.MPESA_SHORTCODE || '174379',

//         accountName: 'M-Pesa Account',

//         balance: totalBalance,

//         currency,

//         // Store the full parsed account information
//         fullBalance: accounts,

//         resultCode,

//         resultDesc,

//         conversationID,

//         originatorConversationID,

//         transactionID,

//         timestamp: new Date(),
//       });

//       console.log(
//         `✅ Balance stored successfully: ${currency} ${totalBalance}`
//       );
//     } else {
//       console.log(
//         '❌ Balance query failed or no balance data:',
//         {
//           resultCode,
//           resultDesc,
//           accounts,
//         }
//       );

//       // Store failed result
//       await Balance.create({
//         shortcode:
//           process.env.MPESA_SHORTCODE || '174379',

//         accountName: 'Unknown',

//         balance: 0,

//         currency: 'KES',

//         fullBalance:
//           balanceData || 'No balance data',

//         resultCode,

//         resultDesc,

//         conversationID,

//         originatorConversationID,

//         transactionID,

//         timestamp: new Date(),
//       });
//     }

//     // Acknowledge Safaricom
//     return NextResponse.json({
//       success: true,
//       message: 'Balance result processed',
//       balance: totalBalance,
//       currency,
//       resultCode,
//     });

//   } catch (error) {
//     console.error(
//       'Balance result webhook error:',
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           'Failed to process balance result',
//       },
//       { status: 500 }
//     );
//   }
// }



import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';
import TransactionLog from '@/shd-models/models/TransactionLog';
import { NextRequest, NextResponse } from 'next/server';

interface ParsedAccount {
  accountName: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  unclearedBalance: number;
  reservedBalance: number;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    console.log('========================================');
    console.log('=== M-PESA BALANCE RESULT WEBHOOK ===');
    console.log('========================================');

    console.log(
      'FULL CALLBACK:',
      JSON.stringify(body, null, 2)
    );

    // -----------------------------------------------------
    // 1. Get Result object
    // -----------------------------------------------------

    const result = body?.Result;

    if (!result) {
      console.error(
        '❌ Result object missing from callback'
      );

      return NextResponse.json({
        success: false,
        message: 'Invalid balance callback: Result missing',
      });
    }

    console.log(
      'Result Code:',
      result.ResultCode
    );

    console.log(
      'Result Description:',
      result.ResultDesc
    );

    // -----------------------------------------------------
    // 2. Basic result information
    // -----------------------------------------------------

    const resultCode = Number(result.ResultCode);

    const resultDesc =
      String(result.ResultDesc || '');

    const conversationID =
      result.ConversationID;

    const originatorConversationID =
      result.OriginatorConversationID;

    const transactionID =
      result.TransactionID;

    // -----------------------------------------------------
    // 3. Extract ResultParameters
    //
    // Safaricom may return:
    //
    // ResultParameter: [...]
    //
    // OR
    //
    // ResultParameter: {...}
    // -----------------------------------------------------

    const rawParameters =
      result.ResultParameters?.ResultParameter;

    console.log(
      'Raw Result Parameters:',
      JSON.stringify(
        rawParameters,
        null,
        2
      )
    );

    let parameters: any[] = [];

    if (Array.isArray(rawParameters)) {
      parameters = rawParameters;
    } else if (
      rawParameters &&
      typeof rawParameters === 'object'
    ) {
      parameters = [rawParameters];
    }

    console.log(
      'Normalized Parameters:',
      JSON.stringify(
        parameters,
        null,
        2
      )
    );

    // -----------------------------------------------------
    // 4. Find AccountBalance parameter
    // -----------------------------------------------------

    const balanceParam = parameters.find(
      (param) =>
        String(param?.Key || '')
          .trim()
          .toLowerCase() ===
        'accountbalance'
    );

    if (!balanceParam) {
      console.error(
        '❌ AccountBalance parameter NOT FOUND'
      );

      console.error(
        'Available parameter keys:',
        parameters.map(
          (param) => param?.Key
        )
      );

      // Update transaction log if available
      if (conversationID) {
        await TransactionLog.findOneAndUpdate(
          { conversationID },
          {
            webhookPayload: body,
            status:
              resultCode === 0
                ? 'SUCCESS'
                : 'FAILED',
            resultCode,
            resultDesc,
            transactionID,
            timestamp: new Date(),
          },
          {
            upsert: false,
          }
        );
      }

      /*
       * IMPORTANT:
       *
       * Do NOT create a fake zero balance here.
       *
       * A successful M-PESA request with an unparsed
       * AccountBalance should not overwrite the last
       * known real balance with zero.
       */

      return NextResponse.json({
        success: true,
        message:
          'Balance result received but AccountBalance parameter was not found',
        resultCode,
      });
    }

    // -----------------------------------------------------
    // 5. Get raw AccountBalance value
    // -----------------------------------------------------

    let balanceData: string;

    if (
      balanceParam.Value === undefined ||
      balanceParam.Value === null
    ) {
      console.error(
        '❌ AccountBalance parameter has no Value'
      );

      return NextResponse.json({
        success: true,
        message:
          'AccountBalance parameter has no value',
        resultCode,
      });
    }

    /*
     * Normally this is a string.
     *
     * We still convert it safely to string in case the
     * provider/runtime gives us another primitive type.
     */

    balanceData =
      String(balanceParam.Value);

    // Decode HTML entities if they somehow appear
    balanceData = balanceData
      .replace(/&amp;/g, '&')
      .replace(/&#124;/g, '|');

    console.log(
      '========================================'
    );

    console.log(
      'RAW ACCOUNT BALANCE VALUE:'
    );

    console.log(balanceData);

    console.log(
      '========================================'
    );

    // -----------------------------------------------------
    // 6. Parse individual accounts
    // -----------------------------------------------------

    const accounts: ParsedAccount[] = [];

    /*
     * Expected format is approximately:
     *
     * Working Account|KES|1000.00|1000.00|0.00|0.00&
     * Float Account|KES|0.00|0.00|0.00|0.00&
     * Utility Account|KES|0.00|0.00|0.00|0.00
     */

    const accountStrings =
      balanceData
        .split('&')
        .map((item) => item.trim())
        .filter(Boolean);

    console.log(
      'Account strings:',
      accountStrings
    );

    for (
      const accountString of accountStrings
    ) {
      const parts = accountString
        .split('|')
        .map((part) => part.trim());

      console.log(
        'Parsing account:',
        parts
      );

      /*
       * We expect six fields:
       *
       * 0 = accountName
       * 1 = currency
       * 2 = availableBalance
       * 3 = currentBalance
       * 4 = unclearedBalance
       * 5 = reservedBalance
       */

      if (parts.length < 6) {
        console.warn(
          '⚠️ Skipping malformed account:',
          accountString
        );

        continue;
      }

      const [
        accountName,
        currency,
        availableBalanceRaw,
        currentBalanceRaw,
        unclearedBalanceRaw,
        reservedBalanceRaw,
      ] = parts;

      const availableBalance =
        Number(
          availableBalanceRaw
        );

      const currentBalance =
        Number(
          currentBalanceRaw
        );

      const unclearedBalance =
        Number(
          unclearedBalanceRaw
        );

      const reservedBalance =
        Number(
          reservedBalanceRaw
        );

      /*
       * Validate numeric values.
       */

      if (
        Number.isNaN(
          availableBalance
        ) ||
        Number.isNaN(
          currentBalance
        ) ||
        Number.isNaN(
          unclearedBalance
        ) ||
        Number.isNaN(
          reservedBalance
        )
      ) {
        console.warn(
          '⚠️ Invalid numeric balance:',
          accountString
        );

        continue;
      }

      accounts.push({
        accountName:
          accountName ||
          'Unknown Account',

        currency:
          currency ||
          'KES',

        availableBalance,

        currentBalance,

        unclearedBalance,

        reservedBalance,
      });
    }

    // -----------------------------------------------------
    // 7. Log parsed accounts
    // -----------------------------------------------------

    console.log(
      '========================================'
    );

    console.log(
      'PARSED ACCOUNTS:'
    );

    console.log(
      JSON.stringify(
        accounts,
        null,
        2
      )
    );

    console.log(
      '========================================'
    );

    // -----------------------------------------------------
    // 8. Make sure we actually parsed something
    // -----------------------------------------------------

    if (
      resultCode === 0 &&
      accounts.length === 0
    ) {
      console.error(
        '❌ M-PESA returned success but no accounts could be parsed'
      );

      console.error(
        'Raw AccountBalance:',
        balanceData
      );

      /*
       * Do NOT overwrite the latest valid balance
       * with zero.
       */

      if (conversationID) {
        await TransactionLog.findOneAndUpdate(
          { conversationID },
          {
            webhookPayload: body,
            status: 'SUCCESS',
            resultCode,
            resultDesc,
            transactionID,
            timestamp: new Date(),
          },
          {
            upsert: false,
          }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          'Balance callback received but account parsing failed',
        resultCode,
      });
    }

    // -----------------------------------------------------
    // 9. Calculate total current balance
    // -----------------------------------------------------

    const totalBalance =
      accounts.reduce(
        (total, account) =>
          total +
          account.currentBalance,
        0
      );

    /*
     * Use the first account's currency as the primary
     * currency.
     */

    const currency =
      accounts[0]?.currency ||
      'KES';

    console.log(
      'Total Current Balance:',
      totalBalance
    );

    console.log(
      'Primary Currency:',
      currency
    );

    // -----------------------------------------------------
    // 10. Update transaction log
    // -----------------------------------------------------

    if (conversationID) {
      await TransactionLog.findOneAndUpdate(
        { conversationID },
        {
          webhookPayload: body,
          status:
            resultCode === 0
              ? 'SUCCESS'
              : 'FAILED',
          resultCode,
          resultDesc,
          transactionID,
          timestamp: new Date(),
        },
        {
          upsert: false,
        }
      );
    }

    // -----------------------------------------------------
    // 11. Store successful balance
    // -----------------------------------------------------

    if (
      resultCode === 0 &&
      accounts.length > 0
    ) {
      const savedBalance =
        await Balance.create({
          shortcode:
            process.env.MPESA_SHORTCODE ||
            '174379',

          accountName:
            'M-Pesa Account',

          balance:
            totalBalance,

          currency,

          fullBalance:
            accounts,

          resultCode:
            String(resultCode),

          resultDesc,

          conversationID,

          originatorConversationID,

          transactionID,

          timestamp:
            new Date(),
        });

      console.log(
        '========================================'
      );

      console.log(
        '✅ BALANCE STORED SUCCESSFULLY'
      );

      console.log(
        'MongoDB ID:',
        savedBalance._id
      );

      console.log(
        'Total Balance:',
        `${currency} ${totalBalance}`
      );

      console.log(
        'Accounts:',
        accounts.length
      );

      console.log(
        '========================================'
      );
    }

    // -----------------------------------------------------
    // 12. Acknowledge Safaricom
    // -----------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        'Balance result processed successfully',

      balance:
        totalBalance,

      currency,

      resultCode,

      accounts,
    });

  } catch (error) {
    console.error(
      '========================================'
    );

    console.error(
      '❌ BALANCE RESULT WEBHOOK ERROR'
    );

    console.error(error);

    console.error(
      '========================================'
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to process balance result',
      },
      {
        status: 500,
      }
    );
  }
}
