// components/New/components/ProductShowcase.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Eye,
  Sparkles,
  TrendingUp,
  Zap,
  ChevronRight,
  Clock,
  Truck,
  Shield
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating?: {
    average: number;
    count: number;
  };
  shopId: {
    _id: string;
    businessName: string;
  };
  vendorId: string;
  isActive: boolean;
  isApproved: boolean;
  stock: number;
}

const ProductShowcase = () => {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=8');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Section Header */}
      <div className="relative mb-12">
        {/*<div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Trending Now</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-alt)] mb-3">
            Featured Products
          </h2>
          
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Discover our hand-picked selection of premium products, just for you
          </p>
        </div>*/}

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {['Featured', 'New Arrivals', 'Best Sellers', 'On Sale'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.toLowerCase()
                  ? 'bg-[var(--color-primary-alt)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-48 bg-[var(--color-border)]"></div>
              <div className="p-4">
                <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-[var(--color-border)] rounded-xl flex-1"></div>
                  <div className="h-10 w-10 bg-[var(--color-border)] rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const discount = product.originalPrice 
                ? getDiscountPercentage(product.originalPrice, product.price)
                : 0;

              return (
                <div
                  key={product._id}
                  className="group relative"
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Product Card */}
                  <div className="relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                    
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)] opacity-30" />
                        </div>
                      )}

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                          -{discount}%
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(product._id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.includes(product._id) 
                                ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                                : 'text-[var(--color-text-muted)]'
                            }`} 
                          />
                        </button>
                        
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform">
                          <Eye className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" />
                        </button>
                      </div>

                      {/* Stock Status */}
                      {product.stock < 10 && (
                        <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Only {product.stock} left
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Category & Shop */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        {product.shopId && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            by {product.shopId.businessName}
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 line-clamp-2 h-10">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {product.rating && product.rating.count > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating?.average || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-[var(--color-border)]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            ({product.rating.count})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-[var(--color-primary-alt)]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-xs text-[var(--color-text-muted)] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-xs text-[var(--color-success)] font-medium">
                              Save {formatPrice(product.originalPrice - product.price)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-[var(--color-primary-alt)] text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                        
                        <button className="p-2.5 border border-[var(--color-border)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110">
                          <Zap className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect - Animated Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text)]">Free Shipping</h4>
                <p className="text-xs text-[var(--color-text-muted)]">On orders over $50</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text)]">Secure Payments</h4>
                <p className="text-xs text-[var(--color-text-muted)]">100% protected</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text)]">Best Prices</h4>
                <p className="text-xs text-[var(--color-text-muted)]">Price match guarantee</p>
              </div>
            </div>
          </div>

          {/* View All CTA */}
          <div className="relative mt-12 text-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
            </div>
            
            <Link
              href="/products"
              className="relative inline-flex items-center gap-3 bg-[var(--color-primary-alt)] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 transform hover:scale-105 group"
            >
              <span>View All Products</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="absolute -top-2 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-primary)]"></span>
              </span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductShowcase;