// app/api/categories/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET() {
  await dbConnect();

  try {
    const categories: string[] = await Product.distinct("category", { isActive: true, isApproved: true });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching categories" },
      { status: 500 }
    );
  }
}
