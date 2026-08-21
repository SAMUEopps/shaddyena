// app/api/petty-cash/budget/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Budget from '@/shd-models/models/Budget';
import jwt from 'jsonwebtoken';

// Helper to verify JWT token
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

// GET - Fetch active budget for the user
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

    // Find active budget for this user
    const budget = await Budget.findOne({ 
      status: 'active',
      createdBy: auth.userId
    }).sort({ createdAt: -1 });

    if (!budget) {
      return NextResponse.json({
        success: false,
        error: 'No active budget found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      budget: budget
    });

  } catch (error: any) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new budget
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
    const { allocatedAmount, weekStart, weekEnd } = body;

    if (!allocatedAmount || allocatedAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!weekStart || !weekEnd) {
      return NextResponse.json(
        { success: false, error: 'Week start and end dates are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if there's already an active budget
    const existingBudget = await Budget.findOne({
      status: 'active',
      createdBy: auth.userId
    });

    // Close any existing active budget
    if (existingBudget) {
      existingBudget.status = 'closed';
      await existingBudget.save();
    }

    // Create new budget
    const budget = await Budget.create({
      allocatedAmount: allocatedAmount,
      spentAmount: 0,
      platformFees: 0,
      remainingAmount: allocatedAmount,
      weekStart,
      weekEnd,
      status: 'active',
      createdBy: auth.userId,
      organizationId: auth.userId, // Adjust as needed
      metadata: {
        depositHistory: [],
        totalDeposits: 0,
        createdVia: 'api',
        createdBy: auth.userId
      }
    });

    return NextResponse.json({
      success: true,
      budget: budget
    });

  } catch (error: any) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}