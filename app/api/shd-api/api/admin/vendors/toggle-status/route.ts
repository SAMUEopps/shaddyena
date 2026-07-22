// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\vendors\toggle-status\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { vendorId, isActive } = body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    vendor.isActive = isActive;
    await vendor.save();

    // Also update user's role if deactivating
    if (!isActive) {
      const user = await User.findById(vendor.userId);
      if (user && user.role === 'vendor') {
        user.role = 'customer';
        await user.save();
      }
    }

    return NextResponse.json({
      message: 'Vendor status updated',
      vendor
    });

  } catch (error) {
    console.error('Toggle vendor status error:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor status' },
      { status: 500 }
    );
  }
}