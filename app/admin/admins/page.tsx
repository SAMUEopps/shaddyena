'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  UserPlus,
  MessageCircle,
  Activity,
  Settings,
  Crown,
  Key,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  BadgeCheck,
  Sparkles,
  Database,
  Server,
  Code,
  Terminal,
  Zap,
  BarChart3,
  Users,
  Globe,
  Monitor,
  Smartphone,
  ShieldCheck,
  Fingerprint,
  LockKeyhole,
  EyeOff
} from 'lucide-react';

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  referralCode: string;
  referralCount: number;
  createdAt: string;
  updatedAt: string;
  // Admin-specific fields
  adminStats?: {
    lastLogin: Date;
    loginCount: number;
    actionsPerformed: number;
    usersManaged: number;
    reportsReviewed: number;
    disputesResolved: number;
    permissions?: string[];
    roleLevel: 'super_admin' | 'admin' | 'moderator';
    department?: string;
  };
  permissions?: {
    manageUsers: boolean;
    manageVendors: boolean;
    manageOrders: boolean;
    manageProducts: boolean;
    managePayments: boolean;
    manageAnalytics: boolean;
    manageSettings: boolean;
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
  superAdmins: number;
  moderators: number;
  totalActions: number;
  totalUsersManaged: number;
}

export default function AdminsTab() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
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
  const [roleLevelFilter, setRoleLevelFilter] = useState('');
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    superAdmins: 0,
    moderators: 0,
    totalActions: 0,
    totalUsersManaged: 0
  });

  const fetchAdmins = async (page = 1) => {
    if (currentUser?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        role: 'admin',
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
        throw new Error('Failed to fetch admins');
      }
      
      const data = await response.json();
      setAdmins(data.users);
      setPagination(data.pagination);
      
      // Calculate stats
      calculateStats(data.users, data.pagination.total);
      
      setError('');
    } catch (err) {
      setError('Failed to load admins. Please try again.');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (adminsList: Admin[], total: number) => {
    const totalActions = adminsList.reduce((acc, a) => acc + (a.adminStats?.actionsPerformed || 0), 0);
    const totalUsersManaged = adminsList.reduce((acc, a) => acc + (a.adminStats?.usersManaged || 0), 0);
    
    setStats({
      total: total,
      active: adminsList.filter(a => a.isActive).length,
      inactive: adminsList.filter(a => !a.isActive).length,
      verified: adminsList.filter(a => a.isVerified).length,
      unverified: adminsList.filter(a => !a.isVerified).length,
      superAdmins: adminsList.filter(a => a.adminStats?.roleLevel === 'super_admin').length,
      moderators: adminsList.filter(a => a.adminStats?.roleLevel === 'moderator').length,
      totalActions: totalActions,
      totalUsersManaged: totalUsersManaged
    });
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAdmins();
    }
  }, [currentUser, search, statusFilter, verificationFilter]);

  const handleToggleActive = async (adminId: string, currentActive: boolean) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this admin?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${adminId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      
      if (response.ok) {
        setSuccessMessage(`Admin ${action}d successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchAdmins(pagination.page);
      } else {
        throw new Error('Failed to update admin status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update admin status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleVerify = async (adminId: string, currentVerified: boolean) => {
    const action = currentVerified ? 'unverify' : 'verify';
    if (!confirm(`Are you sure you want to ${action} this admin?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/users/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      
      if (response.ok) {
        setSuccessMessage(`Admin ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchAdmins(pagination.page);
      } else {
        throw new Error('Failed to update verification status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewDetails = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (admin: Admin) => {
    if (admin._id === currentUser?._id) {
      alert('You cannot delete your own account!');
      return;
    }
    setSelectedAdmin(admin);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/users/${selectedAdmin._id}/delete`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Admin deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchAdmins(pagination.page);
        setShowDeleteModal(false);
        setSelectedAdmin(null);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete admin');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete admin');
      console.error('Error deleting admin:', err);
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

  const getRoleLevelBadge = (level?: string) => {
    switch (level) {
      case 'super_admin':
        return { bg: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20', text: 'text-purple-600', icon: <Crown className="w-3 h-3" />, label: 'Super Admin' };
      case 'moderator':
        return { bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20', text: 'text-blue-600', icon: <Shield className="w-3 h-3" />, label: 'Moderator' };
      default:
        return { bg: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20', text: 'text-gray-600', icon: <ShieldCheck className="w-3 h-3" />, label: 'Admin' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString?: Date) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                <Shield className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Admin Management</h1>
                <p className="text-[var(--color-text-muted)]">Manage and monitor all system administrators</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchAdmins(pagination.page)}
                className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Add Admin</span>
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
              <Shield className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Admins</p>
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
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-purple-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Super Admins</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.superAdmins}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Full access</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Moderators</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.moderators}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Limited access</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-orange-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Actions</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalActions.toLocaleString()}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total performed</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-indigo-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Managed</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalUsersManaged.toLocaleString()}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Users managed</p>
          </div>
        </div>

        {/* Security Banner */}
        <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <LockKeyhole className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Security & Permissions</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Administrators have elevated access. Please manage permissions carefully.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-[var(--color-text-muted)]">{stats.active} Active</span>
              </div>
              <div className="w-px h-8 bg-[var(--color-border)]"></div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-[var(--color-text-muted)]">{stats.superAdmins} Super Admins</span>
              </div>
              <div className="w-px h-8 bg-[var(--color-border)]"></div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-[var(--color-text-muted)]">{stats.moderators} Moderators</span>
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
                placeholder="Search admins by name, email, or phone..."
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
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Role Level</label>
                <select
                  value={roleLevelFilter}
                  onChange={(e) => setRoleLevelFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All Levels</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setVerificationFilter('');
                    setRoleLevelFilter('');
                  }}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admins Grid */}
        {error && (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--color-text-muted)]">Loading administrators...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Shield className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">No administrators found matching your criteria.</p>
            <button className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all">
              Add Your First Admin
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {admins.map((admin) => {
                const statusBadge = getStatusBadge(admin.isActive);
                const verificationBadge = getVerificationBadge(admin.isVerified);
                const roleLevelBadge = getRoleLevelBadge(admin.adminStats?.roleLevel);
                const isCurrentUser = admin._id === currentUser?._id;
                
                return (
                  <div
                    key={admin._id}
                    className={`group bg-[var(--color-surface)] rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isCurrentUser 
                        ? 'border-[var(--color-primary)] shadow-lg ring-2 ring-[var(--color-primary)]/20' 
                        : 'border-[var(--color-border)] hover:shadow-xl hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {/* Admin Header */}
                    <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 pb-12">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </div>
                        {isCurrentUser && (
                          <div className="px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                            <Crown className="w-3 h-3" />
                            <span>You</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-[var(--color-surface)] shadow-lg overflow-hidden">
                          {admin.avatar ? (
                            <img
                              src={admin.avatar}
                              alt={`${admin.firstName} ${admin.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-12 p-4">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {admin.firstName} {admin.lastName}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${verificationBadge.bg} ${verificationBadge.text}`}>
                            {verificationBadge.icon}
                            <span>{verificationBadge.label}</span>
                          </div>
                          <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${roleLevelBadge.bg} ${roleLevelBadge.text}`}>
                            {roleLevelBadge.icon}
                            <span>{roleLevelBadge.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{admin.phone}</span>
                        </div>
                      </div>
                      
                      {/* Admin Stats */}
                      {admin.adminStats && (
                        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-[var(--color-background-soft)] rounded-xl">
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">{admin.adminStats.loginCount}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Logins</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-[var(--color-text)]">{admin.adminStats.actionsPerformed.toLocaleString()}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Actions</p>
                          </div>
                          <div className="text-center col-span-2 mt-1">
                            <p className="text-xs text-[var(--color-text-muted)]">Last login: {formatDateTime(admin.adminStats.lastLogin)}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Department */}
                      {admin.adminStats?.department && (
                        <div className="flex items-center justify-between text-sm mb-3 p-2 bg-purple-500/10 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <Database className="w-3 h-3 text-purple-600" />
                            <span className="text-purple-600 font-medium">{admin.adminStats.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[var(--color-text-muted)]" />
                            <span className="text-xs text-[var(--color-text-muted)]">Joined {formatDate(admin.createdAt)}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(admin)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(admin._id, admin.isActive)}
                            className={`p-2 transition-colors rounded-lg ${
                              admin.isActive 
                                ? 'text-red-500 hover:bg-red-500/10' 
                                : 'text-green-500 hover:bg-green-500/10'
                            }`}
                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {admin.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleVerify(admin._id, admin.isVerified)}
                            className={`p-2 transition-colors rounded-lg ${
                              admin.isVerified 
                                ? 'text-amber-500 hover:bg-amber-500/10' 
                                : 'text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={admin.isVerified ? 'Unverify' : 'Verify'}
                          >
                            {admin.isVerified ? <AlertCircle className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                          </button>
                          {!isCurrentUser && (
                            <button
                              onClick={() => handleDeleteClick(admin)}
                              className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
                Showing {admins.length} of {pagination.total} administrators
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchAdmins(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchAdmins(pagination.page + 1)}
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

      {/* Admin Details Modal */}
      {showDetailsModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-8">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 shadow-lg overflow-hidden">
                    {selectedAdmin.avatar ? (
                      <img
                        src={selectedAdmin.avatar}
                        alt={`${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {selectedAdmin.firstName.charAt(0)}{selectedAdmin.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedAdmin.firstName} {selectedAdmin.lastName}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>Administrator</span>
                      </div>
                      {selectedAdmin.adminStats?.department && (
                        <>
                          <span>•</span>
                          <span>{selectedAdmin.adminStats.department}</span>
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
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedAdmin.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAdmin.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{selectedAdmin.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className={`inline-flex items-center space-x-1 text-sm ${selectedAdmin.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedAdmin.isVerified ? <BadgeCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{selectedAdmin.isVerified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-3 text-center">
                    <div className="inline-flex items-center space-x-1 text-sm text-[var(--color-text)]">
                      <Award className="w-4 h-4" />
                      <span>Ref: {selectedAdmin.referralCount}</span>
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
                    <p><span className="text-[var(--color-text-muted)]">Full Name:</span> {selectedAdmin.firstName} {selectedAdmin.lastName}</p>
                    <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedAdmin.email}</p>
                    <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedAdmin.phone}</p>
                    <p><span className="text-[var(--color-text-muted)]">Joined:</span> {formatDate(selectedAdmin.createdAt)}</p>
                    <p><span className="text-[var(--color-text-muted)]">Referral Code:</span> <span className="font-mono">{selectedAdmin.referralCode}</span></p>
                  </div>
                </div>
                
                {/* Admin Statistics */}
                {selectedAdmin.adminStats && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Activity Statistics</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Total Logins</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedAdmin.adminStats.loginCount}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Actions Performed</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedAdmin.adminStats.actionsPerformed.toLocaleString()}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Users Managed</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedAdmin.adminStats.usersManaged.toLocaleString()}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3">
                        <p className="text-xs text-[var(--color-text-muted)]">Reports Reviewed</p>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{selectedAdmin.adminStats.reportsReviewed}</p>
                      </div>
                      <div className="bg-[var(--color-background-soft)] rounded-xl p-3 col-span-2">
                        <p className="text-xs text-[var(--color-text-muted)]">Last Login</p>
                        <p className="text-lg font-semibold text-[var(--color-text)]">{formatDateTime(selectedAdmin.adminStats.lastLogin)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Permissions */}
                {selectedAdmin.permissions && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <LockKeyhole className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Permissions</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${selectedAdmin.permissions.manageUsers ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[var(--color-text)]">Manage Users</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${selectedAdmin.permissions.manageVendors ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[var(--color-text)]">Manage Vendors</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${selectedAdmin.permissions.manageOrders ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[var(--color-text)]">Manage Orders</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${selectedAdmin.permissions.manageProducts ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[var(--color-text)]">Manage Products</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${selectedAdmin.permissions.managePayments ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[var(--color-text)]">Manage Payments</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`w-2 h-2 rounded-full ${selectedAdmin.permissions.manageAnalytics ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[var(--color-text)]">View Analytics</span>
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
                      window.location.href = `mailto:${selectedAdmin.email}`;
                    }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Delete Administrator</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">{selectedAdmin.firstName} {selectedAdmin.lastName}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-600">
                      <strong>Warning:</strong> This action cannot be undone. This administrator will lose all access to the system.
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
                      <span>Delete Admin</span>
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