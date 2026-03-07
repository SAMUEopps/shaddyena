// app/api/delivery/rider/earnings/route.ts
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

    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);

    // Aggregation pipeline to calculate total earnings from COMPLETED deliveries
    const earningsPipeline = [
      {
        $match: {
          "suborders.riderId": riderObjectId,
          "suborders.status": "COMPLETED" // Only count completed deliveries
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

    return NextResponse.json({ totalEarnings });
  } catch (error: any) {
    console.error("🔥 Earnings API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}