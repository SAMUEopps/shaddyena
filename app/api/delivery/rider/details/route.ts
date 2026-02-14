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
    const orderId = searchParams.get("orderId");
    const suborderId = searchParams.get("suborderId");

    if (!orderId || !suborderId) {
      return NextResponse.json({ message: "Missing orderId or suborderId" }, { status: 400 });
    }

    // Convert IDs to ObjectId
    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);

    // Find the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Find the specific suborder
    const suborder = order.suborders.id(suborderId);
    
    if (!suborder) {
      return NextResponse.json({ message: "Suborder not found" }, { status: 404 });
    }

    // Verify rider owns this delivery
    const suborderRiderId = suborder.riderId?.toString();
    
    if (!suborderRiderId || suborderRiderId !== decoded.userId) {
      return NextResponse.json({ 
        message: "Unauthorized - Not assigned to this delivery" 
      }, { status: 403 });
    }

    // Return formatted delivery details
    return NextResponse.json({
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      shipping: order.shipping,
      suborder: {
        _id: suborder._id,
        vendorId: suborder.vendorId,
        shopId: suborder.shopId,
        status: suborder.status,
        deliveryFee: suborder.deliveryFee,
        deliveryDetails: suborder.deliveryDetails || {},
        items: suborder.items,
        amount: suborder.amount,
      }
    });

  } catch (error: any) {
    console.error("🔥 Delivery details API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}