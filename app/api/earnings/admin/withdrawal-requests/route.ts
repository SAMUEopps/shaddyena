/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import VendorEarning from "@/models/VendorEarnings";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "PENDING";
    const skip = (page - 1) * limit;

    // 3. Build query
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    // 4. Fetch withdrawal requests
    const [requests, total] = await Promise.all([
      WithdrawalRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WithdrawalRequest.countDocuments(query)
    ]);

    // 5. Calculate pending count
    const pendingCount = await WithdrawalRequest.countDocuments({ status: "PENDING" });

    return NextResponse.json({
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      pendingCount,
      success: true
    });
  } catch (error: any) {
    console.error("Admin withdrawal requests error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    const { requestId, action, notes, mpesaTransactionId } = await req.json();

    // 2. Find withdrawal request
    const withdrawalRequest = await WithdrawalRequest.findById(requestId);
    
    if (!withdrawalRequest) {
      return NextResponse.json({ message: "Withdrawal request not found" }, { status: 404 });
    }

    // 3. Process based on action
    switch (action) {
      case "APPROVE":
        withdrawalRequest.status = "APPROVED";
        withdrawalRequest.adminNotes = notes;
        break;

      case "REJECT":
        withdrawalRequest.status = "REJECTED";
        withdrawalRequest.adminNotes = notes;
        
        // Release earnings back to AVAILABLE status
        await VendorEarning.updateMany(
          { withdrawalRequestId: requestId },
          { $set: { status: "AVAILABLE", withdrawalRequestId: null } }
        );
        break;

      case "PROCESS":
        if (!mpesaTransactionId) {
          return NextResponse.json(
            { message: "MPESA transaction ID required" },
            { status: 400 }
          );
        }

        withdrawalRequest.status = "PROCESSED";
        withdrawalRequest.mpesaTransactionId = mpesaTransactionId;
        withdrawalRequest.processedBy = decoded.userId;
        withdrawalRequest.processedAt = new Date();
        
        // Mark earnings as WITHDRAWN
        await VendorEarning.updateMany(
          { withdrawalRequestId: requestId },
          { $set: { status: "WITHDRAWN" } }
        );
        break;

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await withdrawalRequest.save();

    return NextResponse.json({
      message: `Withdrawal request ${action.toLowerCase()}d successfully`,
      success: true
    });
  } catch (error: any) {
    console.error("Process withdrawal request error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import VendorEarning from "@/models/VendorEarnings";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// GET: Get withdrawal requests for admin
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // 3. Build query
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    // 4. Fetch withdrawal requests with vendor details
    const [requests, total] = await Promise.all([
      WithdrawalRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WithdrawalRequest.countDocuments(query)
    ]);

    // 5. Calculate stats
    const stats = await WithdrawalRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    const statsMap = stats.reduce((acc, item) => {
      acc[item._id] = { count: item.count, totalAmount: item.totalAmount };
      return acc;
    }, {} as any);

    return NextResponse.json({
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: statsMap,
      success: true
    });
  } catch (error: any) {
    console.error("Admin withdrawal requests error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Process withdrawal request (approve, reject, or mark as processed)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    const { requestId, action, notes, mpesaTransactionId } = await req.json();

    // 2. Find withdrawal request
    const withdrawalRequest = await WithdrawalRequest.findById(requestId);
    
    if (!withdrawalRequest) {
      return NextResponse.json({ message: "Withdrawal request not found" }, { status: 404 });
    }

    // 3. Validate action based on current status
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['APPROVED', 'REJECTED'],
      'APPROVED': ['PROCESSED', 'REJECTED'],
      'REJECTED': [],
      'PROCESSED': []
    };

    const allowedActions = validTransitions[withdrawalRequest.status];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { message: `Cannot ${action.toLowerCase()} a ${withdrawalRequest.status.toLowerCase()} request` },
        { status: 400 }
      );
    }

    // 4. Process based on action
    let updateData: any = {};

    switch (action) {
      case "APPROVE":
        updateData = {
          status: "APPROVED",
          adminNotes: notes,
          updatedAt: new Date()
        };
        break;

      case "REJECT":
        updateData = {
          status: "REJECTED",
          adminNotes: notes,
          updatedAt: new Date()
        };
        
        // Release earnings back to AVAILABLE status
        await VendorEarning.updateMany(
          { withdrawalRequestId: requestId },
          { $set: { status: "AVAILABLE", withdrawalRequestId: null } }
        );
        break;

      case "PROCESS":
        if (!mpesaTransactionId) {
          return NextResponse.json(
            { message: "MPESA transaction ID is required" },
            { status: 400 }
          );
        }

        updateData = {
          status: "PROCESSED",
          mpesaTransactionId: mpesaTransactionId,
          processedBy: decoded.userId,
          processedAt: new Date(),
          updatedAt: new Date()
        };
        
        // Mark earnings as WITHDRAWN
        await VendorEarning.updateMany(
          { withdrawalRequestId: requestId },
          { $set: { status: "WITHDRAWN" } }
        );
        break;

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // 5. Update withdrawal request
    await WithdrawalRequest.findByIdAndUpdate(requestId, updateData);

    // 6. Get updated request for response
    const updatedRequest = await WithdrawalRequest.findById(requestId).lean();

    return NextResponse.json({
      message: `Withdrawal request ${action.toLowerCase()}d successfully`,
      request: updatedRequest,
      success: true
    });
  } catch (error: any) {
    console.error("Process withdrawal request error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import VendorEarning from "@/models/VendorEarnings";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// GET: Get withdrawal requests for admin
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // 3. Build query
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    // 4. Fetch withdrawal requests with vendor details
    const [requests, total] = await Promise.all([
      WithdrawalRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WithdrawalRequest.countDocuments(query)
    ]);

    // 5. Calculate stats
    const stats = await WithdrawalRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    const statsMap = stats.reduce((acc: any, item) => {
      acc[item._id] = { count: item.count, totalAmount: item.totalAmount };
      return acc;
    }, {});

    return NextResponse.json({
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: statsMap,
      success: true
    });
  } catch (error: any) {
    console.error("Admin withdrawal requests GET error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Process withdrawal request (approve, reject, or mark as processed)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    // 2. Parse request body with validation
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { requestId, action, notes, mpesaTransactionId } = requestBody;

    // 3. Validate required fields
    if (!requestId) {
      return NextResponse.json(
        { message: "Request ID is required" },
        { status: 400 }
      );
    }

    if (!action || !['APPROVE', 'REJECT', 'PROCESS'].includes(action)) {
      return NextResponse.json(
        { message: "Valid action is required (APPROVE, REJECT, or PROCESS)" },
        { status: 400 }
      );
    }

    // 4. Find withdrawal request
    const withdrawalRequest = await WithdrawalRequest.findById(requestId);
    
    if (!withdrawalRequest) {
      return NextResponse.json({ 
        message: "Withdrawal request not found",
        requestId 
      }, { status: 404 });
    }

    console.log(`Processing withdrawal request ${requestId}, current status: ${withdrawalRequest.status}, action: ${action}`);

    // 5. Validate action based on current status
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['APPROVED', 'REJECTED'],
      'APPROVED': ['PROCESSED', 'REJECTED'],
      'REJECTED': [],
      'PROCESSED': []
    };

    const actionToStatus: Record<string, string> = {
  APPROVE: 'APPROVED',
  REJECT: 'REJECTED',
  PROCESS: 'PROCESSED'
};
    /*const allowedActions = validTransitions[withdrawalRequest.status];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { 
          message: `Cannot ${action.toLowerCase()} a ${withdrawalRequest.status.toLowerCase()} request`,
          currentStatus: withdrawalRequest.status,
          allowedActions 
        },
        { status: 400 }
      );
    }*/

 const nextStatus = actionToStatus[action];   
const allowedStatuses = validTransitions[withdrawalRequest.status];

if (!allowedStatuses.includes(nextStatus)) {
  return NextResponse.json(
    {
      message: `Cannot ${action.toLowerCase()} a ${withdrawalRequest.status.toLowerCase()} request`,
      currentStatus: withdrawalRequest.status,
      allowedStatuses
    },
    { status: 400 }
  );
}


    // 6. Process based on action
    let updateData: any = {};

    switch (action) {
      case "APPROVE":
        updateData = {
          status: "APPROVED",
          adminNotes: notes || undefined,
          updatedAt: new Date()
        };
        console.log(`Approving request ${requestId}`);
        break;

      case "REJECT":
        updateData = {
          status: "REJECTED",
          adminNotes: notes || undefined,
          updatedAt: new Date()
        };
        
        // Release earnings back to AVAILABLE status
        console.log(`Rejecting request ${requestId}, releasing ${withdrawalRequest.earnings.length} earnings`);
        await VendorEarning.updateMany(
          { withdrawalRequestId: requestId },
          { $set: { status: "AVAILABLE", withdrawalRequestId: null } }
        );
        break;

      case "PROCESS":
        if (!mpesaTransactionId) {
          return NextResponse.json(
            { message: "MPESA transaction ID is required for processing" },
            { status: 400 }
          );
        }

        updateData = {
          status: "PROCESSED",
          mpesaTransactionId: mpesaTransactionId,
          processedBy: decoded.userId,
          processedAt: new Date(),
          adminNotes: notes || undefined,
          updatedAt: new Date()
        };
        
        // Mark earnings as WITHDRAWN
        console.log(`Processing request ${requestId}, marking ${withdrawalRequest.earnings.length} earnings as WITHDRAWN`);
        await VendorEarning.updateMany(
          { withdrawalRequestId: requestId },
          { $set: { status: "WITHDRAWN" } }
        );
        break;

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // 7. Update withdrawal request with error handling
    try {
      const updatedRequest = await WithdrawalRequest.findByIdAndUpdate(
        requestId,
        updateData,
        { new: true, runValidators: false } // Set runValidators to false temporarily
      ).lean();

      if (!updatedRequest) {
        throw new Error("Failed to update withdrawal request");
      }

      console.log(`Successfully updated request ${requestId} to ${action}d`);

      return NextResponse.json({
        message: `Withdrawal request ${action.toLowerCase()}d successfully`,
        request: updatedRequest,
        success: true
      });
    } catch (updateError: any) {
      console.error("Error updating withdrawal request:", updateError);
      return NextResponse.json(
        { 
          message: "Failed to update withdrawal request",
          error: updateError.message 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Process withdrawal request error:", error);
    return NextResponse.json(
      { 
        message: "Server error", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}