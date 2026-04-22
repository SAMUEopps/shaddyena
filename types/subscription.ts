// types/subscription.ts
export type SubscriptionTier = 'basic' | 'growth' | 'pro' | 'elite';

export interface SubscriptionFeatures {
  canFeatureTodayDeals: boolean;
  canFeatureBestSellers: boolean;
  canFeatureNewArrivals: boolean;
  canFeatureClearance: boolean;
  canFeatureGiftCards: boolean;
  maxTodayDealsPerMonth: number;
  maxBestSellersPerMonth: number;
  maxNewArrivalsPerMonth: number;
  maxClearanceItemsPerMonth: number;
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  basic: {
    canFeatureTodayDeals: false,
    canFeatureBestSellers: false,
    canFeatureNewArrivals: true,
    canFeatureClearance: false,
    canFeatureGiftCards: false,
    maxTodayDealsPerMonth: 0,
    maxBestSellersPerMonth: 0,
    maxNewArrivalsPerMonth: 5,
    maxClearanceItemsPerMonth: 0,
  },
  growth: {
    canFeatureTodayDeals: true,
    canFeatureBestSellers: true,
    canFeatureNewArrivals: true,
    canFeatureClearance: true,
    canFeatureGiftCards: false,
    maxTodayDealsPerMonth: 10,
    maxBestSellersPerMonth: 15,
    maxNewArrivalsPerMonth: 20,
    maxClearanceItemsPerMonth: 10,
  },
  pro: {
    canFeatureTodayDeals: true,
    canFeatureBestSellers: true,
    canFeatureNewArrivals: true,
    canFeatureClearance: true,
    canFeatureGiftCards: true,
    maxTodayDealsPerMonth: 30,
    maxBestSellersPerMonth: 50,
    maxNewArrivalsPerMonth: 100,
    maxClearanceItemsPerMonth: 30,
  },
  elite: {
    canFeatureTodayDeals: true,
    canFeatureBestSellers: true,
    canFeatureNewArrivals: true,
    canFeatureClearance: true,
    canFeatureGiftCards: true,
    maxTodayDealsPerMonth: 100,
    maxBestSellersPerMonth: 200,
    maxNewArrivalsPerMonth: 500,
    maxClearanceItemsPerMonth: 100,
  },
};