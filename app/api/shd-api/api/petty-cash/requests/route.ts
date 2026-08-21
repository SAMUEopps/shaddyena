// app/api/petty-cash/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';

import Budget from '@/shd-models/models/Budget';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ExpenseRequest from '@/shd-models/models/ExpenseRequest';

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

// GET - Fetch all requests
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await connectToDatabase();

    const requests = await ExpenseRequest.find({
      requesterId: auth.userId
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests: requests
    });

  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new request
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await req.json();
    const { amount, recipientPhone, recipientName, category, description, receiptUrl } = body;

    await connectToDatabase();

    // Get active budget
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

    if (amount > budget.remainingAmount) {
      return NextResponse.json(
        { success: false, error: 'Amount exceeds available budget' },
        { status: 400 }
      );
    }

    // Calculate platform fee
    const platformFee = amount * 0.03; // 3% fee
    const totalAmount = amount + platformFee;

    const request = await ExpenseRequest.create({
      amount,
      platformFee,
      totalAmount,
      recipientPhone,
      recipientName: recipientName || 'Unknown',
      category,
      description,
      status: 'pending',
      requesterId: new mongoose.Types.ObjectId(auth.userId),
      receiptUrl: receiptUrl || '',
      metadata: {
        budgetId: budget._id,
        createdAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      request: request
    });

  } catch (error: any) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}