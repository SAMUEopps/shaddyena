// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\dashboard\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Vendor from '@/models/Vendor';
import Rider from '@/models/Rider';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Investment from '@/models/Investment';
import Delivery from '@/models/Delivery';
import Payout from '@/models/Payout';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
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

    // Get counts
    const [
      totalUsers,
      totalVendors,
      totalRiders,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalMembers,
      totalInvestments,
      totalDeliveries,
      pendingPayouts,
      recentOrders,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'rider' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      User.countDocuments({ isMember: true }),
      Investment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Delivery.countDocuments(),
      Payout.countDocuments({ status: 'pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('customerId', 'name'),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt')
    ]);

    return NextResponse.json({
      totalUsers,
      totalVendors,
      totalRiders,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalMembers,
      totalInvestments: totalInvestments[0]?.total || 0,
      totalDeliveries,
      pendingPayouts,
      recentOrders,
      recentUsers
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}