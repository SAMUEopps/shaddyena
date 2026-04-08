/*"use client";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (item: any) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: item.vendorId,
      shopId: item.shopId,
      sku: item._id,
      quantity: 1,
    });
  };

  /* ---------- Empty state ---------- *
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header – same style as Cart *
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-[#bf2c7e] rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
              ❤️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explore our store and save items you love for later.
            </p>
            <Link
              href="/?tab=products"
              className="bg-[#bf2c7e] text-white px-8 py-3 rounded-lg hover:bg-[#a8256c] transition-colors font-medium shadow-sm hover:shadow-md inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Populated state ---------- 
  return (
    <div className="min-h-screen bg-white">
      {/* Header – same style as Cart *
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
            </div>
            <span className="text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image *
              <div className="aspect-square relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details *
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate mb-1">{item.name}</h3>
                <p className="text-[#bf2c7e] font-bold text-lg mb-4">KSh {item.price.toLocaleString()}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-[#182155] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#2a3170] transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}*/

"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Heart, Trash2, CheckCircle, ChevronLeft } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (item: any) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorId: item.vendorId,
      shopId: item.shopId,
      sku: item._id,
      quantity: 1,
    });

    // Show success feedback
    setAddedToCart(item._id);
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  /* ---------- Empty state ---------- */
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        {/* Header */}
        <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-12 xs:h-14 sm:h-16">
              <button
                onClick={() => router.back()}
                className="mr-2 xs:mr-3 sm:mr-4 p-1.5 xs:p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/50 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              <h1 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-primary-alt)]">Wishlist</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12 sm:py-16">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-4 xs:mb-5 sm:mb-6">
              <Heart className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-2 xs:mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-xs xs:text-sm text-[var(--color-text-muted)] mb-6 xs:mb-8 max-w-md mx-auto">
              Explore our store and save items you love for later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[var(--color-primary-alt)] text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg text-xs xs:text-sm sm:text-base font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg"
            >
              <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Populated state ---------- */
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 xs:h-14 sm:h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-2 xs:mr-3 sm:mr-4 p-1.5 xs:p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/50 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              <h1 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-primary-alt)]">Wishlist</h1>
            </div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] bg-[var(--color-border)]/30 px-2 xs:px-2.5 sm:px-3 py-1 rounded-full">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-5 sm:py-6 lg:py-8">
        {/* Products Grid - 2 columns on mobile, 4 on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {wishlistItems.map((item) => {
            const isAddedToCart = addedToCart === item._id;

            return (
              <div
                key={item._id}
                className="group relative cursor-pointer"
                onClick={() => router.push(`/products/${item._id}`)}
              >
                {/* Product Card */}
                <div className="relative bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
                  
                  {/* Image Container */}
                  <div className="relative h-20 xs:h-24 sm:h-28 lg:h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
                    {item.image && item.image !== '/placeholder-image.jpg' ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 sm:duration-700"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-[var(--color-text-muted)] opacity-30" />
                      </div>
                    )}

                    {/* Remove Button */}
                    <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-3 sm:right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item._id);
                        }}
                        className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md xs:rounded-lg shadow-md hover:scale-110 transition-transform hover:bg-red-50"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-1.5 xs:p-2 sm:p-2.5 lg:p-4">
                    {/* Vendor/Shop Name */}
                    {item.shopId && (
                      <div className="mb-1 xs:mb-1.5 sm:mb-2">
                       {/*} <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate block">
                          {typeof item.shopId === 'string' ? item.shopId : item.shopId?.businessName || 'Shop'}
                        </span>*/}
                      </div>
                    )}

                    {/* Product Name */}
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 h-6 xs:h-7 sm:h-8 lg:h-10 group-hover:text-[var(--color-primary)] transition-colors">
                      {item.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 xs:gap-1 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-2.5 lg:mb-3">
                      <span className="text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-[var(--color-primary-alt)]">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className={`flex-1 py-1 xs:py-1.5 sm:py-2 lg:py-2.5 rounded-md xs:rounded-lg sm:rounded-xl text-[8px] xs:text-[10px] sm:text-xs lg:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
                          isAddedToCart
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
                            <span className="hidden xs:inline">Add to Cart</span>
                            <span className="xs:hidden">Cart</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item._id);
                        }}
                        className="p-1 xs:p-1.5 sm:p-2 lg:p-2.5 border border-[var(--color-border)] rounded-md xs:rounded-lg sm:rounded-xl transition-all duration-300 text-[var(--color-text-muted)] hover:text-red-500 hover:border-red-300"
                      >
                        <Trash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                      </button>
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

        {/* Continue Shopping Button */}
        <div className="mt-8 xs:mt-10 sm:mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg text-xs xs:text-sm sm:text-base font-semibold hover:border-[var(--color-primary-alt)] hover:text-[var(--color-primary-alt)] transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}