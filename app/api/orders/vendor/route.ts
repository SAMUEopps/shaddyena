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
/*import { NextRequest, NextResponse } from "next/server";
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
}*/









// app/api/orders/vendor/route.ts - REFACTORED WITH BETTER LOGGING
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// Helper function to safely format buyer data
const formatBuyerData = (buyerInfo: any, originalBuyerId: string) => {
  if (!buyerInfo || !buyerInfo._id) {
    console.log(`⚠️  No buyer found for buyerId: ${originalBuyerId}`);
    return {
      _id: originalBuyerId || '',
      firstName: 'Unknown',
      lastName: 'Customer',
      email: ''
    };
  }
  
  console.log(`✅ Buyer found: ${buyerInfo.firstName} ${buyerInfo.lastName} (${buyerInfo.email})`);
  return {
    _id: buyerInfo._id.toString(),
    firstName: buyerInfo.firstName || 'Unknown',
    lastName: buyerInfo.lastName || 'Customer',
    email: buyerInfo.email || ''
  };
};

// Helper function to build match stage for search
const buildSearchStage = async (search: string) => {
  if (!search) return null;
  
  console.log(`🔍 Searching for: "${search}"`);
  const users = await User.find({
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("_id firstName lastName email");
  
  console.log(`👥 Found ${users.length} users matching search`);
  users.forEach(user => {
    console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
  });
  
  return users.map(user => user._id.toString());
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log('🚀 Starting vendor orders fetch');

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.warn("❌ No token found in request");
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log(`✅ Token decoded for vendor: ${decoded.userId}`);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "vendor") {
      console.warn(`🚫 Unauthorized role: ${decoded.role}`);
      return NextResponse.json({ message: "Unauthorized - Not a vendor" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageNum = parseInt(searchParams.get("page") || "1", 10);
    const limitNum = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const skip = (pageNum - 1) * limitNum;

    console.log(`📄 Query params: page=${pageNum}, limit=${limitNum}, status=${status}, search="${search}"`);

    // Build match stage
    const matchStage: Record<string, any> = { "suborders.vendorId": decoded.userId };
    console.log(`🎯 Looking for orders with vendorId: ${decoded.userId}`);

    if (status !== "all") {
      matchStage["suborders.status"] = status.toUpperCase();
      console.log(`📋 Filtering by status: ${status.toUpperCase()}`);
    }

    // Handle search
    if (search) {
      const searchUserIds = await buildSearchStage(search);
      if (searchUserIds && searchUserIds.length > 0) {
        matchStage.$or = [
          { orderId: { $regex: search, $options: "i" } },
          { buyerId: { $in: searchUserIds } },
        ];
      } else {
        matchStage.orderId = { $regex: search, $options: "i" };
      }
    }

    console.log(`🔍 Final match stage:`, JSON.stringify(matchStage, null, 2));

    // Optimized aggregation pipeline
    const pipeline: any[] = [
      { $match: matchStage },
      { $unwind: "$suborders" },
      { $match: { "suborders.vendorId": decoded.userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNum },
      // FIXED: Buyer lookup handling string-to-ObjectId conversion
      {
      $lookup: {
        from: "users",
        let: { buyerId: "$buyerId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$_id", "$$buyerId"] }, // ObjectId → ObjectId
                  { $eq: [{ $toString: "$_id" }, "$$buyerId"] } // ObjectId → string
                ]
              }
            }
          },
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1
            }
          }
        ],
        as: "buyerInfo"
      }
      },
      {
        $unwind: {
          path: "$buyerInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      // Group back to order structure
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          buyerId: { $first: "$buyerInfo" },
          buyerIdOriginal: { $first: "$buyerId" }, // Keep original for debugging
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
      { $sort: { createdAt: -1 } }
    ];

    console.log(`🔄 Executing aggregation pipeline...`);

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
    console.log(`📊 Found ${totalSuborders} total orders, returning ${vendorOrders.length} for page ${pageNum}`);

    // Enhanced formatting with detailed logging
    const formattedOrders = vendorOrders.map((order, index) => {
      console.log(`\n📝 Processing order ${index + 1}:`);
      console.log(`   Order ID: ${order.orderId}`);
      console.log(`   Original buyerId: ${order.buyerIdOriginal}`);
      console.log(`   Buyer info from lookup:`, order.buyerId);
      
      const formattedBuyer = formatBuyerData(order.buyerId, order.buyerIdOriginal);
      
      return {
        ...order,
        buyerId: formattedBuyer,
        createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: order.updatedAt?.toISOString() || new Date().toISOString()
      };
    });

    console.log(`\n✅ Successfully formatted ${formattedOrders.length} orders`);
    console.log(`📦 Sample order:`, formattedOrders[0] ? {
      orderId: formattedOrders[0].orderId,
      buyerName: `${formattedOrders[0].buyerId.firstName} ${formattedOrders[0].buyerId.lastName}`,
      buyerEmail: formattedOrders[0].buyerId.email
    } : 'No orders found');

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