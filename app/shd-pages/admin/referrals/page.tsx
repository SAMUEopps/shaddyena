// app/admin/referrals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ReferralUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  referredBy: string | null;
  referrals: string[];
  referralEarnings: number;
  referralCommissionEarnings: number;
  referralSubscriptionEarnings: number;
  isMember: boolean;
  isVerified: boolean;
  createdAt: Date;
}

interface Stats {
  totalUsers: number;
  totalWithReferrals: number;
  totalReferrals: number;
  totalReferralEarnings: number;
  totalReferralCommission: number;
  totalReferralSubscription: number;
  avgReferralsPerUser: number;
  maxReferrals: number;
}

interface TopReferrer {
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  referralCommissionEarnings: number;
  referralSubscriptionEarnings: number;
  isMember: boolean;
  isVerified: boolean;
}

export default function AdminReferrals() {
  const router = useRouter();
  const [users, setUsers] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('referralEarnings');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minReferrals, setMinReferrals] = useState(0);
  const [hasReferred, setHasReferred] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earningsType, setEarningsType] = useState('referralEarnings');
  const [earningsAmount, setEarningsAmount] = useState(0);
  const [earningsAction, setEarningsAction] = useState('add');

  useEffect(() => {
    fetchReferrals();
  }, [sortBy, sortOrder, minReferrals, hasReferred]);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `/api/shd-api/api/admin/referrals?sortBy=${sortBy}&sortOrder=${sortOrder}&minReferrals=${minReferrals}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (hasReferred !== 'all') url += `&hasReferred=${hasReferred}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.referrals);
        setStats(data.stats);
        setTopReferrers(data.topReferrers);
      }
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEarnings = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/referrals/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: `add${earningsType.charAt(0).toUpperCase() + earningsType.slice(1)}`,
          value: earningsAmount
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedUsers([]);
        setShowEarningsModal(false);
        fetchReferrals();
      } else {
        alert(data.error || 'Failed to update earnings');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleResetEarnings = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    if (!confirm(`Are you sure you want to reset earnings for ${selectedUsers.length} users?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/referrals/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: 'resetEarnings'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedUsers([]);
        fetchReferrals();
      } else {
        alert(data.error || 'Failed to reset earnings');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
    }
  };

  const filteredUsers = users.filter(user => {
    if (search) {
      const searchLower = search.toLowerCase();
      return user.name.toLowerCase().includes(searchLower) ||
             user.email.toLowerCase().includes(searchLower) ||
             user.phoneNumber.includes(search) ||
             user.referralCode?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <div className="text-sm text-muted">Total Users</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalUsers}</div>
            <div className="text-xs text-muted mt-1">
              {stats.totalWithReferrals} have referrals
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Total Referrals</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalReferrals}</div>
            <div className="text-xs text-muted mt-1">
              Avg: {stats.avgReferralsPerUser.toFixed(1)} per user
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-accent-dark">
            <div className="text-sm text-muted">Total Earnings</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.totalReferralEarnings)}</div>
            <div className="text-xs text-muted mt-1">
              Max: {formatAmount(stats.maxReferrals)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
            <div className="text-sm text-muted">Commission Earnings</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.totalReferralCommission)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-sm text-muted">Subscription Earnings</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.totalReferralSubscription)}</div>
          </div>
        </div>
      )}

      {/* Top Referrers */}
      {topReferrers && topReferrers.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-secondary mb-4">🏆 Top Referrers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Referrals</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Earnings</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Commission</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent">
                {topReferrers.map((referrer, index) => (
                  <tr key={index} className="hover:bg-background transition">
                    <td className="px-4 py-2">
                      <span className="font-bold text-secondary">#{index + 1}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium text-secondary">{referrer.name}</div>
                      <div className="text-xs text-muted">{referrer.email}</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-bold text-secondary">{referrer.referralCount}</span>
                    </td>
                    <td className="px-4 py-2 font-medium text-secondary">
                      {formatAmount(referrer.referralEarnings)}
                    </td>
                    <td className="px-4 py-2 font-medium text-secondary">
                      {formatAmount(referrer.referralCommissionEarnings)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        {referrer.isMember && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">⭐</span>
                        )}
                        {referrer.isVerified && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">✓</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          🔗 Referral Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={hasReferred}
            onChange={(e) => setHasReferred(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Users</option>
            <option value="true">Has Referrals</option>
            <option value="false">No Referrals</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="referralEarnings">Sort by Earnings</option>
            <option value="referralCount">Sort by Referrals</option>
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Joined</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="border border-accent rounded-lg px-4 py-2 hover:bg-background transition"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => {
              setEarningsAmount(0);
              setEarningsType('referralEarnings');
              setEarningsAction('add');
              setShowEarningsModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-accent-dark transition"
          >
            Add Earnings
          </button>
          <button
            onClick={handleResetEarnings}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Reset Earnings
          </button>
          <button
            onClick={() => setSelectedUsers([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Referrals Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllUsers}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Referral Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Referred By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Referrals</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Earnings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">{user.name}</div>
                    <div className="text-sm text-muted">{user.email}</div>
                    <div className="text-xs text-muted">{user.phoneNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm font-medium text-primary">
                      {user.referralCode}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode || '');
                        alert('Referral code copied!');
                      }}
                      className="text-xs text-primary hover:text-accent-dark transition"
                    >
                      📋 Copy
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {user.referredBy ? (
                      <div className="font-mono text-sm text-secondary">
                        {user.referredBy}
                      </div>
                    ) : (
                      <span className="text-sm text-muted">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {user.referrals?.length || 0}
                      </div>
                      <div className="text-xs text-muted">referrals</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-secondary">
                        Earnings: {formatAmount(user.referralEarnings)}
                      </div>
                      <div className="text-xs text-muted">
                        Commission: {formatAmount(user.referralCommissionEarnings)}
                      </div>
                      <div className="text-xs text-muted">
                        Subscription: {formatAmount(user.referralSubscriptionEarnings)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {user.isMember ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          ⭐ Member
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Non-member
                        </span>
                      )}
                      {user.isVerified ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          ⚠ Unverified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/admin/referrals/${user._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted">
            No users found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredUsers.length} of {users.length} users
          {search && ` (filtered from ${users.length} total)`}
        </span>
        <span>
          {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
        </span>
      </div>

      {/* Earnings Modal */}
      {showEarningsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">Add Earnings</h2>
              <button
                onClick={() => setShowEarningsModal(false)}
                className="text-muted hover:text-text text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Earnings Type
                </label>
                <select
                  value={earningsType}
                  onChange={(e) => setEarningsType(e.target.value)}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="referralEarnings">Referral Earnings</option>
                  <option value="referralCommissionEarnings">Commission Earnings</option>
                  <option value="referralSubscriptionEarnings">Subscription Earnings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={earningsAmount}
                  onChange={(e) => setEarningsAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Action
                </label>
                <select
                  value={earningsAction}
                  onChange={(e) => setEarningsAction(e.target.value)}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="add">Add</option>
                  <option value="set">Set</option>
                  <option value="subtract">Subtract</option>
                </select>
              </div>

              <div className="text-sm text-muted">
                Selected users: {selectedUsers.length}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateEarnings}
                  className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
                >
                  Apply to Selected
                </button>
                <button
                  onClick={() => setShowEarningsModal(false)}
                  className="flex-1 border border-accent rounded-lg px-6 py-2 hover:bg-background transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}