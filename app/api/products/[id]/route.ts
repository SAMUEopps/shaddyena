/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id)
      .populate('vendorId', 'businessName')
      .populate('shopId', 'businessName location');

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Only return active and approved products to non-admin users
    if (!product.isActive || !product.isApproved) {
      // You might want to add admin check here to allow admins to see inactive products
      return NextResponse.json({ message: 'Product not available' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- Promise wrapped
) {
  try {
    await dbConnect();

    const { id } = await params; // <- await the Promise

    const product = await Product.findById(id)
      .populate("vendorId", "businessName")
      .populate("shopId", "businessName location");

    if (!product || !product.isActive || !product.isApproved) {
      return NextResponse.json(
        { message: "Product not available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}