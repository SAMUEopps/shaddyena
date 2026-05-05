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
/*import { NextRequest, NextResponse } from "next/server";
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
}*/

// app/api/vendor/products/[id]/route.ts
/*import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import VendorSubscription from "@/models/VendorSubscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { verify } from "jsonwebtoken";
import { DEFAULT_SUBSCRIPTION_FEATURES } from "@/types/subscription";

export async function GET(
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

    const product = await Product.findOne({ _id: id, vendorId: userId });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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
    const { subscriptionCategories, dealDiscount, dealExpiry, dealStartDate, clearanceReason, giftCardValues } = body;

    // Get existing product
    const existingProduct = await Product.findOne({ _id: id, vendorId: userId });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get vendor's active subscription
    const subscription = await VendorSubscription.findOne({
      vendorId: userId,
      status: "active",
      endDate: { $gt: new Date() }
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: "Active subscription required to update products" 
      }, { status: 403 });
    }

    // Get dynamic plan features from database
    const planFromDb = await SubscriptionPlan.findOne({ 
      name: { $regex: new RegExp(`^${subscription.tier}$`, 'i') },
      isActive: true 
    });
    
    // Fallback to default features if plan not found in DB
    const features = planFromDb ? {
      canFeatureTodayDeals: subscription.tier === 'growth' || subscription.tier === 'pro' || subscription.tier === 'elite',
      canFeatureBestSellers: subscription.tier === 'growth' || subscription.tier === 'pro' || subscription.tier === 'elite',
      canFeatureNewArrivals: true,
      canFeatureClearance: subscription.tier === 'growth' || subscription.tier === 'pro' || subscription.tier === 'elite',
      canFeatureGiftCards: subscription.tier === 'pro' || subscription.tier === 'elite',
      maxTodayDealsPerMonth: subscription.tier === 'growth' ? 10 : subscription.tier === 'pro' ? 30 : subscription.tier === 'elite' ? 100 : 0,
      maxBestSellersPerMonth: subscription.tier === 'growth' ? 15 : subscription.tier === 'pro' ? 50 : subscription.tier === 'elite' ? 200 : 0,
      maxNewArrivalsPerMonth: subscription.tier === 'basic' ? 5 : subscription.tier === 'growth' ? 20 : subscription.tier === 'pro' ? 100 : 500,
      maxClearanceItemsPerMonth: subscription.tier === 'growth' ? 10 : subscription.tier === 'pro' ? 30 : subscription.tier === 'elite' ? 100 : 0,
      maxGiftCardsPerMonth: subscription.tier === 'pro' ? 50 : subscription.tier === 'elite' ? 200 : 0,
    } : DEFAULT_SUBSCRIPTION_FEATURES[subscription.tier as keyof typeof DEFAULT_SUBSCRIPTION_FEATURES];

    // Validate subscription categories against limits
    const errors: string[] = [];

    if (subscriptionCategories) {
      // Check Today's Deal
      if (subscriptionCategories.isTodayDeal && !existingProduct.subscriptionCategories?.isTodayDeal) {
        if (!features.canFeatureTodayDeals) {
          errors.push("Today's Deals feature is not available in your current plan. Please upgrade.");
        } else {
          const currentUsage = subscription.monthlyUsage.todayDealsUsed || 0;
          if (currentUsage >= features.maxTodayDealsPerMonth && features.maxTodayDealsPerMonth > 0) {
            errors.push(`Today's Deals limit reached for this month (${currentUsage}/${features.maxTodayDealsPerMonth} used). Upgrade or wait for next month.`);
          }
        }
      }

      // Check Best Seller
      if (subscriptionCategories.isBestSeller && !existingProduct.subscriptionCategories?.isBestSeller) {
        if (!features.canFeatureBestSellers) {
          errors.push("Best Sellers feature is not available in your current plan. Please upgrade.");
        } else {
          const currentUsage = subscription.monthlyUsage.bestSellersUsed || 0;
          if (currentUsage >= features.maxBestSellersPerMonth && features.maxBestSellersPerMonth > 0) {
            errors.push(`Best Sellers limit reached for this month (${currentUsage}/${features.maxBestSellersPerMonth} used).`);
          }
        }
      }

      // Check New Arrival
      if (subscriptionCategories.isNewArrival && !existingProduct.subscriptionCategories?.isNewArrival) {
        if (!features.canFeatureNewArrivals) {
          errors.push("New Arrivals feature is not available in your current plan.");
        } else {
          const currentUsage = subscription.monthlyUsage.newArrivalsUsed || 0;
          if (currentUsage >= features.maxNewArrivalsPerMonth && features.maxNewArrivalsPerMonth > 0) {
            errors.push(`New Arrivals limit reached for this month (${currentUsage}/${features.maxNewArrivalsPerMonth} used).`);
          }
        }
      }

      // Check Clearance
      if (subscriptionCategories.isClearance && !existingProduct.subscriptionCategories?.isClearance) {
        if (!features.canFeatureClearance) {
          errors.push("Clearance feature is not available in your current plan. Please upgrade.");
        } else {
          const currentUsage = subscription.monthlyUsage.clearanceUsed || 0;
          if (currentUsage >= features.maxClearanceItemsPerMonth && features.maxClearanceItemsPerMonth > 0) {
            errors.push(`Clearance items limit reached for this month (${currentUsage}/${features.maxClearanceItemsPerMonth} used).`);
          }
        }
      }

      // Check Gift Card
      if (subscriptionCategories.isGiftCard && !existingProduct.subscriptionCategories?.isGiftCard) {
        if (!features.canFeatureGiftCards) {
          errors.push("Gift Cards feature is not available in your current plan. Upgrade to Pro or Elite.");
        } else {
          const currentUsage = subscription.monthlyUsage.giftCardsCreated || 0;
          if (currentUsage >= features.maxGiftCardsPerMonth && features.maxGiftCardsPerMonth > 0) {
            errors.push(`Gift Cards limit reached for this month (${currentUsage}/${features.maxGiftCardsPerMonth} used).`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = { ...body };
    
    // Remove fields that shouldn't be directly updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.vendorId;
    delete updateData.shopId;

    // Set featured dates for Today's Deal
    if (subscriptionCategories?.isTodayDeal && !existingProduct.subscriptionCategories?.isTodayDeal) {
      updateData.featuredAt = new Date();
      if (dealExpiry) {
        updateData.featuredExpiresAt = new Date(dealExpiry);
      }
      if (dealStartDate) {
        updateData.dealStartDate = new Date(dealStartDate);
      }
    } else if (!subscriptionCategories?.isTodayDeal && existingProduct.subscriptionCategories?.isTodayDeal) {
      // Remove featured dates if turning off Today's Deal
      updateData.featuredAt = null;
      updateData.featuredExpiresAt = null;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update subscription usage counts for newly enabled features
    if (subscriptionCategories) {
      // Today's Deal
      if (subscriptionCategories.isTodayDeal && !existingProduct.subscriptionCategories?.isTodayDeal) {
        subscription.monthlyUsage.todayDealsUsed = (subscription.monthlyUsage.todayDealsUsed || 0) + 1;
        subscription.featuredProducts.push({
          productId: updatedProduct._id,
          category: 'todayDeal',
          featuredAt: new Date(),
          expiresAt: dealExpiry ? new Date(dealExpiry) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
      
      // Best Seller
      if (subscriptionCategories.isBestSeller && !existingProduct.subscriptionCategories?.isBestSeller) {
        subscription.monthlyUsage.bestSellersUsed = (subscription.monthlyUsage.bestSellersUsed || 0) + 1;
      }
      
      // New Arrival
      if (subscriptionCategories.isNewArrival && !existingProduct.subscriptionCategories?.isNewArrival) {
        subscription.monthlyUsage.newArrivalsUsed = (subscription.monthlyUsage.newArrivalsUsed || 0) + 1;
      }
      
      // Clearance
      if (subscriptionCategories.isClearance && !existingProduct.subscriptionCategories?.isClearance) {
        subscription.monthlyUsage.clearanceUsed = (subscription.monthlyUsage.clearanceUsed || 0) + 1;
      }

      // Gift Card
      if (subscriptionCategories.isGiftCard && !existingProduct.subscriptionCategories?.isGiftCard) {
        subscription.monthlyUsage.giftCardsCreated = (subscription.monthlyUsage.giftCardsCreated || 0) + 1;
      }

      await subscription.save();
    }

    return NextResponse.json({ 
      product: updatedProduct, 
      subscription: {
        tier: subscription.tier,
        usage: subscription.monthlyUsage,
        remaining: {
          todayDeals: features.maxTodayDealsPerMonth - (subscription.monthlyUsage.todayDealsUsed || 0),
          bestSellers: features.maxBestSellersPerMonth - (subscription.monthlyUsage.bestSellersUsed || 0),
          newArrivals: features.maxNewArrivalsPerMonth - (subscription.monthlyUsage.newArrivalsUsed || 0),
          clearance: features.maxClearanceItemsPerMonth - (subscription.monthlyUsage.clearanceUsed || 0),
          giftCards: features.maxGiftCardsPerMonth - (subscription.monthlyUsage.giftCardsCreated || 0),
        }
      }
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}*/


// app/api/vendor/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import VendorSubscription from "@/models/VendorSubscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { verify } from "jsonwebtoken";

export async function GET(
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

    const product = await Product.findOne({ _id: id, vendorId: userId });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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
    const { subscriptionCategories, dealDiscount, dealExpiry, dealStartDate, clearanceReason, giftCardValues } = body;
    // Get existing product
    const existingProduct = await Product.findOne({ _id: id, vendorId: userId });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get vendor's active subscription
    const subscription = await VendorSubscription.findOne({
      vendorId: userId,
      status: "active",
      endDate: { $gt: new Date() }
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: "Active subscription required to update products" 
      }, { status: 403 });
    }

    // Get dynamic plan features from database with capabilities
    const planFromDb = await SubscriptionPlan.findOne({ 
      name: { $regex: new RegExp(`^${subscription.tier}$`, 'i') },
      isActive: true 
    });
    
    // Use capabilities from database if available, otherwise provide sensible defaults
    const capabilities = planFromDb?.capabilities;
    
    if (!capabilities) {
      console.warn(`No capabilities found for plan: ${subscription.tier}. Using defaults.`);
    }
    
    // Extract features from capabilities (or use fallback)
    const canFeatureTodayDeals = capabilities?.canFeatureTodayDeals ?? false;
    const canFeatureBestSellers = capabilities?.canFeatureBestSellers ?? false;
    const canFeatureNewArrivals = capabilities?.canFeatureNewArrivals ?? true;
    const canFeatureClearance = capabilities?.canFeatureClearance ?? false;
    const canFeatureGiftCards = capabilities?.canFeatureGiftCards ?? false;
    
    const maxTodayDealsPerMonth = capabilities?.maxTodayDealsPerMonth ?? 0;
    const maxBestSellersPerMonth = capabilities?.maxBestSellersPerMonth ?? 0;
    const maxNewArrivalsPerMonth = capabilities?.maxNewArrivalsPerMonth ?? 5;
    const maxClearanceItemsPerMonth = capabilities?.maxClearanceItemsPerMonth ?? 0;
    const maxGiftCardsPerMonth = capabilities?.maxGiftCardsPerMonth ?? 0;

    // Validate subscription categories against limits
    const errors: string[] = [];

    if (subscriptionCategories) {
      // Check Today's Deal
      if (subscriptionCategories.isTodayDeal && !existingProduct.subscriptionCategories?.isTodayDeal) {
        if (!canFeatureTodayDeals) {
          errors.push("Today's Deals feature is not available in your current plan. Please upgrade.");
        } else {
          const currentUsage = subscription.monthlyUsage.todayDealsUsed || 0;
          if (currentUsage >= maxTodayDealsPerMonth && maxTodayDealsPerMonth > 0) {
            errors.push(`Today's Deals limit reached for this month (${currentUsage}/${maxTodayDealsPerMonth} used). Upgrade or wait for next month.`);
          }
        }
      }

      // Check Best Seller
      if (subscriptionCategories.isBestSeller && !existingProduct.subscriptionCategories?.isBestSeller) {
        if (!canFeatureBestSellers) {
          errors.push("Best Sellers feature is not available in your current plan. Please upgrade.");
        } else {
          const currentUsage = subscription.monthlyUsage.bestSellersUsed || 0;
          if (currentUsage >= maxBestSellersPerMonth && maxBestSellersPerMonth > 0) {
            errors.push(`Best Sellers limit reached for this month (${currentUsage}/${maxBestSellersPerMonth} used).`);
          }
        }
      }

      // Check New Arrival
      if (subscriptionCategories.isNewArrival && !existingProduct.subscriptionCategories?.isNewArrival) {
        if (!canFeatureNewArrivals) {
          errors.push("New Arrivals feature is not available in your current plan.");
        } else {
          const currentUsage = subscription.monthlyUsage.newArrivalsUsed || 0;
          if (currentUsage >= maxNewArrivalsPerMonth && maxNewArrivalsPerMonth > 0) {
            errors.push(`New Arrivals limit reached for this month (${currentUsage}/${maxNewArrivalsPerMonth} used).`);
          }
        }
      }

      // Check Clearance
      if (subscriptionCategories.isClearance && !existingProduct.subscriptionCategories?.isClearance) {
        if (!canFeatureClearance) {
          errors.push("Clearance feature is not available in your current plan. Please upgrade.");
        } else {
          const currentUsage = subscription.monthlyUsage.clearanceUsed || 0;
          if (currentUsage >= maxClearanceItemsPerMonth && maxClearanceItemsPerMonth > 0) {
            errors.push(`Clearance items limit reached for this month (${currentUsage}/${maxClearanceItemsPerMonth} used).`);
          }
        }
      }

      // Check Gift Card
      if (subscriptionCategories.isGiftCard && !existingProduct.subscriptionCategories?.isGiftCard) {
        if (!canFeatureGiftCards) {
          errors.push("Gift Cards feature is not available in your current plan. Upgrade to Pro or Elite.");
        } else {
          const currentUsage = subscription.monthlyUsage.giftCardsCreated || 0;
          if (currentUsage >= maxGiftCardsPerMonth && maxGiftCardsPerMonth > 0) {
            errors.push(`Gift Cards limit reached for this month (${currentUsage}/${maxGiftCardsPerMonth} used).`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = { ...body };
    
    // Remove fields that shouldn't be directly updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.vendorId;
    delete updateData.shopId;

    // Set featured dates for Today's Deal
    if (subscriptionCategories?.isTodayDeal && !existingProduct.subscriptionCategories?.isTodayDeal) {
      updateData.featuredAt = new Date();
      if (dealExpiry) {
        updateData.featuredExpiresAt = new Date(dealExpiry);
      }
      if (dealStartDate) {
        updateData.dealStartDate = new Date(dealStartDate);
      }
    } else if (!subscriptionCategories?.isTodayDeal && existingProduct.subscriptionCategories?.isTodayDeal) {
      // Remove featured dates if turning off Today's Deal
      updateData.featuredAt = null;
      updateData.featuredExpiresAt = null;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { $set: updateData },
      //updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update subscription usage counts for newly enabled features
    if (subscriptionCategories) {
      // Today's Deal
      if (subscriptionCategories.isTodayDeal && !existingProduct.subscriptionCategories?.isTodayDeal) {
        subscription.monthlyUsage.todayDealsUsed = (subscription.monthlyUsage.todayDealsUsed || 0) + 1;
        subscription.featuredProducts.push({
          productId: updatedProduct._id,
          category: 'todayDeal',
          featuredAt: new Date(),
          expiresAt: dealExpiry ? new Date(dealExpiry) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
      
      // Best Seller
      if (subscriptionCategories.isBestSeller && !existingProduct.subscriptionCategories?.isBestSeller) {
        subscription.monthlyUsage.bestSellersUsed = (subscription.monthlyUsage.bestSellersUsed || 0) + 1;
      }
      
      // New Arrival
      if (subscriptionCategories.isNewArrival && !existingProduct.subscriptionCategories?.isNewArrival) {
        subscription.monthlyUsage.newArrivalsUsed = (subscription.monthlyUsage.newArrivalsUsed || 0) + 1;
      }
      
      // Clearance
      if (subscriptionCategories.isClearance && !existingProduct.subscriptionCategories?.isClearance) {
        subscription.monthlyUsage.clearanceUsed = (subscription.monthlyUsage.clearanceUsed || 0) + 1;
      }

      // Gift Card
      if (subscriptionCategories.isGiftCard && !existingProduct.subscriptionCategories?.isGiftCard) {
        subscription.monthlyUsage.giftCardsCreated = (subscription.monthlyUsage.giftCardsCreated || 0) + 1;
      }

      await subscription.save();
    }

    // Calculate remaining usage based on capabilities
    const remaining = {
      todayDeals: canFeatureTodayDeals ? Math.max(0, maxTodayDealsPerMonth - (subscription.monthlyUsage.todayDealsUsed || 0)) : 0,
      bestSellers: canFeatureBestSellers ? Math.max(0, maxBestSellersPerMonth - (subscription.monthlyUsage.bestSellersUsed || 0)) : 0,
      newArrivals: canFeatureNewArrivals ? Math.max(0, maxNewArrivalsPerMonth - (subscription.monthlyUsage.newArrivalsUsed || 0)) : 0,
      clearance: canFeatureClearance ? Math.max(0, maxClearanceItemsPerMonth - (subscription.monthlyUsage.clearanceUsed || 0)) : 0,
      giftCards: canFeatureGiftCards ? Math.max(0, maxGiftCardsPerMonth - (subscription.monthlyUsage.giftCardsCreated || 0)) : 0,
    };

    return NextResponse.json({ 
      product: updatedProduct, 
      subscription: {
        tier: subscription.tier,
        usage: subscription.monthlyUsage,
        remaining,
        capabilities: {
          canFeatureTodayDeals,
          canFeatureBestSellers,
          canFeatureNewArrivals,
          canFeatureClearance,
          canFeatureGiftCards,
          maxTodayDealsPerMonth,
          maxBestSellersPerMonth,
          maxNewArrivalsPerMonth,
          maxClearanceItemsPerMonth,
          maxGiftCardsPerMonth,
        }
      }
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}