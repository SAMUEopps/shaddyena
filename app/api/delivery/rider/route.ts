/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized - Not a rider" }, { status: 403 });
    }

    /*const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // Build query for rider's deliveries
    const query: Record<string, any> = {
      "suborders.riderId": decoded.userId
    };

    if (status !== "all") {
      query["suborders.status"] = status.toUpperCase();
    }

    const orders = await Order.aggregate([
      { $match: { "suborders.riderId": decoded.userId } },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": decoded.userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          orderId: 1,
          createdAt: 1,
          shipping: 1,
          buyerId: 1,
          "suborders._id": 1,
          "suborders.vendorId": 1,
          "suborders.shopId": 1,
          "suborders.status": 1,
          "suborders.deliveryFee": 1,
          "suborders.deliveryDetails": 1,
          "suborders.items": 1,
          "suborders.amount": 1
        }
      }
    ]);

    const totalCount = await Order.aggregate([
      { $match: { "suborders.riderId": decoded.userId } },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": decoded.userId } },
      { $count: "total" }
    ]);

    const total = totalCount[0]?.total || 0;

    return NextResponse.json({
      deliveries: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Rider deliveries API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }*

        const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // Build the base match query
    const matchQuery: any = {
      "suborders.riderId": new mongoose.Types.ObjectId(decoded.userId)
    };

    // If filtering by status, add it to the match AFTER unwinding
    let statusFilter = {};
    if (status !== "all") {
      statusFilter = { "suborders.status": status.toUpperCase() };
    }

    // Aggregation pipeline
    const pipeline: any[] = [
      { $match: matchQuery },
      { $unwind: "$suborders" },
      { $match: { 
        "suborders.riderId": new mongoose.Types.ObjectId(decoded.userId),
        ...statusFilter 
      }},
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          shipping: { $first: "$shipping" },
          buyerId: { $first: "$buyerId" },
          suborders: { $push: "$suborders" }
        }
      }
    ];

    const orders = await Order.aggregate(pipeline);

    // Get total count
    const countPipeline: any[] = [
      { $match: matchQuery },
      { $unwind: "$suborders" },
      { $match: { 
        "suborders.riderId": new mongoose.Types.ObjectId(decoded.userId),
        ...statusFilter 
      }},
      { $count: "total" }
    ];

    const totalCount = await Order.aggregate(countPipeline);
    const total = totalCount[0]?.total || 0;

    // Log for debugging (remove in production)
    console.log("🔍 Debug Info:", {
      riderId: decoded.userId,
      totalOrders: total,
      returnedOrders: orders.length,
      statusFilter: status
    });

    return NextResponse.json({
      deliveries: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Rider deliveries API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized - Not a rider" }, { status: 403 });
    }

    const { orderId, suborderId, action, notes, otp } = await req.json();

    if (!orderId || !suborderId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const suborder = order.suborders.id(suborderId);
    if (!suborder) {
      return NextResponse.json({ message: "Suborder not found" }, { status: 404 });
    }

    // Verify rider owns this delivery
    if (suborder.riderId?.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized - Not assigned to this delivery" }, { status: 403 });
    }

    let statusMessage = "";
    
    switch (action) {
      case "pickup":
        if (suborder.status !== 'ASSIGNED') {
          return NextResponse.json({ message: "Cannot pickup - order not assigned" }, { status: 400 });
        }
        suborder.status = 'PICKED_UP';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.actualTime = new Date();
        statusMessage = "Package picked up successfully";
        break;

      case "in_transit":
        if (suborder.status !== 'PICKED_UP') {
          return NextResponse.json({ message: "Cannot mark as in transit - not picked up" }, { status: 400 });
        }
        suborder.status = 'IN_TRANSIT';
        statusMessage = "Package marked as in transit";
        break;

      case "deliver":
        if (suborder.status !== 'IN_TRANSIT') {
          return NextResponse.json({ message: "Cannot deliver - not in transit" }, { status: 400 });
        }
        
        // Check OTP if required
        if (suborder.deliveryDetails?.confirmationCode) {
          if (!otp || otp !== suborder.deliveryDetails.confirmationCode) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
          }
        }
        
        suborder.status = 'DELIVERED';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.actualTime = new Date();
        statusMessage = "Delivery completed successfully";
        break;

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    if (notes) {
      suborder.deliveryDetails = suborder.deliveryDetails || {};
      suborder.deliveryDetails.notes = notes;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: statusMessage,
      status: suborder.status
    });
  } catch (error: any) {
    console.error("🔥 Rider action error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose"; // Import Types
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized - Not a rider" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // DEBUG LOGS - Add this to see what's happening
    console.log("🎯 DEBUG: Rider ID from token:", decoded.userId);
    console.log("🎯 DEBUG: Is valid ObjectId?", mongoose.Types.ObjectId.isValid(decoded.userId));

    // Convert string ID to ObjectId
    let riderObjectId;
    try {
      riderObjectId = new mongoose.Types.ObjectId(decoded.userId);
    } catch (error) {
      console.error("🔥 Invalid ObjectId format:", decoded.userId);
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }

    // Build the base match query
    /*const matchQuery: any = {
      "suborders.riderId": riderObjectId
    };*/

    const matchQuery: any = {
      "suborders.riderId": riderObjectId,
      "suborders.status": { 
        $in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED'] 
      }
    };

    // Aggregation pipeline - SIMPLIFIED VERSION
    const pipeline: any[] = [
      // First match: find orders where ANY suborder has this riderId
      { $match: matchQuery },
      // Unwind to work with individual suborders
      { $unwind: "$suborders" },
      // Match only the suborders that belong to this rider
      { $match: { "suborders.riderId": riderObjectId } },
    ];

    // Add status filter if needed
   /* if (status !== "all") {
      pipeline.push({ 
        $match: { "suborders.status": status.toUpperCase() } 
      });
    }*/

      if (status !== "all") {
        const validStatuses = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED'];
        if (validStatuses.includes(status.toUpperCase())) {
          pipeline.push({ 
            $match: { "suborders.status": status.toUpperCase() } 
          });
        }
      }

    // Continue with the rest of the pipeline
    pipeline.push(
      { $sort: { "createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          shipping: { $first: "$shipping" },
          buyerId: { $first: "$buyerId" },
          suborders: { $push: "$suborders" }
        }
      },
      // Sort the grouped results again
      { $sort: { "createdAt": -1 } }
    );

    // Execute query with debugging
    console.log("🎯 DEBUG: Executing pipeline with riderObjectId:", riderObjectId);
    
    const orders = await Order.aggregate(pipeline);
    
    console.log("🎯 DEBUG: Orders found:", orders.length);
    if (orders.length > 0) {
      console.log("🎯 DEBUG: Sample order structure:", JSON.stringify(orders[0], null, 2));
    }

    // Get total count - SIMPLER APPROACH
    const countPipeline: any[] = [
      { $match: matchQuery },
      { $unwind: "$suborders" },
      { $match: { "suborders.riderId": riderObjectId } }
    ];
    
    if (status !== "all") {
      countPipeline.push({ 
        $match: { "suborders.status": status.toUpperCase() } 
      });
    }
    
    countPipeline.push({ $count: "total" });

    const totalCount = await Order.aggregate(countPipeline);
    const total = totalCount[0]?.total || 0;

    console.log("🎯 DEBUG: Total count:", total);

    return NextResponse.json({
      deliveries: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error("🔥 Rider deliveries API error:", error);
    console.error("🔥 Error stack:", error.stack);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "delivery") {
      return NextResponse.json({ message: "Unauthorized - Not a rider" }, { status: 403 });
    }

    const { orderId, suborderId, action, notes, otp } = await req.json();

    if (!orderId || !suborderId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Convert riderId to ObjectId for comparison
    const riderObjectId = new mongoose.Types.ObjectId(decoded.userId);
    
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const suborder = order.suborders.id(suborderId);
    if (!suborder) {
      return NextResponse.json({ message: "Suborder not found" }, { status: 404 });
    }

    // IMPORTANT: Convert suborder.riderId to string for comparison
    const suborderRiderId = suborder.riderId?.toString();
    
    // Verify rider owns this delivery
    if (!suborderRiderId || suborderRiderId !== decoded.userId) {
      console.log("🔥 Authorization failed:", {
        suborderRiderId,
        decodedUserId: decoded.userId,
        match: suborderRiderId === decoded.userId
      });
      return NextResponse.json({ 
        message: "Unauthorized - Not assigned to this delivery" 
      }, { status: 403 });
    }

    // Rest of your POST logic remains the same...
    let statusMessage = "";
    
    switch (action) {
      case "pickup":
        if (suborder.status !== 'ASSIGNED') {
          return NextResponse.json({ message: "Cannot pickup - order not assigned" }, { status: 400 });
        }
        suborder.status = 'PICKED_UP';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.actualTime = new Date();
        statusMessage = "Package picked up successfully";
        break;

      case "in_transit":
        if (suborder.status !== 'PICKED_UP') {
          return NextResponse.json({ message: "Cannot mark as in transit - not picked up" }, { status: 400 });
        }
        suborder.status = 'IN_TRANSIT';
        statusMessage = "Package marked as in transit";
        break;

      case "deliver":
        if (suborder.status !== 'IN_TRANSIT') {
          return NextResponse.json({ message: "Cannot deliver - not in transit" }, { status: 400 });
        }
        
        /*if (suborder.deliveryDetails?.confirmationCode) {
          if (!otp || otp !== suborder.deliveryDetails.confirmationCode) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
          }
        }*/
        
        suborder.status = 'DELIVERED';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.actualTime = new Date();
        statusMessage = "Delivery completed. Waiting for customer confirmation";
        break;

        // In the POST method, update the "pickup" case:
        case "pickup":
          if (suborder.status !== 'ASSIGNED') {
            return NextResponse.json({ message: "Cannot pickup - order not assigned" }, { status: 400 });
          }
          
          // Get deliveryPrice from request body
          const { deliveryPrice, notes: pickupNotes } = await req.json();
          
          if (!deliveryPrice || deliveryPrice <= 0) {
            return NextResponse.json({ message: "Please provide a valid delivery price" }, { status: 400 });
          }
          
          suborder.status = 'PICKED_UP';
          suborder.deliveryFee = deliveryPrice; // Set the delivery fee
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.actualTime = new Date();
          
          if (pickupNotes) {
            suborder.deliveryDetails.notes = pickupNotes;
          }
          
          statusMessage = "Package picked up successfully";
          break;

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    if (notes) {
      suborder.deliveryDetails = suborder.deliveryDetails || {};
      suborder.deliveryDetails.notes = notes;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: statusMessage,
      status: suborder.status
    });
  } catch (error: any) {
    console.error("🔥 Rider action error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}