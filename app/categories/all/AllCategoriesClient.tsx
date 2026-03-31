// app/categories/all/AllCategoriesClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ChevronRight, 
  TrendingUp,
  Clock,
  Truck,
  Shield,
  ArrowRight,
  Grid,
  List,
  Layers,
  Package,
  Star,
  ChevronDown,
  ChevronUp,
  Home
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  level: number;
  productCount: number;
  parentId: string | null;
  children?: Category[];
}

interface AllCategoriesClientProps {
  categories: Category[];
  hierarchicalCategories: Category[];
  level1Categories: Category[];
  level2Categories: Category[];
  level3Categories: Category[];
  level4Categories: Category[];
  totalProducts: number;
  totalCategories: number;
  topCategories: Category[];
}

export default function AllCategoriesClient({
  categories,
  hierarchicalCategories,
  level1Categories,
  level2Categories,
  level3Categories,
  level4Categories,
  totalProducts,
  totalCategories,
  topCategories
}: AllCategoriesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeLevel, setActiveLevel] = useState<number>(1);
  
  // Expand all top-level categories by default
  useEffect(() => {
    const initialExpanded = new Set(level1Categories.map(cat => cat._id));
    setExpandedCategories(initialExpanded);
  }, [level1Categories]);
  
  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  
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
      'Mobiles & Accessories': '📱',
      'Computers & Laptops': '💻',
      'Furniture': '🛋️',
      'Skincare': '💆',
      'Snacks': '🍿',
      'Beverages': '🥤',
    };
    return iconMap[categoryName] || '📦';
  };
  
  // Get level badge color
  const getLevelBadge = (level: number) => {
    const colors = {
      1: 'bg-purple-100 text-purple-700',
      2: 'bg-blue-100 text-blue-700',
      3: 'bg-green-100 text-green-700',
      4: 'bg-orange-100 text-orange-700',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };
  
  // Render hierarchical category tree
  const renderCategoryTree = (category: Category, depth: number = 0) => {
    const isExpanded = expandedCategories.has(category._id);
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <div key={category._id} className="relative">
        <div 
          className={`group relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] transition-all duration-300 ${
            depth === 0 ? 'hover:shadow-xl' : 'hover:shadow-md'
          } ${depth > 0 ? 'ml-6 mt-2' : 'mb-3'}`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Expand/Collapse Button */}
                {hasChildren && (
                  <button
                    onClick={() => toggleCategory(category._id)}
                    className="p-1 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                    )}
                  </button>
                )}
                
                {/* Category Icon */}
                <div className={`text-3xl ${!hasChildren && 'ml-6'}`}>
                  {getCategoryIcon(category.name)}
                </div>
                
                {/* Category Info */}
                <div className="flex-1">
                  <Link href={`/category/${category.slug}`}>
                    <h3 className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {category.productCount.toLocaleString()} products
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(category.level)}`}>
                      Level {category.level}
                    </span>
                  </div>
                </div>
                
                {/* Shop Now Button */}
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all opacity-0 group-hover:opacity-100"
                >
                  Shop Now
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Description */}
            {category.description && (
              <p className="text-sm text-[var(--color-text-muted)] mt-2 ml-9">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Children Categories */}
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {category.children?.map(child => renderCategoryTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Breadcrumb Navigation */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
            <Link href="/categories" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text)] font-medium">All Categories</span>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Layers className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Complete Directory</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              All Categories
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Explore our complete category directory with {totalCategories.toLocaleString()} categories and {totalProducts.toLocaleString()} products
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 pl-12 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalCategories}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Categories</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalProducts.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Products</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {level1Categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Main Categories</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {level4Categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Subcategories</div>
          </div>
        </div>
        
        {/* Level Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveLevel(1)}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeLevel === 1
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Main Categories ({level1Categories.length})
          </button>
          <button
            onClick={() => setActiveLevel(2)}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeLevel === 2
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Subcategories ({level2Categories.length})
          </button>
          <button
            onClick={() => setActiveLevel(3)}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeLevel === 3
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Sub-Subcategories ({level3Categories.length})
          </button>
          <button
            onClick={() => setActiveLevel(4)}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeLevel === 4
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Deep Categories ({level4Categories.length})
          </button>
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Categories Display */}
        {searchTerm ? (
          // Search Results
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
              Search Results ({filteredCategories.length})
            </h2>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryIcon(category.name)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {category.productCount.toLocaleString()} products
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(category.level)}`}>
                            Level {category.level}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
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
          </div>
        ) : (
          // Hierarchical Category View
          <div>
            {activeLevel === 1 && viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level1Categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="group relative bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background-soft)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--color-primary-soft)]/10 to-transparent rounded-bl-full"></div>
                    <div className="p-6 text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(category.name)}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                        {category.name}
                      </h3>
                      {/*<p className="text-sm text-[var(--color-text-muted)]">
                        {category.productCount.toLocaleString()} products
                      </p>*/}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all">
                        <span className="text-sm text-[var(--color-primary)] font-medium">
                          Explore Category →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {activeLevel === 1 && viewMode === 'list' && (
              <div className="space-y-3">
                {hierarchicalCategories.map(category => renderCategoryTree(category))}
              </div>
            )}
            
            {activeLevel === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {level2Categories.map((category) => {
                  const parentCategory = categories.find(c => c._id === category.parentId);
                  return (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{getCategoryIcon(category.name)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                            {category.name}
                          </h3>
                          {parentCategory && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              in {parentCategory.name}
                            </p>
                          )}
                          {/*<p className="text-sm text-[var(--color-text-muted)] mt-2">
                            {category.productCount.toLocaleString()} products
                          </p>*/}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {activeLevel === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {level3Categories.map((category) => {
                  const parentCategory = categories.find(c => c._id === category.parentId);
                  const grandParentCategory = parentCategory ? categories.find(c => c._id === parentCategory.parentId) : null;
                  return (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getCategoryIcon(category.name)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {grandParentCategory?.name} / {parentCategory?.name}
                          </p>
                          {/*<p className="text-xs text-[var(--color-text-muted)] mt-2">
                            {category.productCount.toLocaleString()} products
                          </p>*/}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {activeLevel === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {level4Categories.map((category) => {
                  const parentCategory = categories.find(c => c._id === category.parentId);
                  const grandParentCategory = parentCategory ? categories.find(c => c._id === parentCategory.parentId) : null;
                  const greatGrandParentCategory = grandParentCategory ? categories.find(c => c._id === grandParentCategory.parentId) : null;
                  return (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border]) p-3 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-xl">{getCategoryIcon(category.name)}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">
                            {greatGrandParentCategory?.name} / {grandParentCategory?.name} / {parentCategory?.name}
                          </p>
                          {/*<p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {category.productCount.toLocaleString()} products
                          </p>*/}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Top Categories Section */}
        {!searchTerm && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Top Categories by Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topCategories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {category.productCount.toLocaleString()} products
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
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