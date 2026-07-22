// C:\Users\USER\Desktop\Projects\my-app\app\api\vendor\subscriptions\current\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Vendor from '@/shd-models/models/Vendor';
import VendorSubscription from '@/shd-models/models/VendorSubscription';
import { NextRequest, NextResponse } from 'next/server';


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

    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const subscription = await VendorSubscription.findOne({
      vendorId: vendor._id,
      status: 'active'
    }).populate('subscriptionId');

    return NextResponse.json({ subscription });

  } catch (error) {
    console.error('Fetch vendor subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}