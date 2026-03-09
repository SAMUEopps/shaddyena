// app/api/admin/rider-balance/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Withdrawal from "@/models/RiderWithdrawals";

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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const riderObjectId = new mongoose.Types.ObjectId(userId);

    // Calculate total earnings from COMPLETED deliveries
    const earningsPipeline = [
      {
        $match: {
          "suborders.riderId": riderObjectId,
          "suborders.status": "COMPLETED"
        }
      },
      { $unwind: "$suborders" },
      {
        $match: {
          "suborders.riderId": riderObjectId,
          "suborders.status": "COMPLETED"
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$suborders.deliveryFee" }
        }
      }
    ];

    const earningsResult = await Order.aggregate(earningsPipeline);
    const totalEarnings = earningsResult[0]?.totalEarnings || 0;

    // Calculate pending withdrawals
    const pendingPipeline = [
      {
        $match: {
          userId: riderObjectId,
          status: { $in: ['PENDING', 'PROCESSING'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: "$amount" }
        }
      }
    ];

    const pendingResult = await Withdrawal.aggregate(pendingPipeline);
    const pendingWithdrawals = pendingResult[0]?.totalPending || 0;

    const availableBalance = totalEarnings - pendingWithdrawals;

    return NextResponse.json({
      userId,
      totalEarnings,
      pendingWithdrawals,
      availableBalance
    });
  } catch (error: any) {
    console.error("🔥 Rider balance fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/admin/rider-balance/route.ts (UPDATED)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import RiderWithdrawal from "@/models/Withdrawal";

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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const riderObjectId = new mongoose.Types.ObjectId(userId);

    // Calculate total earnings from COMPLETED deliveries
    const earningsPipeline = [
      {
        $match: {
          "suborders.riderId": riderObjectId,
          "suborders.status": "COMPLETED"
        }
      },
      { $unwind: "$suborders" },
      {
        $match: {
          "suborders.riderId": riderObjectId,
          "suborders.status": "COMPLETED"
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$suborders.deliveryFee" }
        }
      }
    ];

    console.log("🔍 Admin fetching balance for rider:", userId);
    const earningsResult = await Order.aggregate(earningsPipeline);
    const totalEarnings = earningsResult[0]?.totalEarnings || 0;
    console.log("💰 Total earnings:", totalEarnings);

    // Calculate pending withdrawals (PENDING and PROCESSING)
    const pendingWithdrawalsPipeline = [
      {
        $match: {
          userId: riderObjectId,
          userRole: 'delivery',
          status: { $in: ['PENDING', 'PROCESSING'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: "$amount" }
        }
      }
    ];

    const pendingResult = await RiderWithdrawal.aggregate(pendingWithdrawalsPipeline);
    const pendingWithdrawals = pendingResult[0]?.totalPending || 0;
    console.log("⏳ Pending withdrawals:", pendingWithdrawals);

    // Calculate completed withdrawals (COMPLETED status only)
    const completedWithdrawalsPipeline = [
      {
        $match: {
          userId: riderObjectId,
          userRole: 'delivery',
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: "$amount" }
        }
      }
    ];

    const completedResult = await RiderWithdrawal.aggregate(completedWithdrawalsPipeline);
    const completedWithdrawals = completedResult[0]?.totalCompleted || 0;
    console.log("✅ Completed withdrawals:", completedWithdrawals);

    // Calculate available balance
    const availableBalance = totalEarnings - pendingWithdrawals - completedWithdrawals;
    console.log("💵 Available balance:", availableBalance);

    return NextResponse.json({
      userId,
      totalEarnings,
      pendingWithdrawals,
      completedWithdrawals,
      availableBalance
    });
  } catch (error: any) {
    console.error("🔥 Rider balance fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}