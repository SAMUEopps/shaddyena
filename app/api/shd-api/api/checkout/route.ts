// // import { verifyToken } from '@/shd-lib/lib/auth';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import { initSTKPush } from '@/shd-lib/lib/mpesa';
// // import { generateOrderNumber } from '@/shd-lib/lib/utils';
// // import Order from '@/shd-models/models/Order';
// // import Product from '@/shd-models/models/Product';
// // import Transaction from '@/shd-models/models/Transaction';
// // import Vendor from '@/shd-models/models/Vendor';
// // import { NextRequest, NextResponse } from 'next/server';



// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDatabase();
// //     const token = req.headers.get('authorization')?.split(' ')[1];
// //     const decoded = verifyToken(token);
    
// //     if (!decoded) {
// //       return NextResponse.json(
// //         { error: 'Unauthorized' },
// //         { status: 401 }
// //       );
// //     }

// //     const body = await req.json();
// //     const { items, deliveryAddress, deliveryPhone, shippingMethod } = body;

// //     // Validate and group items by vendor
// //     const vendorMap = new Map();
// //     let totalAmount = 0;

// //     for (const item of items) {
// //       const product = await Product.findById(item.productId);
// //       if (!product || !product.isActive) {
// //         return NextResponse.json(
// //           { error: `Product ${item.productId} not available` },
// //           { status: 400 }
// //         );
// //       }

// //       if (product.stock < item.quantity) {
// //         return NextResponse.json(
// //           { error: `Insufficient stock for ${product.name}` },
// //           { status: 400 }
// //         );
// //       }

// //       const vendorId = product.vendorId.toString();
// //       if (!vendorMap.has(vendorId)) {
// //         vendorMap.set(vendorId, {
// //           vendorId: product.vendorId,
// //           products: [],
// //           subtotal: 0
// //         });
// //       }

// //       const vendorData = vendorMap.get(vendorId);
// //       vendorData.products.push({
// //         productId: product._id,
// //         name: product.name,
// //         quantity: item.quantity,
// //         price: product.price
// //       });
// //       vendorData.subtotal += product.price * item.quantity;
// //       totalAmount += product.price * item.quantity;
// //     }

// //     // Create orders for each vendor
// //     const orders = [];
// //     for (const [vendorId, data] of vendorMap) {
// //       const vendor = await Vendor.findById(vendorId);
// //       const commissionRate = 0.1; // 10% commission
// //       const commission = data.subtotal * commissionRate;
      
// //       const order = await Order.create({
// //         orderNumber: generateOrderNumber(),
// //         customerId: decoded.userId,
// //         vendorId,
// //         products: data.products,
// //         totalAmount: data.subtotal,
// //         commission,
// //         vendorAmount: data.subtotal - commission,
// //         deliveryAddress,
// //         deliveryPhone,
// //         shippingMethod,
// //         status: 'pending',
// //         isPaid: false
// //       });

// //       orders.push(order);
// //     }

// //     // Initiate M-Pesa payment
// //     const accountReference = `SHAD-${Date.now()}`;
// //     const stkResponse = await initSTKPush(
// //       body.phoneNumber,
// //       totalAmount,
// //       accountReference
// //     );

// //     // Store transaction
// //     await Transaction.create({
// //       transactionId: stkResponse.CheckoutRequestID,
// //       phoneNumber: body.phoneNumber,
// //       amount: totalAmount,
// //       status: 'pending',
// //       type: 'collection',
// //       metadata: { accountReference, orders: orders.map(o => o._id) }
// //     });

// //     return NextResponse.json({
// //       message: 'Payment initiated',
// //       checkoutRequestId: stkResponse.CheckoutRequestID,
// //       orders: orders.map(o => o._id)
// //     });

// //   } catch (error) {
// //     console.error('Checkout error:', error);
// //     return NextResponse.json(
// //       { error: 'Checkout failed' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // api/checkout/route.ts
// import { verifyToken } from '@/shd-lib/lib/auth';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import { initSTKPush } from '@/shd-lib/lib/mpesa';
// import { generateOrderNumber } from '@/shd-lib/lib/utils';
// import Order from '@/shd-models/models/Order';
// import Product from '@/shd-models/models/Product';
// import Transaction from '@/shd-models/models/Transaction';
// import Vendor from '@/shd-models/models/Vendor';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     const decoded = verifyToken(token);
    
//     if (!decoded) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     const { items, deliveryAddress, deliveryPhone, shippingMethod, referredBy } = body;

//     // Validate and group items by vendor
//     const vendorMap = new Map();
//     let totalAmount = 0;

//     for (const item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product || !product.isActive) {
//         return NextResponse.json(
//           { error: `Product ${item.productId} not available` },
//           { status: 400 }
//         );
//       }

//       if (product.stock < item.quantity) {
//         return NextResponse.json(
//           { error: `Insufficient stock for ${product.name}` },
//           { status: 400 }
//         );
//       }

//       const vendorId = product.vendorId.toString();
//       if (!vendorMap.has(vendorId)) {
//         vendorMap.set(vendorId, {
//           vendorId: product.vendorId,
//           products: [],
//           subtotal: 0,
//           vendor: null
//         });
//       }

//       const vendorData = vendorMap.get(vendorId);
//       vendorData.products.push({
//         productId: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price
//       });
//       vendorData.subtotal += product.price * item.quantity;
//       totalAmount += product.price * item.quantity;
//     }

//     // Create orders for each vendor
//     const orders = [];
//     for (const [vendorId, data] of vendorMap) {
//       const vendor = await Vendor.findById(vendorId);
//       if (!vendor) continue;
      
//       // Calculate commissions
//       const platformCommission = data.subtotal * 0.025; // 2.5%
//       const referralCommission = referredBy ? data.subtotal * 0.005 : 0; // 0.5% if referred
//       const vendorAmount = data.subtotal - platformCommission - referralCommission; // 97%
      
//       const order = await Order.create({
//         orderNumber: generateOrderNumber(),
//         customerId: decoded.userId,
//         vendorId,
//         referredBy: referredBy || null,
//         products: data.products,
//         totalAmount: data.subtotal,
//         platformCommission,
//         referralCommission,
//         vendorAmount,
//         deliveryAddress,
//         deliveryPhone,
//         shippingMethod,
//         status: 'pending',
//         isPaid: false
//       });

//       orders.push(order);
//     }

//     // Initiate M-Pesa payment
//     const accountReference = `SHAD-${Date.now()}`;
//     const stkResponse = await initSTKPush(
//       body.phoneNumber,
//       totalAmount,
//       accountReference
//     );

//     // Store transaction with orders array
//     await Transaction.create({
//       transactionId: stkResponse.CheckoutRequestID,
//       phoneNumber: body.phoneNumber,
//       amount: totalAmount,
//       status: 'pending',
//       type: 'collection',
//       metadata: { 
//         accountReference, 
//         orders: orders.map(o => o._id),
//         customerId: decoded.userId,
//         referredBy: referredBy || null
//       }
//     });

//     return NextResponse.json({
//       message: 'Payment initiated',
//       checkoutRequestId: stkResponse.CheckoutRequestID,
//       orders: orders.map(o => o._id)
//     });

//   } catch (error) {
//     console.error('Checkout error:', error);
//     return NextResponse.json(
//       { error: 'Checkout failed' },
//       { status: 500 }
//     );
//   }
// }

// api/checkout/route.ts
import { verifyToken } from '@/shd-lib/lib/auth';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import { initSTKPush } from '@/shd-lib/lib/mpesa';
import { generateOrderNumber } from '@/shd-lib/lib/utils';
import Order from '@/shd-models/models/Order';
import Product from '@/shd-models/models/Product';
import Transaction from '@/shd-models/models/Transaction';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, deliveryAddress, deliveryPhone, shippingMethod, phoneNumber } = body;

    // Get user to check referral
    const user = await User.findById(decoded.userId);
    const referredBy = user?.referredBy || null;

    // Validate and group items by vendor
    const vendorMap = new Map();
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.productId} not available` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const vendorId = product.vendorId.toString();
      if (!vendorMap.has(vendorId)) {
        vendorMap.set(vendorId, {
          vendorId: product.vendorId,
          products: [],
          subtotal: 0
        });
      }

      const vendorData = vendorMap.get(vendorId);
      vendorData.products.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
      vendorData.subtotal += product.price * item.quantity;
      totalAmount += product.price * item.quantity;
    }

    // Create separate orders for each vendor
    const createdOrders = [];
    const orderIds = [];

    for (const [vendorId, data] of vendorMap) {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return NextResponse.json(
          { error: `Vendor ${vendorId} not found` },
          { status: 400 }
        );
      }

      // Calculate commissions
      const platformCommission = data.subtotal * 0.025; // 2.5%
      const referralCommission = referredBy ? data.subtotal * 0.005 : 0; // 0.5% if referred
      const vendorAmount = data.subtotal - platformCommission - referralCommission;

      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        customerId: decoded.userId,
        vendorId: vendor._id,
        referredBy: referredBy || null,
        products: data.products,
        totalAmount: data.subtotal,
        platformCommission,
        referralCommission,
        vendorAmount,
        deliveryAddress,
        deliveryPhone,
        shippingMethod,
        status: 'pending',
        isPaid: false
      });

      createdOrders.push(order);
      orderIds.push(order._id);

      // Log for debugging
      console.log(`✅ Created order ${order.orderNumber} for vendor ${vendor.businessName}`);
    }

    // Generate a single account reference for all orders
    const accountReference = `SHAD-${Date.now()}`;

    // Initiate M-Pesa payment for total amount
    const stkResponse = await initSTKPush(
      phoneNumber || body.phoneNumber,
      totalAmount,
      accountReference
    );

    // Store single transaction with ALL order IDs
    const transaction = await Transaction.create({
      transactionId: stkResponse.CheckoutRequestID,
      phoneNumber: phoneNumber || body.phoneNumber,
      amount: totalAmount,
      status: 'pending',
      type: 'collection',
      metadata: {
        accountReference,
        orders: orderIds, // ✅ Store ALL order IDs
        customerId: decoded.userId,
        referredBy: referredBy || null,
        vendorOrders: createdOrders.map(o => ({
          orderId: o._id,
          vendorId: o.vendorId,
          amount: o.totalAmount
        }))
      }
    });

    return NextResponse.json({
      message: 'Payment initiated successfully',
      success: true,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      accountReference,
      totalAmount,
      orders: createdOrders.map(o => ({
        orderId: o._id,
        orderNumber: o.orderNumber,
        vendorId: o.vendorId,
        amount: o.totalAmount,
        status: o.status
      })),
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Checkout failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}