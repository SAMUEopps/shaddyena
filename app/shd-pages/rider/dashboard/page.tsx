// C:\Users\USER\Desktop\Projects\my-app\app\rider\dashboard\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
  distance: number;
  earnings: number;
  createdAt: string;
  estimatedTime: string;
}

interface RiderStats {
  totalDeliveries: number;
  totalEarned: number;
  pendingPayout: number;
  rating: number;
  isAvailable: boolean;
  onlineTime: string;
}

export default function RiderDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RiderStats>({
    totalDeliveries: 0,
    totalEarned: 0,
    pendingPayout: 0,
    rating: 5.0,
    isAvailable: true,
    onlineTime: '0h 0m'
  });
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
  const [isOnline, setIsOnline] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch rider stats
        const statsResponse = await fetch('/api/shd-api/api/rider/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data);
          setIsOnline(data.isAvailable);
        }

        // Fetch deliveries
        const deliveriesResponse = await fetch('/api/shd-api/api/rider/deliveries', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (deliveriesResponse.ok) {
          const data = await deliveriesResponse.json();
          setDeliveries(data);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !isOnline })
      });

      if (response.ok) {
        setIsOnline(!isOnline);
        setStats(prev => ({ ...prev, isAvailable: !isOnline }));
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const acceptDelivery = async (deliveryId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/rider/accept-delivery/${deliveryId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update deliveries list
        setDeliveries(prev => 
          prev.map(d => 
            d.id === deliveryId 
              ? { ...d, status: 'accepted' } 
              : d
          )
        );
        alert('Delivery accepted!');
      }
    } catch (error) {
      console.error('Error accepting delivery:', error);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/rider/update-delivery/${deliveryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setDeliveries(prev => 
          prev.map(d => 
            d.id === deliveryId 
              ? { ...d, status: status as any } 
              : d
          )
        );
        
        if (status === 'delivered') {
          // Refresh stats
          const statsResponse = await fetch('/api/shd-api/api/rider/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (statsResponse.ok) {
            const data = await statsResponse.json();
            setStats(data);
          }
        }
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (activeTab === 'available') return d.status === 'pending';
    if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit'].includes(d.status);
    if (activeTab === 'history') return d.status === 'delivered';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏍️ Rider Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your deliveries and earnings</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAvailability}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  isOnline 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </button>
              <Link
                href="/rider/profile"
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
              >
                👤
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                📦
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">KSh {stats.totalEarned}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                💰
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payout</p>
                <p className="text-2xl font-bold text-orange-600">KSh {stats.pendingPayout}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-2xl font-bold text-yellow-500">⭐ {stats.rating}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Tabs */}
        <div className="bg-white rounded-xl shadow">
          <div className="border-b">
            <div className="flex space-x-4 p-4">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'available'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Available ({deliveries.filter(d => d.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'ongoing'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit'].includes(d.status)).length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'history'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                History ({deliveries.filter(d => d.status === 'delivered').length})
              </button>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="p-4">
            {filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">🚚</p>
                <h3 className="text-lg font-semibold text-gray-700">No deliveries</h3>
                <p className="text-sm text-gray-500">
                  {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
                  {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
                  {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-wrap items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
                            {getStatusLabel(delivery.status)}
                          </span>
                          <span className="text-sm text-gray-500">Order #{delivery.orderId}</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Customer:</span> {delivery.customerName}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Phone:</span> {delivery.customerPhone}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Pickup:</span> {delivery.pickupLocation}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Dropoff:</span> {delivery.dropoffLocation}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Distance:</span> {delivery.distance} km
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Earnings:</span> KSh {delivery.earnings}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 mt-3 md:mt-0">
                        {delivery.status === 'pending' && (
                          <button
                            onClick={() => acceptDelivery(delivery.id)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                          >
                            Accept Delivery
                          </button>
                        )}

                        {delivery.status === 'accepted' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                          >
                            Mark as Picked Up
                          </button>
                        )}

                        {delivery.status === 'picked_up' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                          >
                            Start Delivery
                          </button>
                        )}

                        {delivery.status === 'in_transit' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                          >
                            Mark as Delivered
                          </button>
                        )}

                        <Link
                          href={`/rider/delivery/${delivery.id}`}
                          className="text-purple-600 hover:underline text-sm text-center"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link
            href="/rider/earnings"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">My Earnings</p>
              <p className="font-semibold">View payment history</p>
            </div>
            <span className="text-2xl">💰</span>
          </Link>

          <Link
            href="/rider/profile"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Profile</p>
              <p className="font-semibold">Update your details</p>
            </div>
            <span className="text-2xl">👤</span>
          </Link>

          <Link
            href="/rider/support"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Support</p>
              <p className="font-semibold">Get help</p>
            </div>
            <span className="text-2xl">🆘</span>
          </Link>
        </div>
      </div>
    </div>
  );
}