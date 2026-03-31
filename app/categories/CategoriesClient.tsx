// app/categories/CategoriesClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronRight, 
  TrendingUp, 
  Clock,
  Truck,
  Shield,
  ArrowRight,
  Grid,
  List
} from 'lucide-react';
import ProductCard from '@/components/New/components/ProductCard';


interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  productCount: number;
  children?: Category[];
}

interface PopularProductsData {
  category: Category;
  products: any[];
}

interface CategoriesClientProps {
  categories: Category[];
  featuredCategories: Category[];
  popularProductsByCategory: PopularProductsData[];
}

export default function CategoriesClient({ 
  categories, 
  featuredCategories,
  popularProductsByCategory 
}: CategoriesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [animatedCards, setAnimatedCards] = useState<string[]>([]);
  
  useEffect(() => {
    // Animate cards on mount
    const timeouts = categories.map((_, index) => {
      const timeout = setTimeout(() => {
        setAnimatedCards(prev => [...prev, categories[index]._id]);
      }, index * 100);
      return timeout;
    });
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [categories]);
  
  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.children?.some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Get icon emoji based on category name
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'Electronics': '📱',
      'Fashion': '👗',
      'Home & Kitchen': '🏠',
      'Beauty & Personal Care': '💄',
      'Food & Beverages': '🍕',
      'Books & Stationery': '📚',
      'Sports & Outdoors': '⚽',
      'Toys & Games': '🎮',
      'Jewelry & Watches': '⌚',
      'Men': '👔',
      'Women': '👚',
    };
    return iconMap[categoryName] || '🛍️';
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] overflow-hidden">
        {/* Simplified background pattern - no SVG data URL issues */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-in">
              Shop by Category
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover thousands of products across our carefully curated categories
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--color-background)"/>
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-2xl font-bold text-[var(--color-primary)]">
              {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0).toLocaleString()}+
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">Products</div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">🏷️</div>
            <div className="text-2xl font-bold text-[var(--color-primary)]">{categories.length}</div>
            <div className="text-sm text-[var(--color-text-muted)]">Categories</div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-[var(--color-primary)]">4.8</div>
            <div className="text-sm text-[var(--color-text-muted)]">Avg Rating</div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">🚚</div>
            <div className="text-2xl font-bold text-[var(--color-primary)]">Free</div>
            <div className="text-sm text-[var(--color-text-muted)]">Delivery*</div>
          </div>
        </div>
        
        {/* Featured Categories Section */}
        {featuredCategories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                  Featured Categories
                </h2>
                <p className="text-[var(--color-text-muted)] mt-1">Most popular categories this week</p>
              </div>
              <Link 
                href="/categories/all" 
                className="flex items-center gap-2 text-[var(--color-primary)] hover:gap-3 transition-all"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="group relative bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background-soft)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="p-4 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(category.name)}
                    </div>
                    <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {category.productCount?.toLocaleString() || 0} products
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/0 to-[var(--color-primary)]/0 group-hover:from-[var(--color-primary)]/5 group-hover:to-transparent transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            All Categories
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Categories Grid/List */}
        {filteredCategories.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
            : 'space-y-4'
          }>
            {filteredCategories.map((category, index) => (
              <div
                key={category._id}
                className={`transform transition-all duration-500 ${
                  animatedCards.includes(category._id) 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {viewMode === 'grid' ? (
                  <CategoryCard category={category} getCategoryIcon={getCategoryIcon} />
                ) : (
                  <CategoryCardList category={category} getCategoryIcon={getCategoryIcon} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
              No categories found
            </h3>
            <p className="text-[var(--color-text-muted)]">
              Try searching with different keywords
            </p>
          </div>
        )}
        
        {/* Popular Products by Category */}
        {popularProductsByCategory.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                Popular Picks
              </h2>
            </div>
            
            {popularProductsByCategory.map(({ category, products }) => (
              products.length > 0 && (
                <div key={category._id} className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">
                      {category.name}
                    </h3>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        
        {/* Benefits Section */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)]/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text)]">Free Delivery</h4>
                <p className="text-sm text-[var(--color-text-muted)]">On orders over KSh 5,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text)]">Secure Payments</h4>
                <p className="text-sm text-[var(--color-text-muted)]">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text)]">24/7 Support</h4>
                <p className="text-sm text-[var(--color-text-muted)]">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Card Component (Grid View)
function CategoryCard({ category, getCategoryIcon }: { category: Category; getCategoryIcon: (name: string) => string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary-soft)]/10 to-transparent rounded-bl-full"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {getCategoryIcon(category.name)}
            </div>
            <div>
              <Link href={`/category/${category.slug}`}>
                <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {category.name}
                </h3>
              </Link>
              <p className="text-sm text-[var(--color-text-muted)]">
                {category.productCount?.toLocaleString() || 0} products
              </p>
            </div>
          </div>
          <Link
            href={`/category/${category.slug}`}
            className="flex items-center gap-1 text-sm text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
          >
            Shop Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {category.description && (
          <p className="text-[var(--color-text-muted)] mb-4 line-clamp-2">
            {category.description}
          </p>
        )}
        
        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {category.children.slice(0, 4).map((subcategory) => (
                <Link
                  key={subcategory._id}
                  href={`/category/${subcategory.slug}`}
                  className="px-3 py-1.5 text-sm bg-[var(--color-background-soft)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
                >
                  {subcategory.name}
                </Link>
              ))}
              {category.children.length > 4 && (
                <span className="px-3 py-1.5 text-sm text-[var(--color-text-muted)]">
                  +{category.children.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Animated border on hover */}
        <div className={`absolute inset-0 rounded-2xl border-2 border-[var(--color-primary)]/0 transition-all duration-500 pointer-events-none ${
          isHovered ? 'border-[var(--color-primary)]/30' : ''
        }`}></div>
      </div>
    </div>
  );
}

// Category Card Component (List View)
function CategoryCardList({ category, getCategoryIcon }: { category: Category; getCategoryIcon: (name: string) => string }) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {getCategoryIcon(category.name)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {category.productCount?.toLocaleString() || 0} products
                </span>
                {category.children && category.children.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">•</span>
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {category.children.length} subcategories
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}