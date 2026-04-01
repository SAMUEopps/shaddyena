// app/api/delivery/rider/earnings/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized - Not a rider" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "week";

    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);
    const now = new Date();
    
    let startDate: Date;
    
    if (range === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (range === "month") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Get today's earnings
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    
    // Get week earnings (last 7 days)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    // Get month earnings (last 30 days)
    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);

    const [todayEarningsResult, weekEarningsResult, monthEarningsResult, deliveriesResult] = await Promise.all([
      Order.aggregate([
        { $unwind: "$suborders" },
        { 
          $match: { 
            "suborders.riderId": riderObjectId,
            "suborders.status": { $in: ["DELIVERED", "CONFIRMED"] },
            createdAt: { $gte: todayStart, $lte: todayEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: "$suborders.deliveryFee" } } }
      ]),
      
      Order.aggregate([
        { $unwind: "$suborders" },
        { 
          $match: { 
            "suborders.riderId": riderObjectId,
            "suborders.status": { $in: ["DELIVERED", "CONFIRMED"] },
            createdAt: { $gte: weekStart }
          } 
        },
        { $group: { _id: null, total: { $sum: "$suborders.deliveryFee" } } }
      ]),
      
      Order.aggregate([
        { $unwind: "$suborders" },
        { 
          $match: { 
            "suborders.riderId": riderObjectId,
            "suborders.status": { $in: ["DELIVERED", "CONFIRMED"] },
            createdAt: { $gte: monthStart }
          } 
        },
        { $group: { _id: null, total: { $sum: "$suborders.deliveryFee" } } }
      ]),
      
      Order.aggregate([
        { $unwind: "$suborders" },
        { 
          $match: { 
            "suborders.riderId": riderObjectId,
            "suborders.status": { $in: ["DELIVERED", "CONFIRMED"] }
          } 
        },
        { 
          $group: { 
            _id: null,
            totalDeliveries: { $sum: 1 },
            successfulDeliveries: { 
              $sum: { $cond: [{ $in: ["$suborders.status", ["DELIVERED", "CONFIRMED"]] }, 1, 0] }
            },
            cancelledDeliveries: { 
              $sum: { $cond: [{ $eq: ["$suborders.status", "CANCELLED"] }, 1, 0] }
            },
            totalEarnings: { $sum: "$suborders.deliveryFee" }
          } 
        }
      ])
    ]);

    // Get daily earnings for chart
    const dailyEarnings = await Order.aggregate([
      { $unwind: "$suborders" },
      { 
        $match: { 
          "suborders.riderId": riderObjectId,
          "suborders.status": { $in: ["DELIVERED", "CONFIRMED"] },
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          earnings: { $sum: "$suborders.deliveryFee" },
          deliveries: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const todayEarnings = todayEarningsResult[0]?.total || 0;
    const weekEarnings = weekEarningsResult[0]?.total || 0;
    const monthEarnings = monthEarningsResult[0]?.total || 0;
    const totalDeliveries = deliveriesResult[0]?.totalDeliveries || 0;
    const successfulDeliveries = deliveriesResult[0]?.successfulDeliveries || 0;
    const cancelledDeliveries = deliveriesResult[0]?.cancelledDeliveries || 0;
    const totalEarnings = deliveriesResult[0]?.totalEarnings || 0;
    const averagePerDelivery = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

    return NextResponse.json({
      todayEarnings,
      weekEarnings,
      monthEarnings,
      averagePerDelivery,
      totalDeliveries,
      successfulDeliveries,
      cancelledDeliveries,
      dailyEarnings: dailyEarnings.map(day => ({
        date: day._id,
        earnings: day.earnings,
        deliveries: day.deliveries
      }))
    });
  } catch (error: any) {
    console.error("🔥 Earnings stats API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}