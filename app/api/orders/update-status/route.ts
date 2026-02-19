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

//////////////////////////////////////////////////////

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

/* ----------------------------- LOGGER HELPERS ----------------------------- *
const logSuccess = (msg: string, meta?: any) =>
  console.log(`✅ SUCCESS: ${msg}`, meta || "");

const logFailure = (msg: string, meta?: any) =>
  console.warn(`❌ FAILURE: ${msg}`, meta || "");

const logSecurity = (msg: string, meta?: any) =>
  console.error(`🚨 SECURITY: ${msg}`, meta || "");

const logAudit = (msg: string, meta?: any) =>
  console.info(`📘 AUDIT: ${msg}`, meta || "");

/* -------------------------------------------------------------------------- *

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* ----------------------------- AUTHENTICATION ---------------------------- *
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

    /* -------------------------------- FIND ORDER ----------------------------- *
    const order = await Order.findById(orderId);
    if (!order) {
      logFailure("Order not found", { orderId });
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    /* --------------------------- ALLOWED STATUSES ---------------------------- *
    const allowedStatuses = {
      vendor: ["SHIPPED"],
      admin: ["DELIVERED", "CANCELLED", "COMPLETED"],
      customer: ["CANCELLED"],
    };

    let updated = false;
    let oldStatus = "";

    /* ============================ SUBORDER UPDATE ============================ *
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

    /* ============================== MAIN ORDER ============================== *
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
}*
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
}*/






/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import { VendorEarning, RiderEarning } from "@/models/VendorEarnings";

// ... (keep existing imports and interfaces)
interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

interface RequestBody {
  orderId: string;
  status: string;
  suborderId?: string;
  notes?: string;
  deliveryFee: number;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* ----------------------------- AUTHENTICATION ---------------------------- *
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedUser;

    const { orderId, status, suborderId, notes, deliveryFee } =
      (await req.json()) as RequestBody;

    console.log("📝 Status update request:", {
      userId: decoded.userId,
      role: decoded.role,
      orderId,
      suborderId,
      status,
    });

    /* -------------------------------- FIND ORDER ----------------------------- *
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let updated = false;
    let oldStatus = "";

    /* ============================ SUBORDER UPDATE ============================ *
    if (suborderId) {
      const suborder = order.suborders.id(suborderId);

      if (!suborder) {
        return NextResponse.json(
          { message: "Suborder not found" },
          { status: 404 }
        );
      }

      // VENDOR ACTIONS
      if (decoded.role === "vendor") {
        if (suborder.vendorId !== decoded.userId) {
          return NextResponse.json(
            { message: "Forbidden - Not your suborder" },
            { status: 403 }
          );
        }

        // Vendor can mark as READY_FOR_PICKUP (instead of SHIPPED)
        if (status === 'READY_FOR_PICKUP' && suborder.status === 'PROCESSING') {
          oldStatus = suborder.status;
          suborder.status = 'READY_FOR_PICKUP';
          updated = true;
          console.log(`✅ Vendor marked suborder as READY_FOR_PICKUP`);
        }  // Vendor can also confirm from their side
          else if (status === 'CONFIRMED' && suborder.status === 'DELIVERED') {
            oldStatus = suborder.status;
            suborder.status = 'CONFIRMED';
            suborder.deliveryDetails = suborder.deliveryDetails || {};
            suborder.deliveryDetails.confirmedAt = new Date();
            updated = true;
          }
         else {
          return NextResponse.json(
            { message: "Invalid vendor action" },
            { status: 403 }
          );
        }
      }

      // ADMIN ACTIONS
      else if (decoded.role === "admin") {
        if (status === 'SHIPPED' && suborder.status === 'READY_FOR_PICKUP') {
          // Admin assigns rider (this is now SHIPPED status)
          oldStatus = suborder.status;
          suborder.status = 'SHIPPED'; // This now means "assigned to rider"
          if (deliveryFee) suborder.deliveryFee = deliveryFee;
          updated = true;
          console.log(`✅ Admin assigned rider to suborder`);
        } 
        else if (status === 'DELIVERED' && suborder.status === 'SHIPPED') {
          // Admin confirms delivery (rider has delivered)
          oldStatus = suborder.status;
          suborder.status = 'DELIVERED';
          updated = true;
          
          // Create vendor earnings
          await createVendorEarnings(order, suborder);
          
          // Create rider earnings
          if (suborder.riderId && suborder.deliveryFee > 0) {
            await createRiderEarnings(order, suborder);
          }
          
          console.log(`✅ Admin confirmed delivery and created earnings`);
        }
        else if (status === 'CANCELLED') {
          oldStatus = suborder.status;
          suborder.status = 'CANCELLED';
          updated = true;
          console.log(`✅ Admin cancelled suborder`);
        } else {
          return NextResponse.json(
            { message: "Invalid admin action for suborder" },
            { status: 400 }
          );
        }
      }

      else if (decoded.role === "customer") {
  // Customer can confirm delivery
  if (status === 'CONFIRMED' && suborder.status === 'DELIVERED') {
    oldStatus = suborder.status;
    suborder.status = 'CONFIRMED';
    suborder.deliveryDetails = suborder.deliveryDetails || {};
    suborder.deliveryDetails.confirmedAt = new Date();
    
    // Generate confirmation code
    const code = generateConfirmationCode();
    suborder.deliveryDetails.confirmationCode = code;
    
    updated = true;
    console.log(`✅ Customer confirmed delivery with code: ${code}`);
  } else {
    return NextResponse.json(
      { message: "Invalid customer action" },
      { status: 403 }
    );
  }
}

      // RIDER ACTIONS (handled in separate API, but kept for completeness)
      else if (decoded.role === "delivery") {
        return NextResponse.json(
          { message: "Use /api/delivery/rider for rider actions" },
          { status: 400 }
        );
      }

      console.log(`📊 Suborder status updated: ${oldStatus} → ${suborder.status}`);
    }

    /* ============================== MAIN ORDER ============================== *
    else {
      if (!["admin", "customer"].includes(decoded.role)) {
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }

      if (decoded.role === "admin") {
        // Admin can update main order status
        oldStatus = order.status;
        order.status = status;
        updated = true;
        
        // If marking as COMPLETED, check all suborders are delivered
        if (status === 'COMPLETED') {
          const allDelivered = order.suborders.every(
            (so: any) => so.status === 'DELIVERED' || so.status === 'CANCELLED'
          );
          
          if (!allDelivered) {
            return NextResponse.json(
              { message: "Cannot complete order - not all suborders delivered" },
              { status: 400 }
            );
          }
        }
        
        console.log(`📊 Main order status updated: ${oldStatus} → ${order.status}`);
      }
    }

    if (!updated) {
      return NextResponse.json(
        { message: "No changes made" },
        { status: 400 }
      );
    }

    await order.save();
    console.log(`✅ Order saved successfully`);

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      orderId: order._id,
    });
  } catch (error: any) {
    console.error("🔥 Order status update error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// Add this helper function:
function generateConfirmationCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

/* ----------------------- CREATE VENDOR EARNINGS ----------------------- *
async function createVendorEarnings(order: any, suborder: any) {
  try {
    const exists = await VendorEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      vendorId: suborder.vendorId,
    });

    if (exists) {
      console.log("📘 Vendor earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const vendorItems = order.items.filter(
      (item: any) => item.vendorId === suborder.vendorId
    );

    const earning = new VendorEarning({
      orderId: order._id,
      vendorId: suborder.vendorId,
      suborderId: suborder._id,
      amount: suborder.amount,
      commission: suborder.commission,
      netAmount: suborder.netAmount,
      itemsCount: vendorItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ),
      status: "PENDING",
      orderDetails: {
        orderId: order.orderId,
        buyerName: typeof order.buyerId === 'object' 
          ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
          : 'Customer',
        buyerEmail: typeof order.buyerId === 'object' ? order.buyerId.email : '',
        itemsCount: vendorItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
        createdAt: order.createdAt
      },
      vendorDetails: {
        vendorId: suborder.vendorId,
        businessName: '' // You might want to populate this from vendor profile
      }
    });

    await earning.save();
    console.log("✅ Vendor earning created", {
      vendorId: suborder.vendorId,
      netAmount: suborder.netAmount,
    });

    return earning;
  } catch (error) {
    console.error("❌ Vendor earning creation failed", error);
    throw error;
  }
}

/* ----------------------- CREATE RIDER EARNINGS ----------------------- *
async function createRiderEarnings(order: any, suborder: any) {
  try {
    const exists = await RiderEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      riderId: suborder.riderId,
    });

    if (exists) {
      console.log("📘 Rider earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const earning = new RiderEarning({
      riderId: suborder.riderId,
      orderId: order._id,
      suborderId: suborder._id,
      deliveryFee: suborder.deliveryFee,
      status: "PENDING",
      orderDetails: {
        orderId: order.orderId,
        vendorId: suborder.vendorId,
        vendorName: '', // Populate from vendor profile
        pickupAddress: suborder.deliveryDetails?.pickupAddress || '',
        dropoffAddress: suborder.deliveryDetails?.dropoffAddress || order.shipping.address,
        createdAt: order.createdAt
      },
      riderDetails: {
        riderId: suborder.riderId,
        firstName: '', // Populate from user profile
        lastName: ''
      }
    });

    await earning.save();
    console.log("✅ Rider earning created", {
      riderId: suborder.riderId,
      deliveryFee: suborder.deliveryFee,
    });

    return earning;
  } catch (error) {
    console.error("❌ Rider earning creation failed", error);
    throw error;
  }
}
*/



/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import { VendorEarning, RiderEarning } from "@/models/VendorEarnings";
import { Types } from "mongoose";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

interface RequestBody {
  orderId: string;
  status: string;
  suborderId?: string;
  notes?: string;
  deliveryFee?: number;
  riderId?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* ----------------------------- AUTHENTICATION ---------------------------- *
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedUser;

    const { orderId, status, suborderId, notes, deliveryFee, riderId } =
      (await req.json()) as RequestBody;

    console.log("📝 Status update request:", {
      userId: decoded.userId,
      role: decoded.role,
      orderId,
      suborderId,
      status,
      riderId,
    });

    /* -------------------------------- FIND ORDER ----------------------------- *
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let updated = false;
    let oldStatus = "";

    /* ============================ SUBORDER UPDATE ============================ *
    if (suborderId) {
      const suborder = order.suborders.id(suborderId);

      if (!suborder) {
        return NextResponse.json(
          { message: "Suborder not found" },
          { status: 404 }
        );
      }

      // VENDOR ACTIONS
      if (decoded.role === "vendor") {
        if (suborder.vendorId !== decoded.userId) {
          return NextResponse.json(
            { message: "Forbidden - Not your suborder" },
            { status: 403 }
          );
        }

        // Vendor can mark as READY_FOR_PICKUP (from PROCESSING)
        if (status === 'READY_FOR_PICKUP' && suborder.status === 'PROCESSING') {
          oldStatus = suborder.status;
          suborder.status = 'READY_FOR_PICKUP';
          updated = true;
          console.log(`✅ Vendor marked suborder as READY_FOR_PICKUP`);
        } 
        // Vendor can assign a rider (from READY_FOR_PICKUP)
        // Using ASSIGNED or IN_TRANSIT (both exist in suborder enum)
        else if (status === 'ASSIGNED' && suborder.status === 'READY_FOR_PICKUP' && riderId) {
          oldStatus = suborder.status;
          suborder.status = 'ASSIGNED'; // Changed from SHIPPED to ASSIGNED
          suborder.riderId = new Types.ObjectId(riderId); // Convert to ObjectId
          if (deliveryFee) suborder.deliveryFee = deliveryFee;
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.assignedAt = new Date();
          updated = true;
          console.log(`✅ Vendor assigned rider ${riderId} to suborder`);
        }
        // Vendor can also confirm from their side
        else if (status === 'CONFIRMED' && suborder.status === 'DELIVERED') {
          oldStatus = suborder.status;
          suborder.status = 'CONFIRMED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.confirmedAt = new Date();
          updated = true;
        }
        else {
          return NextResponse.json(
            { message: "Invalid vendor action" },
            { status: 403 }
          );
        }
      }

      // ADMIN ACTIONS
      else if (decoded.role === "admin") {
        // Admin can mark as READY_FOR_PICKUP
        if (status === 'READY_FOR_PICKUP' && suborder.status === 'PROCESSING') {
          oldStatus = suborder.status;
          suborder.status = 'READY_FOR_PICKUP';
          updated = true;
          console.log(`✅ Admin marked suborder as READY_FOR_PICKUP`);
        }
        // Admin can assign rider (from READY_FOR_PICKUP)
        else if (status === 'ASSIGNED' && suborder.status === 'READY_FOR_PICKUP' && riderId) {
          oldStatus = suborder.status;
          suborder.status = 'ASSIGNED'; // Changed from SHIPPED to ASSIGNED
          suborder.riderId = new Types.ObjectId(riderId); // Convert to ObjectId
          if (deliveryFee) suborder.deliveryFee = deliveryFee;
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.assignedAt = new Date();
          updated = true;
          console.log(`✅ Admin assigned rider ${riderId} to suborder`);
        } 
        // Admin can mark as IN_TRANSIT (rider picked up)
        else if (status === 'IN_TRANSIT' && suborder.status === 'ASSIGNED') {
          oldStatus = suborder.status;
          suborder.status = 'IN_TRANSIT';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.pickedUpAt = new Date();
          updated = true;
          console.log(`✅ Admin marked suborder as IN_TRANSIT`);
        }
        // Admin confirms delivery
        else if (status === 'DELIVERED' && (suborder.status === 'IN_TRANSIT' || suborder.status === 'ASSIGNED')) {
          oldStatus = suborder.status;
          suborder.status = 'DELIVERED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.actualTime = new Date();
          updated = true;
          
          // Create vendor earnings
          await createVendorEarnings(order, suborder);
          
          // Create rider earnings
          if (suborder.riderId && suborder.deliveryFee > 0) {
            await createRiderEarnings(order, suborder);
          }
          
          console.log(`✅ Admin confirmed delivery and created earnings`);
        }
        else if (status === 'CANCELLED') {
          oldStatus = suborder.status;
          suborder.status = 'CANCELLED';
          updated = true;
          console.log(`✅ Admin cancelled suborder`);
        } else {
          return NextResponse.json(
            { message: "Invalid admin action for suborder" },
            { status: 400 }
          );
        }
      }

      else if (decoded.role === "customer") {
        // Customer can confirm delivery
        if (status === 'CONFIRMED' && suborder.status === 'DELIVERED') {
          oldStatus = suborder.status;
          suborder.status = 'CONFIRMED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.confirmedAt = new Date();
          
          // Generate confirmation code
          const code = generateConfirmationCode();
          suborder.deliveryDetails.confirmationCode = code;
          
          updated = true;
          console.log(`✅ Customer confirmed delivery with code: ${code}`);
        } else {
          return NextResponse.json(
            { message: "Invalid customer action" },
            { status: 403 }
          );
        }
      }

      // RIDER ACTIONS
      else if (decoded.role === "delivery") {
        // Rider can mark as PICKED_UP
        if (status === 'PICKED_UP' && suborder.status === 'ASSIGNED') {
          oldStatus = suborder.status;
          suborder.status = 'PICKED_UP';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.pickedUpAt = new Date();
          updated = true;
          console.log(`✅ Rider picked up order`);
        }
        // Rider can mark as IN_TRANSIT
        else if (status === 'IN_TRANSIT' && suborder.status === 'PICKED_UP') {
          oldStatus = suborder.status;
          suborder.status = 'IN_TRANSIT';
          updated = true;
          console.log(`✅ Rider marked as IN_TRANSIT`);
        }
        // Rider can mark as DELIVERED with confirmation code
        else if (status === 'DELIVERED' && suborder.status === 'IN_TRANSIT') {
          oldStatus = suborder.status;
          suborder.status = 'DELIVERED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.actualTime = new Date();
          suborder.deliveryDetails.riderConfirmedAt = new Date();
          updated = true;
          console.log(`✅ Rider marked as DELIVERED`);
        } else {
          return NextResponse.json(
            { message: "Invalid rider action" },
            { status: 403 }
          );
        }
      }

      console.log(`📊 Suborder status updated: ${oldStatus} → ${suborder.status}`);
    }

    /* ============================== MAIN ORDER ============================== *
    else {
      if (!["admin", "customer"].includes(decoded.role)) {
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }

      if (decoded.role === "admin") {
        // Admin can update main order status
        oldStatus = order.status;
        order.status = status as any;
        updated = true;
        
        // If marking as COMPLETED, check all suborders are delivered or confirmed
        if (status === 'COMPLETED') {
          const allDeliveredOrConfirmed = order.suborders.every(
            (so: any) => so.status === 'DELIVERED' || so.status === 'CONFIRMED' || so.status === 'CANCELLED'
          );
          
          if (!allDeliveredOrConfirmed) {
            return NextResponse.json(
              { message: "Cannot complete order - not all suborders delivered or confirmed" },
              { status: 400 }
            );
          }
        }
        
        console.log(`📊 Main order status updated: ${oldStatus} → ${order.status}`);
      }
    }

    if (!updated) {
      return NextResponse.json(
        { message: "No changes made" },
        { status: 400 }
      );
    }

    await order.save();
    console.log(`✅ Order saved successfully`);

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      orderId: order._id,
    });
  } catch (error: any) {
    console.error("🔥 Order status update error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// Add this helper function:
function generateConfirmationCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

/* ----------------------- CREATE VENDOR EARNINGS ----------------------- *
async function createVendorEarnings(order: any, suborder: any) {
  try {
    const exists = await VendorEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      vendorId: suborder.vendorId,
    });

    if (exists) {
      console.log("📘 Vendor earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const vendorItems = order.items.filter(
      (item: any) => item.vendorId === suborder.vendorId
    );

    const earning = new VendorEarning({
      orderId: order._id,
      vendorId: suborder.vendorId,
      suborderId: suborder._id,
      amount: suborder.amount,
      commission: suborder.commission,
      netAmount: suborder.netAmount,
      itemsCount: vendorItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ),
      status: "PENDING",
      orderDetails: {
        orderId: order.orderId,
        buyerName: typeof order.buyerId === 'object' 
          ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
          : 'Customer',
        buyerEmail: typeof order.buyerId === 'object' ? order.buyerId.email : '',
        itemsCount: vendorItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
        createdAt: order.createdAt
      },
      vendorDetails: {
        vendorId: suborder.vendorId,
        businessName: '' // You might want to populate this from vendor profile
      }
    });

    await earning.save();
    console.log("✅ Vendor earning created", {
      vendorId: suborder.vendorId,
      netAmount: suborder.netAmount,
    });

    return earning;
  } catch (error) {
    console.error("❌ Vendor earning creation failed", error);
    throw error;
  }
}

/* ----------------------- CREATE RIDER EARNINGS ----------------------- *
async function createRiderEarnings(order: any, suborder: any) {
  try {
    const exists = await RiderEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      riderId: suborder.riderId,
    });

    if (exists) {
      console.log("📘 Rider earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const earning = new RiderEarning({
      riderId: suborder.riderId,
      orderId: order._id,
      suborderId: suborder._id,
      deliveryFee: suborder.deliveryFee,
      status: "PENDING",
      orderDetails: {
        orderId: order.orderId,
        vendorId: suborder.vendorId,
        vendorName: '', // Populate from vendor profile
        pickupAddress: suborder.deliveryDetails?.pickupAddress || '',
        dropoffAddress: suborder.deliveryDetails?.dropoffAddress || order.shipping.address,
        createdAt: order.createdAt
      },
      riderDetails: {
        riderId: suborder.riderId,
        firstName: '', // Populate from user profile
        lastName: ''
      }
    });

    await earning.save();
    console.log("✅ Rider earning created", {
      riderId: suborder.riderId,
      deliveryFee: suborder.deliveryFee,
    });

    return earning;
  } catch (error) {
    console.error("❌ Rider earning creation failed", error);
    throw error;
  }
}*/


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import { VendorEarning, RiderEarning } from "@/models/VendorEarnings";
import { Types } from "mongoose";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

interface RequestBody {
  orderId: string;
  status: string;
  suborderId?: string;
  notes?: string;
  deliveryFee?: number;
  riderId?: string;
  viewAs?: 'customer' | 'vendor' | 'admin' | 'delivery';
}

// Helper function to generate confirmation code
function generateConfirmationCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

// Helper function to create vendor earnings
async function createVendorEarnings(order: any, suborder: any) {
  try {
    const exists = await VendorEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      vendorId: suborder.vendorId,
    });

    if (exists) {
      console.log("📘 Vendor earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const vendorItems = order.items.filter(
      (item: any) => item.vendorId === suborder.vendorId
    );

    const earning = new VendorEarning({
      orderId: order._id,
      vendorId: suborder.vendorId,
      suborderId: suborder._id,
      amount: suborder.amount,
      commission: suborder.commission,
      netAmount: suborder.netAmount,
      itemsCount: vendorItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ),
      status: "PENDING",
      orderDetails: {
        orderId: order.orderId,
        buyerName: typeof order.buyerId === 'object' 
          ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
          : 'Customer',
        buyerEmail: typeof order.buyerId === 'object' ? order.buyerId.email : '',
        itemsCount: vendorItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
        createdAt: order.createdAt
      },
      vendorDetails: {
        vendorId: suborder.vendorId,
        businessName: '' // You might want to populate this from vendor profile
      }
    });

    await earning.save();
    console.log("✅ Vendor earning created", {
      vendorId: suborder.vendorId,
      netAmount: suborder.netAmount,
    });

    return earning;
  } catch (error) {
    console.error("❌ Vendor earning creation failed", error);
    throw error;
  }
}

// Helper function to create rider earnings
async function createRiderEarnings(order: any, suborder: any) {
  try {
    const exists = await RiderEarning.findOne({
      orderId: order._id,
      suborderId: suborder._id,
      riderId: suborder.riderId,
    });

    if (exists) {
      console.log("📘 Rider earning already exists", {
        suborderId: suborder._id,
      });
      return exists;
    }

    const earning = new RiderEarning({
      riderId: suborder.riderId,
      orderId: order._id,
      suborderId: suborder._id,
      deliveryFee: suborder.deliveryFee,
      status: "PENDING",
      orderDetails: {
        orderId: order.orderId,
        vendorId: suborder.vendorId,
        vendorName: '', // Populate from vendor profile
        pickupAddress: suborder.deliveryDetails?.pickupAddress || '',
        dropoffAddress: suborder.deliveryDetails?.dropoffAddress || order.shipping.address,
        createdAt: order.createdAt
      },
      riderDetails: {
        riderId: suborder.riderId,
        firstName: '', // Populate from user profile
        lastName: ''
      }
    });

    await earning.save();
    console.log("✅ Rider earning created", {
      riderId: suborder.riderId,
      deliveryFee: suborder.deliveryFee,
    });

    return earning;
  } catch (error) {
    console.error("❌ Rider earning creation failed", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* ----------------------------- AUTHENTICATION ---------------------------- */
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedUser;

    const { orderId, status, suborderId, notes, deliveryFee, riderId, viewAs } =
      (await req.json()) as RequestBody;

    // Determine effective role (use viewAs if provided, otherwise use actual role)
    const effectiveRole = viewAs || decoded.role;

    console.log("📝 Status update request:", {
      userId: decoded.userId,
      actualRole: decoded.role,
      effectiveRole,
      viewAs,
      orderId,
      suborderId,
      status,
      riderId,
      deliveryFee
    });

    /* -------------------------------- FIND ORDER ----------------------------- */
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let updated = false;
    let oldStatus = "";

    /* ============================ SUBORDER UPDATE ============================ */
    if (suborderId) {
      const suborder = order.suborders.id(suborderId);

      if (!suborder) {
        return NextResponse.json(
          { message: "Suborder not found" },
          { status: 404 }
        );
      }

      // Check permissions based on effective role
      if (effectiveRole === "vendor") {
        // Vendor permissions (selling to someone else)
        if (suborder.vendorId !== decoded.userId) {
          return NextResponse.json(
            { message: "Forbidden - Not your suborder" },
            { status: 403 }
          );
        }

        // Vendor can mark as READY_FOR_PICKUP (from PROCESSING)
        if (status === 'READY_FOR_PICKUP' && suborder.status === 'PROCESSING') {
          oldStatus = suborder.status;
          suborder.status = 'READY_FOR_PICKUP';
          updated = true;
          console.log(`✅ Vendor marked suborder as READY_FOR_PICKUP`);
        } 
        // Vendor can assign a rider (from READY_FOR_PICKUP)
        else if (status === 'ASSIGNED' && suborder.status === 'READY_FOR_PICKUP' && riderId) {
          oldStatus = suborder.status;
          suborder.status = 'ASSIGNED';
          suborder.riderId = new Types.ObjectId(riderId);
          if (deliveryFee) suborder.deliveryFee = deliveryFee;
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.assignedAt = new Date();
          updated = true;
          console.log(`✅ Vendor assigned rider ${riderId} to suborder`);
        }
        // Vendor can also mark as PROCESSING (if needed)
        else if (status === 'PROCESSING' && suborder.status === 'PENDING') {
          oldStatus = suborder.status;
          suborder.status = 'PROCESSING';
          updated = true;
          console.log(`✅ Vendor started processing order`);
        }
        else {
          return NextResponse.json(
            { message: "Invalid vendor action" },
            { status: 403 }
          );
        }
      }

      else if (effectiveRole === "admin") {
        // Admin permissions
        // Admin can mark as READY_FOR_PICKUP
        if (status === 'READY_FOR_PICKUP' && suborder.status === 'PROCESSING') {
          oldStatus = suborder.status;
          suborder.status = 'READY_FOR_PICKUP';
          updated = true;
          console.log(`✅ Admin marked suborder as READY_FOR_PICKUP`);
        }
        // Admin can assign rider (from READY_FOR_PICKUP)
        else if (status === 'ASSIGNED' && suborder.status === 'READY_FOR_PICKUP' && riderId) {
          oldStatus = suborder.status;
          suborder.status = 'ASSIGNED';
          suborder.riderId = new Types.ObjectId(riderId);
          if (deliveryFee) suborder.deliveryFee = deliveryFee;
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.assignedAt = new Date();
          updated = true;
          console.log(`✅ Admin assigned rider ${riderId} to suborder`);
        } 
        // Admin can mark as IN_TRANSIT (rider picked up)
        else if (status === 'IN_TRANSIT' && suborder.status === 'ASSIGNED') {
          oldStatus = suborder.status;
          suborder.status = 'IN_TRANSIT';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.pickedUpAt = new Date();
          updated = true;
          console.log(`✅ Admin marked suborder as IN_TRANSIT`);
        }
        // Admin confirms delivery
        else if (status === 'DELIVERED' && (suborder.status === 'IN_TRANSIT' || suborder.status === 'ASSIGNED')) {
          oldStatus = suborder.status;
          suborder.status = 'DELIVERED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.actualTime = new Date();
          updated = true;
          
          // Create vendor earnings
          await createVendorEarnings(order, suborder);
          
          // Create rider earnings
          if (suborder.riderId && suborder.deliveryFee > 0) {
            await createRiderEarnings(order, suborder);
          }
          
          console.log(`✅ Admin confirmed delivery and created earnings`);
        }
        else if (status === 'CANCELLED') {
          oldStatus = suborder.status;
          suborder.status = 'CANCELLED';
          updated = true;
          console.log(`✅ Admin cancelled suborder`);
        } else {
          return NextResponse.json(
            { message: "Invalid admin action for suborder" },
            { status: 400 }
          );
        }
      }

      /*else if (effectiveRole === "customer") {
        // Customer permissions (including vendors viewing as customer)
        // Customer can confirm delivery
        if (status === 'CONFIRMED' && suborder.status === 'DELIVERED') {
          oldStatus = suborder.status;
          suborder.status = 'CONFIRMED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.confirmedAt = new Date();
          
          // Generate confirmation code
          const code = generateConfirmationCode();
          suborder.deliveryDetails.confirmationCode = code;
          
          updated = true;
          console.log(`✅ Customer confirmed delivery with code: ${code}`);
        } else {
          return NextResponse.json(
            { message: "Invalid customer action" },
            { status: 403 }
          );
        }
      }*/

      else if (effectiveRole === "customer") {
      // Customer permissions (including vendors viewing as customer)
      // Customer can confirm delivery
      if (status === 'CONFIRMED' && suborder.status === 'DELIVERED') {
        oldStatus = suborder.status;
        suborder.status = 'CONFIRMED';
        suborder.deliveryDetails = suborder.deliveryDetails || {};
        suborder.deliveryDetails.confirmedAt = new Date();
        
        // Generate confirmation code
        const code = generateConfirmationCode();
        suborder.deliveryDetails.confirmationCode = code;
        
        updated = true;
        console.log(`✅ Customer confirmed delivery with code: ${code}`);
        
        // Save immediately to ensure code is in the database
        await order.save();
        
        // Return the code in the response
        return NextResponse.json({
          success: true,
          message: "Delivery confirmed successfully",
          confirmationCode: code,
          orderId: order._id,
        });
      } else {
        return NextResponse.json(
          { message: "Invalid customer action" },
          { status: 403 }
        );
      }
    }

      else if (effectiveRole === "delivery") {
        // Rider permissions
        // Check if rider is assigned to this suborder
        if (suborder.riderId?.toString() !== decoded.userId) {
          return NextResponse.json(
            { message: "Forbidden - Not your assigned delivery" },
            { status: 403 }
          );
        }

        // Rider can mark as PICKED_UP
        if (status === 'PICKED_UP' && suborder.status === 'ASSIGNED') {
          oldStatus = suborder.status;
          suborder.status = 'PICKED_UP';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.pickedUpAt = new Date();
          updated = true;
          console.log(`✅ Rider picked up order`);
        }
        // Rider can mark as IN_TRANSIT
        else if (status === 'IN_TRANSIT' && suborder.status === 'PICKED_UP') {
          oldStatus = suborder.status;
          suborder.status = 'IN_TRANSIT';
          updated = true;
          console.log(`✅ Rider marked as IN_TRANSIT`);
        }
        // Rider can mark as DELIVERED
        else if (status === 'DELIVERED' && suborder.status === 'IN_TRANSIT') {
          oldStatus = suborder.status;
          suborder.status = 'DELIVERED';
          suborder.deliveryDetails = suborder.deliveryDetails || {};
          suborder.deliveryDetails.actualTime = new Date();
          suborder.deliveryDetails.riderConfirmedAt = new Date();
          updated = true;
          console.log(`✅ Rider marked as DELIVERED`);
        } else {
          return NextResponse.json(
            { message: "Invalid rider action" },
            { status: 403 }
          );
        }
      }

      console.log(`📊 Suborder status updated: ${oldStatus} → ${suborder.status}`);
    }

    /* ============================== MAIN ORDER ============================== */
    else {
      if (!["admin", "customer"].includes(effectiveRole)) {
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }

      if (effectiveRole === "admin") {
        // Admin can update main order status
        oldStatus = order.status;
        order.status = status as any;
        updated = true;
        
        // If marking as COMPLETED, check all suborders are delivered or confirmed
        if (status === 'COMPLETED') {
          const allDeliveredOrConfirmed = order.suborders.every(
            (so: any) => so.status === 'DELIVERED' || so.status === 'CONFIRMED' || so.status === 'CANCELLED'
          );
          
          if (!allDeliveredOrConfirmed) {
            return NextResponse.json(
              { message: "Cannot complete order - not all suborders delivered or confirmed" },
              { status: 400 }
            );
          }
        }
        
        console.log(`📊 Main order status updated: ${oldStatus} → ${order.status}`);
      }
      
      else if (effectiveRole === "customer") {
        // Customer can cancel their order if still pending/processing
        if (status === 'CANCELLED' && ['PENDING', 'PROCESSING'].includes(order.status)) {
          oldStatus = order.status;
          order.status = 'CANCELLED';
          
          // Also cancel all suborders that aren't already shipped/delivered
          order.suborders.forEach((suborder: any) => {
            if (!['SHIPPED', 'DELIVERED', 'CONFIRMED'].includes(suborder.status)) {
              suborder.status = 'CANCELLED';
            }
          });
          
          updated = true;
          console.log(`✅ Customer cancelled order`);
        } else {
          return NextResponse.json(
            { message: "Invalid customer action for main order" },
            { status: 403 }
          );
        }
      }
    }

    if (!updated) {
      return NextResponse.json(
        { message: "No changes made" },
        { status: 400 }
      );
    }

    await order.save();
    console.log(`✅ Order saved successfully`);

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      orderId: order._id,
    });
  } catch (error: any) {
    console.error("🔥 Order status update error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}