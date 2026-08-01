// app/api/admin/investments/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Investment from '@/shd-models/models/Investment';
import User from '@/shd-models/models/User';
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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    let query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const investments = await Investment.find(query)
      .populate('userId', 'name email phoneNumber isMember')
      .sort(sortOptions);

    // Get summary stats
    const stats = await Investment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalInvestments: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalReturns: { $sum: '$returns' },
          totalExpectedReturn: { $sum: '$expectedReturn' },
          avgAmount: { $avg: '$amount' },
          avgReturns: { $avg: '$returns' },
          avgExpectedReturn: { $avg: '$expectedReturn' },
          activeCount: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelledCount: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          activeAmount: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, '$amount', 0] } },
          completedAmount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } }
        }
      }
    ]);

    // Get type breakdown
    const typeBreakdown = await Investment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalReturns: { $sum: '$returns' }
        }
      }
    ]);

    // Get status breakdown
    const statusBreakdown = await Investment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get monthly trends
    const monthlyTrends = await Investment.aggregate([
      { $match: query },
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
    ]);

    return NextResponse.json({
      success: true,
      investments,
      total: investments.length,
      stats: stats[0] || {
        totalInvestments: 0,
        totalAmount: 0,
        totalReturns: 0,
        totalExpectedReturn: 0,
        avgAmount: 0,
        avgReturns: 0,
        avgExpectedReturn: 0,
        activeCount: 0,
        completedCount: 0,
        cancelledCount: 0,
        activeAmount: 0,
        completedAmount: 0
      },
      typeBreakdown,
      statusBreakdown,
      monthlyTrends
    });

  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    
    // Check if user exists
    const user = await User.findById(body.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate end date based on duration
    const startDate = body.startDate ? new Date(body.startDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + body.duration);

    const investment = await Investment.create({
      ...body,
      startDate,
      endDate,
      createdAt: new Date()
    });

    const populatedInvestment = await Investment.findById(investment._id)
      .populate('userId', 'name email phoneNumber isMember');

    return NextResponse.json({
      success: true,
      message: 'Investment created successfully',
      investment: populatedInvestment
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}