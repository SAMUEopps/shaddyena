// components/New/components/ProductsListing.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Search,
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  rating?: {
    average: number;
    count: number;
  };
  shopId: {
    _id: string;
    businessName: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ProductsListing = () => {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Available categories
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    // Extract unique categories from products
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'All Categories' && { category: selectedCategory })
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KSH',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setPriceRange([0, 1000]);
    setSortBy('newest');
    fetchProducts(1);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header *
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <ShoppingBag className="w-32 h-32 text-[var(--color-primary)]" />
        </div>
        
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-alt)] mb-3">
            All Products
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl">
            Discover our complete collection of premium products from trusted vendors
          </p>
        </div>
      </div>

      {/* Search and Filter Bar *
      <div className="relative mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search *
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
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

          {/* Filter Button (Mobile) *
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort & View *
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

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
        </div>

        {/* Filters *
        <div className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 ${!showFilters && 'hidden lg:grid'}`}>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              fetchProducts(1);
            }}
            className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
          >
            <option>All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'All Categories' || priceRange[1] < 1000) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center justify-center gap-2 transition-all border border-[var(--color-border)] rounded-lg"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count *
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-semibold text-[var(--color-primary)]">{products.length}</span> of{' '}
          <span className="font-semibold">{pagination.total}</span> products
        </p>
      </div>

      {/* Products Grid/List *
      {loading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-48 bg-[var(--color-border)]"></div>
              <div className="p-4">
                <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-[var(--color-border)] rounded-xl flex-1"></div>
                  <div className="h-10 w-10 bg-[var(--color-border)] rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No products found</h3>
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
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => {
              const discount = product.originalPrice 
                ? getDiscountPercentage(product.originalPrice, product.price)
                : 0;

              return (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--color-primary)]/30"
                >
                  {/* Image Container *
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)] opacity-30" />
                      </div>
                    )}

                    {/* Discount Badge *
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                        -{discount}%
                      </div>
                    )}

                    {/* Quick Action Buttons *
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product._id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(product._id) 
                              ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                              : 'text-[var(--color-text-muted)]'
                          }`} 
                        />
                      </button>
                      
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform">
                        <Eye className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" />
                      </button>
                    </div>

                    {/* Stock Status *
                    {product.stock < 10 && (
                      <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>

                  {/* Product Info *
                  <div className="p-4">
                    {/* Category & Shop *
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.shopId && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {product.shopId.businessName}
                        </span>
                      )}
                    </div>

                    {/* Product Name *
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 line-clamp-2 h-10">
                      {product.name}
                    </h3>

                    {/* Rating *
                    {product.rating && product.rating.count > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
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
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          ({product.rating.count})
                        </span>
                      </div>
                    )}

                    {/* Price *
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-[var(--color-primary-alt)]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[var(--color-text-muted)] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button *
                    <button className="w-full bg-[var(--color-primary-alt)] text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Hover Effect - Animated Border *
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none"></div>
                </Link>
              );
            })}
          </div>

          {/* Pagination *
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`p-2 rounded-lg border border-[var(--color-border)] transition-all ${
                  pagination.page > 1
                    ? 'hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === pagination.pages ||
                  (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] h-10 rounded-lg border transition-all ${
                        pagination.page === pageNum
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'border-[var(--color-border)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === pagination.page - 2 ||
                  pageNum === pagination.page + 2
                ) {
                  return <span key={pageNum} className="text-[var(--color-text-muted)]">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`p-2 rounded-lg border border-[var(--color-border)] transition-all ${
                  pagination.page < pagination.pages
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

export default ProductsListing;*/

// components/New/components/ProductsListing.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Search,
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';


interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  rating?: {
    average: number;
    count: number;
  };
  shopId: {
    _id: string;
    businessName: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ProductsListing = () => {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  
  // Available categories
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    // Extract unique categories from products
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'All Categories' && { category: selectedCategory })
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
  const cartItem = {
    _id: product._id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.images?.[0] || '/placeholder-image.jpg',
    vendorId: product.shopId?._id || '',
    shopId: product.shopId?._id || '',
    sku: `SKU-${product._id}`,
  };

  addToCart(cartItem);

  // feedback
  setAddedToCart(product._id);
  setTimeout(() => {
    setAddedToCart(null);
  }, 2000);
};

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KSH',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setPriceRange([0, 1000]);
    setSortBy('newest');
    fetchProducts(1);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <ShoppingBag className="w-24 h-24 sm:w-32 text-[var(--color-primary)]" />
        </div>
        
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-primary-alt)] mb-2 sm:mb-3">
            All Products
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-2xl">
            Discover our complete collection of premium products from trusted vendors
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="relative mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-sm sm:text-base"
              />
              <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)]" />
              {searchQuery && (
                <button
                  onClick={handleSearch}
                  className="absolute right-2 sm:right-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </div>

          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all text-sm sm:text-base"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Filters</span>
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort & View - Hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

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
        </div>

        {/* Filters */}
        <div className={`mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${!showFilters && 'hidden lg:grid'}`}>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              fetchProducts(1);
            }}
            className="px-3 sm:px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
          >
            <option key="all-categories" value="All Categories">All Categories</option>
            {categories.map((cat, index) => (
              <option key={`category-${cat}-${index}`} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="px-3 sm:px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-1">
              <span>KSh {priceRange[0]}</span>
              <span>KSh {priceRange[1]}</span>
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'All Categories' || priceRange[1] < 1000) && (
            <button
              onClick={clearFilters}
              className="px-3 sm:px-4 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1.5 sm:gap-2 transition-all border border-[var(--color-border)] rounded-lg text-sm"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-semibold text-[var(--color-primary)]">{products.length}</span> of{' '}
          <span className="font-semibold">{pagination.total}</span> products
        </p>
      </div>

      {/* Products Grid/List - REFACTORED FOR 2 COLUMNS ON MOBILE */}
      {loading ? (
        <div className={`grid gap-2 xs:gap-3 sm:gap-4 lg:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={`skeleton-${i}`} className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden animate-pulse">
              <div className="h-28 xs:h-32 sm:h-40 lg:h-48 bg-[var(--color-border)]"></div>
              <div className="p-2 xs:p-3 sm:p-4">
                <div className="h-2.5 xs:h-3 sm:h-4 bg-[var(--color-border)] rounded w-3/4 mb-1.5 xs:mb-2"></div>
                <div className="h-2 xs:h-2.5 sm:h-3 bg-[var(--color-border)] rounded w-1/2 mb-2 xs:mb-3"></div>
                <div className="h-4 xs:h-5 sm:h-6 bg-[var(--color-border)] rounded w-1/3 mb-2 xs:mb-3"></div>
                <div className="flex gap-1.5 xs:gap-2">
                  <div className="h-7 xs:h-8 sm:h-10 bg-[var(--color-border)] rounded-lg sm:rounded-xl flex-1"></div>
                  <div className="h-7 xs:h-8 sm:h-10 w-7 xs:w-8 sm:w-10 bg-[var(--color-border)] rounded-lg sm:rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <ShoppingBag className="w-12 h-12 sm:w-16 text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-2">No products found</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all text-sm sm:text-base"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className={`grid gap-2 xs:gap-3 sm:gap-4 lg:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product, index) => {
              const discount = product.originalPrice 
                ? getDiscountPercentage(product.originalPrice, product.price)
                : 0;
                  const isAdded = addedToCart === product._id;

              return (
                <Link
                  key={`product-${product._id}-${index}`}
                  href={`/products/${product._id}`}
                  className="group relative bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--color-primary)]/30"
                >
                  {/* Image Container - Responsive height */}
                  <div className="relative h-28 xs:h-32 sm:h-40 lg:h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 sm:duration-700"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[var(--color-text-muted)] opacity-30" />
                      </div>
                    )}

                    {/* Discount Badge - Responsive sizing */}
                    {discount > 0 && (
                      <div className="absolute top-1.5 left-1.5 xs:top-2 xs:left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-primary)] text-white px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md sm:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-bold shadow-md">
                        -{discount}%
                      </div>
                    )}

                    {/* Quick Action Buttons - Responsive sizing */}
                    <div className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product._id);
                        }}
                        className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart 
                          className={`w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ${
                            favorites.includes(product._id) 
                              ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' 
                              : 'text-[var(--color-text-muted)]'
                          }`} 
                        />
                      </button>
                      
                      <button className="p-1 xs:p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg shadow-md hover:scale-110 transition-transform hidden xs:flex">
                        <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" />
                      </button>
                    </div>

                    {/* Stock Status - Responsive sizing */}
                    {product.stock < 10 && (
                      <div className="absolute bottom-1.5 left-1.5 xs:bottom-2 xs:left-2 sm:bottom-3 sm:left-3 bg-amber-500/90 backdrop-blur-sm text-white px-1.5 xs:px-2 py-0.5 rounded-md sm:rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>

                  {/* Product Info - Responsive padding and text */}
                  <div className="p-2 xs:p-3 sm:p-4">
                    {/* Category & Shop - Responsive text */}
                    <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2">
                      <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 px-1.5 xs:px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                      {product.shopId && (
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate max-w-[50px] xs:max-w-[70px] sm:max-w-[100px]">
                          {product.shopId.businessName}
                        </span>
                      )}
                    </div>

                    {/* Product Name - Responsive text */}
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 h-6 xs:h-8 sm:h-10">
                      {product.name}
                    </h3>

                    {/* Rating - Responsive sizing */}
                    {product.rating && product.rating.count > 0 && (
                      <div className="flex items-center gap-0.5 xs:gap-1 mb-1 xs:mb-1.5 sm:mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`star-${product._id}-${i}`}
                              className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 ${
                                i < Math.floor(product.rating?.average || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-[var(--color-border)]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">
                          ({product.rating.count})
                        </span>
                      </div>
                    )}

                    {/* Price - Responsive text */}
                    <div className="flex items-baseline gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-2.5 sm:mb-3">
                      <span className="text-xs xs:text-sm sm:text-lg font-bold text-[var(--color-primary-alt)]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button - Responsive */}
                    {/*<button className="w-full bg-[var(--color-primary-alt)] text-white py-1.5 xs:py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[8px] xs:text-[10px] sm:text-sm font-medium hover:shadow-md hover:shadow-[var(--color-primary)]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
                      <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Add to Cart</span>
                      <span className="xs:hidden">Add</span>
                    </button>*/}
                 

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={product.stock === 0}
                      className={`w-full py-1.5 xs:py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[8px] xs:text-[10px] sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isAdded
                          ? 'bg-green-500 text-white hover:shadow-md hover:shadow-green-500/30'
                          : 'bg-[var(--color-primary-alt)] text-white hover:shadow-md hover:shadow-[var(--color-primary)]/30'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Added!</span>
                          <span className="xs:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </span>
                          <span className="xs:hidden">
                            {product.stock === 0 ? 'Sold' : 'Add'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hover Effect - Hidden on mobile */}
                  <div className="absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-300 pointer-events-none hidden sm:block"></div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`p-1.5 sm:p-2 rounded-lg border border-[var(--color-border)] transition-all ${
                  pagination.page > 1
                    ? 'hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === pagination.pages ||
                  (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 rounded-lg border transition-all text-sm ${
                        pagination.page === pageNum
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'border-[var(--color-border)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === pagination.page - 2 ||
                  pageNum === pagination.page + 2
                ) {
                  return <span key={`ellipsis-${pageNum}`} className="text-[var(--color-text-muted)] px-1">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`p-1.5 sm:p-2 rounded-lg border border-[var(--color-border)] transition-all ${
                  pagination.page < pagination.pages
                    ? 'hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsListing;