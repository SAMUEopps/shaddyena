// app/api/shd-api/api/vendors/withdraw/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Vendor from '@/shd-models/models/Vendor';

import { processB2CPayment } from '@/shd-lib/lib/mpesa';
import { NextRequest, NextResponse } from 'next/server';
import Withdrawal from '@/shd-models/models/Withdrawal';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, method, phoneNumber, bankDetails } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Find vendor
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Check balance
    if (amount > vendor.availableBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create withdrawal record
    const withdrawal = await Withdrawal.create({
      vendorId: vendor._id,
      amount,
      method,
      phoneNumber: method === 'MPESA' ? phoneNumber : undefined,
      bankDetails: method === 'BANK' ? bankDetails : undefined,
      status: 'pending',
      reference: `WTH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      createdAt: new Date()
    });

    // If MPESA, initiate payout
    if (method === 'MPESA' && phoneNumber) {
      try {
        const result = await processB2CPayment(
          phoneNumber,
          amount,
          'BusinessPayment',
          `Vendor payout - ${vendor.businessName}`
        );

        // Update withdrawal with transaction ID
        withdrawal.transactionId = result.ConversationID;
        withdrawal.status = 'processing';
        await withdrawal.save();

        // Deduct from vendor balance
        vendor.availableBalance -= amount;
        vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) + amount;
        await vendor.save();

        return NextResponse.json({
          success: true,
          message: 'Withdrawal initiated successfully',
          withdrawal,
          newBalance: vendor.availableBalance
        });
      } catch (error) {
        console.error('B2C payment error:', error);
        withdrawal.status = 'failed';
        withdrawal.errorMessage = error instanceof Error ? error.message : 'Payment failed';
        await withdrawal.save();
        return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
      }
    }

    // For BANK, just create pending withdrawal
    await withdrawal.save();
    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted for processing',
      withdrawal
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}