// app/best-sellers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Star, ShoppingCart, Crown } from 'lucide-react';

interface BestSellerProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  shopName: string;
  rating: { average: number; count: number };
  totalSales: number;
  slug: string;
}

export default function BestSellersPage() {
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    fetchBestSellers();
  }, [timeframe]);

  const fetchBestSellers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/best-sellers?timeframe=${timeframe}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Crown className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Crown className="w-5 h-5 text-amber-600" />;
    return <span className="text-lg font-bold text-[var(--color-text-muted)]">#{index + 1}</span>;
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
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-teal-500 py-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Customer Favorites</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Best Sellers
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              The products everyone's buying — join the trend and see what's popular
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center gap-3">
          {[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'all', label: 'All Time' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                timeframe === option.value
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No best sellers data available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product._id} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-background-soft)] rounded-xl">
                    {getRankIcon(index)}
                  </div>

                  {/* Image */}
                  <Link href={`/product/${product.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--color-background-soft)]">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors text-lg mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[var(--color-text-muted)] mb-2">by {product.shopName}</p>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(product.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">({product.rating.count})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">{product.totalSales}+ sold</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[var(--color-primary-alt)]">
                        KSh {product.price.toLocaleString()}
                      </span>
                      <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}