// api/payments/subscription
/*import { NextResponse } from "next/server";
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
}*/

import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/user";
import { verify } from "jsonwebtoken";
import VendorSubscription from "@/models/VendorSubscription";

/*export async function POST(request: Request) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    const { phone, amount, planId } = await request.json();
    if (!phone || !amount || !planId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const sanitizedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");

    // 🔍 Find vendor + referrer
    const vendor = await User.findById(userId).select("referredBy");
    let referrerId = null;

    if (vendor?.referredBy) {
      const referrer = await User.findOne({
        referralCode: vendor.referredBy,
      }).select("_id");

      if (referrer) referrerId = referrer._id;
    }

    // 🔐 M-Pesa OAuth
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const access_token = tokenResponse.data.access_token;

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 📲 STK Push
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

    // 🧾 Create PENDING payment (accounting-ready)
    const payment = await Payment.create({
      userId,
      referrerId,
      planId,
      phone: sanitizedPhone,
      amount,
      status: "PENDING",
      stkRequest: stkResponse.data,
    });

    return NextResponse.json({
      success: true,
      paymentId: payment._id,
      message: "STK Push sent",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}*/


// app/api/payments/subscription/route.ts (update the POST handler)
export async function POST(request: Request) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    const { phone, amount, planId } = await request.json();
    if (!phone || !amount || !planId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const sanitizedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");

    // Find vendor + referrer
    const vendor = await User.findById(userId).select("referredBy");
    let referrerId = null;

    if (vendor?.referredBy) {
      const referrer = await User.findOne({
        referralCode: vendor.referredBy,
      }).select("_id");

      if (referrer) referrerId = referrer._id;
    }

    // Create payment record FIRST
    const payment = await Payment.create({
      userId,
      referrerId,
      planId,
      phone: sanitizedPhone,
      amount,
      status: "PENDING",
    });


    // app/api/payments/subscription/route.ts (add this to your existing payment POST)
    // After creating the payment, also create a pending subscription record

    // Add this after creating the payment:
    const pendingSubscription = await VendorSubscription.findOneAndUpdate(
      { vendorId: userId },
      {
        vendorId: userId,
        status: 'pending',
        paymentId: payment._id,
        $push: {
          paymentHistory: {
            paymentId: payment._id,
            planId: planId,
            amount: amount,
            paidAt: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        }
      },
      { upsert: true, new: true }
    );

    // Use payment._id as the reference for M-Pesa
    const accountReference = `SUB-${payment._id}-${userId}`;
    
    console.log(`📝 Created payment record: ${payment._id}`);
    console.log(`📱 Account Reference: ${accountReference}`);

    // M-Pesa OAuth
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const access_token = tokenResponse.data.access_token;

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // STK Push with the account reference
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
        AccountReference: accountReference, // Important: Use the formatted reference
        TransactionDesc: "Subscription Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update payment with STK request
    payment.stkRequest = stkResponse.data;
    await payment.save();

    return NextResponse.json({
      success: true,
      paymentId: payment._id,
      message: "STK Push sent",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
