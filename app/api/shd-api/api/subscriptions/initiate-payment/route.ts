// app/api/shd-api/api/vendor/subscriptions/initiate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Subscription from '@/shd-models/models/Subscription';
import Vendor from '@/shd-models/models/Vendor';
import Transaction from '@/shd-models/models/Transaction';
import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'vendor') {
      return NextResponse.json({ error: 'Vendor access required' }, { status: 403 });
    }

    const { subscriptionId, phoneNumber, amount } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Get subscription details
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Get vendor
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Use provided amount or subscription price
    const paymentAmount = amount || subscription.price;

    // Initialize payment service
    const paymentService = new MpesaPaymentService(decoded.userId);

    // Generate account reference for subscription
    const accountReference = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create transaction record
    const transaction = await Transaction.create({
      transactionId: `SUB-${Date.now()}`,
      phoneNumber: phoneNumber || vendor.phoneNumber,
      amount: paymentAmount,
      status: 'pending',
      type: 'subscription',
      purpose: 'subscription',
      userId: decoded.userId,
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
        vendorPhone: vendor.phoneNumber
      }
    });

    try {
      // Initiate STK Push
      const response = await paymentService.initiatePaymentWithPhone(
        paymentAmount,
        'subscription',
        phoneNumber || vendor.phoneNumber,
        {
          subscriptionId: subscriptionId,
          vendorId: vendor._id,
          accountReference: accountReference,
          subscriptionName: subscription.name
        }
      );

      // Update transaction with checkout request ID
      transaction.checkoutRequestId = response.checkoutRequestId;
      transaction.metadata = {
        ...transaction.metadata,
        checkoutRequestId: response.checkoutRequestId,
        merchantRequestId: response.merchantRequestId
      };
      await transaction.save();

      return NextResponse.json({
        success: true,
        message: 'Payment initiated successfully',
        checkoutRequestId: response.checkoutRequestId,
        transactionId: transaction._id
      });

    } catch (error: any) {
      // Update transaction as failed
      transaction.status = 'failed';
      transaction.errorMessage = error.message || 'Failed to initiate payment';
      await transaction.save();

      return NextResponse.json(
        { 
          error: error.message || 'Failed to initiate payment',
          transactionId: transaction._id
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Initiate subscription payment error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}