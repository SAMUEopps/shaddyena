// app/api/admin/subscription-plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import User from '@/models/user';

// Helper function to verify admin access
async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return { error: 'Not authenticated', status: 401 };
  }

  let decoded: any;
  try {
    decoded = verify(token, process.env.JWT_SECRET as string);
  } catch {
    return { error: 'Invalid token', status: 401 };
  }

  await dbConnect();
  const user = await User.findById(decoded.userId);
  if (!user || user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }

  return { user, status: 200 };
}

// GET - Fetch all subscription plans
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const query = includeInactive ? {} : { isActive: true };
    const plans = await SubscriptionPlan.find(query).sort({ order: 1, price: 1 });
    
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { message: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}

// POST - Create a new subscription plan (Admin only)
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    if (adminCheck.error) {
      return NextResponse.json(
        { message: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const body = await req.json();
    const { name, price, period, features, popular, badge, icon, order } = body;

    // Validate required fields
    if (!name || !price || !features || !features.length) {
      return NextResponse.json(
        { message: 'Name, price, and features are required' },
        { status: 400 }
      );
    }

    // Check if plan with same name exists
    const existingPlan = await SubscriptionPlan.findOne({ name });
    if (existingPlan) {
      return NextResponse.json(
        { message: 'A plan with this name already exists' },
        { status: 400 }
      );
    }

    // If setting this plan as popular, remove popular flag from others
    if (popular) {
      await SubscriptionPlan.updateMany({}, { popular: false });
    }

    const plan = await SubscriptionPlan.create({
      name,
      price,
      period: period || 'month',
      features,
      popular: popular || false,
      badge: badge || '',
      icon: icon || 'Star',
      order: order || 0,
      isActive: true,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subscription plan:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create subscription plan' },
      { status: 500 }
    );
  }
}

// PUT - Update a subscription plan (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    if (adminCheck.error) {
      return NextResponse.json(
        { message: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('id');
    
    if (!planId) {
      return NextResponse.json(
        { message: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, price, period, features, popular, badge, icon, order, isActive } = body;

    // If setting this plan as popular, remove popular flag from others
    if (popular) {
      await SubscriptionPlan.updateMany(
        { _id: { $ne: planId } },
        { popular: false }
      );
    }

    const plan = await SubscriptionPlan.findByIdAndUpdate(
      planId,
      {
        name,
        price,
        period,
        features,
        popular,
        badge,
        icon,
        order,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return NextResponse.json(
        { message: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Error updating subscription plan:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update subscription plan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a subscription plan (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    if (adminCheck.error) {
      return NextResponse.json(
        { message: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('id');
    
    if (!planId) {
      return NextResponse.json(
        { message: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const plan = await SubscriptionPlan.findByIdAndDelete(planId);
    
    if (!plan) {
      return NextResponse.json(
        { message: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Subscription plan deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return NextResponse.json(
      { message: 'Failed to delete subscription plan' },
      { status: 500 }
    );
  }
}