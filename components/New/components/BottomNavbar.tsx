// components/New/components/BottomNavbar.tsx
/*'use client';

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
          
          {/* Hamburger Menu Button *
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

            {/* Mega Menu Dropdown *
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
                
                {/* Bottom CTA *
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

          {/* Search Bar *
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

          {/* Quick Links for Mobile/Tablet *
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
          </div>*
          {/* Social Media Icons *
          <div className="flex items-center space-x-3">

            {/* Facebook *
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

            {/* Instagram *
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

            {/* Twitter *
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

export default BottomNavbar;*/

// components/New/components/BottomNavbar.tsx


/*'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
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
  MapPin,
  ShoppingBag,
  Heart,
  User,
  LayoutDashboard,
  CreditCard,
  Gift,
  Clock,
  Truck,
  FileText,
  ShoppingCart,
  LogOut,
  Settings,
  Building,
  BarChart3
} from 'lucide-react';

interface BottomNavbarProps {
  isScrolled: boolean;
}

// Define menu item types
interface BaseMenuItem {
  name: string;
  href: string;
}

interface MenuItemWithIcon extends BaseMenuItem {
  icon?: React.ReactNode;
  badge?: number;
}

interface MenuItemWithOnClick extends BaseMenuItem {
  onClick?: string;
  icon?: React.ReactNode;
}

type MenuItem = MenuItemWithIcon | MenuItemWithOnClick;

interface MenuCategory {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface RoleBasedNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  role: string[];
}

const BottomNavbar = ({ isScrolled }: BottomNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Auth and data contexts
  const { user, logout } = useAuth();
  const { totalItems: cartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();

  // Function to handle become vendor modal - you'll need to implement this
  const handleBecomeVendor = () => {
    // Implement your modal opening logic here
    console.log('Open become vendor modal');
    // You can use a state management solution or pass this as a prop
    setIsMenuOpen(false);
  };

  // Generate role-based navigation items
  const getRoleBasedNavItems = (): RoleBasedNavItem[] => {
    if (!user) return [];

    const navItems: RoleBasedNavItem[] = [];

    // Dashboard for all users except customers (since customers have home tab)
    if (user.role !== 'customer') {
      navItems.push({
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />,
        role: ['vendor', 'admin', 'delivery']
      });
    }

    // Products tab for vendors and admins
    if (user.role === 'vendor' || user.role === 'admin') {
      navItems.push({
        name: 'Products',
        href: '/products',
        icon: <Package className="w-5 h-5" />,
        role: ['vendor', 'admin']
      });
    }

    // Shops tab for all users
    navItems.push({
      name: 'Shops',
      href: '/shops',
      icon: <Store className="w-5 h-5" />,
      role: ['customer', 'vendor', 'admin']
    });

    // Orders tab
    navItems.push({
      name: 'Orders',
      href: '/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      role: ['customer', 'vendor', 'admin', 'delivery']
    });

    // Delivery tab for delivery personnel
    if (user.role === 'delivery') {
      navItems.push({
        name: 'Delivery',
        href: '/delivery',
        icon: <Truck className="w-5 h-5" />,
        role: ['delivery']
      });
    }

    // Seller Requests for admins
    if (user.role === 'admin') {
      navItems.push({
        name: 'Seller Requests',
        href: '/seller-requests',
        icon: <Users className="w-5 h-5" />,
        role: ['admin']
      });
    }

    // Users management for admins
    if (user.role === 'admin') {
      navItems.push({
        name: 'Users',
        href: '/users',
        icon: <Users className="w-5 h-5" />,
        role: ['admin']
      });
    }

    // Payments and earnings
    if (user.role === 'vendor') {
      navItems.push({
        name: 'Order Earnings',
        href: '/order-earnings',
        icon: <CreditCard className="w-5 h-5" />,
        role: ['vendor']
      });
    }

    if (user.role === 'delivery') {
      navItems.push({
        name: 'Delivery Earnings',
        href: '/delivery-earnings',
        icon: <CreditCard className="w-5 h-5" />,
        role: ['delivery']
      });
    }

    if (user.role === 'admin') {
      navItems.push({
        name: 'Order Payments',
        href: '/order-payments',
        icon: <CreditCard className="w-5 h-5" />,
        role: ['admin']
      });
    }

    // Referrals for all users
    navItems.push({
      name: 'Referrals',
      href: '/refferals',
      icon: <Users className="w-5 h-5" />,
      role: ['customer', 'vendor', 'admin', 'delivery']
    });

    navItems.push({
      name: 'Referral Earnings',
      href: '/refferal-earnings',
      icon: <Gift className="w-5 h-5" />,
      role: ['customer', 'vendor', 'admin', 'delivery']
    });

    // Subscriptions for vendors and admins
    if (user.role === 'vendor' || user.role === 'admin') {
      navItems.push({
        name: 'Subscriptions',
        href: '/subscription',
        icon: <Clock className="w-5 h-5" />,
        role: ['vendor', 'admin']
      });
    }

    // Rider withdrawals for admins
    if (user.role === 'admin') {
      navItems.push({
        name: 'Rider Withdrawals',
        href: '/rider-withdrawals',
        icon: <FileText className="w-5 h-5" />,
        role: ['admin']
      });
    }

    return navItems;
  };

  // Mega menu categories with role-based integration
  const getMenuCategories = (): MenuCategory[] => {
    const roleBasedItems = getRoleBasedNavItems();
    
    const categories: MenuCategory[] = [
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
      }
    ];

    // Add Account & Dashboard section if user is logged in
    if (user) {
      const accountSection: MenuCategory = {
        title: 'Account & Dashboard',
        icon: <User className="w-5 h-5" />,
        items: [
          { name: 'My Profile', href: '/profile', icon: <Settings className="w-4 h-4" /> },
          { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4" />, badge: wishlistItems.length },
          { name: 'Shopping Cart', href: '/cart', icon: <ShoppingBag className="w-4 h-4" />, badge: cartItemsCount },
          ...roleBasedItems.map(item => ({
            name: item.name,
            href: item.href,
            icon: item.icon
          }))
        ]
      };
      categories.push(accountSection);
    }

    // Add Vendor Zone section for non-vendors or everyone
    if (!user || user.role === 'customer') {
      categories.push({
        title: 'Vendor Zone',
        icon: <Store className="w-5 h-5" />,
        items: [
          { name: 'Become a Vendor', href: '#', onClick: 'becomeVendor' },
          { name: 'Sell on Shaddyna', href: '/sell' },
          { name: 'Vendor Benefits', href: '/vendor-benefits' },
          { name: 'Vendor Support', href: '/vendor-support' },
        ]
      });
    } else if (user.role === 'vendor') {
      categories.push({
        title: 'Vendor Tools',
        icon: <Building className="w-5 h-5" />,
        items: [
          { name: 'Add Product', href: '/vendor/products/add' },
          { name: 'Manage Inventory', href: '/vendor/inventory' },
          { name: 'Analytics', href: '/vendor/analytics' },
          { name: 'Earnings', href: '/vendor/earnings' },
        ]
      });
    }

    // Add Help & Support section
    categories.push({
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns Policy', href: '/returns' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/track-order' },
      ]
    });

    return categories;
  };

  useEffect(() => {
    setMounted(true);
    
    // Handle click outside to close menu
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close menus
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    // Check if it's a MenuItemWithOnClick
    if ('onClick' in item && item.onClick === 'becomeVendor') {
      handleBecomeVendor();
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  if (!mounted) return null;

  const menuCategories = getMenuCategories();

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
          
          {/* Hamburger Menu Button *
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

            {/* Mega Menu Dropdown *
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {menuCategories.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <div className="flex items-center space-x-2 text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
                        {category.icon}
                        <h3 className="font-semibold">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            {item.href && item.href !== '#' ? (
                              <Link
                                href={item.href}
                                className="flex items-center justify-between group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex items-center space-x-2">
                                  {'icon' in item && item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                  {'badge' in item && item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-2 bg-[var(--color-primary)] text-white text-xs rounded-full px-2 py-0.5">
                                      {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleMenuItemClick(item)}
                                className="flex items-center justify-between w-full group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  {'icon' in item && item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Bottom CTA *
                <div className="bg-[var(--color-primary-soft)]/20 p-4 border-t border-[var(--color-border)]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">Need help? Call us: +254 700 000 000</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">support@shaddyna.com</span>
                    </div>
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar *
          <form onSubmit={handleSearch} className="flex-1 relative group">
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
                <button
                  type="submit"
                  className="absolute right-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Social Media Icons (Desktop only) *
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5C19.097 2 22 4.903 22 7.75v8.5C22 19.097 19.097 22 16.25 22h-8.5C4.903 22 2 19.097 2 16.25v-8.5C2 4.903 4.903 2 7.75 2zm0 1.5C5.679 3.5 4 5.179 4 7.25v8.5C4 18.321 5.679 20 7.75 20h8.5C18.321 20 20 18.321 20 16.25v-8.5C20 5.679 18.321 3.5 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
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

export default BottomNavbar;*/

// components/New/components/BottomNavbar.tsx (updated section)

/*import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
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
  MapPin,
  ShoppingBag,
  Heart,
  User,
  LayoutDashboard,
  CreditCard,
  Gift,
  Clock,
  Truck,
  FileText,
  ShoppingCart,
  LogOut,
  Settings,
  Building,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

interface BottomNavbarProps {
  isScrolled: boolean;
}

// Define types for dynamic categories
interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  icon?: string;
  children?: Category[];
  productCount?: number;
}

const BottomNavbar = ({ isScrolled }: BottomNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Auth and data contexts
  const { user, logout } = useAuth();
  const { totalItems: cartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1&featured=true&popular=true');
        if (response.data.categories) {
          // Fetch children for each category
          const categoriesWithChildren = await Promise.all(
            response.data.categories.map(async (category: Category) => {
              const childrenRes = await axios.get(`/api/category?parentId=${category._id}&limit=8`);
              return {
                ...category,
                children: childrenRes.data.categories || []
              };
            })
          );
          setCategories(categoriesWithChildren);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Function to handle become vendor modal
  const handleBecomeVendor = () => {
    console.log('Open become vendor modal');
    setIsMenuOpen(false);
  };

  // Generate role-based navigation items
  const getRoleBasedNavItems = () => {
    if (!user) return [];

    const navItems: any[] = [];

    if (user.role !== 'customer') {
      navItems.push({
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />
      });
    }

    if (user.role === 'vendor' || user.role === 'admin') {
      navItems.push({
        name: 'Products',
        href: '/products',
        icon: <Package className="w-5 h-5" />
      });
    }

    navItems.push({
      name: 'Shops',
      href: '/shops',
      icon: <Store className="w-5 h-5" />
    });

    navItems.push({
      name: 'Orders',
      href: '/orders',
      icon: <ShoppingCart className="w-5 h-5" />
    });

    if (user.role === 'delivery') {
      navItems.push({
        name: 'Delivery',
        href: '/delivery',
        icon: <Truck className="w-5 h-5" />
      });
    }

    if (user.role === 'admin') {
      navItems.push({
        name: 'Seller Requests',
        href: '/seller-requests',
        icon: <Users className="w-5 h-5" />
      });
      navItems.push({
        name: 'Users',
        href: '/users',
        icon: <Users className="w-5 h-5" />
      });
    }

    if (user.role === 'vendor') {
      navItems.push({
        name: 'Order Earnings',
        href: '/order-earnings',
        icon: <CreditCard className="w-5 h-5" />
      });
    }

    if (user.role === 'delivery') {
      navItems.push({
        name: 'Delivery Earnings',
        href: '/delivery-earnings',
        icon: <CreditCard className="w-5 h-5" />
      });
    }

    if (user.role === 'admin') {
      navItems.push({
        name: 'Order Payments',
        href: '/order-payments',
        icon: <CreditCard className="w-5 h-5" />
      });
    }

    navItems.push({
      name: 'Referrals',
      href: '/refferals',
      icon: <Users className="w-5 h-5" />
    });

    navItems.push({
      name: 'Referral Earnings',
      href: '/refferal-earnings',
      icon: <Gift className="w-5 h-5" />
    });

    if (user.role === 'vendor' || user.role === 'admin') {
      navItems.push({
        name: 'Subscriptions',
        href: '/subscription',
        icon: <Clock className="w-5 h-5" />
      });
    }

    if (user.role === 'admin') {
      navItems.push({
        name: 'Rider Withdrawals',
        href: '/rider-withdrawals',
        icon: <FileText className="w-5 h-5" />
      });
    }

    if (user.role === 'admin') {
      navItems.push({
        name: 'Categories',
        href: '/admin/categories',
        icon: <FileText className="w-5 h-5" />
      });
    }

    return navItems;
  };

  // Mega menu categories with dynamic categories
  const getMenuCategories = () => {
    const roleBasedItems = getRoleBasedNavItems();
    
      //const categories: any[] = [
      const menuSections: any[] = [
      {
        title: 'Shop by Category',
        icon: <Grid className="w-5 h-5" />,
        items: loadingCategories
          ? [{ name: 'Loading...', href: '#' }]
          : categories.map(cat => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
              subcategories: cat.children?.slice(0, 4).map((child: { name: any; slug: any; }) => ({
                name: child.name,
                href: `/category/${child.slug}`
              }))
            }))
      },
      {
        title: 'Quick Links',
        icon: <Tag className="w-5 h-5" />,
        items: [
          { name: "Today's Deals", href: '/deals' },
          { name: 'Best Sellers', href: '/best-sellers' },
          { name: 'New Arrivals', href: '/new-arrivals' },
          { name: 'Clearance', href: '/clearance' },
          { name: 'Gift Cards', href: '/gift-cards' },
        ]
      }
    ];

    // Add Account & Dashboard section if user is logged in
    if (user) {
      const accountSection = {
        title: 'Account & Dashboard',
        icon: <User className="w-5 h-5" />,
        items: [
          { name: 'My Profile', href: '/profile', icon: <Settings className="w-4 h-4" /> },
          { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4" />, badge: wishlistItems.length },
          { name: 'Shopping Cart', href: '/cart', icon: <ShoppingBag className="w-4 h-4" />, badge: cartItemsCount },
          ...roleBasedItems.map(item => ({
            name: item.name,
            href: item.href,
            icon: item.icon
          }))
        ]
      };
      menuSections.push(accountSection);
    }

    // Add Vendor Zone section
    if (!user || user.role === 'customer') {
      menuSections.push({
        title: 'Vendor Zone',
        icon: <Store className="w-5 h-5" />,
        items: [
          { name: 'Become a Vendor', href: '#', onClick: 'becomeVendor' },
          { name: 'Sell on Shaddyna', href: '/sell' },
          { name: 'Vendor Benefits', href: '/vendor-benefits' },
          { name: 'Vendor Support', href: '/vendor-support' },
        ]
      });
    } else if (user.role === 'vendor') {
      menuSections.push({
        title: 'Vendor Tools',
        icon: <Building className="w-5 h-5" />,
        items: [
          { name: 'Add Product', href: '/vendor/products/add' },
          { name: 'Manage Inventory', href: '/vendor/inventory' },
          { name: 'Analytics', href: '/vendor/analytics' },
          { name: 'Earnings', href: '/vendor/earnings' },
        ]
      });
    }

    // Add Help & Support section
    menuSections.push({
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns Policy', href: '/returns' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/track-order' },
      ]
    });

    return menuSections;
  };

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.onClick === 'becomeVendor') {
      handleBecomeVendor();
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  if (!mounted) return null;

  const menuCategories = getMenuCategories();

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
          {/* Hamburger Menu Button *
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

            {/* Mega Menu Dropdown *
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {menuCategories.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <div className="flex items-center space-x-2 text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
                        {category.icon}
                        <h3 className="font-semibold">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item: any) => (
                          <li key={item.name}>
                            {item.href && item.href !== '#' ? (
                              <Link
                                href={item.href}
                                className="flex items-center justify-between group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex items-center space-x-2">
                                  {item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                  {item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-2 bg-[var(--color-primary)] text-white text-xs rounded-full px-2 py-0.5">
                                      {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleMenuItemClick(item)}
                                className="flex items-center justify-between w-full group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  {item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Bottom CTA *
                <div className="bg-[var(--color-primary-soft)]/20 p-4 border-t border-[var(--color-border)]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">Need help? Call us: +254 700 000 000</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">support@shaddyna.com</span>
                    </div>
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar *
          <form onSubmit={handleSearch} className="flex-1 relative group">
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
                <button
                  type="submit"
                  className="absolute right-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Social Media Icons *
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5C19.097 2 22 4.903 22 7.75v8.5C22 19.097 19.097 22 16.25 22h-8.5C4.903 22 2 19.097 2 16.25v-8.5C2 4.903 4.903 2 7.75 2zm0 1.5C5.679 3.5 4 5.179 4 7.25v8.5C4 18.321 5.679 20 7.75 20h8.5C18.321 20 20 18.321 20 16.25v-8.5C20 5.679 18.321 3.5 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
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

export default BottomNavbar;*/

/*import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
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
  MapPin,
  ShoppingBag,
  Heart,
  User,
  LayoutDashboard,
  CreditCard,
  Gift,
  Clock,
  Truck,
  FileText,
  ShoppingCart,
  LogOut,
  Settings,
  Building,
  BarChart3,
  LockKeyhole
} from 'lucide-react';
import axios from 'axios';

interface BottomNavbarProps {
  isScrolled: boolean;
}

// Define types for dynamic categories
interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  icon?: string;
  children?: Category[];
  productCount?: number;
}

const BottomNavbar = ({ isScrolled }: BottomNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Auth and data contexts
  const { user, logout } = useAuth();
  const { totalItems: cartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1&featured=true&popular=true');
        if (response.data.categories) {
          // Fetch children for each category
          const categoriesWithChildren = await Promise.all(
            response.data.categories.map(async (category: Category) => {
              const childrenRes = await axios.get(`/api/category?parentId=${category._id}&limit=8`);
              return {
                ...category,
                children: childrenRes.data.categories || []
              };
            })
          );
          setCategories(categoriesWithChildren);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Function to handle become vendor modal
  const handleBecomeVendor = () => {
    console.log('Open become vendor modal');
    setIsMenuOpen(false);
  };

  // Generate role-based navigation items
const getRoleBasedNavItems = () => {
  if (!user) return [];

  const navItems: any[] = [];

  if (user.role !== 'customer') {
    navItems.push({
      name: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard className="w-5 h-5" />
    });
  }

  if (user.role === 'vendor' || user.role === 'admin') {
    navItems.push({
      name: 'Products',
      href: '/products',
      icon: <Package className="w-5 h-5" />
    });
  }

  navItems.push({
    name: 'Shops',
    href: '/shops',
    icon: <Store className="w-5 h-5" />
  });

  navItems.push({
    name: 'Orders',
    href: '/orders',
    icon: <ShoppingCart className="w-5 h-5" />
  });

  if (user.role === 'delivery') {
    navItems.push({
      name: 'Delivery',
      href: '/delivery',
      icon: <Truck className="w-5 h-5" />
    });
  }

  // Remove these admin items from here since they'll be in Admin Portal
  // if (user.role === 'admin') {
  //   navItems.push({
  //     name: 'Seller Requests',
  //     href: '/seller-requests',
  //     icon: <Users className="w-5 h-5" />
  //   });
  //   navItems.push({
  //     name: 'Users',
  //     href: '/users',
  //     icon: <Users className="w-5 h-5" />
  //   });
  // }

  if (user.role === 'vendor') {
    navItems.push({
      name: 'Order Earnings',
      href: '/order-earnings',
      icon: <CreditCard className="w-5 h-5" />
    });
  }

  if (user.role === 'delivery') {
    navItems.push({
      name: 'Delivery Earnings',
      href: '/delivery-earnings',
      icon: <CreditCard className="w-5 h-5" />
    });
  }

  // Remove this admin item from here since it'll be in Admin Portal
  // if (user.role === 'admin') {
  //   navItems.push({
  //     name: 'Order Payments',
  //     href: '/order-payments',
  //     icon: <CreditCard className="w-5 h-5" />
  //   });
  // }

  navItems.push({
    name: 'Referrals',
    href: '/refferals',
    icon: <Users className="w-5 h-5" />
  });

  navItems.push({
    name: 'Referral Earnings',
    href: '/refferal-earnings',
    icon: <Gift className="w-5 h-5" />
  });

  if (user.role === 'vendor' || user.role === 'admin') {
    navItems.push({
      name: 'Subscriptions',
      href: '/subscription',
      icon: <Clock className="w-5 h-5" />
    });
  }

  // Remove these admin items from here since they'll be in Admin Portal
  // if (user.role === 'admin') {
  //   navItems.push({
  //     name: 'Rider Withdrawals',
  //     href: '/rider-withdrawals',
  //     icon: <FileText className="w-5 h-5" />
  //   });
  // }

  // if (user.role === 'admin') {
  //   navItems.push({
  //     name: 'Categories',
  //     href: '/admin/categories',
  //     icon: <FileText className="w-5 h-5" />
  //   });
  // }

  return navItems;
};

// Mega menu categories with dynamic categories
const getMenuCategories = () => {
  const roleBasedItems = getRoleBasedNavItems();
  
  // Filter out admin items from roleBasedItems for the Account & Dashboard section
  const nonAdminRoleItems = roleBasedItems.filter(item => {
    // Remove admin-specific items that shouldn't appear in Account & Dashboard
    const adminItems = [
      'Seller Requests',
      'Users', 
      'Order Payments',
      'Rider Withdrawals',
      'Categories'
    ];
    return !adminItems.includes(item.name);
  });
  
  const menuSections: any[] = [
    {
      title: 'Shop by Category',
      icon: <Grid className="w-5 h-5" />,
      items: loadingCategories
        ? [{ name: 'Loading...', href: '#' }]
        : categories.map(cat => ({
            name: cat.name,
            href: `/category/${cat.slug}`,
            subcategories: cat.children?.slice(0, 4).map((child: { name: any; slug: any; }) => ({
              name: child.name,
              href: `/category/${child.slug}`
            }))
          }))
    },
    {
      title: 'Quick Links',
      icon: <Tag className="w-5 h-5" />,
      items: [
        { name: "Today's Deals", href: '/deals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Clearance', href: '/clearance' },
        { name: 'Gift Cards', href: '/gift-cards' },
      ]
    }
  ];

  // Add Account & Dashboard section if user is logged in
  if (user) {
    const accountSection = {
      title: 'Account & Dashboard',
      icon: <User className="w-5 h-5" />,
      items: [
        { name: 'My Profile', href: '/profile', icon: <Settings className="w-4 h-4" /> },
        { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4" />, badge: wishlistItems.length },
        { name: 'Shopping Cart', href: '/cart', icon: <ShoppingBag className="w-4 h-4" />, badge: cartItemsCount },
        ...nonAdminRoleItems.map(item => ({
          name: item.name,
          href: item.href,
          icon: item.icon
        }))
      ]
    };
    menuSections.push(accountSection);
  }

  // Add Vendor Zone section
  if (!user || user.role === 'customer') {
    menuSections.push({
      title: 'Vendor Zone',
      icon: <Store className="w-5 h-5" />,
      items: [
        { name: 'Become a Vendor', href: '#', onClick: 'becomeVendor' },
        { name: 'Sell on Shaddyna', href: '/sell' },
        { name: 'Vendor Benefits', href: '/vendor-benefits' },
        { name: 'Vendor Support', href: '/vendor-support' },
      ]
    });
  } else if (user.role === 'vendor') {
    menuSections.push({
      title: 'Vendor Tools',
      icon: <Building className="w-5 h-5" />,
      items: [
        { name: 'Add Product', href: '/vendor/products/add' },
        { name: 'Manage Inventory', href: '/vendor/inventory' },
        { name: 'Analytics', href: '/vendor/analytics' },
        { name: 'Earnings', href: '/vendor/earnings' },
      ]
    });
  }

  // Add Help & Support section
  menuSections.push({
    title: 'Help & Support',
    icon: <HelpCircle className="w-5 h-5" />,
    items: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns Policy', href: '/returns' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Track Order', href: '/track-order' },
    ]
  });

  // Admin only section - ONLY show if user is admin
  if (user && user.role === 'admin') {
    menuSections.push({
      title: 'Admin Portal',
      icon: <LockKeyhole className="w-5 h-5" />,
      items: [
        { name: 'All Users Management', href: '/admin/users' },
        { name: 'All Shops Management', href: '/admin/shops' },
        { name: 'All Riders Management', href: '/admin/riders' },
        { name: 'All Customers Management', href: '/admin/customers' },
        { name: 'All Admins Management', href: '/admin/admins' },
        { name: 'New Sellers Requests', href: '/admin/seller-requests' },
        { name: 'New Riders Requests', href: '/admin/rider-requests' },
        { name: 'Sellers Withdrawal Management', href: '/admin/seller-withdrawals' },
        { name: 'Riders Withdrawal Management', href: '/admin/rider-withdrawals' },
        { name: 'User Referrals Management', href: '/admin/referrals' },
        { name: 'Referrals Withdrawal Management', href: '/admin/referral-withdrawals' },
        { name: 'Subscription Management', href: '/admin/subscriptions' },
        { name: 'Subscription Approval', href: '/admin/subscription-approvals' },
        { name: 'Subs Earnings Withdrawal Mgnt', href: '/admin/subscription-earnings' },
      ]
    });
  }

  return menuSections;
};

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.onClick === 'becomeVendor') {
      handleBecomeVendor();
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  if (!mounted) return null;

  const menuCategories = getMenuCategories();

  return (
    <div className={`
      relative z-[40]
      transition-all duration-300 border-t border-[var(--color-border)]
      ${isScrolled 
        ? 'bg-[var(--color-surface)]/95 backdrop-blur-md py-2' 
        : 'bg-[var(--color-background)] py-3'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button *
          <div className="relative z-[60]" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                relative z-[61]
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

            {/* Mega Menu Dropdown *
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {menuCategories.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <div className="flex items-center space-x-2 text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
                        {category.icon}
                        <h3 className="font-semibold">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item: any) => (
                          <li key={item.name}>
                            {item.href && item.href !== '#' ? (
                              <Link
                                href={item.href}
                                className="flex items-center justify-between group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex items-center space-x-2">
                                  {item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                  {item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-2 bg-[var(--color-primary)] text-white text-xs rounded-full px-2 py-0.5">
                                      {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleMenuItemClick(item)}
                                className="flex items-center justify-between w-full group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  {item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Bottom CTA *
                <div className="bg-[var(--color-primary-soft)]/20 p-4 border-t border-[var(--color-border)]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">Need help? Call us: +254 700 000 000</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">support@shaddyna.com</span>
                    </div>
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar *
          <form onSubmit={handleSearch} className="flex-1 relative group z-[30]">
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
                <button
                  type="submit"
                  className="absolute right-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Social Media Icons *
          <div className="hidden lg:flex items-center space-x-3 relative z-[30]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5C19.097 2 22 4.903 22 7.75v8.5C22 19.097 19.097 22 16.25 22h-8.5C4.903 22 2 19.097 2 16.25v-8.5C2 4.903 4.903 2 7.75 2zm0 1.5C5.679 3.5 4 5.179 4 7.25v8.5C4 18.321 5.679 20 7.75 20h8.5C18.321 20 20 18.321 20 16.25v-8.5C20 5.679 18.321 3.5 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
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

export default BottomNavbar;*/

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
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
  MapPin,
  ShoppingBag,
  Heart,
  User,
  LayoutDashboard,
  CreditCard,
  Gift,
  Clock,
  Truck,
  FileText,
  ShoppingCart,
  LogOut,
  Settings,
  Building,
  BarChart3,
  LockKeyhole,
  Bike
} from 'lucide-react';
import axios from 'axios';

interface BottomNavbarProps {
  isScrolled: boolean;
}

// Define types for dynamic categories
interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  icon?: string;
  children?: Category[];
  productCount?: number;
}

const BottomNavbar = ({ isScrolled }: BottomNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Auth and data contexts
  const { user, logout } = useAuth();
  const { totalItems: cartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1&featured=true&popular=true');
        if (response.data.categories) {
          // Fetch children for each category
          const categoriesWithChildren = await Promise.all(
            response.data.categories.map(async (category: Category) => {
              const childrenRes = await axios.get(`/api/category?parentId=${category._id}&limit=8`);
              return {
                ...category,
                children: childrenRes.data.categories || []
              };
            })
          );
          setCategories(categoriesWithChildren);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleBecomeVendor = () => {
    router.push('/become-vendor');
    setIsMenuOpen(false);
  };

  const handleBecomeRider = () => {
    router.push('/become-rider');
    setIsMenuOpen(false);
  };

  // Generate role-based navigation items for Account & Dashboard
  const getRoleBasedNavItems = () => {
    if (!user) return [];

    const navItems: any[] = [];

    // Common items for all roles
    navItems.push({
      name: 'Shops',
      href: '/shops',
      icon: <Store className="w-5 h-5" />
    });

    navItems.push({
      name: 'Orders',
      href: '/orders',
      icon: <ShoppingCart className="w-5 h-5" />
    });

    // Customer-specific items
    if (user.role === 'customer') {
      navItems.push({
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />
      });
    }

    // Vendor-specific items
    if (user.role === 'vendor') {
      navItems.push({
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />
      });
      navItems.push({
        name: 'Products',
        href: '/products',
        icon: <Package className="w-5 h-5" />
      });
      navItems.push({
        name: 'Order Earnings',
        href: '/order-earnings',
        icon: <CreditCard className="w-5 h-5" />
      });
      navItems.push({
        name: 'Subscriptions',
        href: '/subscription',
        icon: <Clock className="w-5 h-5" />
      });
    }

    // Delivery-specific items
    if (user.role === 'delivery') {
      navItems.push({
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />
      });
      /*navItems.push({
        name: 'Delivery',
        href: '/delivery',
        icon: <Truck className="w-5 h-5" />
      });*/
      /*navItems.push({
        name: 'Delivery Earnings',
        href: '/delivery-earnings',
        icon: <CreditCard className="w-5 h-5" />
      });*/
    }

    // Admin-specific items (only non-admin portal items)
    if (user.role === 'admin') {
      navItems.push({
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />
      });
      navItems.push({
        name: 'Products',
        href: '/products',
        icon: <Package className="w-5 h-5" />
      });
      navItems.push({
        name: 'Subscriptions',
        href: '/subscription',
        icon: <Clock className="w-5 h-5" />
      });
    }

    // Referral items for all roles
    navItems.push({
      name: 'Referrals',
      href: '/refferals',
      icon: <Users className="w-5 h-5" />
    });

    navItems.push({
      name: 'Referral Earnings',
      href: '/refferal-earnings',
      icon: <Gift className="w-5 h-5" />
    });

    return navItems;
  };

  // Vendor-specific tools section
  const getVendorToolsSection = () => {
    if (!user || user.role !== 'vendor') return null;
    
    return {
      title: 'Vendor Tools',
      icon: <Building className="w-5 h-5" />,
      items: [
        { name: 'Add Product', href: '/vendor/products/add' },
        { name: 'Manage Inventory', href: '/vendor/inventory' },
        { name: 'Analytics', href: '/vendor/analytics' },
        { name: 'Vendor Earnings', href: '/vendor/earnings' },
      ]
    };
  };

  // Delivery-specific tools section
  const getDeliveryToolsSection = () => {
    if (!user || user.role !== 'delivery') return null;
    
    return {
      title: 'Delivery Tools',
      icon: <Truck className="w-5 h-5" />,
      items: [
        { name: 'My Deliveries', href: '/delivery/assignments' },
        { name: 'Delivery History', href: '/delivery/history' },
        { name: 'Delivery Earnings', href: '/delivery-earnings' },
        { name: 'Delivery Support', href: '/delivery/support' },
      ]
    };
  };

  // Zone for becoming a vendor or rider (for customers and non-vendors/non-riders)
  const getOpportunityZoneSection = () => {
    // Only show for customers or if user is not already vendor/delivery
    if (!user) return null;
    
    // If user is already vendor or delivery, don't show this section
    if (user.role === 'vendor' || user.role === 'delivery') return null;
    
    return {
      title: 'Opportunity Zone',
      icon: <Award className="w-5 h-5" />,
      items: [
        { 
          name: 'Become a Vendor', 
          href: '#', 
          onClick: 'becomeVendor',
          //icon: <Store className="w-4 h-4" />,
          //description: 'Start selling your products'
        },
        { 
          name: 'Become a Rider', 
          href: '#', 
          onClick: 'becomeRider',
          //icon: <Bike className="w-4 h-4" />,
          //description: 'Join our delivery team'
        },
        { name: 'Vendor Benefits', href: '/vendor-benefits' },
        { name: 'Rider Benefits', href: '/rider-benefits' },
        { name: 'Success Stories', href: '/success-stories' },
      ]
    };
  };

  // Admin portal section
  const getAdminPortalSection = () => {
    if (!user || user.role !== 'admin') return null;
    
    return {
      title: 'Admin Portal',
      icon: <LockKeyhole className="w-5 h-5" />,
      items: [
        { name: 'All Users Management', href: '/admin/users' },
        { name: 'All Shops Management', href: '/admin/shops' },
        { name: 'All Riders Management', href: '/admin/riders' },
        { name: 'All Customers Management', href: '/admin/customers' },
        { name: 'All Vendors Management', href: '/admin/vendors' },
        { name: 'All Admins Management', href: '/admin/admins' },
        { name: 'Orders Management', href: '/admin/orders' },
        { name: 'Products Management', href: '/admin/products' },
        { name: 'New Sellers Requests', href: '/admin/seller-requests' },
        { name: 'New Riders Requests', href: '/admin/rider-requests' },
        { name: 'Sellers Withdrawal Management', href: '/admin/seller-withdrawals' },
        { name: 'Riders Withdrawal Management', href: '/admin/rider-withdrawals' },
        { name: 'User Referrals Management', href: '/admin/referrals' },
        { name: 'Referrals Withdrawal Management', href: '/admin/referral-withdrawals' },
        { name: 'Subscription Management', href: '/admin/subscriptions' },
        { name: 'Subscription Approval', href: '/admin/subscription-approvals' },
        { name: 'Subs Earnings Withdrawal Mgnt', href: '/admin/subscription-earnings' },
      ]
    };
  };

  // Vendor zone for non-vendors (legacy - keeping for backward compatibility but will be replaced by Opportunity Zone)
  const getVendorZoneSection = () => {
    // This is now handled by getOpportunityZoneSection
    return null;
  };

  // Mega menu categories with dynamic categories
  const getMenuCategories = () => {
    const roleBasedItems = getRoleBasedNavItems();
    
    const menuSections: any[] = [
      {
        title: 'Shop by Category',
        icon: <Grid className="w-5 h-5" />,
        items: loadingCategories
          ? [{ name: 'Loading...', href: '#' }]
          : categories.map(cat => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
              subcategories: cat.children?.slice(0, 4).map((child: { name: any; slug: any; }) => ({
                name: child.name,
                href: `/category/${child.slug}`
              }))
            }))
      },
      {
        title: 'Quick Links',
        icon: <Tag className="w-5 h-5" />,
        items: [
          { name: "Today's Deals", href: '/deals' },
          { name: 'Best Sellers', href: '/best-sellers' },
          { name: 'New Arrivals', href: '/new-arrivals' },
          { name: 'Clearance', href: '/clearance' },
          { name: 'Gift Cards', href: '/gift-cards' },
        ]
      }
    ];

    // Add Account & Dashboard section if user is logged in
    if (user) {
      const accountSection = {
        title: 'Account & Dashboard',
        icon: <User className="w-5 h-5" />,
        items: [
          { name: 'My Profile', href: '/profile', icon: <Settings className="w-4 h-4" /> },
          { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4" />, badge: wishlistItems.length },
          { name: 'Shopping Cart', href: '/cart', icon: <ShoppingBag className="w-4 h-4" />, badge: cartItemsCount },
          ...roleBasedItems.map(item => ({
            name: item.name,
            href: item.href,
            icon: item.icon
          }))
        ]
      };
      menuSections.push(accountSection);
    }

    // Add role-specific tools sections
    const vendorToolsSection = getVendorToolsSection();
    if (vendorToolsSection) {
      menuSections.push(vendorToolsSection);
    }

    const deliveryToolsSection = getDeliveryToolsSection();
    if (deliveryToolsSection) {
      menuSections.push(deliveryToolsSection);
    }

    // Add Opportunity Zone section (for customers to become vendor/rider)
    const opportunityZoneSection = getOpportunityZoneSection();
    if (opportunityZoneSection) {
      menuSections.push(opportunityZoneSection);
    }

    // Add Admin Portal section
    const adminPortalSection = getAdminPortalSection();
    if (adminPortalSection) {
      menuSections.push(adminPortalSection);
    }

    // Add Help & Support section
    menuSections.push({
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns Policy', href: '/returns' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/track-order' },
      ]
    });

    return menuSections;
  };

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.onClick === 'becomeVendor') {
      handleBecomeVendor();
    } else if (item.onClick === 'becomeRider') {
      handleBecomeRider();
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  if (!mounted) return null;

  const menuCategories = getMenuCategories();

  return (
    <div className={`
      relative z-[40]
      transition-all duration-300 border-t border-[var(--color-border)]
      ${isScrolled 
        ? 'bg-[var(--color-surface)]/95 backdrop-blur-md py-2' 
        : 'bg-[var(--color-background)] py-3'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button */}
          <div className="relative z-[60]" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                relative z-[61]
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
              <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {menuCategories.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <div className="flex items-center space-x-2 text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
                        {category.icon}
                        <h3 className="font-semibold">{category.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item: any) => (
                          <li key={item.name}>
                            {item.href && item.href !== '#' ? (
                              <Link
                                href={item.href}
                                className="flex items-center justify-between group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex items-center space-x-2">
                                  {item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                  {item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-2 bg-[var(--color-primary)] text-white text-xs rounded-full px-2 py-0.5">
                                      {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleMenuItemClick(item)}
                                className="flex items-center justify-between w-full group text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  {item.icon && (
                                    <span className="text-sm">{item.icon}</span>
                                  )}
                                  <span>{item.name}</span>
                                  {item.description && (
                                    <span className="text-xs text-[var(--color-text-muted)] ml-2">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Bottom CTA */}
                <div className="bg-[var(--color-primary-soft)]/20 p-4 border-t border-[var(--color-border)]">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">Need help? Call us: +254 700 000 000</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-sm">support@shaddyna.com</span>
                    </div>
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative group z-[30]">
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
                <button
                  type="submit"
                  className="absolute right-3 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Social Media Icons */}
          <div className="hidden lg:flex items-center space-x-3 relative z-[30]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5C19.097 2 22 4.903 22 7.75v8.5C22 19.097 19.097 22 16.25 22h-8.5C4.903 22 2 19.097 2 16.25v-8.5C2 4.903 4.903 2 7.75 2zm0 1.5C5.679 3.5 4 5.179 4 7.25v8.5C4 18.321 5.679 20 7.75 20h8.5C18.321 20 20 18.321 20 16.25v-8.5C20 5.679 18.321 3.5 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 rounded-full transition-all duration-300 hover:bg-[var(--color-primary-soft)] hover:shadow-md hover:-translate-y-0.5 hover:scale-110"
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