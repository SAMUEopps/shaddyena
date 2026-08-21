// app/api/petty-cash/requests/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';
import Budget from '@/shd-models/models/Budget';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await connectToDatabase();

    const request = await ExpenseRequest.findById(params.id);

    if (!request) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    if (request.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Request is not pending' },
        { status: 400 }
      );
    }

    // Check budget
    const budget = await Budget.findOne({
      status: 'active',
      createdBy: auth.userId
    });

    if (!budget) {
      return NextResponse.json(
        { success: false, error: 'No active budget found' },
        { status: 400 }
      );
    }

    if (request.amount > budget.remainingAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient budget' },
        { status: 400 }
      );
    }

    // Update request
    request.status = 'approved';
    request.approverId = new mongoose.Types.ObjectId(auth.userId);
    request.approvedAt = new Date();
    await request.save();

    // Update budget
    budget.spentAmount = (budget.spentAmount || 0) + request.amount;
    budget.platformFees = (budget.platformFees || 0) + request.platformFee;
    budget.remainingAmount = budget.allocatedAmount - budget.spentAmount;

    if (budget.remainingAmount < 0) {
      budget.status = 'overdrawn';
    }

    await budget.save();

    return NextResponse.json({
      success: true,
      message: 'Request approved successfully',
      request: request
    });

  } catch (error: any) {
    console.error('Error approving request:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}