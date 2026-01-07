/*// app/api/orders/vendor/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
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

    /* -------------------------------------------------
       Build match stage exactly like before
    -------------------------------------------------- *
    const query: Record<string, any> = { "suborders.vendorId": decoded.userId };
    if (status !== "all") {
      query["suborders.status"] = status.toUpperCase();
    }

    /* -------------------------------------------------
       1.  Aggregation pipeline – returns sub-order level rows
    -------------------------------------------------- *
    const pipeline: any[] = [
      { $match: query },
      { $unwind: "$suborders" },
      { $match: { "suborders.vendorId": decoded.userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNum },
      /* shape it back into the Order object the UI expects *
      {
        $group: {
          _id: "$_id",
          orderId:       { $first: "$orderId" },
          buyerId:       { $first: "$buyerId" },
          totalAmount:   { $first: "$totalAmount" },
          platformFee:   { $first: "$platformFee" },
          shippingFee:   { $first: "$shippingFee" },
          currency:      { $first: "$currency" },
          paymentStatus: { $first: "$paymentStatus" },
          shipping:      { $first: "$shipping" },
          status:        { $first: "$status" },
          createdAt:     { $first: "$createdAt" },
          suborders:     { $push: "$suborders" },
        },
      },
    ];

    const [vendorOrders, totalSuborders] = await Promise.all([
      Order.aggregate(pipeline),
      Order.aggregate([
        { $match: query },
        { $unwind: "$suborders" },
        { $match: { "suborders.vendorId": decoded.userId } },
        { $count: "total" },
      ]).then(r => (r[0]?.total || 0)),
    ]);

    return NextResponse.json({
      orders: vendorOrders,
      totalPages: Math.ceil(totalSuborders / limitNum),
      currentPage: pageNum,
      total: totalSuborders,
    });
  } catch (error: any) {
    console.error("🔥 Vendor Orders API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/orders/vendor/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
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
    const search = searchParams.get("search") || "";
    const skip = (pageNum - 1) * limitNum;

    // Build match stage
    const matchStage: Record<string, any> = { "suborders.vendorId": decoded.userId };
    if (status !== "all") {
      matchStage["suborders.status"] = status.toUpperCase();
    }

    // Build search stage if needed
    let searchUserIds: string[] = [];
    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      
      searchUserIds = users.map(user => user._id.toString());
      
      matchStage.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { buyerId: { $in: searchUserIds } },
      ];
    }

    // Fixed aggregation pipeline
    const pipeline: any[] = [
      { $match: matchStage },
      { $unwind: "$suborders" },
      { $match: { "suborders.vendorId": decoded.userId } },
      { $sort: { createdAt: -1 } }, // Sort before pagination
      { $skip: skip },
      { $limit: limitNum },
      // Lookup to populate buyer information
      {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyerInfo"
        }
      },
      {
        $unwind: {
          path: "$buyerInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      // Group back to order structure with populated buyer
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          buyerId: { $first: "$buyerInfo" }, // Now populated
          totalAmount: { $first: "$totalAmount" },
          platformFee: { $first: "$platformFee" },
          shippingFee: { $first: "$shippingFee" },
          currency: { $first: "$currency" },
          paymentStatus: { $first: "$paymentStatus" },
          shipping: { $first: "$shipping" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          suborders: { $push: "$suborders" },
        },
      },
      // Final sort to ensure consistent ordering
      { $sort: { createdAt: -1 } }
    ];

    const [vendorOrders, totalCountResult] = await Promise.all([
      Order.aggregate(pipeline),
      Order.aggregate([
        { $match: matchStage },
        { $unwind: "$suborders" },
        { $match: { "suborders.vendorId": decoded.userId } },
        { $count: "total" },
      ])
    ]);

    const totalSuborders = totalCountResult[0]?.total || 0;

    // Ensure consistent date format and buyer data structure
    const formattedOrders = vendorOrders.map(order => ({
      ...order,
      buyerId: order.buyerId || { _id: '', firstName: 'Unknown', lastName: 'Customer', email: '' },
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: order.updatedAt?.toISOString() || new Date().toISOString()
    }));

    console.log(`📦 Found ${formattedOrders.length} vendor orders for user ${decoded.userId}`);
    console.log(`📊 Total count: ${totalSuborders}, Page: ${pageNum}, Limit: ${limitNum}`);

    return NextResponse.json({
      orders: formattedOrders,
      totalPages: Math.ceil(totalSuborders / limitNum),
      currentPage: pageNum,
      total: totalSuborders,
    });
  } catch (error: any) {
    console.error("🔥 Vendor Orders API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}