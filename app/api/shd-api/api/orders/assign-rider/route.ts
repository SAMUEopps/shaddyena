// // app/api/orders/assign-rider/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Order from '@/shd-models/models/Order';
// import Delivery from '@/shd-models/models/Delivery';
// import Rider from '@/shd-models/models/Rider';
// import Vendor from '@/shd-models/models/Vendor';
// import User from '@/shd-models/models/User';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
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

//     const body = await req.json();
//     const { orderId, riderId, deliveryFee } = body;

//     if (!orderId || !riderId) {
//       return NextResponse.json(
//         { error: 'Order ID and Rider ID are required' },
//         { status: 400 }
//       );
//     }

//     // Get vendor
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // Get order
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     // Verify order belongs to this vendor
//     if (order.vendorId.toString() !== vendor._id.toString()) {
//       return NextResponse.json(
//         { error: 'Unauthorized - Order does not belong to this vendor' },
//         { status: 403 }
//       );
//     }

//     // Check if order already has a rider assigned
//     if (order.riderId) {
//       return NextResponse.json(
//         { error: 'Order already has a rider assigned' },
//         { status: 400 }
//       );
//     }

//     // Get rider
//     const rider = await Rider.findById(riderId);
//     if (!rider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     // Check if rider is available
//     if (!rider.isAvailable || !rider.isActive) {
//       return NextResponse.json(
//         { error: 'Rider is not available' },
//         { status: 400 }
//       );
//     }

//     // Get customer details
//     const customer = await User.findById(order.customerId);
//     if (!customer) {
//       return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
//     }

//     // Calculate delivery earnings (if not provided, use default)
//     const earnings = deliveryFee || calculateDeliveryFee(order.totalAmount);

//     // Create delivery record
//     const delivery = await Delivery.create({
//       orderId: order._id,
//       customerName: customer.name,
//       customerPhone: order.deliveryPhone || customer.phoneNumber,
//       pickupLocation: vendor.businessLocation || 'Vendor location',
//       dropoffLocation: order.deliveryAddress,
//       assignedRiderId: rider._id,
//       status: 'pending',
//       distance: calculateDistance(vendor.businessLocation, order.deliveryAddress),
//       earnings: earnings,
//       estimatedTime: '30 min',
//       acceptedAt: new Date()
//     });

//     // Update order with rider and delivery info
//     order.riderId = rider._id;
//     order.assignedRiderId = rider._id;
//     order.deliveryId = delivery._id;
//     order.deliveryStatus = 'assigned';
//     order.riderAssignedAt = new Date();
//     order.status = 'processing'; // Move to processing when rider assigned
//     await order.save();

//     // Update rider's assigned deliveries count (optional)
//     // You could add an activeDeliveries field to Rider model

//     return NextResponse.json({
//       success: true,
//       message: 'Rider assigned successfully',
//       order: {
//         id: order._id,
//         orderNumber: order.orderNumber,
//         status: order.status,
//         deliveryStatus: order.deliveryStatus,
//         rider: {
//           id: rider._id,
//           name: rider.fullName,
//           phone: rider.phoneNumber,
//           vehicle: rider.vehicleType
//         },
//         delivery: {
//           id: delivery._id,
//           status: delivery.status,
//           earnings: delivery.earnings,
//           estimatedTime: delivery.estimatedTime
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Error assigning rider:', error);
//     return NextResponse.json(
//       { error: 'Failed to assign rider' },
//       { status: 500 }
//     );
//   }
// }

// // Helper functions
// function calculateDeliveryFee(totalAmount: number): number {
//   // Simple calculation - can be customized
//   if (totalAmount < 500) return 100;
//   if (totalAmount < 1000) return 150;
//   if (totalAmount < 2000) return 200;
//   return 250;
// }

// function calculateDistance(pickup: string, dropoff: string): number {
//   // This would use Google Maps API or similar
//   // For now, return a random distance between 2-10 km
//   return Math.round((2 + Math.random() * 8) * 10) / 10;
// }
// app/api/orders/assign-rider/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Order from '@/shd-models/models/Order';
import Delivery from '@/shd-models/models/Delivery';
import Rider from '@/shd-models/models/Rider';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

// Helper: Calculate delivery fee based on order amount
function calculateDeliveryFee(totalAmount: number): number {
  // Simple tiered delivery fee
  if (totalAmount < 500) return 100;
  if (totalAmount < 1000) return 150;
  if (totalAmount < 2000) return 200;
  if (totalAmount < 5000) return 300;
  return 400;
}

// Helper: Calculate distance (mock implementation)
function calculateDistance(pickup: string, dropoff: string): number {
  // In production, use Google Maps Distance Matrix API
  // For now, return a random distance between 2-10 km
  return Math.round((2 + Math.random() * 8) * 10) / 10;
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { orderId, riderId, deliveryFee } = body;

    if (!orderId || !riderId) {
      return NextResponse.json(
        { error: 'Order ID and Rider ID are required' },
        { status: 400 }
      );
    }

    // Get vendor
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to this vendor
    if (order.vendorId.toString() !== vendor._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized - Order does not belong to this vendor' },
        { status: 403 }
      );
    }

    // Check if order already has a rider assigned
    if (order.riderId) {
      return NextResponse.json(
        { error: 'Order already has a rider assigned' },
        { status: 400 }
      );
    }

    // Check if order is paid
    if (!order.isPaid) {
      return NextResponse.json(
        { error: 'Order must be paid before assigning a rider' },
        { status: 400 }
      );
    }

    // Get rider
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
    }

    // Check if rider is available
    if (!rider.isAvailable || !rider.isActive) {
      return NextResponse.json(
        { error: 'Rider is not available' },
        { status: 400 }
      );
    }

    // Get customer details
    const customer = await User.findById(order.customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate delivery earnings
    const earnings = deliveryFee || calculateDeliveryFee(order.totalAmount);

    // Create delivery record
    const delivery = await Delivery.create({
      orderId: order._id,
      customerName: customer.name || 'Customer',
      customerPhone: order.deliveryPhone || customer.phoneNumber || 'N/A',
      pickupLocation: vendor.businessLocation || 'Vendor location',
      dropoffLocation: order.deliveryAddress,
      assignedRiderId: rider._id,
      status: 'pending',
      distance: calculateDistance(vendor.businessLocation || '', order.deliveryAddress || ''),
      earnings: earnings,
      estimatedTime: '30 min',
      acceptedAt: new Date()
    });

    // Update order with rider and delivery info
    order.riderId = rider._id;
    order.assignedRiderId = rider._id;
    order.deliveryId = delivery._id;
    order.deliveryStatus = 'assigned';
    order.riderAssignedAt = new Date();
    order.status = 'processing'; // Move to processing when rider assigned
    await order.save();

    // Update rider stats (optional)
    // You could add an activeDeliveries field to Rider model
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Rider assigned successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        rider: {
          id: rider._id,
          name: rider.fullName || rider.userId?.name || 'Rider',
          phone: rider.phoneNumber || 'N/A',
          vehicle: rider.vehicleType
        },
        delivery: {
          id: delivery._id,
          status: delivery.status,
          earnings: delivery.earnings,
          estimatedTime: delivery.estimatedTime
        }
      }
    });

  } catch (error) {
    console.error('Error assigning rider:', error);
    return NextResponse.json(
      { error: 'Failed to assign rider' },
      { status: 500 }
    );
  }
}