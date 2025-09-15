/*import axios from 'axios';
import crypto from 'crypto';

// M-Pesa configuration
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || '';
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || `${process.env.NEXTAUTH_URL}/api/mpesa/callback`;

// Generate access token
export async function getMpesaAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
}

// Generate security credential
export function generateSecurityCredential(): string {
  const password = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
  return crypto.createHash('md5').update(password).digest('hex');
}

// Initiate STK push
export async function initiateSTKPush(phoneNumber: string, amount: number, accountReference: string, description: string): Promise<any> {
  try {
    const accessToken = await getMpesaAccessToken();
    const securityCredential = generateSecurityCredential();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, -3);

    const requestData = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: securityCredential,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: description,
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error initiating STK push:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
}

// Check transaction status
export async function checkTransactionStatus(checkoutRequestID: string): Promise<any> {
  try {
    const accessToken = await getMpesaAccessToken();
    const securityCredential = generateSecurityCredential();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, -3);

    const requestData = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: securityCredential,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error checking transaction status:', error.response?.data || error.message);
    throw new Error('Failed to check transaction status');
  }
}*/

// lib/mpesaUtils.ts
import axios from 'axios';
import crypto from 'crypto';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || '';
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || `${process.env.NEXTAUTH_URL}/api/mpesa/callback`;

// Generate security credential
export function generateSecurityCredential(): string {
  const password = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
  return crypto.createHash('md5').update(password).digest('hex');
}

/**
 * 🔑 Get M-Pesa access token
 */
export async function getMpesaAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('[FAILURE] Error getting M-Pesa access token:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
}

/**
 * 📌 Register C2B URLs (Validation + Confirmation) with Safaricom
 * Should be called once during setup/deployment
 */
export async function registerC2BUrls() {
  try {
    const accessToken = await getMpesaAccessToken();

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
      {
        ShortCode: MPESA_SHORTCODE,
        ResponseType: 'Completed',
        ConfirmationURL: `${MPESA_CALLBACK_URL}/confirmation`,
        ValidationURL: `${MPESA_CALLBACK_URL}/validation`,
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
 * 🔎 Validate Payment (M-Pesa calls this when user initiates payment)
 */
export function validatePayment(body: any) {
  console.log('[INFO] Payment validation request:', body);

  // You can add logic here to reject payments that don’t match expected order refs or amounts
  return {
    ResultCode: 0,
    ResultDesc: 'Accepted',
  };
}

/**
 * ✅ Confirm Payment (M-Pesa calls this after payment is processed)
 */
export function confirmPayment(body: any) {
  console.log('[INFO] Payment confirmation received:', body);

  // Extract data
  const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

  return {
    transactionId: TransID,
    amount: TransAmount,
    phone: MSISDN,
    accountRef: BillRefNumber, // this should match our order ref
  };
}

export async function checkTransactionStatus(checkoutRequestID: string): Promise<any> {
  try {
    const accessToken = await getMpesaAccessToken();
    const securityCredential = generateSecurityCredential();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, -3);

    const requestData = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: securityCredential,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error checking transaction status:', error.response?.data || error.message);
    throw new Error('Failed to check transaction status');
  }
}