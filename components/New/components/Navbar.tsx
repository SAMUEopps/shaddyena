// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Search, 
  User, 
  Moon, 
  Sun,
  ChevronDown,
  Store
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Categories for mega menu
  const categories = [
    { name: 'Fashion', href: '/category/fashion' },
    { name: 'Electronics', href: '/category/electronics' },
    { name: 'Home & Living', href: '/category/home-living' },
    { name: 'Beauty', href: '/category/beauty' },
    { name: 'Jewelry', href: '/category/jewelry' },
    { name: 'Art & Collectibles', href: '/category/art' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render theme-dependent UI until mounted to prevent hydration mismatch
  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <nav 
      className={`
        fixed w-full z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-[var(--color-background)]/80 backdrop-blur-sm py-4'
        }
      `}
      style={{
        backgroundColor: isScrolled 
          ? 'var(--color-surface)' 
          : 'var(--color-background)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            {/*<div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-[var(--color-surface)] rounded-lg p-2">
                <Store className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            </div>*/}
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] bg-clip-text text-transparent">
              Shaddyna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200">
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {activeDropdown === 'categories' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors duration-200"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/shops" className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200">
              Shops
            </Link>
            <Link href="/deals" className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200">
              Deals
            </Link>
            <Link href="/sell" className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200">
              Sell
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200 relative group">
              <Search className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>

            {/* User */}
            <Link href="/account" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200 relative group">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200 relative group">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full">3</span>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200 relative group"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          md:hidden fixed left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] transition-all duration-300 ease-in-out
          ${isOpen ? 'top-[72px] opacity-100 visible' : 'top-[56px] opacity-0 invisible pointer-events-none'}
        `}>
          <div className="px-4 py-6 space-y-4">
            {/* Categories */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Categories
              </div>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Other Links */}
            <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
              <Link
                href="/shops"
                className="block py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Shops
              </Link>
              <Link
                href="/deals"
                className="block py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/sell"
                className="block py-2 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Start Selling
              </Link>
            </div>

            {/* Vendor CTA */}
            <div className="pt-4">
              <Link
                href="/vendor-registration"
                className="block w-full py-3 px-4 text-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={() => setIsOpen(false)}
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -bottom-12">
          <Link
            href="/vendor-registration"
            className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all duration-300 animate-bounce-subtle"
          >
            <Store className="w-4 h-4 mr-2" />
            Sell on Shaddyna
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;