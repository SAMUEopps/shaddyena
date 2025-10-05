// app/api/shops/[id]/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/product';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // <-- new shape
) {
  try {
    await dbConnect();

    const { id } = await context.params;         // <-- await the promise
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const skip = (page - 1) * limit;

    let query: any = {
      shopId: id,                                // use the awaited value
      isActive: true,
      isApproved: true,
    };

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('vendorId', 'firstName lastName')
      .populate('shopId', 'businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}