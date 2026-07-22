import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Transaction from '@/models/Transaction';
import Vendor from '@/models/Vendor';
import { initSTKPush } from '@/lib/mpesa';
import { verifyToken } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';

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
    const { items, deliveryAddress, deliveryPhone, shippingMethod } = body;

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

    // Create orders for each vendor
    const orders = [];
    for (const [vendorId, data] of vendorMap) {
      const vendor = await Vendor.findById(vendorId);
      const commissionRate = 0.1; // 10% commission
      const commission = data.subtotal * commissionRate;
      
      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        customerId: decoded.userId,
        vendorId,
        products: data.products,
        totalAmount: data.subtotal,
        commission,
        vendorAmount: data.subtotal - commission,
        deliveryAddress,
        deliveryPhone,
        shippingMethod,
        status: 'pending',
        isPaid: false
      });

      orders.push(order);
    }

    // Initiate M-Pesa payment
    const accountReference = `SHAD-${Date.now()}`;
    const stkResponse = await initSTKPush(
      body.phoneNumber,
      totalAmount,
      accountReference
    );

    // Store transaction
    await Transaction.create({
      transactionId: stkResponse.CheckoutRequestID,
      phoneNumber: body.phoneNumber,
      amount: totalAmount,
      status: 'pending',
      type: 'collection',
      metadata: { accountReference, orders: orders.map(o => o._id) }
    });

    return NextResponse.json({
      message: 'Payment initiated',
      checkoutRequestId: stkResponse.CheckoutRequestID,
      orders: orders.map(o => o._id)
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  }
}