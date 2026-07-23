// app/profile/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EarningsStats {
  totalReferralEarnings: number;
  orderCommissions: number;
  subscriptionCommissions: number;
  pendingPayouts: number;
  totalReferrals: number;
  vendorReferrals: number;
}

interface RecentPayout {
  _id: string;
  amount: number;
  type: 'order_commission' | 'subscription_commission';
  status: 'pending' | 'processed' | 'failed';
  createdAt: string;
  processedAt?: string;
  orderId?: { orderNumber: string };
  subscriptionId?: { _id: string };
}

export default function PaymentsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [recentPayouts, setRecentPayouts] = useState<RecentPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchEarningsData();
    fetchRecentPayouts();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/referral/earnings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch earnings');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setMessage({ type: 'error', text: 'Failed to load earnings data' });
    }
  };

  const fetchRecentPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/referral/payouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payouts');
      }

      const data = await response.json();
      setRecentPayouts(data.payouts || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/profile" 
              className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2 mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary">
              💰 My Earnings
            </h1>
            <p className="text-muted mt-1">
              Track your referral commissions and earnings
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Total Earnings</p>
                <p className="text-2xl sm:text-3xl font-black text-primary mt-1">
                  {formatCurrency(stats?.totalReferralEarnings || 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-3.5 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Order Commissions</p>
                <p className="text-2xl sm:text-3xl font-black text-secondary mt-1">
                  {formatCurrency(stats?.orderCommissions || 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-3.5 rounded-xl">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">0.5% per order</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Subscription Commissions</p>
                <p className="text-2xl sm:text-3xl font-black text-secondary mt-1">
                  {formatCurrency(stats?.subscriptionCommissions || 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3.5 rounded-xl">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">20% per subscription</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Pending Payouts</p>
                <p className="text-2xl sm:text-3xl font-black text-yellow-600 mt-1">
                  {formatCurrency(stats?.pendingPayouts || 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3.5 rounded-xl">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-bold text-secondary">Total Referrals</h3>
            </div>
            <p className="text-3xl font-black text-primary">{stats?.totalReferrals || 0}</p>
            <p className="text-sm text-muted mt-1">
              {stats?.vendorReferrals || 0} vendors referred
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-bold text-secondary">Commission Rates</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Order Commission</span>
                <span className="font-bold text-primary">0.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Subscription Commission</span>
                <span className="font-bold text-primary">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface">
          <div className="px-6 py-4 border-b border-surface">
            <h2 className="text-lg font-bold text-secondary">Recent Payouts</h2>
          </div>

          {recentPayouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface">
                  {recentPayouts.map((payout) => (
                    <tr key={payout._id} className="hover:bg-surface/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {formatDate(payout.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payout.type === 'order_commission'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {payout.type === 'order_commission' ? '📦 Order' : '📋 Subscription'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-secondary">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payout.status === 'processed'
                            ? 'bg-green-100 text-green-700'
                            : payout.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {payout.status === 'processed' ? '✅ Processed' : 
                           payout.status === 'pending' ? '⏳ Pending' : '❌ Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-bold text-secondary mb-2">No payouts yet</h3>
              <p className="text-muted">
                Start referring vendors to earn commissions
              </p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
          <h3 className="text-lg font-bold text-secondary mb-4">💰 How Referral Earnings Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-surface">
              <div className="text-3xl mb-3">👥</div>
              <h4 className="font-bold text-secondary">1. Refer a Vendor</h4>
              <p className="text-sm text-muted mt-2">
                Share your referral code with potential vendors. When they register, you become their referrer.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-surface">
              <div className="text-3xl mb-3">📦</div>
              <h4 className="font-bold text-secondary">2. Earn on Orders</h4>
              <p className="text-sm text-muted mt-2">
                Get <strong className="text-primary">0.5%</strong> commission on every order your referred vendor completes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-surface">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-bold text-secondary">3. Earn on Subscriptions</h4>
              <p className="text-sm text-muted mt-2">
                Get <strong className="text-primary">20%</strong> commission when your referred vendor subscribes to a plan.
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-xl border border-surface">
            <p className="text-sm text-muted text-center">
              💡 Payouts are automatically processed via M-Pesa when orders are delivered or subscriptions are activated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}