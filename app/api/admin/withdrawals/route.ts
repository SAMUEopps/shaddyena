// app/api/admin/withdrawals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Withdrawal from '@/models/Withdrawal';
import Ledger from '@/models/Ledger';
import User from '@/models/user';

// GET all withdrawal requests
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Not an admin' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [withdrawals, total] = await Promise.all([
      Withdrawal.find(query)
        .populate('vendorId', 'firstName lastName email businessName phone')
        .populate('processedBy', 'firstName lastName email')
        .populate('admin.approvedBy', 'firstName lastName')
        .populate('admin.rejectedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Withdrawal.countDocuments(query)
    ]);

    // Get statistics
    const stats = await Withdrawal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const statsObject = stats.reduce((acc: any, curr) => {
      acc[curr._id] = { count: curr.count, totalAmount: curr.totalAmount };
      return acc;
    }, {});

    return NextResponse.json({
      withdrawals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: statsObject
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST to approve/reject/process withdrawal
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Not an admin' }, { status: 401 });
    }

    const adminId = decoded.userId;
    const body = await req.json();
    const { withdrawalId, action, notes, mpesaReceipt, rejectionReason } = body;

    if (!withdrawalId || !action) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json({ message: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'PENDING') {
      return NextResponse.json({ message: 'Withdrawal already processed' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      // Update withdrawal
      withdrawal.status = 'APPROVED';
      withdrawal.admin.approvedBy = new Types.ObjectId(adminId);
      withdrawal.admin.approvedAt = new Date();
      withdrawal.adminNotes = notes;
      
      // Update ledger entry
      const ledgerEntry = await Ledger.findById(withdrawal.ledgerEntryId);
      if (ledgerEntry) {
        ledgerEntry.withdrawalStatus = 'PAID';
        ledgerEntry.status = 'PROCESSING';
        ledgerEntry.payoutRef = mpesaReceipt;
        await ledgerEntry.save();
      }

      await withdrawal.save();

      // TODO: Implement M-PESA payment processing here
      // For now, we'll simulate processing
      
      return NextResponse.json({ 
        message: 'Withdrawal approved successfully. Process M-PESA payment.',
        withdrawal 
      });
    } else if (action === 'PROCESS') {
      // Mark as processed after M-PESA payment
      if (!mpesaReceipt) {
        return NextResponse.json({ message: 'MPESA receipt is required' }, { status: 400 });
      }

      withdrawal.status = 'PROCESSED';
      withdrawal.processedBy = new Types.ObjectId(adminId);
      withdrawal.processedAt = new Date();
      withdrawal.mpesaReceipt = mpesaReceipt;
      
      // Update ledger entry
      const ledgerEntry = await Ledger.findById(withdrawal.ledgerEntryId);
      if (ledgerEntry) {
        ledgerEntry.status = 'PAID';
        ledgerEntry.paidAt = new Date();
        ledgerEntry.payoutRef = mpesaReceipt;
        await ledgerEntry.save();
      }

      await withdrawal.save();

      return NextResponse.json({ 
        message: 'Withdrawal processed successfully',
        withdrawal 
      });
    } else if (action === 'REJECT') {
      if (!rejectionReason) {
        return NextResponse.json({ message: 'Rejection reason is required' }, { status: 400 });
      }

      withdrawal.status = 'REJECTED';
      withdrawal.admin.rejectedBy = new Types.ObjectId(adminId);
      withdrawal.admin.rejectedAt = new Date();
      withdrawal.admin.rejectionReason = rejectionReason;
      withdrawal.adminNotes = notes;

      // Update ledger entry to make funds available again
      const ledgerEntry = await Ledger.findById(withdrawal.ledgerEntryId);
      if (ledgerEntry) {
        ledgerEntry.withdrawalStatus = 'AVAILABLE';
        ledgerEntry.withdrawalRequestId = undefined;
        await ledgerEntry.save();
      }

      await withdrawal.save();

      return NextResponse.json({ 
        message: 'Withdrawal rejected successfully',
        withdrawal 
      });
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}