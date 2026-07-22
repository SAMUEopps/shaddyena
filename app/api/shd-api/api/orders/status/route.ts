// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Order from '@/models/Order';
// import Vendor from '@/models/Vendor';
// import Payout from '@/models/Payout';
// import Transaction from '@/models/Transaction';
// import { verifyToken } from '@/lib/auth';
// import { getAccountBalance } from '@/lib/mpesa';    

// export async function PUT(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     const decoded = verifyToken(token);
    
//     if (!decoded) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     const { orderId, status, trackingNumber } = body;

//     // Verify vendor owns this order
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor not found' },
//         { status: 404 }
//       );
//     }

//     const order = await Order.findOne({
//       _id: orderId,
//       vendorId: vendor._id
//     });

//     if (!order) {
//       return NextResponse.json(
//         { error: 'Order not found or unauthorized' },
//         { status: 404 }
//       );
//     }

//     // Update order
//     order.status = status;
//     if (trackingNumber) {
//       order.trackingNumber = trackingNumber;
//     }
//     order.updatedAt = new Date();
//     await order.save();

//     // If delivered, trigger payout process
//     if (status === 'delivered') {
//       await triggerPayout(order._id);
//     }

//     return NextResponse.json({
//       message: 'Order updated successfully',
//       order
//     });

//   } catch (error) {
//     console.error('Order update error:', error);
//     return NextResponse.json(
//       { error: 'Order update failed' },
//       { status: 500 }
//     );
//   }
// }

// async function triggerPayout(orderId: string) {
//   // This will be implemented in the payout route
//   // For now, we'll just log it
//   console.log(`Order ${orderId} delivered, trigger payout`);
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { verifyToken } from '@/lib/auth';
import { processVendorPayout } from '@/lib/payout-engine';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, status, trackingNumber } = body;

    // Verify vendor owns this order
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const order = await Order.findOne({
      _id: orderId,
      vendorId: vendor._id
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update order
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    order.updatedAt = new Date();
    await order.save();

    // If delivered, trigger payout process
    if (status === 'delivered') {
      // Process payout using the payout engine
      const payoutResult = await processVendorPayout(order._id);
      console.log('Payout result:', payoutResult);
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Order update failed' },
      { status: 500 }
    );
  }
}