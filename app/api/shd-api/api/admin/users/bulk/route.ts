// app/api/admin/users/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import User from '@/shd-models/models/User';
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
    const { userIds, action, value } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'No users selected' }, { status: 400 });
    }

    let result;
    if (action === 'delete') {
      result = await User.deleteMany({ _id: { $in: userIds } });
      return NextResponse.json({ 
        success: true, 
        message: `${result.deletedCount} users deleted successfully`,
        deletedCount: result.deletedCount
      });
    }

    if (action === 'updateRole') {
      if (!value || !['customer', 'vendor', 'admin', 'rider'].includes(value)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { role: value }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} users updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'updateMemberStatus') {
      if (typeof value !== 'boolean') {
        return NextResponse.json({ error: 'Invalid member status' }, { status: 400 });
      }
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { 
          isMember: value,
          ...(value ? { memberSince: new Date() } : {})
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} users updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: delete, updateRole, updateMemberStatus' },
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