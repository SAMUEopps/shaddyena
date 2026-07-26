// app/admin/deliveries/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Delivery {
  _id: string;
  orderId: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    items: any[];
  };
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  assignedRiderId?: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    vehicleType: string;
  };
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed' | 'cancelled';
  distance: number;
  earnings: number;
  pickupCoordinates?: { lat: number; lng: number };
  dropoffCoordinates?: { lat: number; lng: number };
  estimatedTime: string;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  confirmationCode?: string;
  customerConfirmed: boolean;
  createdAt: string;
}

interface Stats {
  totalDeliveries: number;
  statusBreakdown: Record<string, number>;
  earnings: {
    totalEarnings: number;
    avgEarnings: number;
    maxEarnings: number;
    minEarnings: number;
  };
  averageDeliveryTime: number;
  dailyStats: Array<{ _id: string; count: number; earnings: number }>;
  topRiders: Array<{
    riderName: string;
    riderPhone: string;
    vehicleType: string;
    deliveries: number;
    totalEarnings: number;
    avgEarnings: number;
  }>;
}

export default function AdminDeliveries() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [riders, setRiders] = useState<any[]>([]);

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/deliveries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDeliveries(data.deliveries);
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/deliveries/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRiders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/riders?isAvailable=true&isActive=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRiders(data.riders);
      }
    } catch (error) {
      console.error('Failed to fetch riders:', error);
    }
  };

  const handleStatusChange = async (deliveryId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${deliveryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDeliveries(deliveries.map(delivery => 
            delivery._id === deliveryId ? { ...delivery, ...data.delivery } : delivery
          ));
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleAssignRider = async (deliveryId: string, riderId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${deliveryId}/assign-rider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ riderId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDeliveries(deliveries.map(delivery => 
            delivery._id === deliveryId ? { ...delivery, ...data.delivery } : delivery
          ));
          alert('Rider assigned successfully');
          setShowAssignModal(false);
          setSelectedDeliveryId(null);
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to assign rider');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDeleteDelivery = async (deliveryId: string) => {
    if (!confirm('Are you sure you want to delete this delivery?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${deliveryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDeliveries(deliveries.filter(delivery => delivery._id !== deliveryId));
          alert('Delivery deleted successfully');
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete delivery');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedDeliveries.length === 0) {
      alert('Please select at least one delivery');
      return;
    }

    const actionMessages = {
      delete: `delete ${selectedDeliveries.length} deliveries`,
      updateStatus: `update status for ${selectedDeliveries.length} deliveries to "${value}"`
    };

    if (!confirm(`Are you sure you want to ${actionMessages[action as keyof typeof actionMessages] || action}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/deliveries/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          deliveryIds: selectedDeliveries, 
          action,
          value 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedDeliveries([]);
        fetchDeliveries();
        fetchStats();
      } else {
        alert(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleDeliverySelection = (deliveryId: string) => {
    setSelectedDeliveries(prev =>
      prev.includes(deliveryId)
        ? prev.filter(id => id !== deliveryId)
        : [...prev, deliveryId]
    );
  };

  const selectAllDeliveries = () => {
    if (selectedDeliveries.length === filteredDeliveries.length) {
      setSelectedDeliveries([]);
    } else {
      setSelectedDeliveries(filteredDeliveries.map(d => d._id));
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (statusFilter !== 'all' && delivery.status !== statusFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return delivery.customerName.toLowerCase().includes(searchLower) ||
             delivery.customerPhone.includes(search) ||
             delivery.pickupLocation.toLowerCase().includes(searchLower) ||
             delivery.dropoffLocation.toLowerCase().includes(searchLower) ||
             delivery.orderId?.orderNumber?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      awaiting_confirmation: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-primary">
            <div className="text-sm text-muted">Total Deliveries</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalDeliveries}</div>
            <div className="text-xs text-muted mt-1">
              {stats.statusBreakdown.completed || 0} completed
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Total Earnings</div>
            <div className="text-2xl font-bold text-secondary">KSh {stats.earnings.totalEarnings.toLocaleString()}</div>
            <div className="text-xs text-muted mt-1">
              Avg: KSh {stats.earnings.avgEarnings.toFixed(0)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-accent-dark">
            <div className="text-sm text-muted">Avg Delivery Time</div>
            <div className="text-2xl font-bold text-secondary">
              {stats.averageDeliveryTime > 0 ? formatTime(stats.averageDeliveryTime) : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
            <div className="text-sm text-muted">Pending</div>
            <div className="text-2xl font-bold text-secondary">{stats.statusBreakdown.pending || 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
            <div className="text-sm text-muted">In Transit</div>
            <div className="text-2xl font-bold text-secondary">{stats.statusBreakdown.in_transit || 0}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          📦 Deliveries Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search deliveries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="accepted">✅ Accepted</option>
            <option value="picked_up">📦 Picked Up</option>
            <option value="in_transit">🚚 In Transit</option>
            <option value="delivered">📍 Delivered</option>
            <option value="awaiting_confirmation">⏰ Awaiting Confirmation</option>
            <option value="completed">🎉 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDeliveries.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedDeliveries.length} delivery{selectedDeliveries.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => handleBulkAction('delete')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Delete Selected
          </button>
          <select
            onChange={(e) => handleBulkAction('updateStatus', e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="accepted">✅ Accepted</option>
            <option value="picked_up">📦 Picked Up</option>
            <option value="in_transit">🚚 In Transit</option>
            <option value="delivered">📍 Delivered</option>
            <option value="awaiting_confirmation">⏰ Awaiting Confirmation</option>
            <option value="completed">🎉 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
          <button
            onClick={() => setSelectedDeliveries([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllDeliveries}
                    checked={selectedDeliveries.length === filteredDeliveries.length && filteredDeliveries.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Delivery</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Rider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Earnings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedDeliveries.includes(delivery._id)}
                      onChange={() => toggleDeliverySelection(delivery._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">
                      #{delivery.orderId?.orderNumber || 'N/A'}
                    </div>
                    <div className="text-sm text-muted">
                      {delivery.pickupLocation} → {delivery.dropoffLocation}
                    </div>
                    <div className="text-xs text-muted">
                      {delivery.distance}km • {delivery.estimatedTime}
                    </div>
                    {delivery.confirmationCode && (
                      <div className="text-xs font-mono text-primary">
                        Code: {delivery.confirmationCode}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">{delivery.customerName}</div>
                    <div className="text-sm text-muted">{delivery.customerPhone}</div>
                    {delivery.customerConfirmed && (
                      <div className="text-xs text-green-600">✓ Confirmed</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {delivery.assignedRiderId ? (
                      <>
                        <div className="font-medium text-secondary">{delivery.assignedRiderId.fullName}</div>
                        <div className="text-sm text-muted">{delivery.assignedRiderId.phoneNumber}</div>
                        <div className="text-xs text-muted">{delivery.assignedRiderId.vehicleType}</div>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedDeliveryId(delivery._id);
                          setShowAssignModal(true);
                          fetchRiders();
                        }}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        Assign Rider
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {delivery.status !== 'completed' && delivery.status !== 'cancelled' && (
                        <select
                          onChange={(e) => handleStatusChange(delivery._id, e.target.value)}
                          className="text-xs border rounded px-1 py-0.5 bg-white"
                          value={delivery.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="picked_up">Picked Up</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="awaiting_confirmation">Awaiting Confirmation</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-secondary">
                      KSh {delivery.earnings.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">
                      Order: KSh {delivery.orderId?.totalAmount?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/shd-pages/admin/deliveries/${delivery._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteDelivery(delivery._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDeliveries.length === 0 && (
          <div className="text-center py-8 text-muted">
            No deliveries found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredDeliveries.length} of {deliveries.length} deliveries
          {search && ` (filtered from ${deliveries.length} total)`}
        </span>
        <span>
          {selectedDeliveries.length > 0 && `${selectedDeliveries.length} selected`}
        </span>
      </div>

      {/* Assign Rider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">Assign Rider</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedDeliveryId(null);
                }}
                className="text-muted hover:text-text text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Select Rider
                </label>
                <select
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    if (selectedDeliveryId && e.target.value) {
                      handleAssignRider(selectedDeliveryId, e.target.value);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a rider</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.fullName} - {rider.vehicleType} ({rider.phoneNumber})
                    </option>
                  ))}
                </select>
              </div>
              {riders.length === 0 && (
                <div className="text-center text-muted py-4">
                  No available riders found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}