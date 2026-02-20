// app/api/orders/check-delivery-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const suborderId = searchParams.get("suborderId");

    if (!orderId || !suborderId) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Verify this user owns the order
    if (order.buyerId.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const suborder = order.suborders.id(suborderId);
    if (!suborder) {
      return NextResponse.json({ message: "Suborder not found" }, { status: 404 });
    }

    return NextResponse.json({
      paid: suborder.deliveryDetails?.deliveryFeePaid || false,
      paymentRef: suborder.deliveryDetails?.deliveryFeePaymentRef,
      receipt: suborder.deliveryDetails?.deliveryFeeReceipt,
      paidAt: suborder.deliveryDetails?.deliveryFeePaidAt,
    });
  } catch (error) {
    console.error("Error checking delivery payment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}