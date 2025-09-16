//confirmation/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
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
}*/

// confirmation/route.ts



/*import { NextRequest, NextResponse } from 'next/server';
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
    console.log("[CONFIRMATION] Incoming:", body);

    console.log("📩 [CONFIRMATION] Incoming payload:", JSON.stringify(body, null, 2));

    const accountNumber = body.AccountNumber || body.BillRefNumber;
    const fullAccountNumber = lookupShort(accountNumber) || accountNumber;

    const amount = Math.round(Number(body.Amount));
    const mpesaTransactionId = body.TransactionID || body.MpesaReceiptNumber;

    if (!accountNumber) {
      console.error("❌ [CONFIRMATION FAILED] Missing account number");
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account number' });
    }

    // Decode and validate reference
    const decoded = decodeRef(fullAccountNumber);
    if (!decoded.ok) {
      console.error(`❌ [CONFIRMATION FAILED] Invalid reference: ${accountNumber}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }

    // Find order draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error(`❌ [CONFIRMATION FAILED] Draft not found for reference: ${accountNumber}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }

    // Check if already processed
    if (draft.status === 'CONFIRMED') {
      console.log(`ℹ️ [CONFIRMATION INFO] Draft ${decoded.token} already confirmed`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' });
    }

    // Validate amount
    if (amount !== draft.totalAmount) {
      draft.status = 'FAILED';
      await draft.save();
      console.error(
        `❌ [CONFIRMATION FAILED] Amount mismatch for token: ${decoded.token}. Expected ${draft.totalAmount}, got ${amount}`
      );
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Amount mismatch' });
    }

    // Update product stock
    for (const item of draft.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }
    console.log(`📦 [CONFIRMATION] Stock updated for draft ${decoded.token}`);

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
      mpesaTransactionId
    });

    await order.save();
    console.log(`📝 [CONFIRMATION] Order ${orderId} created for draft ${decoded.token}`);

    // Create ledger entries for vendor payouts
    const ledgerEntries = draft.vendorSplits.map((vendor: any) => ({
      vendorId: vendor.vendorId,
      shopId: vendor.shopId,
      orderId: orderId,
      draftToken: draft.token,
      amount: vendor.amount,
      commission: vendor.commission,
      netAmount: vendor.netAmount,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h later
    }));

    await Ledger.insertMany(ledgerEntries);
    console.log(`💰 [CONFIRMATION] Ledger entries created for order ${orderId}`);

    // Update draft status
    draft.status = 'CONFIRMED';
    draft.mpesaTransactionId = mpesaTransactionId;
    await draft.save();
    console.log(`✅ [CONFIRMATION SUCCESS] Draft ${decoded.token} confirmed and finalized`);

    // TODO: Send notifications to buyer and vendors
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Confirmation accepted' });

  } catch (error) {
    console.error('❌ [CONFIRMATION ERROR] Unexpected server error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}*/


// confirmation/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
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
    console.log("[CONFIRMATION] Incoming:", body);
    console.log("📩 [CONFIRMATION] Incoming payload:", JSON.stringify(body, null, 2));

    // Step 1: Get shortRef (what M-Pesa sends)
    const shortRef = body.AccountNumber || body.BillRefNumber;
    if (!shortRef) {
      console.error("❌ [CONFIRMATION FAILED] Missing account number");
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing account number' });
    }
    console.log(`🔗 [CONFIRMATION] shortRef received: ${shortRef}`);

    // Step 2: Expand shortRef → fullRef (if mapping exists)
    const fullRef = lookupShort(shortRef) || shortRef;
    console.log(`🔗 [CONFIRMATION] Resolved fullRef: ${fullRef}`);

    // Step 3: Decode fullRef → token
    const decoded = decodeRef(fullRef);
    if (!decoded.ok) {
      console.error(`❌ [CONFIRMATION FAILED] Invalid reference: ${shortRef}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid reference' });
    }
    console.log(`🔑 [CONFIRMATION] Decoded token: ${decoded.token}`);

    const amount = Math.round(Number(body.Amount));
    const mpesaTransactionId = body.TransactionID || body.MpesaReceiptNumber;

    // Step 4: Find order draft by token
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error(`❌ [CONFIRMATION FAILED] Draft not found for token: ${decoded.token}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Reference not found' });
    }

    // Step 5: Check if already processed
    if (draft.status === 'CONFIRMED') {
      console.log(`ℹ️ [CONFIRMATION INFO] Draft ${decoded.token} already confirmed`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' });
    }

    // Step 6: Validate amount
    if (amount !== draft.totalAmount) {
      draft.status = 'FAILED';
      await draft.save();
      console.error(
        `❌ [CONFIRMATION FAILED] Amount mismatch for token: ${decoded.token}. Expected ${draft.totalAmount}, got ${amount}`
      );
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Amount mismatch' });
    }

    // Step 7: Update product stock
    for (const item of draft.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    console.log(`📦 [CONFIRMATION] Stock updated for draft ${decoded.token}`);

    // Step 8: Create main order
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
        status: 'PENDING',
      })),
      totalAmount: draft.totalAmount,
      platformFee: draft.vendorSplits.reduce((sum: number, v: any) => sum + v.commission, 0),
      currency: draft.currency,
      paymentMethod: 'M-PESA',
      paymentStatus: 'PAID',
      shipping: draft.shipping,
      status: 'PENDING',
      mpesaTransactionId,
    });

    await order.save();
    console.log(`📝 [CONFIRMATION] Order ${orderId} created for draft ${decoded.token}`);

    // Step 9: Create ledger entries for vendor payouts
    const ledgerEntries = draft.vendorSplits.map((vendor: any) => ({
      vendorId: vendor.vendorId,
      shopId: vendor.shopId,
      orderId,
      draftToken: draft.token,
      amount: vendor.amount,
      commission: vendor.commission,
      netAmount: vendor.netAmount,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h later
    }));

    await Ledger.insertMany(ledgerEntries);
    console.log(`💰 [CONFIRMATION] Ledger entries created for order ${orderId}`);

    // Step 10: Finalize draft
    draft.status = 'CONFIRMED';
    draft.fullRef = fullRef; // keep the resolved reference
    draft.mpesaTransactionId = mpesaTransactionId;
    await draft.save();
    console.log(`✅ [CONFIRMATION SUCCESS] Draft ${decoded.token} confirmed and finalized`);

    // TODO: Send notifications to buyer and vendors
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Confirmation accepted' });

  } catch (error) {
    console.error('❌ [CONFIRMATION ERROR] Unexpected server error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
*/

// src/app/api/confirmation/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderDraft from "@/models/OrderDraft";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[CONFIRMATION] Incoming payload:", body);

    await dbConnect();

    const { BillRefNumber, TransID, TransAmount, MSISDN } = body;

    const draft = await OrderDraft.findOne({ shortRef: BillRefNumber });
    if (!draft) {
      console.warn("[CONFIRMATION] No draft found for ref:", BillRefNumber);
      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: "Draft not found",
      });
    }

    // ✅ Mark draft as paid
    draft.isPaid = true;
    draft.transactionId = TransID;
    draft.payerPhone = MSISDN;
    draft.paidAmount = parseFloat(TransAmount);
    await draft.save();

    console.log("[CONFIRMATION] Payment confirmed for:", BillRefNumber, "Txn:", TransID);

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Confirmation received successfully",
    });
  } catch (err: any) {
    console.error("[CONFIRMATION] Error:", err.message);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}
*/

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderDraft from "@/models/OrderDraft";
import Order from "@/models/Order";
import Ledger from "@/models/Ledger";
import Product from "@/models/product";
import { decodeRef, lookupShort, generateOrderId } from "@/lib/orderUtils";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📩 [CONFIRMATION] Incoming payload:", JSON.stringify(body, null, 2));

    const shortRef = body.AccountNumber || body.BillRefNumber;
    console.log("🔗 [CONFIRMATION] shortRef received:", shortRef);

    // Resolve shortRef → fullRef
    const fullRef = lookupShort(shortRef) || shortRef;
    console.log("🔗 [CONFIRMATION] Resolved fullRef:", fullRef);

    // Decode reference
    const decoded = decodeRef(fullRef);
    if (!decoded.ok) {
      console.error(`❌ [CONFIRMATION FAILED] Invalid reference: ${shortRef}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid reference" });
    }

    // Find draft
    const draft = await OrderDraft.findOne({ token: decoded.token });
    if (!draft) {
      console.error(`❌ [CONFIRMATION FAILED] Draft not found for ref: ${shortRef}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Reference not found" });
    }

    // Check already confirmed
    if (draft.status === "CONFIRMED") {
      console.log(`ℹ️ [CONFIRMATION INFO] Draft ${decoded.token} already confirmed`);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Already processed" });
    }

    const amount = Math.round(Number(body.Amount || body.TransAmount));
    if (amount !== draft.totalAmount) {
      draft.status = "FAILED";
      await draft.save();
      console.error(
        `❌ [CONFIRMATION FAILED] Amount mismatch. Expected ${draft.totalAmount}, got ${amount}`
      );
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Amount mismatch" });
    }

    // Update stock
    for (const item of draft.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }
    console.log(`📦 [CONFIRMATION] Stock updated for draft ${decoded.token}`);

    // Create real Order
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
        status: "PENDING",
      })),
      totalAmount: draft.totalAmount,
      platformFee: draft.vendorSplits.reduce((sum: number, v: any) => sum + v.commission, 0),
      currency: draft.currency,
      paymentMethod: "M-PESA",
      paymentStatus: "PAID",
      shipping: draft.shipping,
      status: "PENDING",
      mpesaTransactionId: body.TransID || body.MpesaReceiptNumber,
    });

    await order.save();
    console.log(`📝 [CONFIRMATION] Order ${orderId} created for draft ${decoded.token}`);

    // Create ledger entries
    const ledgerEntries = draft.vendorSplits.map((vendor: any) => ({
      vendorId: vendor.vendorId,
      shopId: vendor.shopId,
      orderId,
      draftToken: draft.token,
      amount: vendor.amount,
      commission: vendor.commission,
      netAmount: vendor.netAmount,
      status: "PENDING",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // payout after 24h
    }));

    await Ledger.insertMany(ledgerEntries);
    console.log(`💰 [CONFIRMATION] Ledger entries created for order ${orderId}`);

    // Mark draft confirmed
    draft.status = "CONFIRMED";
    draft.mpesaTransactionId = body.TransID || body.MpesaReceiptNumber;
    await draft.save();
    console.log(`✅ [CONFIRMATION SUCCESS] Draft ${decoded.token} confirmed`);

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Confirmation received successfully",
    });
  } catch (err) {
    console.error("❌ [CONFIRMATION ERROR]", err);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Server error" });
  }
}

