/*import { NextRequest, NextResponse } from "next/server";
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
*/

   import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// Define the Suborder interface
interface ISuborder {
  _id?: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId | { _id: string; firstName?: string; lastName?: string; businessName?: string };
  items: any[];
  amount: number;
  status: string;
  [key: string]: any;
}

// Define the Order interface with suborders
interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  buyerId: mongoose.Types.ObjectId | { _id: string; firstName?: string; lastName?: string; email?: string; phone?: string };
  suborders: ISuborder[];
  totalAmount: number;
  status: string;
  createdAt: string | Date;
  [key: string]: any;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

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
      query.$or = [
        { buyerId: decoded.userId },
        { "suborders.vendorId": decoded.userId }
      ];
    }

    // Type the query result with IOrder interface
    const order = await Order.findOne(query)
      .populate("buyerId", "firstName lastName email phone")
      .lean<IOrder>(); // <-- Add the type argument here

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Now TypeScript knows order.suborders exists
    const isBuyer = order.buyerId?.toString() === decoded.userId;
    
    // Safe access to suborders with proper typing
const isVendor = order.suborders?.some((sub: any) => {
  const vendorId = sub.vendorId?._id?.toString() || sub.vendorId?.toString();
  return vendorId === decoded.userId;
});

    return NextResponse.json({ 
      order,
      viewContext: {
        isBuyer,
        isVendor,
        currentRole: decoded.role
      }
    });

  } catch (error: any) {
    console.error("🔥 Single Order API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}