import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/user";
import { verify } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1️⃣ Extract JWT from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // 3️⃣ Verify user exists
    const user = await User.findById(userId).select("_id isActive");
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "User not found or inactive" },
        { status: 404 }
      );
    }

    // 4️⃣ Fetch payments
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (err) {
    console.error("❌ Error fetching payment history:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
