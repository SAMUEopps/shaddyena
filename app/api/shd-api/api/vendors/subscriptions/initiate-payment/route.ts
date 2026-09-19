// // app/api/shd-api/api/vendor/subscriptions/initiate-payment/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Subscription from '@/shd-models/models/Subscription';
// import Vendor from '@/shd-models/models/Vendor';
// import Transaction from '@/shd-models/models/Transaction';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'vendor') {
//       return NextResponse.json({ error: 'Vendor access required' }, { status: 403 });
//     }

//     const { subscriptionId, phoneNumber, amount } = await req.json();

//     if (!subscriptionId) {
//       return NextResponse.json(
//         { error: 'Subscription ID is required' },
//         { status: 400 }
//       );
//     }

//     // Get subscription details
//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription) {
//       return NextResponse.json(
//         { error: 'Subscription plan not found' },
//         { status: 404 }
//       );
//     }

//     // Get vendor
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     // Use provided amount or subscription price
//     const paymentAmount = amount || subscription.price;

//     // Initialize payment service
//     const paymentService = new MpesaPaymentService(decoded.userId);

//     // Generate account reference for subscription
//     const accountReference = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

//     // Create transaction record
//     const transaction = await Transaction.create({
//       transactionId: `SUB-${Date.now()}`,
//       phoneNumber: phoneNumber || vendor.phoneNumber,
//       amount: paymentAmount,
//       status: 'pending',
//       type: 'subscription',
//       purpose: 'subscription',
//       userId: decoded.userId,
//       accountReference: accountReference,
//       metadata: {
//         subscriptionId: subscriptionId,
//         vendorId: vendor._id,
//         subscriptionName: subscription.name,
//         subscriptionTier: subscription.tier,
//         billingCycle: subscription.billingCycle,
//         features: subscription.features,
//         maxProducts: subscription.maxProducts,
//         maxOrders: subscription.maxOrders,
//         commissionRate: subscription.commissionRate,
//         prioritySupport: subscription.prioritySupport,
//         analyticsAccess: subscription.analyticsAccess,
//         promoFeatures: subscription.promoFeatures,
//         customDomain: subscription.customDomain,
//         apiAccess: subscription.apiAccess,
//         teamMembers: subscription.teamMembers,
//         storageLimit: subscription.storageLimit,
//         accountReference: accountReference,
//         vendorPhone: vendor.phoneNumber
//       }
//     });

//     try {
//       // Initiate STK Push
//       const response = await paymentService.initiatePaymentWithPhone(
//         paymentAmount,
//         'subscription',
//         phoneNumber || vendor.phoneNumber,
//         {
//           subscriptionId: subscriptionId,
//           vendorId: vendor._id,
//           accountReference: accountReference,
//           subscriptionName: subscription.name
//         }
//       );

//       // Update transaction with checkout request ID
//       transaction.checkoutRequestId = response.checkoutRequestId;
//       transaction.metadata = {
//         ...transaction.metadata,
//         checkoutRequestId: response.checkoutRequestId,
//         merchantRequestId: response.merchantRequestId
//       };
//       await transaction.save();

//       return NextResponse.json({
//         success: true,
//         message: 'Payment initiated successfully',
//         checkoutRequestId: response.checkoutRequestId,
//         transactionId: transaction._id
//       });

//     } catch (error: any) {
//       // Update transaction as failed
//       transaction.status = 'failed';
//       transaction.errorMessage = error.message || 'Failed to initiate payment';
//       await transaction.save();

//       return NextResponse.json(
//         { 
//           error: error.message || 'Failed to initiate payment',
//           transactionId: transaction._id
//         },
//         { status: 500 }
//       );
//     }

//   } catch (error) {
//     console.error('Initiate subscription payment error:', error);
//     return NextResponse.json(
//       { error: 'Failed to initiate payment' },
//       { status: 500 }
//     );
//   }
// }


// // app/api/shd-api/api/vendors/subscriptions/initiate-payment/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Subscription from '@/shd-models/models/Subscription';
// import Vendor from '@/shd-models/models/Vendor';
// import Transaction from '@/shd-models/models/Transaction';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'vendor') {
//       return NextResponse.json({ error: 'Vendor access required' }, { status: 403 });
//     }

//     // ✅ Accept organizationId from body
//     const { subscriptionId, phoneNumber, amount, organizationId } = await req.json();

//     if (!subscriptionId) {
//       return NextResponse.json(
//         { error: 'Subscription ID is required' },
//         { status: 400 }
//       );
//     }

//     // ✅ Resolve organizationId with fallbacks
//     const resolvedOrgId = organizationId || (decoded as any).organizationId;

//     if (!resolvedOrgId) {
//       return NextResponse.json(
//         { error: 'Organization ID is required' },
//         { status: 400 }
//       );
//     }

//     // Get subscription details
//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription) {
//       return NextResponse.json(
//         { error: 'Subscription plan not found' },
//         { status: 404 }
//       );
//     }

//     // Get vendor
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     const paymentAmount = amount || subscription.price;
//     const paymentService = new MpesaPaymentService(decoded.userId);

//     const accountReference = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

//     // ✅ Create transaction with all required fields
//     const transaction = await Transaction.create({
//       transactionId: `SUB-${Date.now()}`,
//       organizationId: resolvedOrgId,     // ✅ REQUIRED
//       type: 'payment',                    // ✅ FIXED (was 'subscription')
//       category: 'subscription',           // ✅ REQUIRED
//       currency: 'KES',                    // ✅ explicit
//       provider: 'mpesa',                  // ✅ added
//       phoneNumber: phoneNumber || vendor.phoneNumber,
//       amount: paymentAmount,
//       status: 'pending',
//       purpose: 'subscription',
//       accountReference: accountReference,
//       metadata: {
//         subscriptionId: subscriptionId,
//         vendorId: vendor._id,
//         subscriptionName: subscription.name,
//         subscriptionTier: subscription.tier,
//         billingCycle: subscription.billingCycle,
//         features: subscription.features,
//         maxProducts: subscription.maxProducts,
//         maxOrders: subscription.maxOrders,
//         commissionRate: subscription.commissionRate,
//         prioritySupport: subscription.prioritySupport,
//         analyticsAccess: subscription.analyticsAccess,
//         promoFeatures: subscription.promoFeatures,
//         customDomain: subscription.customDomain,
//         apiAccess: subscription.apiAccess,
//         teamMembers: subscription.teamMembers,
//         storageLimit: subscription.storageLimit,
//         accountReference: accountReference,
//         vendorPhone: vendor.phoneNumber
//       }
//     });

//     try {
//       const response = await paymentService.initiatePaymentWithPhone(
//         paymentAmount,
//         'subscription',
//         phoneNumber || vendor.phoneNumber,
//         {
//           subscriptionId: subscriptionId,
//           vendorId: vendor._id,
//           accountReference: accountReference,
//           subscriptionName: subscription.name
//         }
//       );

//       transaction.checkoutRequestId = response.checkoutRequestId;
//       transaction.metadata = {
//         ...transaction.metadata,
//         checkoutRequestId: response.checkoutRequestId,
//         merchantRequestId: response.merchantRequestId
//       };
//       await transaction.save();

//       return NextResponse.json({
//         success: true,
//         message: 'Payment initiated successfully',
//         checkoutRequestId: response.checkoutRequestId,
//         transactionId: transaction._id
//       });

//     } catch (error: any) {
//       transaction.status = 'failed';
//       transaction.errorMessage = error.message || 'Failed to initiate payment';
//       await transaction.save();

//       return NextResponse.json(
//         {
//           error: error.message || 'Failed to initiate payment',
//           transactionId: transaction._id
//         },
//         { status: 500 }
//       );
//     }

//   } catch (error) {
//     console.error('Initiate subscription payment error:', error);
//     return NextResponse.json(
//       { error: 'Failed to initiate payment' },
//       { status: 500 }
//     );
//   }
// }


// app/api/shd-api/api/vendors/subscriptions/initiate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Subscription from '@/shd-models/models/Subscription';
import Vendor from '@/shd-models/models/Vendor';
import Transaction from '@/shd-models/models/Transaction';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

const LOG_PREFIX = '[SUB-INIT-PAYMENT]';

export async function POST(req: NextRequest) {
  try {
    console.log(`${LOG_PREFIX} ═══════════ REQUEST START ═══════════`);
    console.log(`${LOG_PREFIX} Timestamp:`, new Date().toISOString());

    // ─────────────────────────────────────────────
    // STEP 1: Database connection
    // ─────────────────────────────────────────────
    await connectToDatabase();
    console.log(`${LOG_PREFIX} ✅ SUCCESS: Database connected`);

    // ─────────────────────────────────────────────
    // STEP 2: Authentication
    // ─────────────────────────────────────────────
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: No authorization token in headers`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
      console.log(`${LOG_PREFIX} ✅ SUCCESS: Token verified`, {
        userId: decoded?.userId,
        role: decoded?.role,
        organizationId: (decoded as any)?.organizationId,
      });
    } catch (err: any) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: Token verification failed`, err.message);
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    if (!decoded || decoded.role !== 'vendor') {
      console.error(`${LOG_PREFIX} ❌ FAILURE: Role check failed. Expected 'vendor', got '${decoded?.role}'`);
      return NextResponse.json({ error: 'Vendor access required' }, { status: 403 });
    }
    console.log(`${LOG_PREFIX} ✅ SUCCESS: Vendor role confirmed`);

    // ─────────────────────────────────────────────
    // STEP 3: Parse & validate request body
    // ─────────────────────────────────────────────
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: Failed to parse request body as JSON`);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { subscriptionId, phoneNumber, amount, organizationId } = body;
    console.log(`${LOG_PREFIX} Request body:`, {
      subscriptionId,
      phoneNumber,
      amount,
      organizationId,
    });

    if (!subscriptionId) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: subscriptionId is missing from body`);
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // ─────────────────────────────────────────────
    // STEP 4: Resolve organizationId
    // ─────────────────────────────────────────────
    const resolvedOrgId = organizationId || (decoded as any).organizationId;

    if (!resolvedOrgId) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: organizationId is missing. Body: ${organizationId}, Token: ${(decoded as any).organizationId}`);
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }
    console.log(`${LOG_PREFIX} ✅ SUCCESS: organizationId resolved`, { resolvedOrgId, source: organizationId ? 'body' : 'token' });

    // ─────────────────────────────────────────────
    // STEP 5: Fetch subscription plan
    // ─────────────────────────────────────────────
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: Subscription not found with ID: ${subscriptionId}`);
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
    }
    console.log(`${LOG_PREFIX} ✅ SUCCESS: Subscription found`, {
      name: subscription.name,
      tier: subscription.tier,
      price: subscription.price,
      billingCycle: subscription.billingCycle,
    });

    // ─────────────────────────────────────────────
    // STEP 6: Fetch vendor profile
    // ─────────────────────────────────────────────
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: Vendor profile not found for userId: ${decoded.userId}`);
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }
    console.log(`${LOG_PREFIX} ✅ SUCCESS: Vendor found`, {
      vendorId: vendor._id,
      phoneNumber: vendor.phoneNumber,
    });

    // ─────────────────────────────────────────────
    // STEP 7: Determine payment details
    // ─────────────────────────────────────────────
    const paymentAmount = amount || subscription.price;
    const paymentPhone = phoneNumber || vendor.phoneNumber;

    if (!paymentPhone) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: No phone number available. Body: ${phoneNumber}, Vendor: ${vendor.phoneNumber}`);
      return NextResponse.json({ error: 'Phone number is required for M-Pesa payment' }, { status: 400 });
    }
    console.log(`${LOG_PREFIX} ✅ SUCCESS: Payment details resolved`, {
      paymentAmount,
      paymentPhone,
      amountSource: amount ? 'body' : 'subscription.price',
    });

    const accountReference = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    console.log(`${LOG_PREFIX} Generated accountReference: ${accountReference}`);

    // ─────────────────────────────────────────────
    // STEP 8: Create transaction record
    // ─────────────────────────────────────────────
    let transaction;
    try {
      transaction = await Transaction.create({
        transactionId: `SUB-${Date.now()}`,
        organizationId: resolvedOrgId,
        type: 'payment',
        category: 'subscription',
        currency: 'KES',
        provider: 'mpesa',
        phoneNumber: paymentPhone,
        amount: paymentAmount,
        status: 'pending',
        purpose: 'subscription',
        accountReference: accountReference,
        metadata: {
          subscriptionId: subscriptionId,
          vendorId: vendor._id,
          subscriptionName: subscription.name,
          subscriptionTier: subscription.tier,
          billingCycle: subscription.billingCycle,
          features: subscription.features,
          maxProducts: subscription.maxProducts,
          maxOrders: subscription.maxOrders,
          commissionRate: subscription.commissionRate,
          prioritySupport: subscription.prioritySupport,
          analyticsAccess: subscription.analyticsAccess,
          promoFeatures: subscription.promoFeatures,
          customDomain: subscription.customDomain,
          apiAccess: subscription.apiAccess,
          teamMembers: subscription.teamMembers,
          storageLimit: subscription.storageLimit,
          accountReference: accountReference,
          vendorPhone: vendor.phoneNumber,
        },
      });
      console.log(`${LOG_PREFIX} ✅ SUCCESS: Transaction created`, {
        transactionId: transaction._id,
        transactionRef: transaction.transactionId,
        status: transaction.status,
      });
    } catch (err: any) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: Transaction.create() failed`, {
        message: err.message,
        errors: err.errors, // Mongoose validation errors
      });
      return NextResponse.json({ error: 'Failed to create transaction record', detail: err.message }, { status: 500 });
    }

    // ─────────────────────────────────────────────
    // STEP 9: Initiate M-Pesa payment
    // ─────────────────────────────────────────────
    const paymentService = new MpesaPaymentService(decoded.userId, 
      resolvedOrgId 
    );

    try {
      console.log(`${LOG_PREFIX} ⏳ Calling MpesaPaymentService.initiatePaymentWithPhone...`, {
        amount: paymentAmount,
        purpose: 'subscription',
        phone: paymentPhone,
      });

      const response = await paymentService.initiatePaymentWithPhone(
        paymentAmount,
        'subscription',
        paymentPhone,
        {
          transactionId: transaction.transactionId,
          subscriptionId: subscriptionId,
          vendorId: vendor._id,
          accountReference: accountReference,
          subscriptionName: subscription.name,
        }
      );

      console.log(`${LOG_PREFIX} ✅ SUCCESS: M-Pesa payment initiated`, {
        checkoutRequestId: response.checkoutRequestId,
        merchantRequestId: response.merchantRequestId,
      });

      // ─────────────────────────────────────────────
      // STEP 10: Update transaction with M-Pesa refs
      // ─────────────────────────────────────────────
      transaction.checkoutRequestId = response.checkoutRequestId;
      transaction.metadata = {
        ...transaction.metadata,
        checkoutRequestId: response.checkoutRequestId,
        merchantRequestId: response.merchantRequestId,
      };
      await transaction.save();
      console.log(`${LOG_PREFIX} ✅ SUCCESS: Transaction updated with checkout refs`);

      console.log(`${LOG_PREFIX} ═══════════ REQUEST COMPLETE (SUCCESS) ═══════════`);

      return NextResponse.json({
        success: true,
        message: 'Payment initiated successfully',
        checkoutRequestId: response.checkoutRequestId,
        transactionId: transaction._id,
      });

    } catch (error: any) {
      console.error(`${LOG_PREFIX} ❌ FAILURE: M-Pesa payment initiation failed`, {
        message: error.message,
        stack: error.stack,
      });

      transaction.status = 'failed';
      transaction.errorMessage = error.message || 'Failed to initiate payment';
      await transaction.save();
      console.log(`${LOG_PREFIX} Transaction marked as failed`, { transactionId: transaction._id });

      return NextResponse.json(
        {
          error: error.message || 'Failed to initiate payment',
          transactionId: transaction._id,
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error(`${LOG_PREFIX} 🔥 UNEXPECTED FAILURE: Top-level catch`, {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}