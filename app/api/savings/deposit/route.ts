// app/api/savings/deposit/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';
import SavingsTransaction from '@/models/SavingsTransaction';

async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

function generateReference(): string {
  return `DEP_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, paymentMethod = 'mpesa' } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ message: 'Minimum deposit is KES 100' }, { status: 400 });
    }

    const savingsAccount = await SavingsAccount.findOne({ userId });
    if (!savingsAccount) {
      return NextResponse.json({ message: 'Savings account not found' }, { status: 404 });
    }

    const reference = generateReference();

    // Create transaction record
    const transaction = await SavingsTransaction.create({
      userId,
      accountId: savingsAccount._id,
      amount,
      type: 'deposit',
      paymentMethod,
      reference,
      status: 'pending',
    });

    // Here you would integrate with M-Pesa STK Push
    // For now, we'll simulate a successful payment
    // In production, you'd call M-Pesa API and update status via webhook

    // Simulate successful payment
    transaction.status = 'completed';
    await transaction.save();

    // Update savings account
    savingsAccount.totalSaved += amount;
    savingsAccount.availableBalance += amount;
    await savingsAccount.save();

    return NextResponse.json({
      success: true,
      message: 'Deposit successful',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        reference: transaction.reference,
        status: transaction.status,
      },
      newBalance: savingsAccount.availableBalance,
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ message: error.message || 'Deposit failed' }, { status: 500 });
  }
}*/

// app/api/savings/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dbConnect from '@/lib/dbConnect';
import MembershipUser from '@/models/MembershipUser';
import SavingsAccount from '@/models/SavingsAccount';
import SavingsTransaction from '@/models/SavingsTransaction';

async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('membershipToken')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

function generateReference(): string {
  return `DEP_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, phoneNumber, paymentMethod = 'mpesa' } = body;

    // Validate input
    if (!amount || amount < 100) {
      return NextResponse.json({ message: 'Minimum deposit is KES 100' }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    // Format phone to 2547XXXXXXXX
    let sanitizedPhone = phoneNumber.replace(/^0/, '254').replace(/^\+/, '');
    
    // Validate phone number format
    if (!sanitizedPhone.match(/^254[17]\d{8}$/)) {
      return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
    }

    const savingsAccount = await SavingsAccount.findOne({ userId });
    if (!savingsAccount) {
      return NextResponse.json({ message: 'Savings account not found' }, { status: 404 });
    }

    const reference = generateReference();

    // Create transaction record (pending)
    const transaction = await SavingsTransaction.create({
      userId,
      accountId: savingsAccount._id,
      amount,
      type: 'deposit',
      paymentMethod,
      reference,
      status: 'pending',
      metadata: {
        phoneNumber: sanitizedPhone,
        stkRequest: null,
      },
    });

    try {
      // Generate OAuth token
      const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
      ).toString('base64');

      const tokenResponse = await axios.get(
        `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        { headers: { Authorization: `Basic ${auth}` } }
      );

      const access_token = tokenResponse.data.access_token;

      // Generate timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14);

      // Password for STK
      const password = Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString('base64');

      // Send STK push
      const stkResponse = await axios.post(
        `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: sanitizedPhone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: sanitizedPhone,
          CallBackURL: `${process.env.MPESA_CALLBACK_URL}/savings/deposit`,
          AccountReference: reference,
          TransactionDesc: 'Savings Deposit',
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ STK Push Response:', stkResponse.data);

      // Update transaction with STK request data
      transaction.metadata = {
        ...transaction.metadata,
        stkRequest: stkResponse.data,
        checkoutRequestID: stkResponse.data.CheckoutRequestID,
      };
      await transaction.save();

      return NextResponse.json({
        success: true,
        message: 'STK Push initiated. Check your phone to complete payment.',
        transaction: {
          id: transaction._id,
          amount: transaction.amount,
          reference: transaction.reference,
          status: transaction.status,
          checkoutRequestID: stkResponse.data.CheckoutRequestID,
        },
      });

    } catch (stkError: any) {
      console.error('STK Push Error:', stkError.response?.data || stkError.message);
      
      // Update transaction status to failed
      transaction.status = 'failed';
      transaction.metadata = {
        ...transaction.metadata,
        stkError: stkError.response?.data || stkError.message,
      };
      await transaction.save();

      return NextResponse.json(
        { 
          message: stkError.response?.data?.errorMessage || 'Payment initiation failed. Please try again.',
          transactionId: transaction._id,
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ message: error.message || 'Deposit failed' }, { status: 500 });
  }
}