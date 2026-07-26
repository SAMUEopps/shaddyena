// app/admin/deliveries/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Delivery {
  _id: string;
  orderId: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    customerId: string;
  };
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  assignedRiderId?: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    vehicleType: string;
    vehicleRegistration: string;
    rating: number;
    totalDeliveries: number;
  };
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed' | 'cancelled';
  distance: number;
  earnings: number;
  pickupCoordinates?: {
    lat: number;
    lng: number;
  };
  dropoffCoordinates?: {
    lat: number;
    lng: number;
  };
  estimatedTime: string;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  confirmationCode?: string;
  codeGeneratedAt?: Date;
  codeExpiresAt?: Date;
  customerConfirmed: boolean;
  customerConfirmedAt?: Date;
  createdAt: string;
}

interface StatusHistory {
  status: string;
  timestamp: Date;
}

export default function DeliveryDetail() {
  const router = useRouter();
  const params = useParams();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [riders, setRiders] = useState<any[]>([]);

  useEffect(() => {
    fetchDelivery();
    fetchStatusHistory();
  }, []);

  const fetchDelivery = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDelivery(data.delivery);
        setFormData(data.delivery);
      }
    } catch (error) {
      console.error('Failed to fetch delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      // Since we don't have a dedicated status history collection,
      // we'll build it from the delivery timestamps
      if (delivery) {
        const history: StatusHistory[] = [];
        const statusMap = {
          'pending': delivery.createdAt,
          'accepted': delivery.acceptedAt,
          'picked_up': delivery.pickedUpAt,
          'in_transit': delivery.inTransitAt,
          'delivered': delivery.deliveredAt,
          'completed': delivery.completedAt
        };

        Object.entries(statusMap).forEach(([status, timestamp]) => {
          if (timestamp) {
            history.push({ status, timestamp: new Date(timestamp) });
          }
        });

        // Add current status if it's not already in history
        if (delivery.status && !history.find(h => h.status === delivery.status)) {
          history.push({ 
            status: delivery.status, 
            timestamp: new Date() 
          });
        }

        setStatusHistory(history.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to fetch status history:', error);
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

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDelivery(data.delivery);
          setEditing(false);
          alert('Delivery updated successfully');
          fetchStatusHistory();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update delivery');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${params.id}`, {
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
          setDelivery(data.delivery);
          alert('Status updated successfully');
          fetchStatusHistory();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleAssignRider = async (riderId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${params.id}/assign-rider`, {
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
          setDelivery(data.delivery);
          alert('Rider assigned successfully');
          setShowAssignModal(false);
          fetchStatusHistory();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to assign rider');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this delivery?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/deliveries/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Delivery deleted successfully');
          router.push('/admin/deliveries');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete delivery');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      picked_up: 'bg-purple-100 text-purple-800 border-purple-200',
      in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      awaiting_confirmation: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      accepted: '✅',
      picked_up: '📦',
      in_transit: '🚚',
      delivered: '📍',
      awaiting_confirmation: '⏰',
      completed: '🎉',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'awaiting_confirmation', 'completed'];
    return steps.indexOf(status);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="p-8 text-center text-muted">
        <div className="text-4xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-secondary">Delivery not found</h2>
        <button
          onClick={() => router.push('/admin/deliveries')}
          className="mt-4 text-primary hover:text-accent-dark transition"
        >
          ← Back to Deliveries
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/deliveries')}
          className="text-primary hover:text-accent-dark transition mb-4 inline-block"
        >
          ← Back to Deliveries
        </button>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Delivery #{delivery.orderId?.orderNumber || 'N/A'}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(delivery.status)}`}>
                {getStatusIcon(delivery.status)} {delivery.status.replace('_', ' ').toUpperCase()}
              </span>
              {delivery.customerConfirmed && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                  ✓ Customer Confirmed
                </span>
              )}
              {delivery.confirmationCode && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary-light text-white border border-primary">
                  Code: {delivery.confirmationCode}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
            >
              {editing ? 'Cancel' : 'Edit Delivery'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Delivery Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted">Order Number</label>
                <div className="font-medium text-secondary">
                  <Link 
                    href={`/admin/orders/${delivery.orderId?._id}`}
                    className="text-primary hover:text-accent-dark transition"
                  >
                    #{delivery.orderId?.orderNumber || 'N/A'}
                  </Link>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Created At</label>
                <div className="font-medium text-secondary">{formatDate(delivery.createdAt)}</div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-muted">Order Items</label>
              <div className="mt-2 space-y-2">
                {delivery.orderId?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-accent py-2">
                    <span className="text-secondary">{item.name} × {item.quantity}</span>
                    <span className="text-secondary font-medium">KSh {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-bold text-secondary">
                  <span>Total</span>
                  <span>KSh {delivery.orderId?.totalAmount?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Location Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted">Pickup Location</label>
                <div className="font-medium text-secondary">{delivery.pickupLocation}</div>
                {delivery.pickupCoordinates && (
                  <div className="text-xs text-muted mt-1">
                    {delivery.pickupCoordinates.lat}, {delivery.pickupCoordinates.lng}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-muted">Dropoff Location</label>
                <div className="font-medium text-secondary">{delivery.dropoffLocation}</div>
                {delivery.dropoffCoordinates && (
                  <div className="text-xs text-muted mt-1">
                    {delivery.dropoffCoordinates.lat}, {delivery.dropoffCoordinates.lng}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Distance</label>
                <div className="font-medium text-secondary">{delivery.distance} km</div>
              </div>
              <div>
                <label className="text-xs text-muted">Estimated Time</label>
                <div className="font-medium text-secondary">{delivery.estimatedTime}</div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Status Timeline</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-accent"></div>
              
              <div className="space-y-6">
                {statusHistory.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${getStatusColor(item.status)}`}>
                      <span className="text-xs">{getStatusIcon(item.status)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary">
                        {item.status.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-muted">{formatDate(item.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Customer</h2>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted">Name</label>
                <div className="font-medium text-secondary">{delivery.customerName}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Phone</label>
                <div className="font-medium text-secondary">{delivery.customerPhone}</div>
              </div>
              {delivery.customerConfirmedAt && (
                <div>
                  <label className="text-xs text-muted">Confirmed At</label>
                  <div className="font-medium text-secondary">{formatDate(delivery.customerConfirmedAt)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Rider Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Rider</h2>
            {delivery.assignedRiderId ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted">Name</label>
                  <div className="font-medium text-secondary">{delivery.assignedRiderId.fullName}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Phone</label>
                  <div className="font-medium text-secondary">{delivery.assignedRiderId.phoneNumber}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Vehicle</label>
                  <div className="font-medium text-secondary">
                    {delivery.assignedRiderId.vehicleType} - {delivery.assignedRiderId.vehicleRegistration}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <label className="text-xs text-muted">Rating</label>
                    <div className="font-medium text-secondary">⭐ {delivery.assignedRiderId.rating?.toFixed(1) || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-xs text-muted">Deliveries</label>
                    <div className="font-medium text-secondary">{delivery.assignedRiderId.totalDeliveries || 0}</div>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/admin/riders/${delivery.assignedRiderId?._id}`)}
                  className="w-full mt-2 text-primary hover:text-accent-dark text-sm font-medium transition"
                >
                  View Rider Details →
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted mb-3">No rider assigned</p>
                <button
                  onClick={() => {
                    setShowAssignModal(true);
                    fetchRiders();
                  }}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition"
                >
                  Assign Rider
                </button>
              </div>
            )}
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Earnings</h2>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted">Delivery Earnings</label>
                <div className="text-2xl font-bold text-secondary">KSh {delivery.earnings?.toLocaleString() || 0}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Order Total</label>
                <div className="font-medium text-secondary">KSh {delivery.orderId?.totalAmount?.toLocaleString() || 0}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={delivery.status}
              >
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Accepted</option>
                <option value="picked_up">📦 Picked Up</option>
                <option value="in_transit">🚚 In Transit</option>
                <option value="delivered">📍 Delivered</option>
                <option value="awaiting_confirmation">⏰ Awaiting Confirmation</option>
                <option value="completed">🎉 Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
              
              {delivery.confirmationCode && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(delivery.confirmationCode || '');
                    alert('Confirmation code copied to clipboard!');
                  }}
                  className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
                >
                  📋 Copy Confirmation Code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-secondary">Edit Delivery</h2>
              <button
                onClick={() => setEditing(false)}
                className="text-muted hover:text-text text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName || ''}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Customer Phone *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerPhone || ''}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickupLocation || ''}
                  onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Dropoff Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dropoffLocation || ''}
                  onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.distance || 0}
                    onChange={(e) => setFormData({...formData, distance: parseFloat(e.target.value)})}
                    className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">
                    Earnings (KSh) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.earnings || 0}
                    onChange={(e) => setFormData({...formData, earnings: parseFloat(e.target.value)})}
                    className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Estimated Time *
                </label>
                <input
                  type="text"
                  required
                  value={formData.estimatedTime || ''}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                  placeholder="e.g., 30 min"
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(delivery);
                  }}
                  className="flex-1 border border-accent rounded-lg px-6 py-2 hover:bg-background transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Rider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">Assign Rider</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
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
                    if (e.target.value) {
                      handleAssignRider(e.target.value);
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
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}