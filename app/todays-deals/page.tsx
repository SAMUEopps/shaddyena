// app/todays-deals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, Percent, ShoppingCart, Heart, Eye } from 'lucide-react';

interface DealProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  dealDiscount: number;
  dealExpiry: string;
  images: string[];
  shopName: string;
  slug: string;
  rating: { average: number; count: number };
}

export default function TodaysDealsPage() {
  const [products, setProducts] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchDeals();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/products/todays-deals');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCountdowns = () => {
    const newTimes: { [key: string]: string } = {};
    products.forEach(product => {
      if (product.dealExpiry) {
        const expiry = new Date(product.dealExpiry);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        
        if (diff <= 0) {
          newTimes[product._id] = 'Expired';
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimes[product._id] = `${hours}h ${minutes}m ${seconds}s`;
        }
      }
    });
    setTimeRemaining(newTimes);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 py-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
              <Flame className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Limited Time Only</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Today's Hottest Deals
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Flash sales and exclusive discounts — but hurry, these deals won't last!
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No active deals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Deal Badge */}
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      -{product.dealDiscount}%
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeRemaining[product._id] || 'Loading...'}
                    </div>
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-[var(--color-background-soft)]">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </Link>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-[var(--color-text-muted)] mb-2">
                    by {product.shopName}
                  </p>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-[var(--color-primary-alt)]">
                      KSh {calculateDiscountedPrice(product.price, product.dealDiscount).toLocaleString()}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)] line-through">
                      KSh {product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Rating */}
                  {product.rating && product.rating.count > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(product.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">({product.rating.count})</span>
                    </div>
                  )}

                  <button className="w-full py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}