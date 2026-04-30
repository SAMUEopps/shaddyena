// types/subscription.ts
/*export type SubscriptionTier = 'basic' | 'growth' | 'pro' | 'elite';

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
  maxGiftCardsPerMonth: number; // <-- ADD THIS
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
    maxGiftCardsPerMonth: 0, // <-- ADD THIS
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
    maxGiftCardsPerMonth: 0, // <-- ADD THIS
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
    maxGiftCardsPerMonth: 50, // <-- ADD THIS
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
    maxGiftCardsPerMonth: 200, // <-- ADD THIS
  },
};*/


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
  maxGiftCardsPerMonth: number;
  maxProducts: number;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
}

// Default features - will be overridden by DB plans
export const DEFAULT_SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
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
    maxGiftCardsPerMonth: 0,
    maxProducts: 50,
    prioritySupport: false,
    advancedAnalytics: false,
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
    maxGiftCardsPerMonth: 0,
    maxProducts: 200,
    prioritySupport: true,
    advancedAnalytics: false,
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
    maxGiftCardsPerMonth: 50,
    maxProducts: 500,
    prioritySupport: true,
    advancedAnalytics: true,
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
    maxGiftCardsPerMonth: 200,
    maxProducts: 999999,
    prioritySupport: true,
    advancedAnalytics: true,
  },
};