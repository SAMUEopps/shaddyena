// app/api/orders/confirm-delivery/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import { RiderEarning } from "@/models/VendorEarnings";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    const { orderId, suborderId, confirmationCode } = await req.json();

    if (!orderId || !suborderId) {
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

    // Generate confirmation code if customer is confirming
    if (decoded.role === "customer") {
      /*if (suborder.status !== 'DELIVERED') {
        return NextResponse.json({ message: "Order not delivered yet" }, { status: 400 });
      }*/

        if (!['IN_TRANSIT', 'DELIVERED', 'CONFIRMED'].includes(suborder.status)) {
          return NextResponse.json({ 
            message: "Order is not ready for confirmation. Please wait for delivery." 
          }, { status: 400 });
        }

      // Generate new confirmation code
      const code = generateConfirmationCode();
      suborder.deliveryDetails = suborder.deliveryDetails || {};
      suborder.deliveryDetails.confirmationCode = code;
      suborder.deliveryDetails.confirmedAt = new Date();
      //suborder.status = 'CONFIRMED';

      await order.save();

      return NextResponse.json({
        success: true,
        message: "Delivery confirmed. Share this code with the rider.",
        confirmationCode: code,
        status: suborder.status,
        currentStatus: suborder.status
      });
    }

    // Rider verifying the code
    if (decoded.role === "delivery") {
      if (!suborder.riderId || suborder.riderId.toString() !== decoded.userId) {
        return NextResponse.json({ 
          message: "Unauthorized - Not assigned to this delivery" 
        }, { status: 403 });
      }

      /*if (suborder.status !== 'CONFIRMED') {
        return NextResponse.json({ 
          message: "Customer hasn't confirmed delivery yet" 
        }, { status: 400 });
      }*/

      if (!['DELIVERED', 'IN_TRANSIT'].includes(suborder.status)) {
        return NextResponse.json({ 
          message: "Cannot verify - order not in correct status" 
        }, { status: 400 });
      }

      if (!suborder.deliveryDetails?.confirmationCode) {
        return NextResponse.json({ 
          message: "No confirmation code generated" 
        }, { status: 400 });
      }

      // Verify the code
      if (confirmationCode !== suborder.deliveryDetails.confirmationCode) {
        return NextResponse.json({ 
          message: "Invalid confirmation code" 
        }, { status: 400 });
      }

      // Mark rider as verified the code
      suborder.deliveryDetails.riderConfirmedAt = new Date();
      suborder.status = 'CONFIRMED';
      
      // Create rider earnings now that delivery is fully confirmed
      if (suborder.riderId && suborder.deliveryFee > 0) {
        await createRiderEarnings(order, suborder);
      }

      await order.save();

      return NextResponse.json({
        success: true,
        message: "Delivery successfully verified!",
        status: suborder.status
      });
    }

    return NextResponse.json({ message: "Unauthorized role" }, { status: 403 });
  } catch (error: any) {
    console.error("🔥 Delivery confirmation error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

function generateConfirmationCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

async function createRiderEarnings(order: any, suborder: any) {
  try {
    const exists = await RiderEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      riderId: suborder.riderId,
    });

    if (exists) {
      console.log("📘 Rider earning already exists");
      return exists;
    }

    // Get rider details (you might need to fetch from User model)
    const earning = new RiderEarning({
      riderId: suborder.riderId,
      orderId: order._id,
      suborderId: suborder._id,
      deliveryFee: suborder.deliveryFee,
      status: "PENDING",
      confirmedAt: suborder.deliveryDetails?.riderConfirmedAt,
      orderDetails: {
        orderId: order.orderId,
        vendorId: suborder.vendorId,
        confirmationCode: suborder.deliveryDetails?.confirmationCode,
        createdAt: order.createdAt
      }
    });

    await earning.save();
    console.log("✅ Rider earning created after confirmation");

    return earning;
  } catch (error) {
    console.error("❌ Rider earning creation failed", error);
    throw error;
  }
}