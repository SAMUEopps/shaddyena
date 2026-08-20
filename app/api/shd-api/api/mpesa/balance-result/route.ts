// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Balance from '@/shd-models/models/Balance';
// import TransactionLog from '@/shd-models/models/TransactionLog';
// import { NextRequest, NextResponse } from 'next/server';


// export async function POST(request: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const body = await request.json();
    
//     console.log('=== BALANCE RESULT WEBHOOK ===');
//     console.log('Received balance result:', JSON.stringify(body, null, 2));
    
//     // Parse the balance from the response
//     let balanceData = null;
//     let accountBalance = null;
//     let resultCode = body.ResultCode;
//     let resultDesc = body.ResultDesc;
//     let conversationID = body.ConversationID;
//     let originatorConversationID = body.OriginatorConversationID;
//     let transactionID = body.TransactionID;
    
//     if (body.ResultParameters && body.ResultParameters.ResultParameter) {
//       const params = body.ResultParameters.ResultParameter;
      
//       // Find the balance parameter
//       if (Array.isArray(params)) {
//         const balanceParam = params.find((p: any) => p.Key === 'AccountBalance');
//         if (balanceParam) {
//           balanceData = balanceParam.Value;
          
//           // Try to parse the balance - format is usually "Working Account|Amount|Currency"
//           if (balanceData) {
//             const parts = balanceData.split('|');
//             if (parts.length >= 2) {
//               accountBalance = {
//                 accountName: parts[0] || 'Working Account',
//                 amount: parseFloat(parts[1]) || 0,
//                 currency: parts[2] || 'KES',
//                 fullBalance: balanceData,
//               };
//             }
//           }
//         }
//       }
//     }
    
//     console.log('Parsed Balance:', accountBalance);
    
//     // Update transaction log
//     if (conversationID) {
//       await TransactionLog.findOneAndUpdate(
//         { conversationID },
//         {
//           webhookPayload: body,
//           status: resultCode === '0' ? 'SUCCESS' : 'FAILED',
//           resultCode,
//           resultDesc,
//           transactionID,
//           timestamp: new Date(),
//         }
//       );
//     }
    
//     // Store the balance in MongoDB
//     if (accountBalance && resultCode === '0') {
//       await Balance.create({
//         shortcode: body.PartyA || process.env.MPESA_SHORTCODE || '174379',
//         accountName: accountBalance.accountName,
//         balance: accountBalance.amount,
//         currency: accountBalance.currency,
//         fullBalance: accountBalance.fullBalance,
//         resultCode,
//         resultDesc,
//         conversationID,
//         originatorConversationID,
//         transactionID,
//         timestamp: new Date(),
//       });
      
//       console.log('Balance stored successfully:', accountBalance);
//     } else {
//       console.log('Balance query failed or no balance data:', { resultCode, resultDesc });
      
//       // Store failed balance attempt
//       await Balance.create({
//         shortcode: body.PartyA || process.env.MPESA_SHORTCODE || '174379',
//         accountName: 'Unknown',
//         balance: 0,
//         currency: 'KES',
//         fullBalance: balanceData || 'No balance data',
//         resultCode,
//         resultDesc,
//         conversationID,
//         originatorConversationID,
//         transactionID,
//         timestamp: new Date(),
//       });
//     }
    
//     // Acknowledge receipt
//     return NextResponse.json({
//       success: true,
//       message: 'Balance result processed',
//     });
    
//   } catch (error) {
//     console.error('Balance result webhook error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to process balance result' },
//       { status: 500 }
//     );
//   }
// }


import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';
import TransactionLog from '@/shd-models/models/TransactionLog';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    console.log('=== BALANCE RESULT WEBHOOK ===');
    console.log(
      'Received balance result:',
      JSON.stringify(body, null, 2)
    );

    // Safaricom wraps the actual response inside Result
    const result = body?.Result;

    if (!result) {
      console.error('Invalid balance callback: Result object missing');

      return NextResponse.json({
        success: false,
        message: 'Invalid balance callback',
      });
    }

    // Correct location of these values
    const resultCode = Number(result.ResultCode);
    const resultDesc = result.ResultDesc;

    const conversationID = result.ConversationID;
    const originatorConversationID =
      result.OriginatorConversationID;

    const transactionID = result.TransactionID;

    // Get ResultParameters
    const params =
      result.ResultParameters?.ResultParameter || [];

    // Find AccountBalance parameter
    const balanceParam = Array.isArray(params)
      ? params.find(
          (param: any) => param.Key === 'AccountBalance'
        )
      : null;

    let balanceData: string | null = null;

    if (balanceParam) {
      balanceData = String(balanceParam.Value);
    }

    console.log('Raw AccountBalance:', balanceData);

    // Parse individual accounts
    const accounts: Array<{
      accountName: string;
      currency: string;
      availableBalance: number;
      currentBalance: number;
      unclearedBalance: number;
      reservedBalance: number;
    }> = [];

    if (balanceData) {
      const accountStrings = balanceData.split('&');

      for (const accountString of accountStrings) {
        const parts = accountString.split('|');

        if (parts.length >= 4) {
          const [
            accountName,
            currency,
            availableBalance,
            currentBalance,
            unclearedBalance,
            reservedBalance,
          ] = parts;

          accounts.push({
            accountName: accountName || 'Unknown',
            currency: currency || 'KES',
            availableBalance: Number(availableBalance) || 0,
            currentBalance: Number(currentBalance) || 0,
            unclearedBalance: Number(unclearedBalance) || 0,
            reservedBalance: Number(reservedBalance) || 0,
          });
        }
      }
    }

    console.log(
      'Parsed Accounts:',
      JSON.stringify(accounts, null, 2)
    );

    // Calculate total current balance
    const totalBalance = accounts.reduce(
      (total, account) =>
        total + account.currentBalance,
      0
    );

    const currency =
      accounts[0]?.currency || 'KES';

    console.log('Total Balance:', totalBalance);
    console.log('Currency:', currency);

    // Update transaction log
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

    // Store successful balance
    if (resultCode === 0 && accounts.length > 0) {
      await Balance.create({
        shortcode:
          process.env.MPESA_SHORTCODE || '174379',

        accountName: 'M-Pesa Account',

        balance: totalBalance,

        currency,

        // Store the full parsed account information
        fullBalance: accounts,

        resultCode,

        resultDesc,

        conversationID,

        originatorConversationID,

        transactionID,

        timestamp: new Date(),
      });

      console.log(
        `✅ Balance stored successfully: ${currency} ${totalBalance}`
      );
    } else {
      console.log(
        '❌ Balance query failed or no balance data:',
        {
          resultCode,
          resultDesc,
          accounts,
        }
      );

      // Store failed result
      await Balance.create({
        shortcode:
          process.env.MPESA_SHORTCODE || '174379',

        accountName: 'Unknown',

        balance: 0,

        currency: 'KES',

        fullBalance:
          balanceData || 'No balance data',

        resultCode,

        resultDesc,

        conversationID,

        originatorConversationID,

        transactionID,

        timestamp: new Date(),
      });
    }

    // Acknowledge Safaricom
    return NextResponse.json({
      success: true,
      message: 'Balance result processed',
      balance: totalBalance,
      currency,
      resultCode,
    });

  } catch (error) {
    console.error(
      'Balance result webhook error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to process balance result',
      },
      { status: 500 }
    );
  }
}