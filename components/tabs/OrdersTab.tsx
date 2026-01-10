'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrdersTabProps {
  role: 'customer' | 'vendor' | 'admin';
}

interface OrderItem {
  productId: string;
  vendorId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Suborder {
  _id?: string;
  vendorId: string;
  shopId: string;
  items: OrderItem[];
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  buyerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  suborders: Suborder[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  currency: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
}

interface ApiResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}

type ViewMode = 'customer' | 'vendor';

export default function OrdersTab({ role }: OrdersTabProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorOrders, setVendorOrders] = useState<{
    order: Order;
    suborder: Suborder;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('vendor'); // Default for vendors
  const router = useRouter();
  
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer' || (isVendor && viewMode === 'customer');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, currentPage, viewMode]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      
      // Determine which endpoint to call based on role and view mode
      if (isVendor) {
        if (viewMode === 'customer') {
          endpoint = '/api/orders/my'; // Vendor viewing their own orders as customer
        } else {
          endpoint = '/api/orders/vendor'; // Vendor viewing orders placed with them
        }
      } else if (isAdmin) {
        endpoint = '/api/orders/admin';
      } else {
        endpoint = '/api/orders/my'; // Regular customer
      }
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data: ApiResponse = await response.json();
      
      if (isVendor && viewMode === 'vendor') {
        // Transform vendor data: flatten suborders for easier display
        const flattened: { order: Order; suborder: Suborder }[] = [];
        data.orders.forEach(order => {
          order.suborders.forEach(suborder => {
            flattened.push({ order, suborder });
          });
        });
        setVendorOrders(flattened);
        setOrders([]); // Clear regular orders for vendor view
      } else {
        setOrders(data.orders);
        setVendorOrders([]); // Clear vendor orders for customer view
      }
      
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'PAID': 
        return 'bg-green-100 text-green-800';
      case 'SHIPPED': 
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
      case 'PROCESSING': 
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
      case 'FAILED':
      case 'REFUNDED': 
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBuyerName = (buyer: string | any): string => {
    if (typeof buyer === 'object') {
      return `${buyer.firstName} ${buyer.lastName}`;
    }
    return 'Customer';
  };


  const getVendorStats = () => {
    const stats = {
      total: vendorOrders.length,
      pending: vendorOrders.filter(vo => vo.suborder.status === 'PENDING').length,
      processing: vendorOrders.filter(vo => vo.suborder.status === 'PROCESSING').length,
      shipped: vendorOrders.filter(vo => vo.suborder.status === 'SHIPPED').length,
      delivered: vendorOrders.filter(vo => vo.suborder.status === 'DELIVERED').length,
      cancelled: vendorOrders.filter(vo => vo.suborder.status === 'CANCELLED').length,
    };
    return stats;
  };

  const getCustomerStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    };
    return stats;
  };

  const getAdminStats = () => {
    const stats = {
      total: totalOrders,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      paid: orders.filter(o => o.paymentStatus === 'PAID').length,
      pendingPayment: orders.filter(o => o.paymentStatus === 'PENDING').length,
    };
    return stats;
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, suborderId?: string) => {
    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          suborderId
        }),
      });
      
      if (response.ok) {
        fetchOrders(); // Refresh orders
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update order status');
    }
  };

  const renderVendorOrderRow = (vendorOrder: { order: Order; suborder: Suborder }) => {
    const { order, suborder } = vendorOrder;
    
    return (
      <tr key={`${order._id}-${suborder.vendorId}`} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
          <div className="text-xs text-gray-500">Vendor Suborder</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(order.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {getBuyerName(order.buyerId)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {suborder.items.length} item(s)
          </div>
          <div className="text-xs text-gray-500">
            {formatCurrency(suborder.netAmount, order.currency)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(suborder.status)}`}>
              {suborder.status}
            </span>
            <div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
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
              onClick={() => handleStatusUpdate(order._id, 'SHIPPED', suborder._id)}
              className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Mark Shipped
            </button>
          )}
          {suborder.status === 'SHIPPED' && (
            <button
              onClick={() => handleStatusUpdate(order._id, 'DELIVERED', suborder._id)}
              className="ml-2 text-green-600 hover:text-green-800 text-sm"
            >
              Mark Delivered
            </button>

          )}
        </td>

      </tr>

    );
  };

  const renderCustomerOrderRow = (order: Order) => {
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
          {formatDate(order.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {formatCurrency(order.totalAmount)}
          </div>
          <div className="text-xs text-gray-500">
            {formatCurrency(order.shippingFee)} shipping
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button 
            onClick={() => router.push(`/orders/${order._id}`)}
            className="text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
          >
            View Details
          </button>

        </td>
      </tr>
    );
  };

  const renderAdminOrderRow = (order: Order) => {
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
          {formatDate(order.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {getBuyerName(order.buyerId)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {formatCurrency(order.totalAmount)}
          </div>
          <div className="text-xs text-gray-500">
            Platform: {formatCurrency(order.platformFee)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button 
            onClick={() => router.push(`/orders/${order._id}?adminView=true`)}
            className="text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
          >
            Manage
          </button>
          <button 
            onClick={() => router.push(`/orders/${order._id}`)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Details
          </button>
        </td>
      </tr>
    );
  };

  const renderTableHeaders = () => {
    if (isVendor && viewMode === 'vendor') {
      return (
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
    }
    
    if (isCustomer || (isVendor && viewMode === 'customer')) {
      return (
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
    }
    
    // Admin
    return (
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
  };

  const renderStats = () => {
    if (isVendor && viewMode === 'vendor') {
      const stats = getVendorStats();
      return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Processing</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>
      );
    }
    
    if (isCustomer || (isVendor && viewMode === 'customer')) {
      const stats = getCustomerStats();
      return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Processing</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>
      );
    }
    
    // Admin
    const stats = getAdminStats();
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.processing + stats.shipped}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Paid</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.paid}</p>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    if (isVendor && viewMode === 'vendor') {
      return (
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vendor orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't received any orders from customers yet.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setViewMode('customer')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#bf2c7e] hover:bg-[#a8246e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bf2c7e]"
            >
              View My Orders
            </button>
          </div>
        </div>
      );
    }
    
    if (isCustomer || (isVendor && viewMode === 'customer')) {
      return (
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isVendor ? 'No personal orders yet' : 'No orders found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isVendor 
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
            {isVendor && (
              <button
                type="button"
                onClick={() => setViewMode('vendor')}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bf2c7e]"
              >
                View Vendor Orders
              </button>
            )}
          </div>
        </div>
      );
    }
    
    // Admin
    return (
      <div className="p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No orders match your current filters.
        </p>
      </div>
    );
  };

  const getTitle = () => {
    if (isVendor) {
      return viewMode === 'vendor' ? 'Vendor Orders' : 'My Orders';
    }
    if (isAdmin) return 'Order Management';
    return 'My Orders';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {getTitle()}
          </h1>
          
          {/* View mode toggle for vendors */}
          {isVendor && (
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setViewMode('vendor')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'vendor'
                    ? 'bg-[#bf2c7e] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Vendor Orders
              </button>
                                   
              <button
                type="button"
                onClick={() => setViewMode('customer')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewMode === 'customer'
                    ? 'bg-[#bf2c7e] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Orders
              </button>
     
            </div>
          )}
                {/*}   <Link 
                href="/vendor/earnings" 
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#bf2c7e] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                My Earnings
              </Link>*/}
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder={
              isVendor && viewMode === 'vendor' 
                ? "Search order ID or customer..." 
                : "Search orders..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
          >
            <option value="all">All Status</option>
            {(isVendor && viewMode === 'vendor') ? (
              <>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </>
            ) : (
              <>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
          </select>
        </div>
      </div>
      
      {renderStats()}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {((isVendor && viewMode === 'vendor' && vendorOrders.length === 0) || 
          ((isCustomer || (isVendor && viewMode === 'customer')) && orders.length === 0) ||
          (isAdmin && orders.length === 0)) ? (
          renderEmptyState()
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {renderTableHeaders()}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isVendor && viewMode === 'vendor' ? (
                    vendorOrders.map(renderVendorOrderRow)
                  ) : isCustomer || (isVendor && viewMode === 'customer') ? (
                    orders.map(renderCustomerOrderRow)
                  ) : (
                    orders.map(renderAdminOrderRow)
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}