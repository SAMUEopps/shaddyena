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
    const skip = (page - 1) * limit;

    // Build query for rider's deliveries
    const query: Record<string, any> = {
      "suborders.riderId": decoded.userId
    };

    if (status !== "all") {
      query["suborders.status"] = status.toUpperCase();
    }

    const orders = await Order.aggregate([
      { $match: { "suborders.riderId": decoded.userId } },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": decoded.userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          orderId: 1,
          createdAt: 1,
          shipping: 1,
          buyerId: 1,
          "suborders._id": 1,
          "suborders.vendorId": 1,
          "suborders.shopId": 1,
          "suborders.status": 1,
          "suborders.deliveryFee": 1,
          "suborders.deliveryDetails": 1,
          "suborders.items": 1,
          "suborders.amount": 1
        }
      }
    ]);

    const totalCount = await Order.aggregate([
      { $match: { "suborders.riderId": decoded.userId } },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": decoded.userId } },
      { $count: "total" }
    ]);

    const total = totalCount[0]?.total || 0;

    return NextResponse.json({
      deliveries: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Rider deliveries API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { orderId, suborderId, action, notes, otp } = await req.json();

    if (!orderId || !suborderId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const suborder = order.suborders.id(suborderId);
    if (!suborder) {
      return NextResponse.json({ message: "Suborder not found" }, { status: 404 });
    }

    // Verify rider owns this delivery
    if (suborder.riderId?.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized - Not assigned to this delivery" }, { status: 403 });
    }

    let statusMessage = "";
    
    switch (action) {
      case "pickup":
        if (suborder.status !== 'ASSIGNED') {
          return NextResponse.json({ message: "Cannot pickup - order not assigned" }, { status: 400 });
        }
        suborder.status = 'PICKED_UP';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.actualTime = new Date();
        statusMessage = "Package picked up successfully";
        break;

      case "in_transit":
        if (suborder.status !== 'PICKED_UP') {
          return NextResponse.json({ message: "Cannot mark as in transit - not picked up" }, { status: 400 });
        }
        suborder.status = 'IN_TRANSIT';
        statusMessage = "Package marked as in transit";
        break;

      case "deliver":
        if (suborder.status !== 'IN_TRANSIT') {
          return NextResponse.json({ message: "Cannot deliver - not in transit" }, { status: 400 });
        }
        
        // Check OTP if required
        if (suborder.deliveryDetails?.confirmationCode) {
          if (!otp || otp !== suborder.deliveryDetails.confirmationCode) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
          }
        }
        
        suborder.status = 'DELIVERED';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.actualTime = new Date();
        statusMessage = "Delivery completed successfully";
        break;

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    if (notes) {
      suborder.deliveryDetails = suborder.deliveryDetails || {};
      suborder.deliveryDetails.notes = notes;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: statusMessage,
      status: suborder.status
    });
  } catch (error: any) {
    console.error("🔥 Rider action error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}