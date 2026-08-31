// app/api/petty-cash/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';

// Malex organization ID (hardcoded for efficiency)
const MALEX_ORGANIZATION_ID = '6a919e90136d24f1374bc223';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Validate Malex organization exists
    const organization = await Organization.findById(MALEX_ORGANIZATION_ID);
    if (!organization) {
      console.error('Malex organization not found');
      return NextResponse.json(
        {
          success: false,
          error: 'Organization not found'
        },
        { status: 404 }
      );
    }

    // Build filter for Malex organization with petty_cash category
    const filter: any = {
      organizationId: new mongoose.Types.ObjectId(MALEX_ORGANIZATION_ID),
      category: 'petty_cash'
    };

    // Add optional filters
    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
        { accountReference: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { 'metadata.description': { $regex: search, $options: 'i' } },
        { 'metadata.recipientName': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch transactions with pagination
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Transaction.countDocuments(filter)
    ]);

    console.log(`Found ${transactions.length} petty cash transactions for Malex`);

    // Transform transactions for frontend display
    const transformedTransactions = transactions.map(t => {
      const metadata = t.metadata || {};
      
      // Determine display properties
      let displayType = 'transaction';
      let displayCategory = 'Other';
      let description = t.purpose || 'Transaction';
      
      if (t.type === 'deposit') {
        displayType = 'deposit';
        displayCategory = 'Petty Cash Deposit';
        description = t.purpose || metadata.description || 'M-Pesa Deposit';
      } else if (t.type === 'payout') {
        displayType = 'payout';
        displayCategory = metadata.category || 'Expense';
        description = t.purpose || metadata.description || 'Expense Payout';
      } else if (t.type === 'payment') {
        displayType = 'payment';
        displayCategory = 'Payment';
        description = t.purpose || 'Payment';
      }

      // Extract recipient info from metadata
      const recipientName = metadata.recipientName || metadata.recipient || null;
      const recipientPhone = metadata.recipientPhone || metadata.phoneNumber || t.phoneNumber || null;

      // Determine amount sign (positive for deposits, negative for payouts)
      const displayAmount = t.type === 'deposit' ? t.amount : (t.type === 'payout' ? -t.amount : t.amount);

      return {
        ...t,
        id: t._id,
        displayType,
        displayCategory,
        description,
        recipientName,
        recipientPhone,
        displayAmount,
        // Preserve all metadata
        metadata: {
          ...metadata,
          category: displayCategory,
          description: description,
          organizationName: 'Malex'
        },
        // Format dates for display
        formattedCreatedAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : null,
        formattedUpdatedAt: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : null
      };
    });

    // Calculate summary statistics
    const summary = {
      total: transformedTransactions.length,
      totalDeposits: transformedTransactions
        .filter(t => t.type === 'deposit' && t.status === 'success')
        .reduce((sum, t) => sum + t.amount, 0),
      totalPayouts: transformedTransactions
        .filter(t => t.type === 'payout' && t.status === 'success')
        .reduce((sum, t) => sum + t.amount, 0),
      pendingCount: transformedTransactions.filter(t => t.status === 'pending').length,
      processingCount: transformedTransactions.filter(t => t.status === 'processing').length,
      successCount: transformedTransactions.filter(t => t.status === 'success').length,
      failedCount: transformedTransactions.filter(t => t.status === 'failed').length,
      cancelledCount: transformedTransactions.filter(t => t.status === 'cancelled').length,
    };

    // Calculate net balance
    //summary.netBalance = summary.totalDeposits - summary.totalPayouts;

    return NextResponse.json({
      success: true,
      data: {
        transactions: transformedTransactions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1
        },
        summary,
        organization: {
          id: organization._id,
          name: organization.name,
          code: organization.code || 'MALEX'
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching Malex petty cash transactions:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST - Get a specific Malex transaction by ID
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction ID is required'
        },
        { status: 400 }
      );
    }

    // Verify organization exists
    const organization = await Organization.findById(MALEX_ORGANIZATION_ID);
    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          error: 'Malex organization not found'
        },
        { status: 404 }
      );
    }

    // Find transaction (only if it belongs to Malex)
    const transaction = await Transaction.findOne({
      transactionId: transactionId,
      organizationId: new mongoose.Types.ObjectId(MALEX_ORGANIZATION_ID),
      category: 'petty_cash'
    }).lean();

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        id: transaction._id,
        organization: {
          id: organization._id,
          name: organization.name
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching Malex transaction:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}