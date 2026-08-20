import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';
import TransactionLog from '@/shd-models/models/TransactionLog';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    console.log('=== BALANCE RESULT WEBHOOK ===');
    console.log('Received balance result:', JSON.stringify(body, null, 2));
    
    // Parse the balance from the response
    let balanceData = null;
    let accountBalance = null;
    let resultCode = body.ResultCode;
    let resultDesc = body.ResultDesc;
    let conversationID = body.ConversationID;
    let originatorConversationID = body.OriginatorConversationID;
    let transactionID = body.TransactionID;
    
    if (body.ResultParameters && body.ResultParameters.ResultParameter) {
      const params = body.ResultParameters.ResultParameter;
      
      // Find the balance parameter
      if (Array.isArray(params)) {
        const balanceParam = params.find((p: any) => p.Key === 'AccountBalance');
        if (balanceParam) {
          balanceData = balanceParam.Value;
          
          // Try to parse the balance - format is usually "Working Account|Amount|Currency"
          if (balanceData) {
            const parts = balanceData.split('|');
            if (parts.length >= 2) {
              accountBalance = {
                accountName: parts[0] || 'Working Account',
                amount: parseFloat(parts[1]) || 0,
                currency: parts[2] || 'KES',
                fullBalance: balanceData,
              };
            }
          }
        }
      }
    }
    
    console.log('Parsed Balance:', accountBalance);
    
    // Update transaction log
    if (conversationID) {
      await TransactionLog.findOneAndUpdate(
        { conversationID },
        {
          webhookPayload: body,
          status: resultCode === '0' ? 'SUCCESS' : 'FAILED',
          resultCode,
          resultDesc,
          transactionID,
          timestamp: new Date(),
        }
      );
    }
    
    // Store the balance in MongoDB
    if (accountBalance && resultCode === '0') {
      await Balance.create({
        shortcode: body.PartyA || process.env.MPESA_SHORTCODE || '174379',
        accountName: accountBalance.accountName,
        balance: accountBalance.amount,
        currency: accountBalance.currency,
        fullBalance: accountBalance.fullBalance,
        resultCode,
        resultDesc,
        conversationID,
        originatorConversationID,
        transactionID,
        timestamp: new Date(),
      });
      
      console.log('Balance stored successfully:', accountBalance);
    } else {
      console.log('Balance query failed or no balance data:', { resultCode, resultDesc });
      
      // Store failed balance attempt
      await Balance.create({
        shortcode: body.PartyA || process.env.MPESA_SHORTCODE || '174379',
        accountName: 'Unknown',
        balance: 0,
        currency: 'KES',
        fullBalance: balanceData || 'No balance data',
        resultCode,
        resultDesc,
        conversationID,
        originatorConversationID,
        transactionID,
        timestamp: new Date(),
      });
    }
    
    // Acknowledge receipt
    return NextResponse.json({
      success: true,
      message: 'Balance result processed',
    });
    
  } catch (error) {
    console.error('Balance result webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process balance result' },
      { status: 500 }
    );
  }
}