import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Payment from "@/models/Payment";
import ReferralWithdrawal from "@/models/RefferalWithdrawal";

export async function POST(req: NextRequest) {
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

    const { amount, paymentMethod, phoneNumber, bankDetails } =
      await req.json();

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Minimum withdrawal amount is KES 100" },
        { status: 400 }
      );
    }

    // Get referred users
    const referredUsers = await User.find({
      referredBy: user.referralCode,
    }).select("_id");

    if (referredUsers.length === 0) {
      return NextResponse.json(
        { error: "No earnings available for withdrawal" },
        { status: 400 }
      );
    }

    const referredUserIds = referredUsers.map((u) => u._id);

    // Calculate earnings
    const payments = await Payment.find({
      userId: { $in: referredUserIds },
      status: "PAID",
    });

    const totalEarnings = payments.reduce(
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

    const availableBalance =
      totalEarnings - pendingAmount - completedAmount;

    if (amount > availableBalance) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Available: KES ${availableBalance}`,
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (paymentMethod === "mpesa" && !phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required for M-PESA withdrawal" },
        { status: 400 }
      );
    }

    if (
      paymentMethod === "bank" &&
      (!bankDetails?.bankName ||
        !bankDetails?.accountNumber ||
        !bankDetails?.accountName)
    ) {
      return NextResponse.json(
        { error: "Bank details are required for bank withdrawal" },
        { status: 400 }
      );
    }

    // Create referral withdrawal request
    const withdrawal = await ReferralWithdrawal.create({
      userId: user._id,
      amount,
      paymentMethod,
      phoneNumber: paymentMethod === "mpesa" ? phoneNumber : null,
      bankDetails: paymentMethod === "bank" ? bankDetails : null,
      status: "pending",
      requestedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        requestedAt: withdrawal.requestedAt,
      },
    });
  } catch (err) {
    console.error("Referral withdrawal request error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}