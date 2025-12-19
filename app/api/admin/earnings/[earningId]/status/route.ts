import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import User from '@/models/user';
import VendorEarnings from '@/models/VendorEarnings';
import dbConnect from '@/lib/dbConnect';

export async function PUT(
  req: NextRequest,
  { params }: { params: { earningId: string } }
) {
  try {
    await dbConnect();

    // Authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId).select('-password');
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const earningId = params.earningId;
    const body = await req.json();
    const { status } = body;

    if (!['AVAILABLE'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const earning = await VendorEarnings.findById(earningId);
    if (!earning) {
      return NextResponse.json({ error: 'Earning not found' }, { status: 404 });
    }

    // Update the earning status
    earning.status = status;
    earning.updatedAt = new Date();
    await earning.save();

    return NextResponse.json({
      message: 'Earning status updated successfully',
      earning: {
        id: earning._id,
        orderId: earning.orderId,
        status: earning.status,
        updatedAt: earning.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating earning status:', error);
    return NextResponse.json(
      { error: 'Failed to update earning status' },
      { status: 500 }
    );
  }
}