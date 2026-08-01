// app/api/admin/payouts/stats/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Payout from '@/shd-models/models/Payout';
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

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y, all

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    if (period === '7d') startDate.setDate(now.getDate() - 7);
    else if (period === '30d') startDate.setDate(now.getDate() - 30);
    else if (period === '90d') startDate.setDate(now.getDate() - 90);
    else if (period === '1y') startDate.setFullYear(now.getFullYear() - 1);
    else if (period === 'all') startDate = new Date(0);
    else startDate.setDate(now.getDate() - 30);

    const matchQuery = period !== 'all' 
      ? { createdAt: { $gte: startDate } }
      : {};

    const [
      totalPayouts,
      statusBreakdown,
      vendorStats,
      dailyStats,
      monthlyStats,
      topVendors,
      recentPayouts
    ] = await Promise.all([
      Payout.countDocuments(matchQuery),
      Payout.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalPayout' } } }
      ]),
      Payout.aggregate([
        { $match: matchQuery },
        { 
          $group: {
            _id: '$vendorId',
            count: { $sum: 1 },
            totalPayout: { $sum: '$totalPayout' },
            totalCommission: { $sum: '$commission' },
            avgPayout: { $avg: '$totalPayout' }
          }
        },
        { $sort: { totalPayout: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'vendors',
            localField: '_id',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            vendorName: '$vendor.businessName',
            vendorEmail: '$vendor.businessEmail',
            count: 1,
            totalPayout: 1,
            totalCommission: 1,
            avgPayout: 1
          }
        }
      ]),
      Payout.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            total: { $sum: '$totalPayout' },
            commission: { $sum: '$commission' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Payout.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
            total: { $sum: '$totalPayout' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Payout.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$vendorId',
            totalPayout: { $sum: '$totalPayout' },
            count: { $sum: 1 }
          }
        },
        { $sort: { totalPayout: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'vendors',
            localField: '_id',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            vendorName: '$vendor.businessName',
            totalPayout: 1,
            count: 1
          }
        }
      ]),
      Payout.find(matchQuery)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('vendorId', 'businessName businessEmail')
        .populate('orderId', 'orderNumber')
    ]);

    // Calculate success rate
    const completed = statusBreakdown.find((s: any) => s._id === 'completed')?.count || 0;
    const totalAttempts = totalPayouts;
    const successRate = totalAttempts > 0 ? (completed / totalAttempts) * 100 : 0;

    // Calculate average commission rate
    const totalCommission = statusBreakdown.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    const totalPayoutAmount = statusBreakdown.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    const avgCommissionRate = totalPayoutAmount > 0 ? (totalCommission / totalPayoutAmount) * 100 : 0;

    return NextResponse.json({
      success: true,
      stats: {
        period,
        totalPayouts,
        successRate: successRate.toFixed(2),
        avgCommissionRate: avgCommissionRate.toFixed(2),
        statusBreakdown,
        vendorStats,
        dailyStats,
        monthlyStats,
        topVendors,
        recentPayouts,
        summary: {
          totalAmount: statusBreakdown.reduce((sum: number, item: any) => sum + (item.total || 0), 0),
          totalCommission: statusBreakdown.reduce((sum: number, item: any) => sum + (item.total || 0), 0) * (avgCommissionRate / 100),
          totalPending: statusBreakdown.find((s: any) => s._id === 'pending')?.total || 0,
          totalProcessing: statusBreakdown.find((s: any) => s._id === 'processing')?.total || 0,
          totalCompleted: statusBreakdown.find((s: any) => s._id === 'completed')?.total || 0,
          totalFailed: statusBreakdown.find((s: any) => s._id === 'failed')?.total || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching payout stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}