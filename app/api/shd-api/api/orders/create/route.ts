// app/api/orders/create/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { generateOrderNumber } from '@/shd-lib/lib/utils';
import Order from '@/shd-models/models/Order';
import User from '@/shd-models/models/User';
import Vendor from '@/shd-models/models/Vendor';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { vendorId, products, deliveryAddress, deliveryPhone, shippingMethod, totalAmount } = body;

    // Get vendor details
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Get user to check if they were referred
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate commissions
    // Platform: 2.5%, Referral: 0.5%, Vendor: 97%
    const platformCommission = totalAmount * 0.025;
    const referralCommission = totalAmount * 0.005;
    const vendorAmount = totalAmount - platformCommission - referralCommission;

    // Find the referrer (if the user was referred by someone)
    let referredBy = null;
    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      customerId: decoded.userId,
      vendorId: vendor._id,
      referredBy: referredBy,
      products: products,
      totalAmount: totalAmount,
      platformCommission: platformCommission,
      referralCommission: referralCommission,
      vendorAmount: vendorAmount,
      deliveryAddress,
      deliveryPhone,
      shippingMethod,
      status: 'pending',
      isPaid: false,
      isPayoutComplete: false,
      referralPayoutComplete: false
    });

    await order.save();

    // Update vendor pending payout
    vendor.pendingPayout = (vendor.pendingPayout || 0) + vendorAmount;
    await vendor.save();

    return NextResponse.json({
      success: true,
      order,
      breakdown: {
        totalAmount,
        platformCommission,
        referralCommission,
        vendorAmount
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}