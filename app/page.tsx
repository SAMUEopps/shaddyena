"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CustomerDashboard from '@/components/dashboards/CustomerDashboard';
import VendorDashboard from '@/components/dashboards/VendorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import Login from './login/page';
import HomeTab from '@/components/tabs/HomeTab';
import ProductsTab from '@/components/tabs/ProductsTab';
import OrdersTab from '@/components/tabs/OrdersTab';
import PaymentsTab from '@/components/tabs/PaymentsTab';
import SupportTab from '@/components/tabs/SupportTab';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

/* ---------- helpers ---------- */
const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Products', icon: '🛒' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'support', label: 'Support', icon: '🛟' },
];

// Role switcher for testing (would be removed in production)
type RoleSwitcherProps = {
  currentRole: 'customer' | 'vendor' | 'admin';
  switchRole: (role: 'customer' | 'vendor' | 'admin') => void;
};

const RoleSwitcher = ({ currentRole, switchRole }: RoleSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mr-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Role: {currentRole}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => { switchRole('customer'); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Customer
          </button>
          <button
            onClick={() => { switchRole('vendor'); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Vendor
          </button>
          <button
            onClick={() => { switchRole('admin'); setIsOpen(false); }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Admin
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- page ---------- */
export default function Home() {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  // For demo purposes - allow role switching
  const [demoRole, setDemoRole] = useState<'customer' | 'vendor' | 'admin'>(user?.role as 'customer' | 'vendor' | 'admin' || 'customer');
  const { totalItems: cartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  // Combine actual user with demo role for testing
  const currentUser = user ? { ...user, role: demoRole } : null;

  /* ---------- render ---------- */
  const renderDashboard = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'customer': return <CustomerDashboard />;
      case 'vendor': return <VendorDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <CustomerDashboard />;
    }
  };

  const renderTabContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'dashboard': return renderDashboard();
      case 'products': return <ProductsTab role={currentUser.role} />;
      case 'orders': return <OrdersTab role={currentUser.role} />;
      case 'payments': return <PaymentsTab role={currentUser.role} />;
      case 'support': return <SupportTab role={currentUser.role} />;
      default: return <HomeTab />;
    }
  };

  /* ---------- loading / auth wall ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
      </div>
    );
  }

  if (!user) return <Login />;

  /* ---------- markup ---------- */
  return (
    <>
      <Head>
        <title>Shaddyna | Multi-Vendor Marketplace</title>
        <meta name="description" content="Modern multi-vendor e-commerce platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex">
        {/* ---------------- DESKTOP SIDEBAR ---------------- */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-[#182155] pt-5 pb-4 overflow-y-auto">
            {/* logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-8 h-8 bg-[#bf2c7e] rounded-full grid place-items-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h1 className="ml-2 text-white text-xl font-bold">Shaddyna</h1>
            </div>

            {/* nav */}
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-white text-[#182155]'
                      : 'text-gray-200 hover:bg-[#bf2c7e] hover:text-white'
                  }`}
                >
                  {/*<span className="mr-3">{item.icon}</span>*/}
                  <span className="text-sm font-medium break-words">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* support card + logout */}
            <div className="px-4 mt-auto space-y-4">
              <div className="bg-[#0f183f] text-white p-4 rounded-lg">
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs mt-1">Contact our support team 24/7</p>
                <button
                  onClick={() => setActiveTab('support')}
                  className="mt-3 w-full bg-[#bf2c7e] text-white py-2 rounded-md text-sm font-semibold"
                >
                  Get Help
                </button>
              </div>
              <button
                onClick={logout}
                className="w-full text-gray-200 hover:text-white text-sm font-medium text-left break-words"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ---------------- MOBILE SIDEBAR ---------------- */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-gray-600/75"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* drawer */}
            <aside className="relative max-w-full w-64 h-full bg-[#182155] flex flex-col">
              {/* header */}
              <div className="flex items-center px-4 pt-5">
                <div className="w-8 h-8 bg-[#bf2c7e] rounded-full grid place-items-center shrink-0">
                  <span className="text-white font-bold">S</span>
                </div>
                <h1 className="ml-2 text-white text-xl font-bold break-words">Shaddyna</h1>
                <button
                  type="button"
                  className="ml-auto rounded-md p-2 text-gray-200 hover:text-white shrink-0"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* nav */}
              <nav className="mt-8 px-4 space-y-2 min-w-0">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-white text-[#182155]'
                        : 'text-gray-200 hover:bg-[#bf2c7e] hover:text-white'
                    }`}
                  >
                    {/*<span className="mr-3 shrink-0">{item.icon}</span>*/}
                    <span className="text-sm font-medium text-left break-words">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* footer */}
              <div className="mt-auto px-4 pb-4">
                <button
                  onClick={logout}
                  className="w-full text-left text-gray-200 hover:text-white text-sm font-medium break-words py-3"
                >
                  Sign out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ---------------- MAIN AREA ---------------- */}
        <div className="lg:pl-64 flex flex-col flex-1 w-full">
          {/* header */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                {/* left: hamburger + search */}
                <div className="flex items-center flex-1">
                  <button
                    className="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <div className="ml-4 lg:ml-0 w-full lg:max-w-sm">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="search"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products, orders, vendors..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#bf2c7e] focus:border-[#bf2c7e] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* right: icons + avatar */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              {/* Role switcher for demo */}
              <RoleSwitcher currentRole={demoRole} switchRole={setDemoRole} />
              
              {/* Wishlist icon for all users */}
              <Link 
                href="/wishlist" 
                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 relative"
              >
                <span className="sr-only">Wishlist</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#bf2c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              
              {/* Cart icon for all users */}
              <Link 
                href="/cart" 
                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 relative"
              >
                <span className="sr-only">Shopping cart</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#bf2c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Link>
              
              {/* add product for vendors only */}
              {currentUser?.role === 'vendor' && (
                <Link
                  href="/vendor/products/add"
                  className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              )}

              {/* messages *
              <Link 
                href="/messages" 
                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 relative"
              >
                <span className="sr-only">Messages</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {/* You can add message count badge here if needed *
                {/* <span className="absolute -top-1 -right-1 bg-[#bf2c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span> *
              </Link>

              {/* notifications */}
              <Link 
                href="/notifications" 
                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 relative"
              >
                <span className="sr-only">View notifications</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* You can add notification count badge here if needed */}
                {/* <span className="absolute -top-1 -right-1 bg-[#bf2c7e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  5
                </span> */}
              </Link>

              {/* avatar */}
              <Link href="/profile" className="relative cursor-pointer">
                <div className="w-10 h-10 bg-[#bf2c7e] rounded-full grid place-items-center text-white font-semibold break-all">
                  {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
              </Link>
            </div>
          </div>
              </div>
            </div>
          </header>

          {/* page content */}
          <main className="flex-1">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}