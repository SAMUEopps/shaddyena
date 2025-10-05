/*"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-lg text-gray-600 ml-2">({rating.toFixed(1)})</span>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Banner *
      <div className="relative h-64 bg-[#bf2c7e]">
        {shop.banner ? (
          <Image
            src={shop.banner}
            alt={shop.businessName}
            fill
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
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
              {['about', 'hours', 'contact', 'policies'].map((tab) => (
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

        {/* Action Buttons *
        <div className="flex space-x-4">
          <Link
            href={`/products?shop=${shop._id}`}
            className="bg-[#bf2c7e] text-white px-6 py-3 rounded-lg hover:bg-[#a8256b] transition-colors font-medium"
          >
            View Products
          </Link>
          <button className="border border-[#182155] text-[#182155] px-6 py-3 rounded-lg hover:bg-[#182155] hover:text-white transition-colors font-medium">
            Contact Vendor
          </button>
          <Link
            href="/shops"
            className="text-gray-600 px-6 py-3 rounded-lg hover:text-gray-800 transition-colors font-medium"
          >
            Back to Shops
          </Link>
        </div>*
      </div>
    </div>
  );
}*/

"use client";

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
      {/* Banner */}
      <div className="relative h-64 bg-[#bf2c7e]">
        {shop.banner ? (
          <Image
            src={shop.banner}
            alt={shop.businessName}
            fill
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex items-end space-x-6">
            {/* Logo */}
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
            
            {/* Shop Info */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
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

          {/* Tab Content */}
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

                    {/* Pagination */}
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
}