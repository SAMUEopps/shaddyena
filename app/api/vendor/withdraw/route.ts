// app/api/vendor/withdrawals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Ledger from '@/models/Ledger';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/user';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check vendor role
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized - Not a vendor' }, { status: 401 });
    }

    const vendorId = decoded.userId;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const query: any = { vendorId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .populate('processedBy', 'firstName lastName email')
      .lean();

    // Get available balance - only VENDOR_PAYOUT type with status PENDING
    const availableBalance = await Ledger.aggregate([
      {
        $match: {
          vendorId,
          type: 'VENDOR_PAYOUT',
          withdrawalStatus: 'AVAILABLE',
          status: 'PENDING'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get pending withdrawals sum
    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          vendorId,
          status: 'PENDING'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get locked balance (20% portion)
    const lockedBalance = await Ledger.aggregate([
      {
        $match: {
          vendorId,
          type: 'VENDOR_PAYOUT',
          withdrawalStatus: 'LOCKED',
          status: 'PENDING',
          'metadata.isImmediateRelease': false
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get referral earnings
    const referralEarnings = await Ledger.aggregate([
      {
        $match: {
          referrerId: vendorId,
          type: 'REFERRAL_COMMISSION',
          status: 'PENDING'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    return NextResponse.json({
      withdrawals,
      balance: {
        available: availableBalance[0]?.total || 0,
        pendingWithdrawals: pendingWithdrawals[0]?.total || 0,
        netAvailable: (availableBalance[0]?.total || 0) - (pendingWithdrawals[0]?.total || 0),
        locked: lockedBalance[0]?.total || 0,
        referral: referralEarnings[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract JWT token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check vendor role
    if (decoded.role !== 'vendor') {
      return NextResponse.json({ message: 'Unauthorized - Not a vendor' }, { status: 401 });
    }

    const vendorId = decoded.userId;
    const body = await req.json();
    const { ledgerEntryIds, mpesaNumber, reason } = body;

    if (!ledgerEntryIds || !Array.isArray(ledgerEntryIds) || ledgerEntryIds.length === 0) {
      return NextResponse.json({ message: 'No ledger entries selected' }, { status: 400 });
    }

    if (!mpesaNumber) {
      return NextResponse.json({ message: 'MPESA number is required' }, { status: 400 });
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

    // Validate ledger entries
    const ledgerEntries = await Ledger.find({
      _id: { $in: ledgerEntryIds.map((id: string) => new Types.ObjectId(id)) },
      vendorId,
      type: 'VENDOR_PAYOUT',
      withdrawalStatus: 'AVAILABLE',
      status: 'PENDING'
    });

    if (ledgerEntries.length === 0) {
      return NextResponse.json({ message: 'No available funds to withdraw' }, { status: 400 });
    }

    // Check if any entry is already requested
    const alreadyRequested = await Withdrawal.findOne({
      ledgerEntryId: { $in: ledgerEntryIds.map((id: string) => new Types.ObjectId(id)) },
      status: { $in: ['PENDING', 'APPROVED'] }
    });

    if (alreadyRequested) {
      return NextResponse.json({ 
        message: 'Some funds already have pending withdrawal requests' 
      }, { status: 400 });
    }

    // Create withdrawal request for each ledger entry
    const withdrawals = [];
    let totalAmount = 0;
    
    for (const ledgerEntry of ledgerEntries) {
      const withdrawal = new Withdrawal({
        vendorId: new Types.ObjectId(vendorId),
        orderId: ledgerEntry.orderId,
        ledgerEntryId: ledgerEntry._id,
        amount: ledgerEntry.amount,
        type: ledgerEntry.metadata?.isImmediateRelease ? 'IMMEDIATE' : 'REGULAR',
        reason,
        vendor: {
          mpesaNumber,
          name: `${vendor.firstName} ${vendor.lastName}`,
          businessName: vendor.businessName
        },
        status: 'PENDING'
      });

      await withdrawal.save();

      // Update ledger entry status
      ledgerEntry.withdrawalStatus = 'REQUESTED';
      ledgerEntry.withdrawalRequestId = withdrawal._id;
      await ledgerEntry.save();

      withdrawals.push(withdrawal);
      totalAmount += ledgerEntry.amount;
    }

    return NextResponse.json({ 
      message: 'Withdrawal request submitted successfully',
      withdrawals,
      totalAmount,
      withdrawalCount: withdrawals.length
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}