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
import axios from 'axios';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '';
const MPESA_BASE_URL = 'https://api.safaricom.co.ke'; 
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || process.env.NEXTAUTH_URL;

/**
 * 🔑 Get M-Pesa access token
 */
export async function getMpesaAccessToken(): Promise<string> {
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
}

/**
 * 📌 Register C2B URLs (Validation + Confirmation)
 * Run this once when deploying your app or updating URLs
 */
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
 */
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
 */
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

