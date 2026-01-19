import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized - Not an admin" }, { status: 403 });
    }

    const { orderId, suborderId, riderId, deliveryFee } = await req.json();

    if (!orderId || !suborderId || !riderId || !deliveryFee) {
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

    // Check if suborder is ready for pickup
    if (suborder.status !== 'READY_FOR_PICKUP') {
      return NextResponse.json({ 
        message: "Suborder must be marked as READY_FOR_PICKUP before assigning rider" 
      }, { status: 400 });
    }

    // Update suborder with rider assignment
    suborder.riderId = riderId;
    suborder.deliveryFee = deliveryFee;
    suborder.status = 'ASSIGNED';
    suborder.deliveryDetails = suborder.deliveryDetails || {};
    suborder.deliveryDetails.pickupAddress = `Vendor Shop: ${suborder.shopId}`;
    suborder.deliveryDetails.dropoffAddress = order.shipping.address;
    suborder.deliveryDetails.estimatedTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Rider assigned successfully",
      suborder: {
        id: suborder._id,
        status: suborder.status,
        riderId: suborder.riderId,
        deliveryFee: suborder.deliveryFee
      }
    });
  } catch (error: any) {
    console.error("🔥 Delivery assignment error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}