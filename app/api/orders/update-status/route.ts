/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import VendorEarning from "@/models/VendorEarnings";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

interface RequestBody {
  orderId: string;
  status: string;
  suborderId?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const token = req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    const { orderId, status, suborderId, notes } = await req.json() as RequestBody;

    // 2. Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 3. Validate status transitions based on user role
    const allowedStatuses = {
      vendor: ['SHIPPED'],
      admin: ['DELIVERED', 'CANCELLED', 'COMPLETED'],
      customer: ['CANCELLED'] // Only if order is still pending
    };

    // 4. Update logic based on whether updating main order or suborder
    let updated = false;
    let oldStatus = '';
    let vendorId = '';

    if (suborderId) {
      // Update specific suborder
      const suborder = order.suborders.id(suborderId);
      if (!suborder) {
        return NextResponse.json({ message: "Suborder not found" }, { status: 404 });
      }

      // Vendor can only update their own suborder
      if (decoded.role === 'vendor' && suborder.vendorId !== decoded.userId) {
        return NextResponse.json(
          { message: "You can only update your own suborders" },
          { status: 403 }
        );
      }

      // Check if vendor is allowed to set this status
      if (decoded.role === 'vendor' && !allowedStatuses.vendor.includes(status)) {
        return NextResponse.json(
          { message: `Vendors can only set status to: ${allowedStatuses.vendor.join(', ')}` },
          { status: 403 }
        );
      }

      // Check if admin is allowed to set this status (for suborders)
      if (decoded.role === 'admin' && !['DELIVERED', 'CANCELLED'].includes(status)) {
        return NextResponse.json(
          { message: "For suborders, admins can only set DELIVERED or CANCELLED" },
          { status: 403 }
        );
      }

      oldStatus = suborder.status;
      vendorId = suborder.vendorId;
      suborder.status = status;
      updated = true;

      // 🔴 CRITICAL: Create vendor earnings when suborder is marked as DELIVERED
      if (status === 'DELIVERED' && oldStatus !== 'DELIVERED') {
        await createVendorEarnings(order, suborder);
      }

      console.log(`Suborder ${suborderId} status changed from ${oldStatus} to ${status}`);
    } else {
      // Update main order
      // Check if user is allowed to update main order
      if (decoded.role !== 'admin' && decoded.role !== 'customer') {
        return NextResponse.json(
          { message: "Only admin or customer can update main order status" },
          { status: 403 }
        );
      }

      // Customers can only cancel pending orders
      if (decoded.role === 'customer' && status !== 'CANCELLED') {
        return NextResponse.json(
          { message: "Customers can only cancel orders" },
          { status: 403 }
        );
      }

      // Customers can only cancel if order is still pending/processing
      if (decoded.role === 'customer' && !['PENDING', 'PROCESSING'].includes(order.status)) {
        return NextResponse.json(
          { message: "Cannot cancel order after it has been shipped" },
          { status: 400 }
        );
      }

      // Check if admin is allowed to set this status
      if (decoded.role === 'admin' && !allowedStatuses.admin.includes(status)) {
        return NextResponse.json(
          { message: `Admins can only set status to: ${allowedStatuses.admin.join(', ')}` },
          { status: 403 }
        );
      }

      oldStatus = order.status;
      order.status = status;
      updated = true;

      // If admin marks main order as COMPLETED, mark all suborders as DELIVERED
      if (decoded.role === 'admin' && status === 'COMPLETED') {
        for (const suborder of order.suborders) {
          if (suborder.status !== 'DELIVERED' && suborder.status !== 'CANCELLED') {
            suborder.status = 'DELIVERED';
            // Create vendor earnings for each delivered suborder
            await createVendorEarnings(order, suborder);
          }
        }
        console.log(`All suborders marked as DELIVERED for order ${orderId}`);
      }

      console.log(`Main order ${orderId} status changed from ${oldStatus} to ${status}`);
    }

    if (!updated) {
      return NextResponse.json({ message: "No changes made" }, { status: 400 });
    }

    // Save the updated order
    await order.save();

    return NextResponse.json({
      message: "Status updated successfully",
      order: {
        _id: order._id,
        orderId: order.orderId,
        status: order.status,
        suborders: order.suborders.map((so: { _id: any; vendorId: any; status: any; }) => ({
          _id: so._id,
          vendorId: so.vendorId,
          status: so.status
        }))
      },
      success: true
    });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// Function to create vendor earnings when suborder is delivered
async function createVendorEarnings(order: any, suborder: any) {
  try {
    // Check if earning already exists
    const existingEarning = await VendorEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      vendorId: suborder.vendorId
    });

    if (existingEarning) {
      console.log(`Vendor earning already exists for suborder ${suborder._id}`);
      return existingEarning;
    }

    // Create new vendor earning
    const vendorEarning = new VendorEarning({
      vendorId: suborder.vendorId,
      orderId: order._id,
      suborderId: suborder._id,
      amount: suborder.amount,
      commission: suborder.commission,
      netAmount: suborder.netAmount,
      status: 'PENDING' // Will become AVAILABLE after 24-48 hours
    });

    await vendorEarning.save();
    console.log(`Created vendor earning for vendor ${suborder.vendorId}, amount: ${suborder.netAmount}`);
    
    return vendorEarning;
  } catch (error) {
    console.error("Error creating vendor earnings:", error);
    throw error;
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import VendorEarning from "@/models/VendorEarnings";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

interface RequestBody {
  orderId: string;
  status: string;
  suborderId?: string;
  notes?: string;
}

/* ----------------------------- LOGGER HELPERS ----------------------------- */
const logSuccess = (msg: string, meta?: any) =>
  console.log(`✅ SUCCESS: ${msg}`, meta || "");

const logFailure = (msg: string, meta?: any) =>
  console.warn(`❌ FAILURE: ${msg}`, meta || "");

const logSecurity = (msg: string, meta?: any) =>
  console.error(`🚨 SECURITY: ${msg}`, meta || "");

const logAudit = (msg: string, meta?: any) =>
  console.info(`📘 AUDIT: ${msg}`, meta || "");

/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* ----------------------------- AUTHENTICATION ---------------------------- */
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      logSecurity("Missing auth token");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedUser;

    const { orderId, status, suborderId, notes } =
      (await req.json()) as RequestBody;

    logAudit("Status update request received", {
      userId: decoded.userId,
      role: decoded.role,
      orderId,
      suborderId,
      status,
    });

    /* -------------------------------- FIND ORDER ----------------------------- */
    const order = await Order.findById(orderId);
    if (!order) {
      logFailure("Order not found", { orderId });
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    /* --------------------------- ALLOWED STATUSES ---------------------------- */
    const allowedStatuses = {
      vendor: ["SHIPPED"],
      admin: ["DELIVERED", "CANCELLED", "COMPLETED"],
      customer: ["CANCELLED"],
    };

    let updated = false;
    let oldStatus = "";

    /* ============================ SUBORDER UPDATE ============================ */
    if (suborderId) {
      const suborder = order.suborders.id(suborderId);

      if (!suborder) {
        logFailure("Suborder not found", { suborderId });
        return NextResponse.json(
          { message: "Suborder not found" },
          { status: 404 }
        );
      }

      if (
        decoded.role === "vendor" &&
        suborder.vendorId !== decoded.userId
      ) {
        logSecurity("Vendor tried updating foreign suborder", {
          vendorId: decoded.userId,
          suborderVendorId: suborder.vendorId,
        });
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }

      if (
        decoded.role === "vendor" &&
        !allowedStatuses.vendor.includes(status)
      ) {
        logFailure("Invalid vendor status transition", {
          status,
        });
        return NextResponse.json(
          { message: "Invalid status for vendor" },
          { status: 403 }
        );
      }

      if (
        decoded.role === "admin" &&
        !["DELIVERED", "CANCELLED"].includes(status)
      ) {
        logFailure("Invalid admin suborder status", { status });
        return NextResponse.json(
          { message: "Invalid status for admin on suborder" },
          { status: 403 }
        );
      }

      oldStatus = suborder.status;
      suborder.status = status;
      updated = true;

      logAudit("Suborder status updated", {
        suborderId,
        from: oldStatus,
        to: status,
      });

      if (status === "DELIVERED" && oldStatus !== "DELIVERED") {
        await createVendorEarnings(order, suborder);
      }
    }

    /* ============================== MAIN ORDER ============================== */
    else {
      if (!["admin", "customer"].includes(decoded.role)) {
        logSecurity("Unauthorized main order update attempt", {
          role: decoded.role,
        });
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }

      if (
        decoded.role === "customer" &&
        (status !== "CANCELLED" ||
          !["PENDING", "PROCESSING"].includes(order.status))
      ) {
        logFailure("Invalid customer cancellation", {
          currentStatus: order.status,
        });
        return NextResponse.json(
          { message: "Cannot cancel order" },
          { status: 400 }
        );
      }

      if (
        decoded.role === "admin" &&
        !allowedStatuses.admin.includes(status)
      ) {
        logFailure("Invalid admin order status", { status });
        return NextResponse.json(
          { message: "Invalid status for admin" },
          { status: 403 }
        );
      }

      oldStatus = order.status;
      order.status = status;
      updated = true;

      logAudit("Main order status updated", {
        orderId,
        from: oldStatus,
        to: status,
      });

      if (decoded.role === "admin" && status === "COMPLETED") {
        for (const suborder of order.suborders) {
          if (
            !["DELIVERED", "CANCELLED"].includes(suborder.status)
          ) {
            suborder.status = "DELIVERED";
            await createVendorEarnings(order, suborder);
          }
        }
        logSuccess("All suborders auto-delivered", { orderId });
      }
    }

    if (!updated) {
      logFailure("No updates applied", { orderId });
      return NextResponse.json(
        { message: "No changes made" },
        { status: 400 }
      );
    }

    await order.save();
    logSuccess("Order status update persisted", { orderId });

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      orderId: order._id,
    });
  } catch (error: any) {
    logFailure("Unhandled order status update error", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

/* ----------------------- CREATE VENDOR EARNINGS ----------------------- */
/*async function createVendorEarnings(order: any, suborder: any) {
  try {
    const exists = await VendorEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      vendorId: suborder.vendorId,
    });

    if (exists) {
      logAudit("Vendor earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const earning = new VendorEarning({
      vendorId: suborder.vendorId,
      orderId: order._id,
      suborderId: suborder._id,
      amount: suborder.amount,
      commission: suborder.commission,
      netAmount: suborder.netAmount,
      status: "PENDING",
    });

    await earning.save();

    logSuccess("Vendor earning created", {
      vendorId: suborder.vendorId,
      netAmount: suborder.netAmount,
    });

    return earning;
  } catch (error) {
    logFailure("Vendor earning creation failed", error);
    throw error;
  }
}*/
async function createVendorEarnings(order: any, suborder: any) {
  const exists = await VendorEarning.findOne({
    orderId: order._id,
    suborderId: suborder._id,
    vendorId: suborder.vendorId,
  });

  if (exists) {
    console.log("📘 AUDIT: Vendor earning already exists", {
      suborderId: suborder._id,
    });
    return exists;
  }

  const vendorItems = order.items.filter(
    (item: any) => item.vendorId === suborder.vendorId
  );

  const earning = new VendorEarning({
    // ✅ REQUIRED FIELDS (THIS WAS MISSING)
    orderId: order._id,
    vendorId: suborder.vendorId,

    // 🔗 Optional but useful
    suborderId: suborder._id,

    amount: suborder.amount,
    commission: suborder.commission,
    netAmount: suborder.netAmount,

    itemsCount: vendorItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ),

    status: "PENDING",
  });

  await earning.save();

  console.log("✅ SUCCESS: Vendor earning created", {
    vendorId: suborder.vendorId,
    netAmount: suborder.netAmount,
  });

  return earning;
}
