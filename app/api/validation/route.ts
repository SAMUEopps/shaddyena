//validation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import { decodeRef } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const accountNumber = body.AccountNumber || body.BillRefNumber;
    const amount = Math.round(Number(body.Amount));

    if (!accountNumber) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account number' });
    }

    // Decode and validate reference
    const decoded = decodeRef(accountNumber);
    if (!decoded.ok) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }

    // Find order draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }

    // Check if draft has expired
    if (draft.expiresAt < new Date()) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference expired' });
    }

    // Check if amount matches
    if (amount !== draft.totalAmount) {
      return NextResponse.json({ 
        ResultCode: 1, 
        ResultDesc: `Amount mismatch. Expected ${draft.totalAmount}` 
      });
    }

    // Update draft status
    draft.status = 'VALIDATED';
    await draft.save();

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}