// app/api/admin/payouts/[id]/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Payout from '@/shd-models/models/Payout';
import { NextRequest, NextResponse } from 'next/server';

// Next.js 15+ requires async params
type Params = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payout = await Payout.findById(id)
      .populate('orderId', 'orderNumber totalAmount customerName customerPhone status')
      .populate('vendorId', 'businessName businessEmail phoneNumber businessType rating');

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, payout });

  } catch (error) {
    console.error('Error fetching payout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payout' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
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
    
    // Check if payout exists
    const existingPayout = await Payout.findById(id);
    if (!existingPayout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    // Update only allowed fields
    const updateData: any = {};
    const updatableFields = [
      'status', 'amount', 'commission', 'totalPayout', 
      'payoutMethod', 'payoutDetails', 'transactionId',
      'errorMessage', 'retryCount'
    ];

    updatableFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Add updatedAt
    updateData.updatedAt = new Date();

    // If status is completed or failed, update accordingly
    if (body.status === 'completed' && existingPayout.status !== 'completed') {
      // Could trigger additional logic here
      console.log(`Payout ${id} completed`);
    }

    if (body.status === 'failed' && existingPayout.status !== 'failed') {
      // Increment retry count on failure
      updateData.retryCount = (existingPayout.retryCount || 0) + 1;
    }

    const payout = await Payout.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('orderId', 'orderNumber totalAmount customerName')
    .populate('vendorId', 'businessName businessEmail phoneNumber');

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      payout,
      message: 'Payout updated successfully' 
    });

  } catch (error) {
    console.error('Error updating payout:', error);
    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payout = await Payout.findByIdAndDelete(id);

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payout deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting payout:', error);
    return NextResponse.json(
      { error: 'Failed to delete payout' },
      { status: 500 }
    );
  }
}