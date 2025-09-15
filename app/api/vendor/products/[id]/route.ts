/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const product = await Product.findOne({ _id: params.id, vendorId: decoded.userId });
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const productData = await req.json();
    
    const product = await Product.findOneAndUpdate(
      { _id: params.id, vendorId: decoded.userId },
      { ...productData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Product updated successfully', 
      product 
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const product = await Product.findOneAndDelete({ _id: params.id, vendorId: decoded.userId });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/vendor/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
type TokenPayload = { userId: string };

async function getVendor(req: NextRequest): Promise<string> {
  const token = req.cookies.get('token')?.value;
  if (!token) throw { status: 401, message: 'Not authenticated' };

  try {
    const { userId } = verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return userId;
  } catch {
    throw { status: 401, message: 'Invalid token' };
  }
}

/* ------------------------------------------------------------------ */
/* Route handlers                                                     */
/* ------------------------------------------------------------------ */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const vendorId = await getVendor(req);
    const { id } = await params;

    const product = await Product.findOne({ _id: id, vendorId });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ product });
  } catch (e: any) {
    const status = e.status ?? 500;
    return NextResponse.json({ message: e.message || 'Internal server error' }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const vendorId = await getVendor(req);
    const { id } = await params;
    const payload = await req.json();

    const product = await Product.findOneAndUpdate(
      { _id: id, vendorId },
      payload,
      { new: true, runValidators: true }
    );
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (e: any) {
    if (e.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    const status = e.status ?? 500;
    return NextResponse.json({ message: e.message || 'Internal server error' }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const vendorId = await getVendor(req);
    const { id } = await params;

    const product = await Product.findOneAndDelete({ _id: id, vendorId });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (e: any) {
    const status = e.status ?? 500;
    return NextResponse.json({ message: e.message || 'Internal server error' }, { status });
  }
}