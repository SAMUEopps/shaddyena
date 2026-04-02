'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bike,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Users,
  Navigation,
  DollarSign,
  Package,
  TrendingUp,
  Edit,
  MoreVertical,
  UserPlus,
  MessageCircle,
  Activity,
  BarChart3,
  Settings,
  Truck,
  Zap,
  Verified,
  UserCheck,
  UserX,
  Route,
  Smartphone,
  CreditCard,
  History,
  BadgeCheck
} from 'lucide-react';

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'delivery';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  referralCode: string;
  referralCount: number;
  createdAt: string;
  updatedAt: string;
  // Delivery-specific fields (you may want to add these to your schema)
  deliveryStats?: {
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    averageRating: number;
    totalEarnings: number;
  };
  vehicleType?: 'bike' | 'motorcycle' | 'car' | 'van';
  vehiclePlate?: string;
  idNumber?: string;
  licenseNumber?: string;
  serviceRadius?: number; // in km
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    lastUpdated: Date;
  };
  availabilityStatus?: 'available' | 'busy' | 'offline' | 'on_break';
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface StatsData {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  available: number;
  busy: number;
  offline: number;
  totalDeliveries: number;
  avgRating: number;
}

export default function RidersTab() {
  const { user: currentUser } = useAuth();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Pagination and filter states
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    available: 0,
    busy: 0,
    offline: 0,
    totalDeliveries: 0,
    avgRating: 0
  });

  const fetchRiders = async (page = 1) => {
    if (currentUser?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        role: 'delivery',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (search) params.append('search', search);
      if (statusFilter === 'active') params.append('active', 'true');
      if (statusFilter === 'inactive') params.append('active', 'false');
      if (verificationFilter === 'verified') params.append('verified', 'true');
      if (verificationFilter === 'unverified') params.append('verified', 'false');
      
      const response = await fetch(`/api/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch riders');
      }
      
      const data = await response.json();
      setRiders(data.users);
      setPagination(data.pagination);
      
      // Calculate stats
      calculateStats(data.users, data.pagination.total);
      
      setError('');
    } catch (err) {
      setError('Failed to load riders. Please try again.');
      console.error('Error fetching riders:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ridersList: Rider[], total: number) => {
    setStats({
      total: total,
      active: ridersList.filter(r => r.isActive).length,
      inactive: ridersList.filter(r => !r.isActive).length,
      verified: ridersList.filter(r => r.isVerified).length,
      unverified: ridersList.filter(r => !r.isVerified).length,
      available: ridersList.filter(r => r.availabilityStatus === 'available').length,
      busy: ridersList.filter(r => r.availabilityStatus === 'busy').length,
      offline: ridersList.filter(r => r.availabilityStatus === 'offline').length,
      totalDeliveries: ridersList.reduce((acc, r) => acc + (r.deliveryStats?.completedDeliveries || 0), 0),
      avgRating: ridersList.reduce((acc, r) => acc + (r.deliveryStats?.averageRating || 0), 0) / (ridersList.length || 1)
    });
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchRiders();
    }
  }, [currentUser, search, statusFilter, verificationFilter]);

  const handleToggleActive = async (riderId: string, currentActive: boolean) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this rider?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${riderId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      
      if (response.ok) {
        setSuccessMessage(`Rider ${action}d successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchRiders(pagination.page);
      } else {
        throw new Error('Failed to update rider status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update rider status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleVerify = async (riderId: string, currentVerified: boolean) => {
    const action = currentVerified ? 'unverify' : 'verify';
    if (!confirm(`Are you sure you want to ${action} this rider?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${riderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      
      if (response.ok) {
        setSuccessMessage(`Rider ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchRiders(pagination.page);
      } else {
        throw new Error('Failed to update verification status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewDetails = (rider: Rider) => {
    setSelectedRider(rider);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (rider: Rider) => {
    setSelectedRider(rider);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedRider) return;
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/users/${selectedRider._id}/delete`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Rider deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchRiders(pagination.page);
        setShowDeleteModal(false);
        setSelectedRider(null);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete rider');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete rider');
      console.error('Error deleting rider:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return { bg: 'bg-green-500/10', text: 'text-green-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Active' };
    }
    return { bg: 'bg-red-500/10', text: 'text-red-600', icon: <XCircle className="w-3 h-3" />, label: 'Inactive' };
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: <BadgeCheck className="w-3 h-3" />, label: 'Verified' };
    }
    return { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: <AlertCircle className="w-3 h-3" />, label: 'Unverified' };
  };

  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return { bg: 'bg-green-500/10', text: 'text-green-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Available' };
      case 'busy':
        return { bg: 'bg-orange-500/10', text: 'text-orange-600', icon: <Activity className="w-3 h-3" />, label: 'Busy' };
      case 'on_break':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-600', icon: <Clock className="w-3 h-3" />, label: 'On Break' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', icon: <XCircle className="w-3 h-3" />, label: 'Offline' };
    }
  };

  const getVehicleIcon = (type?: string) => {
    switch (type) {
      case 'bike':
        return <Bike className="w-4 h-4" />;
      case 'motorcycle':
        return <Bike className="w-4 h-4" />;
      case 'car':
        return <Truck className="w-4 h-4" />;
      case 'van':
        return <Truck className="w-4 h-4" />;
      default:
        return <Bike className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h2>
          <p className="text-[var(--color-text-muted)]">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl animate-bounce-subtle">
                <Bike className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Rider Management</h1>
                <p className="text-[var(--color-text-muted)]">Manage and monitor all delivery riders on the platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchRiders(pagination.page)}
                className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Add Rider</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Riders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.active}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active riders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.inactive}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Inactive riders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <BadgeCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Verified</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.verified}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Verified riders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Available</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.available}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Ready to ride</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-orange-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Busy</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.busy}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">On delivery</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Deliveries</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalDeliveries}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total completed</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-yellow-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Rating</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.avgRating.toFixed(1)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Average rating</p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search riders by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
            >
              <Filter className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text)]">Filters</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--color-border)] animate-slide-in">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Verification</label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setVerificationFilter('');
                    setAvailabilityFilter('');
                  }}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Riders Grid */}
        {error && (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--color-text-muted)]">Loading riders...</p>
          </div>
        ) : riders.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Bike className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">No riders found matching your criteria.</p>
            <button className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all">
              Add Your First Rider
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {riders.map((rider) => {
                const statusBadge = getStatusBadge(rider.isActive);
                const verificationBadge = getVerificationBadge(rider.isVerified);
                const availabilityBadge = getAvailabilityBadge(rider.availabilityStatus);
                
                return (
                  <div
                    key={rider._id}
                    className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    {/* Rider Header with Avatar */}
                    <div className="relative bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20 p-6 pb-12">
                      <div className="flex justify-end mb-2">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </div>
                      </div>
                      
                      {/* Avatar */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] border-4 border-[var(--color-surface)] shadow-lg overflow-hidden">
                          {rider.avatar ? (
                            <img
                              src={rider.avatar}
                              alt={`${rider.firstName} ${rider.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {rider.firstName.charAt(0)}{rider.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-12 p-4">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {rider.firstName} {rider.lastName}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${verificationBadge.bg} ${verificationBadge.text}`}>
                            {verificationBadge.icon}
                            <span>{verificationBadge.label}</span>
                          </div>
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${availabilityBadge.bg} ${availabilityBadge.text}`}>
                            {availabilityBadge.icon}
                            <span>{availabilityBadge.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{rider.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{rider.phone}</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      {rider.deliveryStats && (
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[var(--color-background-soft)] rounded-xl">
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">{rider.deliveryStats.completedDeliveries}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Deliveries</p>
                          </div>
                          <div className="text-center border-l border-r border-[var(--color-border)]">
                            <p className="text-lg font-bold text-[var(--color-text)]">{rider.deliveryStats.averageRating.toFixed(1)}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">KES {rider.deliveryStats.totalEarnings.toLocaleString()}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Earnings</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Vehicle Info */}
                      {rider.vehicleType && (
                        <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)] mb-3">
                          {getVehicleIcon(rider.vehicleType)}
                          <span className="capitalize">{rider.vehicleType}</span>
                          {rider.vehiclePlate && (
                            <>
                              <span>•</span>
                              <span>{rider.vehiclePlate}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(rider)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(rider._id, rider.isActive)}
                            className={`p-2 transition-colors rounded-lg ${
                              rider.isActive 
                                ? 'text-red-500 hover:bg-red-500/10' 
                                : 'text-green-500 hover:bg-green-500/10'
                            }`}
                            title={rider.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {rider.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleVerify(rider._id, rider.isVerified)}
                            className={`p-2 transition-colors rounded-lg ${
                              rider.isVerified 
                                ? 'text-amber-500 hover:bg-amber-500/10' 
                                : 'text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={rider.isVerified ? 'Unverify' : 'Verify'}
                          >
                            {rider.isVerified ? <AlertCircle className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(rider)}
                            className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                            title="Delete Rider"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)] flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(rider.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {riders.length} of {pagination.total} riders
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchRiders(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchRiders(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rider Details Modal */}
      {showDetailsModal && selectedRider && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] px-6 py-8">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 shadow-lg overflow-hidden">
                    {selectedRider.avatar ? (
                      <img
                        src={selectedRider.avatar}
                        alt={`${selectedRider.firstName} ${selectedRider.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {selectedRider.firstName.charAt(0)}{selectedRider.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedRider.firstName} {selectedRider.lastName}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Bike className="w-4 h-4" />
                        <span>Delivery Rider</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                {/* Status Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedRider.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedRider.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{selectedRider.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedRider.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedRider.isVerified ? <BadgeCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{selectedRider.isVerified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className="inline-flex items-center space-x-1 text-sm text-[var(--color-text)]">
                      <Users className="w-4 h-4" />
                      <span>Ref: {selectedRider.referralCount}</span>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Contact Information</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedRider.email}</p>
                    <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedRider.phone}</p>
                    <p><span className="text-[var(--color-text-muted)]">Joined:</span> {formatDate(selectedRider.createdAt)}</p>
                    <p><span className="text-[var(--color-text-muted)]">Referral Code:</span> <span className="font-mono">{selectedRider.referralCode}</span></p>
                  </div>
                </div>
                
                {/* Delivery Stats */}
                {selectedRider.deliveryStats && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Package className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Delivery Statistics</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Deliveries</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedRider.deliveryStats.totalDeliveries}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{selectedRider.deliveryStats.completedDeliveries}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Average Rating</p>
                        <p className="text-2xl font-bold text-yellow-600">{selectedRider.deliveryStats.averageRating.toFixed(1)}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">KES {selectedRider.deliveryStats.totalEarnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Vehicle Information */}
                {(selectedRider.vehicleType || selectedRider.vehiclePlate) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Vehicle Information</span>
                    </h3>
                    <div className="bg-[var(--color-background-soft)] rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[var(--color-text-muted)]">Vehicle Type</p>
                          <p className="font-medium text-[var(--color-text)] capitalize">{selectedRider.vehicleType || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--color-text-muted)]">Plate Number</p>
                          <p className="font-medium text-[var(--color-text)]">{selectedRider.vehiclePlate || 'Not specified'}</p>
                        </div>
                        {selectedRider.serviceRadius && (
                          <div>
                            <p className="text-xs text-[var(--color-text-muted)]">Service Radius</p>
                            <p className="font-medium text-[var(--color-text)]">{selectedRider.serviceRadius} km</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `mailto:${selectedRider.email}`;
                    }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Rider</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRider && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Delete Rider</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">{selectedRider.firstName} {selectedRider.lastName}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-600">
                      <strong>Warning:</strong> This action cannot be undone. The rider's personal information will be anonymized.
                    </p>
                  </div>
                  {deleteError && (
                    <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                      <p className="text-sm text-red-600">{deleteError}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-[var(--color-background-soft)] flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background)] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Rider</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}