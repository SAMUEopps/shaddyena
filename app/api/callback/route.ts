/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import { decodeRef, generateOrderId } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    console.log('M-Pesa callback URL:', req.url);

    const body = await req.json();
    console.log('M-Pesa C2B callback received:', JSON.stringify(body, null, 2));

    // Check if it’s a valid C2B Paybill payload
    if (!body.TransID || !body.BillRefNumber) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid C2B payload' });
    }

    // Extract payment details
    const amount = parseFloat(body.TransAmount);
    const mpesaReceiptNumber = body.TransID;
    const transactionDate = body.TransTime;
    const phoneNumber = body.MSISDN;
    const accountReference = body.BillRefNumber;

    // Decode and validate reference
    const decoded = decodeRef(accountReference);
    if (!decoded.ok) {
      console.error('Invalid account reference:', accountReference);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }

    // Find order draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error('Draft not found for reference:', accountReference);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }

    // Check if already processed
    if (draft.status === 'CONFIRMED') {
      console.log('Draft already confirmed:', draft.token);
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' });
    }

    // Validate amount
    if (amount !== draft.totalAmount) {
      draft.status = 'FAILED';
      await draft.save();
      console.error(`Amount mismatch: expected ${draft.totalAmount}, got ${amount}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Amount mismatch' });
    }

    // Update product stock
    for (const item of draft.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Create order
    const orderId = generateOrderId();
    const order = new Order({
      orderId,
      draftToken: draft.token,
      buyerId: draft.buyerId,
      items: draft.items,
      suborders: draft.vendorSplits.map((vendor: any) => ({
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        items: draft.items.filter((item: any) => item.vendorId === vendor.vendorId),
        amount: vendor.amount,
        commission: vendor.commission,
        netAmount: vendor.netAmount,
        status: 'PENDING'
      })),
      totalAmount: draft.totalAmount,
      platformFee: draft.vendorSplits.reduce((sum: number, v: any) => sum + v.commission, 0),
      currency: draft.currency,
      paymentMethod: 'M-PESA',
      paymentStatus: 'PAID',
      shipping: draft.shipping,
      status: 'PENDING',
      mpesaTransactionId: mpesaReceiptNumber
    });

    await order.save();

    // Create ledger entries
    const ledgerEntries = draft.vendorSplits.map((vendor: any) => ({
      vendorId: vendor.vendorId,
      shopId: vendor.shopId,
      orderId: orderId,
      draftToken: draft.token,
      amount: vendor.amount,
      commission: vendor.commission,
      netAmount: vendor.netAmount,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // payout scheduled for 24h later
    }));

    await Ledger.insertMany(ledgerEntries);

    // Update draft
    draft.status = 'CONFIRMED';
    draft.mpesaTransactionId = mpesaReceiptNumber;
    await draft.save();

    console.log(`✅ Order ${orderId} confirmed successfully from C2B`);

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('❌ Callback processing error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}*/


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import { decodeRef, generateOrderId } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log('🔔 Incoming M-Pesa Callback:', JSON.stringify(body, null, 2));

    /************************************************************
     * 1️⃣ HANDLE STK PUSH CALLBACK
     ************************************************************/
    if (body?.Body?.stkCallback) {
      const stk = body.Body.stkCallback;
      console.log('📲 STK Callback Received:', {
        MerchantRequestID: stk.MerchantRequestID,
        CheckoutRequestID: stk.CheckoutRequestID,
        ResultCode: stk.ResultCode,
        ResultDesc: stk.ResultDesc,
      });

      // If ResultCode !== 0, payment failed or cancelled
      if (stk.ResultCode !== 0) {
        console.log('❌ STK Payment Failed:', stk.ResultDesc);
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'STK logged' });
      }

      console.log('✅ STK Payment Success BUT NOT C2B — waiting for Paybill callback');
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'STK logged' });
    }

    /************************************************************
     * 2️⃣ HANDLE C2B (PAYBILL) PAYMENT CALLBACK
     ************************************************************/
    if (body.TransID && body.BillRefNumber) {
      console.log('💰 C2B Payment Callback Received');

      const amount = parseFloat(body.TransAmount);
      const mpesaReceiptNumber = body.TransID;
      const transactionDate = body.TransTime;
      const phoneNumber = body.MSISDN;
      const accountReference = body.BillRefNumber;

      console.log('📌 C2B Payment Details:', {
        amount,
        mpesaReceiptNumber,
        transactionDate,
        phoneNumber,
        accountReference,
      });

      // Decode your reference
      const decoded = decodeRef(accountReference);
      if (!decoded.ok) {
        console.error('❌ Invalid reference:', accountReference);
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
      }

      // Find draft
      const draft = await OrderDraft.findOne({ token: decoded.token });
      if (!draft) {
        console.error('❌ Draft not found for:', accountReference);
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Draft not found' });
      }

      // Avoid double processing
      if (draft.status === 'CONFIRMED') {
        console.log('⚠️ Draft already confirmed.');
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' });
      }

      // Amount mismatch
      if (amount !== draft.totalAmount) {
        draft.status = 'FAILED';
        await draft.save();
        console.error('❌ Amount mismatch!');
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Amount mismatch' });
      }

      // Update stock
      for (const item of draft.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      // Create order
      const orderId = generateOrderId();
      const order = new Order({
        orderId,
        draftToken: draft.token,
        buyerId: draft.buyerId,
        items: draft.items,
        suborders: draft.vendorSplits.map((vendor: any) => ({
          vendorId: vendor.vendorId,
          shopId: vendor.shopId,
          items: draft.items.filter((i: any) => i.vendorId === vendor.vendorId),
          amount: vendor.amount,
          commission: vendor.commission,
          netAmount: vendor.netAmount,
          status: 'PENDING',
        })),
        totalAmount: draft.totalAmount,
        platformFee: draft.vendorSplits.reduce(
          (sum: number, v: any) => sum + v.commission,
          0
        ),
        currency: draft.currency,
        paymentMethod: 'M-PESA',
        paymentStatus: 'PAID',
        shipping: draft.shipping,
        status: 'PENDING',
        mpesaTransactionId: mpesaReceiptNumber,
      });

      await order.save();

      // Insert ledger entries
      const ledgerEntries = draft.vendorSplits.map((vendor: any) => ({
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        orderId,
        draftToken: draft.token,
        amount: vendor.amount,
        commission: vendor.commission,
        netAmount: vendor.netAmount,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }));

      await Ledger.insertMany(ledgerEntries);

      // Mark draft
      draft.status = 'CONFIRMED';
      draft.mpesaTransactionId = mpesaReceiptNumber;
      await draft.save();

      console.log(`✅ ORDER CONFIRMED — ${orderId}`);

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    /************************************************************
     * 3️⃣ UNKNOWN PAYLOAD
     ************************************************************/
    console.log('⚠️ Unknown M-Pesa callback type');
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Unknown payload' });

  } catch (error) {
    console.error('❌ CALLBACK ERROR:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
