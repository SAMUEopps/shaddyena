// // C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\orders\confirm-delivery\route.ts
// import { verifyToken } from "@/shd-lib/lib/auth";
// import { connectToDatabase } from "@/shd-lib/lib/mongodb";
// import Delivery from "@/shd-models/models/Delivery";
// import Order from "@/shd-models/models/Order";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { deliveryId } = body;

//     if (!deliveryId) {
//       return NextResponse.json(
//         { error: "Delivery ID is required" },
//         { status: 400 }
//       );
//     }

//     // Find the delivery
//     const delivery = await Delivery.findById(deliveryId);
//     if (!delivery) {
//       return NextResponse.json(
//         { error: "Delivery not found" },
//         { status: 404 }
//       );
//     }

//     // Verify this delivery belongs to the customer
//     const order = await Order.findById(delivery.orderId);
//     if (!order) {
//       return NextResponse.json(
//         { error: "Order not found" },
//         { status: 404 }
//       );
//     }

//     if (order.customerId.toString() !== decoded.userId) {
//       return NextResponse.json(
//         { error: "Unauthorized - This delivery does not belong to you" },
//         { status: 403 }
//       );
//     }

//     // Check if delivery is in the correct state
//     if (delivery.status !== "awaiting_confirmation") {
//       return NextResponse.json(
//         { error: "Delivery is not awaiting confirmation" },
//         { status: 400 }
//       );
//     }

//     // Check if code is still valid
//     if (delivery.codeExpiresAt && new Date() > delivery.codeExpiresAt) {
//       return NextResponse.json(
//         { error: "Confirmation code has expired. Please contact the rider." },
//         { status: 400 }
//       );
//     }

//     // Get the confirmation code for the customer
//     const confirmationCode = delivery.confirmationCode;

//     // Update delivery status to completed (this is the final state)
//     delivery.status = "completed";
//     delivery.completedAt = new Date();

//     // Update order status
//     order.deliveryStatus = "completed";
//     order.status = "delivered";
//     order.deliveredAt = new Date();
    
//     await delivery.save();
//     await order.save();

//     // Update rider stats (already done in the update-delivery endpoint)
//     // But we'll also update the rider's completed deliveries count if needed

//     return NextResponse.json({
//       success: true,
//       message: "Delivery confirmed successfully!",
//       confirmationCode: confirmationCode,
//       delivery: {
//         id: delivery._id,
//         status: delivery.status,
//         completedAt: delivery.completedAt
//       }
//     });

//   } catch (error) {
//     console.error("Error confirming delivery:", error);
//     return NextResponse.json(
//       { error: "Failed to confirm delivery" },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\orders\confirm-delivery\route.ts
import { verifyToken } from "@/shd-lib/lib/auth";
import { connectToDatabase } from "@/shd-lib/lib/mongodb";
import Delivery from "@/shd-models/models/Delivery";
import Order from "@/shd-models/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { deliveryId } = body;

    if (!deliveryId) {
      return NextResponse.json(
        { error: "Delivery ID is required" },
        { status: 400 }
      );
    }

    // Find the delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    // Verify this delivery belongs to the customer
    const order = await Order.findById(delivery.orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.customerId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized - This delivery does not belong to you" },
        { status: 403 }
      );
    }

    // Check if delivery is in the correct state
    if (delivery.status !== "awaiting_confirmation") {
      return NextResponse.json(
        { error: "Delivery is not awaiting confirmation" },
        { status: 400 }
      );
    }

    // Check if code is still valid
    if (delivery.codeExpiresAt && new Date() > delivery.codeExpiresAt) {
      return NextResponse.json(
        { error: "Confirmation code has expired. Please contact the rider." },
        { status: 400 }
      );
    }

    // Get the confirmation code for the customer
    const confirmationCode = delivery.confirmationCode;

    // Update delivery status - BUT keep it as "awaiting_confirmation" until rider enters code
    // We just mark that customer has acknowledged receipt
    // The delivery will be completed when rider enters the code
    
    // We'll add a field to track customer confirmation
    delivery.customerConfirmed = true;
    delivery.customerConfirmedAt = new Date();
    
    await delivery.save();

    // Return the confirmation code ONLY to the customer
    return NextResponse.json({
      success: true,
      message: "Delivery receipt confirmed!",
      confirmationCode: confirmationCode, // ONLY the customer sees this
      expiresAt: delivery.codeExpiresAt,
      warning: "Please share this code with your rider to complete the delivery.",
      delivery: {
        id: delivery._id,
        status: delivery.status,
        customerConfirmed: true
      }
    });

  } catch (error) {
    console.error("Error confirming delivery:", error);
    return NextResponse.json(
      { error: "Failed to confirm delivery" },
      { status: 500 }
    );
  }
}