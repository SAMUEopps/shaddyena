// app/api/vendor/subscription/status/route.ts
import { NextResponse } from "next/server";
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
}