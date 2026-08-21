// app/api/organization/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';

import jwt from 'jsonwebtoken';
import Organization from '@/shd-models/models/Organization';

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

    // Find organization for this user
    const organization = await Organization.findOne({
      createdBy: auth.userId
    });

    if (!organization) {
      // Return a default organization if none exists
      return NextResponse.json({
        success: true,
        organization: {
          _id: 'default',
          name: 'My Organization',
          settings: {
            weeklyBudget: 10000,
            monthlyBudget: 40000,
            approvalThresholds: {
              admin: 5000,
              director: 20000
            },
            categories: [
              { name: 'Office Supplies', maxAmount: 5000, isActive: true },
              { name: 'Transport', maxAmount: 3000, isActive: true },
              { name: 'Meals', maxAmount: 2000, isActive: true },
              { name: 'Other', maxAmount: 10000, isActive: true }
            ],
            platformFeePercentage: 0,
            feeBearer: 'payer'
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      organization: organization
    });

  } catch (error: any) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await req.json();
    await connectToDatabase();

    const organization = await Organization.findOne({
      createdBy: auth.userId
    });

    if (!organization) {
      // Create new organization
      const newOrg = await Organization.create({
        ...body,
        createdBy: auth.userId,
        name: body.name || 'My Organization'
      });
      
      return NextResponse.json({
        success: true,
        organization: newOrg
      });
    }

    // Update existing organization
    const updated = await Organization.findByIdAndUpdate(
      organization._id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      organization: updated
    });

  } catch (error: any) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}