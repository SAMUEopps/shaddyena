//confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import { decodeRef, generateOrderId, lookupShort } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const accountNumber = body.AccountNumber || body.BillRefNumber;
    const fullAccountNumber = lookupShort(accountNumber) || accountNumber;
    
    const amount = Math.round(Number(body.Amount));
    const mpesaTransactionId = body.TransactionID || body.MpesaReceiptNumber;

    if (!accountNumber) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account number' });
    }

    // Decode and validate reference
    //const decoded = decodeRef(accountNumber);
    const decoded = decodeRef(fullAccountNumber);
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
      mpesaTransactionId
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
    draft.mpesaTransactionId = mpesaTransactionId;
    await draft.save();

    // TODO: Send notifications to buyer and vendors

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Confirmation accepted' });

  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}