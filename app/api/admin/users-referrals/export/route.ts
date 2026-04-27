// app/api/admin/users-referrals/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Payment from "@/models/Payment";

type CsvRow = {
  "Full Name": string;
  Email: string;
  Phone: string;
  Role: string;
  Status: string;
  Verified: string;
  "Referral Code": string;
  "Referred By": string;
  "Total Referrals": number;
  "Total Earnings (KES)": string;
  "Joined Date": string;
};

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

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    const csvData: CsvRow[] = [];

    for (const user of users) {
      const referredUsers = await User.find({
        referredBy: user.referralCode,
      });

      const referredUserIds = referredUsers.map((u) => u._id);

      const payments = await Payment.find({
        userId: { $in: referredUserIds },
        status: "PAID",
      });

      const totalEarnings = payments.reduce(
        (sum, p) => sum + (p.amount * 0.2),
        0
      );

      csvData.push({
        "Full Name": `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Phone: user.phone || "N/A",
        Role: user.role,
        Status: user.isActive ? "Active" : "Inactive",
        Verified: user.isVerified ? "Yes" : "No",
        "Referral Code": user.referralCode,
        "Referred By": user.referredBy || "Direct",
        "Total Referrals": user.referralCount || 0,
        "Total Earnings (KES)": totalEarnings.toFixed(2),
        "Joined Date": new Date(user.createdAt).toLocaleDateString(),
      });
    }

    // If no data
    if (csvData.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 400 });
    }

    // Proper typing fix
    const headers = Object.keys(csvData[0]) as (keyof CsvRow)[];

    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
      ),
    ];

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=users-referrals-${
          new Date().toISOString().split("T")[0]
        }.csv`,
      },
    });
  } catch (err) {
    console.error("Export API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}