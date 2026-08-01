// app/api/admin/investments/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Investment from '@/shd-models/models/Investment';
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
    const { investmentIds, action, value } = body;

    if (!investmentIds || !Array.isArray(investmentIds) || investmentIds.length === 0) {
      return NextResponse.json({ error: 'No investments selected' }, { status: 400 });
    }

    let result;
    if (action === 'delete') {
      result = await Investment.deleteMany({ _id: { $in: investmentIds } });
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} investments deleted successfully`,
        deletedCount: result.deletedCount
      });
    }

    if (action === 'updateStatus') {
      const validStatuses = ['active', 'completed', 'cancelled'];
      if (!value || !validStatuses.includes(value)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      
      const updateData: any = { status: value };
      
      // If cancelling, set returns to 0
      if (value === 'cancelled') {
        updateData.returns = 0;
        updateData.actualReturn = 0;
      }

      result = await Investment.updateMany(
        { _id: { $in: investmentIds } },
        updateData
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} investments updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'updateType') {
      const validTypes = ['TRANSPORT', 'MARKETING', 'TECHNOLOGY', 'STARTUP'];
      if (!value || !validTypes.includes(value)) {
        return NextResponse.json({ error: 'Invalid investment type' }, { status: 400 });
      }
      
      result = await Investment.updateMany(
        { _id: { $in: investmentIds } },
        { type: value }
      );
      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} investments updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'calculateReturns') {
      // Calculate and update returns for completed investments
      const investments = await Investment.find({ 
        _id: { $in: investmentIds },
        status: 'completed'
      });
      
      let updatedCount = 0;
      for (const investment of investments) {
        if (investment.actualReturn !== undefined) {
          investment.returns = investment.actualReturn;
          await investment.save();
          updatedCount++;
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `${updatedCount} investments returns calculated successfully`,
        modifiedCount: updatedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: delete, updateStatus, updateType, calculateReturns' },
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