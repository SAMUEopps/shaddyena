// app/api/vendor/products/[id]/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ 
type TokenPayload = { userId: string };

async function getVendor(req: NextRequest): Promise<string> {
  const token = req.cookies.get('token')?.value;
  if (!token) throw { status: 401, message: 'Not authenticated' };

  try {
    const { userId } = verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return userId;
  } catch {
    throw { status: 401, message: 'Invalid token' };
  }
}

/* ------------------------------------------------------------------ */
/* Route handlers                                                     */
/* ------------------------------------------------------------------ 
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const vendorId = await getVendor(req);
    const { id } = await params;

    const product = await Product.findOne({ _id: id, vendorId });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ product });
  } catch (e: any) {
    const status = e.status ?? 500;
    return NextResponse.json({ message: e.message || 'Internal server error' }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const vendorId = await getVendor(req);
    const { id } = await params;
    const payload = await req.json();

    const product = await Product.findOneAndUpdate(
      { _id: id, vendorId },
      payload,
      { new: true, runValidators: true }
    );
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ message: 'Product updated successfully', product });
  } catch (e: any) {
    if (e.code === 11000) {
      return NextResponse.json({ message: 'SKU already exists' }, { status: 400 });
    }
    const status = e.status ?? 500;
    return NextResponse.json({ message: e.message || 'Internal server error' }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const vendorId = await getVendor(req);
    const { id } = await params;

    const product = await Product.findOneAndDelete({ _id: id, vendorId });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (e: any) {
    const status = e.status ?? 500;
    return NextResponse.json({ message: e.message || 'Internal server error' }, { status });
  }
}*/

// app/api/vendor/products/[id]/route.ts (PUT update with subscription validation)
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import VendorSubscription from "@/models/VendorSubscription";
import { verify } from "jsonwebtoken";
import { SUBSCRIPTION_FEATURES } from "@/types/subscription";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;
    const { id } = await params;

    const body = await req.json();
    const { subscriptionCategories, dealDiscount, dealExpiry, clearanceReason, giftCardValues } = body;

    // Get vendor's active subscription
    const subscription = await VendorSubscription.findOne({
      vendorId: userId,
      status: "active",
      endDate: { $gt: new Date() }
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: "Active subscription required to update visibility features" 
      }, { status: 403 });
    }

    const features = SUBSCRIPTION_FEATURES[subscription.tier as keyof typeof SUBSCRIPTION_FEATURES];

    // Validate each subscription category against limits
    if (subscriptionCategories) {
      // Check Today's Deal
      if (subscriptionCategories.isTodayDeal && !subscription.monthlyUsage.todayDealsUsed) {
        const currentUsage = subscription.monthlyUsage.todayDealsUsed || 0;
        if (currentUsage >= features.maxTodayDealsPerMonth && features.maxTodayDealsPerMonth > 0) {
          return NextResponse.json({ 
            error: `Today's Deals limit reached for this month. ${currentUsage}/${features.maxTodayDealsPerMonth} used.` 
          }, { status: 403 });
        }
      }

      // Check Best Seller
      if (subscriptionCategories.isBestSeller && !subscription.monthlyUsage.bestSellersUsed) {
        const currentUsage = subscription.monthlyUsage.bestSellersUsed || 0;
        if (currentUsage >= features.maxBestSellersPerMonth && features.maxBestSellersPerMonth > 0) {
          return NextResponse.json({ 
            error: `Best Sellers limit reached for this month.` 
          }, { status: 403 });
        }
      }

      // Check New Arrival
      if (subscriptionCategories.isNewArrival && !subscription.monthlyUsage.newArrivalsUsed) {
        const currentUsage = subscription.monthlyUsage.newArrivalsUsed || 0;
        if (currentUsage >= features.maxNewArrivalsPerMonth && features.maxNewArrivalsPerMonth > 0) {
          return NextResponse.json({ 
            error: `New Arrivals limit reached for this month.` 
          }, { status: 403 });
        }
      }

      // Check Clearance
      if (subscriptionCategories.isClearance && !subscription.monthlyUsage.clearanceUsed) {
        const currentUsage = subscription.monthlyUsage.clearanceUsed || 0;
        if (currentUsage >= features.maxClearanceItemsPerMonth && features.maxClearanceItemsPerMonth > 0) {
          return NextResponse.json({ 
            error: `Clearance items limit reached for this month.` 
          }, { status: 403 });
        }
      }
    }

    // Update product
    const updateData: any = { ...body };
    
    // Set featured dates
    if (subscriptionCategories) {
      if (subscriptionCategories.isTodayDeal && dealExpiry) {
        updateData.featuredAt = new Date();
        updateData.featuredExpiresAt = new Date(dealExpiry);
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update subscription usage counts
    const oldProduct = await Product.findById(id);
    if (oldProduct && subscriptionCategories) {
      // Increment counts for newly enabled features
      if (subscriptionCategories.isTodayDeal && !oldProduct.subscriptionCategories?.isTodayDeal) {
        subscription.monthlyUsage.todayDealsUsed = (subscription.monthlyUsage.todayDealsUsed || 0) + 1;
        subscription.featuredProducts.push({
          productId: product._id,
          category: 'todayDeal',
          featuredAt: new Date(),
          expiresAt: new Date(dealExpiry)
        });
      }
      
      if (subscriptionCategories.isBestSeller && !oldProduct.subscriptionCategories?.isBestSeller) {
        subscription.monthlyUsage.bestSellersUsed = (subscription.monthlyUsage.bestSellersUsed || 0) + 1;
      }
      
      if (subscriptionCategories.isNewArrival && !oldProduct.subscriptionCategories?.isNewArrival) {
        subscription.monthlyUsage.newArrivalsUsed = (subscription.monthlyUsage.newArrivalsUsed || 0) + 1;
      }
      
      if (subscriptionCategories.isClearance && !oldProduct.subscriptionCategories?.isClearance) {
        subscription.monthlyUsage.clearanceUsed = (subscription.monthlyUsage.clearanceUsed || 0) + 1;
      }

      await subscription.save();
    }

    return NextResponse.json({ product, subscription });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}