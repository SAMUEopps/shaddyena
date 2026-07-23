// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Product from '@/models/Product';
// import Vendor from '@/models/Vendor';
// import { verifyToken } from '@/lib/auth';

// export async function POST(req: NextRequest) {
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
//     const { name, price, stock, description } = body;

//     // Get vendor profile
//     const vendor = await Vendor.findOne({ userId: decoded.userId });
//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Vendor profile not found' },
//         { status: 404 }
//       );
//     }

//     const product = await Product.create({
//       vendorId: vendor._id,
//       name,
//       price,
//       stock,
//       description,
//       isActive: true
//     });

//     return NextResponse.json({
//       message: 'Product created successfully',
//       product
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Product creation error:', error);
//     return NextResponse.json(
//       { error: 'Product creation failed' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');

//     const query = vendorId ? { vendorId, isActive: true } : { isActive: true };
//     const products = await Product.find(query).populate('vendorId', 'businessName');

//     return NextResponse.json({ products });

//   } catch (error) {
//     console.error('Fetch products error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch products' },
//       { status: 500 }
//     );
//   }
// }

// app/api/products/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Product from '@/shd-models/models/Product';
import Vendor from '@/shd-models/models/Vendor';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { name, price, stock, description, image, imagePublicId } = body;

    // Get vendor profile
    const vendor = await Vendor.findOne({ userId: decoded.userId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const product = await Product.create({
      vendorId: vendor._id,
      name,
      price,
      stock,
      description,
      image: image || null,
      imagePublicId: imagePublicId || null,
      isActive: true
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product
    }, { status: 201 });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Product creation failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Model file:", Product.modelName);
    console.log("Schema paths:", Object.keys(Product.schema.paths));
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    const query = vendorId ? { vendorId, isActive: true } : { isActive: true };
    const products = await Product.find(query).populate('vendorId', 'businessName');

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}