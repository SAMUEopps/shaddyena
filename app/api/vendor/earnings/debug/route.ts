// app/api/vendor/earnings/debug/route.ts - DEBUG VERSION
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log('🔍 Debug: Token decoded, vendor ID:', decoded.userId);
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "vendor") {
      return NextResponse.json({ message: "Unauthorized - Not a vendor" }, { status: 401 });
    }

    // Let's debug what orders exist for this vendor
    console.log('🔍 Debug: Checking all orders for vendor ID:', decoded.userId);

    // First, let's see what orders exist without any filters
    const allOrders = await Order.find({})
      .select('orderId suborders buyerId createdAt')
      .lean()
      .limit(10);

    console.log('🔍 Debug: Found total orders in system:', allOrders.length);
    
    allOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        orderId: order.orderId,
        suborderCount: order.suborders?.length || 0,
        buyerId: order.buyerId,
        createdAt: order.createdAt
      });
      
      // Check each suborder
      if (order.suborders) {
        order.suborders.forEach((suborder: { vendorId: any; netAmount: any; status: any; }, subIndex: number) => {
          console.log(`  Suborder ${subIndex + 1}:`, {
            vendorId: suborder.vendorId,
            vendorIdType: typeof suborder.vendorId,
            netAmount: suborder.netAmount,
            status: suborder.status
          });
        });
      }
    });

    // Now check orders with this specific vendor ID
    const vendorOrders = await Order.find({
      "suborders.vendorId": decoded.userId
    })
    .select('orderId suborders buyerId createdAt')
    .lean()
    .limit(10);

    console.log('🔍 Debug: Found orders for vendor:', vendorOrders.length);

    // Let's also try a different approach - unwind first then match
    const pipelineTest = [
      { $unwind: "$suborders" },
      { $match: { "suborders.vendorId": decoded.userId } },
      { $limit: 5 }
    ];

    const directMatch = await Order.aggregate(pipelineTest);
    console.log('🔍 Debug: Direct pipeline match results:', directMatch.length);

    if (directMatch.length > 0) {
      console.log('🔍 Debug: Sample match:', {
        orderId: directMatch[0].orderId,
        vendorId: directMatch[0].suborders.vendorId,
        netAmount: directMatch[0].suborders.netAmount
      });
    }

    // Check if vendor ID formats match
    console.log('🔍 Debug: Comparing IDs:', {
      tokenVendorId: decoded.userId,
      tokenVendorIdType: typeof decoded.userId,
      firstOrderVendorId: allOrders[0]?.suborders?.[0]?.vendorId,
      firstOrderVendorIdType: typeof allOrders[0]?.suborders?.[0]?.vendorId,
      areEqual: decoded.userId === allOrders[0]?.suborders?.[0]?.vendorId
    });

    return NextResponse.json({
      debug: {
        totalOrdersInSystem: allOrders.length,
        ordersForVendor: vendorOrders.length,
        directPipelineMatches: directMatch.length,
        vendorIdFromToken: decoded.userId,
        sampleOrderData: allOrders.slice(0, 3),
        vendorOrdersData: vendorOrders.slice(0, 3)
      }
    });

  } catch (error: any) {
    console.error("🔥 Debug API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}