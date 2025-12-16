import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import VendorEarning from "@/models/VendorEarnings";

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

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // 3. Build query
    const query: any = { vendorId: decoded.userId };
    if (status !== "all") {
      query.status = status;
    }

    // 4. Fetch transactions with pagination
    const [transactions, total] = await Promise.all([
      VendorEarning.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VendorEarning.countDocuments(query)
    ]);

    // 5. Format response
    const formattedTransactions = transactions.map(earning => ({
      _id: earning._id,
      orderId: earning.orderId,
      amount: earning.amount,
      commission: earning.commission,
      netAmount: earning.netAmount,
      status: earning.status,
      createdAt: earning.createdAt
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      success: true
    });
  } catch (error: any) {
    console.error("Vendor transactions error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}