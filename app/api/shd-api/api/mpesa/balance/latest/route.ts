import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Balance from '@/shd-models/models/Balance';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    
    // Get the latest successful balance
    const latestBalance = await Balance.findOne(
      { 
        shortcode,
        resultCode: '0'
      },
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
        lastUpdated: latestBalance.updatedAt,
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