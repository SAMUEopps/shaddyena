"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
  };
  rating?: {
    average: number;
    count: number;
  };
  isVerified: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalShops: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ShopsTab() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
const router = useRouter();
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalShops: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchShops = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(cityFilter && { city: cityFilter })
      });

      const response = await fetch(`/api/shops?${params}`);
      const data = await response.json();

      if (response.ok) {
        setShops(data.shops);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(1);
  }, [searchQuery, cityFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchShops(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchShops(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (loading && shops.length === 0) {
    return (
      <div className="min-h-96 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
      </div>
    );
  }

  return (

    <div className='bg-white'>
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">shops</h1>
              </div>
            </div>
          </div>
        </header> 
    <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
      {/* Header - Improved mobile spacing */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Discover Shops</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Explore {pagination.totalShops} unique shops and vendors
        </p>
      </div>

      {/* Search and Filters - Mobile optimized */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Shops
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, type, or description..."
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by City
            </label>
            <input
              type="text"
              id="city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#bf2c7e] focus:border-[#bf2c7e]"
            />
          </div>
          
          <div className="flex items-end pt-2">
            <button
              type="submit"
              className="w-full bg-[#182155] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#0f183f] transition-colors font-medium text-sm sm:text-base"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Shops Grid - 2 columns on mobile, responsive on larger screens */}
      {shops.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🏪</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No shops found</h3>
          <p className="text-sm sm:text-base text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              href={`/shops/${shop._id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              {/* Shop Banner - allow logo to overflow */}
              <div className="h-20 sm:h-28 md:h-32 bg-[#bf2c7e] relative overflow-visible">
                {shop.banner ? (
                  <Image
                    src={shop.banner}
                    alt={shop.businessName}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#bf2c7e] opacity-90" />
                )}

                {/* Verified Badge */}
                {shop.isVerified && (
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Verified</span>
                  </div>
                )}

                {/* Shop Logo - positioned overlapping nicely */}
                <div className="absolute left-2 sm:left-4 -bottom-6 sm:-bottom-7">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-lg shadow-md grid place-items-center border border-gray-200">
                    {shop.logo ? (
                      <Image
                        src={shop.logo}
                        alt={shop.businessName}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-base sm:text-lg font-bold text-[#bf2c7e]">
                        {shop.businessName.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Shop Info - add padding-top to avoid overlap */}
              <div className="pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 px-2 sm:px-3 md:px-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#bf2c7e] transition-colors truncate text-sm sm:text-base">
                  {shop.businessName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  {shop.businessType}
                </p>

                {/*{shop.rating && shop.rating.average > 0 ? (
                  <div className="mt-1.5 sm:mt-2">
                    {renderStars(shop.rating.average)}
                    <span className="text-xs text-gray-500 block mt-0.5">
                      ({shop.rating.count} reviews)
                    </span>
                  </div>
                ) : (
                  <div className="mt-1.5 sm:mt-2 text-xs text-gray-500">No reviews yet</div>
                )}*/}

                <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-gray-600">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{shop.location.city}, {shop.location.country}</span>
                </div>

                {shop.description && (
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 hidden xs:block">
                    {shop.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

          {/* Pagination - Mobile optimized */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-sm sm:text-base ${
                  pagination.hasPrev
                    ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Prev
              </button>
              
              <div className="flex space-x-0.5 sm:space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border text-sm sm:text-base ${
                      page === pagination.currentPage
                        ? 'bg-[#bf2c7e] text-white border-[#bf2c7e]'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-sm sm:text-base ${
                  pagination.hasNext
                    ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
}