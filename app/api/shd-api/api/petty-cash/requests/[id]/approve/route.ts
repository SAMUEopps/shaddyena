// app/api/petty-cash/requests/[id]/approve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Budget from '@/shd-models/models/Budget';
import Transaction from '@/shd-models/models/Transaction';
import { processB2CPayment } from '@/shd-lib/lib/mpesa';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: 'No token provided',
        status: 401
      };
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as {
      userId: string;
      role: string;
    };

    return {
      userId: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    return {
      error: 'Invalid token',
      status: 401
    };
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(req);

    if (auth.error) {
      return NextResponse.json(
        {
          success: false,
          error: auth.error
        },
        { status: auth.status }
      );
    }

    // Next.js 15+ dynamic route params
    const { id } = await params;

    await connectToDatabase();

    // Find the request
    const request = await ExpenseRequest.findById(id);

    if (!request) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found'
        },
        { status: 404 }
      );
    }

    if (
      request.status !== 'pending' &&
      request.status !== 'failed'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request is not pending or failed'
        },
        { status: 400 }
      );
    }

    // Get active budget
    const budget = await Budget.findOne({
      status: 'active',
      createdBy: auth.userId
    });

    if (!budget) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active budget found'
        },
        { status: 400 }
      );
    }

    // Check if budget has enough remaining amount
    if (request.totalAmount > budget.remainingAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient budget. Required: KES ${request.totalAmount.toFixed(
            2
          )}, Available: KES ${budget.remainingAmount.toFixed(2)}`
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 1. DEDUCT BUDGET FIRST
    // =========================================================

    budget.spentAmount =
      (budget.spentAmount || 0) + request.amount;

    budget.platformFees =
      (budget.platformFees || 0) + request.platformFee;

    budget.remainingAmount =
      budget.allocatedAmount -
      budget.spentAmount -
      budget.platformFees;

    if (budget.remainingAmount < 0) {
      budget.status = 'overdrawn';
    }

    await budget.save();

    // =========================================================
    // 2. UPDATE REQUEST TO PROCESSING
    // =========================================================

    const originatorConversationId =
      `SHAD_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    request.status = 'processing';

    request.approverId =
      new mongoose.Types.ObjectId(auth.userId);

    request.approvedAt = new Date();

    request.metadata = {
      ...request.metadata,
      approvedBy: auth.userId,
      approvedAt: new Date().toISOString(),
      budgetWasUpdated: true,
      originatorConversationId,
      processingStarted: new Date().toISOString()
    };

    await request.save();

    // =========================================================
    // 3. CREATE TRANSACTION AS PROCESSING
    // =========================================================

    const transaction = await Transaction.create({
      transactionId:
        `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,

      type: 'petty_cash_payout',

      status: 'processing',

      amount: request.amount,

      phoneNumber: request.recipientPhone,

      userId: new mongoose.Types.ObjectId(auth.userId),

      budgetId: budget._id,

      purpose:
        `Petty Cash Payout - ${request.description}`,

      metadata: {
        requestId: request._id,
        description: request.description,
        category: request.category,
        platformFee: request.platformFee,
        totalAmount: request.totalAmount,
        originatorConversationId,
        initiatedAt: new Date().toISOString()
      }
    });

    // =========================================================
    // 4. INITIATE B2C PAYMENT
    // =========================================================

    try {
      const b2cResult = await processB2CPayment(
        request.recipientPhone,
        request.amount,
        'BusinessPayment',
        `Petty Cash - ${request.description}`,
        `PC-${request._id.toString().slice(-8)}`
      );

      // =======================================================
      // B2C INITIATED SUCCESSFULLY
      // =======================================================

      if (
        b2cResult &&
        b2cResult.ResponseCode === '0'
      ) {
        const finalOriginatorConversationId =
          b2cResult.OriginatorConversationID ||
          originatorConversationId;

        // Update request
        request.metadata = {
          ...request.metadata,

          b2cInitiated: true,

          b2cResponse: b2cResult,

          conversationId:
            b2cResult.ConversationID,

          originatorConversationId:
            finalOriginatorConversationId
        };

        await request.save();

        // Update transaction
        transaction.metadata = {
          ...transaction.metadata,

          b2cInitiated: true,

          b2cResponse: b2cResult,

          conversationId:
            b2cResult.ConversationID,

          originatorConversationId:
            finalOriginatorConversationId
        };

        await transaction.save();

        return NextResponse.json({
          success: true,

          message:
            'B2C payment initiated. Waiting for confirmation from M-Pesa.',

          request,

          transaction,

          b2cResult
        });
      }

      // =======================================================
      // B2C INITIATION FAILED
      // =======================================================

      throw new Error(
        b2cResult?.ResponseDescription ||
        'B2C payment initiation failed'
      );

    } catch (b2cError: any) {
      console.error(
        'B2C Payment Error:',
        b2cError
      );

      // =======================================================
      // REVERT BUDGET
      // =======================================================

      budget.spentAmount = Math.max(
        0,
        (budget.spentAmount || 0) -
          request.amount
      );

      budget.platformFees = Math.max(
        0,
        (budget.platformFees || 0) -
          request.platformFee
      );

      budget.remainingAmount =
        budget.allocatedAmount -
        budget.spentAmount -
        budget.platformFees;

      if (budget.remainingAmount >= 0) {
        budget.status = 'active';
      }

      await budget.save();

      // =======================================================
      // UPDATE REQUEST AS FAILED
      // =======================================================

      request.status = 'failed';

      request.metadata = {
        ...request.metadata,

        b2cError:
          b2cError.message ||
          'B2C payment failed',

        failedAt:
          new Date().toISOString()
      };

      await request.save();

      // =======================================================
      // UPDATE TRANSACTION AS FAILED
      // =======================================================

      transaction.status = 'failed';

      transaction.errorMessage =
        b2cError.message ||
        'B2C payment failed';

      await transaction.save();

      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to process B2C payment. Please try again.',
          details: b2cError.message
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error(
      'Error approving request:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          'Internal server error'
      },
      { status: 500 }
    );
  }
}