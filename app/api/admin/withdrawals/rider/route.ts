// app/api/admin/withdrawals/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Withdrawal from "@/models/RiderWithdrawals";
import User from "@/models/user";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    // Build query
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    // Fetch withdrawals with user details
    const withdrawals = await Withdrawal.find(query)
      .populate('userId', 'firstName lastName email phone mpesaNumber')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ requests: withdrawals });
  } catch (error: any) {
    console.error("🔥 Admin withdrawals fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}