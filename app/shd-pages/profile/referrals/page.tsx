// C:\Users\USER\Desktop\Projects\my-app\app\profile\referrals\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  referralEarnings: number;
  vendorCount: number;
  referralLink: string;
  referredUsers: Array<{
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  }>;
}

export default function ReferralsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/referral/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referral stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      setMessage({ type: 'error', text: 'Failed to load referral data' });
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    setGenerating(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/referral/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate referral code');
      }

      const data = await response.json();
      setStats(prev => prev ? { ...prev, referralCode: data.referralCode } : null);
      setMessage({ type: 'success', text: 'Referral code generated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/profile" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">📤 Referrals</h1>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Referral Code Section *
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Referral Code</h2>
          
          {stats?.referralCode ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-gray-100 px-6 py-3 rounded-lg font-mono text-xl font-bold text-purple-600">
                  {stats.referralCode}
                </div>
                <button
                  onClick={() => copyToClipboard(stats.referralCode)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
                >
                  {copied ? '✅ Copied!' : '📋 Copy Code'}
                </button>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Share your referral link:</p>
                <div className="flex flex-wrap items-center gap-4">
                  <input
                    type="text"
                    value={stats.referralLink}
                    readOnly
                    className="flex-1 min-w-[200px] bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(stats.referralLink)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📋 Copy Link
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You don't have a referral code yet.</p>
              <button
                onClick={generateReferralCode}
                disabled={generating}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : '🎯 Generate Referral Code'}
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards *
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalReferrals || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vendors Referred</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.vendorCount || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Earnings</p>
                <p className="text-3xl font-bold text-green-600">KSh {stats?.referralEarnings || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral List *
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Referred Users</h2>
          </div>
          
          {stats?.referredUsers && stats.referredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.referredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'vendor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? '✓ Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
              <p className="text-gray-500 mb-4">Share your referral code to start earning!</p>
              {stats?.referralCode && (
                <button
                  onClick={() => copyToClipboard(stats.referralLink)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Share Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Referral Info *
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works 💡</h3>
          <ul className="text-blue-800 space-y-2">
            <li>✓ Share your referral code or link with friends</li>
            <li>✓ When someone registers with your code, they become your referral</li>
            <li>✓ Earn <strong>KSh 500</strong> when a referral becomes a vendor</li>
            <li>✓ Track all your referrals and earnings here</li>
          </ul>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  referralEarnings: number;
  vendorCount: number;
  referralLink: string;
  referredUsers: Array<{
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  }>;
}

export default function ReferralsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/referral/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referral stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      setMessage({ type: 'error', text: 'Failed to load referral data' });
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    setGenerating(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/referral/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate referral code');
      }

      const data = await response.json();
      setStats(prev => prev ? { ...prev, referralCode: data.referralCode } : null);
      setMessage({ type: 'success', text: 'Referral code generated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
              📤 Referrals
            </h1>
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

        {/* Referral Code Section */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 mb-6 border border-surface">
          <h2 className="text-lg font-bold text-secondary mb-4">Your Referral Code</h2>
          
          {stats?.referralCode ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-surface/50 px-6 py-3 rounded-xl font-mono text-xl sm:text-2xl font-bold text-primary border-2 border-primary/20">
                  {stats.referralCode}
                </div>
                <button
                  onClick={() => copyToClipboard(stats.referralCode)}
                  className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                    copied 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-surface hover:bg-surface/70 text-secondary'
                  }`}
                >
                  {copied ? '✅ Copied!' : '📋 Copy Code'}
                </button>
              </div>

              <div>
                <p className="text-sm text-muted mb-2">Share your referral link:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={stats.referralLink}
                    readOnly
                    className="flex-1 min-w-[200px] bg-background border-2 border-surface rounded-xl px-4 py-2.5 text-sm text-secondary focus:outline-none focus:border-primary transition-colors duration-200"
                  />
                  <button
                    onClick={() => copyToClipboard(stats.referralLink)}
                    className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                  >
                    📋 Copy Link
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-muted mb-4">You don't have a referral code yet.</p>
              <button
                onClick={generateReferralCode}
                disabled={generating}
                className="bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
              >
                {generating ? 'Generating...' : '🎯 Generate Referral Code'}
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Total Referrals</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">{stats?.totalReferrals || 0}</p>
              </div>
              <div className="bg-purple-100 p-3.5 rounded-xl">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Vendors Referred</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">{stats?.vendorCount || 0}</p>
              </div>
              <div className="bg-green-100 p-3.5 rounded-xl">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Earnings</p>
                <p className="text-3xl sm:text-4xl font-black text-primary mt-1">KSh {stats?.referralEarnings?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3.5 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface">
          <div className="px-6 py-4 border-b border-surface">
            <h2 className="text-lg font-bold text-secondary">Referred Users</h2>
            {stats?.referredUsers && (
              <p className="text-sm text-muted mt-0.5">
                {stats.referredUsers.length} user{stats.referredUsers.length !== 1 ? 's' : ''} referred
              </p>
            )}
          </div>
          
          {stats?.referredUsers && stats.referredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface">
                  {stats.referredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-surface/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary">{user.name}</div>
                        <div className="text-xs text-muted sm:hidden">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-muted">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'vendor' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-primary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted hidden lg:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-secondary mb-2">No referrals yet</h3>
              <p className="text-muted mb-6">Share your referral code to start earning!</p>
              {stats?.referralCode && (
                <button
                  onClick={() => copyToClipboard(stats.referralLink)}
                  className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                >
                  Share Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Referral Info */}
        <div className="mt-6 bg-surface/50 border border-surface rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-secondary mb-3">How it works 💡</h3>
          <ul className="space-y-2.5 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              Share your referral code or link with friends
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              When someone registers with your code, they become your referral
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              Earn <span className="font-bold text-primary">KSh 500</span> when a referral becomes a vendor
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              Track all your referrals and earnings here
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}