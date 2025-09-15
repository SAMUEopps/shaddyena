import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "";
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

async function getAccessToken() {
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
      ConfirmationURL: MPESA_CALLBACK_URL,
      ValidationURL: MPESA_CALLBACK_URL,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("[SUCCESS] C2B URLs registered ✅", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[FAILURE] Registration failed:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("[FAILURE] Registration failed:", error.message);
    } else {
      console.error("[FAILURE] Registration failed:", error);
    }
  }
}

// Run the registration
registerC2BUrls();
