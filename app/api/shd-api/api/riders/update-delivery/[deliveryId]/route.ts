// // C:\Users\USER\Desktop\Projects\my-app\app\api\rider\update-delivery\[deliveryId]\route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Delivery from '@/shd-models/models/Delivery';
// import Rider from '@/shd-models/models/Rider';
// import { NextRequest, NextResponse } from 'next/server';


// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { deliveryId: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'rider') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { status } = body;

//     const rider = await Rider.findOne({ userId: decoded.userId });
//     if (!rider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     const delivery = await Delivery.findById(params.deliveryId);
//     if (!delivery) {
//       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
//     }

//     // Verify this delivery belongs to this rider
//     if (delivery.assignedRiderId?.toString() !== rider._id.toString()) {
//       return NextResponse.json(
//         { error: 'Unauthorized - This delivery is not assigned to you' },
//         { status: 403 }
//       );
//     }

//     // Update delivery status
//     delivery.status = status;
    
//     if (status === 'picked_up') {
//       delivery.pickedUpAt = new Date();
//     } else if (status === 'in_transit') {
//       delivery.inTransitAt = new Date();
//     } else if (status === 'delivered') {
//       delivery.deliveredAt = new Date();
      
//       // Update rider stats
//       rider.totalDeliveries += 1;
//       rider.totalEarned += delivery.earnings || 0;
//       rider.pendingPayout += delivery.earnings || 0;
//       await rider.save();
//     }

//     await delivery.save();

//     return NextResponse.json({
//       message: `Delivery status updated to ${status}`,
//       delivery
//     });

//   } catch (error) {
//     console.error('Error updating delivery:', error);
//     return NextResponse.json(
//       { error: 'Failed to update delivery' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\my-app\app\api\rider\update-delivery\[deliveryId]\route.ts

import { verifyToken } from "@/shd-lib/lib/auth";
import { connectToDatabase } from "@/shd-lib/lib/mongodb";
import Delivery from "@/shd-models/models/Delivery";
import Rider from "@/shd-models/models/Rider";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ deliveryId: string }> }
) {
  try {
    await connectToDatabase();

    const { deliveryId } = await params;


    const token = req.headers
      .get("authorization")
      ?.split(" ")[1];


    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const decoded = verifyToken(token);


    if (!decoded || decoded.role !== "rider") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const body = await req.json();
    const { status } = body;


    const rider = await Rider.findOne({
      userId: decoded.userId,
    });


    if (!rider) {
      return NextResponse.json(
        { error: "Rider not found" },
        { status: 404 }
      );
    }


    const delivery = await Delivery.findById(
      deliveryId
    );


    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }


    // Verify this delivery belongs to this rider
    if (
      delivery.assignedRiderId?.toString() !==
      rider._id.toString()
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized - This delivery is not assigned to you",
        },
        {
          status: 403,
        }
      );
    }


    // Update delivery status
    delivery.status = status;


    if (status === "picked_up") {

      delivery.pickedUpAt = new Date();

    } else if (status === "in_transit") {

      delivery.inTransitAt = new Date();

    } else if (status === "delivered") {

      delivery.deliveredAt = new Date();


      // Update rider stats
      rider.totalDeliveries += 1;
      rider.totalEarned += delivery.earnings || 0;
      rider.pendingPayout += delivery.earnings || 0;

      await rider.save();
    }


    await delivery.save();


    return NextResponse.json({
      message: `Delivery status updated to ${status}`,
      delivery,
    });


  } catch (error) {

    console.error(
      "Error updating delivery:",
      error
    );


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