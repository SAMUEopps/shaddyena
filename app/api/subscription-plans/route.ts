// app/api/subscription-plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SubscriptionPlan from '@/models/SubscriptionPlan';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ order: 1, price: 1 })
      .select('-__v');
    
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { message: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}