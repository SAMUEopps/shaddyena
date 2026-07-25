// // app/api/orders/vendor/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Order from '@/shd-models/models/Order';
// import Vendor from '@/shd-models/models/Vendor';
// import User from '@/shd-models/models/User';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'vendor') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Get vendor
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // Get all orders for this vendor
//     const orders = await Order.find({ vendorId: vendor._id })
//       .populate('customerId', 'name phoneNumber email')
//       .populate('riderId', 'fullName phoneNumber vehicleType rating')
//       .populate('deliveryId', 'status earnings estimatedTime')
//       .sort({ createdAt: -1 })
//       .limit(100);

//     // Format orders with delivery info
//     const formattedOrders = orders.map(order => ({
//       _id: order._id,
//       orderNumber: order.orderNumber,
//       totalAmount: order.totalAmount,
//       status: order.status,
//       deliveryStatus: order.deliveryStatus || 'pending',
//       customerId: {
//         name: order.customerId?.name || 'Unknown',
//         phone: order.customerId?.phoneNumber || 'N/A'
//       },
//       products: order.products,
//       createdAt: order.createdAt,
//       deliveryAddress: order.deliveryAddress,
//       deliveryPhone: order.deliveryPhone,
//       rider: order.riderId ? {
//         id: order.riderId._id,
//         name: order.riderId.fullName,
//         phone: order.riderId.phoneNumber,
//         vehicle: order.riderId.vehicleType,
//         rating: order.riderId.rating
//       } : null,
//       delivery: order.deliveryId ? {
//         id: order.deliveryId._id,
//         status: order.deliveryId.status,
//         earnings: order.deliveryId.earnings,
//         estimatedTime: order.deliveryId.estimatedTime
//       } : null,
//       riderAssignedAt: order.riderAssignedAt,
//       pickedUpAt: order.pickedUpAt,
//       deliveredAt: order.deliveredAt
//     }));

//     return NextResponse.json({
//       success: true,
//       orders: formattedOrders
//     });

//   } catch (error) {
//     console.error('Error fetching vendor orders:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }

// app/api/orders/vendor/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Order from '@/shd-models/models/Order';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get vendor
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Get all orders for this vendor
    const orders = await Order.find({ vendorId: vendor._id })
      .populate('customerId', 'name phoneNumber email')
      .populate('riderId', 'fullName phoneNumber vehicleType rating')
      .populate('deliveryId', 'status earnings estimatedTime distance')
      .sort({ createdAt: -1 })
      .limit(100);

    // Format orders with delivery info
    const formattedOrders = orders.map(order => {
      const orderObj = order.toObject();
      return {
        _id: orderObj._id,
        orderNumber: orderObj.orderNumber,
        totalAmount: orderObj.totalAmount,
        status: orderObj.status,
        deliveryStatus: orderObj.deliveryStatus || 'pending',
        customerId: {
          name: orderObj.customerId?.name || 'Unknown',
          phone: orderObj.customerId?.phoneNumber || 'N/A'
        },
        products: orderObj.products || [],
        createdAt: orderObj.createdAt,
        deliveryAddress: orderObj.deliveryAddress,
        deliveryPhone: orderObj.deliveryPhone,
        isPaid: orderObj.isPaid,
        rider: orderObj.riderId ? {
          id: orderObj.riderId._id,
          name: orderObj.riderId.fullName || 'Rider',
          phone: orderObj.riderId.phoneNumber || 'N/A',
          vehicle: orderObj.riderId.vehicleType || 'N/A',
          rating: orderObj.riderId.rating || 5.0
        } : null,
        delivery: orderObj.deliveryId ? {
          id: orderObj.deliveryId._id,
          status: orderObj.deliveryId.status || 'pending',
          earnings: orderObj.deliveryId.earnings || 0,
          estimatedTime: orderObj.deliveryId.estimatedTime || '30 min',
          distance: orderObj.deliveryId.distance || 0
        } : null,
        riderAssignedAt: orderObj.riderAssignedAt,
        pickedUpAt: orderObj.pickedUpAt,
        deliveredAt: orderObj.deliveredAt
      };
    });

    return NextResponse.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}