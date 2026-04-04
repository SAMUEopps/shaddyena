/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Order, Suborder, ApiResponse } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import OrdersList from './shared/OrdersList';
import OrdersStats from './shared/OrdersStats';
import OrderFilters from './shared/OrderFilters';

interface VendorOrder {
  order: Order;
  suborder: Suborder;
 
}

export default function VendorOrdersTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
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
      const data = await OrderService.fetchOrders('/api/orders/vendor', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      // Transform vendor data: flatten suborders for easier display
      const flattened: VendorOrder[] = [];
      data.orders.forEach(order => {
        order.suborders.forEach(suborder => {
          flattened.push({ order, suborder });
        });
      });
      setVendorOrders(flattened);
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, suborderId: string) => {
    try {
      await OrderService.updateOrderStatus({
        orderId,
        suborderId,
        status: 'READY_FOR_PICKUP'
      });
      
      fetchOrders(); // Refresh orders
      alert('Order marked as ready for pickup!');
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update order status');
    }
  };

  const getStats = () => {
    return {
      total: vendorOrders.length,
      pending: vendorOrders.filter(vo => vo.suborder.status === 'PENDING').length,
      processing: vendorOrders.filter(vo => vo.suborder.status === 'PROCESSING').length,
      shipped: vendorOrders.filter(vo => vo.suborder.status === 'SHIPPED').length,
      delivered: vendorOrders.filter(vo => vo.suborder.status === 'DELIVERED').length,
      cancelled: vendorOrders.filter(vo => vo.suborder.status === 'CANCELLED').length,
    };
  };

  const renderOrderRow = (vendorOrder: VendorOrder) => {
    const { order, suborder } = vendorOrder;
    
    return (
      <tr key={`${order._id}-${suborder.vendorId}`} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
          <div className="text-xs text-gray-500">Vendor Suborder</div>
          <div className="text-xs text-gray-400 mt-1">
            {suborder.items?.length || 0} item(s)
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {OrderService.formatDate(order.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {OrderService.getBuyerName(order.buyerId)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {OrderService.formatCurrency(suborder.netAmount, order.currency)}
          </div>
          <div className="text-xs text-gray-500">
            Gross: {OrderService.formatCurrency(suborder.amount, order.currency)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${OrderService.getStatusColor(suborder.status)}`}>
              {suborder.status}
            </span>
            <div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${OrderService.getStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
            {suborder.riderId && (
              <div className="text-xs text-gray-600">
                Rider assigned
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button 
            onClick={() => router.push(`/orders/${order._id}?vendorView=true&suborderId=${suborder._id}`)}
            className="text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
          >
            View Details
          </button>
          {suborder.status === 'PROCESSING' && (
            <button
              onClick={() => handleStatusUpdate(order._id, suborder._id || '')}
              className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Mark as Ready for Pickup
            </button>
          )}
          {suborder.status === 'READY_FOR_PICKUP' && (
            <div className="text-sm text-gray-600 mt-1">
              Waiting for rider assignment
            </div>
          )}
          {suborder.status === 'SHIPPED' && suborder.riderId && (
            <div className="text-sm text-gray-600 mt-1">
              Rider on the way
            </div>
          )}
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
        Customer
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Items & Amount
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No vendor orders yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        You haven't received any orders from customers yet.
      </p>
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
          Vendor Orders
        </h1>
        
        <OrderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          placeholder="Search order ID or customer..."
        />
      </div>
      
      <OrdersStats stats={getStats()} />
      
      <OrdersList
        orders={vendorOrders}
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

'use client';

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
  RefreshCw,
  Loader2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  ArrowUpRight,
  Rocket,
  User,
  Box,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface VendorOrder {
  order: Order;
  suborder: Suborder;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  readyForPickup: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export default function VendorOrdersTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await OrderService.fetchOrders('/api/orders/vendor', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const flattened: VendorOrder[] = [];
      data.orders.forEach(order => {
        order.suborders.forEach(suborder => {
          flattened.push({ order, suborder });
        });
      });
      setVendorOrders(flattened);
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

  const handleStatusUpdate = async (orderId: string, suborderId: string) => {
    if (updatingOrderId) return;
    
    setUpdatingOrderId(suborderId);
    try {
      await OrderService.updateOrderStatus({
        orderId,
        suborderId,
        status: 'READY_FOR_PICKUP'
      });
      
      await fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStats = (): Stats => {
    return {
      total: vendorOrders.length,
      pending: vendorOrders.filter(vo => vo.suborder.status === 'PENDING').length,
      processing: vendorOrders.filter(vo => vo.suborder.status === 'PROCESSING').length,
      readyForPickup: vendorOrders.filter(vo => vo.suborder.status === 'READY_FOR_PICKUP').length,
      shipped: vendorOrders.filter(vo => vo.suborder.status === 'SHIPPED' || vo.suborder.status === 'ASSIGNED' || vo.suborder.status === 'PICKED_UP' || vo.suborder.status === 'IN_TRANSIT').length,
      //delivered: vendorOrders.filter(vo => vo.suborder.status === 'DELIVERED' || vo.suborder.status === 'COMPLETED' || vo.suborder.status === 'CONFIRMED').length,
      delivered: vendorOrders.filter(vo => vo.suborder.status === 'DELIVERED'  || vo.suborder.status === 'CONFIRMED').length,
      cancelled: vendorOrders.filter(vo => vo.suborder.status === 'CANCELLED').length,
    };
  };

  const stats = getStats();

  const statCards = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', textColor: 'text-blue-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10', textColor: 'text-yellow-600' },
    { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', textColor: 'text-purple-600' },
    { label: 'Ready for Pickup', value: stats.readyForPickup, icon: Rocket, color: 'from-teal-500 to-green-500', bg: 'bg-teal-500/10', textColor: 'text-teal-600' },
    { label: 'In Transit', value: stats.shipped, icon: Truck, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/10', textColor: 'text-indigo-600' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', textColor: 'text-green-600' },
  ];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: any, color: string, bg: string, label: string }> = {
      PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Processing' },
      READY_FOR_PICKUP: { icon: Rocket, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Ready for Pickup' },
      ASSIGNED: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Rider Assigned' },
      PICKED_UP: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Picked Up' },
      IN_TRANSIT: { icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-100', label: 'In Transit' },
      SHIPPED: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
      DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
      COMPLETED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
      CONFIRMED: { icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Confirmed' },
      CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
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
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
        <Clock className="w-3 h-3" />
        Pending Payment
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mx-auto mb-3" />
          <p className="text-[var(--color-text-muted)]">Loading vendor orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
            <Store className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-primary)] font-medium">Vendor Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Vendor Orders
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Manage and track all customer orders for your shop
          </p>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Filters Bar */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
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
                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option value="ASSIGNED">Rider Assigned</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
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

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-semibold text-[var(--color-text)]">{vendorOrders.length}</span> of{' '}
          <span className="font-semibold text-[var(--color-text)]">{totalOrders}</span> orders
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
      ) : vendorOrders.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-12 text-center">
          <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
            <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)]/50" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No vendor orders yet</h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            You haven't received any orders from customers yet.
          </p>
          <button
            onClick={() => router.push('/vendor/products')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Manage Products
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
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Items & Amount
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
                  {vendorOrders.map((vendorOrder) => {
                    const { order, suborder } = vendorOrder;
                    const buyerName = OrderService.getBuyerName(order.buyerId);
                    const totalItems = suborder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    const canMarkReady = suborder.status === 'PROCESSING';
                    const isUpdating = updatingOrderId === suborder._id;
                    
                    return (
                      <tr key={`${order._id}-${suborder.vendorId}`} className="hover:bg-[var(--color-background-soft)] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[var(--color-text)]">{order.orderId}</div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {totalItems} item{totalItems !== 1 ? 's' : ''}
                          </div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                            <Calendar className="w-3.5 h-3.5" />
                            {OrderService.formatDate(order.createdAt)}
                          </div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center text-white font-bold text-sm">
                              {buyerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[var(--color-text)]">{buyerName}</div>
                              <div className="text-xs text-[var(--color-text-muted)]">
                                {OrderService.getBuyerEmail(order.buyerId)}
                              </div>
                            </div>
                          </div>
                         </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-[var(--color-text)]">
                            {OrderService.formatCurrency(suborder.netAmount, order.currency)}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Gross: {OrderService.formatCurrency(suborder.amount, order.currency)}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Commission: {OrderService.formatCurrency(suborder.commission, order.currency)}
                          </div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(suborder.status)}
                          {suborder.riderId && (
                            <div className="text-xs text-[var(--color-text-muted)] mt-1">
                              <Truck className="w-3 h-3 inline mr-1" />
                              Rider assigned
                            </div>
                          )}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentBadge(order.paymentStatus)}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => router.push(`/orders/${order._id}?vendorView=true&suborderId=${suborder._id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-xs font-medium hover:bg-[var(--color-primary)]/20 transition-all duration-300 group-hover:scale-105"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            
                            {/*{canMarkReady && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, suborder._id || '')}
                                disabled={isUpdating}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-all duration-300 disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Rocket className="w-3.5 h-3.5" />
                                )}
                                Ready for Pickup
                              </button>
                            )}*/}
                            
                            {suborder.status === 'READY_FOR_PICKUP' && (
                              <div className="text-xs text-[var(--color-text-muted)] bg-yellow-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Waiting for rider
                              </div>
                            )}
                            
                            {suborder.status === 'ASSIGNED' && (
                              <div className="text-xs text-[var(--color-text-muted)] bg-blue-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Rider en route
                              </div>
                            )}
                          </div>
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