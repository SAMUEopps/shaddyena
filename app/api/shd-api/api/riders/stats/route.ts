// // C:\Users\USER\Desktop\Projects\my-app\app\api\rider\stats\route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
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

//     return NextResponse.json({
//       totalDeliveries: rider.totalDeliveries || 0,
//       totalEarned: rider.totalEarned || 0,
//       pendingPayout: rider.pendingPayout || 0,
//       rating: rider.rating || 5.0,
//       isAvailable: rider.isAvailable || false,
//       onlineTime: '2h 15m' // This would be calculated from last online time
//     });

//   } catch (error) {
//     console.error('Error fetching rider stats:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch stats' },
//       { status: 500 }
//     );
//   }
// }

// C:\Users\USER\Desktop\Projects\shaddyena\app\api\shd-api\api\riders\stats\route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
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

    // Get additional stats about awaiting confirmation
    const awaitingConfirmationCount = await Delivery.countDocuments({
      assignedRiderId: rider._id,
      status: 'awaiting_confirmation'
    });

    const awaitingWithCustomerConfirmed = await Delivery.countDocuments({
      assignedRiderId: rider._id,
      status: 'awaiting_confirmation',
      customerConfirmed: true
    });

    return NextResponse.json({
      totalDeliveries: rider.totalDeliveries || 0,
      totalEarned: rider.totalEarned || 0,
      pendingPayout: rider.pendingPayout || 0,
      rating: rider.rating || 5.0,
      isAvailable: rider.isAvailable || false,
      onlineTime: '2h 15m', // This would be calculated from last online time
      // Additional stats for better UX
      awaitingConfirmation: awaitingConfirmationCount,
      awaitingCustomerConfirmed: awaitingWithCustomerConfirmed
    });

  } catch (error) {
    console.error('Error fetching rider stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}