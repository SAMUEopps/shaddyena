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

      /************************************************************
       * Update product stock
       ************************************************************
      for (const item of draft.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      /************************************************************
       * Create order and suborders
       ************************************************************
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
        platformFee: draft.vendorSplits.reduce((sum: number, v: any) => sum + v.commission, 0),
        currency: draft.currency,
        paymentMethod: 'M-PESA',
        paymentStatus: 'PAID',
        shipping: draft.shipping,
        status: 'PENDING',
        mpesaTransactionId: mpesaReceiptNumber,
      });
      await order.save();

      /************************************************************
       * Create ledger entries
       ************************************************************
      // Vendor payouts
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
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }));

      // Referral commissions
      const referralLedgerEntries = await Promise.all(
        draft.vendorSplits.map(async (vendor: any) => {
          const vendorUser = await User.findById(vendor.vendorId);
          if (!vendorUser?.referredBy) return null;

          return {
            type: 'REFERRAL_COMMISSION',
            referrerId: vendorUser.referredBy,
            referredVendorId: vendorUser._id,
            orderId,
            draftToken: draft.token,
            amount: vendor.amount * 0.005, // 0.5%
            status: 'PENDING',
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };
        })
      );

      const validReferralLedgerEntries = referralLedgerEntries.filter(Boolean);

      // Insert all ledger entries
      await Ledger.insertMany([...vendorLedgerEntries, ...validReferralLedgerEntries]);

      /************************************************************
       * Mark draft as confirmed
       ************************************************************
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

// NEW: Helper function to calculate delivery fees based on vendor location
async function calculateDeliveryFees(vendorSplits: any[], shippingAddress: any) {
  // This is a simplified version - you might want to implement
  // actual distance-based calculations or fixed rates per vendor
  
  const fees: Record<string, number> = {};
  
  for (const vendor of vendorSplits) {
    // For now, using a fixed delivery fee per vendor
    // In production, you might:
    // 1. Calculate distance between vendor shop and delivery address
    // 2. Use vendor's delivery fee settings
    // 3. Use platform's delivery fee calculation logic
    fees[vendor.vendorId] = 100; // Fixed 100 KES per vendor delivery
  }
  
  return fees;
}

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

      /************************************************************
       * Update product stock
       ************************************************************/
      for (const item of draft.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      /************************************************************
       * NEW: Calculate delivery fees
       ************************************************************/
      const deliveryFees = await calculateDeliveryFees(
        draft.vendorSplits, 
        draft.shipping
      );
      
      // Calculate total delivery fee
      const totalDeliveryFee = Object.values(deliveryFees).reduce(
        (sum, fee) => sum + fee, 
        0
      );
      
      console.log('🚚 Calculated Delivery Fees:', {
        deliveryFees,
        totalDeliveryFee
      });

      /************************************************************
       * Create order and suborders WITH DELIVERY SUPPORT
       ************************************************************/
      const orderId = generateOrderId();
      const order = new Order({
        orderId,
        draftToken: draft.token,
        buyerId: draft.buyerId,
        items: draft.items,
        suborders: draft.vendorSplits.map((vendor: any) => ({
          vendorId: vendor.vendorId,
          shopId: vendor.shopId,
          // NEW: Delivery fields
          deliveryFee: deliveryFees[vendor.vendorId] || 0,
          riderPayoutStatus: 'PENDING',
          items: draft.items.filter((i: any) => i.vendorId === vendor.vendorId),
          amount: vendor.amount,
          commission: vendor.commission,
          netAmount: vendor.netAmount,
          status: 'PENDING',
          // NEW: Delivery details
          deliveryDetails: {
            dropoffAddress: `${draft.shipping.address}, ${draft.shipping.city}, ${draft.shipping.country}`,
            // Pickup address will be added when vendor marks as ready for pickup
          }
        })),
        totalAmount: draft.totalAmount,
        platformFee: draft.vendorSplits.reduce((sum: number, v: any) => sum + v.commission, 0),
        deliveryFeeTotal: totalDeliveryFee, // NEW: Track total delivery fees
        currency: draft.currency,
        paymentMethod: 'M-PESA',
        paymentStatus: 'PAID',
        shipping: draft.shipping,
        status: 'PROCESSING', // Changed from PENDING to PROCESSING
        mpesaTransactionId: mpesaReceiptNumber,
      });
      await order.save();

      /************************************************************
       * NEW: Notify vendors about the order
       ************************************************************/
      const vendorIds = draft.vendorSplits.map((v: any) => v.vendorId);
      // You could send notifications/emails to vendors here
      console.log(`📢 Order ${orderId} created. Notifying vendors:`, vendorIds);

      /************************************************************
       * UPDATED: Create ledger entries with delivery fees considered
       ************************************************************/
      // Vendor payouts (net amount stays the same, delivery fee is separate)
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
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours after delivery
      }));

      // NEW: Delivery fee ledger entries (separate from vendor payouts)
      const deliveryLedgerEntries = draft.vendorSplits.map((vendor: any) => ({
        type: 'DELIVERY_FEE',
        vendorId: vendor.vendorId,
        orderId,
        draftToken: draft.token,
        amount: deliveryFees[vendor.vendorId] || 0,
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours after delivery
        metadata: {
          description: `Delivery fee for order ${orderId}`,
          forVendor: vendor.vendorId
        }
      }));

      // Referral commissions
      const referralLedgerEntries = await Promise.all(
        draft.vendorSplits.map(async (vendor: any) => {
          const vendorUser = await User.findById(vendor.vendorId);
          if (!vendorUser?.referredBy) return null;

          return {
            type: 'REFERRAL_COMMISSION',
            referrerId: vendorUser.referredBy,
            referredVendorId: vendorUser._id,
            orderId,
            draftToken: draft.token,
            amount: vendor.amount * 0.005, // 0.5%
            status: 'PENDING',
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };
        })
      );

      const validReferralLedgerEntries = referralLedgerEntries.filter(Boolean);

      // Insert all ledger entries
      await Ledger.insertMany([
        ...vendorLedgerEntries, 
        ...deliveryLedgerEntries, // NEW: Added delivery fee entries
        ...validReferralLedgerEntries
      ]);

      /************************************************************
       * Mark draft as confirmed
       ************************************************************/
      draft.status = 'CONFIRMED';
      draft.mpesaTransactionId = mpesaReceiptNumber;
      await draft.save();

      console.log(`✅ ORDER CONFIRMED — ${orderId}`);
      console.log(`📦 Delivery fees allocated: ${totalDeliveryFee} KES`);
      
      return NextResponse.json({ 
        ResultCode: 0, 
        ResultDesc: 'Success',
        orderId,
        totalDeliveryFee 
      });
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