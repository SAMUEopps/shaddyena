'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
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
  Heart,
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
  ShoppingCart,
  CreditCard,
  History,
  Smile,
  Coffee,
  Zap
} from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  referralCode: string;
  referralCount: number;
  createdAt: string;
  updatedAt: string;
  // Customer-specific fields (you may want to add these to your schema)
  customerStats?: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date;
    favoriteCategory?: string;
    loyaltyPoints: number;
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }[];
  preferences?: {
    newsletter: boolean;
    promotions: boolean;
    language: string;
    currency: string;
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
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  loyalCustomers: number;
  topSpenders: number;
}

export default function CustomersTab() {
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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
  const [loyaltyFilter, setLoyaltyFilter] = useState('');
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    loyalCustomers: 0,
    topSpenders: 0
  });

  const fetchCustomers = async (page = 1) => {
    if (currentUser?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        role: 'customer',
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
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      setCustomers(data.users);
      setPagination(data.pagination);
      
      // Calculate stats
      calculateStats(data.users, data.pagination.total);
      
      setError('');
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (customersList: Customer[], total: number) => {
    const totalSpent = customersList.reduce((acc, c) => acc + (c.customerStats?.totalSpent || 0), 0);
    const totalOrders = customersList.reduce((acc, c) => acc + (c.customerStats?.totalOrders || 0), 0);
    
    setStats({
      total: total,
      active: customersList.filter(c => c.isActive).length,
      inactive: customersList.filter(c => !c.isActive).length,
      verified: customersList.filter(c => c.isVerified).length,
      unverified: customersList.filter(c => !c.isVerified).length,
      totalOrders: totalOrders,
      totalSpent: totalSpent,
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
      loyalCustomers: customersList.filter(c => (c.customerStats?.totalOrders || 0) >= 10).length,
      topSpenders: customersList.filter(c => (c.customerStats?.totalSpent || 0) >= 50000).length
    });
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchCustomers();
    }
  }, [currentUser, search, statusFilter, verificationFilter]);

  const handleToggleActive = async (customerId: string, currentActive: boolean) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this customer?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${customerId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      
      if (response.ok) {
        setSuccessMessage(`Customer ${action}d successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCustomers(pagination.page);
      } else {
        throw new Error('Failed to update customer status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update customer status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleVerify = async (customerId: string, currentVerified: boolean) => {
    const action = currentVerified ? 'unverify' : 'verify';
    if (!confirm(`Are you sure you want to ${action} this customer?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      
      if (response.ok) {
        setSuccessMessage(`Customer ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCustomers(pagination.page);
      } else {
        throw new Error('Failed to update verification status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/users/${selectedCustomer._id}/delete`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Customer deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCustomers(pagination.page);
        setShowDeleteModal(false);
        setSelectedCustomer(null);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete customer');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete customer');
      console.error('Error deleting customer:', err);
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

  const getLoyaltyBadge = (tier?: string) => {
    switch (tier) {
      case 'platinum':
        return { bg: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20', text: 'text-purple-600', icon: <Crown className="w-3 h-3" />, label: 'Platinum' };
      case 'gold':
        return { bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20', text: 'text-yellow-600', icon: <Award className="w-3 h-3" />, label: 'Gold' };
      case 'silver':
        return { bg: 'bg-gradient-to-r from-gray-400/20 to-gray-500/20', text: 'text-gray-600', icon: <Star className="w-3 h-3" />, label: 'Silver' };
      default:
        return { bg: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20', text: 'text-orange-600', icon: <Sparkles className="w-3 h-3" />, label: 'Bronze' };
    }
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
                <Users className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Customer Management</h1>
                <p className="text-[var(--color-text-muted)]">Manage and monitor all customers on the platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchCustomers(pagination.page)}
                className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Add Customer</span>
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
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Customers</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.active}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active accounts</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.inactive}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Inactive accounts</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <BadgeCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Verified</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.verified}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Email verified</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Orders</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalOrders}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total orders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Spent</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(stats.totalSpent)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total spent</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-purple-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Loyal</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.loyalCustomers}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">10+ orders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-amber-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Avg Order</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(stats.averageOrderValue)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Average value</p>
          </div>
        </div>

        {/* Welcome Banner for New Customers Section */}
        <div className="mb-8 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
                <Coffee className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Customer Insights</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stats.total} customers • {stats.active} active • {stats.loyalCustomers} loyal customers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-[var(--color-text-muted)]">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">4.8/5</p>
              </div>
              <div className="w-px h-12 bg-[var(--color-border)]"></div>
              <div className="text-right">
                <p className="text-sm text-[var(--color-text-muted)]">Repeat Purchase Rate</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">67%</p>
              </div>
            </div>
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
                placeholder="Search customers by name, email, or phone..."
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
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Loyalty Tier</label>
                <select
                  value={loyaltyFilter}
                  onChange={(e) => setLoyaltyFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All Tiers</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setVerificationFilter('');
                    setLoyaltyFilter('');
                  }}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Customers Grid */}
        {error && (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--color-text-muted)]">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Users className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">No customers found matching your criteria.</p>
            <button className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all">
              Add Your First Customer
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {customers.map((customer) => {
                const statusBadge = getStatusBadge(customer.isActive);
                const verificationBadge = getVerificationBadge(customer.isVerified);
                const loyaltyBadge = getLoyaltyBadge(customer.customerStats?.loyaltyTier);
                
                return (
                  <div
                    key={customer._id}
                    className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    {/* Customer Header with Avatar */}
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
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={`${customer.firstName} ${customer.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-12 p-4">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${verificationBadge.bg} ${verificationBadge.text}`}>
                            {verificationBadge.icon}
                            <span>{verificationBadge.label}</span>
                          </div>
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${loyaltyBadge.bg} ${loyaltyBadge.text}`}>
                            {loyaltyBadge.icon}
                            <span>{loyaltyBadge.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                      
                      {/* Customer Stats */}
                      {customer.customerStats && (
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[var(--color-background-soft)] rounded-xl">
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">{customer.customerStats.totalOrders}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Orders</p>
                          </div>
                          <div className="text-center border-l border-r border-[var(--color-border)]">
                            <p className="text-lg font-bold text-[var(--color-text)]">{customer.customerStats.loyaltyPoints || 0}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Points</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">{formatCurrency(customer.customerStats.totalSpent || 0)}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Spent</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Referral Info */}
                      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-3 p-2 bg-[var(--color-background-soft)] rounded-lg">
                        <div className="flex items-center space-x-1">
                          <Gift className="w-3 h-3" />
                          <span>Referrals: {customer.referralCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Joined: {formatDate(customer.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(customer._id, customer.isActive)}
                            className={`p-2 transition-colors rounded-lg ${
                              customer.isActive 
                                ? 'text-red-500 hover:bg-red-500/10' 
                                : 'text-green-500 hover:bg-green-500/10'
                            }`}
                            title={customer.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {customer.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleVerify(customer._id, customer.isVerified)}
                            className={`p-2 transition-colors rounded-lg ${
                              customer.isVerified 
                                ? 'text-amber-500 hover:bg-amber-500/10' 
                                : 'text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={customer.isVerified ? 'Unverify' : 'Verify'}
                          >
                            {customer.isVerified ? <AlertCircle className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer)}
                            className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                            title="Delete Customer"
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
                Showing {customers.length} of {pagination.total} customers
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchCustomers(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchCustomers(pagination.page + 1)}
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

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
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
                    {selectedCustomer.avatar ? (
                      <img
                        src={selectedCustomer.avatar}
                        alt={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Customer</span>
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
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedCustomer.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedCustomer.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{selectedCustomer.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedCustomer.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedCustomer.isVerified ? <BadgeCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{selectedCustomer.isVerified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className="inline-flex items-center space-x-1 text-sm text-[var(--color-text)]">
                      <Gift className="w-4 h-4" />
                      <span>Ref: {selectedCustomer.referralCount}</span>
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
                    <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedCustomer.phone}</p>
                    <p><span className="text-[var(--color-text-muted)]">Joined:</span> {formatDate(selectedCustomer.createdAt)}</p>
                    <p><span className="text-[var(--color-text-muted)]">Referral Code:</span> <span className="font-mono">{selectedCustomer.referralCode}</span></p>
                  </div>
                </div>
                
                {/* Customer Stats */}
                {selectedCustomer.customerStats && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Shopping Statistics</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Orders</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedCustomer.customerStats.totalOrders}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Spent</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.customerStats.totalSpent)}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Avg Order Value</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(selectedCustomer.customerStats.averageOrderValue)}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Loyalty Points</p>
                        <p className="text-2xl font-bold text-purple-600">{selectedCustomer.customerStats.loyaltyPoints || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Address Information */}
                {selectedCustomer.address && selectedCustomer.address.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Saved Addresses</span>
                    </h3>
                    <div className="space-y-2">
                      {selectedCustomer.address.map((addr, idx) => (
                        <div key={idx} className="bg-[var(--color-background-soft)] rounded-xl p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-[var(--color-text)]">{addr.street}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">{addr.city}, {addr.state}, {addr.country} {addr.zipCode}</p>
                            </div>
                            {addr.isDefault && (
                              <span className="text-xs px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">Default</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Preferences */}
                {selectedCustomer.preferences && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Preferences</span>
                    </h3>
                    <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-[var(--color-text-muted)]">Newsletter:</span>
                          <span className="ml-2 text-[var(--color-text)]">{selectedCustomer.preferences.newsletter ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">Promotions:</span>
                          <span className="ml-2 text-[var(--color-text)]">{selectedCustomer.preferences.promotions ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">Language:</span>
                          <span className="ml-2 text-[var(--color-text)]">{selectedCustomer.preferences.language}</span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">Currency:</span>
                          <span className="ml-2 text-[var(--color-text)]">{selectedCustomer.preferences.currency}</span>
                        </div>
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
                      window.location.href = `mailto:${selectedCustomer.email}`;
                    }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Customer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Delete Customer</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-600">
                      <strong>Warning:</strong> This action cannot be undone. The customer's personal information will be anonymized.
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
                      <span>Delete Customer</span>
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