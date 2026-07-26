// app/api/admin/riders/stats/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Rider from '@/shd-models/models/Rider';
import { NextRequest, NextResponse } from 'next/server';

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

    const [
      totalRiders,
      activeRiders,
      availableRiders,
      vehicleTypeStats,
      totalEarnings,
      avgRating,
      totalDeliveries,
      recentRiders
    ] = await Promise.all([
      Rider.countDocuments(),
      Rider.countDocuments({ isActive: true }),
      Rider.countDocuments({ isAvailable: true }),
      Rider.aggregate([
        { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
      ]),
      Rider.aggregate([
        { $group: { 
          _id: null, 
          totalEarned: { $sum: '$totalEarned' },
          totalPendingPayout: { $sum: '$pendingPayout' }
        }}
      ]),
      Rider.aggregate([
        { $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' }
        }}
      ]),
      Rider.aggregate([
        { $group: { 
          _id: null, 
          totalDeliveries: { $sum: '$totalDeliveries' }
        }}
      ]),
      Rider.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .select('fullName vehicleType isActive isAvailable totalDeliveries rating')
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalRiders,
        activeRiders,
        availableRiders,
        inactiveRiders: totalRiders - activeRiders,
        vehicleTypes: vehicleTypeStats,
        earnings: totalEarnings[0] || { totalEarned: 0, totalPendingPayout: 0 },
        averageRating: avgRating[0]?.averageRating || 0,
        totalDeliveries: totalDeliveries[0]?.totalDeliveries || 0,
        recentRiders
      }
    });

  } catch (error) {
    console.error('Error fetching rider stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}