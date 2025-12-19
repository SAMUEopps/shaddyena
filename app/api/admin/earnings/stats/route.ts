import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import User from '@/models/user';
import VendorEarnings from '@/models/VendorEarnings';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId).select('-password');
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get statistics using aggregation
    const stats = await VendorEarnings.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
          totalCommission: { $sum: '$commission' },
          totalNetAmount: { $sum: '$netAmount' },
          pendingEarnings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'PENDING'] }, '$netAmount', 0]
            }
          },
          withdrawnEarnings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'WITHDRAWN'] }, '$netAmount', 0]
            }
          }
        }
      }
    ]);

    // Get unique vendors count
    const vendorCount = await VendorEarnings.distinct('vendorId');

    return NextResponse.json({
      totalEarnings: stats[0]?.totalEarnings || 0,
      totalCommission: stats[0]?.totalCommission || 0,
      totalNetAmount: stats[0]?.totalNetAmount || 0,
      pendingEarnings: stats[0]?.pendingEarnings || 0,
      withdrawnEarnings: stats[0]?.withdrawnEarnings || 0,
      totalVendors: vendorCount.length
    });

  } catch (error) {
    console.error('Error fetching earnings stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings statistics' },
      { status: 500 }
    );
  }
}