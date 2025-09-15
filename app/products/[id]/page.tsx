"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  category: string;
  subcategory?: string;
  sku: string;
  brand?: string;
  specifications: {
    key: string;
    value: string;
  }[];
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  tags: string[];
  vendorId: string;
  shopId: string;
  vendor?: {
    businessName: string;
  };
  shop?: {
    businessName: string;
    location: {
      city: string;
      country: string;
    };
  };
  rating?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error loading product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      vendorId: product.vendorId,
      shopId: product.shopId,
      sku: product.sku,
      quantity: quantity
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        vendorId: product.vendorId,
        shopId: product.shopId
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff199c]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link 
            href="/products"
            className="bg-[#ff199c] text-white px-6 py-2 rounded-md hover:bg-[#e5178a]"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-400 hover:text-gray-500">Home</Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <Link href="/products" className="text-gray-400 hover:text-gray-500">Products</Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <Link href={`/products?category=${product.category}`} className="text-gray-400 hover:text-gray-500">
              {product.category}
            </Link>
          </li>
          {product.subcategory && (
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-600">{product.subcategory}</span>
            </li>
          )}
          <li className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg ${
                    selectedImage === index ? 'ring-2 ring-[#ff199c]' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Vendor/Shop Info */}
            {(product.vendor || product.shop) && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span>Sold by </span>
                <Link 
                  href={`/shop/${product.shopId}`}
                  className="ml-1 font-medium text-[#ff199c] hover:text-[#e5178a]"
                >
                  {product.shop?.businessName || product.vendor?.businessName || 'Unknown Seller'}
                </Link>
                {product.shop?.location && (
                  <span className="ml-2">• {product.shop.location.city}, {product.shop.location.country}</span>
                )}
              </div>
            )}

            {/* Rating */}
            {product.rating && product.rating.count > 0 && (
              <div className="mt-3 flex items-center">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.round(product.rating.average))}
                  {'☆'.repeat(5 - Math.round(product.rating.average))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center">
            <p className="text-3xl font-bold text-[#ff199c]">
              KSh {product.price.toLocaleString()}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <p className="ml-3 text-xl text-gray-500 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </p>
                <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {product.stock > 10 ? 'In stock' : 
               product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-600">SKU: {product.sku}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-1 text-gray-600 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 text-center border-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className="px-3 py-1 text-gray-600 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">Max: {product.stock} available</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-[#182155] text-white px-6 py-3 rounded-md hover:bg-[#2a3170] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Add to Cart
            </button>
            
            <button
              onClick={handleWishlistToggle}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg 
                className="w-6 h-6" 
                fill={isInWishlist(product._id) ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex">
                <dt className="text-sm text-gray-600 w-24 flex-shrink-0">Category</dt>
                <dd className="text-sm text-gray-900">
                  <Link 
                    href={`/products?category=${product.category}`}
                    className="text-[#ff199c] hover:text-[#e5178a]"
                  >
                    {product.category}
                  </Link>
                  {product.subcategory && (
                    <span> → {product.subcategory}</span>
                  )}
                </dd>
              </div>
              
              {product.brand && (
                <div className="flex">
                  <dt className="text-sm text-gray-600 w-24 flex-shrink-0">Brand</dt>
                  <dd className="text-sm text-gray-900">{product.brand}</dd>
                </div>
              )}
              
              <div className="flex">
                <dt className="text-sm text-gray-600 w-24 flex-shrink-0">Weight</dt>
                <dd className="text-sm text-gray-900">{product.shipping.weight}g</dd>
              </div>
              
              <div className="flex">
                <dt className="text-sm text-gray-600 w-24 flex-shrink-0">Dimensions</dt>
                <dd className="text-sm text-gray-900">
                  {product.shipping.dimensions.length} × {product.shipping.dimensions.width} × {product.shipping.dimensions.height} cm
                </dd>
              </div>
            </dl>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/products?search=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specifications Section */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {product.specifications.map((spec, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      {spec.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* This would be populated with related products from an API */}
          <div className="text-center py-8">
            <p className="text-gray-500">Related products would be shown here</p>
          </div>
        </div>
      </div>
    </div>
  );
}