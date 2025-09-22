
// app/api/orders/vendor/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
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

    // ✅ Only allow vendors
    if (decoded.role !== "vendor") {
      return NextResponse.json(
        { message: "Unauthorized - Not a vendor" },
        { status: 401 }
      );
    }

    // 1. Parse query params
    const { searchParams } = new URL(req.url);
    const pageNum = parseInt(searchParams.get("page") || "1", 10);
    const limitNum = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const skip = (pageNum - 1) * limitNum;

    // 2. Build query for vendor suborders
    const query: Record<string, any> = { "suborders.vendorId": decoded.id };
    if (status !== "all") {
      query["suborders.status"] = status.toUpperCase();
    }

    // 3. Query orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // 🔎 Filter suborders belonging to this vendor
    const vendorOrders = orders.map((order: any) => {
      const vendorSuborders = order.suborders.filter(
        (suborder: any) => suborder.vendorId === decoded.id
      );
      return { ...order, suborders: vendorSuborders };
    });

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders: vendorOrders,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (error: any) {
    console.error("Vendor Orders API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string; // 👈 matches your JWT payload
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      console.warn("❌ No token found in request");
      return NextResponse.json(
        { message: "Unauthorized - No token" },
        { status: 401 }
      );
    }

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

    if (decoded.role !== "vendor") {
      console.warn(`🚫 Unauthorized role: ${decoded.role}`);
      return NextResponse.json(
        { message: "Unauthorized - Not a vendor" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const pageNum = parseInt(searchParams.get("page") || "1", 10);
    const limitNum = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const skip = (pageNum - 1) * limitNum;

    console.log("📄 Query params:", { pageNum, limitNum, status });

    // 🔍 Use decoded.userId instead of decoded.id
    const query: Record<string, any> = { "suborders.vendorId": decoded.userId };
    if (status !== "all") {
      query["suborders.status"] = status.toUpperCase();
    }

    console.log("🔍 Final query:", query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    console.log(
      "📦 Raw orders fetched:",
      orders.map((o) => ({
        _id: o._id,
        orderId: o.orderId,
        subordersCount: o.suborders?.length,
        buyerId: o.buyerId,
      }))
    );

    const vendorOrders = orders.map((order: any) => {
      const vendorSuborders = order.suborders.filter(
        (suborder: any) => suborder.vendorId === decoded.userId
      );
      return { ...order, suborders: vendorSuborders };
    });

    console.log(
      "📦 Vendor orders (after filtering):",
      vendorOrders.map((o: any) => ({
        _id: o._id,
        orderId: o.orderId,
        suborders: o.suborders.map((s: any) => ({
          _id: s._id,
          vendorId: s.vendorId,
          status: s.status,
          amount: s.amount,
        })),
      }))
    );

    const total = await Order.countDocuments(query);
    console.log("📊 Total count:", total);

    return NextResponse.json({
      orders: vendorOrders,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Vendor Orders API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
