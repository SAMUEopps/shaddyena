import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import BalanceLog from '@/shd-models/models/BalanceLog';


const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const BASE_URL = process.env.MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken() {
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
        timeout: 10000,
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + 3500 * 1000;
    return accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get the token
    const token = await getAccessToken();

    // Get the base URL for webhooks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Prepare the balance query payload
    const payload = {
      CommandID: 'AccountBalance',
      PartyA: SHORTCODE,
      IdentifierType: '4',
      Remarks: 'Balance Query',
      QueueTimeOutURL: `${baseUrl}/api/mpesa/balance-timeout`,
      ResultURL: `${baseUrl}/api/mpesa/balance-result`, // This will go to your callback system
    };

    console.log('📊 Balance Query Payload:', payload);

    // Make the API call
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

    console.log('📊 Balance Query Response:', response.data);

    // Log the transaction
    await BalanceLog.create({
      shortcode: SHORTCODE,
      conversationID: response.data.ConversationID,
      originatorConversationID: response.data.OriginatorConversationID,
      status: 'PROCESSING',
      timestamp: new Date(),
    });

    // Return the response
    return NextResponse.json({
      success: true,
      data: response.data,
      message: 'Balance query initiated. Waiting for response...',
      conversationId: response.data.ConversationID,
    });

  } catch (error: any) {
    console.error('❌ Balance query failed:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Log the error
    try {
      await connectToDatabase();
      await BalanceLog.create({
        shortcode: SHORTCODE,
        status: 'FAILED',
        error: error.message,
        resultDesc: error.response?.data?.errorMessage || error.message,
        timestamp: new Date(),
      });
    } catch (logError) {
      console.error('Failed to log transaction:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: error.response?.data || error.message,
        details: error.response?.data,
      },
      { status: error.response?.status || 500 }
    );
  }
}