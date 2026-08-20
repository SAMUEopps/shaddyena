import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import BalanceLog from '@/shd-models/models/BalanceLog';


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const callbackData = await request.json();
    console.log('=== ⏱️ BALANCE QUERY TIMEOUT ===');
    console.log('Timeout response:', JSON.stringify(callbackData, null, 2));
    
    // Update balance log if conversation ID exists
    if (callbackData.ConversationID) {
      await BalanceLog.findOneAndUpdate(
        { conversationID: callbackData.ConversationID },
        {
          status: 'TIMEOUT',
          resultDesc: 'Request timed out',
          timestamp: new Date(),
        }
      );
    }
    
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  } catch (error) {
    console.error('❌ Balance timeout webhook error:', error);
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  }
}