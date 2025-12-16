import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import VendorEarning from "@/models/VendorEarnings";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import User from "@/models/user";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "vendor") {
      return NextResponse.json({ message: "Vendor access only" }, { status: 403 });
    }

    // 2. Calculate earnings summary
    const [earningsSummary, pendingRequest] = await Promise.all([
      // Calculate earnings by status
      VendorEarning.aggregate([
        { $match: { vendorId: decoded.userId } },
        {
          $group: {
            _id: "$status",
            totalAmount: { $sum: "$netAmount" },
            count: { $sum: 1 }
          }
        }
      ]),
      // Check for pending withdrawal request
      WithdrawalRequest.findOne({
        vendorId: decoded.userId,
        status: "PENDING"
      })
    ]);

    // 3. Transform summary data
    const summary = {
      availableEarnings: 0,
      withdrawnEarnings: 0,
      totalEarnings: 0,
      pendingAmount: 0,
      hasPendingRequest: !!pendingRequest
    };

    earningsSummary.forEach(item => {
      switch (item._id) {
        case 'AVAILABLE':
          summary.availableEarnings = item.totalAmount;
          break;
        case 'WITHDRAWN':
          summary.withdrawnEarnings = item.totalAmount;
          break;
        case 'PENDING':
          summary.pendingAmount = item.totalAmount;
          break;
      }
      summary.totalEarnings += item.totalAmount;
    });

    // 4. Get vendor details
    const vendor = await User.findById(decoded.userId)
      .select("firstName lastName email phone businessName mpesaNumber")
      .lean();

    return NextResponse.json({
      summary,
      vendor,
      success: true
    });
  } catch (error: any) {
    console.error("Vendor earnings error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "vendor") {
      return NextResponse.json({ message: "Vendor access only" }, { status: 403 });
    }

    const { amount } = await req.json();

    // 2. Validate amount
    const availableEarnings = await VendorEarning.aggregate([
      { $match: { vendorId: decoded.userId, status: "AVAILABLE" } },
      { $group: { _id: null, total: { $sum: "$netAmount" } } }
    ]);

    const availableAmount = availableEarnings[0]?.total || 0;
    
    if (amount > availableAmount) {
      return NextResponse.json(
        { message: "Insufficient available earnings" },
        { status: 400 }
      );
    }

    // 3. Check for existing pending request
    const existingRequest = await WithdrawalRequest.findOne({
      vendorId: decoded.userId,
      status: "PENDING"
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "You already have a pending withdrawal request" },
        { status: 400 }
      );
    }

    // 4. Get vendor details
    const vendor = await User.findById(decoded.userId)
      .select("firstName lastName email phone businessName mpesaNumber")
      .lean();

    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    // 5. Get available earnings to withdraw
    const earningsToWithdraw = await VendorEarning.find({
      vendorId: decoded.userId,
      status: "AVAILABLE"
    }).limit(10); // Limit to recent earnings

    if (earningsToWithdraw.length === 0) {
      return NextResponse.json(
        { message: "No available earnings to withdraw" },
        { status: 400 }
      );
    }

    // 6. Create withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      vendorId: decoded.userId,
      /*vendorDetails: {
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        email: vendor.email,
        phone: vendor.phone,
        mpesaNumber: vendor.mpesaNumber,
        businessName: vendor.businessName
      },*/
      earnings: earningsToWithdraw.map(earning => ({
        earningId: earning._id,
        amount: earning.netAmount
      })),
      totalAmount: amount
    });

    await withdrawalRequest.save();

    // 7. Mark earnings as HOLD (temporarily reserved)
    await VendorEarning.updateMany(
      { _id: { $in: earningsToWithdraw.map(e => e._id) } },
      { $set: { status: "HOLD", withdrawalRequestId: withdrawalRequest._id } }
    );

    return NextResponse.json({
      message: "Withdrawal request submitted successfully",
      requestId: withdrawalRequest._id,
      success: true
    });
  } catch (error: any) {
    console.error("Withdrawal request error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}