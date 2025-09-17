/*import axios from "axios";

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
registerC2BUrls();*/

import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;
const MPESA_VALIDATION_URL = process.env.MPESA_VALIDATION_URL!;
const MPESA_CONFIRMATION_URL = process.env.MPESA_CONFIRMATION_URL!;
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
}

async function registerC2BUrls() {
  try {
    const token = await getAccessToken();

    const payload = {
      ShortCode: MPESA_SHORTCODE,
      ResponseType: "Completed",  // Always use Completed for instant confirmation
      ConfirmationURL: MPESA_CONFIRMATION_URL,
      ValidationURL: MPESA_VALIDATION_URL
    };

    const res = await axios.post(`${MPESA_BASE_URL}/mpesa/c2b/v2/registerurl`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("[SUCCESS] ✅ C2B URLs registered:", res.data);

  } catch (err: any) {
    const data = err.response?.data || err.message;
    console.error("[FAILURE] ❌ Registration failed:", data);

    // Log the URLs you want Safaricom to use
    console.log("[INFO] 🔗 Target URLs you want:", {
      ConfirmationURL: MPESA_CONFIRMATION_URL,
      ValidationURL: MPESA_VALIDATION_URL
    });
  }
}

// Run the script on your production server
registerC2BUrls();
