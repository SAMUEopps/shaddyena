// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import BalanceLog from '@/shd-models/models/BalanceLog';


// const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
// const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
// const SHORTCODE = process.env.MPESA_SHORTCODE;
// const BASE_URL = process.env.MPESA_ENV === 'production' 
//   ? 'https://api.safaricom.co.ke' 
//   : 'https://sandbox.safaricom.co.ke';

// let accessToken: string | null = null;
// let tokenExpiry: number = 0;

// async function getAccessToken() {
//   if (accessToken && Date.now() < tokenExpiry) {
//     return accessToken;
//   }

//   try {
//     const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
//     const response = await axios.get(
//       `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//         },
//         timeout: 10000,
//       }
//     );

//     accessToken = response.data.access_token;
//     tokenExpiry = Date.now() + 3500 * 1000;
//     return accessToken;
//   } catch (error) {
//     console.error('Failed to get access token:', error);
//     throw error;
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     await connectToDatabase();

//     // Get the token
//     const token = await getAccessToken();

//     // Get the base URL for webhooks
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

//     // Prepare the balance query payload
//     const payload = {
//       CommandID: 'AccountBalance',
//       PartyA: SHORTCODE,
//       IdentifierType: '4',
//       Remarks: 'Balance Query',
//       QueueTimeOutURL: `${baseUrl}/api/shd-api/api/mpesa/balance-timeout`,
//       ResultURL: `${baseUrl}/api/shd-api/api/mpesa/balance-result`, // This will go to your callback system
//     };

//     console.log('📊 Balance Query Payload:', payload);

//     // Make the API call
//     const response = await axios.post(
//       `${BASE_URL}/mpesa/accountbalance/v1/query`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 30000,
//       }
//     );

//     console.log('📊 Balance Query Response:', response.data);

//     // Log the transaction
//     await BalanceLog.create({
//       shortcode: SHORTCODE,
//       conversationID: response.data.ConversationID,
//       originatorConversationID: response.data.OriginatorConversationID,
//       status: 'PROCESSING',
//       timestamp: new Date(),
//     });

//     // Return the response
//     return NextResponse.json({
//       success: true,
//       data: response.data,
//       message: 'Balance query initiated. Waiting for response...',
//       conversationId: response.data.ConversationID,
//     });

//   } catch (error: any) {
//     console.error('❌ Balance query failed:', {
//       error: error.message,
//       response: error.response?.data,
//       status: error.response?.status,
//     });

//     // Log the error
//     try {
//       await connectToDatabase();
//       await BalanceLog.create({
//         shortcode: SHORTCODE,
//         status: 'FAILED',
//         error: error.message,
//         resultDesc: error.response?.data?.errorMessage || error.message,
//         timestamp: new Date(),
//       });
//     } catch (logError) {
//       console.error('Failed to log transaction:', logError);
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.response?.data || error.message,
//         details: error.response?.data,
//       },
//       { status: error.response?.status || 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import BalanceLog from '@/shd-models/models/BalanceLog';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;

const INITIATOR_NAME = process.env.MPESA_INITIATOR_NAME;
const SECURITY_CREDENTIAL = process.env.MPESA_SECURITY_CREDENTIAL;

const SHORTCODE = process.env.MPESA_SHORTCODE;

const BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

let accessToken: string | null = null;
let tokenExpiry = 0;

function validateMpesaConfig() {
  const missing: string[] = [];

  if (!CONSUMER_KEY) missing.push('MPESA_CONSUMER_KEY');
  if (!CONSUMER_SECRET) missing.push('MPESA_CONSUMER_SECRET');
  if (!INITIATOR_NAME) missing.push('MPESA_INITIATOR_NAME');
  if (!SECURITY_CREDENTIAL) {
    missing.push('MPESA_SECURITY_CREDENTIAL');
  }
  if (!SHORTCODE) missing.push('MPESA_SHORTCODE');

  if (missing.length > 0) {
    throw new Error(
      `Missing M-Pesa environment variables: ${missing.join(', ')}`
    );
  }
}

// async function getAccessToken(): Promise<string> {
//   if (accessToken && Date.now() < tokenExpiry) {
//     return accessToken;
//   }

//   if (!CONSUMER_KEY || !CONSUMER_SECRET) {
//     throw new Error(
//       'MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET are required'
//     );
//   }

//   try {
//     const auth = Buffer.from(
//       `${CONSUMER_KEY}:${CONSUMER_SECRET}`
//     ).toString('base64');

//     const response = await axios.get(
//       `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//         },
//         timeout: 10000,
//       }
//     );

//     accessToken = response.data.access_token;

//     // Keep a small safety margin before expiry
//     tokenExpiry = Date.now() + 3500 * 1000;

//     return accessToken;
//   } catch (error) {
//     console.error('Failed to get M-Pesa access token:', error);
//     throw error;
//   }
// }

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(
      'MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET are required'
    );
  }

  try {
    const auth = Buffer.from(
      `${CONSUMER_KEY}:${CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 10000,
      }
    );

    const newToken = response.data?.access_token;

    if (!newToken || typeof newToken !== 'string') {
      throw new Error(
        'M-Pesa OAuth response did not contain a valid access token'
      );
    }

    accessToken = newToken;

    // Keep a small safety margin before expiry
    tokenExpiry = Date.now() + 3500 * 1000;

    return newToken;
  } catch (error) {
    console.error(
      'Failed to get M-Pesa access token:',
      error
    );

    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Validate environment configuration
    validateMpesaConfig();

    // Get OAuth token
    const token = await getAccessToken();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000';

    const payload = {
      Initiator: INITIATOR_NAME,
      SecurityCredential: SECURITY_CREDENTIAL,
      CommandID: 'AccountBalance',
      PartyA: SHORTCODE,
      IdentifierType: '4',
      Remarks: 'Balance Query',
      QueueTimeOutURL:
        `${baseUrl}/api/shd-api/api/mpesa/balance-timeout`,
      ResultURL:
        `${baseUrl}/api/shd-api/api/mpesa/balance-result`,
    };

    // NEVER log the actual security credential
    console.log('📊 Balance Query Payload:', {
      ...payload,
      SecurityCredential: '[REDACTED]',
    });

    const response = await axios.post(
      `${BASE_URL}/mpesa/accountbalance/v1/query`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log(
      '📊 Balance Query Response:',
      response.data
    );

    // Save query transaction
    await BalanceLog.create({
      shortcode: SHORTCODE,
      conversationID: response.data.ConversationID,
      originatorConversationID:
        response.data.OriginatorConversationID,
      status: 'PROCESSING',
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: response.data,
      message:
        'Balance query initiated. Waiting for response...',
      conversationId: response.data.ConversationID,
    });

  } catch (error: any) {
    console.error('❌ Balance query failed:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Try to log the failed request
    try {
      await connectToDatabase();

      await BalanceLog.create({
        shortcode: SHORTCODE,
        status: 'FAILED',
        error: error.message,
        resultDesc:
          error.response?.data?.errorMessage ||
          error.message,
        timestamp: new Date(),
      });
    } catch (logError) {
      console.error(
        'Failed to log transaction:',
        logError
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data ||
          error.message,
        details: error.response?.data,
      },
      {
        status:
          error.response?.status || 500,
      }
    );
  }
}