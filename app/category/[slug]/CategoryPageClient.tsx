// app/category/[slug]/CategoryPageClient.tsx
/*'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Grid, 
  List, 
  ChevronRight, 
  Filter, 
  X,
  Star,
  ChevronLeft,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import ProductCard, { Product } from '@/components/New/components/ProductCard';

interface CategoryPageClientProps {
  category: any;
  subcategories: any[];
  products: any[];
  featuredProducts: any[];
  totalProducts: number;
  currentPage: number;
  currentSort: string;
  priceRange: { minPrice: number; maxPrice: number };
  brands: string[];
  limit?: number;
}

export default function CategoryPageClient({
  category,
  subcategories,
  products: initialProducts,
  featuredProducts,
  totalProducts,
  currentPage,
  currentSort,
  priceRange: initialPriceRange,
  brands: initialBrands,
  limit = 12
}: CategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialPriceRange.minPrice,
    initialPriceRange.maxPrice
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // Get breadcrumb items
  const breadcrumbs = category.path.split('/').map((name: string, index: number, arr: string[]) => ({
    name,
    slug: arr.slice(0, index + 1).join('/').toLowerCase().replace(/\s+/g, '-')
  }));
  
  // Apply filters and update URL
  const applyFilters = useCallback(() => {
    setIsFiltering(true);
    
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('sort', currentSort);
    
    if (priceRange[0] > initialPriceRange.minPrice) {
      params.set('minPrice', priceRange[0].toString());
    }
    if (priceRange[1] < initialPriceRange.maxPrice) {
      params.set('maxPrice', priceRange[1].toString());
    }
    
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','));
    }
    
    if (selectedRatings.length > 0) {
      params.set('ratings', selectedRatings.join(','));
    }
    
    if (selectedSubcategories.length > 0) {
      params.set('subcategories', selectedSubcategories.join(','));
    }
    
    router.push(`/category/${category.slug}?${params.toString()}`);
    setIsFiltering(false);
  }, [priceRange, selectedBrands, selectedRatings, selectedSubcategories, currentSort, category.slug, router, initialPriceRange]);
  
  // Clear all filters
  const clearFilters = () => {
    setPriceRange([initialPriceRange.minPrice, initialPriceRange.maxPrice]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedSubcategories([]);
    
    router.push(`/category/${category.slug}?page=1&sort=${currentSort}`);
  };
  
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    params.set('page', '1');
    router.push(`/category/${category.slug}?${params.toString()}`);
  };
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/category/${category.slug}?${params.toString()}`);
  };
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      priceRange[0] > initialPriceRange.minPrice ||
      priceRange[1] < initialPriceRange.maxPrice ||
      selectedBrands.length > 0 ||
      selectedRatings.length > 0 ||
      selectedSubcategories.length > 0
    );
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section *
      <div className="relative h-64 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)]">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-white/90 max-w-2xl">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-white/80 text-sm mt-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.name}</span>
                ) : (
                  <Link
                    href={`/category/${crumb.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subcategories Section *
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              Shop by Subcategory
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subcategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/category/${sub.slug}`}
                  className="group relative bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {sub.image ? (
                    <div className="relative h-32 w-full">
                      <Image
                        src={sub.image}
                        alt={sub.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-[var(--color-primary-soft)]/20 to-[var(--color-primary)]/20 flex items-center justify-center">
                      <span className="text-4xl">{sub.icon || '📦'}</span>
                    </div>
                  )}
                  <div className="p-3 text-center">
                    <h3 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {sub.name}
                    </h3>
                    {sub.metadata?.productCount > 0 && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {sub.metadata.productCount} products
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Featured Products *
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {/* Products Section with Filters *
        <div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Desktop *
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    Filters
                  </h3>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                {/* Price Range *
                <div className="mb-6">
                  <h4 className="font-medium text-[var(--color-text)] mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                        placeholder="Max"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                
                {/* Subcategories *
                {subcategories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-[var(--color-text)] mb-3">Subcategories</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {subcategories.map((sub) => (
                        <label key={sub._id} className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-soft)] p-1 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedSubcategories.includes(sub._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubcategories([...selectedSubcategories, sub._id]);
                              } else {
                                setSelectedSubcategories(selectedSubcategories.filter(id => id !== sub._id));
                              }
                            }}
                            className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-sm text-[var(--color-text)] flex-1">{sub.name}</span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            ({sub.metadata?.productCount || 0})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Brands *
                {initialBrands.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-[var(--color-text)] mb-3">Brands</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {initialBrands.filter(b => b).map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-soft)] p-1 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrands([...selectedBrands, brand]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand));
                              }
                            }}
                            className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-sm text-[var(--color-text)]">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Rating Filter *
                <div className="mb-6">
                  <h4 className="font-medium text-[var(--color-text)] mb-3">Customer Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-soft)] p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRatings([...selectedRatings, rating]);
                            } else {
                              setSelectedRatings(selectedRatings.filter(r => r !== rating));
                            }
                          }}
                          className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-sm text-[var(--color-text-muted)] ml-1">
                            & up
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Apply Filters Button *
                <button
                  onClick={applyFilters}
                  disabled={isFiltering}
                  className="w-full mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFiltering ? 'Applying...' : 'Apply Filters'}
                </button>
              </div>
            </div>
            
            {/* Products Grid *
            <div className="flex-1">
              {/* Toolbar *
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFilterSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters() && (
                      <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                    )}
                  </button>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Showing {products.length} of {totalProducts} products
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Toggle *
                  <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown *
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
              
              {/* Active Filters *
              {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {priceRange[0] > initialPriceRange.minPrice && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-soft)]/10 text-[var(--color-primary)] rounded-full text-sm">
                      <span>Min: {formatPrice(priceRange[0])}</span>
                      <button onClick={() => setPriceRange([initialPriceRange.minPrice, priceRange[1]])}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {priceRange[1] < initialPriceRange.maxPrice && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-soft)]/10 text-[var(--color-primary)] rounded-full text-sm">
                      <span>Max: {formatPrice(priceRange[1])}</span>
                      <button onClick={() => setPriceRange([priceRange[0], initialPriceRange.maxPrice])}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedBrands.map(brand => (
                    <div key={brand} className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-soft)]/10 text-[var(--color-primary)] rounded-full text-sm">
                      <span>{brand}</span>
                      <button onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {selectedRatings.map(rating => (
                    <div key={rating} className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-soft)]/10 text-[var(--color-primary)] rounded-full text-sm">
                      <span>{rating}+ Stars</span>
                      <button onClick={() => setSelectedRatings(selectedRatings.filter(r => r !== rating))}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
              
              {/* Products Grid/List *
              {products.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    No products found
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-4">
                    Try adjusting your filters or check back later for new products.
                  </p>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
              
              {/* Pagination *
              {totalProducts > limit && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(Math.ceil(totalProducts / limit))].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first 5 pages, last page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === Math.ceil(totalProducts / limit) ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 3 ||
                      pageNum === currentPage + 3
                    ) {
                      return <span key={i} className="text-[var(--color-text-muted)]">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalProducts / limit)}
                    className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Sidebar *
      {filterSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-[var(--color-surface)] shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Filters</h3>
              <button
                onClick={() => setFilterSidebarOpen(false)}
                className="p-2 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Same filter content as desktop *
              <div className="mb-6">
                <h4 className="font-medium text-[var(--color-text)] mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              {subcategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-[var(--color-text)] mb-3">Subcategories</h4>
                  <div className="space-y-2">
                    {subcategories.map((sub) => (
                      <label key={sub._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubcategories([...selectedSubcategories, sub._id]);
                            } else {
                              setSelectedSubcategories(selectedSubcategories.filter(id => id !== sub._id));
                            }
                          }}
                          className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-text)]">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {initialBrands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-[var(--color-text)] mb-3">Brands</h4>
                  <div className="space-y-2">
                    {initialBrands.filter(b => b).map((brand) => (
                      <label key={brand} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                          className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-text)]">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="font-medium text-[var(--color-text)] mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRatings([...selectedRatings, rating]);
                          } else {
                            setSelectedRatings(selectedRatings.filter(r => r !== rating));
                          }
                        }}
                        className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-[var(--color-text-muted)] ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  applyFilters();
                  setFilterSidebarOpen(false);
                }}
                className="w-full mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}*/

// app/category/[slug]/CategoryPageClient.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Grid, 
  List, 
  ChevronRight, 
  Filter, 
  X,
  Star,
  ChevronLeft,
  ChevronDown,
  SlidersHorizontal,
  Package,
  TrendingUp,
  Sparkles,
  Clock,
  Tag,
  ShoppingBag,
  Heart,
  Eye
} from 'lucide-react';
import ProductCard, { Product } from '@/components/New/components/ProductCard';

interface CategoryPageClientProps {
  category: any;
  subcategories: any[];
  products: any[];
  featuredProducts: any[];
  totalProducts: number;
  currentPage: number;
  currentSort: string;
  priceRange: { minPrice: number; maxPrice: number };
  brands: string[];
  limit?: number;
}

export default function CategoryPageClient({
  category,
  subcategories,
  products: initialProducts,
  featuredProducts,
  totalProducts,
  currentPage,
  currentSort,
  priceRange: initialPriceRange,
  brands: initialBrands,
  limit = 12
}: CategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialPriceRange.minPrice,
    initialPriceRange.maxPrice
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get breadcrumb items
  const breadcrumbs = useMemo(() => {
    if (!category?.path) return [];
    return category.path.split('/').map((name: string, index: number, arr: string[]) => ({
      name,
      slug: arr.slice(0, index + 1).join('/').toLowerCase().replace(/\s+/g, '-')
    }));
  }, [category]);

  // Apply filters and update URL
  const applyFilters = useCallback(() => {
    setIsFiltering(true);
    
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('sort', currentSort);
    
    if (priceRange[0] > initialPriceRange.minPrice) {
      params.set('minPrice', priceRange[0].toString());
    }
    if (priceRange[1] < initialPriceRange.maxPrice) {
      params.set('maxPrice', priceRange[1].toString());
    }
    
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','));
    }
    
    if (selectedRatings.length > 0) {
      params.set('ratings', selectedRatings.join(','));
    }
    
    if (selectedSubcategories.length > 0) {
      params.set('subcategories', selectedSubcategories.join(','));
    }
    
    router.push(`/category/${category.slug}?${params.toString()}`);
    setTimeout(() => setIsFiltering(false), 500);
  }, [priceRange, selectedBrands, selectedRatings, selectedSubcategories, currentSort, category?.slug, router, initialPriceRange]);
  
  // Clear all filters
  const clearFilters = () => {
    setPriceRange([initialPriceRange.minPrice, initialPriceRange.maxPrice]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedSubcategories([]);
    
    router.push(`/category/${category.slug}?page=1&sort=${currentSort}`);
  };
  
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    params.set('page', '1');
    router.push(`/category/${category.slug}?${params.toString()}`);
  };
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/category/${category.slug}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return (
      priceRange[0] > initialPriceRange.minPrice ||
      priceRange[1] < initialPriceRange.maxPrice ||
      selectedBrands.length > 0 ||
      selectedRatings.length > 0 ||
      selectedSubcategories.length > 0
    );
  }, [priceRange, selectedBrands, selectedRatings, selectedSubcategories, initialPriceRange]);
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const totalPages = Math.ceil(totalProducts / limit);
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden">
        <div className="relative h-72 md:h-80 lg:h-96 w-full">
          {category.image ? (
            <>
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)]">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>
          )}
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit mb-4 animate-slide-in">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-white/90">Shop by Category</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-in">
              {category.name}
            </h1>
            
            {category.description && (
              <p className="text-lg text-white/90 max-w-2xl animate-slide-in [animation-delay:100ms]">
                {category.description}
              </p>
            )}
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/80 text-sm mt-6 animate-slide-in [animation-delay:200ms]">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <span>Home</span>
              </Link>
              {breadcrumbs.map((crumb: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-white font-medium">{crumb.name}</span>
                  ) : (
                    <Link
                      href={`/category/${crumb.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Subcategories Section - Modern Card Grid */}
        {subcategories.length > 0 && (
          <div className="mb-12 animate-slide-in [animation-delay:300ms]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
                  <Tag className="w-6 h-6 text-[var(--color-primary)]" />
                  Shop by Subcategory
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Explore our curated subcategories
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subcategories.map((sub, idx) => (
                <Link
                  key={sub._id}
                  href={`/category/${sub.slug}`}
                  className="group relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {sub.image ? (
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image
                        src={sub.image}
                        alt={sub.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20 flex items-center justify-center">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {sub.icon || '📦'}
                      </span>
                    </div>
                  )}
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                      {sub.name}
                    </h3>
                    {sub.metadata?.productCount > 0 && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {sub.metadata.productCount.toLocaleString()} products
                      </p>
                    )}
                  </div>
                  {/* Hover Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/0 to-[var(--color-primary)]/0 group-hover:from-[var(--color-primary)]/5 group-hover:to-[var(--color-primary-alt)]/5 transition-all duration-300 pointer-events-none" />
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Featured Products Section - Premium Display */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Featured Products
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Hand-picked just for you
                </p>
              </div>
              <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent hidden md:block" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <div key={product._id} className="animate-slide-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Products Section with Filters */}
        <div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-[var(--color-primary)]" />
                      Filters
                    </h3>
                    {hasActiveFilters() && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-5 space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                      Price Range
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Min</label>
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            placeholder="Min"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Max</label>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], parseInt(e.target.value) || 0)])}
                            className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                      <div className="relative pt-2">
                        <div className="h-1 bg-[var(--color-border)] rounded-full">
                          <div 
                            className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full"
                            style={{
                              left: `${((priceRange[0] - initialPriceRange.minPrice) / (initialPriceRange.maxPrice - initialPriceRange.minPrice)) * 100}%`,
                              right: `${100 - ((priceRange[1] - initialPriceRange.minPrice) / (initialPriceRange.maxPrice - initialPriceRange.minPrice)) * 100}%`,
                              position: 'relative'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
                          <span>{formatPrice(initialPriceRange.minPrice)}</span>
                          <span>{formatPrice(initialPriceRange.maxPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subcategories */}
                  {subcategories.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-[var(--color-primary)]" />
                        Subcategories
                      </h4>
                      <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                        {subcategories.map((sub) => (
                          <label key={sub._id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[var(--color-background-soft)] transition-all duration-200">
                            <input
                              type="checkbox"
                              checked={selectedSubcategories.includes(sub._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSubcategories([...selectedSubcategories, sub._id]);
                                } else {
                                  setSelectedSubcategories(selectedSubcategories.filter(id => id !== sub._id));
                                }
                              }}
                              className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
                            />
                            <span className="text-sm text-[var(--color-text)] flex-1 group-hover:text-[var(--color-primary)] transition-colors">{sub.name}</span>
                            <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-background-soft)] px-2 py-0.5 rounded-full">
                              {sub.metadata?.productCount || 0}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Brands */}
                  {initialBrands.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                        Brands
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {initialBrands.filter(b => b).map((brand) => (
                          <label key={brand} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[var(--color-background-soft)] transition-all duration-200">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBrands([...selectedBrands, brand]);
                                } else {
                                  setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                }
                              }}
                              className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
                            />
                            <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      Customer Rating
                    </h4>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[var(--color-background-soft)] transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRatings([...selectedRatings, rating]);
                              } else {
                                setSelectedRatings(selectedRatings.filter(r => r !== rating));
                              }
                            }}
                            className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-[var(--color-text-muted)] ml-1">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Apply Button */}
                <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-background-soft)]">
                  <button
                    onClick={applyFilters}
                    disabled={isFiltering}
                    className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isFiltering ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Applying...
                      </div>
                    ) : (
                      'Apply Filters'
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFilterSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                    {hasActiveFilters() && (
                      <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <p className="text-sm text-[var(--color-text-muted)]">
                      <span className="font-semibold text-[var(--color-text)]">{totalProducts.toLocaleString()}</span> products
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'grid'
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-soft)]'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'list'
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-soft)]'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none px-4 py-2.5 pr-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Active Filters Tags */}
              {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2 mb-6 animate-slide-in">
                  {priceRange[0] > initialPriceRange.minPrice && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm border border-[var(--color-primary)]/20">
                      <Tag className="w-3 h-3" />
                      <span>Min: {formatPrice(priceRange[0])}</span>
                      <button onClick={() => setPriceRange([initialPriceRange.minPrice, priceRange[1]])} className="hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {priceRange[1] < initialPriceRange.maxPrice && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm border border-[var(--color-primary)]/20">
                      <Tag className="w-3 h-3" />
                      <span>Max: {formatPrice(priceRange[1])}</span>
                      <button onClick={() => setPriceRange([priceRange[0], initialPriceRange.maxPrice])} className="hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedBrands.map(brand => (
                    <div key={brand} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm border border-[var(--color-primary)]/20">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{brand}</span>
                      <button onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))} className="hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {selectedRatings.map(rating => (
                    <div key={rating} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm border border-[var(--color-primary)]/20">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{rating}+ Stars</span>
                      <button onClick={() => setSelectedRatings(selectedRatings.filter(r => r !== rating))} className="hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors underline-offset-2 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
              
              {/* Products Grid/List */}
              {products.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'
                    : 'space-y-4'
                }>
                  {products.map((product, idx) => (
                    <div key={product._id} className="animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                  <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
                    <Package className="w-12 h-12 text-[var(--color-text-muted)]/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    No products found
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
                    We couldn't find any products matching your criteria. Try adjusting your filters or check back later.
                  </p>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 pt-4 border-t border-[var(--color-border)]">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text)]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md'
                              : 'text-[var(--color-text)] hover:bg-[var(--color-background-soft)] hover:text-[var(--color-primary)]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text)]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Sidebar */}
      {filterSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFilterSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--color-surface)] shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[var(--color-primary)]" />
                Filters
              </h3>
              <button
                onClick={() => setFilterSidebarOpen(false)}
                className="p-2 hover:bg-[var(--color-background-soft)] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-3">Price Range</h4>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                    className="flex-1 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], parseInt(e.target.value) || 0)])}
                    className="flex-1 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-3">Subcategories</h4>
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {subcategories.map((sub) => (
                      <label key={sub._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--color-background-soft)] transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubcategories([...selectedSubcategories, sub._id]);
                            } else {
                              setSelectedSubcategories(selectedSubcategories.filter(id => id !== sub._id));
                            }
                          }}
                          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-text)] flex-1">{sub.name}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">{sub.metadata?.productCount || 0}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Brands */}
              {initialBrands.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-3">Brands</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {initialBrands.filter(b => b).map((brand) => (
                      <label key={brand} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--color-background-soft)] transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-text)]">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Rating */}
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--color-background-soft)] transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRatings([...selectedRatings, rating]);
                          } else {
                            setSelectedRatings(selectedRatings.filter(r => r !== rating));
                          }
                        }}
                        className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm text-[var(--color-text-muted)] ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-[var(--color-text)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setFilterSidebarOpen(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}