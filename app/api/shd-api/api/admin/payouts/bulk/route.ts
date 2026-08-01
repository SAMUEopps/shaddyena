// app/api/admin/payouts/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Payout from '@/shd-models/models/Payout';
import { NextRequest, NextResponse } from 'next/server';

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
    const { payoutIds, action, value } = body;

    if (!payoutIds || !Array.isArray(payoutIds) || payoutIds.length === 0) {
      return NextResponse.json({ error: 'No payouts selected' }, { status: 400 });
    }

    let result;
    if (action === 'delete') {
      result = await Payout.deleteMany({ _id: { $in: payoutIds } });
      return NextResponse.json({ 
        success: true, 
        message: `${result.deletedCount} payouts deleted successfully`,
        deletedCount: result.deletedCount
      });
    }

    if (action === 'updateStatus') {
      const validStatuses = ['pending', 'processing', 'completed', 'failed'];
      if (!value || !validStatuses.includes(value)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      
      const updateData: any = {
        status: value,
        updatedAt: new Date()
      };

      // If status is failed, increment retry count
      if (value === 'failed') {
        // We need to increment retry count for each document individually
        const payouts = await Payout.find({ _id: { $in: payoutIds } });
        for (const payout of payouts) {
          payout.retryCount = (payout.retryCount || 0) + 1;
          payout.status = value;
          payout.updatedAt = new Date();
          await payout.save();
        }
        return NextResponse.json({ 
          success: true, 
          message: `${payouts.length} payouts updated successfully`,
          modifiedCount: payouts.length
        });
      }

      result = await Payout.updateMany(
        { _id: { $in: payoutIds } },
        updateData
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} payouts updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'process') {
      // Process selected payouts (mark as processing)
      result = await Payout.updateMany(
        { 
          _id: { $in: payoutIds },
          status: { $in: ['pending'] }
        },
        { 
          status: 'processing',
          updatedAt: new Date()
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} payouts are now processing`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'complete') {
      // Complete selected payouts
      result = await Payout.updateMany(
        { 
          _id: { $in: payoutIds },
          status: { $in: ['processing', 'pending'] }
        },
        { 
          status: 'completed',
          updatedAt: new Date()
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} payouts completed successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: delete, updateStatus, process, complete' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}