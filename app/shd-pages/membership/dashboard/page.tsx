// C:\Users\USER\Desktop\Projects\my-app\app\membership\dashboard\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardData {
  user: {
    name: string;
    isMember: boolean;
    memberSince: string;
    totalSavings: number;
    totalInvestments: number;
    availableBalance: number;
  };
  investments: Array<{
    _id: string;
    type: string;
    amount: number;
    status: string;
    expectedReturn: number;
    endDate: string;
  }>;
  recentSavings: Array<{
    _id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export default function MembershipDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'savings'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/membership/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (amount: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/savings/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, description: 'Manual deposit' })
      });

      if (response.ok) {
        alert('Deposit successful!');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Deposit failed');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleInvest = async (type: string, amount: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, amount })
      });

      if (response.ok) {
        alert('Investment created successfully!');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Investment failed');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!data?.user.isMember) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Not a Member Yet</h2>
          <p className="text-gray-600 mb-6">
            Become a member to access savings and investment opportunities.
          </p>
          <Link
            href="/membership/activate"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Activate Membership
          </Link>
        </div>
      </div>
    );
  }

  const { user, investments, recentSavings } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header *
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🌟 Membership Dashboard</h1>
              <p className="text-sm text-gray-600">
                Member since {new Date(user.memberSince).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDeposit(100)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
              >
                + Deposit
              </button>
              <Link
                href="/membership/invest"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
              >
                💼 Invest
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards *
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">Total Savings</p>
            <p className="text-2xl font-bold text-green-600">KSh {user.totalSavings}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">Total Investments</p>
            <p className="text-2xl font-bold text-blue-600">KSh {user.totalInvestments}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold text-purple-600">KSh {user.availableBalance}</p>
          </div>
        </div>

        {/* Tabs *
        <div className="bg-white rounded-xl shadow">
          <div className="border-b">
            <div className="flex space-x-4 p-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'investments'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Investments ({investments?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('savings')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'savings'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Savings History
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                {recentSavings?.length === 0 ? (
                  <p className="text-gray-500">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {recentSavings?.map(saving => (
                      <div key={saving._id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{saving.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(saving.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-semibold ${
                          saving.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {saving.type === 'deposit' ? '+' : '-'} KSh {saving.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'investments' && (
              <div>
                <h3 className="font-semibold mb-4">Your Investments</h3>
                {investments?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No investments yet</p>
                    <Link
                      href="/membership/invest"
                      className="text-purple-600 hover:underline mt-2 inline-block"
                    >
                      Start Investing →
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {investments?.map(investment => (
                      <div key={investment._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{investment.type}</h4>
                            <p className="text-sm text-gray-500">
                              Amount: KSh {investment.amount}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expected Return: KSh {investment.expectedReturn}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              investment.status === 'active' ? 'bg-green-100 text-green-800' :
                              investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {investment.status.toUpperCase()}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Ends: {new Date(investment.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'savings' && (
              <div>
                <h3 className="font-semibold mb-4">Savings History</h3>
                {recentSavings?.length === 0 ? (
                  <p className="text-gray-500">No savings history</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSavings?.map(saving => (
                          <tr key={saving._id} className="border-b">
                            <td className="py-2 text-sm">
                              {new Date(saving.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 text-sm">{saving.description}</td>
                            <td className={`py-2 text-sm text-right font-semibold ${
                              saving.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {saving.type === 'deposit' ? '+' : '-'} KSh {saving.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions *
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Link
            href="/membership/save"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Save Money</p>
              <p className="font-semibold">Add to savings</p>
            </div>
            <span className="text-2xl">💰</span>
          </Link>

          <Link
            href="/membership/invest"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Invest</p>
              <p className="font-semibold">Grow your money</p>
            </div>
            <span className="text-2xl">📈</span>
          </Link>

          <Link
            href="/membership/withdraw"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Withdraw</p>
              <p className="font-semibold">Cash out</p>
            </div>
            <span className="text-2xl">🏦</span>
          </Link>

          <Link
            href="/membership/refer"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Refer</p>
              <p className="font-semibold">Earn bonuses</p>
            </div>
            <span className="text-2xl">👥</span>
          </Link>
        </div>
      </div>
    </div>
  );
}*/


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardData {
  user: {
    name: string;
    isMember: boolean;
    memberSince: string;
    totalSavings: number;
    totalInvestments: number;
    availableBalance: number;
  };
  investments: Array<{
    _id: string;
    type: string;
    amount: number;
    status: string;
    expectedReturn: number;
    endDate: string;
  }>;
  recentSavings: Array<{
    _id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export default function MembershipDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'savings'>('overview');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/membership/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (amount: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/savings/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, description: 'Manual deposit' })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Deposit successful!' });
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Deposit failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const handleInvest = async (type: string, amount: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, amount })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Investment created successfully!' });
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Investment failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data?.user.isMember) {
    return (
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-surface">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Not a Member Yet</h2>
          <p className="text-muted mb-6">
            Become a member to access savings and investment opportunities.
          </p>
          <Link
            href="/membership/activate"
            className="inline-block bg-primary hover:bg-accent-dark text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Activate Membership
          </Link>
        </div>
      </div>
    );
  }

  const { user, investments, recentSavings } = data;

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 mb-6 border border-surface">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-secondary flex items-center gap-2">
                <span>🌟</span> Membership Dashboard
              </h1>
              <p className="text-sm text-muted mt-1">
                Member since {new Date(user.memberSince).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDeposit(100)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
              >
                💰 Deposit
              </button>
              <Link
                href="/membership/invest"
                className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
              >
                💼 Invest
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface hover:border-primary/20">
            <p className="text-sm text-muted font-medium">Total Savings</p>
            <p className="text-2xl sm:text-3xl font-black text-primary mt-1">
              KSh {user.totalSavings?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface hover:border-primary/20">
            <p className="text-sm text-muted font-medium">Total Investments</p>
            <p className="text-2xl sm:text-3xl font-black text-accent-dark mt-1">
              KSh {user.totalInvestments?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface hover:border-primary/20">
            <p className="text-sm text-muted font-medium">Available Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-secondary mt-1">
              KSh {user.availableBalance?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-surface overflow-hidden">
          <div className="border-b border-surface">
            <div className="flex flex-wrap gap-2 p-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface hover:bg-surface/70 text-secondary'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'investments'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface hover:bg-surface/70 text-secondary'
                }`}
              >
                📈 Investments ({investments?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('savings')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'savings'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface hover:bg-surface/70 text-secondary'
                }`}
              >
                💰 Savings History
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="font-bold text-secondary mb-4">Recent Activity</h3>
                {recentSavings?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-muted">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSavings?.map(saving => (
                      <div key={saving._id} className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-surface/30 hover:bg-surface/50 transition-colors duration-200">
                        <div>
                          <p className="font-medium text-secondary">{saving.description}</p>
                          <p className="text-xs text-muted">
                            {new Date(saving.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`font-bold ${
                          saving.type === 'deposit' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {saving.type === 'deposit' ? '+' : '-'} KSh {saving.amount?.toLocaleString() || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'investments' && (
              <div>
                <h3 className="font-bold text-secondary mb-4">Your Investments</h3>
                {investments?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-muted">No investments yet</p>
                    <Link
                      href="/membership/invest"
                      className="text-primary hover:text-accent-dark font-medium transition-colors duration-200 mt-2 inline-block"
                    >
                      Start Investing →
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {investments?.map(investment => (
                      <div key={investment._id} className="border-2 border-surface rounded-xl p-4 hover:border-primary/30 transition-colors duration-200">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-secondary">{investment.type}</h4>
                            <p className="text-sm text-muted">
                              Amount: <span className="font-medium text-secondary">KSh {investment.amount?.toLocaleString() || 0}</span>
                            </p>
                            <p className="text-sm text-muted">
                              Expected Return: <span className="font-medium text-green-600">KSh {investment.expectedReturn?.toLocaleString() || 0}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                              investment.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                              investment.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              'bg-red-100 text-red-700 border-red-200'
                            }`}>
                              {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                            </span>
                            <p className="text-xs text-muted mt-1">
                              Ends: {new Date(investment.endDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'savings' && (
              <div>
                <h3 className="font-bold text-secondary mb-4">Savings History</h3>
                {recentSavings?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-muted">No savings history</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-surface">
                          <th className="text-left py-3 text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                          <th className="text-left py-3 text-xs font-medium text-muted uppercase tracking-wider">Description</th>
                          <th className="text-right py-3 text-xs font-medium text-muted uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface">
                        {recentSavings?.map(saving => (
                          <tr key={saving._id} className="hover:bg-surface/30 transition-colors duration-200">
                            <td className="py-3 text-sm text-muted">
                              {new Date(saving.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="py-3 text-sm text-secondary">{saving.description}</td>
                            <td className={`py-3 text-sm text-right font-bold ${
                              saving.type === 'deposit' ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {saving.type === 'deposit' ? '+' : '-'} KSh {saving.amount?.toLocaleString() || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Link
            href="/membership/save"
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface hover:border-primary/20 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Save Money</p>
                <p className="font-semibold text-secondary group-hover:text-primary transition-colors duration-200">Add to savings</p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </Link>

          <Link
            href="/membership/invest"
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface hover:border-primary/20 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Invest</p>
                <p className="font-semibold text-secondary group-hover:text-primary transition-colors duration-200">Grow your money</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
          </Link>

          <Link
            href="/membership/withdraw"
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface hover:border-primary/20 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Withdraw</p>
                <p className="font-semibold text-secondary group-hover:text-primary transition-colors duration-200">Cash out</p>
              </div>
              <span className="text-2xl">🏦</span>
            </div>
          </Link>

          <Link
            href="/membership/refer"
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-surface hover:border-primary/20 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Refer</p>
                <p className="font-semibold text-secondary group-hover:text-primary transition-colors duration-200">Earn bonuses</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}