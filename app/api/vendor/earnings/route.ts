// app/api/vendor/earnings/route.ts - REMOVED DATE FILTERING
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

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log('🎯 Vendor ID from token:', decoded.userId);
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "vendor") {
      return NextResponse.json({ message: "Unauthorized - Not a vendor" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    // REMOVE date range parameter - show all time earnings
    const status = searchParams.get("status") || "all";

    console.log(`📊 Calculating earnings for vendor ${decoded.userId} - ALL TIME`);
    console.log(`📋 Status filter: ${status}`);

    // REMOVED: Date filtering - fetch ALL orders
    const orders = await Order.find({})
      .select('orderId buyerId createdAt suborders')
      .lean();

    console.log(`📦 Found ${orders.length} total orders in system`);

    // Filter orders manually where this user is the vendor
    const vendorOrders = orders.filter(order => {
      return order.suborders?.some((suborder: { vendorId: string; }) => suborder.vendorId === decoded.userId);
    });

    console.log(`🎯 Found ${vendorOrders.length} orders where user is vendor`);

    // Debug: Show the filtered orders
    vendorOrders.forEach((order, index) => {
      console.log(`   Order ${index + 1}: ${order.orderId} - ${order.createdAt.toISOString()}`);
    });

    if (vendorOrders.length === 0) {
      console.log('⚠️  No vendor orders found for this user');
      return NextResponse.json({
        totalEarnings: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        monthlyEarnings: [],
        topProducts: [],
        recentTransactions: [],
        message: "No vendor orders found for this user."
      });
    }

    // Process orders manually to calculate earnings
    let totalEarnings = 0;
    let totalOrders = 0;
    let monthlyData: Record<string, { month: string; earnings: number; orders: number; transactions: any[] }> = {};
    let productData: Record<string, { productName: string; totalRevenue: number; quantitySold: number }> = {};
    let transactions: any[] = [];

    for (const order of vendorOrders) {
      for (const suborder of order.suborders || []) {
        if (suborder.vendorId === decoded.userId) {
          // Skip if status filter doesn't match
          if (status !== 'all' && suborder.status !== status.toUpperCase()) {
            continue;
          }

          const netAmount = suborder.netAmount || 0;
          totalEarnings += netAmount;
          totalOrders++;

          // Monthly data (for all time)
          const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!monthlyData[month]) {
            monthlyData[month] = { month, earnings: 0, orders: 0, transactions: [] };
          }
          monthlyData[month].earnings += netAmount;
          monthlyData[month].orders++;

          // Product data
          for (const item of suborder.items || []) {
            const productName = item.name || 'Unknown Product';
            if (!productData[productName]) {
              productData[productName] = { productName, totalRevenue: 0, quantitySold: 0 };
            }
            const itemRevenue = (item.price || 0) * (item.quantity || 0);
            productData[productName].totalRevenue += itemRevenue;
            productData[productName].quantitySold += (item.quantity || 0);
          }

          // Transaction data
          transactions.push({
            orderId: order.orderId,
            date: order.createdAt,
            amount: suborder.amount || 0,
            commission: suborder.commission || 0,
            netAmount: netAmount,
            status: suborder.status,
            customerName: 'Customer' // You can enhance this by looking up buyer info
          });
        }
      }
    }

    // Sort and format the data
    const monthlyEarnings = Object.values(monthlyData)
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    const topProducts = Object.values(productData)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const earningsData = {
      totalEarnings,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalEarnings / totalOrders : 0,
      monthlyEarnings,
      topProducts,
      recentTransactions
    };

    console.log(`✅ Final earnings data:`, {
      totalEarnings: earningsData.totalEarnings,
      totalOrders: earningsData.totalOrders,
      monthlyEarningsCount: earningsData.monthlyEarnings.length,
      topProductsCount: earningsData.topProducts.length,
      recentTransactionsCount: earningsData.recentTransactions.length
    });

    return NextResponse.json(earningsData);
  } catch (error: any) {
    console.error("🔥 Vendor Earnings API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/vendor/earnings/route.ts (UPDATED with proper typing)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

// Define types for the lean objects
interface LeanOrder {
  _id: string;
  orderId: string;
  buyerId: string;
  createdAt: Date;
  suborders?: LeanSuborder[];
}

interface LeanSuborder {
  _id?: string;
  vendorId: string;
  shopId: string;
  riderId?: string;
  deliveryFee?: number;
  riderPayoutStatus?: string;
  items: LeanItem[];
  amount: number;
  commission: number;
  netAmount: number;
  status: string;
  deliveryDetails?: any;
}

interface LeanItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token" }, { status: 401 });
    }

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log('🎯 Vendor ID from token:', decoded.userId);
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "vendor") {
      return NextResponse.json({ message: "Unauthorized - Not a vendor" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    console.log(`📊 Calculating earnings for vendor ${decoded.userId} - ALL TIME`);
    console.log(`📋 Status filter: ${status}`);

    // Fetch ALL orders with lean() and cast to our type
    const orders = await Order.find({})
      .select('orderId buyerId createdAt suborders')
      .lean() as unknown as LeanOrder[];

    console.log(`📦 Found ${orders.length} total orders in system`);

    // Filter orders manually where this user is the vendor
    const vendorOrders = orders.filter(order => {
      return order.suborders?.some((suborder: LeanSuborder) => suborder.vendorId === decoded.userId);
    });

    console.log(`🎯 Found ${vendorOrders.length} orders where user is vendor`);

    // Debug: Show the filtered orders
    vendorOrders.forEach((order, index) => {
      console.log(`   Order ${index + 1}: ${order.orderId} - ${new Date(order.createdAt).toISOString()}`);
    });

    if (vendorOrders.length === 0) {
      console.log('⚠️  No vendor orders found for this user');
      return NextResponse.json({
        totalEarnings: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        monthlyEarnings: [],
        topProducts: [],
        recentTransactions: [],
        message: "No vendor orders found for this user."
      });
    }

    // Process orders manually to calculate earnings
    let totalEarnings = 0;
    let totalOrders = 0;
    let monthlyData: Record<string, { month: string; earnings: number; orders: number; transactions: any[] }> = {};
    let productData: Record<string, { productName: string; totalRevenue: number; quantitySold: number }> = {};
    let transactions: any[] = [];

    for (const order of vendorOrders) {
      // Ensure suborders exists and is an array
      if (!order.suborders || !Array.isArray(order.suborders)) {
        console.log(`⚠️ Order ${order.orderId} has no suborders array`);
        continue;
      }

      for (const suborder of order.suborders) {
        if (suborder.vendorId === decoded.userId) {
          // Skip if status filter doesn't match
          if (status !== 'all' && suborder.status?.toUpperCase() !== status.toUpperCase()) {
            continue;
          }

          const netAmount = suborder.netAmount || 0;
          totalEarnings += netAmount;
          totalOrders++;

          // Monthly data (for all time)
          const orderDate = new Date(order.createdAt);
          const month = orderDate.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!monthlyData[month]) {
            monthlyData[month] = { month, earnings: 0, orders: 0, transactions: [] };
          }
          monthlyData[month].earnings += netAmount;
          monthlyData[month].orders++;

          // Product data
          if (suborder.items && Array.isArray(suborder.items)) {
            for (const item of suborder.items) {
              const productName = item.name || 'Unknown Product';
              if (!productData[productName]) {
                productData[productName] = { productName, totalRevenue: 0, quantitySold: 0 };
              }
              const itemRevenue = (item.price || 0) * (item.quantity || 0);
              productData[productName].totalRevenue += itemRevenue;
              productData[productName].quantitySold += (item.quantity || 0);
            }
          }

          // Transaction data
          transactions.push({
            orderId: order.orderId,
            date: order.createdAt,
            amount: suborder.amount || 0,
            commission: suborder.commission || 0,
            netAmount: netAmount,
            status: suborder.status || 'UNKNOWN',
            customerName: 'Customer' // You can enhance this by looking up buyer info
          });
        }
      }
    }

    // Sort and format the data
    const monthlyEarnings = Object.values(monthlyData)
      .sort((a, b) => {
        // Parse month strings for sorting (e.g., "January 2024")
        const aDate = new Date(a.month);
        const bDate = new Date(b.month);
        return aDate.getTime() - bDate.getTime();
      });

    const topProducts = Object.values(productData)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const earningsData = {
      totalEarnings,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalEarnings / totalOrders : 0,
      monthlyEarnings,
      topProducts,
      recentTransactions
    };

    console.log(`✅ Final earnings data:`, {
      totalEarnings: earningsData.totalEarnings,
      totalOrders: earningsData.totalOrders,
      monthlyEarningsCount: earningsData.monthlyEarnings.length,
      topProductsCount: earningsData.topProducts.length,
      recentTransactionsCount: earningsData.recentTransactions.length
    });

    return NextResponse.json(earningsData);
  } catch (error: any) {
    console.error("🔥 Vendor Earnings API error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}