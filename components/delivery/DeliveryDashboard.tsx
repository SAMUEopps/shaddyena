'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Delivery {
  _id: string;
  orderId: string;
  createdAt: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
  };
  suborders: {
    _id: string;
    vendorId: string;
    shopId: string;
    status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
    deliveryFee: number;
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: string;
      notes?: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    amount: number;
  }[];
}

interface DeliveryResponse {
  deliveries: Delivery[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchDeliveries();
    }
  }, [statusFilter, currentPage, user]);

  const fetchDeliveries = async () => {
    if (!user || user.role !== 'delivery') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`/api/delivery/rider?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch deliveries');
      }
      
      const data: DeliveryResponse = await response.json();
      setDeliveries(data.deliveries);
      setTotalPages(data.totalPages);
      setTotalDeliveries(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryAction = async (orderId: string, suborderId: string, action: string) => {
    setActiveAction(`${orderId}-${suborderId}-${action}`);
    
    try {
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          suborderId,
          action,
          notes: action === 'deliver' ? notes : undefined,
          otp: action === 'deliver' ? otp : undefined
        }),
      });
      
      if (response.ok) {
        alert(`Delivery ${action} successful!`);
        fetchDeliveries();
        setOtp('');
        setNotes('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update delivery');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setActiveAction(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP': return 'bg-purple-100 text-purple-800';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (status: string) => {
    switch(status) {
      case 'ASSIGNED':
        return [{ action: 'pickup', label: 'Mark as Picked Up', color: 'bg-purple-600 hover:bg-purple-700' }];
      case 'PICKED_UP':
        return [{ action: 'in_transit', label: 'Mark as In Transit', color: 'bg-blue-600 hover:bg-blue-700' }];
      case 'IN_TRANSIT':
        return [{ action: 'deliver', label: 'Mark as Delivered', color: 'bg-green-600 hover:bg-green-700' }];
      default:
        return [];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
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
          onClick={fetchDeliveries}
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your delivery assignments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
          
          <button
            onClick={fetchDeliveries}
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e]"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Deliveries</h3>
          <p className="text-2xl font-bold text-gray-900">{totalDeliveries}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {deliveries.filter(d => 
              d.suborders.some(so => ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(so.status))
            ).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {deliveries.filter(d => 
              d.suborders.some(so => so.status === 'DELIVERED')
            ).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Earnings</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(
              deliveries.reduce((sum, d) => 
                sum + d.suborders.reduce((subSum, so) => 
                  so.status === 'DELIVERED' ? subSum + so.deliveryFee : subSum, 0
                ), 0
              )
            )}
          </p>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No deliveries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any delivery assignments yet.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order & Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deliveries.map((delivery) => 
                    delivery.suborders.map((suborder) => (
                      <tr key={`${delivery._id}-${suborder._id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {delivery.orderId}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {suborder.items.length} item(s) • Vendor: {suborder.vendorId.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Total: {formatCurrency(suborder.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(delivery.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <div className="font-medium">Pickup:</div>
                            <div>{suborder.deliveryDetails?.pickupAddress || `Shop: ${suborder.shopId}`}</div>
                            <div className="font-medium mt-1">Dropoff:</div>
                            <div>{suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address}</div>
                            <div className="text-gray-400 mt-1">
                              📞 {delivery.shipping.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(suborder.status)}`}>
                            {suborder.status.replace('_', ' ')}
                          </span>
                          <div className="mt-2 text-sm font-semibold text-gray-900">
                            {formatCurrency(suborder.deliveryFee)}
                          </div>
                          <div className="text-xs text-gray-500">Delivery Fee</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {getStatusActions(suborder.status).map((action) => (
                              <button
                                key={action.action}
                                onClick={() => handleDeliveryAction(delivery._id, suborder._id, action.action)}
                                disabled={activeAction === `${delivery._id}-${suborder._id}-${action.action}`}
                                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${action.color} disabled:opacity-50`}
                              >
                                {activeAction === `${delivery._id}-${suborder._id}-${action.action}` ? 'Processing...' : action.label}
                              </button>
                            ))}
                            
                            {suborder.status === 'IN_TRANSIT' && (
                              <div className="space-y-2 mt-2">
                                <input
                                  type="text"
                                  placeholder="Enter OTP (if required)"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                                />
                                <textarea
                                  placeholder="Delivery notes (optional)"
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                                  rows={2}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
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