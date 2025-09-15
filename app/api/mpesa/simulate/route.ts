import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

export async function GET(req: NextRequest) {
  try {
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      return NextResponse.json(
        { success: false, message: "M-Pesa Consumer Key or Secret is missing!" },
        { status: 400 }
      );
    }

    const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
    const auth = Buffer.from(rawAuth).toString("base64");

    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const accessToken = response.data.access_token;

    if (!accessToken) {
      throw new Error("Access token is empty!");
    }

    console.log("[SUCCESS] Access token received ✅", accessToken);

    return NextResponse.json({
      success: true,
      message: "M-Pesa access token is working",
      accessToken,
    });
  } catch (error: any) {
    console.error("[FAILURE] Access token error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: "Failed to get M-Pesa access token", error: error.message },
      { status: 500 }
    );
  }
}
