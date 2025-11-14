/*import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, amount, planId } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, error: "Phone and amount required" },
        { status: 400 }
      );
    }

    // ✅ Sanitize phone (convert to 2547XXXXXXXX format)
    let sanitizedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");

    // 1️⃣ Generate OAuth token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const access_token = tokenResponse.data.access_token;

    // 2️⃣ Generate STK password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 3️⃣ Send STK Push request
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
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: planId || "Subscription",
        TransactionDesc: "Subscription Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ STK Push Response:", stkResponse.data);

    return NextResponse.json({
      success: true,
      message: "STK Push initiated. Check your phone for the prompt.",
      response: stkResponse.data,
    });
  } catch (error: any) {
    console.error("❌ STK Push Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}*/

import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
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
    const { phone, amount, planId } = body;

    if (!phone || !amount || !planId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

    // 1️⃣ Send STK push
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
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: planId,
        TransactionDesc: "Subscription Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ STK Push Response:", stkResponse.data);

    // 2️⃣ Save FIRST LOG – STK Request
    const paymentRecord = await Payment.create({
      userId,
      planId,
      phone: sanitizedPhone,
      amount,
      status: "PENDING",
      stkRequest: stkResponse.data,
    });

    return NextResponse.json({
      success: true,
      message: "STK Push initiated. Check your phone.",
      paymentId: paymentRecord._id,
    });
  } catch (error: any) {
    console.error("❌ STK Push Error:", error.response?.data || error.message);

    return NextResponse.json(
      { success: false, error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

