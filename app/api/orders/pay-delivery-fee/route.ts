// app/api/orders/pay-delivery-fee/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    
    if (decoded.role !== "customer") {
      return NextResponse.json({ message: "Only customers can pay delivery fees" }, { status: 403 });
    }

    const { orderId, suborderId, phone } = await req.json();

    if (!orderId || !suborderId || !phone) {
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

    // Verify this customer owns the order
    if (order.buyerId.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Check if delivery fee is already paid
    if (suborder.deliveryDetails?.deliveryFeePaid) {
      return NextResponse.json({ message: "Delivery fee already paid" }, { status: 400 });
    }

    const deliveryFee = suborder.deliveryFee;
    if (!deliveryFee || deliveryFee <= 0) {
      return NextResponse.json({ message: "No delivery fee required" }, { status: 400 });
    }

    // Generate a unique reference for this delivery fee payment
    const paymentRef = `DEL${uuidv4().substring(0, 8).toUpperCase()}`;

    // Store payment reference in order
    suborder.deliveryDetails = suborder.deliveryDetails || {};
    suborder.deliveryDetails.deliveryFeePaymentRef = paymentRef;
    await order.save();

    // Format phone to 2547XXXXXXXX
    let sanitizedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");

    // Generate OAuth token for M-PESA
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const access_token = tokenResponse.data.access_token;

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    // Password for STK
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // Send STK push for delivery fee
    const stkResponse = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: deliveryFee,
        PartyA: sanitizedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: sanitizedPhone,
        CallBackURL: `${process.env.MPESA_CALLBACK_URL}/delivery-fee`,
        AccountReference: paymentRef,
        TransactionDesc: "Delivery Fee Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Delivery Fee STK Push Response:", stkResponse.data);

    return NextResponse.json({
      success: true,
      message: "STK Push initiated. Check your phone for payment prompt.",
      paymentRef,
      merchantRequestID: stkResponse.data.MerchantRequestID,
      checkoutRequestID: stkResponse.data.CheckoutRequestID,
    });
  } catch (error: any) {
    console.error("❌ Delivery Fee Payment Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, error: error.response?.data?.errorMessage || "Payment failed. Please try again." },
      { status: 500 }
    );
  }
}*/

// app/api/orders/pay-delivery-fee/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

interface DecodedUser {
  userId: string;
  role: "customer" | "vendor" | "admin" | "delivery";
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("📦 Connected to database");

    // Get and verify token
    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.log("❌ No token provided");
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized - No token provided" 
      }, { status: 401 });
    }

    let decoded: DecodedUser;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
      console.log(`✅ Token verified for user: ${decoded.userId}, role: ${decoded.role}`);
    } catch (error) {
      console.log("❌ Invalid token:", error);
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized - Invalid token" 
      }, { status: 401 });
    }
    
    // Check if user is customer
    if (decoded.role !== "customer") {
      console.log(`❌ Wrong role: ${decoded.role}`);
      return NextResponse.json({ 
        success: false, 
        error: "Only customers can pay delivery fees" 
      }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();
    const { orderId, suborderId, phone } = body;
    console.log("📥 Request body:", { orderId, suborderId, phone });

    if (!orderId || !suborderId || !phone) {
      console.log("❌ Missing required fields:", { orderId, suborderId, phone });
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Find the order
    console.log(`🔍 Finding order: ${orderId}`);
    const order = await Order.findById(orderId);
    if (!order) {
      console.log(`❌ Order not found: ${orderId}`);
      return NextResponse.json({ 
        success: false, 
        error: "Order not found" 
      }, { status: 404 });
    }
    console.log(`✅ Order found: ${order._id}`);
    console.log(`📦 Order status: ${order.status}`);
    console.log(`📦 Order buyerId: ${order.buyerId}`);

    // Find the suborder
    const suborder = order.suborders.id(suborderId);
    if (!suborder) {
      console.log(`❌ Suborder not found: ${suborderId}`);
      return NextResponse.json({ 
        success: false, 
        error: "Suborder not found" 
      }, { status: 404 });
    }
    console.log(`✅ Suborder found: ${suborder._id}`);
    console.log(`📦 Suborder status: ${suborder.status}`);
    console.log(`📦 Suborder deliveryFee: ${suborder.deliveryFee}`);

    // Verify this customer owns the order
    if (order.buyerId.toString() !== decoded.userId) {
      console.log(`❌ Unauthorized: User ${decoded.userId} doesn't own order ${orderId}`);
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized - You don't own this order" 
      }, { status: 403 });
    }
    console.log(`✅ Customer verification passed`);

    // Check delivery fee
    const deliveryFee = suborder.deliveryFee;
    console.log(`💰 Delivery fee: ${deliveryFee}`);

    if (!deliveryFee || deliveryFee <= 0) {
      console.log(`❌ Invalid delivery fee: ${deliveryFee}`);
      return NextResponse.json({ 
        success: false, 
        error: "No delivery fee required" 
      }, { status: 400 });
    }

    // Check current deliveryDetails
    console.log(`📦 Current deliveryDetails:`, JSON.stringify(suborder.deliveryDetails, null, 2));

    // Check if delivery fee is already paid
    if (suborder.deliveryDetails?.deliveryFeePaid) {
      console.log(`⚠️ Delivery fee already paid for suborder: ${suborderId}`);
      return NextResponse.json({ 
        success: false, 
        error: "Delivery fee already paid" 
      }, { status: 400 });
    }

    // Generate a unique reference for this delivery fee payment
    const paymentRef = `DEL${uuidv4().substring(0, 8).toUpperCase()}`;
    console.log(`💰 Generated paymentRef: ${paymentRef} for suborder: ${suborderId}`);

    // Initialize deliveryDetails if it doesn't exist
    if (!suborder.deliveryDetails) {
      console.log("📝 Creating new deliveryDetails object");
      suborder.deliveryDetails = {
        dropoffAddress: order.shipping.address,
        deliveryFeePaid: false,
        deliveryFeePaymentFailed: false
      };
    }

    // Store payment reference in order
    suborder.deliveryDetails.deliveryFeePaymentRef = paymentRef;
    suborder.deliveryDetails.deliveryFeePaid = false;
    suborder.deliveryDetails.deliveryFeePaymentFailed = false;
    
    // Mark the suborder as modified (important for nested objects)
    order.markModified('suborders');
    
    console.log(`💾 Saving order with paymentRef: ${paymentRef}`);
    console.log(`📦 DeliveryDetails before save:`, JSON.stringify(suborder.deliveryDetails, null, 2));

    // Save the order
    const savedOrder = await order.save();
    console.log(`✅ Order saved successfully at: ${new Date().toISOString()}`);

    // Verify it was saved by fetching fresh from database
    console.log(`🔍 Verifying save by fetching fresh from database...`);
    const freshOrder = await Order.findById(orderId);
    const freshSuborder = freshOrder?.suborders.id(suborderId);
    
    console.log(`🔍 VERIFICATION - paymentRef in database after save:`, 
      freshSuborder?.deliveryDetails?.deliveryFeePaymentRef);
    console.log(`🔍 VERIFICATION - full deliveryDetails:`, 
      JSON.stringify(freshSuborder?.deliveryDetails, null, 2));

    if (freshSuborder?.deliveryDetails?.deliveryFeePaymentRef !== paymentRef) {
      console.error(`❌ CRITICAL: paymentRef was not saved correctly!`);
      
      // Try an alternative save approach using updateOne
      console.log(`🔄 Attempting alternative save with updateOne...`);
      const updateResult = await Order.updateOne(
        { 
          _id: orderId, 
          "suborders._id": suborderId 
        },
        { 
          $set: { 
            "suborders.$.deliveryDetails.deliveryFeePaymentRef": paymentRef,
            "suborders.$.deliveryDetails.deliveryFeePaid": false,
            "suborders.$.deliveryDetails.deliveryFeePaymentFailed": false
          } 
        }
      );
      console.log(`📊 UpdateOne result:`, updateResult);
      
      if (updateResult.modifiedCount === 0) {
        console.error(`❌ Alternative save also failed!`);
        return NextResponse.json({
          success: false,
          error: "Failed to save payment reference. Please try again."
        }, { status: 500 });
      } else {
        console.log(`✅ Alternative save successful!`);
      }
    } else {
      console.log(`✅ Verified: paymentRef matches in database`);
    }

    // Format phone to 2547XXXXXXXX
    let sanitizedPhone = phone.replace(/\s/g, '');
    sanitizedPhone = sanitizedPhone.replace(/^0/, "254").replace(/^\+/, "");
    if (!sanitizedPhone.startsWith('254')) {
      sanitizedPhone = '254' + sanitizedPhone.replace(/^0/, '');
    }
    console.log(`📱 Sanitized phone: ${sanitizedPhone}`);

    // Check M-PESA configuration
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET || 
        !process.env.MPESA_BASE_URL || !process.env.MPESA_SHORTCODE || 
        !process.env.MPESA_PASSKEY || !process.env.MPESA_CALLBACK_URL) {
      console.error("❌ Missing M-PESA configuration");
      return NextResponse.json({ 
        success: false, 
        error: "Payment service not properly configured" 
      }, { status: 500 });
    }

    // Generate OAuth token for M-PESA
    console.log("🔑 Generating M-PESA OAuth token...");
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    try {
      const tokenResponse = await axios.get(
        `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        { 
          headers: { 
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          } 
        }
      );

      const access_token = tokenResponse.data.access_token;
      console.log("✅ M-PESA OAuth token generated");

      // Generate timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);
      console.log(`🕐 Timestamp: ${timestamp}`);

      // Password for STK
      const password = Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString("base64");

      // Prepare STK push payload
      const stkPayload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(deliveryFee),
        PartyA: sanitizedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: sanitizedPhone,
        CallBackURL: `${process.env.MPESA_CALLBACK_URL}/delivery-fee`,
        AccountReference: paymentRef,
        TransactionDesc: "Delivery Fee Payment",
      };

      console.log("📤 Sending STK push with AccountReference:", paymentRef);

      // Send STK push for delivery fee
      const stkResponse = await axios.post(
        `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        stkPayload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Delivery Fee STK Push Response:", JSON.stringify(stkResponse.data, null, 2));

      // Check if STK push was successful
      if (stkResponse.data.ResponseCode === "0") {
        console.log("✅ STK push initiated successfully");
        
        return NextResponse.json({
          success: true,
          message: "STK Push sent. Check your phone to complete payment.",
          paymentRef,
          merchantRequestID: stkResponse.data.MerchantRequestID,
          checkoutRequestID: stkResponse.data.CheckoutRequestID,
          amount: deliveryFee
        });
      } else {
        console.error("❌ STK push failed:", stkResponse.data.ResponseDescription);
        
        // Clean up the payment reference since STK push failed
        console.log("🧹 Cleaning up payment reference due to STK failure...");
        await Order.updateOne(
          { _id: orderId, "suborders._id": suborderId },
          { $unset: { "suborders.$.deliveryDetails.deliveryFeePaymentRef": "" } }
        );
        
        return NextResponse.json({
          success: false,
          error: stkResponse.data.ResponseDescription || "Failed to initiate payment"
        }, { status: 500 });
      }

    } catch (mpesaError: any) {
      console.error("❌ M-PESA API Error:", {
        message: mpesaError.message,
        response: mpesaError.response?.data,
        status: mpesaError.response?.status
      });

      // Clean up the payment reference since M-PESA request failed
      console.log("🧹 Cleaning up payment reference due to M-PESA error...");
      await Order.updateOne(
        { _id: orderId, "suborders._id": suborderId },
        { $unset: { "suborders.$.deliveryDetails.deliveryFeePaymentRef": "" } }
      );

      return NextResponse.json({
        success: false,
        error: mpesaError.response?.data?.errorMessage || "Failed to process payment. Please try again."
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("❌ Delivery Fee Payment Error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    return NextResponse.json({
      success: false,
      error: error.response?.data?.errorMessage || error.message || "Payment failed. Please try again."
    }, { status: 500 });
  }
}