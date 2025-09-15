import axios from "axios";

// Environment variables
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "";
const MPESA_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// 1️⃣ Generate Access Token
async function getAccessToken(): Promise<string> {
  console.log("[INFO] Generating M-Pesa access token...");

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error("Missing M-Pesa consumer key or secret!");
  }

  const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const auth = Buffer.from(rawAuth).toString("base64");

  try {
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const token = response.data.access_token;
    if (!token) throw new Error("Access token is empty!");
    console.log("[SUCCESS] Access token generated:", token);
    return token;
  } catch (error: any) {
    console.error("[FAILURE] Could not generate access token:", error.response?.data || error.message);
    throw error;
  }
}

// 2️⃣ Register C2B URLs
async function registerC2BUrls() {
  console.log("[INFO] Starting C2B URL registration...");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Base URL:", MPESA_BASE_URL);
  console.log("Shortcode:", MPESA_SHORTCODE);
  console.log("Callback URL:", MPESA_CALLBACK_URL);

  if (!MPESA_SHORTCODE || !MPESA_CALLBACK_URL) {
    console.error("[ERROR] Shortcode or callback URL missing!");
    return;
  }

  try {
    const token = await getAccessToken();

    const payload = {
      ShortCode: MPESA_SHORTCODE,
      ResponseType: "Completed",
      ConfirmationURL: MPESA_CALLBACK_URL,
      ValidationURL: MPESA_CALLBACK_URL,
    };

    console.log("[DEBUG] Registration payload:", payload);

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      payload,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    console.log("[SUCCESS] C2B URLs registered:", response.data);
  } catch (error: any) {
    console.error("[FAILURE] C2B registration failed:", error.response?.data || error.message);
  }
}

// Run registration
registerC2BUrls();
