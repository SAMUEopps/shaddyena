// app/api/vendor/subscription/status/route.ts
/*import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VendorSubscription from "@/models/VendorSubscription";
import { verify } from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    let subscription = await VendorSubscription.findOne({
      vendorId: userId,
      status: "active",
      endDate: { $gt: new Date() }
    });

    // If no active subscription, create a default basic one
    if (!subscription) {
      subscription = await VendorSubscription.create({
        vendorId: userId,
        tier: "basic",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        autoRenew: false,
        monthlyUsage: {
          todayDealsUsed: 0,
          bestSellersUsed: 0,
          newArrivalsUsed: 0,
          clearanceUsed: 0,
          giftCardsCreated: 0,
          month: new Date()
        },
        featuredProducts: []
      });
    }

    // Check if we need to reset monthly usage (new month)
    const now = new Date();
    const usageMonth = new Date(subscription.monthlyUsage.month);
    if (now.getMonth() !== usageMonth.getMonth() || now.getFullYear() !== usageMonth.getFullYear()) {
      subscription.monthlyUsage = {
        todayDealsUsed: 0,
        bestSellersUsed: 0,
        newArrivalsUsed: 0,
        clearanceUsed: 0,
        giftCardsCreated: 0,
        month: now
      };
      await subscription.save();
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}*/

// app/api/vendor/subscription/status/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VendorSubscription from "@/models/VendorSubscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { verify } from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    let subscription = await VendorSubscription.findOne({
      vendorId: userId,
      status: "active",
      endDate: { $gt: new Date() }
    });

    // Get the subscription plan details from the plans collection
    let planDetails = null;
    if (subscription) {
      planDetails = await SubscriptionPlan.findOne({ 
        name: { $regex: new RegExp(`^${subscription.tier}$`, 'i') },
        isActive: true 
      });
    }

    // If no active subscription, create a default basic one
    if (!subscription) {
      subscription = await VendorSubscription.create({
        vendorId: userId,
        tier: "basic",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        autoRenew: false,
        monthlyUsage: {
          todayDealsUsed: 0,
          bestSellersUsed: 0,
          newArrivalsUsed: 0,
          clearanceUsed: 0,
          giftCardsCreated: 0,
          month: new Date()
        },
        featuredProducts: []
      });
      
      planDetails = await SubscriptionPlan.findOne({ 
        name: { $regex: /^basic$/i },
        isActive: true 
      });
    }

    // Check if we need to reset monthly usage (new month)
    const now = new Date();
    const usageMonth = new Date(subscription.monthlyUsage.month);
    if (now.getMonth() !== usageMonth.getMonth() || now.getFullYear() !== usageMonth.getFullYear()) {
      subscription.monthlyUsage = {
        todayDealsUsed: 0,
        bestSellersUsed: 0,
        newArrivalsUsed: 0,
        clearanceUsed: 0,
        giftCardsCreated: 0,
        month: now
      };
      await subscription.save();
    }

    return NextResponse.json({ 
      subscription,
      planDetails,
      tier: subscription.tier,
      status: subscription.status,
      remainingDays: Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}*/


// app/api/vendor/subscription/status/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VendorSubscription from "@/models/VendorSubscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { verify } from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    let subscription = await VendorSubscription.findOne({
      vendorId: userId,
      status: "active",
      endDate: { $gt: new Date() }
    });

    // Get the subscription plan details from the plans collection with capabilities
    let planDetails = null;
    let capabilities = null;
    
    if (subscription) {
      // Find the plan by name (case-insensitive)
      planDetails = await SubscriptionPlan.findOne({ 
        name: { $regex: new RegExp(`^${subscription.tier}$`, 'i') },
        isActive: true 
      });
      
      if (planDetails && planDetails.capabilities) {
        capabilities = planDetails.capabilities;
      } else {
        // Fallback to default capabilities based on tier name
        const isGrowth = subscription.tier === 'growth';
        const isPro = subscription.tier === 'pro';
        const isElite = subscription.tier === 'elite';
        
        capabilities = {
          canFeatureTodayDeals: isGrowth || isPro || isElite,
          canFeatureBestSellers: isGrowth || isPro || isElite,
          canFeatureNewArrivals: true,
          canFeatureClearance: isGrowth || isPro || isElite,
          canFeatureGiftCards: isPro || isElite,
          maxTodayDealsPerMonth: isGrowth ? 10 : isPro ? 30 : isElite ? 100 : 0,
          maxBestSellersPerMonth: isGrowth ? 15 : isPro ? 50 : isElite ? 200 : 0,
          maxNewArrivalsPerMonth: subscription.tier === 'basic' ? 5 : isGrowth ? 20 : isPro ? 100 : 500,
          maxClearanceItemsPerMonth: isGrowth ? 10 : isPro ? 30 : isElite ? 100 : 0,
          maxGiftCardsPerMonth: isPro ? 50 : isElite ? 200 : 0,
          maxProducts: subscription.tier === 'basic' ? 50 : isGrowth ? 200 : isPro ? 500 : 999999,
          prioritySupport: isGrowth || isPro || isElite,
          advancedAnalytics: isPro || isElite,
        };
      }
    }

    // If no active subscription, create a default basic one
    if (!subscription) {
      const basicPlan = await SubscriptionPlan.findOne({ 
        name: { $regex: /^basic$/i },
        isActive: true 
      });
      
      capabilities = basicPlan?.capabilities || {
        canFeatureTodayDeals: false,
        canFeatureBestSellers: false,
        canFeatureNewArrivals: true,
        canFeatureClearance: false,
        canFeatureGiftCards: false,
        maxTodayDealsPerMonth: 0,
        maxBestSellersPerMonth: 0,
        maxNewArrivalsPerMonth: 5,
        maxClearanceItemsPerMonth: 0,
        maxGiftCardsPerMonth: 0,
        maxProducts: 50,
        prioritySupport: false,
        advancedAnalytics: false,
      };
      
      subscription = await VendorSubscription.create({
        vendorId: userId,
        tier: "basic",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        autoRenew: false,
        monthlyUsage: {
          todayDealsUsed: 0,
          bestSellersUsed: 0,
          newArrivalsUsed: 0,
          clearanceUsed: 0,
          giftCardsCreated: 0,
          month: new Date()
        },
        featuredProducts: []
      });
    }

    // Check if we need to reset monthly usage (new month)
    const now = new Date();
    const usageMonth = new Date(subscription.monthlyUsage.month);
    if (now.getMonth() !== usageMonth.getMonth() || now.getFullYear() !== usageMonth.getFullYear()) {
      subscription.monthlyUsage = {
        todayDealsUsed: 0,
        bestSellersUsed: 0,
        newArrivalsUsed: 0,
        clearanceUsed: 0,
        giftCardsCreated: 0,
        month: now
      };
      await subscription.save();
    }

    // Get limits from capabilities
    const limits = {
      maxTodayDealsPerMonth: capabilities.maxTodayDealsPerMonth,
      maxBestSellersPerMonth: capabilities.maxBestSellersPerMonth,
      maxNewArrivalsPerMonth: capabilities.maxNewArrivalsPerMonth,
      maxClearanceItemsPerMonth: capabilities.maxClearanceItemsPerMonth,
      maxGiftCardsPerMonth: capabilities.maxGiftCardsPerMonth,
      maxProducts: capabilities.maxProducts,
    };

    // Get feature flags from capabilities
    const features = {
      canFeatureTodayDeals: capabilities.canFeatureTodayDeals,
      canFeatureBestSellers: capabilities.canFeatureBestSellers,
      canFeatureNewArrivals: capabilities.canFeatureNewArrivals,
      canFeatureClearance: capabilities.canFeatureClearance,
      canFeatureGiftCards: capabilities.canFeatureGiftCards,
      prioritySupport: capabilities.prioritySupport,
      advancedAnalytics: capabilities.advancedAnalytics,
    };

    return NextResponse.json({ 
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        monthlyUsage: subscription.monthlyUsage,
      },
      capabilities,
      limits,
      features,
      remainingDays: Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      planDetails: planDetails ? {
        name: planDetails.name,
        price: planDetails.price,
        period: planDetails.period,
        features: planDetails.features,
        badge: planDetails.badge,
        icon: planDetails.icon,
      } : null
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}*/

// app/api/vendor/subscription/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VendorSubscription from "@/models/VendorSubscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import Payment from "@/models/Payment";
import { verify } from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    // Get the vendor's subscription from database
    let subscription = await VendorSubscription.findOne({
      vendorId: userId,
    });

    const now = new Date();
    
    // Check if subscription exists and is still valid
    if (subscription) {
      // Check if subscription has expired
      if (subscription.status === 'active' && subscription.endDate < now) {
        subscription.status = 'expired';
        
        // Add 7-day grace period
        subscription.status = 'grace_period';
        subscription.gracePeriodEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        await subscription.save();
      }
      
      // Check if grace period has ended
      if (subscription.status === 'grace_period' && subscription.gracePeriodEndsAt && subscription.gracePeriodEndsAt < now) {
        subscription.status = 'expired';
        await subscription.save();
      }
      
      // Reset monthly usage if it's a new month
      const usageMonth = new Date(subscription.monthlyUsage.month);
      if (now.getMonth() !== usageMonth.getMonth() || now.getFullYear() !== usageMonth.getFullYear()) {
        subscription.monthlyUsage = {
          todayDealsUsed: 0,
          bestSellersUsed: 0,
          newArrivalsUsed: 0,
          clearanceUsed: 0,
          giftCardsCreated: 0,
          month: now,
          lastResetAt: now,
        };
        await subscription.save();
      }
    } else {
      // No subscription found - create default basic plan
      const basicPlan = await SubscriptionPlan.findOne({ 
        name: { $regex: /^basic$/i },
        isActive: true 
      });
      
      const defaultCapabilities = basicPlan?.capabilities || {
        canFeatureTodayDeals: false,
        canFeatureBestSellers: false,
        canFeatureNewArrivals: true,
        canFeatureClearance: false,
        canFeatureGiftCards: false,
        maxTodayDealsPerMonth: 0,
        maxBestSellersPerMonth: 0,
        maxNewArrivalsPerMonth: 5,
        maxClearanceItemsPerMonth: 0,
        maxGiftCardsPerMonth: 0,
        maxProducts: 50,
        prioritySupport: false,
        advancedAnalytics: false,
      };
      
      subscription = await VendorSubscription.create({
        vendorId: userId,
        tier: "basic",
        status: "active",
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        autoRenew: false,
        monthlyUsage: {
          todayDealsUsed: 0,
          bestSellersUsed: 0,
          newArrivalsUsed: 0,
          clearanceUsed: 0,
          giftCardsCreated: 0,
          month: now,
          lastResetAt: now,
        },
        featuredProducts: [],
        paymentHistory: [],
      });
    }

    // Get the subscription plan details with capabilities
    const planFromDb = await SubscriptionPlan.findOne({ 
      name: { $regex: new RegExp(`^${subscription.tier}$`, 'i') },
      isActive: true 
    });
    
    // Get the last successful payment
    const lastPayment = await Payment.findOne({
      userId,
      status: 'PAID'
    }).sort({ createdAt: -1 });
    
    // Use capabilities from database
    const capabilities = planFromDb?.capabilities || {
      canFeatureTodayDeals: false,
      canFeatureBestSellers: false,
      canFeatureNewArrivals: true,
      canFeatureClearance: false,
      canFeatureGiftCards: false,
      maxTodayDealsPerMonth: 0,
      maxBestSellersPerMonth: 0,
      maxNewArrivalsPerMonth: 5,
      maxClearanceItemsPerMonth: 0,
      maxGiftCardsPerMonth: 0,
      maxProducts: 50,
      prioritySupport: false,
      advancedAnalytics: false,
    };

    // Calculate remaining days
    const remainingDays = Math.max(0, Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate usage percentages
    const usage = {
      todayDeals: Math.round((subscription.monthlyUsage.todayDealsUsed / (capabilities.maxTodayDealsPerMonth || 1)) * 100),
      bestSellers: Math.round((subscription.monthlyUsage.bestSellersUsed / (capabilities.maxBestSellersPerMonth || 1)) * 100),
      newArrivals: Math.round((subscription.monthlyUsage.newArrivalsUsed / (capabilities.maxNewArrivalsPerMonth || 1)) * 100),
      clearance: Math.round((subscription.monthlyUsage.clearanceUsed / (capabilities.maxClearanceItemsPerMonth || 1)) * 100),
      giftCards: Math.round((subscription.monthlyUsage.giftCardsCreated / (capabilities.maxGiftCardsPerMonth || 1)) * 100),
    };

    return NextResponse.json({ 
      subscription: {
        id: subscription._id,
        tier: subscription.tier,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        monthlyUsage: subscription.monthlyUsage,
        paymentHistory: subscription.paymentHistory,
      },
      capabilities,
      limits: {
        maxTodayDealsPerMonth: capabilities.maxTodayDealsPerMonth,
        maxBestSellersPerMonth: capabilities.maxBestSellersPerMonth,
        maxNewArrivalsPerMonth: capabilities.maxNewArrivalsPerMonth,
        maxClearanceItemsPerMonth: capabilities.maxClearanceItemsPerMonth,
        maxGiftCardsPerMonth: capabilities.maxGiftCardsPerMonth,
        maxProducts: capabilities.maxProducts,
      },
      features: {
        canFeatureTodayDeals: capabilities.canFeatureTodayDeals,
        canFeatureBestSellers: capabilities.canFeatureBestSellers,
        canFeatureNewArrivals: capabilities.canFeatureNewArrivals,
        canFeatureClearance: capabilities.canFeatureClearance,
        canFeatureGiftCards: capabilities.canFeatureGiftCards,
        prioritySupport: capabilities.prioritySupport,
        advancedAnalytics: capabilities.advancedAnalytics,
      },
      remainingDays,
      usage,
      lastPayment: lastPayment ? {
        amount: lastPayment.amount,
        date: lastPayment.createdAt,
        receipt: lastPayment.mpesaReceipt,
      } : null,
      planDetails: planFromDb ? {
        id: planFromDb._id,
        name: planFromDb.name,
        price: planFromDb.price,
        period: planFromDb.period,
        features: planFromDb.features,
        badge: planFromDb.badge,
        icon: planFromDb.icon,
      } : null
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}