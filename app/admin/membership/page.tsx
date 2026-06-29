// app/admin/membership/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Wallet,
  TrendingUp,
  Gift,
  Settings,
  LogOut,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  UserCheck,
  UserX,
  BarChart3,
  Clock,
  Shield,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  membershipNumber: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  createdAt: string;
  savingsAccount: {
    totalSaved: number;
    availableBalance: number;
    investedBalance: number;
    contributionType: string;
    contributionAmount: number;
  } | null;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalSavings: number;
  totalInvested: number;
  totalTransactions: number;
}

export default function AdminMembershipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, filterStatus]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        status: filterStatus,
        search: searchTerm,
      });

      const response = await fetch(`/api/admin/membership/users?${params}`);
      if (!response.ok) {
        if (response.status === 403) {
          router.push('/membership/login');
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/membership/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/membership/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update user status');

      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/membership/logout', { method: 'POST' });
      router.push('/membership');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-soft)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-[var(--color-primary)]" />
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Panel</h1>
                <p className="text-sm text-[var(--color-text-muted)]">Membership Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/membership/funds"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Manage Funds
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
              >
                <LogOut className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)]">{stats?.totalUsers || 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Members</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="w-8 h-8 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)]">{stats?.activeUsers || 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Active Members</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8 text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)]">KES {stats?.totalSavings?.toLocaleString() || 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Savings</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)]">KES {stats?.totalInvested?.toLocaleString() || 0}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Invested</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by name, email, phone, or membership number..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-background-soft)]">
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Membership No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{user.name}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{user.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-[var(--color-text)]">{user.membershipNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          KES {user.savingsAccount?.availableBalance?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Total: KES {user.savingsAccount?.totalSaved?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Invested: KES {user.savingsAccount?.investedBalance?.toLocaleString() || 0}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors"
                        >
                          <Eye className="w-4 h-4 text-[var(--color-text-muted)]" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(user._id, !user.isActive)}
                          className={`p-2 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors ${
                            user.isActive ? 'text-red-500' : 'text-green-500'
                          }`}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Full Name</p>
                  <p className="font-medium text-[var(--color-text)]">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Membership Number</p>
                  <p className="font-mono font-medium text-[var(--color-text)]">{selectedUser.membershipNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                  <p className="font-medium text-[var(--color-text)]">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Phone</p>
                  <p className="font-medium text-[var(--color-text)]">{selectedUser.phone}</p>
                </div>
              </div>

              {/* Savings Info */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <h3 className="font-semibold text-[var(--color-text)] mb-3">Savings Account</h3>
                {selectedUser.savingsAccount ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Total Saved</p>
                      <p className="font-bold text-[var(--color-text)]">KES {selectedUser.savingsAccount.totalSaved.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Available</p>
                      <p className="font-bold text-[var(--color-text)]">KES {selectedUser.savingsAccount.availableBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Invested</p>
                      <p className="font-bold text-[var(--color-text)]">KES {selectedUser.savingsAccount.investedBalance.toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">No savings account found</p>
                )}
              </div>

              {/* Status */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Account Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.isActive
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Verification</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.isVerified
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Role</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-600">
                      {selectedUser.role || 'member'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-[var(--color-border)] pt-4 flex gap-3">
                <button
                  onClick={() => handleStatusChange(selectedUser._id, !selectedUser.isActive)}
                  className={`flex-1 px-4 py-2 rounded-xl font-medium ${
                    selectedUser.isActive
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  } transition-colors`}
                >
                  {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}