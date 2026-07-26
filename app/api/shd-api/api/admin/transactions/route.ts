// app/api/admin/transactions/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
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
    const type = searchParams.get('type');
    const phoneNumber = searchParams.get('phoneNumber');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    
    let query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (phoneNumber) query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('orderId', 'orderNumber totalAmount customerName')
      .populate('vendorId', 'businessName businessEmail phoneNumber')
      .sort({ createdAt: -1 });

    // Get summary stats
    const stats = await Transaction.aggregate([
      { $match: query },
      { 
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } },
          totalSuccess: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
          totalFailed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0] } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get status breakdown
    const statusCounts = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get type breakdown
    const typeCounts = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    return NextResponse.json({ 
      success: true,
      transactions,
      total: transactions.length,
      stats: stats[0] || {
        totalAmount: 0,
        totalPending: 0,
        totalSuccess: 0,
        totalFailed: 0,
        count: 0
      },
      statusCounts,
      typeCounts
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
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
    
    // Generate unique transaction ID if not provided
    if (!body.transactionId) {
      body.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    // Generate receipt number if not provided
    if (!body.receiptNumber) {
      body.receiptNumber = `RCP-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
    }

    // Check if order exists if provided
    if (body.orderId) {
      const order = await Order.findById(body.orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    // Check if vendor exists if provided
    if (body.vendorId) {
      const vendor = await Vendor.findById(body.vendorId);
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
    }

    const transaction = await Transaction.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('orderId', 'orderNumber totalAmount customerName')
      .populate('vendorId', 'businessName businessEmail phoneNumber');

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully',
      transaction: populatedTransaction
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating transaction:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Transaction ID already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}