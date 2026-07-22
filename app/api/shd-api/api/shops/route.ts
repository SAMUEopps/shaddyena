// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Vendor from '@/models/Vendor';
// import '@/models/User';

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');

//     let query: any = { isActive: true };
    
//     if (vendorId) {
//       query._id = vendorId;
//     }

//     const vendors = await Vendor.find(query)
//       .select('businessName ownerName phoneNumber businessLocation payoutMethod totalEarned createdAt')
//       .populate('userId', 'name email');

//     // Get product count for each vendor
//     const Product = (await import('@/models/Product')).default;
//     const vendorWithCounts = await Promise.all(
//       vendors.map(async (vendor) => {
//         const productCount = await Product.countDocuments({ 
//           vendorId: vendor._id, 
//           isActive: true 
//         });
//         return {
//           ...vendor.toObject(),
//           productCount
//         };
//       })
//     );

//     return NextResponse.json({ 
//       shops: vendorWithCounts,
//       total: vendorWithCounts.length 
//     });

//   } catch (error) {
//     console.error('Fetch shops error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch shops' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shops/route.ts
import { NextRequest, NextResponse } from 'next/server';

import '@/shd-modelsmodels/User';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Vendor from '@/shd-models/models/Vendor';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    let query: any = { isActive: true };
    
    if (vendorId) {
      query._id = vendorId;
    }

    const vendors = await Vendor.find(query)
      .select('businessName ownerName phoneNumber businessLocation payoutMethod profileImage coverImage totalEarned createdAt')
      .populate('userId', 'name email')
      .lean();

    // Get product count for each vendor
    const Product = (await import('@/shd-models/models/Product')).default;
    const vendorWithCounts = await Promise.all(
      vendors.map(async (vendor) => {
        const productCount = await Product.countDocuments({ 
          vendorId: vendor._id, 
          isActive: true 
        });
        return {
          ...vendor,
          productCount
        };
      })
    );

    return NextResponse.json({ 
      shops: vendorWithCounts,
      total: vendorWithCounts.length 
    });

  } catch (error) {
    console.error('Fetch shops error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    );
  }
}