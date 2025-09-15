/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Product from '@/models/product';
import { makeToken, generateRef, calculateCommission } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { items, shipping } = await req.json();

    
    if (!items || !shipping) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate items and get current prices from database
    let totalAmount = 0;
    const vendorMap: Record<string, { amount: number; vendorId: string; shopId: string }> = {};
    const validatedItems = [];

    for (const item of items) {
    
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json({ message: `Product ${item.productId} not found` }, { status: 400 });
      }

      if (!product.isActive || !product.isApproved) {
        return NextResponse.json({ message: `Product ${product.name} is not available` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // Update vendor totals
      if (!vendorMap[product.vendorId.toString()]) {
        vendorMap[product.vendorId.toString()] = {
          amount: 0,
          vendorId: product.vendorId.toString(),
          shopId: product.shopId.toString()
        };
      }
      vendorMap[product.vendorId.toString()].amount += itemTotal;

      validatedItems.push({
        productId: product._id.toString(),
        vendorId: product.vendorId.toString(),
        shopId: product.shopId.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]
      });
    }

    // Calculate vendor splits with commission
    const vendorSplits = Object.values(vendorMap).map(vendor => {
      const { commission, netAmount } = calculateCommission(vendor.amount);
      return {
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        amount: vendor.amount,
        commission,
        netAmount
      };
    });

    // Add platform fee to total amount
    const platformFee = vendorSplits.reduce((sum, vendor) => sum + vendor.commission, 0);
    totalAmount += platformFee;

    // Create order draft
    const draftToken = makeToken();
    const ref = generateRef(draftToken);

    const orderDraft = new OrderDraft({
      token: draftToken,
      items: validatedItems,
      vendorSplits,
      totalAmount,
      buyerId: decoded.userId,
      shipping,
      expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes expiry
    });

    await orderDraft.save();

    return NextResponse.json({
      success: true,
      ref,
      totalAmount,
      currency: 'KES',
      expiresAt: orderDraft.expiresAt
    });

  } catch (error: any) {
    console.error('Error creating order draft:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Product from '@/models/product';
import { makeToken, generateRef, calculateCommission } from '@/lib/orderUtils';
import { initiateSTKPush } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    console.log('[INFO] Incoming checkout request...');

    await dbConnect();
    console.log('[SUCCESS] Database connected');

    // 🔐 Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.warn('[FAILURE] No authentication token found');
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
      console.log('[SUCCESS] Token verified. User ID:', decoded.userId);
    } catch (err) {
      console.warn('[FAILURE] Invalid token:', err);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { items, shipping, phoneNumber } = await req.json();
    if (!items || !shipping || !phoneNumber) {
      console.warn('[FAILURE] Missing required fields:', { items, shipping, phoneNumber });
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[INFO] Validating ${items.length} items...`);

    // ✅ Validate items
    let totalAmount = 0;
    const vendorMap: Record<string, { amount: number; vendorId: string; shopId: string }> = {};
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        console.warn(`[FAILURE] Product not found: ${item.productId}`);
        return NextResponse.json({ message: `Product ${item.productId} not found` }, { status: 400 });
      }

      if (!product.isActive || !product.isApproved) {
        console.warn(`[FAILURE] Product not available: ${product.name}`);
        return NextResponse.json({ message: `Product ${product.name} is not available` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        console.warn(`[FAILURE] Insufficient stock for: ${product.name}`);
        return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      if (!vendorMap[product.vendorId.toString()]) {
        vendorMap[product.vendorId.toString()] = {
          amount: 0,
          vendorId: product.vendorId.toString(),
          shopId: product.shopId.toString()
        };
      }
      vendorMap[product.vendorId.toString()].amount += itemTotal;

      validatedItems.push({
        productId: product._id.toString(),
        vendorId: product.vendorId.toString(),
        shopId: product.shopId.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]
      });

      console.log(`[SUCCESS] Validated product: ${product.name}, Qty: ${item.quantity}, Total: ${itemTotal}`);
    }

    // 💰 Vendor splits
    const vendorSplits = Object.values(vendorMap).map(vendor => {
      const { commission, netAmount } = calculateCommission(vendor.amount);
      return {
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        amount: vendor.amount,
        commission,
        netAmount
      };
    });

    const platformFee = vendorSplits.reduce((sum, vendor) => sum + vendor.commission, 0);
    totalAmount += platformFee;

    console.log('[INFO] Vendor splits calculated:', vendorSplits);
    console.log(`[INFO] Total amount (with commission): KES ${totalAmount}`);

    // 📝 Create order draft
    const draftToken = makeToken();
    const ref = generateRef(draftToken);

    const orderDraft = new OrderDraft({
      token: draftToken,
      items: validatedItems,
      vendorSplits,
      totalAmount,
      buyerId: decoded.userId,
      shipping,
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    });

    await orderDraft.save();
    console.log('[SUCCESS] Order draft created with reference:', ref);

    // 📲 Initiate STK Push
    try {
      console.log(`[INFO] Initiating STK Push for phone ${phoneNumber}, amount KES ${totalAmount}...`);

      const stkResponse = await initiateSTKPush(
        phoneNumber,
        totalAmount,
        ref,
        `Payment for order ${ref}`
      );

      console.log('[SUCCESS] STK Push initiated:', stkResponse);

      return NextResponse.json({
        success: true,
        ref,
        totalAmount,
        currency: 'KES',
        expiresAt: orderDraft.expiresAt,
        checkoutRequestID: stkResponse.CheckoutRequestID,
        merchantRequestID: stkResponse.MerchantRequestID
      });

    } catch (stkError: any) {
      console.error('[FAILURE] STK Push failed:', stkError.message);
      await OrderDraft.deleteOne({ token: draftToken });
      console.log('[INFO] Order draft deleted due to failed payment');

      return NextResponse.json({ 
        message: 'Failed to initiate payment: ' + stkError.message 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('[FAILURE] Error creating order draft:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}*/

// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import OrderDraft from '@/models/OrderDraft';
import Product from '@/models/product';
import { makeToken, generateRef, calculateCommission, storeShort } from '@/lib/orderUtils';

// From env
const MPESA_PAYBILL = process.env.MPESA_SHORTCODE || '';

export async function POST(req: NextRequest) {
  try {
    console.log('[INFO] Incoming checkout request...');

    await dbConnect();
    console.log('[SUCCESS] Database connected');

    // 🔐 Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.warn('[FAILURE] No authentication token found');
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
      console.log('[SUCCESS] Token verified. User ID:', decoded.userId);
    } catch (err) {
      console.warn('[FAILURE] Invalid token verification:', err);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { items, shipping } = await req.json();
    if (!items || !shipping) {
      console.warn('[FAILURE] Missing required fields:', { items, shipping });
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[INFO] Validating ${items.length} items...`);

    // ✅ Validate items
    let totalAmount = 0;
    const vendorMap: Record<string, { amount: number; vendorId: string; shopId: string }> = {};
    const validatedItems = [];

      for (const item of items) {
  const productId = item.productId || item._id; // fallback to _id
  console.log(`🔍 Validating productId: ${productId}, quantity: ${item.quantity}`);

  const product = await Product.findById(productId);

  if (!product) {
    console.warn(`❌ Product not found: ${productId}`);
    return NextResponse.json({ success: false, message: `Product ${productId} not found` }, { status: 400 });
  }

  if (!product.isActive || !product.isApproved) {
    console.warn(`❌ Product not available: ${product.name}`);
    return NextResponse.json({ success: false, message: `Product ${product.name} is not available` }, { status: 400 });
  }

  if (product.stock < item.quantity) {
    console.warn(`❌ Insufficient stock for: ${product.name}`);
    return NextResponse.json({ success: false, message: `Insufficient stock for ${product.name}` }, { status: 400 });
  }

  const itemTotal = product.price * item.quantity;
  totalAmount += itemTotal;

  // Normalize vendorId & shopId (handle both object and string cases)
  const vendorId = product.vendorId?._id?.toString() || product.vendorId.toString();
  const shopId = product.shopId?._id?.toString() || product.shopId.toString();

  // Update vendor totals
  if (!vendorMap[vendorId]) {
    vendorMap[vendorId] = {
      amount: 0,
      vendorId,
      shopId
    };
  }
  vendorMap[vendorId].amount += itemTotal;

  validatedItems.push({
    productId: product._id.toString(),
    vendorId,
    shopId,
    name: product.name,
    price: product.price,
    quantity: item.quantity,
    image: product.images?.[0] || item.image || ''
  });

  console.log(`✅ Validated product: ${product.name}, total: ${itemTotal}`);
}


    // 💰 Vendor splits
    const vendorSplits = Object.values(vendorMap).map(vendor => {
      const { commission, netAmount } = calculateCommission(vendor.amount);
      console.log(`[INFO] Vendor split for vendor ${vendor.vendorId}: Gross=${vendor.amount}, Commission=${commission}, Net=${netAmount}`);
      return {
        vendorId: vendor.vendorId,
        shopId: vendor.shopId,
        amount: vendor.amount,
        commission,
        netAmount
      };
    });

    const platformFee = vendorSplits.reduce((sum, vendor) => sum + vendor.commission, 0);
    totalAmount += platformFee;

    console.log('[SUCCESS] Vendor splits calculated:', vendorSplits);
    console.log(`[INFO] Total amount (with commission): KES ${totalAmount}`);

    // 📝 Create order draft
    const draftToken = makeToken();
    const ref = generateRef(draftToken);

    const orderDraft = new OrderDraft({
      token: draftToken,
      items: validatedItems,
      vendorSplits,
      totalAmount,
      buyerId: decoded.userId,
      shipping,
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    });

    await orderDraft.save();
    console.log('[SUCCESS] Order draft created with reference:', ref);

    // 📲 Return PayBill + Ref to user
    /*console.log('[SUCCESS] Checkout request processed successfully, returning payment instructions.');
    return NextResponse.json({
      success: true,
      message: "Please complete payment via M-Pesa PayBill",
      paybill: MPESA_PAYBILL,
      accountReference: ref,
      totalAmount,
      currency: 'KES',
      expiresAt: orderDraft.expiresAt,
    });*/
    const fullRef = generateRef(draftToken);
    const customerRef = storeShort(fullRef);

    console.log('[SUCCESS] Checkout request processed successfully, returning payment instructions.');
    return NextResponse.json({
      success: true,
      message: "Please complete payment via M-Pesa PayBill",
      paybill: MPESA_PAYBILL,
      accountReference: customerRef, // ⬅️ 6-char only
      totalAmount,
      currency: 'KES',
      expiresAt: orderDraft.expiresAt,
    });

  } catch (error: any) {
    console.error('[FAILURE] Error creating order draft:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
