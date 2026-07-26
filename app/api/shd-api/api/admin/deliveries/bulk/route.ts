// app/api/admin/deliveries/bulk/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Delivery from '@/shd-models/models/Delivery';
import Rider from '@/shd-models/models/Rider';
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
    const { deliveryIds, action, value } = body;

    if (!deliveryIds || !Array.isArray(deliveryIds) || deliveryIds.length === 0) {
      return NextResponse.json({ error: 'No deliveries selected' }, { status: 400 });
    }

    let result;
    if (action === 'delete') {
      result = await Delivery.deleteMany({ _id: { $in: deliveryIds } });
      return NextResponse.json({ 
        success: true, 
        message: `${result.deletedCount} deliveries deleted successfully`,
        deletedCount: result.deletedCount
      });
    }

    if (action === 'updateStatus') {
      const validStatuses = ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'awaiting_confirmation', 'completed', 'cancelled'];
      if (!value || !validStatuses.includes(value)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      
      // Add timestamp for the new status
      const timestampField: any = {};
      if (value === 'accepted') timestampField.acceptedAt = new Date();
      if (value === 'picked_up') timestampField.pickedUpAt = new Date();
      if (value === 'in_transit') timestampField.inTransitAt = new Date();
      if (value === 'delivered') timestampField.deliveredAt = new Date();
      if (value === 'completed') timestampField.completedAt = new Date();

      result = await Delivery.updateMany(
        { _id: { $in: deliveryIds } },
        { 
          status: value,
          ...timestampField
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} deliveries updated successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    if (action === 'assignRider') {
      if (!value) {
        return NextResponse.json({ error: 'Rider ID required' }, { status: 400 });
      }
      
      // Verify rider exists
      const rider = await Rider.findById(value);
      if (!rider) {
        return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
      }

      result = await Delivery.updateMany(
        { _id: { $in: deliveryIds } },
        { 
          assignedRiderId: value,
          status: 'accepted',
          acceptedAt: new Date()
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: `${result.modifiedCount} deliveries assigned successfully`,
        modifiedCount: result.modifiedCount
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: delete, updateStatus, assignRider' },
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