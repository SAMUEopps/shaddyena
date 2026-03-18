// components/New/components/ShopsListing.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Store, 
  MapPin, 
  Star, 
  Search,
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  Heart,
  Phone,
  Verified,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Shop {
  _id: string;
  businessName: string;
  businessType: string;
  description: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  isVerified: boolean;
  isActive: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalShops: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ShopsListing = () => {
  const [mounted, setMounted] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalShops: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Available filters
  const [cities, setCities] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchShops();
  }, []);

  useEffect(() => {
    // Extract unique cities and types from shops
    if (shops.length > 0) {
      const uniqueCities = [...new Set(shops.map(shop => shop.location.city))];
      const uniqueTypes = [...new Set(shops.map(shop => shop.businessType))];
      setCities(uniqueCities);
      setBusinessTypes(uniqueTypes);
    }
  }, [shops]);

  const fetchShops = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCity && { city: selectedCity })
      });
      
      const response = await fetch(`/api/shops?${params}`);
      const data = await response.json();
      
      if (data.shops) {
        setShops(data.shops);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchShops(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchShops(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (shopId: string) => {
    setFavorites(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId)
        : [...prev, shopId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedType('');
    fetchShops(1);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Store className="w-32 h-32 text-[var(--color-primary)]" />
        </div>
        
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-alt)] mb-3">
            All Shops
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl">
            Explore our complete marketplace of trusted vendors and discover unique products
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="relative mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search shops by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 pl-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
              <Search className="absolute left-4 w-5 h-5 text-[var(--color-text-muted)]" />
              {searchQuery && (
                <button
                  onClick={handleSearch}
                  className="absolute right-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </div>

          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`mt-4 flex flex-wrap gap-3 ${!showFilters && 'hidden lg:flex'}`}>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              fetchShops(1);
            }}
            className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              fetchShops(1);
            }}
            className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
          >
            <option value="">All Types</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {(searchQuery || selectedCity || selectedType) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-2 transition-all"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-semibold text-[var(--color-primary)]">{shops.length}</span> of{' '}
          <span className="font-semibold">{pagination.totalShops}</span> shops
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          <TrendingUp className="w-4 h-4 inline mr-1" />
          {shops.filter(s => s.isVerified).length} verified
        </p>
      </div>

      {/* Shops Grid/List */}
      {loading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-40 bg-[var(--color-border)]"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-border)]"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[var(--color-border)] rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[var(--color-border)] rounded w-full"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-16">
          <Store className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No shops found</h3>
          <p className="text-[var(--color-text-muted)] mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {shops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shop/${shop._id}`}
                className={`group relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--color-primary)]/30 ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                }`}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(shop._id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(shop._id) 
                        ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                        : 'text-[var(--color-text-muted)]'
                    }`} 
                  />
                </button>

                {/* Banner Image */}
                <div className={`relative ${viewMode === 'list' ? 'md:w-48 h-48' : 'h-32'}`}>
                  {shop.banner ? (
                    <Image
                      src={shop.banner}
                      alt={shop.businessName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent"></div>
                  
                  {/* Verified Badge */}
                  {shop.isVerified && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Verified className="w-3 h-3 fill-[var(--color-primary)]" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Shop Info */}
                <div className={`relative p-4 ${viewMode === 'list' ? 'md:flex-1' : ''}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {/* Logo */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[var(--color-surface)] shadow-xl bg-[var(--color-surface)] flex-shrink-0">
                      {shop.logo ? (
                        <Image
                          src={shop.logo}
                          alt={shop.businessName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[var(--color-primary-alt)] mb-1 truncate">
                        {shop.businessName}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {shop.businessType}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  {shop.rating && shop.rating.count > 0 && (
                    <div className="flex items-center gap-1 bg-[var(--color-primary-soft)]/20 px-2 py-1 rounded-lg w-fit mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-[var(--color-text)]">
                        {shop.rating.average.toFixed(1)}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        ({shop.rating.count})
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2">
                    {shop.description || 'No description available'}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-3">
                    <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                    <span className="truncate">
                      {shop.location.address}, {shop.location.city}, {shop.location.country}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-3">
                    <Phone className="w-3 h-3 text-[var(--color-primary)]" />
                    <span>{shop.contact.phone}</span>
                  </div>

                  {/* Visit Button */}
                  <button className="w-full bg-[var(--color-primary-alt)] text-white py-2 rounded-lg text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transform hover:-translate-y-0.5">
                    Visit Shop
                  </button>
                </div>

                {/* Hover Effect - Animated Border */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`p-2 rounded-lg border border-[var(--color-border)] transition-all ${
                  pagination.hasPrev
                    ? 'hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first page, last page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] h-10 rounded-lg border transition-all ${
                        pagination.currentPage === pageNum
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'border-[var(--color-border)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === pagination.currentPage - 2 ||
                  pageNum === pagination.currentPage + 2
                ) {
                  return <span key={pageNum} className="text-[var(--color-text-muted)]">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`p-2 rounded-lg border border-[var(--color-border)] transition-all ${
                  pagination.hasNext
                    ? 'hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopsListing;