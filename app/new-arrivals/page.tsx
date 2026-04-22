// app/new-arrivals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Clock, ShoppingCart, Heart, Filter, Calendar } from 'lucide-react';

interface NewArrivalProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shopName: string;
  createdAt: string;
  rating: { average: number; count: number };
  slug: string;
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<NewArrivalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchNewArrivals();
  }, [category]);

  const fetchNewArrivals = async () => {
    setLoading(true);
    try {
      const url = category 
        ? `/api/products/new-arrivals?category=${encodeURIComponent(category)}`
        : '/api/products/new-arrivals';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products);
      
      // Extract unique categories
      //const uniqueCategories = [...new Set(data.products.map((p: any) => p.category))];
      const uniqueCategories = [
        ...new Set<string>(data.products.map((p: any) => p.category))
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
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
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 py-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Fresh & New</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              New Arrivals
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Be the first to discover the latest products from your favorite shops
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !category 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No new arrivals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                {/* New Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    isToday(product.createdAt) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    {isToday(product.createdAt) ? 'NEW TODAY' : 'NEW'}
                  </div>
                </div>
                
                {/* Time Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(product.createdAt)}
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
                    <span className="text-xl font-bold text-[var(--color-primary-alt)]">
                      KSh {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-[var(--color-text-muted)] line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

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