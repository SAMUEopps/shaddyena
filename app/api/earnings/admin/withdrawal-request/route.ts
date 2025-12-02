import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import WithdrawalRequest from '@/models/WithdrawalRequest';
import VendorEarnings from '@/models/VendorEarnings';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { verify } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get session
    //const session = await getServerSession();
    //if (!session) {
    //  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   // }

       const token = req.cookies.get('token')?.value;
    if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
    decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    //const user = await User.findById(session.user.id);
    const user = await User.findById(decoded.userId).select('-password');
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status && status !== 'ALL') {
      filter.status = status;
    }

    const [requests, total] = await Promise.all([
      WithdrawalRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('vendorId', 'firstName lastName email phone businessName'),
      WithdrawalRequest.countDocuments(filter)
    ]);

    // Get pending requests count
    const pendingCount = await WithdrawalRequest.countDocuments({ status: 'PENDING' });

    return NextResponse.json({
      requests,
      total,
      pendingCount,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal requests' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    //const session = await getServerSession();
    //if (!session) {
    //  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    //}

    const token = req.cookies.get('token')?.value;
    if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
    decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }


        const userId = user.id;

    // Check if user is admin
    const adminUser = await User.findById(userId.id);
    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, action, notes } = body;

    if (!['APPROVE', 'REJECT', 'PROCESS'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const withdrawalRequest = await WithdrawalRequest.findById(requestId);
    if (!withdrawalRequest) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    let statusUpdate: any;
    let updateEarnings = false;

    switch (action) {
      case 'APPROVE':
        statusUpdate = { status: 'APPROVED', adminNotes: notes };
        break;
      case 'REJECT':
        statusUpdate = { status: 'REJECTED', adminNotes: notes };
        // Reset user's pending request flag
        await User.findByIdAndUpdate(withdrawalRequest.vendorId, {
          hasPendingVendorRequest: false
        });
        break;
      case 'PROCESS':
        statusUpdate = {
          status: 'PROCESSED',
          processedAt: new Date(),
          processedBy: adminUser._id,
          adminNotes: notes
        };
        updateEarnings = true;
        break;
    }

    await WithdrawalRequest.findByIdAndUpdate(requestId, statusUpdate);

    if (updateEarnings) {
      // Update earnings status to WITHDRAWN
      await VendorEarnings.updateMany(
        { _id: { $in: withdrawalRequest.earningsIds } },
        { status: 'WITHDRAWN', withdrawalRequestId: requestId }
      );

      // Reset user's pending request flag
      await User.findByIdAndUpdate(withdrawalRequest.vendorId, {
        hasPendingVendorRequest: false
      });
    }

    return NextResponse.json({
      message: `Withdrawal request ${action.toLowerCase()}d successfully`,
      status: statusUpdate.status
    });

  } catch (error) {
    console.error('Error updating withdrawal request:', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal request' },
      { status: 500 }
    );
  }
}