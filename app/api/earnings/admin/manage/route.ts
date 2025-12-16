import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import VendorEarning from "@/models/VendorEarnings";
import User from "@/models/user";
import { Types } from "mongoose";

interface VendorLean {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  businessName?: string;
}


interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// GET: Get all vendor earnings for admin
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
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const vendorId = searchParams.get("vendorId");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // 3. Build query
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }
    if (vendorId) {
      query.vendorId = vendorId;
    }
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "orderDetails.buyerName": { $regex: search, $options: "i" } },
        { "orderDetails.buyerEmail": { $regex: search, $options: "i" } }
      ];
    }

    // 4. Fetch earnings with pagination
    const [earnings, total] = await Promise.all([
      VendorEarning.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VendorEarning.countDocuments(query)
    ]);

    // 5. Get vendor details for each earning
    const vendorIds = [...new Set(earnings.map(e => e.vendorId))];
    //const vendors = await User.find({ _id: { $in: vendorIds } })
    //  .select("_id firstName lastName businessName")
    //  .lean();

    const vendors = await User.find({ _id: { $in: vendorIds } })
  .select("_id firstName lastName businessName")
  .lean<VendorLean[]>();


    const vendorMap = vendors.reduce((acc, vendor) => {
      acc[vendor._id.toString()] = vendor;
      return acc;
    }, {} as any);

    // 6. Format response with vendor details
    const formattedEarnings = earnings.map(earning => ({
      ...earning,
      vendorDetails: {
        ...earning.vendorDetails,
        firstName: vendorMap[earning.vendorId]?.firstName,
        lastName: vendorMap[earning.vendorId]?.lastName,
        businessName: vendorMap[earning.vendorId]?.businessName
      }
    }));

    // 7. Calculate totals by status
    const totalsByStatus = await VendorEarning.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$netAmount" }
        }
      }
    ]);

    const totalStats = totalsByStatus.reduce((acc, item) => {
      acc[item._id] = { count: item.count, totalAmount: item.totalAmount };
      return acc;
    }, {} as any);

    return NextResponse.json({
      earnings: formattedEarnings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: totalStats,
      success: true
    });
  } catch (error: any) {
    console.error("Admin earnings management error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Update earning status (admin only - for manual adjustments)
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
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    const { earningId, status, notes } = await req.json();

    // 2. Validate status
    const validStatuses = ['PENDING', 'AVAILABLE', 'WITHDRAWN', 'HOLD'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    // 3. Find and update earning
    const earning = await VendorEarning.findById(earningId);
    if (!earning) {
      return NextResponse.json({ message: "Earning not found" }, { status: 404 });
    }

    const oldStatus = earning.status;
    earning.status = status;
    
    if (notes) {
      // Store notes in a separate field or log
    }

    await earning.save();

    // 4. Log the change (you could create an AuditLog model)
    console.log(`Admin ${decoded.userId} changed earning ${earningId} status from ${oldStatus} to ${status}`);

    return NextResponse.json({
      message: "Earning status updated successfully",
      earning,
      success: true
    });
  } catch (error: any) {
    console.error("Admin update earning error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}