'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Settings,
  UserPlus,
  ArrowLeft,
  Briefcase,
  ShoppingBag,
  Truck,
  Crown,
  Activity,
  BarChart3,
  TrendingUp,
  UserCircle,
  Zap
} from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
  businessName?: string;
  businessType?: string;
  isVerified: boolean;
  isActive: boolean;
  referralCode: string;
  referralCount: number;
  hasPendingVendorRequest: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
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
  customers: number;
  vendors: number;
  admins: number;
  delivery: number;
  pendingVendors: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
}

export default function UsersTab() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination and filter states
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    customers: 0,
    vendors: 0,
    admins: 0,
    delivery: 0,
    pendingVendors: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0
  });

  const fetchUsers = async (page = 1) => {
    if (currentUser?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter === 'active') params.append('active', 'true');
      if (statusFilter === 'inactive') params.append('active', 'false');
      if (verificationFilter === 'verified') params.append('verified', 'true');
      if (verificationFilter === 'unverified') params.append('verified', 'false');
      
      const response = await fetch(`/api/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
      
      // Calculate stats from fetched users or from separate API
      calculateStats(data.users);
      
      setError('');
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersList: User[]) => {
    setStats({
      total: pagination.total,
      customers: usersList.filter(u => u.role === 'customer').length,
      vendors: usersList.filter(u => u.role === 'vendor').length,
      admins: usersList.filter(u => u.role === 'admin').length,
      delivery: usersList.filter(u => u.role === 'delivery').length,
      pendingVendors: usersList.filter(u => u.hasPendingVendorRequest).length,
      activeUsers: usersList.filter(u => u.isActive).length,
      inactiveUsers: usersList.filter(u => !u.isActive).length,
      verifiedUsers: usersList.filter(u => u.isVerified).length
    });
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser, search, roleFilter, statusFilter, verificationFilter, sortBy, sortOrder]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSelectedUser(users.find(u => u._id === userId) || null);
    setSelectedRole(newRole);
    setShowRoleModal(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;
    
    setUpdatingRole(true);
    
    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(`Role updated to ${selectedRole} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchUsers(pagination.page);
        setShowRoleModal(false);
        setSelectedUser(null);
      } else {
        throw new Error(data.error || 'Failed to update role');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
      console.error('Error updating role:', err);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      const response = await fetch(`/api/users/${userId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(`User ${action}d successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchUsers(pagination.page);
      } else {
        throw new Error(data.error || 'Failed to update user status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  const handleToggleVerify = async (userId: string, currentVerified: boolean) => {
    const action = currentVerified ? 'unverify' : 'verify';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(`User ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchUsers(pagination.page);
      } else {
        throw new Error(data.error || 'Failed to update verification status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
      console.error('Error updating verification status:', err);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/users/${selectedUser._id}/delete`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('User deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchUsers(pagination.page);
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadgeConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-gradient-to-r from-purple-500/10 to-purple-600/10', text: 'text-purple-600', border: 'border-purple-200', icon: <Shield className="w-3 h-3" /> };
      case 'vendor':
        return { bg: 'bg-gradient-to-r from-blue-500/10 to-blue-600/10', text: 'text-blue-600', border: 'border-blue-200', icon: <Briefcase className="w-3 h-3" /> };
      case 'delivery':
        return { bg: 'bg-gradient-to-r from-orange-500/10 to-orange-600/10', text: 'text-orange-600', border: 'border-orange-200', icon: <Truck className="w-3 h-3" /> };
      default:
        return { bg: 'bg-gradient-to-r from-gray-500/10 to-gray-600/10', text: 'text-gray-600', border: 'border-gray-200', icon: <UserCircle className="w-3 h-3" /> };
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
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Verified' };
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
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl">
                <Users className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">User Management</h1>
                <p className="text-[var(--color-text-muted)]">Manage and monitor all users on the platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchUsers(pagination.page)}
                className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Add User</span>
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
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Users</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Customers</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.customers}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active buyers</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Vendors</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.vendors}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Sellers</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-purple-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Admins</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.admins}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Staff</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-orange-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Delivery</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.delivery}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Riders</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-amber-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Pending</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.pendingVendors}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Vendor requests</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.activeUsers}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active accounts</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-indigo-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Verified</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.verifiedUsers}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Email verified</p>
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
                placeholder="Search by name, email, phone, or business..."
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
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              
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
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  >
                    <option value="createdAt">Date Joined</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="email">Email</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all"
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          {error && (
            <div className="p-4 bg-red-500/10 border-l-4 border-red-500 m-4 rounded">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              <p className="mt-4 text-[var(--color-text-muted)]">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Users className="w-12 h-12 text-[var(--color-primary)]" />
              </div>
              <p className="text-[var(--color-text-muted)]">No users found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Role & Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Referrals</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {users.map((user) => {
                      const roleBadge = getRoleBadgeConfig(user.role);
                      const statusBadge = getStatusBadge(user.isActive);
                      const verificationBadge = getVerificationBadge(user.isVerified);
                      
                      return (
                        <tr key={user._id} className={`hover:bg-[var(--color-background-soft)] transition-colors ${!user.isActive ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full flex items-center justify-center text-white font-bold">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-[var(--color-text)]">
                                  {user.firstName} {user.lastName}
                                </p>
                                {user.businessName && (
                                  <p className="text-xs text-[var(--color-text-muted)]">{user.businessName}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm text-[var(--color-text)]">
                                <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-[var(--color-text)]">
                                <Phone className="w-4 h-4 text-[var(--color-text-muted)]" />
                                <span>{user.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text} border ${roleBadge.border}`}>
                                  {roleBadge.icon}
                                  <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                                </span>
                                {user.hasPendingVendorRequest && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    <span>Pending</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                  {statusBadge.icon}
                                  <span>{statusBadge.label}</span>
                                </span>
                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${verificationBadge.bg} ${verificationBadge.text}`}>
                                  {verificationBadge.icon}
                                  <span>{verificationBadge.label}</span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-[var(--color-primary)]" />
                              <span className="text-sm font-mono text-[var(--color-text)]">{user.referralCode}</span>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{user.referralCount} referrals</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2 text-sm text-[var(--color-text)]">
                              <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                              <span>{formatDate(user.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'customer' : user.role === 'customer' ? 'vendor' : 'customer')}
                                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                                title="Change Role"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleActive(user._id, user.isActive)}
                                className={`p-2 transition-colors rounded-lg ${
                                  user.isActive 
                                    ? 'text-red-500 hover:bg-red-500/10' 
                                    : 'text-green-500 hover:bg-green-500/10'
                                }`}
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleToggleVerify(user._id, user.isVerified)}
                                className={`p-2 transition-colors rounded-lg ${
                                  user.isVerified 
                                    ? 'text-amber-500 hover:bg-amber-500/10' 
                                    : 'text-emerald-500 hover:bg-emerald-500/10'
                                }`}
                                title={user.isVerified ? 'Unverify' : 'Verify'}
                              >
                                {user.isVerified ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                disabled={user._id === currentUser?._id}
                                className={`p-2 transition-colors rounded-lg ${
                                  user._id === currentUser?._id
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-500 hover:bg-red-500/10'
                                }`}
                                title={user._id === currentUser?._id ? 'Cannot delete yourself' : 'Delete User'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchUsers(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchUsers(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          pagination.page === pageNum
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => fetchUsers(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Delete User</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">{selectedUser.firstName} {selectedUser.lastName}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-600">
                      <strong>Warning:</strong> This action cannot be undone. The user's personal information will be anonymized.
                      {selectedUser.role === 'vendor' && ' Any products associated with this vendor will need to be transferred.'}
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
                      <span>Delete User</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !updatingRole && setShowRoleModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-[var(--color-primary)]/10 mb-4">
                  <Shield className="h-7 w-7 text-[var(--color-primary)]" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Change User Role</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to change <span className="font-semibold text-[var(--color-text)]">{selectedUser.firstName} {selectedUser.lastName}</span>'s role to{' '}
                    <span className="font-semibold text-[var(--color-primary)]">{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-sm text-amber-600">
                      Changing a user's role may affect their permissions and access to platform features.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-[var(--color-background-soft)] flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  disabled={updatingRole}
                  className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background)] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRoleChange}
                  disabled={updatingRole}
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {updatingRole ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Change</span>
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