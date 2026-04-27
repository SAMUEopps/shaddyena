import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Payment from "@/models/Payment";
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    const isActive = searchParams.get("isActive");
    const isVerified = searchParams.get("isVerified");
    const minReferrals = searchParams.get("minReferrals");
    const search = searchParams.get("search");

    // Build query
    const query: any = {};

    if (role && role !== "all") query.role = role;

    if (isActive && isActive !== "all") {
      query.isActive = isActive === "true";
    }

    if (isVerified && isVerified !== "all") {
      query.isVerified = isVerified === "true";
    }

    if (minReferrals && minReferrals !== "all") {
      query.referralCount = { $gte: parseInt(minReferrals) };
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { referralCode: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const usersWithReferrals = await Promise.all(
      users.map(async (user) => {
        // Referred users
        const referredUsers = await User.find({
          referredBy: user.referralCode,
        }).select(
          "firstName lastName email phone role createdAt isActive isVerified"
        );

        const referredUserIds = referredUsers.map((u) => u._id);

        // Earnings from referrals
        const payments = await Payment.find({
          userId: { $in: referredUserIds },
          status: "PAID",
        });

        const totalEarningsFromReferrals = payments.reduce(
          (sum, p) => sum + p.amount * 0.2,
          0
        );

        // Referral withdrawals (UPDATED MODEL)
        const pendingWithdrawals = await ReferralWithdrawal.find({
          userId: user._id,
          status: "pending",
        });

        const completedWithdrawals = await ReferralWithdrawal.find({
          userId: user._id,
          status: "completed",
        });

        const pendingAmount = pendingWithdrawals.reduce(
          (sum, w) => sum + w.amount,
          0
        );

        const completedAmount = completedWithdrawals.reduce(
          (sum, w) => sum + w.amount,
          0
        );

        return {
          ...user.toObject(),
          referredUsers,
          totalEarningsFromReferrals,
          pendingWithdrawals: pendingAmount,
          completedWithdrawals: completedAmount,
        };
      })
    );

    return NextResponse.json({
      users: usersWithReferrals,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Admin users-referrals API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}