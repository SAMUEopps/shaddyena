// // // // C:\Users\USER\Desktop\Projects\my-app\app\api\rider\update-delivery\[deliveryId]\route.ts
// // // import { verifyToken } from '@/shd-lib/lib/auth';
// // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // // import Delivery from '@/shd-models/models/Delivery';
// // // import Rider from '@/shd-models/models/Rider';
// // // import { NextRequest, NextResponse } from 'next/server';


// // // export async function PUT(
// // //   req: NextRequest,
// // //   { params }: { params: { deliveryId: string } }
// // // ) {
// // //   try {
// // //     await connectToDatabase();
    
// // //     const token = req.headers.get('authorization')?.split(' ')[1];
// // //     if (!token) {
// // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // //     }

// // //     const decoded = verifyToken(token);
// // //     if (!decoded || decoded.role !== 'rider') {
// // //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// // //     }

// // //     const body = await req.json();
// // //     const { status } = body;

// // //     const rider = await Rider.findOne({ userId: decoded.userId });
// // //     if (!rider) {
// // //       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
// // //     }

// // //     const delivery = await Delivery.findById(params.deliveryId);
// // //     if (!delivery) {
// // //       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
// // //     }

// // //     // Verify this delivery belongs to this rider
// // //     if (delivery.assignedRiderId?.toString() !== rider._id.toString()) {
// // //       return NextResponse.json(
// // //         { error: 'Unauthorized - This delivery is not assigned to you' },
// // //         { status: 403 }
// // //       );
// // //     }

// // //     // Update delivery status
// // //     delivery.status = status;
    
// // //     if (status === 'picked_up') {
// // //       delivery.pickedUpAt = new Date();
// // //     } else if (status === 'in_transit') {
// // //       delivery.inTransitAt = new Date();
// // //     } else if (status === 'delivered') {
// // //       delivery.deliveredAt = new Date();
      
// // //       // Update rider stats
// // //       rider.totalDeliveries += 1;
// // //       rider.totalEarned += delivery.earnings || 0;
// // //       rider.pendingPayout += delivery.earnings || 0;
// // //       await rider.save();
// // //     }

// // //     await delivery.save();

// // //     return NextResponse.json({
// // //       message: `Delivery status updated to ${status}`,
// // //       delivery
// // //     });

// // //   } catch (error) {
// // //     console.error('Error updating delivery:', error);
// // //     return NextResponse.json(
// // //       { error: 'Failed to update delivery' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // C:\Users\USER\Desktop\Projects\my-app\app\api\rider\update-delivery\[deliveryId]\route.ts

// // import { verifyToken } from "@/shd-lib/lib/auth";
// // import { connectToDatabase } from "@/shd-lib/lib/mongodb";
// // import Delivery from "@/shd-models/models/Delivery";
// // import Rider from "@/shd-models/models/Rider";
// // import { NextRequest, NextResponse } from "next/server";


// // export async function PUT(
// //   req: NextRequest,
// //   { params }: { params: Promise<{ deliveryId: string }> }
// // ) {
// //   try {
// //     await connectToDatabase();

// //     const { deliveryId } = await params;


// //     const token = req.headers
// //       .get("authorization")
// //       ?.split(" ")[1];


// //     if (!token) {
// //       return NextResponse.json(
// //         { error: "Unauthorized" },
// //         { status: 401 }
// //       );
// //     }


// //     const decoded = verifyToken(token);


// //     if (!decoded || decoded.role !== "rider") {
// //       return NextResponse.json(
// //         { error: "Unauthorized" },
// //         { status: 401 }
// //       );
// //     }


// //     const body = await req.json();
// //     const { status } = body;


// //     const rider = await Rider.findOne({
// //       userId: decoded.userId,
// //     });


// //     if (!rider) {
// //       return NextResponse.json(
// //         { error: "Rider not found" },
// //         { status: 404 }
// //       );
// //     }


// //     const delivery = await Delivery.findById(
// //       deliveryId
// //     );


// //     if (!delivery) {
// //       return NextResponse.json(
// //         { error: "Delivery not found" },
// //         { status: 404 }
// //       );
// //     }


// //     // Verify this delivery belongs to this rider
// //     if (
// //       delivery.assignedRiderId?.toString() !==
// //       rider._id.toString()
// //     ) {
// //       return NextResponse.json(
// //         {
// //           error:
// //             "Unauthorized - This delivery is not assigned to you",
// //         },
// //         {
// //           status: 403,
// //         }
// //       );
// //     }


// //     // Update delivery status
// //     delivery.status = status;


// //     if (status === "picked_up") {

// //       delivery.pickedUpAt = new Date();

// //     } else if (status === "in_transit") {

// //       delivery.inTransitAt = new Date();

// //     } else if (status === "delivered") {

// //       delivery.deliveredAt = new Date();


// //       // Update rider stats
// //       rider.totalDeliveries += 1;
// //       rider.totalEarned += delivery.earnings || 0;
// //       rider.pendingPayout += delivery.earnings || 0;

// //       await rider.save();
// //     }


// //     await delivery.save();


// //     return NextResponse.json({
// //       message: `Delivery status updated to ${status}`,
// //       delivery,
// //     });


// //   } catch (error) {

// //     console.error(
// //       "Error updating delivery:",
// //       error
// //     );


// //     return NextResponse.json(
// //       {
// //         error: "Failed to update delivery",
// //       },
// //       {
// //         status: 500,
// //       }
// //     );
// //   }
// // }

// // C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\riders\update-delivery\[deliveryId]\route.ts
// import { verifyToken } from "@/shd-lib/lib/auth";
// import { connectToDatabase } from "@/shd-lib/lib/mongodb";
// import Delivery from "@/shd-models/models/Delivery";
// import Rider from "@/shd-models/models/Rider";
// import Order from "@/shd-models/models/Order";
// import { NextRequest, NextResponse } from "next/server";

// // Helper function to generate a 6-digit confirmation code
// function generateConfirmationCode(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ deliveryId: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const { deliveryId } = await params;

//     const token = req.headers.get("authorization")?.split(" ")[1];

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);

//     if (!decoded || decoded.role !== "rider") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { status } = body;

//     const rider = await Rider.findOne({
//       userId: decoded.userId,
//     });

//     if (!rider) {
//       return NextResponse.json({ error: "Rider not found" }, { status: 404 });
//     }

//     const delivery = await Delivery.findById(deliveryId);

//     if (!delivery) {
//       return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
//     }

//     // Verify this delivery belongs to this rider
//     if (delivery.assignedRiderId?.toString() !== rider._id.toString()) {
//       return NextResponse.json(
//         {
//           error: "Unauthorized - This delivery is not assigned to you",
//         },
//         {
//           status: 403,
//         }
//       );
//     }

//     // Update delivery status based on the new flow
//     if (status === "picked_up") {
//       delivery.status = "picked_up";
//       delivery.pickedUpAt = new Date();
//     } else if (status === "in_transit") {
//       delivery.status = "in_transit";
//       delivery.inTransitAt = new Date();
//     } else if (status === "delivered") {
//       // When rider marks as delivered, generate confirmation code
//       const confirmationCode = generateConfirmationCode();
//       const expiresAt = new Date();
//       expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes
      
//       delivery.status = "awaiting_confirmation";
//       delivery.deliveredAt = new Date();
//       delivery.confirmationCode = confirmationCode;
//       delivery.codeGeneratedAt = new Date();
//       delivery.codeExpiresAt = expiresAt;
      
//       // Update order status
//       await Order.findByIdAndUpdate(delivery.orderId, {
//         deliveryStatus: "awaiting_confirmation",
//         status: "awaiting_confirmation"
//       });
      
//       await delivery.save();
      
//       return NextResponse.json({
//         message: "Delivery marked as delivered. Awaiting customer confirmation.",
//         delivery: {
//           id: delivery._id,
//           status: delivery.status,
//           confirmationCode: confirmationCode,
//           expiresAt: expiresAt
//         }
//       });
//     } else if (status === "completed") {
//       // This is when rider enters the confirmation code
//       // We'll handle this in a separate endpoint
//       return NextResponse.json(
//         { error: "Use the confirm-delivery endpoint for code verification" },
//         { status: 400 }
//       );
//     }

//     await delivery.save();

//     return NextResponse.json({
//       message: `Delivery status updated to ${status}`,
//       delivery,
//     });

//   } catch (error) {
//     console.error("Error updating delivery:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to update delivery",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\riders\update-delivery\[deliveryId]\route.ts
import { verifyToken } from "@/shd-lib/lib/auth";
import { connectToDatabase } from "@/shd-lib/lib/mongodb";
import Delivery from "@/shd-models/models/Delivery";
import Rider from "@/shd-models/models/Rider";
import Order from "@/shd-models/models/Order";
import { NextRequest, NextResponse } from "next/server";

// Helper function to generate a 6-digit confirmation code
function generateConfirmationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    await connectToDatabase();

    const { deliveryId } = await params;

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "rider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    const rider = await Rider.findOne({
      userId: decoded.userId,
    });

    if (!rider) {
      return NextResponse.json({ error: "Rider not found" }, { status: 404 });
    }

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    // Verify this delivery belongs to this rider
    if (delivery.assignedRiderId?.toString() !== rider._id.toString()) {
      return NextResponse.json(
        {
          error: "Unauthorized - This delivery is not assigned to you",
        },
        {
          status: 403,
        }
      );
    }

    // Update delivery status based on the new flow
    if (status === "picked_up") {
      delivery.status = "picked_up";
      delivery.pickedUpAt = new Date();
    } else if (status === "in_transit") {
      delivery.status = "in_transit";
      delivery.inTransitAt = new Date();
    } else if (status === "delivered") {
      // When rider marks as delivered, generate confirmation code
      // BUT DO NOT show it to the rider - only store it
      const confirmationCode = generateConfirmationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes
      
      delivery.status = "awaiting_confirmation";
      delivery.deliveredAt = new Date();
      delivery.confirmationCode = confirmationCode;
      delivery.codeGeneratedAt = new Date();
      delivery.codeExpiresAt = expiresAt;
      
      // Update order status
      await Order.findByIdAndUpdate(delivery.orderId, {
        deliveryStatus: "awaiting_confirmation",
        status: "awaiting_confirmation"
      });
      
      await delivery.save();
      
      // Return success WITHOUT the confirmation code
      return NextResponse.json({
        message: "Delivery marked as delivered. Waiting for customer confirmation.",
        delivery: {
          id: delivery._id,
          status: delivery.status,
          // NO confirmation code returned to rider
        }
      });
    }

    await delivery.save();

    return NextResponse.json({
      message: `Delivery status updated to ${status}`,
      delivery,
    });

  } catch (error) {
    console.error("Error updating delivery:", error);
    return NextResponse.json(
      {
        error: "Failed to update delivery",
      },
      {
        status: 500,
      }
    );
  }
}