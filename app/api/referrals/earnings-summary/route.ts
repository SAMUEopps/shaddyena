// app/api/referrals/earnings-summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/user";
import ReferralWithdrawal from "@/models/RefferalWithdrawal";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get referred users
    const referredUsers = await User.find({
      referredBy: user.referralCode,
    }).select("_id firstName lastName");

    if (referredUsers.length === 0) {
      return NextResponse.json({
        totalEarnings: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        completedWithdrawals: 0,
        withdrawals: [],
      });
    }

    const referredUserIds = referredUsers.map((u) => u._id);

    // Get all paid payments from referred users
    const payments = await Payment.find({
      userId: { $in: referredUserIds },
      status: "PAID",
    });

    const totalEarnings = payments.reduce(
      (sum, p) => sum + p.amount * 0.2,
      0
    );

    // Get referral withdrawal history
    const withdrawals = await ReferralWithdrawal.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    const pendingWithdrawals = withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0);

    const completedWithdrawals = withdrawals
      .filter((w) => w.status === "completed")
      .reduce((sum, w) => sum + w.amount, 0);

    const availableBalance =
      totalEarnings - pendingWithdrawals - completedWithdrawals;

    return NextResponse.json({
      totalEarnings,
      availableBalance,
      pendingWithdrawals,
      completedWithdrawals,
      withdrawals: withdrawals.map((w) => ({
        id: w._id,
        amount: w.amount,
        status: w.status,
        paymentMethod: w.paymentMethod,
        mpesaTransactionCode: w.mpesaTransactionCode,
        requestedAt: w.requestedAt,
        completedAt: w.completedAt,
        adminNotes: w.adminNotes,
      })),
    });
  } catch (err) {
    console.error("Earnings summary API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}