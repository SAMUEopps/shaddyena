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
import Order, { DeliveryDetails } from '@/models/Order';
import Ledger from '@/models/Ledger';
import Product from '@/models/product';
import User from '@/models/user';
import { decodeRef, generateOrderId } from '@/lib/orderUtils';
import { sendSMS } from '@/lib/sms';


// app/api/c2b-webhook/route.ts - Add delivery fee confirmation handler

// Add this function to generate confirmation code
function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Add this handler for delivery fee confirmations
/*async function handleDeliveryFeeConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber; // This will be the paymentRef (e.g., DELABC123)
  const amount = parseInt(body.TransAmount || body.Amount, 10);

  if (!accountNumber || !accountNumber.startsWith('DEL')) {
    return fail(1, 'Not a delivery fee payment');
  }

  const paymentRef = accountNumber;

  // Find order with this delivery fee payment reference
  const order = await Order.findOne({
    'suborders.deliveryDetails.deliveryFeePaymentRef': paymentRef
  });

  if (!order) {
    return fail(1, 'Unknown delivery fee reference');
  }

  // Find the specific suborder
  const suborder = order.suborders.find(
    (so: any) => so.deliveryDetails?.deliveryFeePaymentRef === paymentRef
  );

  if (!suborder) {
    return fail(1, 'Suborder not found');
  }

  // Verify amount matches
  if (amount !== suborder.deliveryFee) {
    console.error(`❌ Delivery fee amount mismatch: got ${amount}, expected ${suborder.deliveryFee}`);
    return fail(1, `Amount mismatch. Expected ${suborder.deliveryFee}`);
  }

  // Check if already processed
  if (suborder.deliveryDetails?.deliveryFeePaid) {
    return ok('Already processed');
  }

  // Generate confirmation code
  const confirmationCode = generateConfirmationCode();

  // Update suborder with payment and confirmation code
  suborder.deliveryDetails.deliveryFeePaid = true;
  suborder.deliveryDetails.deliveryFeePaidAt = new Date();
  suborder.deliveryDetails.deliveryFeeReceipt = body.TransID || body.TransId;
  suborder.deliveryDetails.confirmationCode = confirmationCode;
  suborder.deliveryDetails.confirmedAt = new Date();
  
  // Update suborder status
  suborder.status = 'CONFIRMED';

  await order.save();

  console.log(`✅ Delivery fee paid and confirmation code generated: ${confirmationCode}`);

  return ok('Delivery fee confirmed');
}*/

// app/api/c2b-webhook/route.ts - Update handleDeliveryFeeConfirmation with better logging

/*async function handleDeliveryFeeConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);
  const transactionId = body.TransID || body.TransId;

  console.log(`📥 Processing delivery fee payment:`);
  console.log(`   - Account Ref: ${accountNumber}`);
  console.log(`   - Amount: ${amount}`);
  console.log(`   - Transaction ID: ${transactionId}`);

  if (!accountNumber || !accountNumber.startsWith('DEL')) {
    console.log(`❌ Not a delivery fee payment: ${accountNumber}`);
    return fail(1, 'Not a delivery fee payment');
  }

  const paymentRef = accountNumber;
  console.log(`🔍 Looking for order with paymentRef: ${paymentRef}`);

  // Find order with this delivery fee payment reference
  const order = await Order.findOne({
    'suborders.deliveryDetails.deliveryFeePaymentRef': paymentRef
  });

  if (!order) {
    console.log(`❌ No order found with deliveryFeePaymentRef: ${paymentRef}`);
    
    // Try to find any orders with suborders that might have this reference
    const allOrders = await Order.find({}).limit(5);
    console.log(`📊 Checking recent orders for reference:`);
    for (const o of allOrders) {
      for (const so of o.suborders) {
        if (so.deliveryDetails?.deliveryFeePaymentRef) {
          console.log(`   - Order ${o._id}, Suborder ${so._id}: ${so.deliveryDetails.deliveryFeePaymentRef}`);
        }
      }
    }
    return fail(1, 'Unknown delivery fee reference');
  }

  console.log(`✅ Found order: ${order._id}`);
  console.log(`   - Order Status: ${order.status}`);
  console.log(`   - Buyer ID: ${order.buyerId}`);

  // Find the specific suborder
  const suborder = order.suborders.find(
    (so: any) => so.deliveryDetails?.deliveryFeePaymentRef === paymentRef
  );

  if (!suborder) {
    console.log(`❌ No suborder found with deliveryFeePaymentRef: ${paymentRef}`);
    
    // Log all suborder payment refs
    order.suborders.forEach((so: any, index: number) => {
      console.log(`   - Suborder ${index}: ${so._id}, Ref: ${so.deliveryDetails?.deliveryFeePaymentRef}`);
    });
    
    return fail(1, 'Suborder not found');
  }

  console.log(`✅ Found suborder: ${suborder._id}`);
  console.log(`   - Suborder Status: ${suborder.status}`);
  console.log(`   - Delivery Fee: ${suborder.deliveryFee}`);
  console.log(`   - Current deliveryDetails:`, JSON.stringify(suborder.deliveryDetails, null, 2));

  // Verify amount matches
  if (amount !== suborder.deliveryFee) {
    console.error(`❌ Delivery fee amount mismatch: got ${amount}, expected ${suborder.deliveryFee}`);
    return fail(1, `Amount mismatch. Expected ${suborder.deliveryFee}`);
  }

  // Check if already processed
  if (suborder.deliveryDetails?.deliveryFeePaid) {
    console.log(`⚠️ Delivery fee already paid for suborder: ${suborder._id}`);
    console.log(`   - Paid At: ${suborder.deliveryDetails.deliveryFeePaidAt}`);
    console.log(`   - Receipt: ${suborder.deliveryDetails.deliveryFeeReceipt}`);
    return ok('Already processed');
  }

  // Generate confirmation code
  const confirmationCode = generateConfirmationCode();
  console.log(`🔑 Generated confirmation code: ${confirmationCode}`);

  // Update suborder with payment and confirmation code
  if (!suborder.deliveryDetails) {
    suborder.deliveryDetails = {};
  }
  
  suborder.deliveryDetails.deliveryFeePaid = true;
  suborder.deliveryDetails.deliveryFeePaidAt = new Date();
  suborder.deliveryDetails.deliveryFeeReceipt = transactionId;
  suborder.deliveryDetails.confirmationCode = confirmationCode;
  suborder.deliveryDetails.confirmedAt = new Date();
  
  // Update suborder status
  suborder.status = 'CONFIRMED';

  await order.save();

  console.log(`✅ Successfully updated suborder:`);
  console.log(`   - deliveryFeePaid: ${suborder.deliveryDetails.deliveryFeePaid}`);
  console.log(`   - confirmationCode: ${suborder.deliveryDetails.confirmationCode}`);
  console.log(`   - suborder.status: ${suborder.status}`);

  return ok('Delivery fee confirmed');
}*/

// app/api/c2b-webhook/route.ts - Update the logging section
// In the handleDeliveryFeeConfirmation function, update the logging:

async function handleDeliveryFeeConfirmation(body: any) {
  const accountNumber = body.BillRefNumber || body.AccountNumber;
  const amount = parseInt(body.TransAmount || body.Amount, 10);
  const transactionId = body.TransID || body.TransId;

  console.log(`📥 Processing delivery fee payment:`);
  console.log(`   - Account Ref: ${accountNumber}`);
  console.log(`   - Amount: ${amount}`);
  console.log(`   - Transaction ID: ${transactionId}`);

  if (!accountNumber || !accountNumber.startsWith('DEL')) {
    console.log(`❌ Not a delivery fee payment: ${accountNumber}`);
    return fail(1, 'Not a delivery fee payment');
  }

  const paymentRef = accountNumber;
  console.log(`🔍 Looking for order with paymentRef: ${paymentRef}`);

  // Find order with this delivery fee payment reference
  const order = await Order.findOne({
    'suborders.deliveryDetails.deliveryFeePaymentRef': paymentRef
  });

  if (!order) {
    console.log(`❌ No order found with deliveryFeePaymentRef: ${paymentRef}`);
    
    // Try to find any orders with suborders that might have this reference
    const allOrders = await Order.find({}).limit(5);
    console.log(`📊 Checking recent orders for reference:`);
    for (const o of allOrders) {
      // Use for...of with index to safely access suborders
      for (let i = 0; i < o.suborders.length; i++) {
        const so = o.suborders[i];
        if (so.deliveryDetails?.deliveryFeePaymentRef) {
          // Use the index or the suborder's _id if available
          const suborderId = so._id ? so._id.toString() : `index-${i}`;
          console.log(`   - Order ${o._id}, Suborder ${suborderId}: ${so.deliveryDetails.deliveryFeePaymentRef}`);
        }
      }
    }
    return fail(1, 'Unknown delivery fee reference');
  }

  console.log(`✅ Found order: ${order._id}`);
  console.log(`   - Order Status: ${order.status}`);
  console.log(`   - Buyer ID: ${order.buyerId}`);

  // Find the specific suborder
  const suborder = order.suborders.find(
    (so: any) => so.deliveryDetails?.deliveryFeePaymentRef === paymentRef
  );

  if (!suborder) {
    console.log(`❌ No suborder found with deliveryFeePaymentRef: ${paymentRef}`);
    
    // Log all suborder payment refs safely
    order.suborders.forEach((so: any, index: number) => {
      const suborderId = so._id ? so._id.toString() : `index-${index}`;
      console.log(`   - Suborder ${suborderId}, Ref: ${so.deliveryDetails?.deliveryFeePaymentRef}`);
    });
    
    return fail(1, 'Suborder not found');
  }

  // Use type assertion or optional chaining for _id
  const suborderId = suborder._id ? suborder._id.toString() : 'unknown';
  
  console.log(`✅ Found suborder: ${suborderId}`);
  console.log(`   - Suborder Status: ${suborder.status}`);
  console.log(`   - Delivery Fee: ${suborder.deliveryFee}`);
  console.log(`   - Current deliveryDetails:`, JSON.stringify(suborder.deliveryDetails, null, 2));

  // Verify amount matches
  if (amount !== suborder.deliveryFee) {
    console.error(`❌ Delivery fee amount mismatch: got ${amount}, expected ${suborder.deliveryFee}`);
    return fail(1, `Amount mismatch. Expected ${suborder.deliveryFee}`);
  }

  // Check if already processed
  if (suborder.deliveryDetails?.deliveryFeePaid) {
    console.log(`⚠️ Delivery fee already paid for suborder: ${suborderId}`);
    console.log(`   - Paid At: ${suborder.deliveryDetails.deliveryFeePaidAt}`);
    console.log(`   - Receipt: ${suborder.deliveryDetails.deliveryFeeReceipt}`);
    return ok('Already processed');
  }

  // Generate confirmation code
  const confirmationCode = generateConfirmationCode();
  console.log(`🔑 Generated confirmation code: ${confirmationCode}`);

  // Update suborder with payment and confirmation code
  if (!suborder.deliveryDetails) {
    suborder.deliveryDetails = {} as DeliveryDetails;
  }
  
  suborder.deliveryDetails.deliveryFeePaid = true;
  suborder.deliveryDetails.deliveryFeePaidAt = new Date();
  suborder.deliveryDetails.deliveryFeeReceipt = transactionId;
  suborder.deliveryDetails.confirmationCode = confirmationCode;
  suborder.deliveryDetails.confirmedAt = new Date();
  
  // Update suborder status
  suborder.status = 'CONFIRMED';

  await order.save();

  console.log(`✅ Successfully updated suborder:`);
  console.log(`   - deliveryFeePaid: ${suborder.deliveryDetails.deliveryFeePaid}`);
  console.log(`   - confirmationCode: ${suborder.deliveryDetails.confirmationCode}`);
  console.log(`   - suborder.status: ${suborder.status}`);

  return ok('Delivery fee confirmed');
}
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

    let platformShare = 0;
    let referralShare = 0;

    if (vendorUser?.referredBy) {
      // 3% split: 2.5% platform, 0.5% referral
      referralShare = totalAmount * 0.005;
      platformShare = totalAmount * 0.025;

      // Referral commission entry (locked for 24 hours)
      ledgerEntries.push({
        type: 'REFERRAL_COMMISSION',
        referrerId: vendorUser.referredBy,
        referredVendorId: vendorUser._id,
        orderId,
        draftToken: draft.token,
        amount: referralShare,
        netAmount: referralShare,
        withdrawalStatus: 'LOCKED',
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        metadata: {
          percentage: 0.5,
          description: 'Referral commission from vendor sale'
        }
      });
    } else {
      // No referral: platform gets full 3%
      platformShare = totalAmount * 0.03;
    }

    // Platform commission entry
    ledgerEntries.push({
      type: 'PLATFORM_COMMISSION',
      orderId,
      draftToken: draft.token,
      amount: platformShare,
      netAmount: platformShare,
      withdrawalStatus: 'PAID', // Platform commission is paid immediately to platform
      status: 'PAID',
      scheduledAt: new Date(),
      paidAt: new Date(),
      metadata: {
        percentage: vendorUser?.referredBy ? 2.5 : 3,
        description: 'Platform commission'
      }
    });

    // Calculate 80% immediate release (after commission)
    const commissionTotal = platformShare + referralShare;
    const vendorEarnings = totalAmount - commissionTotal;
    const immediateRelease = vendorEarnings * 0.8;
    const remaining20Percent = vendorEarnings * 0.2;

    // Immediate vendor payout (80%)
    ledgerEntries.push({
      type: 'VENDOR_PAYOUT',
      vendorId: v.vendorId,
      shopId: v.shopId,
      orderId,
      draftToken: draft.token,
      amount: immediateRelease,
      netAmount: immediateRelease,
      withdrawalStatus: 'AVAILABLE', // Available for immediate withdrawal
      status: 'PENDING',
      scheduledAt: new Date(), // Available immediately
      metadata: {
        isImmediateRelease: true,
        percentage: 80,
        platformShare,
        referralShare,
        totalEarnings: vendorEarnings,
        breakdown: {
          totalAmount,
          commission: commissionTotal,
          vendorEarnings,
          immediateRelease,
          remaining20Percent
        }
      }
    });

    // Remaining 20% (locked for 24 hours)
    ledgerEntries.push({
      type: 'VENDOR_PAYOUT',
      vendorId: v.vendorId,
      shopId: v.shopId,
      orderId,
      draftToken: draft.token,
      amount: remaining20Percent,
      netAmount: remaining20Percent,
      withdrawalStatus: 'LOCKED', // Locked for 24 hours
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours hold
      metadata: {
        isImmediateRelease: false,
        percentage: 20,
        holdUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        platformShare,
        referralShare,
        totalEarnings: vendorEarnings
      }
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
          status: 'PROCESSING',
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
/*export async function POST(req: NextRequest) {
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
}*/

// Update the main POST handler to include delivery fee handling
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('📥 C2B payload:', JSON.stringify(body, null, 2));

    // Check if it's a delivery fee payment (based on AccountReference starting with DEL)
    const accountNumber = body.BillRefNumber || body.AccountNumber;
    if (accountNumber?.startsWith('DEL')) {
      return await handleDeliveryFeeConfirmation(body);
    }

    return body.TransID || body.TransId
      ? await handleConfirmation(body)
      : await handleValidation(body);
  } catch (e) {
    console.error('❌ C2B webhook crash:', e);
    return fail(1, 'Server error');
  }
}