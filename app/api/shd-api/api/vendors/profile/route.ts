// // app/api/vendors/profile/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Vendor from '@/shd-models/models/Vendor';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
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

//     const vendor = await Vendor.findOne({ userId: decoded.userId })
//       .populate('userId', 'name email')
//       .lean();

//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ vendor });
//   } catch (error) {
//     console.error('Fetch vendor profile error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch vendor profile' },
//       { status: 500 }
//     );
//   }
// }

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
//     const {
//       businessName,
//       ownerName,
//       phoneNumber,
//       businessLocation,
//       payoutMethod,
//       payoutDetails,
//       profileImage,
//       profileImagePublicId,
//       coverImage,
//       coverImagePublicId,
//     } = body;

//     const vendor = await Vendor.findOne({ userId: decoded.userId });

//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     // Update fields
//     if (businessName !== undefined) vendor.businessName = businessName;
//     if (ownerName !== undefined) vendor.ownerName = ownerName;
//     if (phoneNumber !== undefined) vendor.phoneNumber = phoneNumber;
//     if (businessLocation !== undefined) vendor.businessLocation = businessLocation;
//     if (payoutMethod !== undefined) vendor.payoutMethod = payoutMethod;
//     if (payoutDetails !== undefined) {
//       vendor.payoutDetails = {
//         ...vendor.payoutDetails,
//         ...payoutDetails,
//       };
//     }
//     if (profileImage !== undefined) vendor.profileImage = profileImage;
//     if (profileImagePublicId !== undefined) vendor.profileImagePublicId = profileImagePublicId;
//     if (coverImage !== undefined) vendor.coverImage = coverImage;
//     if (coverImagePublicId !== undefined) vendor.coverImagePublicId = coverImagePublicId;

//     await vendor.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Profile updated successfully',
//       vendor,
//     });
//   } catch (error) {
//     console.error('Update vendor profile error:', error);
//     return NextResponse.json(
//       { error: 'Failed to update vendor profile' },
//       { status: 500 }
//     );
//   }
// }

// app/api/shd-api/api/vendors/profile/route.ts

import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Vendor from '@/shd-models/models/Vendor';
import { NextRequest, NextResponse } from 'next/server';
import { IVendor } from '@/shd-models/models/Vendor';
import '@/shd-models/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const vendor = await Vendor.findOne({
      userId: decoded.userId
    })
      .populate('userId', 'name email')
      .lean<IVendor>();


    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }


    const vendorWithDefaults = {
      ...vendor,

      // Revenue
      totalRevenue: vendor.totalRevenue ?? 0,
      availableBalance: vendor.availableBalance ?? 0,
      pendingBalance: vendor.pendingBalance ?? 0,
      totalWithdrawn: vendor.totalWithdrawn ?? 0,
      lifetimeEarnings: vendor.lifetimeEarnings ?? 0,


      // Legacy compatibility
      totalEarned:
        vendor.totalEarned ??
        vendor.totalRevenue ??
        0,

      pendingPayout:
        vendor.pendingPayout ??
        vendor.pendingBalance ??
        0,
    };


    return NextResponse.json({
      success: true,
      vendor: vendorWithDefaults
    });


  } catch (error) {

    console.error(
      'Fetch vendor profile error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Failed to fetch vendor profile'
      },
      {
        status: 500
      }
    );
  }
}




export async function PUT(req: NextRequest) {

  try {

    await connectToDatabase();


    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];


    if (!token) {
      return NextResponse.json(
        { error:'No token provided' },
        {status:401}
      );
    }


    const decoded = verifyToken(token);


    if (!decoded) {
      return NextResponse.json(
        {error:'Unauthorized'},
        {status:401}
      );
    }



    const body = await req.json();


    const vendor = await Vendor.findOne({
      userId: decoded.userId
    });


    if (!vendor) {

      return NextResponse.json(
        {
          error:'Vendor profile not found'
        },
        {
          status:404
        }
      );

    }



    const allowedFields = [
      'businessName',
      'ownerName',
      'phoneNumber',
      'businessLocation',
      'payoutMethod',
      'payoutDetails',
      'profileImage',
      'profileImagePublicId',
      'coverImage',
      'coverImagePublicId'
    ];



    allowedFields.forEach((field)=>{

      if(body[field] !== undefined){

        if(field === 'payoutDetails'){

          vendor.payoutDetails = {
            ...vendor.payoutDetails,
            ...body[field]
          };

        }else{

          (vendor as any)[field] = body[field];

        }

      }

    });



    await vendor.save();



    const updatedVendor = {
      ...vendor.toObject(),

      totalRevenue: vendor.totalRevenue ?? 0,
      availableBalance: vendor.availableBalance ?? 0,
      pendingBalance: vendor.pendingBalance ?? 0,
      totalWithdrawn: vendor.totalWithdrawn ?? 0,
      lifetimeEarnings: vendor.lifetimeEarnings ?? 0,

      totalEarned:
        vendor.totalEarned ??
        vendor.totalRevenue ??
        0,

      pendingPayout:
        vendor.pendingPayout ??
        vendor.pendingBalance ??
        0,
    };



    return NextResponse.json({

      success:true,

      message:
        'Profile updated successfully',

      vendor:updatedVendor

    });



  } catch(error){


    console.error(
      'Update vendor profile error:',
      error
    );


    return NextResponse.json(
      {
        error:'Failed to update vendor profile'
      },
      {
        status:500
      }
    );

  }

}