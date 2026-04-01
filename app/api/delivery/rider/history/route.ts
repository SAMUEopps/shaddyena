// app/api/delivery/rider/history/route.ts
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const dateFilter = searchParams.get("dateFilter") || "all";
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);

    // Build date filter
    let dateMatch: any = {};
    const now = new Date();
    
    if (dateFilter === "today") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateMatch["createdAt"] = { $gte: startOfDay };
    } else if (dateFilter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateMatch["createdAt"] = { $gte: startOfWeek };
    } else if (dateFilter === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateMatch["createdAt"] = { $gte: startOfMonth };
    }

    // Build status filter (completed deliveries only)
    const statusMatch: any = {};
    if (status === "all") {
      statusMatch["suborders.status"] = { $in: ['DELIVERED', 'CONFIRMED', 'CANCELLED', 'FAILED'] };
    } else {
      statusMatch["suborders.status"] = status;
    }

    // Build search filter
    const searchMatch: any = {};
    if (search) {
      searchMatch["orderId"] = { $regex: search, $options: "i" };
    }

    // Aggregation pipeline
    const pipeline: any[] = [
      { $match: { ...searchMatch, ...dateMatch } },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": riderObjectId, ...statusMatch } },
      { $sort: { "createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          shipping: { $first: "$shipping" },
          suborders: { $push: "$suborders" }
        }
      },
      { $sort: { "createdAt": -1 } }
    ];

    const deliveries = await Order.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline: any[] = [
      { $match: { ...searchMatch, ...dateMatch } },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": riderObjectId, ...statusMatch } },
      { $count: "total" }
    ];

    const totalCount = await Order.aggregate(countPipeline);
    const total = totalCount[0]?.total || 0;

    // Calculate total earnings
    const earningsPipeline: any[] = [
      { $match: { ...searchMatch, ...dateMatch } },
      { $unwind: "$suborders" },
      { 
        $match: { 
          "suborders.riderId": riderObjectId,
          "suborders.status": { $in: ['DELIVERED', 'CONFIRMED'] }
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

    return NextResponse.json({
      deliveries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      totalEarnings
    });
  } catch (error: any) {
    console.error("🔥 Delivery history API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}