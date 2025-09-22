
// app/api/orders/admin/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  id: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 🔑 Extract token
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    // 🔒 Verify token
    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // ✅ Only admins allowed
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized - Not an admin" },
        { status: 401 }
      );
    }

    // 1. Parse query params
    const { searchParams } = new URL(req.url);
    const pageNum = parseInt(searchParams.get("page") || "1", 10);
    const limitNum = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const skip = (pageNum - 1) * limitNum;

    // 2. Build query
    let query: Record<string, any> = {};

    if (status !== "all") {
      query.status = status.toUpperCase();
    }

    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = users.map((user) => user._id.toString());
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { buyerId: { $in: userIds } },
      ];
    }

    // 3. Fetch orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("buyerId", "firstName lastName email")
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (error: any) {
    console.error("Admin Orders API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string; // 👈 switch to match your JWT payload key
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 🔑 Extract token
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      console.warn("❌ No token provided");
      return NextResponse.json(
        { message: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    // 🔒 Verify token
    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log("✅ Decoded JWT payload:", decoded);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // ✅ Only admins allowed
    if (decoded.role !== "admin") {
      console.warn(`🚫 Unauthorized role: ${decoded.role}`);
      return NextResponse.json(
        { message: "Unauthorized - Not an admin" },
        { status: 401 }
      );
    }

    // 1. Parse query params
    const { searchParams } = new URL(req.url);
    const pageNum = parseInt(searchParams.get("page") || "1", 10);
    const limitNum = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const skip = (pageNum - 1) * limitNum;

    console.log("📄 Query params:", { pageNum, limitNum, status, search });

    // 2. Build query
    let query: Record<string, any> = {};

    if (status !== "all") {
      query.status = status.toUpperCase();
    }

    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = users.map((user) => user._id.toString());
      console.log("👥 Users matched by search:", userIds.length);

      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { buyerId: { $in: userIds } },
      ];
    }

    console.log("🔍 Final query:", query);

    // 3. Fetch orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("buyerId", "firstName lastName email")
      .lean();

    console.log(
      "📦 Orders fetched:",
      orders.map((o) => ({
        _id: o._id,
        orderId: o.orderId,
        buyer: o.buyerId,
        status: o.status,
        createdAt: o.createdAt,
      }))
    );

    const total = await Order.countDocuments(query);
    console.log("📊 Total count:", total);

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Admin Orders API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}