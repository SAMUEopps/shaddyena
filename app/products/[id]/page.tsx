/*"use client";
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
       
        <div className="space-y-4">
         
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

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
          
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

         
          <div>
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

         
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

      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         
          <div className="text-center py-8">
            <p className="text-gray-500">Related products would be shown here</p>
          </div>
        </div>
      </div>
    </div>
  );
}*/

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
  subSubcategory?: string;
  subSubSubcategory?: string;
  sku: string;
  brand?: string;
  specifications: {
    key: string;
    value: string;
  }[];
  variants?: {
    name: string;
    options: {
      name: string;
      price?: number;
      stock: number;
      sku: string;
    }[];
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
  shopId: string | { toString(): string }; // Updated to handle ObjectId
  shopName: string;
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
  const [selectedVariant, setSelectedVariant] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
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

  // Helper function to safely get shopId as string
  const getShopIdString = (): string => {
    if (!product?.shopId) return '';
    
    // If shopId is an object with toString method (MongoDB ObjectId)
    if (typeof product.shopId === 'object' && product.shopId.toString) {
      return product.shopId.toString();
    }
    
    // If it's already a string
    return product.shopId as string;
  };

  const getCurrentVariantPrice = () => {
    if (!product?.variants || Object.keys(selectedVariant).length === 0) {
      return product?.price || 0;
    }

    for (const variant of product.variants) {
      const selectedOption = selectedVariant[variant.name];
      if (selectedOption) {
        const option = variant.options.find(opt => opt.name === selectedOption);
        if (option?.price) {
          return option.price;
        }
      }
    }
    return product?.price || 0;
  };

  const getCurrentVariantStock = () => {
    if (!product?.variants || Object.keys(selectedVariant).length === 0) {
      return product?.stock || 0;
    }

    for (const variant of product.variants) {
      const selectedOption = selectedVariant[variant.name];
      if (selectedOption) {
        const option = variant.options.find(opt => opt.name === selectedOption);
        if (option) {
          return option.stock;
        }
      }
    }
    return product?.stock || 0;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const currentPrice = getCurrentVariantPrice();
    const currentStock = getCurrentVariantStock();
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: currentPrice,
      image: product.images[0] || '',
      vendorId: product.vendorId,
      shopId: getShopIdString(), // Use the helper function
      sku: product.sku,
      quantity: quantity,
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
        price: getCurrentVariantPrice(),
        image: product.images[0] || '',
        vendorId: product.vendorId,
        shopId: getShopIdString(), // Use the helper function
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    const currentStock = getCurrentVariantStock();
    if (newQuantity > currentStock) return;
    setQuantity(newQuantity);
  };

  const handleVariantSelect = (variantName: string, optionName: string) => {
    setSelectedVariant(prev => ({
      ...prev,
      [variantName]: optionName
    }));
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#bf2c7e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-8xl mb-6">😢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist or has been removed.'}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Go Back
            </button>
            <Link 
              href="/products"
              className="block w-full bg-[#bf2c7e] text-white px-6 py-3 rounded-lg hover:bg-[#a8246b] transition-colors font-medium text-center"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = getCurrentVariantPrice();
  const currentStock = getCurrentVariantStock();
  const discountPercentage = product.originalPrice && product.originalPrice > currentPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  // Get the shop ID as a string
  const shopIdString = getShopIdString();

  // Mobile Header with Back Button
  const MobileHeader = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center px-4 py-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {product.name}
        </h1>
        <button
          onClick={handleWishlistToggle}
          className={`p-2 rounded-lg transition-colors ${
            isInWishlist(product._id) 
              ? 'text-red-500 bg-red-50' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <svg className="w-5 h-5" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      {/* Desktop Back Button */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to previous page
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb - Desktop Only */}
        <nav className="hidden lg:flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/products" className="text-gray-500 hover:text-gray-700 transition-colors">Products</Link>
            </li>
            {[product.category, product.subcategory, product.subSubcategory, product.subSubSubcategory]
              .filter(Boolean)
              .map((category, index, array) => (
                <li key={index} className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {index === array.length - 1 ? (
                    <span className="text-gray-900 font-medium">{category}</span>
                  ) : (
                    <Link 
                      href={`/products?category=${category}`}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {category}
                    </Link>
                  )}
                </li>
              ))
            }
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg transition-all ${
                        selectedImage === index 
                          ? 'ring-3 ring-[#bf2c7e] ring-offset-2' 
                          : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-300'
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Vendor/Shop Info */}
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Sold by</span>
                  <Link 
                    href={`/shops/${shopIdString}`} 
                    className="font-medium text-[#bf2c7e] hover:text-[#a8246b] transition-colors text-sm bg-pink-50 px-2 py-1 rounded-md"
                  >
                    {product.shopName || product.shop?.businessName || product.vendor?.businessName || 'Unknown Seller'}
                  </Link>
                  {product.shop?.location && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {product.shop.location.city}, {product.shop.location.country}
                      </span>
                    </>
                  )}
                </div>

                {/* Rating */}
                {product.rating && product.rating.count > 0 ? (
                  <div className="mt-3 flex items-center flex-wrap gap-2">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.round(product.rating.average))}
                        {'☆'.repeat(5 - Math.round(product.rating.average))}
                      </div>
                      <span className="ml-1 text-sm font-medium text-yellow-700">
                        {product.rating.average.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.rating.count} review{product.rating.count !== 1 ? 's' : ''})
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-500">No reviews yet</div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center flex-wrap gap-3">
                  <p className="text-3xl font-bold text-[#bf2c7e]">
                    KSh {currentPrice.toLocaleString()}
                  </p>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <>
                      <p className="text-xl text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    currentStock > 10 
                      ? 'bg-green-100 text-green-800' 
                      : currentStock > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {currentStock > 10 ? 'In Stock' : 
                     currentStock > 0 ? `Only ${currentStock} left` : 'Out of Stock'}
                  </span>
                  <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.map((variant, index) => (
                <div key={index} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleVariantSelect(variant.name, option.name)}
                        disabled={option.stock === 0}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedVariant[variant.name] === option.name
                            ? 'border-[#bf2c7e] bg-[#bf2c7e] text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        } ${option.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {option.name}
                        {option.price && option.price !== product.price && (
                          <span className="ml-1 text-xs">
                            (+KSh {(option.price - product.price).toLocaleString()})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 disabled:opacity-30 hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={currentStock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= currentStock}
                      className="px-4 py-2 text-gray-600 disabled:opacity-30 hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 border rounded-lg font-medium transition-all duration-200 ${
                    isInWishlist(product._id)
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {isInWishlist(product._id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto no-scrollbar">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'shipping', label: 'Shipping & Returns' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#bf2c7e] text-[#bf2c7e]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === 'description' && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                  
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Product Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">{spec.key}</span>
                          <span className="text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specifications available.</p>
                  )}
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Product Details</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Category</dt>
                          <dd className="text-gray-900">{product.category}</dd>
                        </div>
                        {product.brand && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Brand</dt>
                            <dd className="text-gray-900">{product.brand}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Weight</dt>
                          <dd className="text-gray-900">{product.shipping.weight}g</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Dimensions</dt>
                          <dd className="text-gray-900">
                            {product.shipping.dimensions.length} × {product.shipping.dimensions.width} × {product.shipping.dimensions.height} cm
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Shipping Information</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Free shipping on orders over KSh 2,000</li>
                        <li>• Standard delivery: 3-5 business days</li>
                        <li>• Express delivery available</li>
                        <li>• Track your order online</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Return Policy</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• 30-day return policy</li>
                        <li>• Items must be unused and in original packaging</li>
                        <li>• Free returns for defective items</li>
                        <li>• Refund processed within 5 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
            <Link 
              href={`/products?category=${product.category}`}
              className="text-[#bf2c7e] hover:text-[#a8246b] font-medium text-sm"
            >
              View More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm">Related products will be shown here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}