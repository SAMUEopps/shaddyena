// app/product/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, Shield, Star, Share2, Heart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  isActive: boolean;
  vendorId: {
    _id: string;
    businessName: string;
    ownerName: string;
    phoneNumber: string;
    businessLocation: string;
    profileImage?: string;
  };
  createdAt: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shd-api/api/products/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }

        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (product && newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    setIsAddingToCart(true);
    try {
      // Your add to cart logic here
      console.log('Adding to cart:', { productId: product._id, quantity });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success feedback
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} on SHD!`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-surface rounded mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-surface rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-surface rounded w-3/4"></div>
                <div className="h-6 bg-surface rounded w-1/4"></div>
                <div className="h-24 bg-surface rounded"></div>
                <div className="h-12 bg-surface rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Product Not Found</h2>
          <p className="text-muted mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-accent-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="relative aspect-square bg-gradient-to-br from-surface to-background rounded-2xl overflow-hidden shadow-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    📦
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold px-6 py-3 bg-red-500 rounded-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl border border-surface hover:border-primary/30 transition-colors text-secondary"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl border border-surface hover:border-primary/30 transition-colors text-secondary"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Vendor Badge */}
            <Link
              href={`/shd-pages/shops/${product.vendorId._id}`}
              className="inline-flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-full hover:bg-surface transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                {product.vendorId.profileImage ? (
                  <Image
                    src={product.vendorId.profileImage}
                    alt={product.vendorId.businessName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  '🏪'
                )}
              </div>
              <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">
                {product.vendorId.businessName}
              </span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-secondary leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-primary">
                KSh {product.price.toLocaleString()}
              </span>
              {product.stock > 0 && product.stock < 5 && (
                <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                  Low Stock: {product.stock} left
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <Truck className="w-4 h-4" />
              <span>Free delivery on orders over KSh 2,000</span>
            </div>

            <div className="border-t border-surface pt-6">
              <h3 className="font-semibold text-secondary mb-3">Description</h3>
              <p className="text-text leading-relaxed whitespace-pre-line">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Vendor Info */}
            <div className="bg-white rounded-xl p-4 border border-surface space-y-2">
              <h4 className="font-semibold text-secondary text-sm">Seller Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted">Store:</span>
                <span className="text-secondary font-medium">{product.vendorId.businessName}</span>
                <span className="text-muted">Location:</span>
                <span className="text-secondary">{product.vendorId.businessLocation}</span>
                <span className="text-muted">Contact:</span>
                <span className="text-secondary">{product.vendorId.phoneNumber}</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-surface flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-secondary">Authentic</div>
                  <div className="text-[10px] text-muted">100% Genuine</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-surface flex items-center gap-3">
                <Star className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-secondary">Quality</div>
                  <div className="text-[10px] text-muted">Trusted Seller</div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="bg-white p-4 rounded-xl border border-surface">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-secondary">Qty:</span>
                    <div className="flex items-center gap-2 bg-background rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-secondary">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-dark transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted mt-3 text-center">
                  {product.stock > 10 
                    ? '✓ In stock' 
                    : `⚠️ Only ${product.stock} left - order soon!`}
                </p>
              </div>
            )}

            {product.stock <= 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-600 font-medium">Out of Stock</p>
                <p className="text-sm text-red-500 mt-1">This product is currently unavailable</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              More from {product.vendorId.businessName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/product/${related._id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-surface hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-background">
                    {related.image ? (
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate text-secondary group-hover:text-primary transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-primary font-bold text-sm mt-1">
                      KSh {related.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}