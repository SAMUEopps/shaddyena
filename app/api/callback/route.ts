/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import User from '@/models/user';

import { decodeRef, generateOrderId } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log('🔔 Incoming M-Pesa Callback:', JSON.stringify(body, null, 2));

    /************************************************************
     * 1️⃣ HANDLE STK PUSH CALLBACK
     ************************************************************
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
     ************************************************************
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

      const referralLedgerEntries = [];

      for (const vendor of draft.vendorSplits) {
        const vendorUser = await User.findById(vendor.vendorId);

        if (!vendorUser?.referredBy) continue;

        const referralAmount = vendor.amount * 0.005; // 0.5%

        referralLedgerEntries.push({
          type: 'REFERRAL_COMMISSION',
          referrerId: vendorUser.referredBy,
          referredVendorId: vendorUser._id,
          orderId,
          draftToken: draft.token,
          amount: referralAmount,
          status: 'PENDING',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
      }


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

      if (referralLedgerEntries.length > 0) {
        await Ledger.insertMany(referralLedgerEntries);
      }


      // Mark draft
      draft.status = 'CONFIRMED';
      draft.mpesaTransactionId = mpesaReceiptNumber;
      await draft.save();

      console.log(`✅ ORDER CONFIRMED — ${orderId}`);

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    /************************************************************
     * 3️⃣ UNKNOWN PAYLOAD
     ************************************************************
    console.log('⚠️ Unknown M-Pesa callback type');
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Unknown payload' });

  } catch (error) {
    console.error('❌ CALLBACK ERROR:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}*/



import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import User from '@/models/user';
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

      // Decode reference
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

      /************************************************************
       * 3️⃣ PREPARE LEDGER ENTRIES
       ************************************************************/
      const referralLedgerEntries: any[] = [];

      for (const vendor of draft.vendorSplits) {
        const vendorUser = await User.findById(vendor.vendorId);
        if (!vendorUser?.referredBy) continue;

        const referralAmount = vendor.amount * 0.005; // 0.5%
        referralLedgerEntries.push({
          type: 'REFERRAL_COMMISSION',
          referrerId: vendorUser.referredBy,
          referredVendorId: vendorUser._id,
          orderId,
          draftToken: draft.token,
          amount: referralAmount,
          status: 'PENDING',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
      }

      const vendorLedgerEntries = draft.vendorSplits.map((vendor: any) => ({
        type: 'VENDOR_PAYOUT',
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        orderId,
        draftToken: draft.token,
        amount: vendor.amount,
        commission: vendor.commission,
        netAmount: vendor.netAmount,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }));

      // Combine all ledger entries and filter out invalid entries
      const allLedgerEntries = [...vendorLedgerEntries, ...referralLedgerEntries]
        .filter(e => e.type && e.amount && e.orderId);

      if (allLedgerEntries.length > 0) {
        await Ledger.insertMany(allLedgerEntries);
        console.log(`📗 Ledger entries inserted: ${allLedgerEntries.length}`);
      } else {
        console.log('⚠️ No ledger entries to insert for this order.');
      }

      // Mark draft as confirmed
      draft.status = 'CONFIRMED';
      draft.mpesaTransactionId = mpesaReceiptNumber;
      await draft.save();

      console.log(`✅ ORDER CONFIRMED — ${orderId}`);

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    /************************************************************
     * 4️⃣ UNKNOWN PAYLOAD
     ************************************************************/
    console.log('⚠️ Unknown M-Pesa callback type');
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Unknown payload' });

  } catch (error: any) {
    console.error('❌ CALLBACK ERROR:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
