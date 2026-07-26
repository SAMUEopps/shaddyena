// // app/api/admin/riders/[id]/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Rider from '@/shd-models/models/Rider';
// import User from '@/shd-models/models/User';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const rider = await Rider.findById(params.id)
//       .populate('userId', 'name email phoneNumber isVerified isMember createdAt');

//     if (!rider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, rider });

//   } catch (error) {
//     console.error('Error fetching rider:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch rider' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const body = await req.json();
    
//     // Check if rider exists
//     const existingRider = await Rider.findById(params.id);
//     if (!existingRider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     // If updating national ID, check uniqueness
//     if (body.nationalId && body.nationalId !== existingRider.nationalId) {
//       const existingNationalId = await Rider.findOne({ 
//         nationalId: body.nationalId,
//         _id: { $ne: params.id }
//       });
//       if (existingNationalId) {
//         return NextResponse.json({ error: 'National ID already registered' }, { status: 400 });
//       }
//     }

//     const updateData: any = {};
//     const updatableFields = [
//       'fullName', 'phoneNumber', 'email', 'nationalId', 'kraPin',
//       'vehicleType', 'vehicleRegistration', 'driverLicense',
//       'isActive', 'isAvailable', 'deliveryRadius',
//       'payoutMethod', 'payoutDetails'
//     ];

//     updatableFields.forEach(field => {
//       if (body[field] !== undefined) {
//         updateData[field] = body[field];
//       }
//     });

//     // Handle location update separately
//     if (body.currentLocation) {
//       updateData.currentLocation = {
//         ...body.currentLocation,
//         updatedAt: new Date()
//       };
//     }

//     const rider = await Rider.findByIdAndUpdate(
//       params.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('userId', 'name email phoneNumber isVerified');

//     if (!rider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       rider,
//       message: 'Rider updated successfully' 
//     });

//   } catch (error: any) {
//     console.error('Error updating rider:', error);
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return NextResponse.json(
//         { error: `${field} already exists` },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { error: 'Failed to update rider' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const rider = await Rider.findById(params.id);
//     if (!rider) {
//       return NextResponse.json({ error: 'Rider not found' }, { status: 404 });
//     }

//     // Update user role back to customer if they were a rider
//     await User.findByIdAndUpdate(rider.userId, { role: 'customer' });

//     await Rider.findByIdAndDelete(params.id);

//     return NextResponse.json({ 
//       success: true,
//       message: 'Rider deleted successfully' 
//     });

//   } catch (error) {
//     console.error('Error deleting rider:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete rider' },
//       { status: 500 }
//     );
//   }
// }

// app/api/admin/riders/[id]/route.ts

import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Rider from '@/shd-models/models/Rider';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};


export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const rider = await Rider.findById(id)
      .populate(
        'userId',
        'name email phoneNumber isVerified isMember createdAt'
      );

    if (!rider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      rider
    });

  } catch (error) {
    console.error('Error fetching rider:', error);

    return NextResponse.json(
      { error: 'Failed to fetch rider' },
      { status: 500 }
    );
  }
}



export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const existingRider = await Rider.findById(id);

    if (!existingRider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      );
    }


    if (
      body.nationalId &&
      body.nationalId !== existingRider.nationalId
    ) {
      const existingNationalId = await Rider.findOne({
        nationalId: body.nationalId,
        _id: { $ne: id }
      });

      if (existingNationalId) {
        return NextResponse.json(
          { error: 'National ID already registered' },
          { status: 400 }
        );
      }
    }


    const updateData: any = {};

    const updatableFields = [
      'fullName',
      'phoneNumber',
      'email',
      'nationalId',
      'kraPin',
      'vehicleType',
      'vehicleRegistration',
      'driverLicense',
      'isActive',
      'isAvailable',
      'deliveryRadius',
      'payoutMethod',
      'payoutDetails'
    ];


    updatableFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });


    if (body.currentLocation) {
      updateData.currentLocation = {
        ...body.currentLocation,
        updatedAt: new Date()
      };
    }


    const rider = await Rider.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate(
      'userId',
      'name email phoneNumber isVerified'
    );


    if (!rider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      );
    }


    return NextResponse.json({
      success: true,
      rider,
      message: 'Rider updated successfully'
    });


  } catch (error: any) {
    console.error('Error updating rider:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }


    return NextResponse.json(
      { error: 'Failed to update rider' },
      { status: 500 }
    );
  }
}




export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }


    const rider = await Rider.findById(id);

    if (!rider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      );
    }


    // Change user back to customer role
    await User.findByIdAndUpdate(
      rider.userId,
      { role: 'customer' }
    );


    await Rider.findByIdAndDelete(id);


    return NextResponse.json({
      success: true,
      message: 'Rider deleted successfully'
    });


  } catch (error) {
    console.error('Error deleting rider:', error);

    return NextResponse.json(
      { error: 'Failed to delete rider' },
      { status: 500 }
    );
  }
}