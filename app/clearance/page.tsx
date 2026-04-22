// app/clearance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Percent, Package, AlertTriangle, ShoppingCart, Filter, TrendingDown } from 'lucide-react';

interface ClearanceProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  dealDiscount: number;
  stock: number;
  images: string[];
  shopName: string;
  clearanceReason: string;
  rating: { average: number; count: number };
  slug: string;
}

export default function ClearancePage() {
  const [products, setProducts] = useState<ClearanceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchClearanceItems();
  }, [reason]);

  const fetchClearanceItems = async () => {
    setLoading(true);
    try {
      const url = reason 
        ? `/api/products/clearance?reason=${encodeURIComponent(reason)}`
        : '/api/products/clearance';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching clearance items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      overstock: 'Overstock Sale',
      old_inventory: 'Old Inventory',
      seasonal: 'Seasonal Clearance',
      discontinued: 'Discontinued'
    };
    return labels[reason] || 'Clearance';
  };

  const getReasonColor = (reason: string) => {
    const colors: Record<string, string> = {
      overstock: 'bg-blue-500',
      old_inventory: 'bg-orange-500',
      seasonal: 'bg-green-500',
      discontinued: 'bg-red-500'
    };
    return colors[reason] || 'bg-gray-500';
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
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 py-12">
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
              <Percent className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Big Savings</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Clearance Sale
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Massive discounts on select items — grab them before they're gone!
            </p>
          </div>
        </div>
      </div>

      {/* Reason Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
          <button
            onClick={() => setReason('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !reason 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
            }`}
          >
            All Clearance
          </button>
          {['overstock', 'old_inventory', 'seasonal', 'discontinued'].map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                reason === r 
                  ? `${getReasonColor(r)} text-white` 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)]'
              }`}
            >
              {getReasonLabel(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No clearance items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                {/* Clearance Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    -{product.dealDiscount}%
                  </div>
                  <div className={`${getReasonColor(product.clearanceReason)} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
                    {getReasonLabel(product.clearanceReason)}
                  </div>
                </div>

                {/* Stock Warning */}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Only {product.stock} left
                    </div>
                  </div>
                )}

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <span className="bg-black/80 text-white px-4 py-2 rounded-lg font-bold">Sold Out</span>
                  </div>
                )}

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
                    <span className="text-2xl font-bold text-red-600">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)] line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingDown className="w-4 h-4" />
                      Save KSh {(product.originalPrice - product.price).toLocaleString()}
                    </div>
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

                  <button 
                    disabled={product.stock === 0}
                    className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      product.stock > 0
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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