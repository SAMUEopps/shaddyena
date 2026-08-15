// // app/api/shd-api/api/vendors/orders/[id]/route.ts

// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Order from '@/shd-models/models/Order';
// import Vendor from '@/shd-models/models/Vendor';
// import User from '@/shd-models/models/User';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
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

//     const vendor = await Vendor.findOne({ userId: decoded.userId });

//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor not found' },
//         { status: 404 }
//       );
//     }

//     // Next.js dynamic params must be awaited
//     const { id } = await params;

//     const order = await Order.findOne({
//       _id: id,
//       vendorId: vendor._id,
//     })
//       .populate('customerId', 'name phoneNumber email')
//       .populate(
//         'riderId',
//         'name phone vehicleType rating totalDeliveries'
//       );

//     if (!order) {
//       return NextResponse.json(
//         { error: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     // Format the response
//     const formattedOrder = {
//       ...order.toObject(),
//       rider: order.riderId || null,
//       riderId: undefined,
//     };

//     return NextResponse.json({
//       order: formattedOrder,
//     });
//   } catch (error) {
//     console.error('Fetch order details error:', error);

//     return NextResponse.json(
//       { error: 'Failed to fetch order details' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/vendors/orders/[id]/route.ts

import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Order from '@/shd-models/models/Order';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import Product from '@/shd-models/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const vendor = await Vendor.findOne({ userId: decoded.userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Next.js dynamic params must be awaited
    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      vendorId: vendor._id,
    })
      .populate('customerId', 'name phoneNumber email')
      .populate(
        'riderId',
        'name phone vehicleType rating totalDeliveries'
      );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get all product IDs from the order
    const productIds = order.products
      .map((item: any) => item.productId)
      .filter((id: any) => id);

    // Fetch product images - use an object instead of Map
    let productImageMap: Record<string, string> = {};
    if (productIds.length > 0) {
      const products = await Product.find({ 
        _id: { $in: productIds } 
      }).select('_id image');
      
      // Build a simple object map
      productImageMap = products.reduce((map: Record<string, string>, product: any) => {
        map[product._id.toString()] = product.image;
        return map;
      }, {});
    }

    // Format products with images
    const formattedProducts = order.products.map((item: any) => {
      const productId = item.productId?.toString();
      const image = productId ? (productImageMap[productId] || null) : null;
      
      return {
        ...(item.toObject ? item.toObject() : item),
        image: image
      };
    });

    // Format the response
    const formattedOrder = {
      ...order.toObject(),
      rider: order.riderId || null,
      riderId: undefined,
      products: formattedProducts,
    };

    return NextResponse.json({
      order: formattedOrder,
    });
  } catch (error) {
    console.error('Fetch order details error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}