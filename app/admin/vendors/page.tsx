'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Store,
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
  ShoppingBag,
  TrendingUp,
  UserPlus,
  MessageCircle,
  Activity,
  BarChart3,
  Settings,
  Crown,
  Gift,
  Package,
  DollarSign,
  UserCheck,
  UserX,
  BadgeCheck,
  Sparkles,
  Briefcase,
  Building2,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Truck,
  CreditCard,
  History,
  Zap,
  Verified,
  Users,
  Heart,
  PieChart
} from 'lucide-react';

interface Vendor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'vendor';
  avatar?: string;
  businessName?: string;
  businessType?: string;
  businessDocuments?: string[];
  mpesaNumber?: string;
  isVerified: boolean;
  isActive: boolean;
  hasPendingVendorRequest: boolean;
  referralCode: string;
  referralCount: number;
  createdAt: string;
  updatedAt: string;
  // Vendor-specific fields
  vendorStats?: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    completionRate: number;
    responseTime: string;
    topCategories?: string[];
  };
  shop?: {
    _id: string;
    businessName: string;
    isActive: boolean;
    isVerified: boolean;
    location?: {
      city: string;
      country: string;
    };
  };
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
  pending: number;
  totalProducts: number;
  totalRevenue: number;
  averageRating: number;
  topPerforming: number;
}

export default function VendorsTab() {
  const { user: currentUser } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
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
  const [pendingFilter, setPendingFilter] = useState('');
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    pending: 0,
    totalProducts: 0,
    totalRevenue: 0,
    averageRating: 0,
    topPerforming: 0
  });

  const fetchVendors = async (page = 1) => {
    if (currentUser?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        role: 'vendor',
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
        throw new Error('Failed to fetch vendors');
      }
      
      const data = await response.json();
      
      // For each vendor, fetch their shop info
      const vendorsWithShops = await Promise.all(
        data.users.map(async (vendor: Vendor) => {
          try {
            const shopResponse = await fetch(`/api/shops/vendor/${vendor._id}`);
            if (shopResponse.ok) {
              const shopData = await shopResponse.json();
              return { ...vendor, shop: shopData.shop };
            }
          } catch (err) {
            console.error(`Failed to fetch shop for vendor ${vendor._id}:`, err);
          }
          return vendor;
        })
      );
      
      setVendors(vendorsWithShops);
      setPagination(data.pagination);
      
      // Calculate stats
      calculateStats(vendorsWithShops, data.pagination.total);
      
      setError('');
    } catch (err) {
      setError('Failed to load vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vendorsList: Vendor[], total: number) => {
    const totalRevenue = vendorsList.reduce((acc, v) => acc + (v.vendorStats?.totalRevenue || 0), 0);
    const totalProducts = vendorsList.reduce((acc, v) => acc + (v.vendorStats?.totalProducts || 0), 0);
    
    setStats({
      total: total,
      active: vendorsList.filter(v => v.isActive).length,
      inactive: vendorsList.filter(v => !v.isActive).length,
      verified: vendorsList.filter(v => v.isVerified).length,
      unverified: vendorsList.filter(v => !v.isVerified).length,
      pending: vendorsList.filter(v => v.hasPendingVendorRequest).length,
      totalProducts: totalProducts,
      totalRevenue: totalRevenue,
      averageRating: vendorsList.reduce((acc, v) => acc + (v.vendorStats?.averageRating || 0), 0) / (vendorsList.length || 1),
      topPerforming: vendorsList.filter(v => (v.vendorStats?.totalRevenue || 0) >= 100000).length
    });
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchVendors();
    }
  }, [currentUser, search, statusFilter, verificationFilter]);

  const handleToggleActive = async (vendorId: string, currentActive: boolean) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this vendor?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${vendorId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      
      if (response.ok) {
        setSuccessMessage(`Vendor ${action}d successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchVendors(pagination.page);
      } else {
        throw new Error('Failed to update vendor status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update vendor status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleVerify = async (vendorId: string, currentVerified: boolean) => {
    const action = currentVerified ? 'unverify' : 'verify';
    if (!confirm(`Are you sure you want to ${action} this vendor?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      
      if (response.ok) {
        setSuccessMessage(`Vendor ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchVendors(pagination.page);
      } else {
        throw new Error('Failed to update verification status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleApproveVendor = async (vendorId: string) => {
    if (!confirm('Approve this vendor\'s request to become a seller?')) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          hasPendingVendorRequest: false,
          role: 'vendor',
          isVerified: true
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Vendor request approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchVendors(pagination.page);
      } else {
        throw new Error('Failed to approve vendor request');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to approve vendor request');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedVendor) return;
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/users/${selectedVendor._id}/delete`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Vendor deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchVendors(pagination.page);
        setShowDeleteModal(false);
        setSelectedVendor(null);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete vendor');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete vendor');
      console.error('Error deleting vendor:', err);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
                <Store className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Vendor Management</h1>
                <p className="text-[var(--color-text-muted)]">Manage and monitor all vendors on the platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchVendors(pagination.page)}
                className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Add Vendor</span>
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
              <Store className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Vendors</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.active}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active stores</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.inactive}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Inactive stores</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <BadgeCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Verified</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.verified}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Verified vendors</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-amber-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Pending</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.pending}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Approval needed</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Products</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalProducts}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total products</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total revenue</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-yellow-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Rating</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.averageRating.toFixed(1)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Average rating</p>
          </div>
        </div>

        {/* Pending Approval Banner */}
        {stats.pending > 0 && (
          <div className="mb-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">Pending Vendor Approvals</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {stats.pending} vendor{stats.pending !== 1 ? 's' : ''} waiting for approval
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPendingFilter('pending');
                  setStatusFilter('');
                  setVerificationFilter('');
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all"
              >
                Review Pending Requests
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search vendors by name, business name, email, or phone..."
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
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Request Status</label>
                <select
                  value={pendingFilter}
                  onChange={(e) => setPendingFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setVerificationFilter('');
                    setPendingFilter('');
                  }}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vendors Grid */}
        {error && (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--color-text-muted)]">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Store className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">No vendors found matching your criteria.</p>
            <button className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all">
              Add Your First Vendor
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor) => {
                const statusBadge = getStatusBadge(vendor.isActive);
                const verificationBadge = getVerificationBadge(vendor.isVerified);
                
                return (
                  <div
                    key={vendor._id}
                    className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    {/* Vendor Header */}
                    <div className="relative bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20 p-6 pb-12">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </div>
                        {vendor.hasPendingVendorRequest && (
                          <div className="px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md bg-amber-500/20 text-amber-600">
                            <Clock className="w-3 h-3" />
                            <span>Pending Approval</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] border-4 border-[var(--color-surface)] shadow-lg overflow-hidden">
                          {vendor.avatar ? (
                            <img
                              src={vendor.avatar}
                              alt={`${vendor.firstName} ${vendor.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {vendor.firstName.charAt(0)}{vendor.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-12 p-4">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {vendor.businessName || `${vendor.firstName} ${vendor.lastName}`}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${verificationBadge.bg} ${verificationBadge.text}`}>
                            {verificationBadge.icon}
                            <span>{verificationBadge.label}</span>
                          </div>
                          {vendor.businessType && (
                            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-600">
                              <Briefcase className="w-3 h-3" />
                              <span>{vendor.businessType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{vendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                      
                      {/* Shop Location */}
                      {vendor.shop?.location && (
                        <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)] mb-3 p-2 bg-[var(--color-background-soft)] rounded-lg">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span>{vendor.shop.location.city}, {vendor.shop.location.country}</span>
                        </div>
                      )}
                      
                      {/* Vendor Stats */}
                      {vendor.vendorStats && (
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[var(--color-background-soft)] rounded-xl">
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">{vendor.vendorStats.totalProducts}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Products</p>
                          </div>
                          <div className="text-center border-l border-r border-[var(--color-border)]">
                            <p className="text-lg font-bold text-[var(--color-text)]">{vendor.vendorStats.totalOrders}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Orders</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-0.5">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <p className="text-lg font-bold text-[var(--color-text)]">{vendor.vendorStats.averageRating.toFixed(1)}</p>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">Rating</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Revenue */}
                      {vendor.vendorStats && (
                        <div className="flex items-center justify-between text-sm mb-3 p-2 bg-green-500/10 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 font-medium">{formatCurrency(vendor.vendorStats.totalRevenue)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[var(--color-text-muted)]" />
                            <span className="text-xs text-[var(--color-text-muted)]">Joined {formatDate(vendor.createdAt)}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(vendor)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(vendor._id, vendor.isActive)}
                            className={`p-2 transition-colors rounded-lg ${
                              vendor.isActive 
                                ? 'text-red-500 hover:bg-red-500/10' 
                                : 'text-green-500 hover:bg-green-500/10'
                            }`}
                            title={vendor.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {vendor.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleVerify(vendor._id, vendor.isVerified)}
                            className={`p-2 transition-colors rounded-lg ${
                              vendor.isVerified 
                                ? 'text-amber-500 hover:bg-amber-500/10' 
                                : 'text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={vendor.isVerified ? 'Unverify' : 'Verify'}
                          >
                            {vendor.isVerified ? <AlertCircle className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                          </button>
                          {vendor.hasPendingVendorRequest && (
                            <button
                              onClick={() => handleApproveVendor(vendor._id)}
                              className="p-2 text-green-500 hover:bg-green-500/10 transition-colors rounded-lg"
                              title="Approve Vendor"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(vendor)}
                            className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                            title="Delete Vendor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {vendors.length} of {pagination.total} vendors
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchVendors(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchVendors(pagination.page + 1)}
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

      {/* Vendor Details Modal */}
      {showDetailsModal && selectedVendor && (
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
                    {selectedVendor.avatar ? (
                      <img
                        src={selectedVendor.avatar}
                        alt={`${selectedVendor.firstName} ${selectedVendor.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {selectedVendor.firstName.charAt(0)}{selectedVendor.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedVendor.businessName || `${selectedVendor.firstName} ${selectedVendor.lastName}`}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Store className="w-4 h-4" />
                        <span>Vendor</span>
                      </div>
                      {selectedVendor.businessType && (
                        <>
                          <span>•</span>
                          <span>{selectedVendor.businessType}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                {/* Status Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedVendor.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedVendor.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{selectedVendor.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedVendor.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedVendor.isVerified ? <BadgeCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{selectedVendor.isVerified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className="inline-flex items-center space-x-1 text-sm text-[var(--color-text)]">
                      <Gift className="w-4 h-4" />
                      <span>Ref: {selectedVendor.referralCount}</span>
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
                    <p><span className="text-[var(--color-text-muted)]">Name:</span> {selectedVendor.firstName} {selectedVendor.lastName}</p>
                    <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedVendor.email}</p>
                    <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedVendor.phone}</p>
                    {selectedVendor.mpesaNumber && (
                      <p><span className="text-[var(--color-text-muted)]">M-Pesa Number:</span> {selectedVendor.mpesaNumber}</p>
                    )}
                    <p><span className="text-[var(--color-text-muted)]">Joined:</span> {formatDate(selectedVendor.createdAt)}</p>
                    <p><span className="text-[var(--color-text-muted)]">Referral Code:</span> <span className="font-mono">{selectedVendor.referralCode}</span></p>
                  </div>
                </div>
                
                {/* Business Information */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Business Information</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[var(--color-text-muted)]">Business Name:</span> {selectedVendor.businessName || 'Not specified'}</p>
                    <p><span className="text-[var(--color-text-muted)]">Business Type:</span> {selectedVendor.businessType || 'Not specified'}</p>
                    {selectedVendor.shop && (
                      <>
                        <p><span className="text-[var(--color-text-muted)]">Shop Location:</span> {selectedVendor.shop.location?.city}, {selectedVendor.shop.location?.country}</p>
                        <p><span className="text-[var(--color-text-muted)]">Shop Status:</span> {selectedVendor.shop.isActive ? 'Active' : 'Inactive'}</p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Vendor Stats */}
                {selectedVendor.vendorStats && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Performance Statistics</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Products</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedVendor.vendorStats.totalProducts}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Orders</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedVendor.vendorStats.totalOrders}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedVendor.vendorStats.totalRevenue)}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Average Rating</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <p className="text-2xl font-bold text-[var(--color-text)]">{selectedVendor.vendorStats.averageRating.toFixed(1)}</p>
                        </div>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Completion Rate</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedVendor.vendorStats.completionRate}%</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Response Time</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedVendor.vendorStats.responseTime}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Business Documents */}
                {selectedVendor.businessDocuments && selectedVendor.businessDocuments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Business Documents</span>
                    </h3>
                    <div className="space-y-2">
                      {selectedVendor.businessDocuments.map((doc, idx) => (
                        <div key={idx} className="bg-[var(--color-background-soft)] rounded-lg p-2 flex items-center justify-between">
                          <span className="text-sm text-[var(--color-text)]">Document {idx + 1}</span>
                          <button className="text-[var(--color-primary)] hover:underline text-sm">View</button>
                        </div>
                      ))}
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
                  {selectedVendor.shop && (
                    <button
                      onClick={() => {
                        window.open(`/shop/${selectedVendor.shop?._id}`, '_blank');
                      }}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center space-x-2"
                    >
                      <Store className="w-4 h-4" />
                      <span>View Shop</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      window.location.href = `mailto:${selectedVendor.email}`;
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Vendor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Delete Vendor</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">{selectedVendor.businessName || selectedVendor.firstName + ' ' + selectedVendor.lastName}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-600">
                      <strong>Warning:</strong> This action cannot be undone. All products and shop data associated with this vendor will be permanently deleted.
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
                      <span>Delete Vendor</span>
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

// Add FileText icon import if not present
const FileText = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);