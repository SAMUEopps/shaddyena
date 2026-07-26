// app/api/admin/riders/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Rider from '@/shd-models/models/Rider';
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
    const { riderIds, action, value } = body;

    if (!riderIds || !Array.isArray(riderIds) || riderIds.length === 0) {
      return NextResponse.json({ error: 'No riders selected' }, { status: 400 });
    }

    let result;
    if (action === 'delete') {
      // Get all riders to update their user roles
      const riders = await Rider.find({ _id: { $in: riderIds } });
      const userIds = riders.map(r => r.userId);
      
      // Update users back to customer
      await User.updateMany(
        { _id: { $in: userIds } },
        { role: 'customer' }
      );

      result = await Rider.deleteMany({ _id: { $in: riderIds } });
      return NextResponse.json({ 
        success: true, 
        message: `${result.deletedCount} riders deleted successfully`,
        deletedCount: result.deletedCount
      });
    }

    if (action === 'updateStatus') {
      if (typeof value !== 'boolean') {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      result = await Rider.updateMany(
        { _id: { $in: riderIds } },
        { isActive: value }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} riders updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'updateAvailability') {
      if (typeof value !== 'boolean') {
        return NextResponse.json({ error: 'Invalid availability value' }, { status: 400 });
      }
      result = await Rider.updateMany(
        { _id: { $in: riderIds } },
        { isAvailable: value }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} riders updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'updateVehicleType') {
      const validTypes = ['MOTORCYCLE', 'BICYCLE', 'CAR', 'VAN'];
      if (!value || !validTypes.includes(value)) {
        return NextResponse.json({ error: 'Invalid vehicle type' }, { status: 400 });
      }
      result = await Rider.updateMany(
        { _id: { $in: riderIds } },
        { vehicleType: value }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} riders updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: delete, updateStatus, updateAvailability, updateVehicleType' },
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