// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/lib/mongodb';
// // import Vendor from '@/models/Vendor';
// // import Product from '@/models/Product';
// // import Order from '@/models/Order';

// // export async function GET(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     await connectToDatabase();
// //     const { id } = params;

// //     // Get vendor details
// //     const vendor = await Vendor.findById(id)
// //       .populate('userId', 'name email')
// //       .lean();

// //     if (!vendor) {
// //       return NextResponse.json(
// //         { error: 'Shop not found' },
// //         { status: 404 }
// //       );
// //     }

// //     // Get products
// //     const products = await Product.find({ 
// //       vendorId: id, 
// //       isActive: true 
// //     }).sort({ createdAt: -1 });

// //     // Get order statistics
// //     const orderStats = await Order.aggregate([
// //       { $match: { vendorId: vendor._id } },
// //       {
// //         $group: {
// //           _id: null,
// //           totalOrders: { $sum: 1 },
// //           totalRevenue: { $sum: '$totalAmount' },
// //           completedOrders: {
// //             $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
// //           }
// //         }
// //       }
// //     ]);

// //     const stats = orderStats[0] || { totalOrders: 0, totalRevenue: 0, completedOrders: 0 };

// //     return NextResponse.json({
// //       shop: {
// //         ...vendor,
// //         products,
// //         stats
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Fetch shop detail error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to fetch shop details' },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import Vendor from "@/models/Vendor";
// import Product from "@/models/Product";
// import Order from "@/models/Order";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDatabase();

//     const { id } = await params;

//     const vendor = await Vendor.findById(id)
//       .populate("userId", "name email")
//       .lean();

//     if (!vendor) {
//       return NextResponse.json(
//         { error: "Shop not found" },
//         { status: 404 }
//       );
//     }

//     const products = await Product.find({
//       vendorId: id,
//       isActive: true,
//     }).sort({ createdAt: -1 });

//     const orderStats = await Order.aggregate([
//       {
//         $match: {
//           vendorId: vendor._id,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalRevenue: { $sum: "$totalAmount" },
//           completedOrders: {
//             $sum: {
//               $cond: [
//                 { $eq: ["$status", "delivered"] },
//                 1,
//                 0,
//               ],
//             },
//           },
//         },
//       },
//     ]);

//     const stats = orderStats[0] || {
//       totalOrders: 0,
//       totalRevenue: 0,
//       completedOrders: 0,
//     };

//     return NextResponse.json({
//       shop: {
//         ...vendor,
//         products,
//         stats,
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to fetch shop details" },
//       { status: 500 }
//     );
//   }
// }

// app/api/shops/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Vendor from "@/models/Vendor";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const vendor = await Vendor.findById(id)
      .populate("userId", "name email")
      .select('businessName ownerName phoneNumber businessLocation payoutMethod profileImage coverImage totalEarned createdAt')
      .lean();

    if (!vendor) {
      return NextResponse.json(
        { error: "Shop not found" },
        { status: 404 }
      );
    }

    const products = await Product.find({
      vendorId: id,
      isActive: true,
    })
      .select('name price description stock image createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const orderStats = await Order.aggregate([
      {
        $match: {
          vendorId: vendor._id,
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          completedOrders: {
            $sum: {
              $cond: [
                { $eq: ["$status", "delivered"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      completedOrders: 0,
    };

    return NextResponse.json({
      shop: {
        ...vendor,
        products,
        stats,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch shop details" },
      { status: 500 }
    );
  }
}