// // C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\riders\verify-confirmation\route.ts
// import { verifyToken } from "@/shd-lib/lib/auth";
// import { connectToDatabase } from "@/shd-lib/lib/mongodb";
// import Delivery from "@/shd-models/models/Delivery";
// import Rider from "@/shd-models/models/Rider";
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
//     if (!decoded || decoded.role !== "rider") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { deliveryId, confirmationCode } = body;

//     if (!deliveryId || !confirmationCode) {
//       return NextResponse.json(
//         { error: "Delivery ID and confirmation code are required" },
//         { status: 400 }
//       );
//     }

//     // Find the rider
//     const rider = await Rider.findOne({ userId: decoded.userId });
//     if (!rider) {
//       return NextResponse.json({ error: "Rider not found" }, { status: 404 });
//     }

//     // Find the delivery
//     const delivery = await Delivery.findById(deliveryId);
//     if (!delivery) {
//       return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
//     }

//     // Verify this delivery belongs to this rider
//     if (delivery.assignedRiderId?.toString() !== rider._id.toString()) {
//       return NextResponse.json(
//         { error: "Unauthorized - This delivery is not assigned to you" },
//         { status: 403 }
//       );
//     }

//     // Check if delivery is awaiting confirmation
//     if (delivery.status !== "awaiting_confirmation") {
//       return NextResponse.json(
//         { error: "Delivery is not awaiting confirmation" },
//         { status: 400 }
//       );
//     }

//     // Check if code matches
//     if (delivery.confirmationCode !== confirmationCode) {
//       return NextResponse.json(
//         { error: "Invalid confirmation code. Please try again." },
//         { status: 400 }
//       );
//     }

//     // Check if code is expired
//     if (delivery.codeExpiresAt && new Date() > delivery.codeExpiresAt) {
//       return NextResponse.json(
//         { error: "Confirmation code has expired" },
//         { status: 400 }
//       );
//     }

//     // Code is valid - complete the delivery
//     delivery.status = "completed";
//     delivery.completedAt = new Date();
    
//     // Update rider stats
//     rider.totalDeliveries += 1;
//     rider.totalEarned += delivery.earnings || 0;
//     rider.pendingPayout += delivery.earnings || 0;
//     await rider.save();

//     // Update order status
//     await Order.findByIdAndUpdate(delivery.orderId, {
//       deliveryStatus: "completed",
//       status: "delivered",
//       deliveredAt: new Date()
//     });

//     await delivery.save();

//     return NextResponse.json({
//       success: true,
//       message: "Delivery completed successfully!",
//       delivery: {
//         id: delivery._id,
//         status: delivery.status,
//         completedAt: delivery.completedAt,
//         earnings: delivery.earnings
//       }
//     });

//   } catch (error) {
//     console.error("Error verifying confirmation code:", error);
//     return NextResponse.json(
//       { error: "Failed to verify confirmation code" },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\riders\verify-confirmation\route.ts
import { verifyToken } from "@/shd-lib/lib/auth";
import { connectToDatabase } from "@/shd-lib/lib/mongodb";
import Delivery from "@/shd-models/models/Delivery";
import Rider from "@/shd-models/models/Rider";
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
    if (!decoded || decoded.role !== "rider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { deliveryId, confirmationCode } = body;

    if (!deliveryId || !confirmationCode) {
      return NextResponse.json(
        { error: "Delivery ID and confirmation code are required" },
        { status: 400 }
      );
    }

    // Find the rider
    const rider = await Rider.findOne({ userId: decoded.userId });
    if (!rider) {
      return NextResponse.json({ error: "Rider not found" }, { status: 404 });
    }

    // Find the delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    // Verify this delivery belongs to this rider
    if (delivery.assignedRiderId?.toString() !== rider._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized - This delivery is not assigned to you" },
        { status: 403 }
      );
    }

    // Check if delivery is awaiting confirmation
    if (delivery.status !== "awaiting_confirmation") {
      return NextResponse.json(
        { error: "Delivery is not awaiting confirmation" },
        { status: 400 }
      );
    }

    // Check if customer has confirmed receipt
    if (!delivery.customerConfirmed) {
      return NextResponse.json(
        { error: "Customer has not confirmed receipt yet. Please ask them to confirm in their app." },
        { status: 400 }
      );
    }

    // Check if code matches
    if (delivery.confirmationCode !== confirmationCode) {
      return NextResponse.json(
        { error: "Invalid confirmation code. Please check with the customer." },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (delivery.codeExpiresAt && new Date() > delivery.codeExpiresAt) {
      return NextResponse.json(
        { error: "Confirmation code has expired. Please ask the customer to generate a new one." },
        { status: 400 }
      );
    }

    // Code is valid - complete the delivery
    delivery.status = "completed";
    delivery.completedAt = new Date();
    
    // Update rider stats
    rider.totalDeliveries += 1;
    rider.totalEarned += delivery.earnings || 0;
    rider.pendingPayout += delivery.earnings || 0;
    await rider.save();

    // Update order status
    await Order.findByIdAndUpdate(delivery.orderId, {
      deliveryStatus: "completed",
      status: "delivered",
      deliveredAt: new Date()
    });

    await delivery.save();

    return NextResponse.json({
      success: true,
      message: "✅ Delivery completed successfully!",
      delivery: {
        id: delivery._id,
        status: delivery.status,
        completedAt: delivery.completedAt,
        earnings: delivery.earnings
      }
    });

  } catch (error) {
    console.error("Error verifying confirmation code:", error);
    return NextResponse.json(
      { error: "Failed to verify confirmation code" },
      { status: 500 }
    );
  }
}