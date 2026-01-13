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
*/




// app/api/c2b-webhook/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import { decodeRef, generateOrderId } from '@/lib/orderUtils';
import { sendSMS } from '@/lib/sms';


/* =================================================================
   Helpers reused by both flows
================================================================= *
function fail(code: number, desc: string) {
  return NextResponse.json({ ResultCode: code, ResultDesc: desc });
}
function ok(desc = 'Accepted') {
  return NextResponse.json({ ResultCode: 0, ResultDesc: desc });
}

/* =================================================================
   VALIDATION  (M-Pesa Validation phase)
================================================================= *
async function handleValidation(body: any) {
  const accountNumber = body.AccountNumber || body.BillRefNumber;
  const amount = parseInt(body.Amount || body.TransAmount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  const decoded = decodeRef(draft.fullRef);
  if (!decoded.ok || !decoded.token) return fail(1, 'Invalid reference');

  if (amount !== draft.totalAmount) {
    console.error(`❌ Amount mismatch: got ${amount}, expected ${draft.totalAmount}`);
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');

  if (draft.status === 'VALIDATED') return ok('Already validated');
  if (draft.status !== 'PENDING') return fail(1, 'Already processed');

  draft.status = 'VALIDATED';
  await draft.save();
  console.log('✅ Validation OK for shortRef:', accountNumber);
  return ok();
}

/* =================================================================
   CONFIRMATION  (M-Pesa Confirmation phase)
================================================================= *
async function handleConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  const decoded = decodeRef(draft.fullRef);
  if (!decoded.ok || !decoded.token) return fail(1, 'Invalid reference');

  if (amount !== draft.totalAmount) {
    draft.status = 'FAILED';
    await draft.save();
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');

  if (draft.status === 'CONFIRMED') return ok('Already processed');

  /* ---------- stock ---------- *
  for (const it of draft.items) {
    await Product.findByIdAndUpdate(it.productId, { $inc: { stock: -it.quantity } });
  }

  /* ---------- order ---------- *
  const orderId = generateOrderId();
  const order = new Order({
    orderId,
    draftToken: draft.token,
    buyerId: draft.buyerId,
    items: draft.items,
    suborders: draft.vendorSplits.map((v: any) => ({
      vendorId: v.vendorId,
      shopId: v.shopId,
      items: draft.items.filter((it: any) => it.vendorId === v.vendorId),
      amount: v.amount,
      commission: v.commission,
      netAmount: v.netAmount,
      status: 'PENDING',
    })),
    totalAmount: draft.totalAmount,
    platformFee: draft.vendorSplits.reduce((s: number, v: any) => s + v.commission, 0),
    currency: draft.currency || 'KES',
    paymentMethod: 'M-PESA',
    paymentStatus: 'PAID',
    shipping: draft.shipping,
    status: 'PENDING',
    mpesaTransactionId: body.TransID || body.TransId,
  });
  await order.save();

  /* ---------- ledger ---------- *
  const ledgerEntries = draft.vendorSplits.map((v: any) => ({
    vendorId: v.vendorId,
    shopId: v.shopId,
    orderId,
    draftToken: draft.token,
    amount: v.amount,
    commission: v.commission,
    netAmount: v.netAmount,
    status: 'PENDING',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }));
  await Ledger.insertMany(ledgerEntries);

  /* ---------- finalize draft ---------- *
  draft.status = 'CONFIRMED';
  draft.mpesaTransactionId = body.TransID || body.TransId;
  await draft.save();


  /* ---------- SEND SMS ---------- *

  // Customer phone number (from shipping)
  const customerPhone = draft.shipping.phone;

  // Format phone (ensure +2547…)
  const normalizePhone = (phone: string) => {
    if (phone.startsWith("+")) return phone;
    if (phone.startsWith("0")) return "+254" + phone.substring(1);
    if (phone.startsWith("7")) return "+254" + phone;
    return phone;
  };

  const formattedPhone = normalizePhone(customerPhone);

  // 🆕 Log phone for debugging
  console.log("📞 Raw phone from DB:", customerPhone);
  console.log("📞 Formatted phone:", formattedPhone);

  // Build customer SMS message
  const customerMessage = `
  Thank you for your order!

  Order ID: ${orderId}
  Amount: KES ${draft.totalAmount}
  Transaction: ${draft.mpesaTransactionId}

  We will process and keep you updated.
  -Shaddyna
  `.trim();

  // Admin phone (replace with yours)
  const adminPhone = "+254711118817";
  const adminMessage = `
  New Order Received!

  Order ID: ${orderId}
  Customer Phone: ${formattedPhone}
  Amount: KES ${draft.totalAmount}
  Transaction: ${draft.mpesaTransactionId}
  `.trim();

  // Send SMS to customer
  await sendSMS(formattedPhone, customerMessage);

  // Send SMS to admin
  await sendSMS(adminPhone, adminMessage);

  console.log("📨 SMS notifications sent.");

  /* ---------- return response ---------- *
  console.log('✅ Confirmation complete for shortRef:', accountNumber);
  return ok('Success');

  }

  /* =================================================================
    MAIN ENTRY
  ================================================================= *
  export async function POST(req: NextRequest) {
    try {
      await dbConnect();
      const body = await req.json();
      console.log('📥 C2B payload:', JSON.stringify(body, null, 2));

      // M-Pesa sends TransID only in the confirmation phase
      return body.TransID || body.TransId
        ? await handleConfirmation(body)
        : await handleValidation(body);
    } catch (e) {
      console.error('❌ C2B webhook crash:', e);
      return fail(1, 'Server error');
    }
}*/








//////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
// app/api/c2b-webhook/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import User from '@/models/user';
import { decodeRef, generateOrderId } from '@/lib/orderUtils';
import { sendSMS } from '@/lib/sms';

/* =================================================================
   Helpers reused by both flows
================================================================= *
function fail(code: number, desc: string) {
  return NextResponse.json({ ResultCode: code, ResultDesc: desc });
}

function ok(desc = 'Accepted') {
  return NextResponse.json({ ResultCode: 0, ResultDesc: desc });
}

/* =================================================================
   VALIDATION  (M-Pesa Validation phase)
================================================================= *
async function handleValidation(body: any) {
  const accountNumber = body.AccountNumber || body.BillRefNumber;
  const amount = parseInt(body.Amount || body.TransAmount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  const decoded = decodeRef(draft.fullRef);
  if (!decoded.ok || !decoded.token) return fail(1, 'Invalid reference');

  if (amount !== draft.totalAmount) {
    console.error(`❌ Amount mismatch: got ${amount}, expected ${draft.totalAmount}`);
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');

  if (draft.status === 'VALIDATED') return ok('Already validated');
  if (draft.status !== 'PENDING') return fail(1, 'Already processed');

  draft.status = 'VALIDATED';
  await draft.save();
  console.log('✅ Validation OK for shortRef:', accountNumber);
  return ok();
}

async function handleConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  if (amount !== draft.totalAmount) {
    draft.status = 'FAILED';
    await draft.save();
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');
  if (draft.status === 'CONFIRMED') return ok('Already processed');

  /* ---------- stock ---------- *
  for (const it of draft.items) {
    await Product.findByIdAndUpdate(it.productId, {
      $inc: { stock: -it.quantity },
    });
  }

  /* ---------- order ---------- *
  const orderId = generateOrderId();

  const order = new Order({
    orderId,
    draftToken: draft.token,
    buyerId: draft.buyerId,
    items: draft.items,
    suborders: draft.vendorSplits.map((v: any) => ({
      vendorId: v.vendorId,
      shopId: v.shopId,
      items: draft.items.filter((it: any) => it.vendorId === v.vendorId),
      amount: v.amount,
      commission: v.commission, // FULL 3%
      netAmount: v.netAmount,   // already after 3%
      status: 'PENDING',
    })),
    totalAmount: draft.totalAmount,
    platformFee: draft.vendorSplits.reduce(
      (sum: number, v: any) => sum + v.commission,
      0
    ),
    currency: draft.currency || 'KES',
    paymentMethod: 'M_PESA',
    paymentStatus: 'PAID',
    shipping: draft.shipping,
    status: 'PENDING',
    mpesaTransactionId: body.TransID || body.TransId,
  });

  await order.save();

  /* ---------- ledger ---------- *

  const ledgerEntries: any[] = [];

  for (const v of draft.vendorSplits) {
    const totalCommission = v.commission;        // 3%
    const referralAmount = v.amount * 0.005;     // 0.5%
    const platformAmount = totalCommission - referralAmount; // 2.5%

    // Vendor payout (net already correct)
    ledgerEntries.push({
      type: 'VENDOR_PAYOUT',
      vendorId: v.vendorId,
      shopId: v.shopId,
      orderId,
      draftToken: draft.token,
      amount: v.netAmount,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Platform income (2.5%)
    ledgerEntries.push({
      type: 'PLATFORM_COMMISSION',
      orderId,
      draftToken: draft.token,
      amount: platformAmount,
      status: 'PAID',
    });

    // Referral commission (0.5%) — SAME 3% bucket
    const vendorUser = await User.findById(v.vendorId);
    if (vendorUser?.referredBy) {
      ledgerEntries.push({
        type: 'REFERRAL_COMMISSION',
        referrerId: vendorUser.referredBy,
        referredVendorId: vendorUser._id,
        orderId,
        draftToken: draft.token,
        amount: referralAmount,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }
  }

  await Ledger.insertMany(ledgerEntries);

  /* ---------- finalize draft ---------- *
  draft.status = 'CONFIRMED';
  draft.mpesaTransactionId = body.TransID || body.TransId;
  await draft.save();

  return ok('Success');
}

/* =================================================================
   CONFIRMATION  (M-Pesa Confirmation phase)
================================================================= */
/*async function handleConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  const decoded = decodeRef(draft.fullRef);
  if (!decoded.ok || !decoded.token) return fail(1, 'Invalid reference');

  if (amount !== draft.totalAmount) {
    draft.status = 'FAILED';
    await draft.save();
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');

  if (draft.status === 'CONFIRMED') return ok('Already processed');

  /* ---------- stock ---------- *
  for (const it of draft.items) {
    await Product.findByIdAndUpdate(it.productId, { $inc: { stock: -it.quantity } });
  }

  /* ---------- order ---------- *
  const orderId = generateOrderId();
  const order = new Order({
    orderId,
    draftToken: draft.token,
    buyerId: draft.buyerId,
    items: draft.items,
    suborders: draft.vendorSplits.map((v: any) => ({
      vendorId: v.vendorId,
      shopId: v.shopId,
      items: draft.items.filter((it: any) => it.vendorId === v.vendorId),
      amount: v.amount,
      commission: v.commission,
      netAmount: v.netAmount,
      status: 'PENDING',
    })),
    totalAmount: draft.totalAmount,
    platformFee: draft.vendorSplits.reduce((s: number, v: any) => s + v.commission, 0),
    currency: draft.currency || 'KES',
    paymentMethod: 'M-PESA',
    paymentStatus: 'PAID',
    shipping: draft.shipping,
    status: 'PENDING',
    mpesaTransactionId: body.TransID || body.TransId,
  });
  await order.save();

  /* ---------- ledger ---------- *
  // Vendor payouts
  const vendorLedgerEntries = draft.vendorSplits.map((v: any) => ({
    type: 'VENDOR_PAYOUT',
    vendorId: v.vendorId,
    shopId: v.shopId,
    orderId,
    draftToken: draft.token,
    amount: v.amount,
    commission: v.commission,
    netAmount: v.netAmount,
    status: 'PENDING',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }));

  // Referral commissions
  const referralLedgerEntries = await Promise.all(
    draft.vendorSplits.map(async (v: any) => {
      const vendorUser = await User.findById(v.vendorId);
      if (!vendorUser?.referredBy) return null;

      return {
        type: 'REFERRAL_COMMISSION',
        referrerId: vendorUser.referredBy,
        referredVendorId: vendorUser._id,
        orderId,
        draftToken: draft.token,
        amount: v.amount * 0.005, // 0.5%
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    })
  );

  const validReferralLedgerEntries = referralLedgerEntries.filter(Boolean);

  // Insert all ledger entries
  await Ledger.insertMany([...vendorLedgerEntries, ...validReferralLedgerEntries]);

  /* ---------- finalize draft ---------- *
  draft.status = 'CONFIRMED';
  draft.mpesaTransactionId = body.TransID || body.TransId;
  await draft.save();

  /* ---------- SEND SMS ---------- *
  const customerPhone = draft.shipping.phone;
  const normalizePhone = (phone: string) => {
    if (phone.startsWith("+")) return phone;
    if (phone.startsWith("0")) return "+254" + phone.substring(1);
    if (phone.startsWith("7")) return "+254" + phone;
    return phone;
  };
  const formattedPhone = normalizePhone(customerPhone);

  const customerMessage = `
  Thank you for your order!
  Order ID: ${orderId}
  Amount: KES ${draft.totalAmount}
  Transaction: ${draft.mpesaTransactionId}
  We will process and keep you updated.
  -Shaddyna
  `.trim();

  const adminPhone = "+254711118817";
  const adminMessage = `
  New Order Received!
  Order ID: ${orderId}
  Customer Phone: ${formattedPhone}
  Amount: KES ${draft.totalAmount}
  Transaction: ${draft.mpesaTransactionId}
  `.trim();

  await sendSMS(formattedPhone, customerMessage);
  await sendSMS(adminPhone, adminMessage);

  console.log("📨 SMS notifications sent.");
  console.log('✅ Confirmation complete for shortRef:', accountNumber);
  return ok('Success');
}*/

/* =================================================================
    MAIN ENTRY
================================================================= *
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('📥 C2B payload:', JSON.stringify(body, null, 2));

    // M-Pesa sends TransID only in the confirmation phase
    return body.TransID || body.TransId
      ? await handleConfirmation(body)
      : await handleValidation(body);
  } catch (e) {
    console.error('❌ C2B webhook crash:', e);
    return fail(1, 'Server error');
  }
}*/

///////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////


// app/api/c2b-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Order from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import User from '@/models/user';
import { decodeRef, generateOrderId } from '@/lib/orderUtils';
import { sendSMS } from '@/lib/sms';

/* =================================================================
   Helpers
================================================================= */
function fail(code: number, desc: string) {
  return NextResponse.json({ ResultCode: code, ResultDesc: desc });
}

function ok(desc = 'Accepted') {
  return NextResponse.json({ ResultCode: 0, ResultDesc: desc });
}

/* =================================================================
   VALIDATION
================================================================= */
async function handleValidation(body: any) {
  const accountNumber = body.AccountNumber || body.BillRefNumber;
  const amount = parseInt(body.Amount || body.TransAmount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  const decoded = decodeRef(draft.fullRef);
  if (!decoded.ok || !decoded.token) return fail(1, 'Invalid reference');

  if (amount !== draft.totalAmount) {
    console.error(`❌ Amount mismatch: got ${amount}, expected ${draft.totalAmount}`);
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');

  if (draft.status === 'VALIDATED') return ok('Already validated');
  if (draft.status !== 'PENDING') return fail(1, 'Already processed');

  draft.status = 'VALIDATED';
  await draft.save();
  console.log('✅ Validation OK for shortRef:', accountNumber);
  return ok();
}

/* =================================================================
   CONFIRMATION
================================================================= */
/*async function handleConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  if (amount !== draft.totalAmount) {
    draft.status = 'FAILED';
    await draft.save();
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');
  if (draft.status === 'CONFIRMED') return ok('Already processed');

  /* ---------- stock ---------- *
  for (const it of draft.items) {
    await Product.findByIdAndUpdate(it.productId, {
      $inc: { stock: -it.quantity },
    });
  }


  /* ---------- order ---------- *
  const orderId = generateOrderId();

  const ledgerEntries: any[] = [];

  for (const v of draft.vendorSplits) {
    const totalAmount = v.amount;
    const platformShare = totalAmount * 0.025; // 2.5%
    const referralShare = totalAmount * 0.005; // 0.5%
    const vendorNet = totalAmount - platformShare - referralShare;

    // Vendor payout
    ledgerEntries.push({
      type: 'VENDOR_PAYOUT',
      vendorId: v.vendorId,
      shopId: v.shopId,
      orderId,
      draftToken: draft.token,
      amount: vendorNet,
      netAmount: vendorNet,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Platform commission
    ledgerEntries.push({
      type: 'PLATFORM_COMMISSION',
      orderId,
      draftToken: draft.token,
      amount: platformShare,
      status: 'PAID',
      scheduledAt: new Date(),
    });

    // Referral commission
    const vendorUser = await User.findById(v.vendorId);
    if (vendorUser?.referredBy) {
      ledgerEntries.push({
        type: 'REFERRAL_COMMISSION',
        referrerId: vendorUser.referredBy,
        referredVendorId: vendorUser._id,
        orderId,
        draftToken: draft.token,
        amount: referralShare,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }
  }

  await Ledger.insertMany(ledgerEntries);

  // Save order with correct suborders
  const order = new Order({
    orderId,
    draftToken: draft.token,
    buyerId: draft.buyerId,
    items: draft.items,
    suborders: draft.vendorSplits.map((v: any) => {
      const totalAmount = v.amount;
      const platformShare = totalAmount * 0.025;
      const referralShare = totalAmount * 0.005;
      const vendorNet = totalAmount - platformShare - referralShare;

      return {
        vendorId: v.vendorId,
        shopId: v.shopId,
        items: draft.items.filter((it: any) => it.vendorId === v.vendorId),
        amount: totalAmount,
        commission: platformShare + referralShare, // 3%
        netAmount: vendorNet,
        status: 'PENDING',
      };
    }),
    totalAmount: draft.totalAmount,
    platformFee: draft.vendorSplits.reduce((sum: number, v: any) => sum + v.amount * 0.025, 0),
    currency: draft.currency || 'KES',
    paymentMethod: 'M-PESA',
    paymentStatus: 'PAID',
    shipping: draft.shipping,
    status: 'PENDING',
    mpesaTransactionId: body.TransID || body.TransId,
  });

  await order.save();

  /* ---------- finalize draft ---------- *
  draft.status = 'CONFIRMED';
  draft.mpesaTransactionId = body.TransID || body.TransId;
  await draft.save();

  return ok('Success');
}*/

async function handleConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);

  if (!accountNumber) return fail(1, 'Missing account number');

  const draft = await OrderDraft.findOne({ shortRef: accountNumber });
  if (!draft) return fail(1, 'Unknown reference');

  if (amount !== draft.totalAmount) {
    draft.status = 'FAILED';
    await draft.save();
    return fail(1, `Amount mismatch. Expected ${draft.totalAmount}`);
  }

  if (draft.expiresAt < new Date()) return fail(1, 'Reference expired');
  if (draft.status === 'CONFIRMED') return ok('Already processed');

  /* ---------- stock ---------- */
  for (const it of draft.items) {
    await Product.findByIdAndUpdate(it.productId, {
      $inc: { stock: -it.quantity },
    });
  }

  /* ---------- order ID ---------- */
  const orderId = generateOrderId();

  /* ---------- ledger ---------- */
  const ledgerEntries: any[] = [];

  for (const v of draft.vendorSplits) {
    const totalAmount = v.amount;
    const vendorUser = await User.findById(v.vendorId);

    let platformShare: number;
    let referralShare: number;

    if (vendorUser?.referredBy) {
      // 3% split: 2.5% platform, 0.5% referral
      referralShare = totalAmount * 0.005;
      platformShare = totalAmount * 0.025;

      // Referral commission entry
      ledgerEntries.push({
        type: 'REFERRAL_COMMISSION',
        referrerId: vendorUser.referredBy,
        referredVendorId: vendorUser._id,
        orderId,
        draftToken: draft.token,
        amount: referralShare,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    } else {
      // No referral: platform gets full 3%
      referralShare = 0;
      platformShare = totalAmount * 0.03;
    }

    const vendorNet = totalAmount - platformShare - referralShare;

    // Vendor payout entry
    ledgerEntries.push({
      type: 'VENDOR_PAYOUT',
      vendorId: v.vendorId,
      shopId: v.shopId,
      orderId,
      draftToken: draft.token,
      amount: vendorNet,
      netAmount: vendorNet,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Platform commission entry
    ledgerEntries.push({
      type: 'PLATFORM_COMMISSION',
      orderId,
      draftToken: draft.token,
      amount: platformShare,
      status: 'PAID',
      scheduledAt: new Date(),
    });
  }

  await Ledger.insertMany(ledgerEntries);

  /* ---------- order ---------- */
  const order = new Order({
    orderId,
    draftToken: draft.token,
    buyerId: draft.buyerId,
    items: draft.items,
    suborders: await Promise.all(
      draft.vendorSplits.map(async (v: any) => {
        const totalAmount = v.amount;
        const vendorUser = await User.findById(v.vendorId);

        const platformShare = vendorUser?.referredBy ? totalAmount * 0.025 : totalAmount * 0.03;
        const referralShare = vendorUser?.referredBy ? totalAmount * 0.005 : 0;
        const vendorNet = totalAmount - platformShare - referralShare;

        return {
          vendorId: v.vendorId,
          shopId: v.shopId,
          items: draft.items.filter((it: any) => it.vendorId === v.vendorId),
          amount: totalAmount,
          commission: platformShare + referralShare,
          netAmount: vendorNet,
          status: 'PENDING',
        };
      })
    ),
    totalAmount: draft.totalAmount,
    platformFee: draft.vendorSplits.reduce((sum: number, v: any) => {
      const vendorUser = draft.items.find((it: any) => it.vendorId === v.vendorId);
      return sum + (vendorUser?.referredBy ? v.amount * 0.025 : v.amount * 0.03);
    }, 0),
    currency: draft.currency || 'KES',
    paymentMethod: 'M-PESA',
    paymentStatus: 'PAID',
    shipping: draft.shipping,
    status: 'PENDING',
    mpesaTransactionId: body.TransID || body.TransId,
  });

  await order.save();

  /* ---------- finalize draft ---------- */
  draft.status = 'CONFIRMED';
  draft.mpesaTransactionId = body.TransID || body.TransId;
  await draft.save();

  return ok('Success');
}


/* =================================================================
    MAIN ENTRY
================================================================= */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('📥 C2B payload:', JSON.stringify(body, null, 2));

    return body.TransID || body.TransId
      ? await handleConfirmation(body)
      : await handleValidation(body);
  } catch (e) {
    console.error('❌ C2B webhook crash:', e);
    return fail(1, 'Server error');
  }
}
