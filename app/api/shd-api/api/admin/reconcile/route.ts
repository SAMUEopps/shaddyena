import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Payout from '@/models/Payout';
import { getAccountBalance } from '@/lib/mpesa';
import { verifyToken } from '@/lib/auth';
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    // Get M-Pesa balance
    const balanceResponse = await getAccountBalance();

    // Get today's collections
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const collections = await Transaction.find({
      type: 'collection',
      status: 'success',
      createdAt: { $gte: today }
    });

    const totalCollected = collections.reduce((sum, t) => sum + t.amount, 0);

    // Get today's payouts
    const payouts = await Payout.find({
      status: 'completed',
      createdAt: { $gte: today }
    });

    const totalPayouts = payouts.reduce((sum, p) => sum + p.totalPayout, 0);

    // Get pending payouts
    const pendingPayouts = await Payout.find({
      status: { $in: ['pending', 'processing'] }
    });

    const totalPendingPayouts = pendingPayouts.reduce((sum, p) => sum + p.totalPayout, 0);

    // Get failed payouts
    const failedPayouts = await Payout.find({
      status: 'failed'
    });

    const totalFailedPayouts = failedPayouts.reduce((sum, p) => sum + p.totalPayout, 0);

    // Calculate commissions
    const commissions = collections.reduce((sum, t) => {
      // Commission is 10% of collection
      return sum + (t.amount * 0.1);
    }, 0);

    const reconciliation = {
      date: today,
      mpesaBalance: balanceResponse,
      totalCollected,
      totalPayouts,
      totalPendingPayouts,
      totalFailedPayouts,
      commissions,
      netBalance: totalCollected - totalPayouts - commissions,
      collectionsCount: collections.length,
      payoutsCount: payouts.length,
      pendingCount: pendingPayouts.length,
      failedCount: failedPayouts.length
    };

    return NextResponse.json(reconciliation);

  } catch (error) {
    console.error('Reconciliation error:', error);
    return NextResponse.json(
      { error: 'Reconciliation failed' },
      { status: 500 }
    );
  }
}