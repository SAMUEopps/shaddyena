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

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // ✅ type context, not destructured
) {
  try {
    console.log("[INFO] Incoming product fetch request...");

    await dbConnect();
    console.log("[SUCCESS] Database connected");

    const { id } = context.params;
    console.log("[INFO] Looking up product with ID:", id);

    const product = await Product.findById(id)
      .populate("vendorId", "businessName")
      .populate("shopId", "businessName location");

    if (!product) {
      console.warn("[WARN] Product not found:", id);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (!product.isActive || !product.isApproved) {
      console.warn("[WARN] Product inactive or not approved:", id);
      return NextResponse.json({ message: "Product not available" }, { status: 404 });
    }

    console.log("[SUCCESS] Product fetched:", id);
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Failed to fetch product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
