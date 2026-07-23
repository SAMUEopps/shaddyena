// C:\Users\USER\Desktop\Projects\my-app\app\admin\layout.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(userData);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/vendors', label: 'Vendors', icon: '🏪' },
    { href: '/admin/riders', label: 'Riders', icon: '🏍️' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/deliveries', label: 'Deliveries', icon: '🚚' },
    { href: '/admin/transactions', label: 'Transactions', icon: '💰' },
    { href: '/admin/payouts', label: 'Payouts', icon: '💳' },
    { href: '/admin/members', label: 'Members', icon: '🌟' },
    { href: '/admin/investments', label: 'Investments', icon: '📈' },
    { href: '/admin/referrals', label: 'Referrals', icon: '🔗' },
    { href: '/admin/reconcile', label: 'Reconciliation', icon: '📊' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { href: '/admin/events', label: 'Events', icon: '📅' },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: '📋 ' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar *
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold">🛍️ Admin</h1>
            <p className="text-sm text-gray-400">{user?.name || 'Admin'}</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-600 text-gray-300 hover:text-white transition"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content *
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300`}>
        {/* Top Bar *
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Page Content *
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(userData);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/vendors', label: 'Vendors', icon: '🏪' },
    { href: '/admin/riders', label: 'Riders', icon: '🏍️' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/deliveries', label: 'Deliveries', icon: '🚚' },
    { href: '/admin/transactions', label: 'Transactions', icon: '💰' },
    { href: '/admin/payouts', label: 'Payouts', icon: '💳' },
    { href: '/admin/members', label: 'Members', icon: '🌟' },
    { href: '/admin/investments', label: 'Investments', icon: '📈' },
    { href: '/admin/referrals', label: 'Referrals', icon: '🔗' },
    { href: '/admin/reconcile', label: 'Reconciliation', icon: '📊' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { href: '/admin/events', label: 'Events', icon: '📅' },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: '📋' },
  ];

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Overlay */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-secondary text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛍️</span>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Admin</h1>
                <p className="text-sm text-white/60 truncate">
                  {user?.name || 'Administrator'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-200 group"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen && !isMobile ? 'ml-72' : 'ml-0'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-surface">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-surface transition-colors duration-200 text-secondary"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:block">Admin Panel</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}