// C:\Users\USER\Desktop\Projects\my-app\app\api\vendor\subscriptions\cancel-auto-renew\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
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

    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const subscription = await VendorSubscription.findOneAndUpdate(
      { vendorId: vendor._id, status: 'active' },
      { autoRenew: false },
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Auto-renew cancelled successfully',
      subscription
    });

  } catch (error) {
    console.error('Cancel auto-renew error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel auto-renew' },
      { status: 500 }
    );
  }
}