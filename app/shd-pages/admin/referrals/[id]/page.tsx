// app/admin/referrals/[userId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ReferralUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  referredBy: string | null;
  isMember: boolean;
  isVerified: boolean;
  createdAt: Date;
}

interface ReferredUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  isVerified: boolean;
  isMember: boolean;
  createdAt: Date;
}

interface UserStats {
  totalReferrals: number;
  totalEarnings: number;
  totalCommission: number;
  totalSubscription: number;
  activeReferrals: number;
  memberReferrals: number;
}

export default function ReferralDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<ReferralUser | null>(null);
  const [referrer, setReferrer] = useState<any>(null);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralDetail();
  }, []);

  const fetchReferralDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/referrals/${params.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setReferrer(data.referrer);
        setReferredUsers(data.referredUsers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch referral details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
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

  if (!user) {
    return (
      <div className="p-8 text-center text-muted">
        <div className="text-4xl mb-4">🔗</div>
        <h2 className="text-xl font-semibold text-secondary">User not found</h2>
        <button
          onClick={() => router.push('/admin/referrals')}
          className="mt-4 text-primary hover:text-accent-dark transition"
        >
          ← Back to Referrals
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/referrals')}
          className="text-primary hover:text-accent-dark transition mb-4 inline-block"
        >
          ← Back to Referrals
        </button>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              {user.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="font-mono text-sm bg-surface px-3 py-1 rounded-lg">
                Code: {user.referralCode}
              </span>
              {user.isMember && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                  ⭐ Member
                </span>
              )}
              {user.isVerified ? (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  ✓ Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  ⚠ Unverified
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/admin/users/${user._id}`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
            >
              View Full Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-primary">
            <div className="text-sm text-muted">Total Referrals</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalReferrals}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Active Referrals</div>
            <div className="text-2xl font-bold text-secondary">{stats.activeReferrals}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
            <div className="text-sm text-muted">Member Referrals</div>
            <div className="text-2xl font-bold text-secondary">{stats.memberReferrals}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-accent-dark">
            <div className="text-sm text-muted">Total Earnings</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.totalEarnings)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-sm text-muted">Commission</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.totalCommission)}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referred Users */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">
              👥 Referred Users ({referredUsers.length})
            </h2>
            
            {referredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-secondary uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent">
                    {referredUsers.map((referred) => (
                      <tr key={referred._id} className="hover:bg-background transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-secondary">{referred.name}</div>
                          <div className="text-xs text-muted">{referred.referralCode}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-secondary">{referred.phoneNumber}</div>
                          <div className="text-xs text-muted">{referred.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            {referred.isMember && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                ⭐ Member
                              </span>
                            )}
                            {referred.isVerified ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                ⚠ Unverified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {formatDate(referred.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                This user hasn't referred anyone yet
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Referrer Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">🔗 Referred By</h2>
            {referrer ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted">Name</label>
                  <Link 
                    href={`/admin/referrals/${referrer._id}`}
                    className="block font-medium text-primary hover:text-accent-dark transition"
                  >
                    {referrer.name}
                  </Link>
                </div>
                <div>
                  <label className="text-xs text-muted">Email</label>
                  <div className="text-secondary">{referrer.email}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Referral Code</label>
                  <div className="font-mono text-sm text-primary">{referrer.referralCode}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  {referrer.isMember && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">⭐</span>
                  )}
                  {referrer.isVerified && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">✓</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted py-4">
                No referrer found
              </div>
            )}
          </div>

          {/* Earnings Breakdown */}
          {stats && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">💰 Earnings Breakdown</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-accent pb-2">
                  <span className="text-sm text-muted">Referral Earnings</span>
                  <span className="font-bold text-secondary">{formatAmount(stats.totalEarnings)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-accent pb-2">
                  <span className="text-sm text-muted">Commission Earnings</span>
                  <span className="font-bold text-secondary">{formatAmount(stats.totalCommission)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-accent pb-2">
                  <span className="text-sm text-muted">Subscription Earnings</span>
                  <span className="font-bold text-secondary">{formatAmount(stats.totalSubscription)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-secondary">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatAmount(stats.totalEarnings + stats.totalCommission + stats.totalSubscription)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode || '');
                  alert('Referral code copied to clipboard!');
                }}
                className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
              >
                📋 Copy Referral Code
              </button>
              <button
                onClick={() => router.push(`/admin/users/${user._id}`)}
                className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
              >
                👤 View Full Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}