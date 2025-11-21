import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import OrderDraft from "@/models/OrderDraft";
import { verify } from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Extract JWT from cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Decode JWT
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Get POST data
    const body = await request.json();
    const { phone, amount, orderRef } = body;

    if (!phone || !amount || !orderRef) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find order draft
    const orderDraft = await OrderDraft.findOne({ 
      shortRef: orderRef,
      buyerId: userId 
    });

    if (!orderDraft) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order is expired
    if (new Date() > orderDraft.expiresAt) {
      return NextResponse.json(
        { success: false, error: "Order has expired. Please create a new order." },
        { status: 400 }
      );
    }

    // Format phone to 2547XXXXXXXX
    let sanitizedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");

    // Generate OAuth token
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

    // Send STK push
    const stkResponse = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: sanitizedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: sanitizedPhone,
        CallBackURL: `${process.env.MPESA_CALLBACK_URL}/orders`,
        AccountReference: orderRef,
        TransactionDesc: "Order Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Order STK Push Response:", stkResponse.data);

    // Update order draft with STK request data
    await OrderDraft.findByIdAndUpdate(orderDraft._id, {
      stkRequest: stkResponse.data,
      paymentPhone: sanitizedPhone,
      status: "PENDING_PAYMENT"
    });

    return NextResponse.json({
      success: true,
      message: "STK Push initiated. Check your phone.",
      orderId: orderDraft._id,
    });
  } catch (error: any) {
    console.error("❌ Order STK Push Error:", error.response?.data || error.message);

    return NextResponse.json(
      { success: false, error: error.response?.data?.errorMessage || "Payment failed. Please try again." },
      { status: 500 }
    );
  }
}