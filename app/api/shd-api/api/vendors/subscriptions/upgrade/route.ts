// C:\Users\USER\Desktop\Projects\my-app\app\api\vendor\subscriptions\upgrade\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import VendorSubscription from '@/models/VendorSubscription';
import Vendor from '@/models/Vendor';
import { verifyToken } from '@/lib/auth';

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

    const body = await req.json();
    const { subscriptionId } = body;

    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (!subscription.isActive) {
      return NextResponse.json({ error: 'Subscription plan is not available' }, { status: 400 });
    }

    // Deactivate old subscription
    await VendorSubscription.updateMany(
      { vendorId: vendor._id, status: 'active' },
      { status: 'expired' }
    );

    // Calculate end date based on billing cycle
    const startDate = new Date();
    const endDate = new Date();
    switch (subscription.billingCycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Create new subscription
    const vendorSubscription = await VendorSubscription.create({
      vendorId: vendor._id,
      subscriptionId: subscription._id,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true,
      paymentMethod: 'wallet',
      amountPaid: subscription.price,
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
      storageLimit: subscription.storageLimit
    });

    return NextResponse.json({
      message: 'Subscription upgraded successfully',
      subscription: vendorSubscription
    });

  } catch (error) {
    console.error('Upgrade subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
}