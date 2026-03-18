// components/New/components/ShopPreview.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Store, 
  MapPin, 
  Star, 
  ChevronRight,
  Heart,
  Phone,
  Verified,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface Shop {
  _id: string;
  businessName: string;
  businessType: string;
  description: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  isVerified: boolean;
  isActive: boolean;
}

const ShopPreview = () => {
  const [mounted, setMounted] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shops?limit=4'); // Get only 4 shops for preview
      const data = await response.json();
      
      if (data.shops) {
        setShops(data.shops);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (shopId: string) => {
    setFavorites(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId)
        : [...prev, shopId]
    );
  };

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header with Animation */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Store className="w-32 h-32 text-[var(--color-primary)]" />
        </div>
        
        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Trusted Marketplace
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-alt)] mb-3">
            Featured Shops
          </h2>
          
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Discover our curated selection of premium shops, offering the best products and services
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[var(--color-primary-alt)]/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-40 bg-[var(--color-border)]"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-border)]"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[var(--color-border)] rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[var(--color-border)] rounded w-full"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Shops Grid */}
          {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="group relative"
                onMouseEnter={() => setHoveredId(shop._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Main Shop Card *
                <div className="relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                  
                  {/* Favorite Button *
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(shop._id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(shop._id) 
                          ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                          : 'text-[var(--color-text-muted)]'
                      }`} 
                    />
                  </button>

                  {/* Banner Image *
                  <div className="relative h-32 overflow-hidden">
                    {shop.banner ? (
                      <Image
                        src={shop.banner}
                        alt={shop.businessName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent"></div>
                    
                    {/* Verified Badge *
                    {shop.isVerified && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Verified className="w-3 h-3 fill-[var(--color-primary)]" />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Shop Info *
                  <div className="relative px-4 pb-4">
                    {/* Logo *
                    <div className="relative -mt-8 mb-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-4 border-[var(--color-surface)] shadow-xl bg-[var(--color-surface)]">
                        {shop.logo ? (
                          <Image
                            src={shop.logo}
                            alt={shop.businessName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center">
                            <Store className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shop Details *
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-[var(--color-primary-alt)] mb-1 line-clamp-1">
                        {shop.businessName}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] mb-2">
                        {shop.businessType}
                      </p>
                      
                      {/* Rating *
                      {shop.rating && shop.rating.count > 0 && (
                        <div className="flex items-center gap-1 bg-[var(--color-primary-soft)]/20 px-2 py-1 rounded-lg w-fit">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-[var(--color-text)]">
                            {shop.rating.average.toFixed(1)}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            ({shop.rating.count})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description *
                    <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2">
                      {shop.description || 'No description available'}
                    </p>

                    {/* Location *
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-3">
                      <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                      <span className="line-clamp-1">
                        {shop.location.city}, {shop.location.country}
                      </span>
                    </div>

                    {/* Action Button *
                    <div className="flex items-center justify-between">
                      <button className="flex-1 bg-[var(--color-primary-alt)] text-white py-2 rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transform hover:-translate-y-0.5">
                        Visit Shop
                      </button>
                      
                      <button className="p-2 ml-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect - Animated Border *
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
                  
                  {/* Shine Effect on Hover *
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>*/}

          {/* Shops Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {shops.map((shop) => (
    <Link
      key={shop._id}
      href={`/shops/${shop._id}`}
      className="group relative"
      onMouseEnter={() => setHoveredId(shop._id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Main Shop Card */}
      <div className="relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(shop._id);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart 
            className={`w-4 h-4 ${
              favorites.includes(shop._id) 
                ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                : 'text-[var(--color-text-muted)]'
            }`} 
          />
        </button>

        {/* Banner Image */}
        <div className="relative h-32 overflow-hidden">
          {shop.banner ? (
            <Image
              src={shop.banner}
              alt={shop.businessName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent"></div>
          
          {/* Verified Badge */}
          {shop.isVerified && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Verified className="w-3 h-3 fill-[var(--color-primary)]" />
              Verified
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="relative px-4 pb-4">
          {/* Logo - Now Round */}
          <div className="relative -mt-8 mb-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-[var(--color-surface)] shadow-xl bg-[var(--color-surface)]">
              {shop.logo ? (
                <Image
                  src={shop.logo}
                  alt={shop.businessName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Shop Details */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-[var(--color-primary-alt)] mb-1 line-clamp-1">
              {shop.businessName}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-2">
              {shop.businessType}
            </p>
            
            {/* Rating */}
            {shop.rating && shop.rating.count > 0 && (
              <div className="flex items-center gap-1 bg-[var(--color-primary-soft)]/20 px-2 py-1 rounded-lg w-fit">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-[var(--color-text)]">
                  {shop.rating.average.toFixed(1)}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  ({shop.rating.count})
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2">
            {shop.description || 'No description available'}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-3">
            <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
            <span className="line-clamp-1">
              {shop.location.city}, {shop.location.country}
            </span>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <button className="flex-1 bg-[var(--color-primary-alt)] text-white py-2 rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transform hover:-translate-y-0.5">
              Visit Shop
            </button>
            
            <button className="p-2 ml-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hover Effect - Animated Border */}
        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
        
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
        </div>
      </div>
    </Link>
  ))}
</div>

          {/* View All Shops CTA */}
          <div className="relative mt-12 text-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
            </div>
            
            <Link
              href="/shops"
              className="relative inline-flex items-center gap-3 bg-[var(--color-primary-alt)] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 transform hover:scale-105 group"
            >
              <span>Explore All Shops</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="absolute -top-2 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-primary)]"></span>
              </span>
            </Link>
            
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">
              Join 1000+ trusted vendors on Shaddyna
            </p>
          </div>
        </>
      )}
    </section>
  );
};

export default ShopPreview;