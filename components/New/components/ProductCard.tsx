// components/New/components/ProductCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Eye,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export interface Product {
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

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  showQuickActions?: boolean;
  showRating?: boolean;
  showShop?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  className?: string;
}

const ProductCard = ({
  product,
  variant = 'default',
  showQuickActions = true,
  showRating = true,
  showShop = true,
  onAddToCart,
  onToggleWishlist,
  className = ''
}: ProductCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isInWishlistState = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock < 10 && product.stock > 0;

  // Calculate discount percentage
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isOutOfStock) return;

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
    
    if (onAddToCart) {
      onAddToCart(product);
    }

    // Show success feedback
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInWishlistState) {
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

    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  // Handle product click
  const handleProductClick = () => {
    router.push(`/products/${product._id}`);
  };

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product._id}`);
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div 
        className={`group relative bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
        onClick={handleProductClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[var(--color-text-muted)] opacity-30" />
            </div>
          )}
          
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
              -{discount}%
            </div>
          )}

          {showQuickActions && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-md hover:scale-110 transition-transform"
            >
              <Heart 
                className={`w-3 h-3 ${
                  isInWishlistState 
                    ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                    : 'text-[var(--color-text-muted)]'
                }`} 
              />
            </button>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[var(--color-primary-alt)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[var(--color-text-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div 
        className={`group relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
        onClick={handleProductClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 sm:w-40 h-32 sm:h-40 flex-shrink-0 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                sizes="160px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[var(--color-text-muted)] opacity-30" />
              </div>
            )}
            
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-2 py-1 rounded text-xs font-bold">
                -{discount}%
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              {showShop && product.shopId && (
                <span className="text-xs text-[var(--color-text-muted)] mb-1 block">
                  {product.shopId.businessName}
                </span>
              )}
              
              <h3 className="text-base font-semibold text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                {product.name}
              </h3>
              
              {showRating && product.rating && product.rating.count > 0 && (
                <div className="flex items-center gap-1 mb-2">
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
                  <span className="text-xs text-[var(--color-text-muted)]">
                    ({product.rating.count})
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[var(--color-primary-alt)]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-[var(--color-text-muted)] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs text-[var(--color-success)] font-medium">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isAddedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-[var(--color-primary-alt)] text-white hover:shadow-md hover:shadow-[var(--color-primary)]/30'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>
              
              {showQuickActions && (
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      isInWishlistState 
                        ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                        : ''
                    }`} 
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (original responsive design)
  return (
    <div
      className={`group relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <div className="relative bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--color-primary)]/30">
        
        {/* Image Container */}
        <div className="relative h-20 xs:h-24 sm:h-28 lg:h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-500 sm:duration-700"
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
          {showQuickActions && (
            <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-3 sm:right-3 flex flex-col gap-1 xs:gap-1 sm:gap-2">
              <button
                onClick={handleWishlistToggle}
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
                onClick={handleQuickView}
                className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md xs:rounded-lg shadow-md hover:scale-110 transition-transform"
                aria-label="Quick view"
              >
                <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" />
              </button>
            </div>
          )}

          {/* Stock Status */}
          {isLowStock && (
            <div className="absolute bottom-1 left-1 xs:bottom-1.5 xs:left-1.5 sm:bottom-3 sm:left-3 bg-amber-500/90 backdrop-blur-sm text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-md xs:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium flex items-center gap-0.5 xs:gap-1">
              <Clock className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden xs:inline">Only {product.stock} left</span>
              <span className="xs:hidden">{product.stock} left</span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-1.5 xs:p-2 sm:p-2.5 lg:p-4">
          {/* Category & Shop */}
          <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2">
            <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[70px] xs:max-w-[90px] sm:max-w-none">
              {product.category}
            </span>
            {showShop && product.shopId && (
              <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none">
                {product.shopId.businessName}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 h-6 xs:h-7 sm:h-8 lg:h-10 group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {showRating && product.rating && product.rating.count > 0 && (
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
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-1 xs:py-1.5 sm:py-2 lg:py-2.5 rounded-md xs:rounded-lg sm:rounded-xl text-[8px] xs:text-[10px] sm:text-xs lg:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
                isOutOfStock
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
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                  <span className="xs:hidden">
                    {isOutOfStock ? 'Sold' : '+'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hover Effects - Hidden on mobile */}
        <div className="absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none hidden sm:block"></div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden hidden sm:block">
          <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;