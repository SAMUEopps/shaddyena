/*'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

interface ShopStats {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
}

interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  payoutMethod: string;
  totalEarned: number;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
  products: Product[];
  stats: ShopStats;
}

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchShopDetail();
    }
    // Load cart count
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    }
  }, [params.id]);

  const fetchShopDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shops/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shop');
      }
      
      setShop(data.shop);
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      alert('Shop not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem('cart');
    const currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItemIndex = currentCart.findIndex((item: any) => item._id === product._id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = currentCart.map((item: any, index: number) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Shop not found</h1>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header *
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
        <Link href="/cart" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          🛒 Cart ({cartCount})
        </Link>
      </div>

      {/* Shop Info *
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">🏪</span>
              <h1 className="text-3xl font-bold">{shop.businessName}</h1>
            </div>
            <p className="text-gray-600">👤 Owner: {shop.ownerName}</p>
            <p className="text-gray-600">📍 Location: {shop.businessLocation}</p>
            <p className="text-gray-600">📱 {shop.phoneNumber}</p>
            <p className="text-gray-600">💰 Payout: {shop.payoutMethod}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Earned</p>
            <p className="text-2xl font-bold text-green-600">
              KSh {shop.totalEarned?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Member since {new Date(shop.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats *
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{shop.stats.totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              KSh {shop.stats.totalRevenue?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{shop.stats.completedOrders}</p>
            <p className="text-sm text-gray-600">Completed Orders</p>
          </div>
        </div>
      </div>

      {/* Products *
      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Products ({shop.products.length})</h2>
        
        {shop.products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products available from this shop</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shop.products.map((product) => (
              <div key={product._id} className="border rounded-lg shadow hover:shadow-lg transition p-4">
                <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 h-10">{product.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-2xl font-bold text-blue-600">KSh {product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className={`mt-4 w-full px-4 py-2 rounded transition ${
                    product.stock > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

/*'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

interface ShopStats {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
}

interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  payoutMethod: string;
  totalEarned: number;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
  products: Product[];
  stats: ShopStats;
}

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchShopDetail();
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    }
  }, [params.id]);

  const fetchShopDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shops/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shop');
      }
      
      setShop(data.shop);
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      alert('Shop not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem('cart');
    const currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItemIndex = currentCart.findIndex((item: any) => item._id === product._id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = currentCart.map((item: any, index: number) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Shop not found</h1>
          <p className="text-muted mb-6">The shop you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Navigation Header *
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link 
            href="/" 
            className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <Link 
            href="/cart" 
            className="relative bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Shop Info Card *
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 mb-8 border border-surface">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-3">
                <span className="text-5xl lg:text-6xl">🏪</span>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary leading-tight">
                    {shop.businessName}
                  </h1>
                  <p className="text-muted flex items-center gap-2 mt-1">
                    <span>👤</span> Owner: {shop.ownerName}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <p className="text-muted flex items-center gap-2">
                  <span>📍</span> {shop.businessLocation}
                </p>
                <p className="text-muted flex items-center gap-2">
                  <span>📱</span> {shop.phoneNumber}
                </p>
                <p className="text-muted flex items-center gap-2 col-span-full">
                  <span>💰</span> Payout Method: {shop.payoutMethod}
                </p>
              </div>
            </div>

            <div className="bg-surface/30 rounded-xl p-5 sm:p-6 min-w-[140px] lg:min-w-[180px] border border-surface">
              <p className="text-sm text-muted font-medium">Total Earned</p>
              <p className="text-2xl sm:text-3xl font-black text-primary mt-1">
                KSh {shop.totalEarned?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted mt-3">
                Member since {new Date(shop.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Stats Grid *
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-surface">
            <div className="text-center p-3 bg-surface/20 rounded-xl">
              <p className="text-2xl sm:text-3xl font-black text-primary">{shop.stats.totalOrders}</p>
              <p className="text-sm text-muted font-medium">Total Orders</p>
            </div>
            <div className="text-center p-3 bg-surface/20 rounded-xl">
              <p className="text-2xl sm:text-3xl font-black text-accent-dark">
                KSh {shop.stats.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-muted font-medium">Total Revenue</p>
            </div>
            <div className="text-center p-3 bg-surface/20 rounded-xl col-span-2 md:col-span-1">
              <p className="text-2xl sm:text-3xl font-black text-secondary">{shop.stats.completedOrders}</p>
              <p className="text-sm text-muted font-medium">Completed Orders</p>
            </div>
          </div>
        </div>

        {/* Products Section *
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-secondary">
              📦 Products
              <span className="text-base font-medium text-muted ml-2">
                ({shop.products.length})
              </span>
            </h2>
          </div>
          
          {shop.products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-surface">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-muted text-lg">No products available from this shop</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {shop.products.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-surface hover:border-primary/20 group"
                >
                  <div className="h-36 sm:h-44 bg-surface rounded-xl flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                    📦
                  </div>
                  
                  <h3 className="font-bold text-base sm:text-lg mt-4 truncate text-secondary">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted text-sm line-clamp-2 h-10 sm:h-12 mt-1">
                    {product.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                    <span className="text-primary font-black text-lg sm:text-xl">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-muted' : 'text-red-500'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`mt-4 w-full py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                      product.stock > 0
                        ? 'bg-primary hover:bg-accent-dark text-white'
                        : 'bg-muted/30 text-muted cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/

// app/shops/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

interface ShopStats {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
}

interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  payoutMethod: string;
  profileImage?: string;
  coverImage?: string;
  totalEarned: number;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
  products: Product[];
  stats: ShopStats;
}

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchShopDetail();
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    }
  }, [params.id]);

  const fetchShopDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shd-api/api/shops/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch shop');
      }
      
      setShop(data.shop);
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      alert('Shop not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setAddingToCart(product._id);
    
    const savedCart = localStorage.getItem('cart');
    const currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItemIndex = currentCart.findIndex((item: any) => item._id === product._id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = currentCart.map((item: any, index: number) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Shop not found</h1>
          <p className="text-muted mb-6">The shop you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Header with Cover Image */}
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-primary/30 to-secondary/30 overflow-hidden">
          {shop.coverImage ? (
            <Image
              src={shop.coverImage}
              alt={shop.businessName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              🏪
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Link 
            href="/" 
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <Link 
            href="/cart" 
            className="relative bg-white/90 backdrop-blur-sm hover:bg-white text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-sm"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Shop Info - Overlaid on Cover */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 lg:-mt-24 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden flex-shrink-0">
                {shop.profileImage ? (
                  <Image
                    src={shop.profileImage}
                    alt={shop.businessName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    🏪
                  </div>
                )}
              </div>
            </div>

            {/* Shop Details */}
            <div className="flex-1 min-w-0 pb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                {shop.businessName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-white/90 drop-shadow-lg">
                <span className="flex items-center gap-1.5 text-sm sm:text-base">
                  👤 {shop.ownerName}
                </span>
                <span className="hidden sm:inline text-white/50">|</span>
                <span className="flex items-center gap-1.5 text-sm sm:text-base">
                  📍 {shop.businessLocation}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80 drop-shadow-lg">
                <span className="flex items-center gap-1.5 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  📱 {shop.phoneNumber}
                </span>
                <span className="flex items-center gap-1.5 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  💰 {shop.payoutMethod}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 pb-4 w-full sm:w-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center min-w-[80px] shadow-sm flex-1 sm:flex-none">
                <p className="text-xl sm:text-2xl font-black text-primary">{shop.stats.totalOrders}</p>
                <p className="text-xs text-muted font-medium">Orders</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center min-w-[100px] shadow-sm flex-1 sm:flex-none">
                <p className="text-xl sm:text-2xl font-black text-accent-dark">
                  KSh {shop.stats.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted font-medium">Revenue</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center min-w-[80px] shadow-sm flex-1 sm:flex-none">
                <p className="text-xl sm:text-2xl font-black text-secondary">{shop.stats.completedOrders}</p>
                <p className="text-xs text-muted font-medium">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-secondary">
            📦 Products
            <span className="text-base font-medium text-muted ml-2">
              ({shop.products.length})
            </span>
          </h2>
          {shop.products.length > 6 && (
            <Link 
              href={`/shops/${shop._id}/products`}
              className="text-primary hover:text-accent-dark font-medium transition-colors duration-200"
            >
              View All →
            </Link>
          )}
        </div>
        
        {shop.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-muted text-lg">No products available from this shop</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {shop.products.slice(0, 8).map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group"
              >
                {/* Product Image */}
                <div className="relative h-44 sm:h-52 bg-gradient-to-br from-surface to-background overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                      📦
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {product.stock <= 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Out of Stock
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 5 && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Low Stock
                    </div>
                  )}
                </div>
                
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-base sm:text-lg truncate text-secondary group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted text-sm line-clamp-2 h-10 sm:h-12 mt-1">
                    {product.description || 'No description available'}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                    <span className="text-primary font-black text-lg sm:text-xl">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted">
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`mt-4 w-full py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] relative ${
                      product.stock > 0
                        ? 'bg-primary hover:bg-accent-dark text-white'
                        : 'bg-muted/30 text-muted cursor-not-allowed'
                    }`}
                  >
                    {addingToCart === product._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Products Link */}
        {shop.products.length > 8 && (
          <div className="text-center mt-8">
            <Link
              href={`/shops/${shop._id}/products`}
              className="inline-block bg-primary hover:bg-accent-dark text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              View All {shop.products.length} Products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}