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
}