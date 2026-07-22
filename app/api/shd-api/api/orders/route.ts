import { NextRequest, NextResponse } from 'next/server';

import '@/shd-models/models/Vendor';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { verifyToken } from '@/shd-lib/lib/auth';
import Order from '@/shd-models/models/Order';




export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await Order.find({ customerId: decoded.userId })
      .populate('vendorId', 'businessName phoneNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}