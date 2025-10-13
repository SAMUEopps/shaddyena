/*"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  category: string;
  rating?: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isApproved: boolean;
}

interface Shop {
  _id: string;
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
  isVerified: boolean;
  rating?: {
    average: number;
    count: number;
  };
  vendorId: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function ShopDetailPage() {
  const params = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`/api/shops/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setShop(data.shop);
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchShop();
    }
  }, [params.id]);

  useEffect(() => {
    if (shop) {
      fetchShopProducts();
    }
  }, [shop, pagination.page]);

  const fetchShopProducts = async () => {
    if (!shop) return;
    
    setProductsLoading(true);
    try {
      const response = await fetch(
        `/api/shops/${shop._id}/products?page=${pagination.page}&limit=${pagination.limit}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching shop products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className='bg-white'>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
      </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Not Found</h1>
          <p className="text-gray-600 mb-4">The shop you're looking for doesn't exist.</p>
          <Link href="/shops" className="text-[#bf2c7e] hover:underline">
            Back to Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white'>
    <div className="min-h-screen bg-gray-50">
      {/* Banner *
      <div className="relative h-64 bg-[#bf2c7e]">     
        {shop.banner ? (
        <Image
          src={shop.banner}
          alt={shop.businessName}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#bf2c7e] to-[#f78bb0]" />
      )}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex items-end space-x-6">
            {/* Logo *
            <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl grid place-items-center border-4 border-white">
              {shop.logo ? (
                <Image
                  src={shop.logo}
                  alt={shop.businessName}
                  width={128}
                  height={128}
                  className="rounded-2xl object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-[#bf2c7e]">
                  {shop.businessName.charAt(0)}
                </span>
              )}
            </div>
            
            {/* Shop Info *
            <div className="text-white pb-2">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold">{shop.businessName}</h1>
                {shop.isVerified && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
              
              <p className="text-xl opacity-90">{shop.businessType}</p>
              
              {shop.rating && shop.rating.average > 0 && (
                <div className="flex items-center space-x-4 mt-3">
                  {renderStars(shop.rating.average)}
                  <span className="text-lg">
                    {shop.rating.count} reviews
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content *
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs *
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['products', 'about', 'hours', 'contact', 'policies'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-[#bf2c7e] text-[#bf2c7e]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content *
          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Products ({pagination.total})
                  </h3>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product._id}`}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="relative aspect-square">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover rounded-t-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h4>
                            
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-[#bf2c7e]">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              
                              {product.rating && product.rating.average > 0 && (
                                <div className="flex items-center">
                                  {renderStars(product.rating.average)}
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {product.description}
                            </p>
                            
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>{product.category}</span>
                              <span>{product.stock} in stock</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination *
                    {pagination.pages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        <span className="text-sm text-gray-700">
                          Page {pagination.page} of {pagination.pages}
                        </span>
                        
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.pages}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">This shop hasn't added any products yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About Us</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {shop.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-700">{shop.location.address}</p>
                    <p className="text-gray-700">
                      {shop.location.city}, {shop.location.country}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Vendor</h4>
                    <p className="text-gray-700">
                      {shop.vendorId.firstName} {shop.vendorId.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">{shop.vendorId.email}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
                <div className="space-y-3">
                  {shop.operatingHours.map((hours) => (
                    <div key={hours.day} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{hours.day}</span>
                      {hours.isClosed ? (
                        <span className="text-red-600 font-medium">Closed</span>
                      ) : (
                        <span className="text-gray-700">
                          {formatTime(hours.open)} - {formatTime(hours.close)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Phone</h4>
                      <p className="text-gray-700">{shop.contact.phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-700">{shop.contact.email}</p>
                    </div>
                    
                    {shop.contact.website && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Website</h4>
                        <a 
                          href={shop.contact.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#bf2c7e] hover:underline"
                        >
                          {shop.contact.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {shop.socialMedia && Object.values(shop.socialMedia).some(val => val) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Social Media</h4>
                    <div className="flex space-x-4">
                      {shop.socialMedia.facebook && (
                        <a href={shop.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <span className="sr-only">Facebook</span>
                          📘
                        </a>
                      )}
                      {shop.socialMedia.instagram && (
                        <a href={shop.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                          <span className="sr-only">Instagram</span>
                          📷
                        </a>
                      )}
                      {shop.socialMedia.twitter && (
                        <a href={shop.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                          <span className="sr-only">Twitter</span>
                          🐦
                        </a>
                      )}
                      {shop.socialMedia.youtube && (
                        <a href={shop.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                          <span className="sr-only">YouTube</span>
                          📺
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="space-y-6">
                {shop.policies.returnPolicy && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Return Policy</h4>
                    <p className="text-gray-700 leading-relaxed">{shop.policies.returnPolicy}</p>
                  </div>
                )}
                
                {shop.policies.shippingPolicy && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Policy</h4>
                    <p className="text-gray-700 leading-relaxed">{shop.policies.shippingPolicy}</p>
                  </div>
                )}
                
                {shop.policies.privacyPolicy && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Privacy Policy</h4>
                    <p className="text-gray-700 leading-relaxed">{shop.policies.privacyPolicy}</p>
                  </div>
                )}
                
                {!shop.policies.returnPolicy && !shop.policies.shippingPolicy && !shop.policies.privacyPolicy && (
                  <p className="text-gray-600">No policies provided.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}*/

"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
   vendorId: string;
  shopId: string;
  category: string;
  rating?: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isApproved: boolean;
}

interface Shop {
  _id: string;
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
  isVerified: boolean;
  rating?: {
    average: number;
    count: number;
  };
  vendorId: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const { addToCart } = useCart();
   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
   const handleWishlistToggle = (product: Product) => {
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

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      vendorId: product.vendorId,
      shopId: product.shopId,
      sku: product._id,
      quantity: 1
    });
  };

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`/api/shops/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setShop(data.shop);
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchShop();
    }
  }, [params.id]);

  useEffect(() => {
    if (shop) {
      fetchShopProducts();
    }
  }, [shop, pagination.page]);

  const fetchShopProducts = async () => {
    if (!shop) return;
    
    setProductsLoading(true);
    try {
      const response = await fetch(
        `/api/shops/${shop._id}/products?page=${pagination.page}&limit=${pagination.limit}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching shop products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs sm:text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  /*const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ke', {
      style: 'currency',
      currency: 'Ksh',
    }).format(price);
  };*/

  const formatPrice = (price: number) => {
  return `Ksh ${price.toLocaleString()}`;
};



  if (loading) {
    return (
      <div className='bg-white'>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Not Found</h1>
          <p className="text-gray-600 mb-4">The shop you're looking for doesn't exist.</p>
          <Link href="/shops" className="text-[#bf2c7e] hover:underline">
            Back to Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white'>
      {/* Navigation Bar with Back Button */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg 
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="ml-4 flex-1 min-w-0">
            <h1 className="text-sm font-medium text-gray-900 truncate">{shop.businessName} shop</h1>
            {/*<p className="text-xs text-gray-500 truncate">{shop.businessType}</p>*/}
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50">
        {/* Banner - Improved mobile sizing */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-[#bf2c7e]">     
          {shop.banner ? (
            <Image
              src={shop.banner}
              alt={shop.businessName}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#bf2c7e] to-[#f78bb0]" />
          )}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-end pb-4 sm:pb-6 md:pb-8">
            <div className="flex items-end space-x-4 sm:space-x-6 w-full">
              {/* Logo - Responsive sizing */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl grid place-items-center border-2 sm:border-4 border-white flex-shrink-0">
                {shop.logo ? (
                  <Image
                    src={shop.logo}
                    alt={shop.businessName}
                    width={128}
                    height={128}
                    className="rounded-xl sm:rounded-2xl object-cover w-full h-full"
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#bf2c7e]">
                    {shop.businessName.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* Shop Info - Improved mobile layout */}
              <div className="text-white pb-1 sm:pb-2 flex-1 min-w-0">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold truncate">
                    {shop.businessName}
                  </h1>
                  {shop.isVerified && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden xs:inline">Verified</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm sm:text-base md:text-xl opacity-90 truncate">
                  {shop.businessType}
                </p>
                
                {shop.rating && shop.rating.average > 0 && (
                  <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-3">
                    {renderStars(shop.rating.average)}
                    <span className="text-sm sm:text-lg">
                      {shop.rating.count} reviews
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-0 sm:px-4 py-4 sm:py-6 md:py-8">
          {/* Navigation Tabs - Improved mobile scrolling */}
          <div className="mb-4 sm:mb-6 md:mb-8 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto scrollbar-hide px-3 sm:px-6">
                <div className="flex space-x-4 sm:space-x-8 min-w-max">
                  {['products', 'about', 'hours', 'contact', 'policies'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab
                          ? 'border-[#bf2c7e] text-[#bf2c7e]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-6">

              {activeTab === 'products' && (
  <div>
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
        Products ({pagination.total})
      </h3>
    </div>

    {productsLoading ? (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-36 sm:h-40 md:h-48"></div>
            <div className="p-2 sm:p-3 md:p-4">
              <div className="bg-gray-200 h-3 sm:h-4 rounded mb-1 sm:mb-2"></div>
              <div className="bg-gray-200 h-2 sm:h-3 rounded w-3/4 mb-2 sm:mb-3"></div>
              <div className="flex justify-between items-center mt-2 sm:mt-3">
                <div className="bg-gray-200 h-3 sm:h-4 rounded w-1/3"></div>
                <div className="bg-gray-200 h-4 sm:h-6 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : products.length > 0 ? (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <Link href={`/products/${product._id}`}>
                <div className="bg-gray-100 h-36 sm:h-40 md:h-48 relative group">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                      SALE
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-2 sm:p-3 md:p-4">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-[#bf2c7e] transition-colors line-clamp-2 text-sm sm:text-base leading-tight">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating */}
                {product.rating && product.rating.count > 0 && (
                  <div className="flex items-center mt-1 mb-1 sm:mb-2">
                    <div className="flex text-yellow-400 text-xs sm:text-sm">
                      {'★'.repeat(Math.round(product.rating.average))}
                      {'☆'.repeat(5 - Math.round(product.rating.average))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="text-[#bf2c7e] font-bold text-sm sm:text-base">
                       {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock}` : 'Out'}
                  </span>
                </div>
                
                {/* Category *
                <div className="mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>*/}
                
                {/* Description - Hidden on mobile */}
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-2 hidden sm:block">
                  {product.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-3 sm:mt-4">
                  {/*<Link 
                    href={`/products/${product._id}`}
                    className="bg-[#182155] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-[#2a3170] transition-colors flex-1 mr-2 text-center"
                  >
                    View
                  </Link>*/}
                  <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="bg-[#182155] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-[#2a3170] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 mr-2"
              >
                Add to Cart
              </button>
                  
                   <button
                onClick={() => handleWishlistToggle(product)}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  isInWishlist(product._id) 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <svg 
                  className="w-5 h-5 sm:w-5 sm:h-5" 
                  fill={isInWishlist(product._id) ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Mobile optimized */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-xs sm:text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </>
    ) : (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-400 mb-3 sm:mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No products found</h3>
        <p className="text-sm text-gray-600">This shop hasn't added any products yet.</p>
      </div>
    )}
  </div>
)}

              {activeTab === 'about' && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">About Us</h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {shop.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Location</h4>
                      <p className="text-gray-700 text-sm sm:text-base">{shop.location.address}</p>
                      <p className="text-gray-700 text-sm sm:text-base">
                        {shop.location.city}, {shop.location.country}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Vendor</h4>
                      <p className="text-gray-700 text-sm sm:text-base">
                        {shop.vendorId.firstName} {shop.vendorId.lastName}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">{shop.vendorId.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hours' && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Operating Hours</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {shop.operatingHours.map((hours) => (
                      <div key={hours.day} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 text-sm sm:text-base">{hours.day}</span>
                        {hours.isClosed ? (
                          <span className="text-red-600 font-medium text-sm sm:text-base">Closed</span>
                        ) : (
                          <span className="text-gray-700 text-sm sm:text-base">
                            {formatTime(hours.open)} - {formatTime(hours.close)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Phone</h4>
                        <p className="text-gray-700 text-sm sm:text-base">{shop.contact.phone}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Email</h4>
                        <p className="text-gray-700 text-sm sm:text-base">{shop.contact.email}</p>
                      </div>
                      
                      {shop.contact.website && (
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Website</h4>
                          <a 
                            href={shop.contact.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#bf2c7e] hover:underline text-sm sm:text-base break-all"
                          >
                            {shop.contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {shop.socialMedia && Object.values(shop.socialMedia).some(val => val) && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Social Media</h4>
                      <div className="flex space-x-3 sm:space-x-4">
                        {shop.socialMedia.facebook && (
                          <a href={shop.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-lg">
                            <span className="sr-only">Facebook</span>
                            📘
                          </a>
                        )}
                        {shop.socialMedia.instagram && (
                          <a href={shop.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 text-lg">
                            <span className="sr-only">Instagram</span>
                            📷
                          </a>
                        )}
                        {shop.socialMedia.twitter && (
                          <a href={shop.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-lg">
                            <span className="sr-only">Twitter</span>
                            🐦
                          </a>
                        )}
                        {shop.socialMedia.youtube && (
                          <a href={shop.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 text-lg">
                            <span className="sr-only">YouTube</span>
                            📺
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="space-y-4 sm:space-y-6">
                  {shop.policies.returnPolicy && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Return Policy</h4>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{shop.policies.returnPolicy}</p>
                    </div>
                  )}
                  
                  {shop.policies.shippingPolicy && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Shipping Policy</h4>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{shop.policies.shippingPolicy}</p>
                    </div>
                  )}
                  
                  {shop.policies.privacyPolicy && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Privacy Policy</h4>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{shop.policies.privacyPolicy}</p>
                    </div>
                  )}
                  
                  {!shop.policies.returnPolicy && !shop.policies.shippingPolicy && !shop.policies.privacyPolicy && (
                    <p className="text-gray-600 text-sm sm:text-base">No policies provided.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}