/*import { NextRequest, NextResponse } from "next/server";
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
*/

/*import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "";
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const auth = Buffer.from(rawAuth).toString("base64");

  const response = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return response.data.access_token;
}

async function registerC2BUrls() {
  try {
    const token = await getAccessToken();

    const payload = {
      ShortCode: MPESA_SHORTCODE,
      ResponseType: "Completed", // Always Completed for production
      ConfirmationURL: MPESA_CALLBACK_URL,
      ValidationURL: MPESA_CALLBACK_URL,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v2/registerurl`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("[SUCCESS] C2B URLs registered ✅", response.data);
  } catch (error: any) {
    console.error("[FAILURE!!] Registration failed:", error.response?.data || error.message);
  }
}

// Run script
registerC2BUrls();*/

import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_VALIDATION_URL = process.env.MPESA_VALIDATION_URL || "";
const MPESA_CONFIRMATION_URL = process.env.MPESA_CONFIRMATION_URL || "";
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const auth = Buffer.from(rawAuth).toString("base64");

  const response = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return response.data.access_token;
}

async function registerC2BUrls() {
  try {
    const token = await getAccessToken();

    const payload = {
      ShortCode: MPESA_SHORTCODE,
      ResponseType: "Completed", 
      ConfirmationURL: MPESA_CONFIRMATION_URL,
      ValidationURL: MPESA_VALIDATION_URL,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v2/registerurl`, 
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("[SUCCESS] ✅ C2B URLs registered:", response.data);
  } catch (error: any) {
    const data = error.response?.data || error.message;

    console.error("[FAILURE!!] ❌ Registration failed:", data);

    if (data?.errorMessage?.includes("already registered")) {
      console.log("[INFO] 🔗 Already registered for shortcode:", MPESA_SHORTCODE);
      console.log("  ➤ ConfirmationURL:", MPESA_CONFIRMATION_URL);
      console.log("  ➤ ValidationURL:", MPESA_VALIDATION_URL);
    }
  }
}

// Run script
registerC2BUrls();
