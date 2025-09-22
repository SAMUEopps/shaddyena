// app/api/orders/my/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Extract token from cookies or headers
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    // 2. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // 3. Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { buyerId: decoded.id };
    if (status !== "all") {
      query.status = status.toUpperCase();
    }

    // 4. Query orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error("Order API error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Extract token
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      console.warn("❌ No token found in request");
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    // 2. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("✅ Decoded JWT payload:", decoded);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // 3. Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";

    const skip = (page - 1) * limit;

    // 4. Build query
    const buyerId = decoded.userId; // ✅ use userId from token
    const query: Record<string, unknown> = { buyerId };

    if (status !== "all") {
      query.status = status.toUpperCase();
    }

    console.log("🔍 Final query:", query);

    // 5. Query orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(
      "📦 Orders fetched:",
      orders.map((o) => ({
        _id: o._id,
        orderId: o.orderId,
        buyerId: o.buyerId,
        status: o.status,
        totalAmount: o.totalAmount,
      }))
    );

    const total = await Order.countDocuments(query);
    console.log("📊 Total count:", total);

    // 6. Return response
    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Order API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
