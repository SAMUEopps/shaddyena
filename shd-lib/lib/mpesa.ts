import axios from 'axios';
import crypto from 'crypto';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const BASE_URL = process.env.MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + 3500 * 1000; // 3500 seconds
    return accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
}

export async function initSTKPush(phoneNumber: string, amount: number, accountReference: string) {
  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
        AccountReference: accountReference,
        TransactionDesc: 'Shaddyna Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('STK Push failed:', error);
    throw error;
  }
}

export async function queryTransactionStatus(checkoutRequestId: string) {
  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Transaction status query failed:', error);
    throw error;
  }
}

/*export async function processB2CPayment(
  phoneNumber: string,
  amount: number,
  commandId: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment',
  remarks: string,
  occasion?: string
) {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/mpesa/b2c/v3/paymentrequest`,
      {
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: commandId,
        Amount: Math.round(amount),
        PartyA: SHORTCODE,
        PartyB: phoneNumber,
        Remarks: remarks,
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/timeout`,
        ResultURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/result`,
        Occasion: occasion || 'Shaddyna Payout',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('B2C payment failed:', error);
    throw error;
  }
}*/

export async function processB2CPayment(
  phoneNumber: string,
  amount: number,
  commandId: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment',
  remarks: string,
  occasion?: string
) {
  try {
    const token = await getAccessToken();

    const originatorConversationID =
      `SHAD_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Format phone number
    const formattedPhone =
      phoneNumber.startsWith('0')
        ? `254${phoneNumber.substring(1)}`
        : phoneNumber;


    const payload = {
      OriginatorConversationID: originatorConversationID,

      InitiatorName: process.env.MPESA_INITIATOR_NAME,

      SecurityCredential:
        process.env.MPESA_SECURITY_CREDENTIAL,

      CommandID: commandId,

      Amount: Math.round(amount),

      PartyA: SHORTCODE,

      PartyB: formattedPhone,

      Remarks: remarks,

      QueueTimeOutURL:
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/timeout`,

      ResultURL:
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/result`,

      Occasion: occasion || 'Shaddyna Vendor Payout'
    };


    console.log("B2C Payload:", {
      ...payload,
      SecurityCredential: "HIDDEN"
    });


    const response = await axios.post(
      `${BASE_URL}/mpesa/b2c/v3/paymentrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );


    return response.data;


  } catch (error:any) {

    console.error(
      "B2C payment failed:",
      error.response?.data || error.message
    );

    throw error;
  }
}

export async function processB2BPayment(
  businessNumber: string,
  accountNumber: string,
  amount: number,
  commandId: 'BusinessPayBill' | 'BusinessBuyGoods'
) {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/mpesa/b2b/v3/paymentrequest`,
      {
        Initiator: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: commandId,
        SenderIdentifierType: 'Shortcode',
        RecieverIdentifierType: 'Shortcode',
        Amount: Math.round(amount),
        PartyA: SHORTCODE,
        PartyB: businessNumber,
        AccountReference: accountNumber,
        Remarks: 'Shaddyna Payout',
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/timeout`,
        ResultURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payouts/result`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('B2B payment failed:', error);
    throw error;
  }
}

export async function getAccountBalance() {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/mpesa/accountbalance/v1/query`,
      {
        CommandID: 'AccountBalance',
        PartyA: SHORTCODE,
        IdentifierType: '4',
        Remarks: 'Check balance',
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/balance-timeout`,
        ResultURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/balance-result`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Account balance query failed:', error);
    throw error;
  }
}