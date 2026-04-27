// app/api/admin/users-referrals/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Payment from "@/models/Payment";

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

    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total referrals (sum of all referralCounts)
    const usersWithReferrals = await User.find({}, 'referralCount');
    const totalReferrals = usersWithReferrals.reduce((sum, u) => sum + (u.referralCount || 0), 0);
    
    // Get top referrer
    const topReferrer = await User.findOne({})
      .sort({ referralCount: -1 })
      .select('firstName lastName email referralCount');
    
    // Calculate total earnings across all users
    const allUsers = await User.find({}, 'referralCode');
    let totalEarnings = 0;
    
    for (const user of allUsers) {
      const referredUsers = await User.find({ referredBy: user.referralCode });
      const referredUserIds = referredUsers.map(u => u._id);
      const payments = await Payment.find({
        userId: { $in: referredUserIds },
        status: "PAID"
      });
      totalEarnings += payments.reduce((sum, p) => sum + (p.amount * 0.20), 0);
    }
    
    // Calculate average referrals per user
    const avgReferralsPerUser = totalUsers > 0 ? (totalReferrals / totalUsers).toFixed(1) : 0;

    return NextResponse.json({
      totalUsers,
      totalReferrals,
      topReferrer,
      totalEarnings,
      avgReferralsPerUser
    });

  } catch (err) {
    console.error("Admin summary API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}