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

    // Get vendor summaries using aggregation
    const summaries = await VendorEarnings.aggregate([
      {
        $group: {
          _id: '$vendorId',
          totalEarnings: { $sum: '$amount' },
          totalCommission: { $sum: '$commission' },
          totalNetAmount: { $sum: '$netAmount' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          },
          withdrawnCount: {
            $sum: { $cond: [{ $eq: ['$status', 'WITHDRAWN'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorDetails'
        }
      },
      {
        $unwind: '$vendorDetails'
      },
      {
        $project: {
          vendorId: '$_id',
          vendorName: {
            $concat: ['$vendorDetails.firstName', ' ', '$vendorDetails.lastName']
          },
          businessName: '$vendorDetails.businessName',
          totalEarnings: 1,
          totalCommission: 1,
          totalNetAmount: 1,
          pendingCount: 1,
          withdrawnCount: 1
        }
      },
      {
        $sort: { totalNetAmount: -1 }
      }
    ]);

    return NextResponse.json({
      summaries,
      totalVendors: summaries.length
    });

  } catch (error) {
    console.error('Error fetching vendor summaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor summaries' },
      { status: 500 }
    );
  }
}