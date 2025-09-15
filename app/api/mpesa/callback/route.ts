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
      const accountReferenceItem = callbackMetadata.Item.find((item: { Name: string; }) => item.Name === 'AccountReference');
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
        suborders: draft.vendorSplits.map((vendor: { vendorId: any; shopId: any; amount: any; commission: any; netAmount: any; }) => ({
          vendorId: vendor.vendorId,
          shopId: vendor.shopId,
          items: draft.items.filter((item: { vendorId: any; }) => item.vendorId === vendor.vendorId),
          amount: vendor.amount,
          commission: vendor.commission,
          netAmount: vendor.netAmount,
          status: 'PENDING'
        })),
        totalAmount: draft.totalAmount,
        platformFee: draft.vendorSplits.reduce((sum: any, vendor: { commission: any; }) => sum + vendor.commission, 0),
        currency: draft.currency,
        paymentMethod: 'M-PESA',
        paymentStatus: 'PAID',
        shipping: draft.shipping,
        status: 'PENDING',
        mpesaTransactionId: mpesaReceiptNumber
      });

      await order.save();

      // Create ledger entries for vendor payouts
      const ledgerEntries = draft.vendorSplits.map((vendor: { vendorId: any; shopId: any; amount: any; commission: any; netAmount: any; }) => ({
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
    console.log('[INFO] C2B Callback hit ✅');

    await dbConnect();
    console.log('[SUCCESS] Database connected');

    const body = await req.json();
    console.log('[INFO] M-Pesa C2B callback payload:', JSON.stringify(body, null, 2));

    // --- Manual C2B (Paybill/Till) Payload ---
    const {
      TransAmount,
      TransID,
      BillRefNumber,
      MSISDN,
      FirstName,
      MiddleName,
      LastName
    } = body;

    if (!BillRefNumber || !TransID) {
      console.error('[FAILURE] Missing BillRefNumber or TransID');
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing BillRefNumber or TransID' });
    }

    // Decode account reference
    const decoded = decodeRef(BillRefNumber);
    if (!decoded.ok) {
      console.error('[FAILURE] Invalid reference:', BillRefNumber);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }
    console.log('[SUCCESS] Decoded order reference:', decoded.token);

    // Find draft order
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error('[FAILURE] Draft not found for token:', decoded.token);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }
    console.log('[SUCCESS] Draft found for token:', decoded.token);

    // Idempotency check
    if (draft.status === 'CONFIRMED') {
      console.log('[INFO] Draft already confirmed. Skipping duplicate.');
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' });
    }

    // Validate amount
    const paidAmount = parseFloat(TransAmount);
    if (paidAmount !== draft.totalAmount) {
      draft.status = 'FAILED';
      await draft.save();
      console.error(`[FAILURE] Amount mismatch: expected ${draft.totalAmount}, got ${paidAmount}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Amount mismatch' });
    }
    console.log('[SUCCESS] Payment amount validated:', paidAmount);

    // Deduct stock
    for (const item of draft.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
      console.log(`[INFO] Stock updated for product ${item.productId}, -${item.quantity}`);
    }

    // Create main order
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
      mpesaTransactionId: TransID,
      payer: {
        phone: MSISDN,
        name: [FirstName, MiddleName, LastName].filter(Boolean).join(' ')
      },
      paidAt: new Date()
    });

    await order.save();
    console.log('[SUCCESS] Order created with ID:', orderId);

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
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }));

    await Ledger.insertMany(ledgerEntries);
    console.log('[SUCCESS] Ledger entries created for vendors');

    // Update draft status
    draft.status = 'CONFIRMED';
    draft.mpesaTransactionId = TransID;
    await draft.save();
    console.log(`[SUCCESS] Draft ${draft.token} updated to CONFIRMED`);

    console.log(`✅ Order ${orderId} confirmed successfully for draft ${draft.token}`);

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('[FAILURE] C2B callback processing error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
