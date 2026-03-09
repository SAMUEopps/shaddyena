// app/api/admin/withdrawals/process/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Withdrawal from "@/models/RiderWithdrawals";
import Order from "@/models/Order";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function POST(req: NextRequest) {
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

    const { withdrawalId, status, mpesaReceipt, notes } = await req.json();

    if (!withdrawalId || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the withdrawal request
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json(
        { message: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    // Verify balance if completing
    if (status === 'COMPLETED') {
      // Check if rider has sufficient balance
      const riderObjectId = new mongoose.Types.ObjectId(withdrawal.userId);
      
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

      // Check pending withdrawals
      const pendingPipeline = [
        {
          $match: {
            userId: riderObjectId,
            status: { $in: ['PENDING', 'PROCESSING'] },
            _id: { $ne: withdrawal._id } // Exclude current request
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

      if (withdrawal.amount > availableBalance) {
        return NextResponse.json(
          { message: "Insufficient balance for this withdrawal" },
          { status: 400 }
        );
      }

      // Update withdrawal with receipt
      withdrawal.status = 'COMPLETED';
      withdrawal.mpesaReceipt = mpesaReceipt;
      withdrawal.processedAt = new Date();
      withdrawal.notes = notes || withdrawal.notes;
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      withdrawal.status = status;
      withdrawal.notes = notes || `Request ${status.toLowerCase()} by admin`;
    } else if (status === 'PROCESSING') {
      withdrawal.status = 'PROCESSING';
      withdrawal.notes = notes || 'Processing payment';
    }

    await withdrawal.save();

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status.toLowerCase()} successfully`,
      withdrawal
    });
  } catch (error: any) {
    console.error("🔥 Withdrawal processing error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/admin/withdrawals/process/route.ts (UPDATED)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Withdrawal from "@/models/RiderWithdrawals";
import Order from "@/models/Order";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function POST(req: NextRequest) {
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

    const { withdrawalId, status, mpesaReceipt, notes } = await req.json();

    if (!withdrawalId || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the withdrawal request
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json(
        { message: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    console.log("📝 Processing withdrawal:", {
      id: withdrawal._id,
      currentStatus: withdrawal.status,
      newStatus: status,
      amount: withdrawal.amount,
      userId: withdrawal.userId
    });

    // Verify balance if completing
    if (status === 'COMPLETED') {
      // Check if rider has sufficient balance
      const riderObjectId = new mongoose.Types.ObjectId(withdrawal.userId);
      
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

      // Check pending withdrawals (excluding this one)
      const pendingPipeline = [
        {
          $match: {
            userId: riderObjectId,
            userRole: 'delivery',
            status: { $in: ['PENDING', 'PROCESSING'] },
            _id: { $ne: withdrawal._id } // Exclude current request
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

      // Check completed withdrawals
      const completedPipeline = [
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

      const completedResult = await Withdrawal.aggregate(completedPipeline);
      const completedWithdrawals = completedResult[0]?.totalCompleted || 0;

      const availableBalance = totalEarnings - pendingWithdrawals - completedWithdrawals;

      console.log("💰 Balance check:", {
        totalEarnings,
        pendingWithdrawals,
        completedWithdrawals,
        availableBalance,
        requestedAmount: withdrawal.amount
      });

      if (withdrawal.amount > availableBalance) {
        return NextResponse.json(
          { 
            message: "Insufficient balance for this withdrawal",
            details: {
              totalEarnings,
              pendingWithdrawals,
              completedWithdrawals,
              availableBalance,
              requestedAmount: withdrawal.amount
            }
          },
          { status: 400 }
        );
      }

      // Update withdrawal with receipt
      withdrawal.status = 'COMPLETED';
      withdrawal.mpesaReceipt = mpesaReceipt;
      withdrawal.processedAt = new Date();
      withdrawal.notes = notes || withdrawal.notes;
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      withdrawal.status = status;
      withdrawal.notes = notes || `Request ${status.toLowerCase()} by admin`;
    } else if (status === 'PROCESSING') {
      withdrawal.status = 'PROCESSING';
      withdrawal.notes = notes || 'Processing payment';
    }

    await withdrawal.save();

    console.log("✅ Withdrawal processed:", withdrawal.status);

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status.toLowerCase()} successfully`,
      withdrawal
    });
  } catch (error: any) {
    console.error("🔥 Withdrawal processing error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}