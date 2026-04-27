import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import ReferralWithdrawal from "@/models/RefferalWithdrawal";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const withdrawals = await ReferralWithdrawal.find(query)
      .populate(
        "userId",
        "firstName lastName email phone referralCode referralCount"
      )
      .populate("processedBy", "firstName lastName email")
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ReferralWithdrawal.countDocuments(query);

    return NextResponse.json({
      withdrawals,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Admin referral withdrawals fetch error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}