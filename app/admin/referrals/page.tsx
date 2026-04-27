// app/admin/users-referrals/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  DollarSign,
  TrendingUp,
  Gift,
  Copy,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Award,
  Crown,
  Star,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Shield,
  Zap,
  BarChart3,
  Wallet,
  Target,
  Sparkles,
  Heart,
  XCircle
} from 'lucide-react';

// Types
interface ReferredUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  isVerified: boolean;
}

interface UserWithReferrals {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  referralCode: string;
  referralCount: number;
  referredBy?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  referredUsers: ReferredUser[];
  totalEarningsFromReferrals?: number;
  pendingWithdrawals?: number;
  completedWithdrawals?: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilterOptions {
  role: string;
  isActive: string;
  isVerified: string;
  minReferrals: string;
  search: string;
}

interface Summary {
  totalUsers: number;
  totalReferrals: number;
  topReferrer: UserWithReferrals | null;
  totalEarnings: number;
  avgReferralsPerUser: number;
}

export default function AdminUsersReferralsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithReferrals[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [filters, setFilters] = useState<FilterOptions>({
    role: 'all',
    isActive: 'all',
    isVerified: 'all',
    minReferrals: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithReferrals | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState<Summary>({
    totalUsers: 0,
    totalReferrals: 0,
    topReferrer: null,
    totalEarnings: 0,
    avgReferralsPerUser: 0
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
    if (user && user.role === 'admin') {
      fetchUsers();
      fetchSummary();
    }
  }, [user, authLoading, pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      if (filters.role !== "all") params.append("role", filters.role);
      if (filters.isActive !== "all")
        params.append("isActive", String(filters.isActive === "true"));
      if (filters.isVerified !== "all")
        params.append("isVerified", String(filters.isVerified === "true"));
      if (filters.minReferrals !== "all")
        params.append("minReferrals", filters.minReferrals);
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(`/api/admin/users-referrals?${params}`);

      if (!res.ok) {
        toast.error("Failed to fetch users");
        return;
      }

      const data = await res.json();

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/admin/users-referrals/summary');
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/admin/users-referrals/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-referrals-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Data exported successfully');
      } else {
        toast.error('Failed to export data');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-500/10 text-purple-500',
      vendor: 'bg-blue-500/10 text-blue-500',
      customer: 'bg-green-500/10 text-green-500',
      delivery: 'bg-orange-500/10 text-orange-500'
    };
    return colors[role] || 'bg-gray-500/10 text-gray-500';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">Users & Referrals Management</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage all users and view their referral networks</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{summary.totalUsers}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Total Users</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{summary.totalReferrals}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Total Referrals</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(summary.totalEarnings)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Total Earnings</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Target className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{summary.avgReferralsPerUser}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Avg Referrals/User</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Crown className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text)] truncate">
              {summary.topReferrer ? `${summary.topReferrer.firstName} ${summary.topReferrer.lastName}` : 'N/A'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">Top Referrer</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-6 border border-[var(--color-border)]">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search by name, email, or referral code..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all duration-300 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">User Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="delivery">Delivery</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Status</label>
                <select
                  value={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                >
                  <option value="all">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Verified</label>
                <select
                  value={filters.isVerified}
                  onChange={(e) => handleFilterChange('isVerified', e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                >
                  <option value="all">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Min Referrals</label>
                <select
                  value={filters.minReferrals}
                  onChange={(e) => handleFilterChange('minReferrals', e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                >
                  <option value="all">Any</option>
                  <option value="0">0+</option>
                  <option value="5">5+</option>
                  <option value="10">10+</option>
                  <option value="20">20+</option>
                  <option value="50">50+</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">User</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Contact</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Referral Code</th>
                  <th className="text-center p-4 text-sm font-semibold text-[var(--color-text)]">Referrals</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Referred By</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Joined</th>
                  <th className="text-center p-4 text-sm font-semibold text-[var(--color-text)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[var(--color-text-muted)]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">
                            {userItem.firstName} {userItem.lastName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {userItem.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-500">
                                <UserCheck className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-red-500">
                                <UserX className="w-3 h-3" /> Inactive
                              </span>
                            )}
                            {userItem.isVerified && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-500 ml-2">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs">{userItem.email}</span>
                          </div>
                          {userItem.phone && (
                            <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{userItem.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(userItem.role)}`}>
                          {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <code className="px-2 py-1 bg-[var(--color-background)] rounded text-xs font-mono text-[var(--color-primary)]">
                          {userItem.referralCode}
                        </code>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xl font-bold text-[var(--color-text)]">{userItem.referralCount}</span>
                          {userItem.referralCount > 0 && (
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                              {formatCurrency(userItem.totalEarningsFromReferrals || 0)} earned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {userItem.referredBy ? (
                          <code className="px-2 py-1 bg-[var(--color-background)] rounded text-xs font-mono">
                            {userItem.referredBy}
                          </code>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">Direct signup</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                          <Calendar className="w-3 h-3" />
                          {formatDate(userItem.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(userItem);
                            setShowUserDetails(true);
                          }}
                          className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[var(--color-border)] flex justify-between items-center flex-wrap gap-4">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--color-surface)] p-6 border-b border-[var(--color-border)] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">User Details</h2>
                <p className="text-sm text-[var(--color-text-muted)]">View complete referral information</p>
              </div>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[var(--color-primary)]" />
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="text-sm text-[var(--color-text-muted)]">Name:</span> <span className="text-[var(--color-text)]">{selectedUser.firstName} {selectedUser.lastName}</span></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Email:</span> <span className="text-[var(--color-text)]">{selectedUser.email}</span></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Phone:</span> <span className="text-[var(--color-text)]">{selectedUser.phone || 'N/A'}</span></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Role:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role)}`}>{selectedUser.role}</span></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Joined:</span> <span className="text-[var(--color-text)]">{formatDate(selectedUser.createdAt)}</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[var(--color-primary)]" />
                    Referral Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="text-sm text-[var(--color-text-muted)]">Referral Code:</span> <code className="px-2 py-1 bg-[var(--color-background)] rounded text-sm font-mono text-[var(--color-primary)]">{selectedUser.referralCode}</code></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Total Referrals:</span> <span className="text-[var(--color-text)] font-semibold">{selectedUser.referralCount}</span></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Referred By:</span> <span className="text-[var(--color-text)]">{selectedUser.referredBy || 'Direct signup'}</span></p>
                    <p><span className="text-sm text-[var(--color-text-muted)]">Total Earnings:</span> <span className="text-green-500 font-semibold">{formatCurrency(selectedUser.totalEarningsFromReferrals || 0)}</span></p>
                    {selectedUser.pendingWithdrawals !== undefined && (
                      <p><span className="text-sm text-[var(--color-text-muted)]">Pending Withdrawals:</span> <span className="text-yellow-500">{formatCurrency(selectedUser.pendingWithdrawals)}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Referred Users List */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--color-primary)]" />
                  Referred Users ({selectedUser.referredUsers?.length || 0})
                </h3>
                
                {selectedUser.referredUsers && selectedUser.referredUsers.length > 0 ? (
                  <div className="bg-[var(--color-background)] rounded-xl overflow-hidden border border-[var(--color-border)]">
                    <table className="w-full">
                      <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                        <tr>
                          <th className="text-left p-3 text-sm font-semibold text-[var(--color-text)]">Name</th>
                          <th className="text-left p-3 text-sm font-semibold text-[var(--color-text)]">Email</th>
                          <th className="text-left p-3 text-sm font-semibold text-[var(--color-text)]">Role</th>
                          <th className="text-left p-3 text-sm font-semibold text-[var(--color-text)]">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]">
                        {selectedUser.referredUsers.map((referred) => (
                          <tr key={referred._id} className="hover:bg-[var(--color-surface)] transition-colors">
                            <td className="p-3">
                              <p className="text-sm text-[var(--color-text)]">{referred.firstName} {referred.lastName}</p>
                            </td>
                            <td className="p-3">
                              <p className="text-sm text-[var(--color-text-muted)]">{referred.email}</p>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(referred.role)}`}>
                                {referred.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <p className="text-sm text-[var(--color-text-muted)]">{formatDate(referred.createdAt)}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-[var(--color-background)] rounded-xl p-8 text-center border border-[var(--color-border)]">
                    <Users className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                    <p className="text-[var(--color-text-muted)]">No referrals yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}