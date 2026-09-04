// // app/api/admin/transactions/stats/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Transaction from '@/shd-models/models/Transaction';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const { searchParams } = new URL(req.url);
//     const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y, all

//     // Calculate date range
//     const now = new Date();
//     let startDate = new Date();
//     if (period === '7d') startDate.setDate(now.getDate() - 7);
//     else if (period === '30d') startDate.setDate(now.getDate() - 30);
//     else if (period === '90d') startDate.setDate(now.getDate() - 90);
//     else if (period === '1y') startDate.setFullYear(now.getFullYear() - 1);
//     else if (period === 'all') startDate = new Date(0); // Beginning of time
//     else startDate.setDate(now.getDate() - 30);

//     const matchQuery = period !== 'all' 
//       ? { createdAt: { $gte: startDate } }
//       : {};

//     const [
//       totalTransactions,
//       statusBreakdown,
//       typeBreakdown,
//       dailyStats,
//       monthlyStats,
//       topCustomers,
//       recentTransactions
//     ] = await Promise.all([
//       Transaction.countDocuments(matchQuery),
//       Transaction.aggregate([
//         { $match: matchQuery },
//         { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } }
//       ]),
//       Transaction.aggregate([
//         { $match: matchQuery },
//         { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
//       ]),
//       Transaction.aggregate([
//         { $match: matchQuery },
//         {
//           $group: {
//             _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//             count: { $sum: 1 },
//             total: { $sum: '$amount' },
//             success: { 
//               $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } 
//             },
//             failed: { 
//               $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0] } 
//             }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]),
//       Transaction.aggregate([
//         { $match: matchQuery },
//         {
//           $group: {
//             _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
//             count: { $sum: 1 },
//             total: { $sum: '$amount' }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]),
//       Transaction.aggregate([
//         { $match: { ...matchQuery, phoneNumber: { $ne: null } } },
//         {
//           $group: {
//             _id: '$phoneNumber',
//             count: { $sum: 1 },
//             total: { $sum: '$amount' }
//           }
//         },
//         { $sort: { total: -1 } },
//         { $limit: 10 }
//       ]),
//       Transaction.find(matchQuery)
//         .sort({ createdAt: -1 })
//         .limit(10)
//         .populate('orderId', 'orderNumber totalAmount')
//         .populate('vendorId', 'businessName')
//     ]);

//     // Calculate success rate
//     const totalAttempts = totalTransactions;
//     const successful = statusBreakdown.find((s: any) => s._id === 'success')?.count || 0;
//     const successRate = totalAttempts > 0 ? (successful / totalAttempts) * 100 : 0;

//     return NextResponse.json({
//       success: true,
//       stats: {
//         period,
//         totalTransactions,
//         successRate: successRate.toFixed(2),
//         statusBreakdown,
//         typeBreakdown,
//         dailyStats,
//         monthlyStats,
//         topCustomers,
//         recentTransactions,
//         summary: {
//           totalAmount: statusBreakdown.reduce((sum: number, item: any) => sum + (item.total || 0), 0),
//           totalPending: statusBreakdown.find((s: any) => s._id === 'pending')?.total || 0,
//           totalSuccess: statusBreakdown.find((s: any) => s._id === 'success')?.total || 0,
//           totalFailed: statusBreakdown.find((s: any) => s._id === 'failed')?.total || 0,
//           totalCancelled: statusBreakdown.find((s: any) => s._id === 'cancelled')?.total || 0
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching transaction stats:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch statistics' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/admin/transactions/stats/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Ensure Organization model is registered
    const OrganizationModel = mongoose.models.Organization || Organization;
    
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
    const organizationId = searchParams.get('organizationId');

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    if (period === '7d') startDate.setDate(now.getDate() - 7);
    else if (period === '30d') startDate.setDate(now.getDate() - 30);
    else if (period === '90d') startDate.setDate(now.getDate() - 90);
    else if (period === '1y') startDate.setFullYear(now.getFullYear() - 1);
    else if (period === 'all') startDate = new Date(0); // Beginning of time
    else startDate.setDate(now.getDate() - 30);

    // Build match query
    const matchQuery: any = {};
    if (period !== 'all') {
      matchQuery.createdAt = { $gte: startDate };
    }
    if (organizationId) {
      matchQuery.organizationId = new mongoose.Types.ObjectId(organizationId);
    }

    const [
      totalTransactions,
      statusBreakdown,
      typeBreakdown,
      categoryBreakdown,
      dailyStats,
      monthlyStats,
      topCustomers,
      recentTransactions,
      totalRevenue,
      averageTransactionValue
    ] = await Promise.all([
      Transaction.countDocuments(matchQuery),
      Transaction.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$category', count: { $sum: 1 }, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            total: { $sum: '$amount' },
            success: { 
              $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } 
            },
            failed: { 
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0] } 
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] }
            },
            processing: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, '$amount', 0] }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, '$amount', 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Transaction.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
            total: { $sum: '$amount' },
            success: {
              $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] }
            },
            failed: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Transaction.aggregate([
        { $match: { ...matchQuery, phoneNumber: { $ne: null,  } } },
        {
          $group: {
            _id: '$phoneNumber',
            count: { $sum: 1 },
            total: { $sum: '$amount' },
            average: { $avg: '$amount' },
            lastTransaction: { $max: '$createdAt' },
            transactions: { $push: '$$ROOT' }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]),
      Transaction.find(matchQuery)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: 'organizationId',
          select: 'name email',
          model: OrganizationModel
        }),
      Transaction.aggregate([
        { $match: { ...matchQuery, status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { ...matchQuery, status: 'success' } },
        { $group: { _id: null, average: { $avg: '$amount' } } }
      ])
    ]);

    // Enrich recent transactions with related data
    const enrichedRecentTransactions = await Promise.all(
      recentTransactions.map(async (transaction: any) => {
        const enriched = transaction.toObject();
        // Add any additional enrichment if needed
        return enriched;
      })
    );

    // Calculate success rate
    const totalAttempts = totalTransactions;
    const successful = statusBreakdown.find((s: any) => s._id === 'success')?.count || 0;
    const successRate = totalAttempts > 0 ? (successful / totalAttempts) * 100 : 0;

    // Calculate average transaction amount
    const totalAmount = statusBreakdown.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    // Get organization name if filtering by organization
    let organizationName = null;
    if (organizationId) {
      const org = await OrganizationModel.findById(organizationId).select('name');
      if (org) {
        organizationName = org.name;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        period,
        organizationId: organizationId || null,
        organizationName: organizationName,
        totalTransactions,
        successRate: parseFloat(successRate.toFixed(2)),
        averageAmount: parseFloat(averageAmount.toFixed(2)),
        totalRevenue: totalRevenue[0]?.total || 0,
        averageTransactionValue: averageTransactionValue[0]?.average || 0,
        statusBreakdown,
        typeBreakdown,
        categoryBreakdown,
        dailyStats,
        monthlyStats,
        topCustomers: topCustomers.map((customer: any) => ({
          phoneNumber: customer._id,
          count: customer.count,
          total: customer.total,
          average: parseFloat(customer.average.toFixed(2)),
          lastTransaction: customer.lastTransaction
        })),
        recentTransactions: enrichedRecentTransactions,
        summary: {
          totalAmount,
          totalPending: statusBreakdown.find((s: any) => s._id === 'pending')?.total || 0,
          totalProcessing: statusBreakdown.find((s: any) => s._id === 'processing')?.total || 0,
          totalSuccess: statusBreakdown.find((s: any) => s._id === 'success')?.total || 0,
          totalFailed: statusBreakdown.find((s: any) => s._id === 'failed')?.total || 0,
          totalCancelled: statusBreakdown.find((s: any) => s._id === 'cancelled')?.total || 0,
          byType: typeBreakdown.reduce((acc: any, item: any) => {
            acc[item._id] = { count: item.count, total: item.total };
            return acc;
          }, {}),
          byCategory: categoryBreakdown.reduce((acc: any, item: any) => {
            acc[item._id] = { count: item.count, total: item.total };
            return acc;
          }, {})
        }
      }
    });

  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics: ' + (error as Error).message },
      { status: 500 }
    );
  }
}