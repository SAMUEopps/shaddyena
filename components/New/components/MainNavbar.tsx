// components/New/components/MainNavbar.tsx
'use client';

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
          
          {/* Logo with gradient animation */}
          <Link href="/" className="flex items-center space-x-2 group">
            {/*<div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
              <div className="relative bg-[var(--color-surface)] rounded-lg p-2">
                <Store className="w-6 h-6 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
              </div>
            </div>*/}
            <span className="text-2xl font-bold bg-[var(--color-primary-alt)] bg-clip-text text-transparent">
              Shaddyna
            </span>
          </Link>

          {/* Main Navigation Categories */}
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
            
            {/* More dropdown */}
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

          {/* Right Icons */}
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

export default MainNavbar;