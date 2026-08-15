import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import User from '@/shd-models/models/User';
import Vendor from '@/shd-models/models/Vendor';
import Order from '@/shd-models/models/Order';
import Investment from '@/shd-models/models/Investment';
import Savings from '@/shd-models/models/Savings';
import Advertisement from '@/shd-models/models/Advertisement';
import VendorSubscription from '@/shd-models/models/VendorSubscription';
import { getAccountBalance, getAccessToken } from '@/shd-lib/lib/mpesa';

// Helper to calculate totals
// function calculateTotals(transactions: any[]) {
//   const totals = {
//     totalCollected: 0,
//     totalPaidOut: 0,
//     totalRevenue: 0,
//     totalFees: 0,
//     totalRefunds: 0,
//     pendingSettlements: 0,
//     byType: {
//       order: 0,
//       membership: 0,
//       savings: 0,
//       investment: 0,
//       payout: 0,
//       refund: 0,
//       advertisement: 0,
//       subscription: 0
//     }
//   };

//   transactions.forEach(t => {
//     const amount = t.amount || 0;
//     totals.byType[t.type] = (totals.byType[t.type] || 0) + amount;

//     if (t.status === 'success') {
//       totals.totalCollected += amount;
//       if (t.type === 'payout') {
//         totals.totalPaidOut += amount;
//       } else if (t.type === 'refund') {
//         totals.totalRefunds += amount;
//       } else {
//         totals.totalRevenue += amount;
//       }
//     }

//     if (t.type === 'order' && t.status === 'pending') {
//       totals.pendingSettlements += amount;
//     }
//   });

//   // Calculate fees (assuming 80% to vendor, 20% platform fee)
//   const platformFees = totals.totalRevenue * 0.2;
//   totals.totalFees = platformFees;

//   return totals;
// }

type TransactionType =
  | 'order'
  | 'membership'
  | 'savings'
  | 'investment'
  | 'payout'
  | 'refund'
  | 'advertisement'
  | 'subscription';

interface TransactionLike {
  amount?: number;
  status: 'success' | 'pending' | 'failed' | 'cancelled';
  type: TransactionType;
}

function calculateTotals(transactions: TransactionLike[]) {
  const totals = {
    totalCollected: 0,
    totalPaidOut: 0,
    totalRevenue: 0,
    totalFees: 0,
    totalRefunds: 0,
    pendingSettlements: 0,

    byType: {
      order: 0,
      membership: 0,
      savings: 0,
      investment: 0,
      payout: 0,
      refund: 0,
      advertisement: 0,
      subscription: 0,
    } satisfies Record<TransactionType, number>,
  };

  transactions.forEach((t) => {
    const amount = t.amount ?? 0;

    totals.byType[t.type] += amount;

    if (t.status === 'success') {
      totals.totalCollected += amount;

      if (t.type === 'payout') {
        totals.totalPaidOut += amount;
      } else if (t.type === 'refund') {
        totals.totalRefunds += amount;
      } else {
        totals.totalRevenue += amount;
      }
    }

    if (t.type === 'order' && t.status === 'pending') {
      totals.pendingSettlements += amount;
    }
  });

  // 20% platform fee
  totals.totalFees = totals.totalRevenue * 0.2;

  return totals;
}

// Get M-Pesa account balance
async function getMpesaBalance() {
  try {
    const balanceResponse = await getAccountBalance();
    // The actual balance is in the response - you'll need to parse it based on your implementation
    // This is a simplified version - adjust based on actual response structure
    return {
      availableBalance: 0, // Parse from balanceResponse
      ledgerBalance: 0, // Parse from balanceResponse
      currency: 'KES',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch M-Pesa balance:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Default to last 30 days if no dates provided
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (period === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = { createdAt: { $gte: weekAgo } };
      } else if (period === 'month') {
        dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
      } else if (period === 'year') {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        dateFilter = { createdAt: { $gte: yearAgo } };
      }
    }

    // Get all transactions
    const transactions = await Transaction.find({
      ...dateFilter,
      status: { $in: ['success', 'pending', 'failed'] }
    }).sort({ createdAt: -1 });

    // Get M-Pesa balance
    const mpesaBalance = await getMpesaBalance();

    // Calculate totals
    const totals = calculateTotals(transactions);

    // Get additional financial data
    const [
      totalVendors,
      totalUsers,
      activeVendors,
      totalOrders,
      pendingPayouts
    ] = await Promise.all([
      Vendor.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'customer' }),
      Vendor.countDocuments({ subscriptionStatus: 'active' }),
      Order.countDocuments({ status: { $in: ['pending', 'processing'] } }),
      Vendor.aggregate([
        { $match: { pendingBalance: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$pendingBalance' } } }
      ])
    ]);

    // Get transactions by day for chart
    const dailyTransactions = await Transaction.aggregate([
      { $match: { ...dateFilter, status: 'success' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      ...dateFilter,
      status: { $in: ['success', 'pending', 'failed'] }
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('userId', 'name email')
    .populate('vendorId', 'businessName');

    // Get top vendors by revenue
    const topVendors = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: '$vendorId',
          totalRevenue: { $sum: '$vendorAmount' },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      { $unwind: '$vendor' }
    ]);

    // Get revenue breakdown by transaction type
    const revenueByType = await Transaction.aggregate([
      { $match: { status: 'success', type: { $ne: 'payout' } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user balances summary
    const userBalances = await User.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$availableBalance' },
          totalSavings: { $sum: '$totalSavings' },
          totalInvested: { $sum: '$totalInvestments' },
          totalReferralEarnings: { $sum: '$referralEarnings' }
        }
      }
    ]);

    // Get vendor balances summary
    const vendorBalances = await Vendor.aggregate([
      {
        $group: {
          _id: null,
          totalAvailable: { $sum: '$availableBalance' },
          totalPending: { $sum: '$pendingBalance' },
          totalRevenue: { $sum: '$totalRevenue' },
          totalLifetimeEarnings: { $sum: '$lifetimeEarnings' }
        }
      }
    ]);

    // Calculate platform health metrics
    const platformMetrics = {
      totalPlatformRevenue: totals.totalRevenue - totals.totalPaidOut - totals.totalRefunds,
      platformFees: totals.totalFees,
      totalVendors: totalVendors,
      activeVendors: activeVendors,
      totalUsers: totalUsers,
      totalOrders: totalOrders,
      pendingPayouts: pendingPayouts[0]?.total || 0,
      userBalances: userBalances[0] || { totalBalance: 0, totalSavings: 0, totalInvested: 0, totalReferralEarnings: 0 },
      vendorBalances: vendorBalances[0] || { totalAvailable: 0, totalPending: 0, totalRevenue: 0, totalLifetimeEarnings: 0 }
    };

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        totals,
        mpesaBalance,
        dailyTransactions,
        recentTransactions,
        topVendors,
        revenueByType,
        platformMetrics,
        period: {
          from: dateFilter.createdAt?.$gte || null,
          to: dateFilter.createdAt?.$lte || new Date()
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Failed to fetch accounting data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounting data' },
      { status: 500 }
    );
  }
}

// Export transactions to CSV
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { startDate, endDate, type } = body;

    // Build query
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (type && type !== 'all') {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('vendorId', 'businessName');

    // Format for CSV
    const csvData = transactions.map(t => ({
      Date: t.createdAt.toISOString().split('T')[0],
      'Transaction ID': t.transactionId,
      'Receipt Number': t.receiptNumber || 'N/A',
      Type: t.type,
      Amount: t.amount,
      Status: t.status,
      Phone: t.phoneNumber,
      'User': t.userId?.name || 'N/A',
      'Vendor': t.vendorId?.businessName || 'N/A',
      'Purpose': t.purpose || 'N/A'
    }));

    return NextResponse.json({
      success: true,
      data: csvData,
      count: csvData.length
    });

  } catch (error) {
    console.error('Failed to export transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}