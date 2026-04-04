/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

import OrdersList from './shared/OrdersList';
import OrdersStats from './shared/OrdersStats';
import OrderFilters from './shared/OrderFilters';
import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface CustomerOrdersTabProps {
  isVendorAsCustomer?: boolean;
 
}

export default function CustomerOrdersTab({ isVendorAsCustomer = false }: CustomerOrdersTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await OrderService.fetchOrders('/api/orders/my', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    };
  };

  const renderOrderRow = (order: Order) => {
    const vendorCount = order.suborders.length;
    
    return (
      <tr key={order._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
          <div className="text-xs text-gray-500">
            {order.items.length} item(s) • {vendorCount} vendor{vendorCount !== 1 ? 's' : ''}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {OrderService.formatDate(order.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {OrderService.formatCurrency(order.totalAmount)}
          </div>
          <div className="text-xs text-gray-500">
            {OrderService.formatCurrency(order.shippingFee)} shipping
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${OrderService.getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${OrderService.getStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          {/*<button 
            onClick={() => router.push(`/orders/${order._id}`)}
            className="text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
          >
            View Details
          </button>*
        <button 
          onClick={() => {
            // Pass viewAs parameter if this is a vendor viewing as customer
            const params = new URLSearchParams();
            if (isVendorAsCustomer) {
              params.set('viewAs', 'customer');
            }
            router.push(`/orders/${order._id}${params.toString() ? `?${params.toString()}` : ''}`);
          }}
          className="text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
        >
          View Details
        </button>
        </td>
      </tr>
    );
  };

  const tableHeaders = (
    <tr>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Order ID
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Date
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Amount
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Status
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  );

  const renderEmptyState = () => (
    <div className="p-8 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {isVendorAsCustomer ? 'No personal orders yet' : 'No orders found'}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {isVendorAsCustomer 
          ? "You haven't placed any orders yet."
          : "You haven't placed any orders yet."}
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#bf2c7e] hover:bg-[#a8246e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bf2c7e]"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isVendorAsCustomer ? 'My Orders' : 'My Orders'}
        </h1>
        
        <OrderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          placeholder="Search orders..."
        />
      </div>
      
      <OrdersStats stats={getStats()} />
      
      <OrdersList
        orders={orders}
        renderOrderRow={renderOrderRow}
        tableHeaders={tableHeaders}
        renderEmptyState={renderEmptyState}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalOrders={totalOrders}
      />
    </div>
  );
}*/



/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Package,
  Search,
  ChevronDown,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  ShoppingBag,
  CreditCard,
  MapPin,
  RefreshCw,
  Loader2,
  AlertCircle,
  TrendingUp,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface CustomerOrdersTabProps {
  isVendorAsCustomer?: boolean;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export default function CustomerOrdersTab({ isVendorAsCustomer = false }: CustomerOrdersTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await OrderService.fetchOrders('/api/orders/my', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const getStats = (): Stats => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    };
  };

  const stats = getStats();

  const statCards = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', textColor: 'text-blue-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10', textColor: 'text-yellow-600' },
    { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', textColor: 'text-purple-600' },
    { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/10', textColor: 'text-indigo-600' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', textColor: 'text-green-600' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', textColor: 'text-red-600' },
  ];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: any, color: string, bg: string, label: string }> = {
      PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Processing' },
      SHIPPED: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
      DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
      COMPLETED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
      CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
      CONFIRMED: { icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Confirmed' },
    };
    const c = config[status] || config.PENDING;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.color}`}>
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
          <CheckCircle className="w-3 h-3" />
          Paid
        </span>
      );
    }
    if (status === 'REFUNDED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
          <RefreshCw className="w-3 h-3" />
          Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const getPaymentIcon = (status: string) => {
    if (status === 'PAID') return <CreditCard className="w-3.5 h-3.5 text-green-500" />;
    if (status === 'REFUNDED') return <RefreshCw className="w-3.5 h-3.5 text-blue-500" />;
    return <Wallet className="w-3.5 h-3.5 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mx-auto mb-3" />
          <p className="text-[var(--color-text-muted)]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header *
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-primary)] font-medium">
                {isVendorAsCustomer ? 'Customer View' : 'My Orders'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
              {isVendorAsCustomer ? 'My Shopping Orders' : 'My Orders'}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Track and manage all your purchases
            </p>
          </div>
          
          {!isVendorAsCustomer && (
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid *
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar *
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count *
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-semibold text-[var(--color-text)]">{orders.length}</span> of{' '}
          <span className="font-semibold text-[var(--color-text)]">{totalOrders}</span> orders
        </p>
      </div>

      {/* Orders Table *
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-12 text-center">
          <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
            <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)]/50" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            {isVendorAsCustomer ? 'No personal orders yet' : 'No orders found'}
          </h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            {isVendorAsCustomer 
              ? "You haven't placed any orders yet."
              : "You haven't placed any orders yet."}
          </p>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Shopping
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {orders.map((order) => {
                    const vendorCount = order.suborders.length;
                    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    
                    return (
                      <tr key={order._id} className="hover:bg-[var(--color-background-soft)] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[var(--color-text)]">{order.orderId}</div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {totalItems} item{totalItems !== 1 ? 's' : ''} • {vendorCount} vendor{vendorCount !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                            <Calendar className="w-3.5 h-3.5" />
                            {OrderService.formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full bg-[var(--color-background-soft)] border-2 border-[var(--color-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-text-muted)]"
                              >
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)]">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-[var(--color-text)]">
                            {OrderService.formatCurrency(order.totalAmount)}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Shipping: {OrderService.formatCurrency(order.shippingFee)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {getPaymentIcon(order.paymentStatus)}
                            {getPaymentBadge(order.paymentStatus)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const params = new URLSearchParams();
                              if (isVendorAsCustomer) {
                                params.set('viewAs', 'customer');
                              }
                              router.push(`/orders/${order._id}${params.toString() ? `?${params.toString()}` : ''}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-xs font-medium hover:bg-[var(--color-primary)]/20 transition-all duration-300 group-hover:scale-105"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination *
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)]">
                Page <span className="font-semibold text-[var(--color-text)]">{currentPage}</span> of{' '}
                <span className="font-semibold text-[var(--color-text)]">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}*/

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Package,
  Search,
  ChevronDown,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  ShoppingBag,
  CreditCard,
  MapPin,
  RefreshCw,
  Loader2,
  AlertCircle,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Dot,
  Sparkles
} from 'lucide-react';
import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface CustomerOrdersTabProps {
  isVendorAsCustomer?: boolean;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  unread: number;
}

export default function CustomerOrdersTab({ isVendorAsCustomer = false }: CustomerOrdersTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortUnreadFirst, setSortUnreadFirst] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await OrderService.fetchOrders('/api/orders/my', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  // Sort orders: unread first
  const sortedOrders = useMemo(() => {
    if (!sortUnreadFirst) return orders;
    return [...orders].sort((a, b) => {
      // @ts-ignore - isViewed might not be in your Order type yet
      const aViewed = a.isViewed ?? false;
      // @ts-ignore
      const bViewed = b.isViewed ?? false;
      // Unread (false) comes first
      return Number(aViewed) - Number(bViewed);
    });
  }, [orders, sortUnreadFirst]);

  const getStats = (): Stats => {
    // @ts-ignore
    const unreadCount = orders.filter(o => !o.isViewed).length;
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      unread: unreadCount,
    };
  };

  const stats = getStats();

  const statCards = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', textColor: 'text-blue-600' },
    { label: 'New Orders', value: stats.unread, icon: Sparkles, color: 'from-blue-600 to-indigo-600', bg: 'bg-blue-500/10', textColor: 'text-blue-600', highlight: stats.unread > 0 },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10', textColor: 'text-yellow-600' },
    { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', textColor: 'text-purple-600' },
    { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/10', textColor: 'text-indigo-600' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', textColor: 'text-green-600' },
  ];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: any, color: string, bg: string, label: string }> = {
      PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Processing' },
      SHIPPED: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
      DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
      COMPLETED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
      CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
      CONFIRMED: { icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Confirmed' },
    };
    const c = config[status] || config.PENDING;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.color}`}>
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
          <CheckCircle className="w-3 h-3" />
          Paid
        </span>
      );
    }
    if (status === 'REFUNDED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
          <RefreshCw className="w-3 h-3" />
          Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const getPaymentIcon = (status: string) => {
    if (status === 'PAID') return <CreditCard className="w-3.5 h-3.5 text-green-500" />;
    if (status === 'REFUNDED') return <RefreshCw className="w-3.5 h-3.5 text-blue-500" />;
    return <Wallet className="w-3.5 h-3.5 text-yellow-500" />;
  };

  // Function to handle order click and mark as viewed optimistically
  const handleViewOrder = (orderId: string) => {
    // Optimistically update UI
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId 
          ? { ...order, isViewed: true } 
          : order
      )
    );
    
    // Navigate to order details
    const params = new URLSearchParams();
    if (isVendorAsCustomer) {
      params.set('viewAs', 'customer');
    }
    router.push(`/orders/${orderId}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mx-auto mb-3" />
          <p className="text-[var(--color-text-muted)]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header with Unread Badge */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-primary)] font-medium">
                {isVendorAsCustomer ? 'Customer View' : 'My Orders'}
              </span>
              {stats.unread > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-bold animate-pulse">
                  {stats.unread} new
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
              {isVendorAsCustomer ? 'My Shopping Orders' : 'My Orders'}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Track and manage all your purchases
            </p>
          </div>
          
          {!isVendorAsCustomer && (
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid with Unread Highlight */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-lg transition-all duration-300 group relative ${
              stat.highlight ? 'ring-2 ring-blue-500/50 shadow-lg' : ''
            }`}
          >
            {stat.highlight && (
              <div className="absolute -top-2 -right-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar with Unread Sort Toggle */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
            </div>
            
            <button
              onClick={() => setSortUnreadFirst(!sortUnreadFirst)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                sortUnreadFirst 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Unread First
              {stats.unread > 0 && sortUnreadFirst && (
                <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {stats.unread}
                </span>
              )}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count with Unread Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-semibold text-[var(--color-text)]">{sortedOrders.length}</span> of{' '}
          <span className="font-semibold text-[var(--color-text)]">{totalOrders}</span> orders
          {stats.unread > 0 && (
            <span className="ml-2 text-blue-500">
              • {stats.unread} unread
            </span>
          )}
        </p>
      </div>

      {/* Orders Table */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-12 text-center">
          <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
            <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)]/50" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            {isVendorAsCustomer ? 'No personal orders yet' : 'No orders found'}
          </h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            {isVendorAsCustomer 
              ? "You haven't placed any orders yet."
              : "You haven't placed any orders yet."}
          </p>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Shopping
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {sortedOrders.map((order) => {
                    const vendorCount = order.suborders.length;
                    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    // @ts-ignore
                    const isUnread = !order.isViewed;
                    
                    return (
                      <tr 
                        key={order._id} 
                        className={`transition-all duration-300 group ${
                          isUnread
                            ? 'bg-gradient-to-r from-blue-50/30 via-transparent to-transparent border-l-4 border-l-blue-500 shadow-sm'
                            : 'hover:bg-[var(--color-background-soft)]'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`text-sm ${
                              isUnread 
                                ? 'font-bold text-[var(--color-text)]' 
                                : 'font-semibold text-[var(--color-text)]'
                            }`}>
                              {order.orderId}
                            </div>
                            {isUnread && (
                              <>
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-bold rounded-full">
                                  NEW
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {totalItems} item{totalItems !== 1 ? 's' : ''} • {vendorCount} vendor{vendorCount !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                            <Calendar className="w-3.5 h-3.5" />
                            {OrderService.formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full bg-[var(--color-background-soft)] border-2 border-[var(--color-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-text-muted)]"
                              >
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)]">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-[var(--color-text)]">
                            {OrderService.formatCurrency(order.totalAmount)}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Shipping: {OrderService.formatCurrency(order.shippingFee)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {getPaymentIcon(order.paymentStatus)}
                            {getPaymentBadge(order.paymentStatus)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewOrder(order._id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                              isUnread
                                ? 'bg-blue-500 text-white shadow-md hover:shadow-lg hover:scale-105 animate-pulse'
                                : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                            {isUnread && (
                              <span className="ml-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)]">
                Page <span className="font-semibold text-[var(--color-text)]">{currentPage}</span> of{' '}
                <span className="font-semibold text-[var(--color-text)]">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}