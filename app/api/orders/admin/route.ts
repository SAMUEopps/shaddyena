/*import { NextRequest, NextResponse } from "next/server";
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
}*/

// app/api/orders/admin/route.ts - FIXED FOR SCHEMA TRANSITION
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// Helper function to manually populate buyer data
const populateBuyerData = async (orders: any[]) => {
  console.log(`🔍 Manually populating buyer data for ${orders.length} orders`);
  
  // Collect all buyerIds (both string and ObjectId formats)
  const buyerIds = orders.map(order => {
    const buyerId = order.buyerId;
    console.log(`   Order ${order.orderId} has buyerId type: ${typeof buyerId}, value: ${buyerId}`);
    return buyerId;
  }).filter(id => id); // Remove null/undefined

  if (buyerIds.length === 0) {
    console.log("⚠️  No buyerIds found in orders");
    return orders;
  }

  console.log(`👥 Found ${buyerIds.length} unique buyer IDs to populate`);

  // Find users - handle both string and ObjectId formats
  const users = await User.find({
    $or: [
      { _id: { $in: buyerIds.filter(id => mongoose.Types.ObjectId.isValid(id)) } },
      { _id: { $in: buyerIds.map(id => {
        try {
          return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
        } catch {
          return null;
        }
      }).filter(id => id) } }
    ]
  }).select("_id firstName lastName email");

  console.log(`✅ Found ${users.length} matching users`);

  // Create a map for quick lookup
  const userMap = new Map();
  users.forEach(user => {
    userMap.set(user._id.toString(), user);
    console.log(`   Mapped user: ${user.firstName} ${user.lastName} (${user.email})`);
  });

  // Populate orders with buyer data
  return orders.map(order => {
    const buyerIdStr = order.buyerId?.toString();
    const buyer = userMap.get(buyerIdStr) || {};
    
    console.log(`   Order ${order.orderId}: buyerId=${buyerIdStr}, found=${!!userMap.get(buyerIdStr)}`);
    
    return {
      ...order,
      buyerId: {
        _id: buyer._id || order.buyerId || '',
        firstName: buyer.firstName || 'Unknown',
        lastName: buyer.lastName || 'Customer',
        email: buyer.email || ''
      }
    };
  });
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log('🔐 Starting admin orders fetch');

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.warn("❌ No token provided");
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log(`✅ Admin token verified for user: ${decoded.userId}`);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      console.warn(`🚫 Unauthorized role: ${decoded.role}`);
      return NextResponse.json({ message: "Unauthorized - Not an admin" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const pageNum = parseInt(searchParams.get("page") || "1", 10);
    const limitNum = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const skip = (pageNum - 1) * limitNum;

    console.log(`📄 Admin query params: page=${pageNum}, limit=${limitNum}, status=${status}, search="${search}"`);

    // Build query
    let query: Record<string, any> = {};

    if (status !== "all") {
      query.status = status.toUpperCase();
      console.log(`📋 Filtering by order status: ${status.toUpperCase()}`);
    }

    if (search) {
      console.log(`🔍 Admin search: "${search}"`);
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id firstName lastName email");

      console.log(`👥 Found ${users.length} users matching admin search:`);
      users.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
      });

      const userIds = users.map(user => user._id.toString());
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { buyerId: { $in: userIds } },
      ];
    }

    console.log(`🔍 Final admin query:`, JSON.stringify(query, null, 2));

    // Fetch orders WITHOUT populate (since schema is in transition)
    console.log(`🔄 Fetching orders without populate (manual population needed)...`);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(); // Don't populate here due to schema mismatch

    console.log(`📦 Found ${orders.length} raw orders from database`);
    orders.forEach((order, index) => {
      console.log(`   Order ${index + 1}: ${order.orderId}, buyerId: ${order.buyerId} (type: ${typeof order.buyerId})`);
    });

    // Manually populate buyer data
    const populatedOrders = await populateBuyerData(orders);

    // Count total for pagination
    const total = await Order.countDocuments(query);
    console.log(`📊 Total orders matching query: ${total}`);
    console.log(`📄 Showing page ${pageNum} of ${Math.ceil(total / limitNum)}`);

    // Log final results
    console.log(`\n✅ Final populated orders:`);
    populatedOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.orderId} - ${order.buyerId.firstName} ${order.buyerId.lastName} (${order.buyerId.email})`);
    });

    return NextResponse.json({
      orders: populatedOrders,
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