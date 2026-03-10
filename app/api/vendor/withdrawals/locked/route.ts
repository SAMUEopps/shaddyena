// app/api/vendor/withdrawals/locked/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Ledger from '@/models/Ledger';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/user';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET as string) as any;
    
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized - Not a vendor' }, { status: 401 });
    }

    const vendorId = decoded.userId;
    const { fundIds, mpesaNumber, reason } = await req.json();

    if (!fundIds || !Array.isArray(fundIds) || fundIds.length === 0) {
      return NextResponse.json({ message: 'No funds selected' }, { status: 400 });
    }

    if (!mpesaNumber) {
      return NextResponse.json({ message: 'M-PESA number is required' }, { status: 400 });
    }

    // Validate MPESA number format
    const mpesaRegex = /^(07\d{8}|7\d{8}|\+2547\d{8}|2547\d{8})$/;
    if (!mpesaRegex.test(mpesaNumber)) {
      return NextResponse.json({ 
        message: 'Invalid MPESA number format. Use format: 0712345678' 
      }, { status: 400 });
    }

    // Get vendor details
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Get the locked funds
    const funds = await Ledger.find({
      _id: { $in: fundIds.map(id => new Types.ObjectId(id)) },
      vendorId,
      type: 'VENDOR_PAYOUT',
      withdrawalStatus: 'LOCKED',
      status: 'PENDING'
    });

    if (funds.length === 0) {
      return NextResponse.json({ message: 'No valid locked funds found' }, { status: 400 });
    }

    // Check if any fund already has a pending withdrawal request
    const existingRequests = await Withdrawal.find({
      ledgerEntryId: { $in: funds.map(f => f._id) },
      status: { $in: ['PENDING', 'APPROVED'] }
    });

    if (existingRequests.length > 0) {
      return NextResponse.json({ 
        message: 'Some funds already have pending withdrawal requests' 
      }, { status: 400 });
    }

    // Create withdrawal request for each fund
    const withdrawals = [];
    let totalAmount = 0;

    for (const fund of funds) {
      const withdrawal = new Withdrawal({
        vendorId: new Types.ObjectId(vendorId),
        orderId: fund.orderId,
        ledgerEntryId: fund._id,
        amount: fund.amount,
        type: 'REGULAR', // Locked funds are regular (20%)
        reason,
        vendor: {
          mpesaNumber,
          name: `${vendor.firstName} ${vendor.lastName}`,
          businessName: vendor.businessName
        },
        status: 'PENDING',
        metadata: {
          fundType: 'LOCKED',
          originalFund: fund.toObject()
        }
      });

      await withdrawal.save();

      // Update ledger entry
      fund.withdrawalStatus = 'REQUESTED';
      fund.withdrawalRequestId = withdrawal._id;
      await fund.save();

      withdrawals.push(withdrawal);
      totalAmount += fund.amount;
    }

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawals,
      totalAmount,
      count: withdrawals.length
    });
  } catch (error) {
    console.error('Error creating locked fund withdrawal:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}