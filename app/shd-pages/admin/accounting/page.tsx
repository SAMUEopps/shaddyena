'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface AccountingData {
  totals: {
    totalCollected: number;
    totalPaidOut: number;
    totalRevenue: number;
    totalFees: number;
    totalRefunds: number;
    pendingSettlements: number;
    byType: {
      order: number;
      membership: number;
      savings: number;
      investment: number;
      payout: number;
      refund: number;
      advertisement: number;
      subscription: number;
    };
  };
  mpesaBalance: {
    availableBalance: number;
    ledgerBalance: number;
    currency: string;
    lastUpdated: string;
  };
  dailyTransactions: Array<{
    _id: { year: number; month: number; day: number };
    total: number;
    count: number;
  }>;
  recentTransactions: any[];
  topVendors: Array<{
    totalRevenue: number;
    totalOrders: number;
    vendor: {
      businessName: string;
    };
  }>;
  revenueByType: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  platformMetrics: {
    totalPlatformRevenue: number;
    platformFees: number;
    totalVendors: number;
    activeVendors: number;
    totalUsers: number;
    totalOrders: number;
    pendingPayouts: number;
    userBalances: {
      totalBalance: number;
      totalSavings: number;
      totalInvested: number;
      totalReferralEarnings: number;
    };
    vendorBalances: {
      totalAvailable: number;
      totalPending: number;
      totalRevenue: number;
      totalLifetimeEarnings: number;
    };
  };
}

const COLORS = ['#e50986', '#101c47', '#db91ba', '#b7558b', '#f9c9e7', '#4a526d', '#898fa5'];

export default function AccountingPage() {
  const [data, setData] = useState<AccountingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAccountingData();
  }, [period]);

  const fetchAccountingData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `/api/shd-api/api/admin/accounting?period=${period}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount?.toLocaleString() || 0}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-muted">Failed to load accounting data</p>
          <button 
            onClick={fetchAccountingData}
            className="mt-4 bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Format daily transactions for chart
  const chartData = data.dailyTransactions.map(d => ({
    date: `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
    amount: d.total,
    count: d.count
  }));

  // Format revenue by type for pie chart
  const pieData = data.revenueByType.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.total
  }));

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(data.totals.totalRevenue),
      icon: '💰',
      color: 'bg-emerald-500'
    },
    { 
      label: 'M-Pesa Balance', 
      value: formatCurrency(data.mpesaBalance?.availableBalance || 0),
      icon: '🏦',
      color: 'bg-blue-500'
    },
    { 
      label: 'Platform Fees', 
      value: formatCurrency(data.totals.totalFees),
      icon: '💳',
      color: 'bg-purple-500'
    },
    { 
      label: 'Pending Payouts', 
      value: formatCurrency(data.platformMetrics.pendingPayouts),
      icon: '⏳',
      color: 'bg-orange-500'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📊 Accounting Overview
          </h1>
          <p className="text-muted mt-1">
            Track all financial transactions and balances
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-surface border border-transparent hover:border-primary/30 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-black text-secondary mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Balances */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <h3 className="text-lg font-bold text-secondary mb-4">👤 User Balances</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Available Balance</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.userBalances.totalBalance)}</p>
            </div>
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Total Savings</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.userBalances.totalSavings)}</p>
            </div>
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Total Investments</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.userBalances.totalInvested)}</p>
            </div>
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Referral Earnings</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.userBalances.totalReferralEarnings)}</p>
            </div>
          </div>
        </div>

        {/* Vendor Balances */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <h3 className="text-lg font-bold text-secondary mb-4">🏪 Vendor Balances</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Available Balance</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.vendorBalances.totalAvailable)}</p>
            </div>
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Pending Balance</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.vendorBalances.totalPending)}</p>
            </div>
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Total Revenue</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.vendorBalances.totalRevenue)}</p>
            </div>
            <div className="p-4 bg-surface/30 rounded-xl">
              <p className="text-sm text-muted">Lifetime Earnings</p>
              <p className="text-xl font-bold text-secondary">{formatCurrency(data.platformMetrics.vendorBalances.totalLifetimeEarnings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <h3 className="text-lg font-bold text-secondary mb-4">📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e50986" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e50986" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `KSh ${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#e50986" 
                fillOpacity={1}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Type */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <h3 className="text-lg font-bold text-secondary mb-4">🎯 Revenue by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-secondary">🏆 Top Vendors by Revenue</h3>
          <button className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium text-sm">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {data.topVendors.map((vendor, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-surface/30 hover:bg-surface/50 transition-colors duration-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-secondary">#{index + 1}</span>
                  <p className="font-medium text-secondary">{vendor.vendor.businessName}</p>
                </div>
                <p className="text-sm text-muted">{vendor.totalOrders} orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">{formatCurrency(vendor.totalRevenue)}</p>
                <p className="text-sm text-muted">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-secondary">🔄 Recent Transactions</h3>
          <button className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium text-sm">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-surface/50 hover:bg-surface/20 transition-colors duration-200">
                  <td className="py-3 px-4 text-sm text-secondary">
                    {format(parseISO(transaction.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="capitalize">{transaction.type}</span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-secondary">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      transaction.status === 'success' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary">
                    {transaction.userId?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">
                    {transaction.receiptNumber || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}