/*import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[INFO] C2B request received:", body);

    const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

    // ---- Backend validation example ----
    const isValidAccount = true; // Check BillRefNumber in your DB
    const expectedAmount = 500;   // Optional: check amount

    if (!isValidAccount || TransAmount <= 0 || TransAmount !== expectedAmount) {
      console.warn("[WARN] Payment rejected:", body);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Rejected" });
    }

    // ---- Save payment to DB here ----
    console.log("[SUCCESS] Payment accepted:", body);

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("[ERROR] C2B webhook failed:", error.message);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}
*/

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

    // Log the full callback URL
    console.log('M-Pesa callback URL:', req.url);

    const body = await req.json();
    console.log('M-Pesa callback received:', JSON.stringify(body, null, 2));

    // Handle different callback types
    if (body.StkCallback) {
      // STK Push callback
      const callbackMetadata = body.StkCallback.CallbackMetadata;
      if (!callbackMetadata || !Array.isArray(callbackMetadata.Item)) {
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid callback format' });
      }

      // Extract payment details from callback
      let amount, mpesaReceiptNumber, transactionDate, phoneNumber;
      
      for (const item of callbackMetadata.Item) {
        switch (item.Name) {
          case 'Amount':
            amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            mpesaReceiptNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionDate = item.Value;
            break;
          case 'PhoneNumber':
            phoneNumber = item.Value;
            break;
        }
      }

      if (body.StkCallback.ResultCode !== 0) {
        console.error('Payment failed:', body.StkCallback.ResultDesc);
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Callback processed' });
      }

      // Find the account reference in the metadata
      const accountReferenceItem = callbackMetadata.Item.find((item: { Name: string }) => item.Name === 'AccountReference');
      if (!accountReferenceItem) {
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account reference' });
      }

      const accountReference = accountReferenceItem.Value;
      
      // Decode and validate reference
      const decoded = decodeRef(accountReference);
      if (!decoded.ok) {
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
      }

      // Find order draft
      const draft = await OrderDraft.findOne({ token: decoded.token });
      if (!draft) {
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
      }

      // Check if already processed (idempotency)
      if (draft.status === 'CONFIRMED') {
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' });
      }

      // Validate amount
      if (amount !== draft.totalAmount) {
        draft.status = 'FAILED';
        await draft.save();
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Amount mismatch' });
      }

      // Update product stock
      for (const item of draft.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      // Create main order
      const orderId = generateOrderId();
      const order = new Order({
        orderId,
        draftToken: draft.token,
        buyerId: draft.buyerId,
        items: draft.items,
        suborders: draft.vendorSplits.map((vendor: { vendorId: any; shopId: any; amount: any; commission: any; netAmount: any }) => ({
          vendorId: vendor.vendorId,
          shopId: vendor.shopId,
          items: draft.items.filter((item: { vendorId: any }) => item.vendorId === vendor.vendorId),
          amount: vendor.amount,
          commission: vendor.commission,
          netAmount: vendor.netAmount,
          status: 'PENDING'
        })),
        totalAmount: draft.totalAmount,
        platformFee: draft.vendorSplits.reduce((sum: any, vendor: { commission: any }) => sum + vendor.commission, 0),
        currency: draft.currency,
        paymentMethod: 'M-PESA',
        paymentStatus: 'PAID',
        shipping: draft.shipping,
        status: 'PENDING',
        mpesaTransactionId: mpesaReceiptNumber
      });

      await order.save();

      // Create ledger entries for vendor payouts
      const ledgerEntries = draft.vendorSplits.map((vendor: { vendorId: any; shopId: any; amount: any; commission: any; netAmount: any }) => ({
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        orderId: orderId,
        draftToken: draft.token,
        amount: vendor.amount,
        commission: vendor.commission,
        netAmount: vendor.netAmount,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Schedule for 24 hours later
      }));

      await Ledger.insertMany(ledgerEntries);

      // Update draft status
      draft.status = 'CONFIRMED';
      draft.mpesaTransactionId = mpesaReceiptNumber;
      await draft.save();

      // TODO: Send notifications to buyer and vendors
      console.log(`Order ${orderId} confirmed successfully`);

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Unsupported callback type' });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
*/

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

    console.log('M-Pesa callback URL!!!:', req.url);

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
}
