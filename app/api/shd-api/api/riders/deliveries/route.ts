// // C:\Users\USER\Desktop\Projects\my-app\app\api\rider\deliveries\route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import '@/shd-models/models/Order';
// import Delivery from '@/shd-models/models/Delivery';
// import Rider from '@/shd-models/models/Rider';
// import { NextRequest, NextResponse } from 'next/server';


// export async function GET(req: NextRequest) {
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

//     const rider = await Rider.findOne({ userId: decoded.userId });
//     if (!rider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     // Get all deliveries for this rider
//     const deliveries = await Delivery.find({
//       $or: [
//         { assignedRiderId: rider._id },
//         { status: 'pending' } // Available deliveries
//       ]
//     })
//     .populate('orderId')
//     .sort({ createdAt: -1 })
//     .limit(50);

//     // Format deliveries for frontend
//     const formattedDeliveries = deliveries.map(delivery => ({
//       id: delivery._id,
//       orderId: delivery.orderId?._id || delivery.orderId,
//       customerName: delivery.customerName || 'Customer',
//       customerPhone: delivery.customerPhone || 'N/A',
//       pickupLocation: delivery.pickupLocation || 'N/A',
//       dropoffLocation: delivery.dropoffLocation || 'N/A',
//       status: delivery.status || 'pending',
//       distance: delivery.distance || 0,
//       earnings: delivery.earnings || 0,
//       createdAt: delivery.createdAt,
//       estimatedTime: delivery.estimatedTime || '30 min'
//     }));

//     return NextResponse.json(formattedDeliveries);

//   } catch (error) {
//     console.error('Error fetching deliveries:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch deliveries' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\riders\deliveries\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import '@/shd-models/models/Order';
import Delivery from '@/shd-models/models/Delivery';
import Rider from '@/shd-models/models/Rider';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'rider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rider = await Rider.findOne({ userId: decoded.userId });
    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    // Get all deliveries for this rider
    const deliveries = await Delivery.find({
      $or: [
        { assignedRiderId: rider._id },
        { status: 'pending' } // Available deliveries
      ]
    })
    .populate('orderId')
    .sort({ createdAt: -1 })
    .limit(50);

    // Format deliveries for frontend - INCLUDING ALL FIELDS
    const formattedDeliveries = deliveries.map(delivery => {
      // Convert to plain object and handle MongoDB document
      const deliveryObj = delivery.toObject ? delivery.toObject() : delivery;
      
      return {
        id: deliveryObj._id.toString(),
        orderId: deliveryObj.orderId?._id?.toString() || deliveryObj.orderId?.toString() || 'N/A',
        customerName: deliveryObj.customerName || 'Customer',
        customerPhone: deliveryObj.customerPhone || 'N/A',
        pickupLocation: deliveryObj.pickupLocation || 'N/A',
        dropoffLocation: deliveryObj.dropoffLocation || 'N/A',
        status: deliveryObj.status || 'pending',
        distance: deliveryObj.distance || 0,
        earnings: deliveryObj.earnings || 0,
        createdAt: deliveryObj.createdAt,
        estimatedTime: deliveryObj.estimatedTime || '30 min',
        // Include confirmation-related fields
        customerConfirmed: deliveryObj.customerConfirmed || false,
        codeExpiresAt: deliveryObj.codeExpiresAt ? deliveryObj.codeExpiresAt.toISOString() : undefined,
        confirmationCode: deliveryObj.confirmationCode, // Only include if needed, but we hide it from rider
        deliveredAt: deliveryObj.deliveredAt,
        completedAt: deliveryObj.completedAt,
        acceptedAt: deliveryObj.acceptedAt,
        pickedUpAt: deliveryObj.pickedUpAt,
        inTransitAt: deliveryObj.inTransitAt,
        // Include all status tracking
        customerConfirmedAt: deliveryObj.customerConfirmedAt
      };
    });

    return NextResponse.json(formattedDeliveries);

  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}