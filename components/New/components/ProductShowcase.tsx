// components/New/components/ProductShowcase.tsx
/*'use client';

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

      {/* Section Header *
      <div className="relative mb-12">
        {/* Category Tabs *
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

      {/* Loading State *
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
          {/* Products Grid *
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
                  {/* Product Card *
                  <div className="relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                    
                    {/* Image Container *
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

                      {/* Discount Badge *
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                          -{discount}%
                        </div>
                      )}

                      {/* Quick Action Buttons *
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

                      {/* Stock Status *
                      {product.stock < 10 && (
                        <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Only {product.stock} left
                        </div>
                      )}
                    </div>

                    {/* Product Info *
                    <div className="p-4">
                      {/* Category & Shop *
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

                      {/* Product Name *
                      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 line-clamp-2 h-10">
                        {product.name}
                      </h3>

                      {/* Rating *
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

                      {/* Price *
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

                      {/* Action Buttons *
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

                    {/* Hover Effect - Animated Border *
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Shine Effect *
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Bar *
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

          {/* View All CTA *
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

export default ProductShowcase;*/

// components/New/components/ProductShowcase.tsx
/*'use client';

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
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

      {/* Section Header *
      <div className="relative mb-6 sm:mb-8 lg:mb-12">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-primary-alt)] mb-1 sm:mb-2">
            Featured Products
          </h2>
          <p className="text-xs xs:text-sm text-[var(--color-text-muted)]">
            Discover amazing products from our vendors
          </p>
        </div>

        {/* Category Tabs - Scrollable on mobile *
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-1.5 xs:gap-2 sm:gap-2 mt-4 sm:mt-6 lg:mt-8 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['Featured', 'New Arrivals', 'Best Sellers', 'On Sale'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-3 xs:px-4 sm:px-5 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
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

      {/* Loading State *
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-24 xs:h-28 sm:h-32 lg:h-48 bg-[var(--color-border)]"></div>
              <div className="p-2 xs:p-2.5 sm:p-3 lg:p-4">
                <div className="h-2.5 xs:h-3 sm:h-4 bg-[var(--color-border)] rounded w-3/4 mb-1.5 xs:mb-2"></div>
                <div className="h-2 xs:h-2.5 sm:h-3 bg-[var(--color-border)] rounded w-1/2 mb-2 xs:mb-2.5"></div>
                <div className="h-3 xs:h-4 sm:h-5 lg:h-6 bg-[var(--color-border)] rounded w-1/3 mb-2 xs:mb-2.5"></div>
                <div className="flex gap-1.5 xs:gap-2">
                  <div className="h-6 xs:h-7 sm:h-8 lg:h-10 bg-[var(--color-border)] rounded-lg xs:rounded-xl flex-1"></div>
                  <div className="h-6 xs:h-7 sm:h-8 lg:h-10 w-6 xs:w-7 sm:w-8 lg:w-10 bg-[var(--color-border)] rounded-lg xs:rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Products Grid - 2 columns on mobile, 4 on large screens *
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
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
                  {/* Product Card *
                  <div className="relative bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                    
                    {/* Image Container - Responsive height *
                    <div className="relative h-20 xs:h-24 sm:h-28 lg:h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 sm:duration-700"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-[var(--color-text-muted)] opacity-30" />
                        </div>
                      )}

                      {/* Discount Badge *
                      {discount > 0 && (
                        <div className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 sm:top-3 sm:left-3 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-0.5 sm:py-1 rounded-md xs:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-bold shadow-md">
                          -{discount}%
                        </div>
                      )}

                      {/* Quick Action Buttons *
                      <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-3 sm:right-3 flex flex-col gap-1 xs:gap-1 sm:gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(product._id);
                          }}
                          className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md xs:rounded-lg shadow-md hover:scale-110 transition-transform"
                        >
                          <Heart 
                            className={`w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ${
                              favorites.includes(product._id) 
                                ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                                : 'text-[var(--color-text-muted)]'
                            }`} 
                          />
                        </button>
                        
                        <button className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md xs:rounded-lg shadow-md hover:scale-110 transition-transform">
                          <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" />
                        </button>
                      </div>

                      {/* Stock Status *
                      {product.stock < 10 && (
                        <div className="absolute bottom-1 left-1 xs:bottom-1.5 xs:left-1.5 sm:bottom-3 sm:left-3 bg-amber-500/90 backdrop-blur-sm text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-md xs:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium flex items-center gap-0.5 xs:gap-1">
                          <Clock className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden xs:inline">Only {product.stock} left</span>
                          <span className="xs:hidden">{product.stock} left</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info - Responsive padding *
                    <div className="p-1.5 xs:p-2 sm:p-2.5 lg:p-4">
                      {/* Category & Shop *
                      <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2">
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[70px] xs:max-w-[90px] sm:max-w-none">
                          {product.category}
                        </span>
                        {product.shopId && (
                          <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none">
                            {product.shopId.businessName}
                          </span>
                        )}
                      </div>

                      {/* Product Name *
                      <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 h-6 xs:h-7 sm:h-8 lg:h-10">
                        {product.name}
                      </h3>

                      {/* Rating - Simplified on mobile *
                      {product.rating && product.rating.count > 0 && (
                        <div className="flex items-center gap-0.5 xs:gap-0.5 sm:gap-1 mb-1 xs:mb-1.5 sm:mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 ${
                                  i < Math.floor(product.rating?.average || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-[var(--color-border)]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] hidden xs:inline">
                            ({product.rating.count})
                          </span>
                        </div>
                      )}

                      {/* Price *
                      <div className="flex items-baseline gap-1 xs:gap-1 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-2.5 lg:mb-3 flex-wrap">
                        <span className="text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-[var(--color-primary-alt)]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-success)] font-medium hidden xs:inline">
                              Save {formatPrice(product.originalPrice - product.price)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action Buttons *
                      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                        <button className="flex-1 bg-[var(--color-primary-alt)] text-white py-1 xs:py-1.5 sm:py-2 lg:py-2.5 rounded-md xs:rounded-lg sm:rounded-xl text-[8px] xs:text-[10px] sm:text-xs lg:text-sm font-medium hover:shadow-md hover:shadow-[var(--color-primary)]/30 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2">
                          <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Add</span>
                          <span className="xs:hidden">+</span>
                        </button>
                        
                        <button className="p-1 xs:p-1.5 sm:p-2 lg:p-2.5 border border-[var(--color-border)] rounded-md xs:rounded-lg sm:rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300">
                          <Zap className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect - Hidden on mobile *
                    <div className="absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none hidden sm:block"></div>
                    
                    {/* Shine Effect - Hidden on mobile *
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden hidden sm:block">
                      <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Bar - Responsive grid *
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12">
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 sm:p-4 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center flex-shrink-0">
                <Truck className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">Free Shipping</h4>
                <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">On orders over $50</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 sm:p-4 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">Secure Payments</h4>
                <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">100% protected</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 sm:p-4 flex items-center gap-2 xs:gap-2.5 sm:gap-3 xs:col-span-2 sm:col-span-1">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">Best Prices</h4>
                <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">Price match guarantee</p>
              </div>
            </div>
          </div>

          {/* View All CTA *
          <div className="relative mt-8 sm:mt-10 lg:mt-12 text-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-full blur-2xl sm:blur-3xl"></div>
            </div>
            
            <Link
              href="/products"
              className="relative inline-flex items-center gap-1.5 sm:gap-3 bg-[var(--color-primary-alt)] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 transform hover:scale-105 group"
            >
              <span className="hidden xs:inline">View All Products</span>
              <span className="xs:hidden">All Products</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-[var(--color-primary)]"></span>
              </span>
            </Link>
          </div>
        </>
      )}

      {/* Hide scrollbar CSS - Add to your global styles or component style *
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductShowcase;*/

// components/New/components/ProductShowcase.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Shield,
  CheckCircle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

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
  sku?: string;
}

const ProductShowcase = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('featured');
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  
  const { addToCart, totalItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      const wishlistItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder-image.jpg',
        vendorId: product.vendorId,
        shopId: product.shopId?._id || '',
      };
      addToWishlist(wishlistItem);
    }
  };

  const handleAddToCart = (product: Product) => {
    // Transform product to CartItem format
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '/placeholder-image.jpg',
      vendorId: product.vendorId,
      shopId: product.shopId?._id || '',
      sku: product.sku || `SKU-${product._id}`,
    };
    
    addToCart(cartItem);
    
    // Show success feedback
    setAddedToCart(product._id);
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleQuickView = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-12 lg:py-4">

      {/* Section Header with Cart Counter */}
      {/*<div className="relative mb-6 sm:mb-8 lg:mb-12">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-primary-alt)] mb-1 sm:mb-2">
            Featured Products
          </h2>
          <p className="text-xs xs:text-sm text-[var(--color-text-muted)]">
            Discover amazing products from our vendors
          </p>
          {totalItems > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-primary-soft)]/20 rounded-full">
              <ShoppingBag className="w-3 h-3 text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-text)]">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </span>
            </div>
          )}
        </div>

        {/* Category Tabs - Scrollable on mobile *
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-1.5 xs:gap-2 sm:gap-2 mt-4 sm:mt-6 lg:mt-8 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['Featured', 'New Arrivals', 'Best Sellers', 'On Sale'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-3 xs:px-4 sm:px-5 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.toLowerCase()
                  ? 'bg-[var(--color-primary-alt)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>*/}

      <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
        {/* Title */}
        <div>
          <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-primary-alt)] leading-tight">
            Featured Products
          </h2>
        </div>
        
        {/* Button */}
        <Link 
          href="/products"
          className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 lg:px-5 py-1 xs:py-1.5 sm:py-2 lg:py-2.5 rounded-full border border-[var(--color-primary-alt)] bg-[var(--color-surface)] text-[var(--color-primary-alt)] text-[9px] xs:text-[10px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:bg-[var(--color-primary-alt)] hover:text-white hover:scale-105"
        >
          <span className="hidden xs:inline">All Products</span>
          <span className="xs:hidden">All</span>
          <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 transition-transform duration-300" />
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-24 xs:h-28 sm:h-32 lg:h-48 bg-[var(--color-border)]"></div>
              <div className="p-2 xs:p-2.5 sm:p-3 lg:p-4">
                <div className="h-2.5 xs:h-3 sm:h-4 bg-[var(--color-border)] rounded w-3/4 mb-1.5 xs:mb-2"></div>
                <div className="h-2 xs:h-2.5 sm:h-3 bg-[var(--color-border)] rounded w-1/2 mb-2 xs:mb-2.5"></div>
                <div className="h-3 xs:h-4 sm:h-5 lg:h-6 bg-[var(--color-border)] rounded w-1/3 mb-2 xs:mb-2.5"></div>
                <div className="flex gap-1.5 xs:gap-2">
                  <div className="h-6 xs:h-7 sm:h-8 lg:h-10 bg-[var(--color-border)] rounded-lg xs:rounded-xl flex-1"></div>
                  <div className="h-6 xs:h-7 sm:h-8 lg:h-10 w-6 xs:w-7 sm:w-8 lg:w-10 bg-[var(--color-border)] rounded-lg xs:rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Products Grid - 2 columns on mobile, 4 on large screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => {
              const discount = product.originalPrice 
                ? getDiscountPercentage(product.originalPrice, product.price)
                : 0;
              const isAddedToCart = addedToCart === product._id;
              const isInWishlistState = isInWishlist(product._id);

              return (
                <div
                  key={product._id}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Card */}
                  <div className="relative bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                    
                    {/* Image Container - Responsive height */}
                    <div className="relative h-20 xs:h-24 sm:h-28 lg:h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 sm:duration-700"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-[var(--color-text-muted)] opacity-30" />
                        </div>
                      )}

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 sm:top-3 sm:left-3 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-0.5 sm:py-1 rounded-md xs:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-bold shadow-md">
                          -{discount}%
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-3 sm:right-3 flex flex-col gap-1 xs:gap-1 sm:gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWishlistToggle(product);
                          }}
                          className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md xs:rounded-lg shadow-md hover:scale-110 transition-transform"
                          aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart 
                            className={`w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ${
                              isInWishlistState 
                                ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                                : 'text-[var(--color-text-muted)]'
                            }`} 
                          />
                        </button>
                        
                        <button 
                          onClick={(e) => handleQuickView(e, product._id)}
                          className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md xs:rounded-lg shadow-md hover:scale-110 transition-transform"
                          aria-label="Quick view"
                        >
                          <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" />
                        </button>
                      </div>

                      {/* Stock Status */}
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute bottom-1 left-1 xs:bottom-1.5 xs:left-1.5 sm:bottom-3 sm:left-3 bg-amber-500/90 backdrop-blur-sm text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-md xs:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium flex items-center gap-0.5 xs:gap-1">
                          <Clock className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden xs:inline">Only {product.stock} left</span>
                          <span className="xs:hidden">{product.stock} left</span>
                        </div>
                      )}

                      {/* Out of Stock Overlay */}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info - Responsive padding */}
                    <div className="p-1.5 xs:p-2 sm:p-2.5 lg:p-4">
                      {/* Category & Shop */}
                      <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2">
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[70px] xs:max-w-[90px] sm:max-w-none">
                          {product.category}
                        </span>
                        {product.shopId && (
                          <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none">
                            {product.shopId.businessName}
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 h-6 xs:h-7 sm:h-8 lg:h-10 group-hover:text-[var(--color-primary)] transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating - Simplified on mobile */}
                      {product.rating && product.rating.count > 0 && (
                        <div className="flex items-center gap-0.5 xs:gap-0.5 sm:gap-1 mb-1 xs:mb-1.5 sm:mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 ${
                                  i < Math.floor(product.rating?.average || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-[var(--color-border)]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] hidden xs:inline">
                            ({product.rating.count})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-1 xs:gap-1 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-2.5 lg:mb-3 flex-wrap">
                        <span className="text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-[var(--color-primary-alt)]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-success)] font-medium hidden xs:inline">
                              Save {formatPrice(product.originalPrice - product.price)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock === 0}
                          className={`flex-1 py-1 xs:py-1.5 sm:py-2 lg:py-2.5 rounded-md xs:rounded-lg sm:rounded-xl text-[8px] xs:text-[10px] sm:text-xs lg:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
                            product.stock === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isAddedToCart
                              ? 'bg-green-500 text-white hover:shadow-md hover:shadow-green-500/30'
                              : 'bg-[var(--color-primary-alt)] text-white hover:shadow-md hover:shadow-[var(--color-primary)]/30'
                          }`}
                        >
                          {isAddedToCart ? (
                            <>
                              <CheckCircle className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Added!</span>
                              <span className="xs:hidden">✓</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                              </span>
                              <span className="xs:hidden">
                                {product.stock === 0 ? 'Sold' : '+'}
                              </span>
                            </>
                          )}
                        </button>
                        
                        {/*<button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock === 0}
                          className={`p-1 xs:p-1.5 sm:p-2 lg:p-2.5 border rounded-md xs:rounded-lg sm:rounded-xl transition-all duration-300 ${
                            product.stock === 0
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]'
                          }`}
                        >
                          <Zap className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                        </button>*/}
                      </div>
                    </div>

                    {/* Hover Effect - Hidden on mobile */}
                    <div className="absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none hidden sm:block"></div>
                    
                    {/* Shine Effect - Hidden on mobile */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden hidden sm:block">
                      <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Bar - Responsive grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12">
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 sm:p-4 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center flex-shrink-0">
                <Truck className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">Free Shipping</h4>
                <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">On orders over $50</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 sm:p-4 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">Secure Payments</h4>
                <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">100% protected</p>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 sm:p-4 flex items-center gap-2 xs:gap-2.5 sm:gap-3 xs:col-span-2 sm:col-span-1">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-soft)]/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">Best Prices</h4>
                <p className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">Price match guarantee</p>
              </div>
            </div>
          </div>

          {/* View All CTA */}
          {/*<div className="relative mt-8 sm:mt-10 lg:mt-12 text-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-full blur-2xl sm:blur-3xl"></div>
            </div>
            
            <Link
              href="/products"
              className="relative inline-flex items-center gap-1.5 sm:gap-3 bg-[var(--color-primary-alt)] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg sm:hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 transform hover:scale-105 group"
            >
              <span className="hidden xs:inline">View All Products</span>
              <span className="xs:hidden">All Products</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-[var(--color-primary)]"></span>
              </span>
            </Link>
          </div>*/}
        </>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductShowcase;