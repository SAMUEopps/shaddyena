// app/api/admin/investments/stats/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Investment from '@/shd-models/models/Investment';
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
      totalInvestments,
      statusBreakdown,
      typeBreakdown,
      performanceStats,
      monthlyTrends,
      topInvestors,
      roiStats
    ] = await Promise.all([
      Investment.countDocuments(matchQuery),
      Investment.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
      ]),
      Investment.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$type', count: { $sum: 1 }, totalAmount: { $sum: '$amount' }, totalReturns: { $sum: '$returns' } } }
      ]),
      Investment.aggregate([
        { $match: { ...matchQuery, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalInvested: { $sum: '$amount' },
            totalReturns: { $sum: '$returns' },
            avgReturn: { $avg: '$returns' },
            avgReturnRate: { 
              $avg: { 
                $multiply: [
                  { $divide: ['$returns', '$amount'] },
                  100
                ]
              }
            },
            bestPerformer: { $max: { $divide: ['$returns', '$amount'] } },
            worstPerformer: { $min: { $divide: ['$returns', '$amount'] } }
          }
        }
      ]),
      Investment.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
      Investment.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$userId',
            totalInvested: { $sum: '$amount' },
            totalReturns: { $sum: '$returns' },
            count: { $sum: 1 }
          }
        },
        { $sort: { totalInvested: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            userName: '$user.name',
            userEmail: '$user.email',
            totalInvested: 1,
            totalReturns: 1,
            count: 1,
            avgReturnRate: {
              $multiply: [
                { $divide: ['$totalReturns', '$totalInvested'] },
                100
              ]
            }
          }
        }
      ]),
      Investment.aggregate([
        { $match: { ...matchQuery, status: 'completed' } },
        {
          $group: {
            _id: null,
            avgROI: { 
              $avg: { 
                $multiply: [
                  { $divide: ['$returns', '$amount'] },
                  100
                ]
              }
            },
            totalROI: { 
              $sum: { 
                $multiply: [
                  { $divide: ['$returns', '$amount'] },
                  100
                ]
              }
            },
            maxROI: { 
              $max: { 
                $multiply: [
                  { $divide: ['$returns', '$amount'] },
                  100
                ]
              }
            },
            minROI: { 
              $min: { 
                $multiply: [
                  { $divide: ['$returns', '$amount'] },
                  100
                ]
              }
            }
          }
        }
      ])
    ]);

    // Calculate success rate (completed vs total)
    const completedCount = statusBreakdown.find((s: any) => s._id === 'completed')?.count || 0;
    const successRate = totalInvestments > 0 ? (completedCount / totalInvestments) * 100 : 0;

    return NextResponse.json({
      success: true,
      stats: {
        period,
        totalInvestments,
        successRate: successRate.toFixed(2),
        statusBreakdown,
        typeBreakdown,
        performanceStats: performanceStats[0] || {
          totalInvested: 0,
          totalReturns: 0,
          avgReturn: 0,
          avgReturnRate: 0,
          bestPerformer: 0,
          worstPerformer: 0
        },
        monthlyTrends,
        topInvestors,
        roiStats: roiStats[0] || {
          avgROI: 0,
          totalROI: 0,
          maxROI: 0,
          minROI: 0
        },
        summary: {
          totalInvested: statusBreakdown.reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0),
          totalReturns: typeBreakdown.reduce((sum: number, item: any) => sum + (item.totalReturns || 0), 0),
          activeAmount: statusBreakdown.find((s: any) => s._id === 'active')?.totalAmount || 0,
          completedAmount: statusBreakdown.find((s: any) => s._id === 'completed')?.totalAmount || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching investment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}