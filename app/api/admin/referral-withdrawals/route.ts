// app/api/admin/referral-withdrawals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WithdrawalRequest from '@/models/WithdrawalRequest';
import User from '@/models/user';
import Ledger from '@/models/Ledger';
import { verify } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all withdrawal requests
    const withdrawals = await WithdrawalRequest.find()
      .populate('userId', 'firstName lastName email phone referralCode referralCount')
      .sort({ requestedAt: -1 });

    // Calculate stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats = {
      totalPending: withdrawals.filter(w => w.status === 'PENDING').length,
      totalProcessing: withdrawals.filter(w => w.status === 'PROCESSING').length,
      totalCompleted: withdrawals.filter(w => w.status === 'COMPLETED').length,
      totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
      averageAmount: withdrawals.length > 0 ? withdrawals.reduce((sum, w) => sum + w.amount, 0) / withdrawals.length : 0,
      pendingAmount: withdrawals.filter(w => w.status === 'PENDING').reduce((sum, w) => sum + w.amount, 0),
      completedThisMonth: withdrawals
        .filter(w => w.status === 'COMPLETED' && new Date(w.processedAt || w.requestedAt) >= startOfMonth)
        .reduce((sum, w) => sum + w.amount, 0)
    };

    return NextResponse.json({ withdrawals, stats });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { withdrawalId, status, transactionId, notes } = await req.json();

    const withdrawal = await WithdrawalRequest.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    withdrawal.status = status;
    withdrawal.processedAt = new Date();
    if (transactionId) withdrawal.transactionId = transactionId;
    if (notes) withdrawal.notes = notes;

    await withdrawal.save();

    // If completed, update the ledger entries
    if (status === 'COMPLETED') {
      await Ledger.updateMany(
        { 
          userId: withdrawal.userId,
          type: 'REFERRAL_BONUS',
          withdrawalStatus: 'PENDING'
        },
        {
          withdrawalStatus: 'WITHDRAWN',
          withdrawnAt: new Date(),
          metadata: { withdrawalId: withdrawal._id, transactionId }
        }
      );
    }

    return NextResponse.json({ success: true, withdrawal });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}