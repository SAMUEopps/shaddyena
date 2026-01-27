'use client';

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
}