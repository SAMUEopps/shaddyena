import { processB2CPayment } from '@/shd-lib/lib/mpesa';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      phoneNumber, 
      amount, 
      commandId = 'BusinessPayment', 
      remarks = 'Test B2C Payment',
      occasion = 'Test Transaction'
    } = body;

    // Validate required fields
    if (!phoneNumber) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Phone number is required' 
        },
        { status: 400 }
      );
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid amount is required' 
        },
        { status: 400 }
      );
    }

    // Validate command ID
    const validCommands = ['BusinessPayment', 'SalaryPayment', 'PromotionPayment'];
    if (!validCommands.includes(commandId)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid command ID. Must be BusinessPayment, SalaryPayment, or PromotionPayment' 
        },
        { status: 400 }
      );
    }

    // Process B2C payment
    const result = await processB2CPayment(
      phoneNumber,
      parseFloat(amount),
      commandId as 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment',
      remarks,
      occasion
    );

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'B2C payment initiated successfully',
      data: result,
      metadata: {
        phoneNumber,
        amount: parseFloat(amount),
        commandId,
        remarks,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('B2C Test API Error:', error);

    // Handle different error types
    let errorMessage = 'An error occurred while processing the payment';
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.errorMessage || 
                     error.response.data?.message || 
                     'M-Pesa API error';
      statusCode = error.response.status || 500;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from M-Pesa API. Please check your network connection.';
      statusCode = 503;
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'Internal server error';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: statusCode }
    );
  }
}