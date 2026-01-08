// app/api/products/[id]/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- Promise wrapped
) {
  try {
    await dbConnect();

    const { id } = await params; 

    const doc = await Product.findById(id)
  .populate("vendorId", "businessName")
  .populate("shopId", "businessName location");

// convert to plain object and stringify ids
const product = {
  ...doc.toObject(),
  _id: doc._id.toString(),
  vendorId: doc.vendorId._id.toString(),
  shopId: doc.shopId._id.toString(),
};  

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
}*/

// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params; 

    const doc = await Product.findById(id)
      .populate("vendorId", "businessName")
      .populate("shopId", "businessName location");

    if (!doc || !doc.isActive || !doc.isApproved) {
      return NextResponse.json(
        { message: "Product not available" },
        { status: 404 }
      );
    }

    // Safely extract populated data
    const product = {
      ...doc.toObject(),
      _id: doc._id.toString(),
      vendorId: doc.vendorId?._id?.toString() || doc.vendorId?.toString() || '',
      shopId: doc.shopId?._id?.toString() || doc.shopId?.toString() || '',
      // Safely handle populated vendor/shop data
      vendor: doc.vendorId ? {
        businessName: doc.vendorId.businessName || 'Unknown Vendor'
      } : null,
      shop: doc.shopId ? {
        businessName: doc.shopId.businessName || 'Unknown Shop',
        location: doc.shopId.location || null
      } : null
    };

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Product API Error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}