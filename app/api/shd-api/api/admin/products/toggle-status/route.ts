// C:\Users\USER\Desktop\Projects\my-app\app\api\admin\products\toggle-status\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { productId, isActive } = body;

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    product.isActive = isActive;
    await product.save();

    return NextResponse.json({
      message: 'Product status updated',
      product
    });

  } catch (error) {
    console.error('Toggle product status error:', error);
    return NextResponse.json(
      { error: 'Failed to update product status' },
      { status: 500 }
    );
  }
}