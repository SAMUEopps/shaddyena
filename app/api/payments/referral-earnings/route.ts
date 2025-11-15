import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/user";


/*const REFERRAL_PERCENTAGE = 0.10; // 10%
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 🔐 1️⃣ Extract JWT token from cookies (same as /api/me)
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 🔐 2️⃣ Verify JWT (same as /api/me)
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 🔐 3️⃣ Find the authenticated user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4️⃣ Fetch referred users
    const referredUsers = await User.find({ referredBy: user._id }).select(
      "_id firstName lastName"
    );

    if (referredUsers.length === 0) {
      return NextResponse.json({ totalEarnings: 0, payments: [] });
    }

    const referredUserIds = referredUsers.map(u => u._id);

    // 5️⃣ Get payments from referred users
    const payments = await Payment.find({
      userId: { $in: referredUserIds },
      status: "Completed",
    });

    // 6️⃣ Calculate referral earnings
    const detailedPayments = payments.map(p => ({
      paymentId: p._id,
      amount: p.amount,
      referralBonus: p.amount * REFERRAL_PERCENTAGE,
      user: referredUsers.find(u => u._id.toString() === p.userId.toString()),
    }));

    const totalEarnings = detailedPayments.reduce(
      (sum, p) => sum + p.referralBonus,
      0
    );

    return NextResponse.json({
      totalEarnings,
      payments: detailedPayments,
    });
  } catch (err) {
    console.error("Referral earnings API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}*/


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

    // 🔥 IMPORTANT FIX — match your real schema
    const referredUsers = await User.find({
      referredBy: user.referralCode
    }).select("_id firstName lastName");

    if (referredUsers.length === 0) {
      return NextResponse.json({ totalEarnings: 0, payments: [] });
    }

    const referredUserIds = referredUsers.map(u => u._id);

    const payments = await Payment.find({
      userId: { $in: referredUserIds },
      status: "PAID", // Your model uses "PAID", not "Completed"
    });

    const detailedPayments = payments.map(p => ({
      paymentId: p._id,
      amount: p.amount,
      referralBonus: p.amount * 0.20,
      user: referredUsers.find(u => u._id.toString() === p.userId.toString()),
    }));

    const totalEarnings = detailedPayments.reduce(
      (sum, p) => sum + p.referralBonus,
      0
    );

    return NextResponse.json({
      totalEarnings,
      payments: detailedPayments,
    });

  } catch (err) {
    console.error("Referral earnings API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


/*export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log("[Referral Earnings] DB connected");

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("[Referral Earnings] No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
      console.log("[Referral Earnings] Token decoded:", decoded);
    } catch (e) {
      console.log("[Referral Earnings] Invalid token", e);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("[Referral Earnings] User not found for ID:", decoded.userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[Referral Earnings] Authenticated user:", user._id, user.referralCode);

    // 🔥 Check referred users
    const referredUsers = await User.find({
      referredBy: user.referralCode
    }).select("_id firstName lastName");

    console.log("[Referral Earnings] Referred users found:", referredUsers.length, referredUsers.map(u => u._id));

    if (referredUsers.length === 0) {
      return NextResponse.json({ totalEarnings: 0, payments: [] });
    }

    const referredUserIds = referredUsers.map(u => u._id);

    const payments = await Payment.find({
      userId: { $in: referredUserIds },
      status: "PAID",
    });

    console.log("[Referral Earnings] Payments found:", payments.length, payments.map(p => ({ id: p._id, userId: p.userId, amount: p.amount })));

    const detailedPayments = payments.map(p => ({
      paymentId: p._id,
      amount: p.amount,
      referralBonus: p.amount * 0.10,
      user: referredUsers.find(u => u._id.toString() === p.userId.toString()),
    }));

    console.log("[Referral Earnings] Detailed payments:", detailedPayments);

    const totalEarnings = detailedPayments.reduce(
      (sum, p) => sum + p.referralBonus,
      0
    );

    console.log("[Referral Earnings] Total earnings:", totalEarnings);

    return NextResponse.json({
      totalEarnings,
      payments: detailedPayments,
    });

  } catch (err) {
    console.error("Referral earnings API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
*/
