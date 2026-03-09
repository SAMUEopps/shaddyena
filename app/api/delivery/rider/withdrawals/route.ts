// app/api/delivery/rider/withdrawals/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Withdrawal from "@/models/RiderWithdrawals";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// GET - Fetch withdrawal history
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const withdrawals = await Withdrawal.find({ 
      userId: decoded.userId,
      userRole: 'delivery'
    })
    .sort({ createdAt: -1 })
    .limit(20);

    return NextResponse.json({ withdrawals });
  } catch (error: any) {
    console.error("🔥 Withdrawals fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create withdrawal request
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { amount, paymentMethod, phoneNumber } = await req.json();

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { message: "Minimum withdrawal amount is 50 KES" },
        { status: 400 }
      );
    }

    // Validate phone number for M-PESA
    if (paymentMethod === 'M-PESA' && !phoneNumber?.match(/^0?[17]\d{8}$/)) {
      return NextResponse.json(
        { message: "Valid phone number required for M-PESA" },
        { status: 400 }
      );
    }

    // Check balance
    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);
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
    const balance = earningsResult[0]?.totalEarnings || 0;

    // Check pending withdrawals
    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(decoded.userId),
          status: { $in: ['PENDING', 'PROCESSING'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: "$amount" }
        }
      }
    ]);

    const pendingAmount = pendingWithdrawals[0]?.totalPending || 0;
    const availableBalance = balance - pendingAmount;

    if (amount > availableBalance) {
      return NextResponse.json(
        { message: "Insufficient available balance" },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `WDR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: decoded.userId,
      userRole: 'delivery',
      amount,
      paymentMethod,
      phoneNumber: paymentMethod === 'M-PESA' ? phoneNumber : undefined,
      reference,
      status: 'PENDING'
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      withdrawal
    });
  } catch (error: any) {
    console.error("🔥 Withdrawal creation error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/


// app/api/delivery/rider/withdrawals/route.ts (UPDATED)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Withdrawal from "@/models/RiderWithdrawals";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// GET - Fetch withdrawal history
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const withdrawals = await Withdrawal.find({ 
      userId: decoded.userId,
      userRole: 'delivery'
    })
    .sort({ createdAt: -1 })
    .limit(20);

    return NextResponse.json({ withdrawals });
  } catch (error: any) {
    console.error("🔥 Withdrawals fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create withdrawal request
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { amount, paymentMethod, phoneNumber } = await req.json();
    console.log("📝 Withdrawal request:", { amount, paymentMethod, phoneNumber });

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { message: "Minimum withdrawal amount is 50 KES" },
        { status: 400 }
      );
    }

    // Validate phone number for M-PESA
    if (paymentMethod === 'M-PESA' && !phoneNumber?.match(/^0?[17]\d{8}$/)) {
      return NextResponse.json(
        { message: "Valid phone number required for M-PESA" },
        { status: 400 }
      );
    }

    // Check available balance
    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);
    
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
    console.log("💰 Total earnings:", totalEarnings);

    // Calculate pending withdrawals (including this one if we create it)
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

    const pendingResult = await Withdrawal.aggregate(pendingWithdrawalsPipeline);
    const pendingWithdrawals = pendingResult[0]?.totalPending || 0;
    console.log("⏳ Current pending withdrawals:", pendingWithdrawals);

    // Calculate completed withdrawals
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

    const completedResult = await Withdrawal.aggregate(completedWithdrawalsPipeline);
    const completedWithdrawals = completedResult[0]?.totalCompleted || 0;
    console.log("✅ Completed withdrawals:", completedWithdrawals);

    const availableBalance = totalEarnings - pendingWithdrawals - completedWithdrawals;
    console.log("💵 Available balance:", availableBalance);

    if (amount > availableBalance) {
      return NextResponse.json(
        { 
          message: "Insufficient available balance",
          details: {
            totalEarnings,
            pendingWithdrawals,
            completedWithdrawals,
            availableBalance,
            requestedAmount: amount
          }
        },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `WDR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: decoded.userId,
      userRole: 'delivery',
      amount,
      paymentMethod,
      phoneNumber: paymentMethod === 'M-PESA' ? phoneNumber : undefined,
      reference,
      status: 'PENDING'
    });

    console.log("✅ Withdrawal created:", withdrawal._id);

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      withdrawal
    });
  } catch (error: any) {
    console.error("🔥 Withdrawal creation error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}