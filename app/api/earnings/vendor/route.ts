import { NextRequest, NextResponse } from 'next/server';
import VendorEarnings from '@/models/VendorEarnings';
import WithdrawalRequest from '@/models/WithdrawalRequest';
import User from '@/models/user';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get session or use your auth method
    //const session = await getServerSession();
   // if (!session) {
  //    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //  }

    // Extract JWT token from cookies
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

    // Get vendor earnings summary
    const earnings = await VendorEarnings.aggregate([
      {
        $match: {
          vendorId: new Types.ObjectId(userId),
          status: { $in: ['PENDING', 'PAID'] }
        }
      },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$netAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const availableEarnings = earnings.find(e => e._id === 'PENDING')?.totalAmount || 0;
    const withdrawnEarnings = earnings.find(e => e._id === 'WITHDRAWN')?.totalAmount || 0;
    const totalEarnings = earnings.reduce((sum, e) => sum + e.totalAmount, 0);

    // Check if user has pending withdrawal request
    //const user = await User.findById(userId);
    const hasPendingRequest = user?.hasPendingVendorRequest || false;

    return NextResponse.json({
      availableEarnings,
      withdrawnEarnings,
      totalEarnings,
      hasPendingRequest,
      earningsBreakdown: earnings
    });

  } catch (error) {
    console.error('Error fetching vendor earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor earnings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
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
    const body = await req.json();
    const { amount } = body;

    // Get vendor details
    const vendor = await User.findById(userId);
    if (!vendor || vendor.role !== 'vendor') {
      return NextResponse.json({ error: 'Only vendors can request withdrawals' }, { status: 403 });
    }

    // Check if vendor already has a pending request
    if (vendor.hasPendingVendorRequest) {
      return NextResponse.json(
        { error: 'You already have a pending withdrawal request' },
        { status: 400 }
      );
    }

    // Get available earnings
    const availableEarnings = await VendorEarnings.find({
      vendorId: userId,
      status: 'PENDING'
    });

    if (availableEarnings.length === 0) {
      return NextResponse.json(
        { error: 'No available earnings to withdraw' },
        { status: 400 }
      );
    }

    const totalAvailable = availableEarnings.reduce((sum, earning) => sum + earning.netAmount, 0);
    
    if (amount > totalAvailable) {
      return NextResponse.json(
        { error: `Requested amount exceeds available earnings. Maximum: KSh ${totalAvailable.toFixed(2)}` },
        { status: 400 }
      );
    }

    // Create withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      vendorId: userId,
      vendor: {
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        businessName: vendor.businessName,
        mpesaNumber: vendor.mpesaNumber
      },
      earningsIds: availableEarnings.map(e => e._id),
      totalAmount: amount,
      status: 'PENDING'
    });

    await withdrawalRequest.save();

    // Update user's hasPendingVendorRequest flag
    await User.findByIdAndUpdate(userId, {
      hasPendingVendorRequest: true
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      requestId: withdrawalRequest._id,
      amount: withdrawalRequest.totalAmount
    });

  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    return NextResponse.json(
      { error: 'Failed to create withdrawal request' },
      { status: 500 }
    );
  }
}