import axios from "axios";
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
}
