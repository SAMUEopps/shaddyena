// components/New/components/ShopPreview.tsx
/*'use client';

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
      {/* Loading State *
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
          {/* Shops Grid *
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {/* Logo - Now Round *
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
          </div>

          {/* View All Shops CTA *
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

export default ShopPreview;*/

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
      const response = await fetch('/api/shops?limit=4');
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
    <section className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-0 sm:py-12 lg:py-0">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary-alt)]">
            Featured Shops
          </h2>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* All Shops Link */}
        <Link 
          href="/shops"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--color-primary-alt)] bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[var(--color-primary-alt)] hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-primary)]/20 group"
        >
          <span className="text-sm text-[var(--color-primary-alt)] hover:text-white font-semibold tracking-wide">All Shops</span>
          <ChevronRight className="w-5 h-5 text-[var(--color-primary-alt)] group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" />
        </Link>
      </div>
    </div>
      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-16 xs:h-20 sm:h-24 lg:h-32 bg-[var(--color-border)]"></div>
              <div className="p-2 xs:p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-1.5 xs:mb-2 sm:mb-3">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-border)]"></div>
                  <div className="flex-1">
                    <div className="h-2.5 xs:h-3 sm:h-4 bg-[var(--color-border)] rounded w-3/4 mb-1"></div>
                    <div className="h-2 xs:h-2.5 sm:h-3 bg-[var(--color-border)] rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
                  <div className="h-2 xs:h-2.5 sm:h-3 bg-[var(--color-border)] rounded w-full"></div>
                  <div className="h-2 xs:h-2.5 sm:h-3 bg-[var(--color-border)] rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Shops Grid - Responsive: 2 columns on mobile, 4 on large screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="group relative"
                onMouseEnter={() => setHoveredId(shop._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Main Shop Card */}
                <div className="relative bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                  
                  {/* Favorite Button - Adjusted for mobile */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(shop._id);
                    }}
                    className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 z-10 p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ${
                        favorites.includes(shop._id) 
                          ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                          : 'text-[var(--color-text-muted)]'
                      }`} 
                    />
                  </button>

                  {/* Banner Image - Responsive height */}
                  <div className="relative h-14 xs:h-16 sm:h-20 lg:h-32 overflow-hidden">
                    {shop.banner ? (
                      <Image
                        src={shop.banner}
                        alt={shop.businessName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 sm:duration-700"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent"></div>
                    
                    {/* Verified Badge - Responsive sizing */}
                    {shop.isVerified && (
                      <div className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-0.5 sm:py-1 rounded-full font-bold flex items-center gap-0.5 xs:gap-0.5 sm:gap-1 shadow-md text-[8px] xs:text-[10px] sm:text-xs">
                        <Verified className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 fill-[var(--color-primary)]" />
                        <span className="hidden xs:inline">Verified</span>
                        <span className="xs:hidden">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Shop Info - Responsive padding and sizing */}
                  <div className="relative px-1.5 xs:px-2 sm:px-3 lg:px-4 pb-1.5 xs:pb-2 sm:pb-3 lg:pb-4">
                    {/* Logo - Responsive size */}
                    <div className="relative -mt-3 xs:-mt-4 sm:-mt-6 lg:-mt-8 mb-1 xs:mb-1.5 sm:mb-2 lg:mb-3">
                      <div className="relative w-7 h-7 xs:w-9 xs:h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 xs:border-2 sm:border-4 border-[var(--color-surface)] shadow-md sm:shadow-xl bg-[var(--color-surface)]">
                        {shop.logo ? (
                          <Image
                            src={shop.logo}
                            alt={shop.businessName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 28px, (max-width: 1024px) 48px, 64px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center">
                            <Store className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shop Details - Responsive text sizes */}
                    <div className="mb-1 xs:mb-1.5 sm:mb-2 lg:mb-3">
                      <h3 className="text-[10px] xs:text-xs sm:text-sm lg:text-lg font-bold text-[var(--color-primary-alt)] mb-0.5 xs:mb-0.5 sm:mb-1 line-clamp-1">
                        {shop.businessName}
                      </h3>
                      <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-0.5 xs:mb-1 sm:mb-2 line-clamp-1">
                        {shop.businessType}
                      </p>
                      
                      {/* Rating - Responsive sizing */}
                      {shop.rating && shop.rating.count > 0 && (
                        <div className="flex items-center gap-0.5 xs:gap-0.5 sm:gap-1 bg-[var(--color-primary-soft)]/20 px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-lg w-fit">
                          <Star className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[8px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">
                            {shop.rating.average.toFixed(1)}
                          </span>
                          <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] hidden xs:inline">
                            ({shop.rating.count})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description - Hide on smallest screens, show on larger */}
                    <p className="hidden xs:block text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2 lg:mb-3 line-clamp-2">
                      {shop.description || 'No description available'}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-1 xs:mb-1.5 sm:mb-2 lg:mb-3">
                      <MapPin className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 text-[var(--color-primary)] flex-shrink-0" />
                      <span className="line-clamp-1">
                        {shop.location.city}, {shop.location.country}
                      </span>
                    </div>

                    {/* Action Buttons - Responsive layout */}
                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                      <button className="flex-1 bg-[var(--color-primary-alt)] text-white py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-md hover:shadow-[var(--color-primary)]/20">
                        <span className="hidden xs:inline">Visit</span>
                        <span className="xs:hidden">→</span>
                      </button>
                      
                      <button className="p-1 xs:p-1.5 sm:p-2 border border-[var(--color-border)] rounded-md xs:rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300">
                        <Phone className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect - Simplified for mobile */}
                  <div className={`absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-300 pointer-events-none hidden sm:block`}></div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default ShopPreview;