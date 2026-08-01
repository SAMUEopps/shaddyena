// app/api/shd-api/api/vendor/subscriptions/current/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import VendorSubscription from '@/shd-models/models/VendorSubscription';
import Vendor from '@/shd-models/models/Vendor';
import Subscription from '@/shd-models/models/Subscription';

export async function GET(req: NextRequest) {
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

    // Get vendor
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Get current active subscription
    const vendorSubscription = await VendorSubscription.findOne({
      vendorId: vendor._id,
      status: 'active'
    }).populate('subscriptionId');

    return NextResponse.json({
      subscription: vendorSubscription || null
    });

  } catch (error) {
    console.error('Fetch current subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current subscription' },
      { status: 500 }
    );
  }
}