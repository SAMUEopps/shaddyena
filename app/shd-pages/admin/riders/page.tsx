// app/admin/riders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Rider {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isVerified: boolean;
    isMember: boolean;
  };
  fullName: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  kraPin?: string;
  vehicleType: 'MOTORCYCLE' | 'BICYCLE' | 'CAR' | 'VAN';
  vehicleRegistration: string;
  driverLicense: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    updatedAt: Date;
  };
  isActive: boolean;
  isAvailable: boolean;
  totalDeliveries: number;
  rating: number;
  totalEarned: number;
  pendingPayout: number;
  payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
  payoutDetails: {
    mpesaNumber?: string;
    pochiNumber?: string;
    tillNumber?: string;
    paybillNumber?: string;
    paybillAccount?: string;
  };
  deliveryRadius: number;
  createdAt: string;
}

interface Stats {
  totalRiders: number;
  activeRiders: number;
  availableRiders: number;
  inactiveRiders: number;
  vehicleTypes: Array<{ _id: string; count: number }>;
  earnings: { totalEarned: number; totalPendingPayout: number };
  averageRating: number;
  totalDeliveries: number;
  recentRiders: Rider[];
}

export default function AdminRiders() {
  const router = useRouter();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchRiders();
    fetchStats();
  }, []);

  const fetchRiders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/riders', {
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
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/riders/stats', {
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

  const handleStatusToggle = async (riderId: string, field: 'isActive' | 'isAvailable', currentValue: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/riders/${riderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: !currentValue })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRiders(riders.map(rider => 
            rider._id === riderId ? { ...rider, [field]: !currentValue } : rider
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

  const handleDeleteRider = async (riderId: string) => {
    if (!confirm('Are you sure you want to delete this rider? This will also remove their rider role.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/riders/${riderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRiders(riders.filter(rider => rider._id !== riderId));
          alert('Rider deleted successfully');
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete rider');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedRiders.length === 0) {
      alert('Please select at least one rider');
      return;
    }

    const actionMessages = {
      delete: `delete ${selectedRiders.length} riders`,
      updateStatus: `${value ? 'activate' : 'deactivate'} ${selectedRiders.length} riders`,
      updateAvailability: `${value ? 'make available' : 'make unavailable'} ${selectedRiders.length} riders`,
      updateVehicleType: `change vehicle type for ${selectedRiders.length} riders to "${value}"`
    };

    if (!confirm(`Are you sure you want to ${actionMessages[action as keyof typeof actionMessages] || action}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/riders/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          riderIds: selectedRiders, 
          action,
          value 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedRiders([]);
        fetchRiders();
        fetchStats();
      } else {
        alert(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleRiderSelection = (riderId: string) => {
    setSelectedRiders(prev =>
      prev.includes(riderId)
        ? prev.filter(id => id !== riderId)
        : [...prev, riderId]
    );
  };

  const selectAllRiders = () => {
    if (selectedRiders.length === filteredRiders.length) {
      setSelectedRiders([]);
    } else {
      setSelectedRiders(filteredRiders.map(r => r._id));
    }
  };

  const filteredRiders = riders.filter(rider => {
    if (filter !== 'all' && rider.vehicleType !== filter) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && !rider.isActive) return false;
      if (statusFilter === 'inactive' && rider.isActive) return false;
      if (statusFilter === 'available' && !rider.isAvailable) return false;
      if (statusFilter === 'unavailable' && rider.isAvailable) return false;
    }
    if (search) {
      const searchLower = search.toLowerCase();
      return rider.fullName.toLowerCase().includes(searchLower) ||
             rider.email.toLowerCase().includes(searchLower) ||
             rider.phoneNumber.includes(search) ||
             rider.vehicleRegistration.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'MOTORCYCLE': return '🏍️';
      case 'BICYCLE': return '🚲';
      case 'CAR': return '🚗';
      case 'VAN': return '🚐';
      default: return '🚚';
    }
  };

  const getStatusBadge = (isActive: boolean, isAvailable: boolean) => {
    if (isActive && isAvailable) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">🟢 Available</span>;
    }
    if (isActive && !isAvailable) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">🟡 Busy</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">🔴 Inactive</span>;
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
            <div className="text-sm text-muted">Total Riders</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalRiders}</div>
            <div className="text-xs text-muted mt-1">
              {stats.activeRiders} active
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Available</div>
            <div className="text-2xl font-bold text-secondary">{stats.availableRiders}</div>
            <div className="text-xs text-muted mt-1">
              {((stats.availableRiders / stats.totalRiders) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-accent-dark">
            <div className="text-sm text-muted">Total Deliveries</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalDeliveries.toLocaleString()}</div>
            <div className="text-xs text-muted mt-1">
              Avg: {(stats.totalDeliveries / stats.totalRiders || 0).toFixed(1)} per rider
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
            <div className="text-sm text-muted">Total Earned</div>
            <div className="text-2xl font-bold text-secondary">KSh {stats.earnings.totalEarned.toLocaleString()}</div>
            <div className="text-xs text-muted mt-1">
              Pending: KSh {stats.earnings.totalPendingPayout.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-sm text-muted">Avg Rating</div>
            <div className="text-2xl font-bold text-secondary">⭐ {stats.averageRating.toFixed(1)}</div>
            <div className="text-xs text-muted mt-1">
              {stats.vehicleTypes.map((v, i) => (
                <span key={v._id}>
                  {i > 0 && ', '}
                  {v._id}: {v.count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          🚚 Riders Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search riders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Vehicles</option>
            <option value="MOTORCYCLE">🏍️ Motorcycle</option>
            <option value="BICYCLE">🚲 Bicycle</option>
            <option value="CAR">🚗 Car</option>
            <option value="VAN">🚐 Van</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">✅ Active</option>
            <option value="inactive">❌ Inactive</option>
            <option value="available">🟢 Available</option>
            <option value="unavailable">🟡 Unavailable</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition"
          >
            + Add Rider
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRiders.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedRiders.length} rider{selectedRiders.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => handleBulkAction('delete')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Delete Selected
          </button>
          <select
            onChange={(e) => handleBulkAction('updateStatus', e.target.value === 'true')}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Status</option>
            <option value="true">Activate</option>
            <option value="false">Deactivate</option>
          </select>
          <select
            onChange={(e) => handleBulkAction('updateAvailability', e.target.value === 'true')}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Availability</option>
            <option value="true">Make Available</option>
            <option value="false">Make Unavailable</option>
          </select>
          <select
            onChange={(e) => handleBulkAction('updateVehicleType', e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Change Vehicle</option>
            <option value="MOTORCYCLE">🏍️ Motorcycle</option>
            <option value="BICYCLE">🚲 Bicycle</option>
            <option value="CAR">🚗 Car</option>
            <option value="VAN">🚐 Van</option>
          </select>
          <button
            onClick={() => setSelectedRiders([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Riders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllRiders}
                    checked={selectedRiders.length === filteredRiders.length && filteredRiders.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Rider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Performance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Earnings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredRiders.map((rider) => (
                <tr key={rider._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRiders.includes(rider._id)}
                      onChange={() => toggleRiderSelection(rider._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">{rider.fullName}</div>
                    <div className="text-sm text-muted">{rider.email}</div>
                    <div className="text-xs text-muted">
                      {rider.phoneNumber} • ID: {rider.nationalId}
                    </div>
                    <div className="text-xs text-muted">
                      Reg: {rider.vehicleRegistration}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-2xl">{getVehicleTypeIcon(rider.vehicleType)}</div>
                    <div className="text-sm font-medium text-secondary">{rider.vehicleType}</div>
                    <div className="text-xs text-muted">
                      {rider.deliveryRadius}km radius
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(rider.isActive, rider.isAvailable)}
                      <button
                        onClick={() => handleStatusToggle(rider._id, 'isActive', rider.isActive)}
                        className="text-xs text-primary hover:text-accent-dark transition text-left"
                      >
                        Toggle Active
                      </button>
                      <button
                        onClick={() => handleStatusToggle(rider._id, 'isAvailable', rider.isAvailable)}
                        className="text-xs text-primary hover:text-accent-dark transition text-left"
                      >
                        Toggle Available
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-secondary">
                        ⭐ {rider.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted">
                        {rider.totalDeliveries} deliveries
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-secondary">
                      KSh {rider.totalEarned.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">
                      Pending: KSh {rider.pendingPayout.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">
                      {rider.payoutMethod}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/admin/riders/${rider._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteRider(rider._id)}
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
        {filteredRiders.length === 0 && (
          <div className="text-center py-8 text-muted">
            No riders found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredRiders.length} of {riders.length} riders
          {search && ` (filtered from ${riders.length} total)`}
        </span>
        <span>
          {selectedRiders.length > 0 && `${selectedRiders.length} selected`}
        </span>
      </div>
    </div>
  );
}