// components/New/components/BottomNavbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Search, 
  Grid,
  ChevronRight,
  Home,
  Package,
  Tag,
  Users,
  Store,
  Award,
  HelpCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface BottomNavbarProps {
  isScrolled: boolean;
}

const BottomNavbar = ({ isScrolled }: BottomNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mega menu categories
  const menuCategories = [
    {
      title: 'Shop by Category',
      icon: <Grid className="w-5 h-5" />,
      items: [
        { name: 'Fashion', href: '/category/fashion' },
        { name: 'Electronics', href: '/category/electronics' },
        { name: 'Home & Living', href: '/category/home-living' },
        { name: 'Beauty & Personal Care', href: '/category/beauty' },
        { name: 'Jewelry & Accessories', href: '/category/jewelry' },
        { name: 'Art & Collectibles', href: '/category/art' },
        { name: 'Sports & Outdoors', href: '/category/sports' },
        { name: 'Toys & Games', href: '/category/toys' },
      ]
    },
    {
      title: 'Quick Links',
      icon: <Tag className="w-5 h-5" />,
      items: [
        { name: 'Today\'s Deals', href: '/deals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Clearance', href: '/clearance' },
        { name: 'Gift Cards', href: '/gift-cards' },
      ]
    },
    {
      title: 'Vendor Zone',
      icon: <Store className="w-5 h-5" />,
      items: [
        { name: 'Become a Vendor', href: '/vendor-registration' },
        { name: 'Vendor Dashboard', href: '/vendor/dashboard' },
        { name: 'Sell on Shaddyna', href: '/sell' },
        { name: 'Vendor Support', href: '/vendor-support' },
      ]
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns Policy', href: '/returns' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/track-order' },
      ]
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Handle click outside to close menu
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`
      transition-all duration-300 border-t border-[var(--color-border)]
      ${isScrolled 
        ? 'bg-[var(--color-surface)]/95 backdrop-blur-md py-2' 
        : 'bg-[var(--color-background)] py-3'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          
          {/* Hamburger Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                flex items-center space-x-2 px-4 py-2.5 rounded-xl
                bg-[var(--color-primary-alt)]
                text-white font-medium hover:shadow-lg hover:shadow-[var(--color-primary)]/20
                transition-all duration-300 transform hover:scale-105
                ${isMenuOpen ? 'shadow-lg scale-105' : ''}
              `}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="hidden sm:inline">Main menu</span>
            </button>

            {/* Mega Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                  {menuCategories.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <div className="flex items-center space-x-2 text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
                        {category.icon}
                        <h3 className="font-semibold">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="flex items-center justify-between group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span>{item.name}</span>
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Bottom CTA */}
                <div className="bg-[var(--color-primary-soft)]/20 p-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">Need help? Call us: +1 (800) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">support@shaddyna.com</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for products, brands, and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
              <Search className="absolute left-4 w-5 h-5 text-[var(--color-text-muted)]" />
              {searchQuery && (
                <button className="absolute right-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                  Search
                </button>
              )}
            </div>
          </div>

          {/* Quick Links for Mobile/Tablet */}
          {/*<div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all">
              <Home className="w-5 h-5" />
            </Link>
            <Link href="/deals" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all">
              <Tag className="w-5 h-5" />
            </Link>
            <Link href="/orders" className="p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-soft)]/30 transition-all">
              <Package className="w-5 h-5" />
            </Link>
          </div>*/}
{/* Social Media Icons */}
<div className="flex items-center space-x-3">

  {/* Facebook */}
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 
               text-[var(--color-primary)] 
               bg-[var(--color-primary-soft)]/30 
               rounded-full
               transition-all duration-300 ease-in-out
               hover:bg-[var(--color-primary-soft)] 
               hover:shadow-md
               hover:-translate-y-0.5
               hover:scale-110"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" />
    </svg>
  </a>

  {/* Instagram */}
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 
               text-[var(--color-primary)] 
               bg-[var(--color-primary-soft)]/30 
               rounded-full
               transition-all duration-300 ease-in-out
               hover:bg-[var(--color-primary-soft)] 
               hover:shadow-md
               hover:-translate-y-0.5
               hover:scale-110"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7.75 2h8.5C19.097 2 22 4.903 22 7.75v8.5C22 19.097 19.097 22 16.25 22h-8.5C4.903 22 2 19.097 2 16.25v-8.5C2 4.903 4.903 2 7.75 2zm0 1.5C5.679 3.5 4 5.179 4 7.25v8.5C4 18.321 5.679 20 7.75 20h8.5C18.321 20 20 18.321 20 16.25v-8.5C20 5.679 18.321 3.5 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
    </svg>
  </a>

  {/* Twitter */}
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 
               text-[var(--color-primary)] 
               bg-[var(--color-primary-soft)]/30 
               rounded-full
               transition-all duration-300 ease-in-out
               hover:bg-[var(--color-primary-soft)] 
               hover:shadow-md
               hover:-translate-y-0.5
               hover:scale-110"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23 3a10.9 10.9 0 0 1-3.14.86A4.48 4.48 0 0 0 22.4.36a9.1 9.1 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.6 0c-2.52 0-4.57 2.07-4.57 4.62 0 .36.04.71.12 1.05A12.93 12.93 0 0 1 1.64.88a4.6 4.6 0 0 0-.62 2.33c0 1.61.8 3.03 2.02 3.86A4.52 4.52 0 0 1 .96 6v.06c0 2.26 1.6 4.14 3.72 4.57a4.48 4.48 0 0 1-2.06.08c.58 1.8 2.26 3.12 4.25 3.15A9.06 9.06 0 0 1 0 19.53a12.76 12.76 0 0 0 6.92 2.03c8.3 0 12.84-6.92 12.84-12.92l-.01-.59A9.25 9.25 0 0 0 23 3z" />
    </svg>
  </a>

</div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;