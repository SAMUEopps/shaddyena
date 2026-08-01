// app/api/admin/payouts/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Payout from '@/shd-models/models/Payout';
import Order from '@/shd-models/models/Order';
import Vendor from '@/shd-models/models/Vendor';
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
    const vendorId = searchParams.get('vendorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    
    let query: any = {};
    if (status) query.status = status;
    if (vendorId) query.vendorId = vendorId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { payoutMethod: { $regex: search, $options: 'i' } }
      ];
    }

    const payouts = await Payout.find(query)
      .populate('orderId', 'orderNumber totalAmount customerName customerPhone')
      .populate('vendorId', 'businessName businessEmail phoneNumber businessType')
      .sort({ createdAt: -1 });

    // Get summary stats
    const stats = await Payout.aggregate([
      { $match: query },
      { 
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCommission: { $sum: '$commission' },
          totalPayout: { $sum: '$totalPayout' },
          totalPending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$totalPayout', 0] } },
          totalProcessing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, '$totalPayout', 0] } },
          totalCompleted: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$totalPayout', 0] } },
          totalFailed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$totalPayout', 0] } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get status breakdown
    const statusCounts = await Payout.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalPayout' } } }
    ]);

    return NextResponse.json({ 
      success: true,
      payouts,
      total: payouts.length,
      stats: stats[0] || {
        totalAmount: 0,
        totalCommission: 0,
        totalPayout: 0,
        totalPending: 0,
        totalProcessing: 0,
        totalCompleted: 0,
        totalFailed: 0,
        count: 0
      },
      statusCounts
    });

  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
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
    
    // Check if order exists
    if (body.orderId) {
      const order = await Order.findById(body.orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    // Check if vendor exists
    if (body.vendorId) {
      const vendor = await Vendor.findById(body.vendorId);
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
    }

    // Calculate total payout if not provided
    if (!body.totalPayout && body.amount !== undefined && body.commission !== undefined) {
      body.totalPayout = body.amount - body.commission;
    }

    const payout = await Payout.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const populatedPayout = await Payout.findById(payout._id)
      .populate('orderId', 'orderNumber totalAmount customerName customerPhone')
      .populate('vendorId', 'businessName businessEmail phoneNumber businessType');

    return NextResponse.json({
      success: true,
      message: 'Payout created successfully',
      payout: populatedPayout
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating payout:', error);
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    );
  }
}