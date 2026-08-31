// // app/api/petty-cash/requests/[id]/reject/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// async function verifyAuth(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { error: 'No token provided', status: 401 };
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
//     return { userId: decoded.userId, role: decoded.role };
//   } catch (error) {
//     return { error: 'Invalid token', status: 401 };
//   }
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const auth = await verifyAuth(req);
//     if (auth.error) {
//       return NextResponse.json(
//         { success: false, error: auth.error },
//         { status: auth.status }
//       );
//     }

//     const body = await req.json();
//     const { reason } = body;

//     await connectToDatabase();

//     const request = await ExpenseRequest.findById(params.id);

//     if (!request) {
//       return NextResponse.json(
//         { success: false, error: 'Request not found' },
//         { status: 404 }
//       );
//     }

//     if (request.status !== 'pending') {
//       return NextResponse.json(
//         { success: false, error: 'Request is not pending' },
//         { status: 400 }
//       );
//     }

//     // Update request
//     request.status = 'rejected';
//     request.approverId = new mongoose.Types.ObjectId(auth.userId);
//     request.rejectionReason = reason || 'No reason provided';
//     request.rejectedAt = new Date();
//     await request.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Request rejected successfully',
//       request: request
//     });

//   } catch (error: any) {
//     console.error('Error rejecting request:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/petty-cash/requests/[id]/reject/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// async function verifyAuth(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { error: 'No token provided', status: 401 };
//     }

//     const token = authHeader.split(' ')[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'secret'
//     ) as {
//       userId: string;
//       role: string;
//     };

//     return {
//       userId: decoded.userId,
//       role: decoded.role
//     };
//   } catch (error) {
//     return {
//       error: 'Invalid token',
//       status: 401
//     };
//   }
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const auth = await verifyAuth(req);

//     if (auth.error) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: auth.error
//         },
//         { status: auth.status }
//       );
//     }

//     // Next.js 15+ dynamic params
//     const { id } = await params;

//     const body = await req.json();
//     const { reason } = body;

//     await connectToDatabase();

//     const request = await ExpenseRequest.findById(id);

//     if (!request) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Request not found'
//         },
//         { status: 404 }
//       );
//     }

//     if (request.status !== 'pending') {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Request is not pending'
//         },
//         { status: 400 }
//       );
//     }

//     // Update request
//     request.status = 'rejected';
//     request.approverId = new mongoose.Types.ObjectId(auth.userId);
//     request.rejectionReason = reason || 'No reason provided';
//     request.rejectedAt = new Date();

//     await request.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Request rejected successfully',
//       request
//     });

//   } catch (error: any) {
//     console.error('Error rejecting request:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }


// app/api/petty-cash/requests/[id]/reject/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
    };

    return {
      userId: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    return {
      error: 'Invalid token',
      status: 401
    };
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // =========================================================
    // 1. AUTH
    // =========================================================

    const auth = await verifyAuth(req);

    if (auth.error) {
      return NextResponse.json(
        {
          success: false,
          error: auth.error
        },
        { status: auth.status }
      );
    }

    // =========================================================
    // 2. PARAMS & BODY
    // =========================================================

    const { id } = await params;
    const body = await req.json();
    const { reason } = body;

    // =========================================================
    // 3. DATABASE CONNECTION
    // =========================================================

    await connectToDatabase();

    // =========================================================
    // 4. FIND REQUEST
    // =========================================================

    const request = await ExpenseRequest.findById(id);

    if (!request) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found'
        },
        { status: 404 }
      );
    }

    // =========================================================
    // 5. VALIDATE STATUS
    // =========================================================

    if (request.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          error: `Request is not pending (current status: ${request.status})`
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 6. UPDATE REQUEST
    // =========================================================

    request.status = 'rejected';
    request.approverId = new mongoose.Types.ObjectId(auth.userId);
    request.rejectionReason = reason || 'No reason provided';
    request.rejectedAt = new Date();
    request.metadata = {
      ...request.metadata,
      rejectedBy: auth.userId,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason || 'No reason provided'
    };

    await request.save();

    // =========================================================
    // 7. LOG AND RETURN
    // =========================================================

    console.log('Request rejected successfully:', {
      requestId: request._id.toString(),
      rejectedBy: auth.userId,
      reason: request.rejectionReason
    });

    return NextResponse.json({
      success: true,
      message: 'Request rejected successfully',
      request: {
        id: request._id,
        status: request.status,
        rejectionReason: request.rejectionReason,
        rejectedAt: request.rejectedAt
      }
    });

  } catch (error: any) {
    console.error('Error rejecting request:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}