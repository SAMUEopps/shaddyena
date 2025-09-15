const axios = require("axios");

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "";
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

async function getAccessToken() {
  console.log("[INFO] Requesting M-Pesa access token...");
  console.log("MPESA_CONSUMER_KEY:", MPESA_CONSUMER_KEY);
  console.log("MPESA_CONSUMER_SECRET:", MPESA_CONSUMER_SECRET ? "****" : "MISSING");
  console.log("MPESA_BASE_URL:", MPESA_BASE_URL);

  const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const auth = Buffer.from(rawAuth).toString("base64");

  try {
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const token = response.data.access_token;
    console.log("[SUCCESS] Access token received ✅", token);
    return token;
  } catch (error) {
    console.error("[FAILURE] Error getting access token:", error.response?.data || error.message);
    throw new Error("Failed to get M-Pesa access token");
  }
}

async function registerC2BUrls() {
  console.log("[INFO] Starting C2B URL registration...");
  console.log("MPESA_SHORTCODE:", MPESA_SHORTCODE);
  console.log("MPESA_CALLBACK_URL:", MPESA_CALLBACK_URL);

  try {
    const token = await getAccessToken();

    const payload = {
      ShortCode: MPESA_SHORTCODE,
      ResponseType: "Completed",
      ConfirmationURL: MPESA_CALLBACK_URL,
      ValidationURL: MPESA_CALLBACK_URL,
    };

    console.log("[INFO] Registration payload:", payload);

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("[SUCCESS] C2B URLs registered ✅", response.data);
  } catch (error) {
    if (error.response) {
      console.error("[FAILURE] Registration failed:", error.response.data || error.message);
    } else {
      console.error("[FAILURE] Registration failed:", error.message || error);
    }
  }
}

// Run the registration
registerC2BUrls();
