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