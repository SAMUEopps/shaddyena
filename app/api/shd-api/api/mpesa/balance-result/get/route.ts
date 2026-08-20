import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    
    // Get the latest balance for this shortcode
    const latestBalance = await Balance.findOne(
      { shortcode },
      {},
      { sort: { timestamp: -1 } }
    );
    
    if (latestBalance) {
      return NextResponse.json({
        success: true,
        balance: {
          accountName: latestBalance.accountName,
          amount: latestBalance.balance,
          currency: latestBalance.currency,
          fullBalance: latestBalance.fullBalance,
        },
        timestamp: latestBalance.timestamp,
        resultCode: latestBalance.resultCode,
        resultDesc: latestBalance.resultDesc,
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          balance: null, 
          message: 'No balance data available' 
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error retrieving balance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve balance' },
      { status: 500 }
    );
  }
}