// // app/api/shd-api/api/advertisements/upload/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { uploadToCloudinary } from '@/shd-lib/lib/cloudinary';
// import { verifyToken } from '@/shd-lib/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     // Verify authentication
//     const token = req.headers.get('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const user = await verifyToken(token);
//     if (!user) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const image = formData.get('image') as File;

//     if (!image) {
//       return NextResponse.json({ error: 'No image provided' }, { status: 400 });
//     }

//     // Convert file to buffer
//     const bytes = await image.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Upload to Cloudinary
//     const result = await uploadToCloudinary(buffer, 'advertisements');

//     return NextResponse.json({
//       success: true,
//       imageUrl: result.secure_url,
//       publicId: result.public_id,
//     });

//   } catch (error: any) {
//     console.error('Error uploading advertisement image:', error);
//     return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
//   }
// }

// app/api/shd-api/api/advertisements/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/shd-lib/lib/cloudinary';
import { verifyToken } from '@/shd-lib/lib/auth';

export async function POST(req: NextRequest) {
  console.log('========== Advertisement Upload Started ==========');

  try {
    // Authentication
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization Header:', authHeader ? 'Present' : 'Missing');

    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.error('❌ No token provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Verifying token...');

    const user = await verifyToken(token);

    if (!user) {
      console.error('❌ Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated');
    console.log('User:', user);

    // Read FormData
    console.log('Reading FormData...');
    const formData = await req.formData();

    console.log('FormData Keys:', [...formData.keys()]);

    const image = formData.get('image') as File | null;

    if (!image) {
      console.error('❌ No image field found');
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('Image Details:');
    console.log({
      name: image.name,
      type: image.type,
      size: image.size,
    });

    console.log('Converting image to buffer...');
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Buffer Size:', buffer.length);

    console.log('Uploading to Cloudinary...');

    const result = await uploadToCloudinary(buffer, 'advertisements');

    console.log('✅ Cloudinary Upload Successful');
    console.log({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });

    console.log('========== Upload Completed ==========');

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error: any) {
    console.error('========== Upload Failed ==========');
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);
    console.error('Full Error:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}