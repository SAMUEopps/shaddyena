// components/New/components/MainNavbar.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Heart, 
  User, 
  ShoppingBag,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';

interface MainNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isScrolled: boolean;
}

const MainNavbar = ({ isDarkMode, toggleDarkMode, isScrolled }: MainNavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const mainCategories = [
    { name: 'Women', href: '/category/women' },
    { name: 'Men', href: '/category/men' },
    { name: 'Kids', href: '/category/kids' },
    { name: 'Home', href: '/category/home' },
    { name: 'Beauty', href: '/category/beauty' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`
      transition-all duration-300
      ${isScrolled 
        ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-[var(--color-background)]/80 backdrop-blur-sm py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with gradient animation *
          <Link href="/" className="flex items-center space-x-2 group">
            {/*<div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
              <div className="relative bg-[var(--color-surface)] rounded-lg p-2">
                <Store className="w-6 h-6 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
              </div>
            </div>*
            <span className="text-2xl font-bold bg-[var(--color-primary-alt)] bg-clip-text text-transparent">
              Shaddyna
            </span>
          </Link>

          {/* Main Navigation Categories *
          <div className="hidden lg:flex items-center space-x-1">
            {mainCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group"
              >
                {category.name}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* More dropdown *
            <div 
              className="relative z-[60]"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200">
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'more' && (
  <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link href="/deals" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      Hot Deals
                    </Link>
                    <Link href="/new-arrivals" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      New Arrivals
                    </Link>
                    <Link href="/best-sellers" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      Best Sellers
                    </Link>
                    <Link href="/clearance" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      Clearance
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Icons *
          <div className="flex items-center space-x-3">
            <Link href="/wishlist" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full">5</span>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link href="/profile" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link href="/cart" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full">3</span>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;*/

// components/New/components/MainNavbar.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Heart, 
  User, 
  ShoppingBag,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface MainNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isScrolled: boolean;
}

const MainNavbar = ({ isDarkMode, toggleDarkMode, isScrolled }: MainNavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const mainCategories = [
    { name: 'Women', href: '/category/fashion-women' },
    { name: 'Men', href: '/category/men' },
    { name: 'Kids', href: '/category/kids' },
    { name: 'Home', href: '/category/home' },
    { name: 'Beauty', href: '/category/beauty' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`
      transition-all duration-300
      ${isScrolled 
        ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-[var(--color-background)]/80 backdrop-blur-sm py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with gradient animation *
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-[var(--color-primary-alt)] bg-clip-text text-transparent">
              Shaddyna
            </span>
          </Link>

          {/* Main Navigation Categories *
          <div className="hidden lg:flex items-center space-x-1">
            {mainCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group"
              >
                {category.name}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-1/2 transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* More dropdown *
            <div 
              className="relative z-[60]"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200">
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'more' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link href="/deals" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      Hot Deals
                    </Link>
                    <Link href="/new-arrivals" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      New Arrivals
                    </Link>
                    <Link href="/best-sellers" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      Best Sellers
                    </Link>
                    <Link href="/clearance" className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      Clearance
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Icons *
          <div className="flex items-center space-x-3">
            <Link href="/wishlist" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full px-1">
                  {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link href="/profile" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link href="/cart" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;*/

// components/New/components/MainNavbar.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Heart, 
  User, 
  ShoppingBag,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Tag,
  Zap
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import axios from 'axios';

interface Category {
  isActive: boolean;
  order: number;
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  level: number;
  path: string;
  metadata?: {
    productCount: number;
    popular: boolean;
    featured: boolean;
  };
  children?: Category[];
}

interface MainNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isScrolled: boolean;
}

const MainNavbar = ({ isDarkMode, toggleDarkMode, isScrolled }: MainNavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/all?format=tree');
      if (response.data.categories) {
        // Get top-level categories (level 1)
        const topLevelCategories = response.data.categories.filter(
          (cat: Category) => cat.level === 1 && cat.isActive !== false
        );
        
        // Sort by order and limit to 5 main categories
        const sortedCategories = topLevelCategories
          .sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
          .slice(0, 6); // Show up to 6 main categories
        
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: Category) => {
    if (category.icon) return category.icon;
    // Default icons based on category name
    const defaultIcons: { [key: string]: string } = {
      'Electronics': '📱',
      'Fashion': '👕',
      'Home & Kitchen': '🏠',
      'Beauty & Personal Care': '💄',
      'Food & Beverages': '🍔',
      'Books & Stationery': '📚',
    };
    return defaultIcons[category.name] || '📦';
  };

  const renderMegaMenu = (category: Category) => {
    const children = category.children || [];
    const featuredChildren = children.filter(c => c.metadata?.featured).slice(0, 4);
    const popularChildren = children.filter(c => c.metadata?.popular).slice(0, 4);
    const otherChildren = children.filter(c => !c.metadata?.featured && !c.metadata?.popular).slice(0, 8);

    return (
      <div className="absolute top-full left-0 mt-2 w-screen max-w-6xl mx-auto bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="grid grid-cols-4 gap-6 p-6">
          {/* Featured Subcategories *
          {featuredChildren.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Featured
              </h3>
              <div className="space-y-2">
                {featuredChildren.map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="block text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{child.name}</span>
                    {child.metadata?.productCount && child.metadata.productCount > 0 && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        ({child.metadata.productCount})
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular Subcategories *
          {popularChildren.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular
              </h3>
              <div className="space-y-2">
                {popularChildren.map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="block text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{child.name}</span>
                    {child.metadata?.productCount && child.metadata.productCount > 0 && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        ({child.metadata.productCount})
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Subcategories *
          {otherChildren.length > 0 && (
            <div className={featuredChildren.length === 0 && popularChildren.length === 0 ? 'col-span-3' : 'col-span-2'}>
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                All Categories
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {otherChildren.map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{child.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Show All Link *
          <div className="col-span-4 mt-4 pt-4 border-t border-[var(--color-border)]">
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:gap-3 transition-all"
            >
              <span>View All {category.name}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderSimpleDropdown = (category: Category) => {
    const children = category.children || [];
    
    return (
      <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="py-2">
          {children.slice(0, 10).map((child) => (
            <Link
              key={child._id}
              href={`/category/${child.slug}`}
              className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>{child.name}</span>
                {child.metadata?.productCount && child.metadata.productCount > 0 && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {child.metadata.productCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {children.length > 10 && (
            <Link
              href={`/category/${category.slug}`}
              className="block px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-colors font-medium"
            >
              View All {children.length} Categories →
            </Link>
          )}
          {children.length === 0 && (
            <div className="px-4 py-2 text-sm text-[var(--color-text-muted)]">
              No subcategories available
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!mounted || loading) {
    return (
      <div className={`
        transition-all duration-300
        ${isScrolled 
          ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-[var(--color-background)]/80 backdrop-blur-sm py-4'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-[var(--color-primary-alt)] bg-clip-text text-transparent">
                Shaddyna
              </span>
            </Link>
            <div className="hidden lg:flex items-center space-x-1">
              <div className="h-8 w-20 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-[var(--color-background-soft)] rounded-full animate-pulse"></div>
              <div className="w-9 h-9 bg-[var(--color-background-soft)] rounded-full animate-pulse"></div>
              <div className="w-9 h-9 bg-[var(--color-background-soft)] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      transition-all duration-300
      ${isScrolled 
        ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-[var(--color-background)]/80 backdrop-blur-sm py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with gradient animation *
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] bg-clip-text text-transparent">
              Shaddyna
            </span>
          </Link>

          {/* Main Navigation Categories *
          <div className="hidden lg:flex items-center space-x-1">
            {categories.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const useMegaMenu = category.children && category.children.length > 6;
              
              return (
                <div 
                  key={category._id}
                  className="relative z-[60]"
                  onMouseEnter={() => setActiveDropdown(category._id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center space-x-1 px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group"
                  >
                    <span className="text-lg mr-1">{getCategoryIcon(category)}</span>
                    <span>{category.name}</span>
                    {hasChildren && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === category._id ? 'rotate-180' : ''}`} />
                    )}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-1/2 transition-all duration-300"></span>
                  </Link>
                  
                  {hasChildren && activeDropdown === category._id && (
                    useMegaMenu ? renderMegaMenu(category) : renderSimpleDropdown(category)
                  )}
                </div>
              );
            })}
            
            {/* Special Links *
            <div 
              className="relative z-[60]"
              onMouseEnter={() => setActiveDropdown('special')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200">
                <Zap className="w-4 h-4" />
                <span>Special</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'special' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'special' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link href="/deals" className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      <Tag className="w-4 h-4" />
                      Hot Deals
                    </Link>
                    <Link href="/new-arrivals" className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      <Sparkles className="w-4 h-4" />
                      New Arrivals
                    </Link>
                    <Link href="/best-sellers" className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      <TrendingUp className="w-4 h-4" />
                      Best Sellers
                    </Link>
                    <Link href="/clearance" className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors">
                      <Tag className="w-4 h-4" />
                      Clearance
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Icons *
          <div className="flex items-center space-x-3">
            <Link href="/wishlist" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full px-1">
                  {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link href="/profile" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link href="/cart" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all duration-200 relative group"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;*/

// components/New/components/MainNavbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  User, 
  ShoppingBag,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Tag,
  Zap,
  Menu,
  X,
  Grid3x3,
  BellDotIcon,
  BellIcon
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import axios from 'axios';

// Category icon mapping with Lucide icons
const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  'Electronics': <Zap className="w-4 h-4" />,
  'Fashion': <Sparkles className="w-4 h-4" />,
  'Home & Kitchen': <Grid3x3 className="w-4 h-4" />,
  'Beauty': <Sparkles className="w-4 h-4" />,
  'Food': <Tag className="w-4 h-4" />,
  'Books': <Grid3x3 className="w-4 h-4" />,
};

interface Category {
  isActive: boolean;
  order: number;
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  level: number;
  path: string;
  metadata?: {
    productCount: number;
    popular: boolean;
    featured: boolean;
  };
  children?: Category[];
}

interface MainNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isScrolled: boolean;
}

const MainNavbar = ({ isDarkMode, toggleDarkMode, isScrolled }: MainNavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  //const dropdownTimeout = useRef<NodeJS.Timeout>();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/all?format=tree');
      if (response.data.categories) {
        const topLevelCategories = response.data.categories.filter(
          (cat: Category) => cat.level === 1 && cat.isActive !== false
        );
        
        const sortedCategories = topLevelCategories
          .sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
          .slice(0, 4);
        
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (id: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const getCategoryIcon = (category: Category) => {
    const defaultIcon = CATEGORY_ICONS[category.name] || <Grid3x3 className="w-4 h-4" />;
    return defaultIcon;
  };

  const truncateName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  const renderMegaMenu = (category: Category) => {
    const children = category.children || [];
    const featuredChildren = children.filter(c => c.metadata?.featured).slice(0, 4);
    const popularChildren = children.filter(c => c.metadata?.popular).slice(0, 4);
    const otherChildren = children.filter(c => !c.metadata?.featured && !c.metadata?.popular).slice(0, 8);

    return (
      <div className="absolute top-full left-0 mt-1 w-screen max-w-6xl mx-auto bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="grid grid-cols-4 gap-5 p-5">
          {featuredChildren.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-primary)] mb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Featured
              </h3>
              <div className="space-y-1.5">
                {featuredChildren.map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="block text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group flex items-center gap-1.5 py-1"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="truncate">{truncateName(child.name, 20)}</span>
                    {child.metadata?.productCount && child.metadata.productCount > 0 && (
                      <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                        {child.metadata.productCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {popularChildren.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-primary)] mb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                <TrendingUp className="w-3.5 h-3.5" />
                Popular
              </h3>
              <div className="space-y-1.5">
                {popularChildren.map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="block text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group flex items-center gap-1.5 py-1"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="truncate">{truncateName(child.name, 20)}</span>
                    {child.metadata?.productCount && child.metadata.productCount > 0 && (
                      <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                        {child.metadata.productCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {otherChildren.length > 0 && (
            <div className={featuredChildren.length === 0 && popularChildren.length === 0 ? 'col-span-4' : 'col-span-2'}>
              <h3 className="text-xs font-semibold text-[var(--color-text)] mb-2.5 uppercase tracking-wide">
                All Categories
              </h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {otherChildren.map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group flex items-center gap-1.5 py-1"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    <span className="truncate">{truncateName(child.name, 18)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-4 mt-3 pt-3 border-t border-[var(--color-border)]">
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:gap-3 transition-all"
            >
              <span>View All {category.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderSimpleDropdown = (category: Category) => {
    const children = category.children || [];
    
    return (
      <div className="absolute top-full left-0 mt-1 w-64 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="py-2">
          {children.slice(0, 8).map((child) => (
            <Link
              key={child._id}
              href={`/category/${child.slug}`}
              className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-soft)]/20 hover:text-[var(--color-primary)] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{truncateName(child.name, 25)}</span>
                {child.metadata?.productCount && child.metadata.productCount > 0 && (
                  <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">
                    {child.metadata.productCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {children.length > 8 && (
            <Link
              href={`/category/${category.slug}`}
              className="block px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]/20 transition-colors font-medium"
            >
              View All {children.length} Categories →
            </Link>
          )}
          {children.length === 0 && (
            <div className="px-4 py-2 text-sm text-[var(--color-text-muted)]">
              No subcategories available
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => (
    <div className="fixed inset-0 top-[calc(2.5rem+3.5rem)] bg-[var(--color-background)] z-50 overflow-y-auto lg:hidden animate-in slide-in-from-right duration-300">
      <div className="p-4 space-y-4">
        {categories.map((category) => (
          <div key={category._id} className="border-b border-[var(--color-border)] pb-3">
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center gap-3 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-[var(--color-primary)]">{getCategoryIcon(category)}</span>
              <span className="font-medium">{category.name}</span>
            </Link>
            {category.children && category.children.length > 0 && (
              <div className="pl-8 mt-2 space-y-2">
                {category.children.slice(0, 5).map((child) => (
                  <Link
                    key={child._id}
                    href={`/category/${child.slug}`}
                    className="block py-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {truncateName(child.name, 25)}
                  </Link>
                ))}
                {category.children.length > 5 && (
                  <Link
                    href={`/category/${category.slug}`}
                    className="block py-1 text-sm text-[var(--color-primary)] font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All →
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Special Offers</h3>
          <div className="space-y-2">
            <Link href="/deals" className="flex items-center gap-2 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)]" onClick={() => setMobileMenuOpen(false)}>
              <Tag className="w-4 h-4" />
              Hot Deals
            </Link>
            <Link href="/new-arrivals" className="flex items-center gap-2 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)]" onClick={() => setMobileMenuOpen(false)}>
              <Sparkles className="w-4 h-4" />
              New Arrivals
            </Link>
            <Link href="/best-sellers" className="flex items-center gap-2 py-2 text-[var(--color-text)] hover:text-[var(--color-primary)]" onClick={() => setMobileMenuOpen(false)}>
              <TrendingUp className="w-4 h-4" />
              Best Sellers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted || loading) {
    return (
      <div className={`
        relative z-[50] transition-all duration-300 h-14
        ${isScrolled 
          ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-sm' 
          : 'bg-[var(--color-background)]'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="h-8 w-32 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
            <div className="hidden lg:flex items-center gap-1">
              <div className="h-8 w-20 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-[var(--color-background-soft)] rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--color-background-soft)] rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-[var(--color-background-soft)] rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-[var(--color-background-soft)] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`
        relative z-[50] transition-all duration-300 h-14
        ${isScrolled 
          ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-sm' 
          : 'bg-[var(--color-background)]'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo */}
            <Link href="/" className="flex items-center group z-[51] flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] bg-clip-text text-transparent">
                Shaddyna
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-4">
              <div className="flex items-center gap-0.5">
                {categories.map((category) => {
                  const hasChildren = category.children && category.children.length > 0;
                  const useMegaMenu = category.children && category.children.length > 5;
                  
                  return (
                    <div 
                      key={category._id}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(category._id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200 whitespace-nowrap"
                      >
                        <span className="text-[var(--color-primary)]">{getCategoryIcon(category)}</span>
                        <span>{truncateName(category.name, 14)}</span>
                        {hasChildren && (
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === category._id ? 'rotate-180' : ''}`} />
                        )}
                      </Link>
                      
                      {hasChildren && activeDropdown === category._id && (
                        useMegaMenu ? renderMegaMenu(category) : renderSimpleDropdown(category)
                      )}
                    </div>
                  );
                })}
                
                {/* Special Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('special')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200 whitespace-nowrap">
                    <Zap className="w-4 h-4" />
                    <span>Special</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'special' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'special' && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="py-2">
                        <Link href="/deals" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-soft)]/20 hover:text-[var(--color-primary)] transition-colors">
                          <Tag className="w-4 h-4" />
                          Hot Deals
                        </Link>
                        <Link href="/new-arrivals" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-soft)]/20 hover:text-[var(--color-primary)] transition-colors">
                          <Sparkles className="w-4 h-4" />
                          New Arrivals
                        </Link>
                        <Link href="/best-sellers" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-soft)]/20 hover:text-[var(--color-primary)] transition-colors">
                          <TrendingUp className="w-4 h-4" />
                          Best Sellers
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 z-[51]">
              <Link href="/wishlist" className="relative p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-4 bg-[var(--color-primary)] text-white text-[10px] font-medium flex items-center justify-center rounded-full px-1">
                    {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-4 bg-[var(--color-primary)] text-white text-[10px] font-medium flex items-center justify-center rounded-full px-1">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              <Link href="/notification" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200">
                <BellIcon className="w-5 h-5" />
              </Link>

              <Link href="/profile" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200">
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={toggleDarkMode}
                className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/20 transition-all duration-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && renderMobileMenu()}
    </>
  );
};

export default MainNavbar;