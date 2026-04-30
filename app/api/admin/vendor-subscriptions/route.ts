// app/api/admin/vendor-subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VendorSubscription from '@/models/VendorSubscription';
import User from '@/models/user';
import { verify } from 'jsonwebtoken';

type Tier = 'basic' | 'growth' | 'pro' | 'elite';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all vendor subscriptions with populated vendor data
    const subscriptions = await VendorSubscription.find()
      .populate('vendorId', 'firstName lastName email phone businessName businessType referralCode referralCount createdAt')
      .sort({ createdAt: -1 });

    // Calculate stats
    const now = new Date();
    const stats = {
      totalVendors: subscriptions.length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active' && new Date(s.endDate) > now).length,
      totalRevenue: subscriptions.reduce((sum, s) => {
        return sum + s.paymentHistory.reduce((pSum: any, p: { amount: any; }) => pSum + p.amount, 0);
      }, 0),
      avgTier: subscriptions.length > 0 ? getAverageTier(subscriptions) : 'basic',
      expiringSoon: subscriptions.filter(s => {
        const daysLeft = Math.ceil((new Date(s.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return s.status === 'active' && daysLeft <= 7 && daysLeft > 0;
      }).length,
      usageStats: {
        todayDeals: subscriptions.reduce((sum, s) => sum + (s.monthlyUsage?.todayDealsUsed || 0), 0),
        bestSellers: subscriptions.reduce((sum, s) => sum + (s.monthlyUsage?.bestSellersUsed || 0), 0),
        newArrivals: subscriptions.reduce((sum, s) => sum + (s.monthlyUsage?.newArrivalsUsed || 0), 0),
        clearance: subscriptions.reduce((sum, s) => sum + (s.monthlyUsage?.clearanceUsed || 0), 0),
        giftCards: subscriptions.reduce((sum, s) => sum + (s.monthlyUsage?.giftCardsCreated || 0), 0),
      }
    };

    return NextResponse.json({ subscriptions, stats });
  } catch (error) {
    console.error('Error fetching vendor subscriptions:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function getAverageTier(subscriptions: any[]): Tier {
  const tierValues: Record<Tier, number> = {
    basic: 1,
    growth: 2,
    pro: 3,
    elite: 4,
  };

  const avg =
    subscriptions.reduce((sum, s) => {
      const tier = s.tier as Tier; // 👈 cast here
      return sum + tierValues[tier];
    }, 0) / subscriptions.length;

  if (avg <= 1.5) return 'basic';
  if (avg <= 2.5) return 'growth';
  if (avg <= 3.5) return 'pro';
  return 'elite';
}
