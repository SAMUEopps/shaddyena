// // app/api/shd-api/api/advertisements/vendor/[vendorId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Advertisement from '@/shd-models/models/Advertisement';
// import { verifyToken } from '@/shd-lib/lib/auth';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { vendorId: string } }
// ) {
//   try {
//     await connectToDatabase();

//     // Verify authentication
//     const token = req.headers.get('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const user = await verifyToken(token);
//     if (!user) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const { vendorId } = await params;

//     const advertisements = await Advertisement.find({ vendorId })
//       .sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       advertisements,
//     });

//   } catch (error: any) {
//     console.error('Error fetching vendor advertisements:', error);
//     return NextResponse.json({ error: error.message || 'Failed to fetch advertisements' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Advertisement from '@/shd-models/models/Advertisement';
import { verifyToken } from '@/shd-lib/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { vendorId } = await params;

    const advertisements = await Advertisement.find({ vendorId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      advertisements,
    });

  } catch (error: any) {
    console.error('Error fetching vendor advertisements:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}