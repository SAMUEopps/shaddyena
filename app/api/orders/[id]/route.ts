import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // MUST await

  try {
    await dbConnect();

    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    let query: any = { _id: id };

    if (decoded.role === "customer") {
      query.buyerId = decoded.userId;
    } else if (decoded.role === "vendor") {
      query["suborders.vendorId"] = decoded.userId;
    }

    const order = await Order.findOne(query)
      .populate("buyerId", "firstName lastName email phone")
      .lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("🔥 Single Order API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
