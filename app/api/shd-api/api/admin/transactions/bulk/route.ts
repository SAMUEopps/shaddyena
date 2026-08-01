// app/api/admin/transactions/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
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
    const { transactionIds, action, value } = body;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return NextResponse.json({ error: 'No transactions selected' }, { status: 400 });
    }

    let result;
    if (action === 'delete') {
      result = await Transaction.deleteMany({ _id: { $in: transactionIds } });
      return NextResponse.json({ 
        success: true, 
        message: `${result.deletedCount} transactions deleted successfully`,
        deletedCount: result.deletedCount
      });
    }

    if (action === 'updateStatus') {
      const validStatuses = ['pending', 'success', 'failed', 'cancelled'];
      if (!value || !validStatuses.includes(value)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      
      result = await Transaction.updateMany(
        { _id: { $in: transactionIds } },
        { 
          status: value,
          updatedAt: new Date()
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} transactions updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'updateType') {
      const validTypes = ['collection', 'payout', 'refund'];
      if (!value || !validTypes.includes(value)) {
        return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
      }
      
      result = await Transaction.updateMany(
        { _id: { $in: transactionIds } },
        { 
          type: value,
          updatedAt: new Date()
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} transactions updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: delete, updateStatus, updateType' },
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