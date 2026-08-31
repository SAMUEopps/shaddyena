// app/api/petty-cash/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Budget from '@/shd-models/models/Budget';
import Organization from '@/shd-models/models/Organization';
import mongoose from 'mongoose';

// Malex organization ID
const MALEX_ORGANIZATION_ID = '6a919e90136d24f1374bc223';

// GET - Fetch all expense requests for Malex organization
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Verify Malex organization exists
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

    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter for Malex organization
    const filter: any = {
      organizationId: new mongoose.Types.ObjectId(MALEX_ORGANIZATION_ID)
    };

    // Add optional filters
    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
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
        { description: { $regex: search, $options: 'i' } },
        { recipientName: { $regex: search, $options: 'i' } },
        { recipientPhone: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { 'metadata.transactionId': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch expense requests with pagination
    const [requests, totalCount] = await Promise.all([
      ExpenseRequest.find(filter)
        .populate('requesterId', 'name email')
        .populate('approverId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      ExpenseRequest.countDocuments(filter)
    ]);

    console.log(`Found ${requests.length} expense requests for Malex`);

    // Transform requests for frontend display
    const transformedRequests = requests.map(req => {
      // Calculate platform fee if not present
      const platformFee = req.platformFee || (req.amount * 0.015);
      const totalAmount = req.totalAmount || (req.amount + platformFee);

      // Format requester name
      const requesterName = req.requesterId 
        ? typeof req.requesterId === 'object' && 'name' in req.requesterId 
          ? req.requesterId.name 
          : 'Unknown'
        : 'Unknown';

      const requesterEmail = req.requesterId 
        ? typeof req.requesterId === 'object' && 'email' in req.requesterId 
          ? req.requesterId.email 
          : null
        : null;

      // Format approver name
      const approverName = req.approverId 
        ? typeof req.approverId === 'object' && 'name' in req.approverId 
          ? req.approverId.name 
          : null
        : null;

      const approverEmail = req.approverId 
        ? typeof req.approverId === 'object' && 'email' in req.approverId 
          ? req.approverId.email 
          : null
        : null;

      return {
        ...req,
        id: req._id,
        platformFee,
        totalAmount,
        requesterName,
        requesterEmail,
        approverName,
        approverEmail,
        displayAmount: -req.amount, // Negative for expense
        // Format dates for display
        formattedCreatedAt: req.createdAt ? new Date(req.createdAt).toLocaleString() : null,
        formattedUpdatedAt: req.updatedAt ? new Date(req.updatedAt).toLocaleString() : null,
        formattedApprovedAt: req.approvedAt ? new Date(req.approvedAt).toLocaleString() : null,
        formattedPaidAt: req.paidAt ? new Date(req.paidAt).toLocaleString() : null,
        // Add organization info
        organization: {
          id: organization._id,
          name: organization.name
        },
        metadata: {
          ...req.metadata,
          organizationName: 'Malex'
        }
      };
    });

    // Calculate summary statistics
    // const summary = {
    //   total: transformedRequests.length,
    //   pending: transformedRequests.filter(r => r.status === 'pending').length,
    //   approved: transformedRequests.filter(r => r.status === 'approved').length,
    //   paid: transformedRequests.filter(r => r.status === 'paid').length,
    //   rejected: transformedRequests.filter(r => r.status === 'rejected').length,
    //   failed: transformedRequests.filter(r => r.status === 'failed').length,
    //   processing: transformedRequests.filter(r => r.status === 'processing').length,
    //   totalAmount: transformedRequests.reduce((sum, r) => sum + r.amount, 0),
    //   totalPlatformFees: transformedRequests.reduce((sum, r) => sum + (r.platformFee || 0), 0),
    //   totalWithFees: transformedRequests.reduce((sum, r) => sum + (r.totalAmount || r.amount + (r.platformFee || 0)), 0)
    // };

    return NextResponse.json({
      success: true,
      data: {
        requests: transformedRequests,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1
        },
        //summary,
        organization: {
          id: organization._id,
          name: organization.name
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching expense requests for Malex:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new expense request for Malex organization
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      amount,
      recipientPhone,
      recipientName,
      category,
      description,
      receiptUrl,
      userId
    } = body;

    // Validate required fields
    if (!amount || amount < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount. Minimum KSh 1'
        },
        { status: 400 }
      );
    }

    if (!recipientPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipient phone number is required'
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // Normalize phone number
    const cleanPhone = recipientPhone.replace(/[+\s]/g, '');

    if (!/^254[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Kenyan phone number format'
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify Malex organization exists
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

    console.log('Creating expense request for Malex organization');

    // Get active budget for Malex organization
    const budget = await Budget.findOne({
      status: 'active',
      organizationId: new mongoose.Types.ObjectId(MALEX_ORGANIZATION_ID)
    }).sort({ createdAt: -1 });

    if (!budget) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active budget found for Malex. Please create a budget first.'
        },
        { status: 400 }
      );
    }

    console.log('Using active budget:', budget._id);

    // Calculate platform fee
    const platformFeePercentage = 0.015; // 1.5%
    const platformFee = Number(amount) * platformFeePercentage;
    const totalAmount = Number(amount) + platformFee;

    // Check available budget
    if (totalAmount > budget.remainingAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient budget. Required: KES ${totalAmount.toFixed(2)} ` +
            `(${Number(amount).toFixed(2)} + ${platformFee.toFixed(2)} fee), ` +
            `Available: KES ${Number(budget.remainingAmount).toFixed(2)}`
        },
        { status: 400 }
      );
    }

    // Create expense request with organizationId
    const expenseRequest = await ExpenseRequest.create({
      amount: Number(amount),
      platformFee,
      totalAmount,
      recipientPhone: cleanPhone,
      recipientName: recipientName || 'Unknown',
      category: category || 'other',
      description: description || 'Expense request',
      status: 'pending',
      requesterId: new mongoose.Types.ObjectId(userId),
      organizationId: new mongoose.Types.ObjectId(MALEX_ORGANIZATION_ID),
      receiptUrl: receiptUrl || '',
      metadata: {
        budgetId: budget._id,
        createdAt: new Date().toISOString(),
        platformFeePercentage: platformFeePercentage * 100,
        createdBy: userId,
        organizationName: 'Malex',
        budgetName: budget.name || 'Active Budget'
      }
    });

    console.log('Created expense request:', expenseRequest._id);

    // Populate requester info for response
    const populatedRequest = await ExpenseRequest.findById(expenseRequest._id)
      .populate('requesterId', 'name email')
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          request: {
            ...populatedRequest,
            //id: populatedRequest._id,
            organization: {
              id: organization._id,
              name: organization.name
            }
          }
        },
        message: 'Request created successfully. Awaiting approval.'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating expense request:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}