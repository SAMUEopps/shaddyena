import { NextRequest, NextResponse } from 'next/server';
import { checkTransactionStatus } from '@/lib/mpesaUtils';

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestID } = await req.json();
    
    if (!checkoutRequestID) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing checkout request ID' });
    }

    const status = await checkTransactionStatus(checkoutRequestID);
    return NextResponse.json(status);

  } catch (error: any) {
    console.error('Error checking transaction status:', error);
    return NextResponse.json({ 
      ResultCode: 1, 
      ResultDesc: error.message || 'Failed to check transaction status' 
    });
  }
}