// lib/mpesaUtils.ts
/*import axios from 'axios';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '';
//const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || `${process.env.NEXTAUTH_URL}/api/mpesa/callback`;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || process.env.NEXTAUTH_URL;


/**
 * 🔑 Get M-Pesa access token
 *
export async function getMpesaAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('[FAILURE] Error getting M-Pesa access token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
}

/**
 * 📌 Register C2B URLs (Validation + Confirmation)
 * Run this once when deploying your app or updating URLs
 *
export async function registerC2BUrls() {
  try {
    const accessToken = await getMpesaAccessToken();

    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl',
      {
        ShortCode: MPESA_SHORTCODE,
        ResponseType: 'Completed',
        ConfirmationURL: `${MPESA_CALLBACK_URL}/api/mpesa/confirmation`,
        ValidationURL: `${MPESA_CALLBACK_URL}/api/mpesa/validation`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[SUCCESS] C2B URLs registered:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FAILURE] Error registering C2B URLs:', error.response?.data || error.message);
    throw new Error('Failed to register C2B URLs');
  }
}

/**
 * 🔎 Validate Payment (M-Pesa calls this first when a customer pays)
 *
export function validatePayment(body: any) {
  console.log('[INFO] Payment validation request:', body);

  // Business rules can be added here (e.g. reject if wrong BillRefNumber)
  return {
    ResultCode: 0,
    ResultDesc: 'Accepted',
  };
}

/**
 * ✅ Confirm Payment (M-Pesa calls this after successful payment)
 *
export function confirmPayment(body: any) {
  console.log('[INFO] Payment confirmation received:', body);

  const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

  return {
    transactionId: TransID,
    amount: TransAmount,
    phone: MSISDN,
    accountRef: BillRefNumber, // your internal order reference
  };
}*/

// lib/mpesaUtils.ts











/*import axios from 'axios';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '';
const MPESA_BASE_URL = 'https://api.safaricom.co.ke'; 
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || process.env.NEXTAUTH_URL;

/**
 * 🔑 Get M-Pesa access token
 */
/*export async function getMpesaAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('[FAILURE] Error getting M-Pesa access token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
}*

export async function getMpesaAccessToken(): Promise<string> {
  try {
    const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
    const auth = Buffer.from(rawAuth).toString('base64');

    console.log("[DEBUG] Requesting token from:", `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`);
    console.log("[DEBUG] Using key prefix:", MPESA_CONSUMER_KEY.slice(0, 5), "..."); 
    console.log("[DEBUG] Using secret prefix:", MPESA_CONSUMER_SECRET.slice(0, 5), "...");

    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('[FAILURE] Error getting M-Pesa access token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
}


/**
 * 📌 Register C2B URLs (Validation + Confirmation)
 * Run this once when deploying your app or updating URLs
 *
export async function registerC2BUrls() {
  try {
    const accessToken = await getMpesaAccessToken();

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      {
        ShortCode: MPESA_SHORTCODE,
        ResponseType: 'Completed',
        ConfirmationURL: `${MPESA_CALLBACK_URL}/api/mpesa/confirmation`,
        ValidationURL: `${MPESA_CALLBACK_URL}/api/mpesa/validation`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[SUCCESS] C2B URLs registered:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[FAILURE] Error registering C2B URLs:', error.response?.data || error.message);
    throw new Error('Failed to register C2B URLs');
  }
}

/**
 * 🔎 Validate Payment (M-Pesa calls this first when a customer pays)
 *
export function validatePayment(body: any) {
  console.log('[INFO] Payment validation request:', body);

  // Add your order validation logic here if needed
  return {
    ResultCode: 0,
    ResultDesc: 'Accepted',
  };
}

/**
 * ✅ Confirm Payment (M-Pesa calls this after successful payment)
 *
export function confirmPayment(body: any) {
  console.log('[INFO] Payment confirmation received:', body);

  const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

  return {
    transactionId: TransID,
    amount: TransAmount,
    phone: MSISDN,
    accountRef: BillRefNumber,
  };
}
*/







/*import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

let MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || process.env.NEXTAUTH_URL || "";
// Remove trailing slash if present
if (MPESA_CALLBACK_URL.endsWith("/")) {
  MPESA_CALLBACK_URL = MPESA_CALLBACK_URL.slice(0, -1);
}

/**
 * 🔑 Get M-Pesa access token
 *
export async function getMpesaAccessToken(): Promise<string> {
  // Check if credentials exist
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error("M-Pesa Consumer Key or Secret is missing!");
  }
  console.log("[DEBUG] Consumer Key & Secret present ✅");

  const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const auth = Buffer.from(rawAuth).toString("base64");
  console.log("[DEBUG] Base64 Auth:", auth);

  try {
    console.log("[DEBUG] Requesting token from:", `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`);
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
    return accessToken;
  } catch (error: any) {
    console.error("[FAILURE] Error getting M-Pesa access token:", error.response?.data || error.message);
    throw new Error("Failed to get M-Pesa access token");
  }
}

/**
 * 📌 Register C2B URLs (Validation + Confirmation)
 * Run this once when deploying your app or updating URLs
 *
export async function registerC2BUrls(retry = true) {
  if (!MPESA_SHORTCODE) {
    throw new Error("M-Pesa Shortcode is missing!");
  }

  try {
    const accessToken = await getMpesaAccessToken();

    const payload = {
      ShortCode: MPESA_SHORTCODE,
      ResponseType: "Completed",
      ConfirmationURL: `${MPESA_CALLBACK_URL}/api/mpesa/confirmation`,
      ValidationURL: `${MPESA_CALLBACK_URL}/api/mpesa/validation`,
    };
    console.log("[DEBUG] Register URL payload:", payload);

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[SUCCESS] C2B URLs registered ✅", response.data);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const data = error.response?.data;

    console.error("[FAILURE] Error registering C2B URLs:", data || error.message);

    // 🔄 Retry once if token is invalid
    if (status === 401 && retry) {
      console.warn("[RETRY] Token might be invalid/expired, refreshing...");
      return await registerC2BUrls(false);
    }

    throw new Error("Failed to register C2B URLs");
  }
}

/**
 * 🔎 Validate Payment (M-Pesa calls this first when a customer pays)
 *
export function validatePayment(body: any) {
  console.log("[INFO] Payment validation request:", body);

  return {
    ResultCode: 0,
    ResultDesc: "Accepted",
  };
}

/**
 * ✅ Confirm Payment (M-Pesa calls this after successful payment)
 *
export function confirmPayment(body: any) {
  console.log("[INFO] Payment confirmation received:", body);

  const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

  return {
    transactionId: TransID,
    amount: TransAmount,
    phone: MSISDN,
    accountRef: BillRefNumber,
  };
}*/

/*import axios from "axios";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

let MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || process.env.NEXTAUTH_URL || "";
if (MPESA_CALLBACK_URL.endsWith("/")) {
  MPESA_CALLBACK_URL = MPESA_CALLBACK_URL.slice(0, -1);
}

/**
 * 🔑 Get M-Pesa access token
 *
export async function getMpesaAccessToken(): Promise<string> {
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error("M-Pesa Consumer Key or Secret is missing!");
  }

  const rawAuth = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const auth = Buffer.from(rawAuth).toString("base64");

  try {
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const accessToken = response.data.access_token;
    if (!accessToken) throw new Error("Access token is empty!");
    console.log("[SUCCESS] Access token generated ✅");
    return accessToken;
  } catch (error: any) {
    console.error(
      "[FAILURE] Error getting M-Pesa access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get M-Pesa access token");
  }
}

/**
 * ✅ Handle C2B v2 Payment Notification (Webhook)
 * Perform validation here before confirming payment in your system
 *
export async function handleC2Bv2Payment(body: any) {
  console.log("[INFO] C2B v2 payment received:", body);

  const { TransactionID, TransAmount, MSISDN, BillRefNumber } = body;

  // --- Example validation ---
  if (!TransactionID || !TransAmount || !MSISDN) {
    console.warn("[VALIDATION FAIL] Missing critical payment fields", body);
    return { ResultCode: 1, ResultDesc: "Invalid payment data" };
  }

  // Example: check if order exists in DB
  const orderExists = await checkOrderInDB(BillRefNumber);
  if (!orderExists) {
    console.warn("[VALIDATION FAIL] Order not found:", BillRefNumber);
    return { ResultCode: 1, ResultDesc: "Order not found" };
  }

  // Confirm payment in your system
  await confirmPaymentInDB({
    transactionId: TransactionID,
    amount: TransAmount,
    phone: MSISDN,
    accountRef: BillRefNumber,
  });

  console.log("[SUCCESS] Payment validated and confirmed ✅", TransactionID);

  return { ResultCode: 0, ResultDesc: "Accepted" };
}

/**
 * Dummy function: replace with real DB check
 *
async function checkOrderInDB(billRef: string) {
  // e.g., Order.findOne({ reference: billRef })
  return true;
}

/**
 * Dummy function: replace with real DB update
 *
async function confirmPaymentInDB(data: any) {
  // e.g., update order status to "paid"
  return true;
}*/


import axios from "axios";

// ===== ENVIRONMENT CONFIGURATION =====
const ENV = process.env.NODE_ENV || "development"; // "production" or "development"

const CONFIG = ENV === "production"
  ? {
      BASE_URL: process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke",
      CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || "",
      CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || "",
      SHORTCODE: process.env.MPESA_SHORTCODE || "", // Live shortcode
      CALLBACK_URL: process.env.MPESA_CALLBACK_URL || "",
    }
  : {
      BASE_URL: "https://sandbox.safaricom.co.ke",
      CONSUMER_KEY: process.env.MPESA_SANDBOX_KEY || "",
      CONSUMER_SECRET: process.env.MPESA_SANDBOX_SECRET || "",
      SHORTCODE: process.env.MPESA_SANDBOX_SHORTCODE || "600000", // Sandbox shortcode
      CALLBACK_URL: process.env.MPESA_SANDBOX_CALLBACK_URL || "https://example.com/callback",
    };

// ===== UTILS =====

// Get Access Token
export async function getMpesaAccessToken(): Promise<string> {
  if (!CONFIG.CONSUMER_KEY || !CONFIG.CONSUMER_SECRET) {
    throw new Error("M-Pesa Consumer Key or Secret is missing!");
  }

  const auth = Buffer.from(`${CONFIG.CONSUMER_KEY}:${CONFIG.CONSUMER_SECRET}`).toString("base64");
  console.log("[DEBUG] Requesting token with Base64 auth:", auth);

  try {
    const response = await axios.get(`${CONFIG.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    console.log("[SUCCESS] Access token received:", response.data.access_token);
    return response.data.access_token;
  } catch (err: any) {
    console.error("[FAILURE] Could not generate token:", err.response?.data || err.message);
    throw err;
  }
}

// Register C2B URLs
export async function registerC2BUrls() {
  if (!CONFIG.SHORTCODE || !CONFIG.CALLBACK_URL) {
    throw new Error("Shortcode or Callback URL missing!");
  }

  const token = await getMpesaAccessToken();
  const payload = {
    ShortCode: CONFIG.SHORTCODE,
    ResponseType: "Completed",
    ConfirmationURL: `${CONFIG.CALLBACK_URL}/api/mpesa/confirmation`,
    ValidationURL: `${CONFIG.CALLBACK_URL}/api/mpesa/validation`,
  };

  console.log("[DEBUG] Register URL payload:", payload);

  try {
    const response = await axios.post(`${CONFIG.BASE_URL}/mpesa/c2b/v2/registerurl`, payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    console.log("[SUCCESS] C2B URLs registered:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("[FAILURE] Registration failed:", err.response?.data || err.message);
    if (err.response?.data?.errorCode === "401.003.01") {
      console.error("[HINT] Invalid token or shortcode mismatch. Check environment & credentials.");
    }
    throw err;
  }
}
