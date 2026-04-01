// app/delivery/earnings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Wallet,
  TrendingUp,
  Calendar,
  ArrowLeft,
  DollarSign,
  Award,
  Clock,
  ChevronRight,
  RefreshCw,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Eye,
  Target,
  Sparkles,
  Zap,
  Shield,
  Gift,
  Star,
  Rocket,
  Package
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

interface EarningsSummary {
  totalEarnings: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  availableBalance: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  averagePerDelivery: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  cancelledDeliveries: number;
}

interface DailyEarnings {
  date: string;
  earnings: number;
  deliveries: number;
}

interface DeliveryEarning {
  _id: string;
  orderId: string;
  deliveryFee: number;
  status: string;
  createdAt: string;
  distance?: number;
  timeSpent?: number;
}

interface Bonus {
  id: string;
  type: string;
  amount: number;
  reason: string;
  date: string;
}

export default function DeliveryEarningsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
    availableBalance: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    averagePerDelivery: 0,
    totalDeliveries: 0,
    successfulDeliveries: 0,
    cancelledDeliveries: 0
  });
  
  const [dailyEarnings, setDailyEarnings] = useState<DailyEarnings[]>([]);
  const [recentDeliveries, setRecentDeliveries] = useState<DeliveryEarning[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [showChart, setShowChart] = useState<'area' | 'bar'>('area');

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchEarningsData();
    }
  }, [user, timeRange]);

  const fetchEarningsData = async () => {
    setIsLoading(true);
    try {
      // Fetch earnings summary
      const earningsRes = await fetch('/api/delivery/rider/earnings');
      if (earningsRes.ok) {
        const data = await earningsRes.json();
        
        // Fetch additional stats
        const statsRes = await fetch(`/api/delivery/rider/earnings/stats?range=${timeRange}`);
        let statsData = {
          todayEarnings: 0,
          weekEarnings: 0,
          monthEarnings: 0,
          averagePerDelivery: 0,
          totalDeliveries: 0,
          successfulDeliveries: 0,
          cancelledDeliveries: 0,
          dailyEarnings: []
        };
        
        if (statsRes.ok) {
          statsData = await statsRes.json();
        }
        
        setSummary({
          totalEarnings: data.totalEarnings || 0,
          pendingWithdrawals: data.pendingWithdrawals || 0,
          completedWithdrawals: data.completedWithdrawals || 0,
          availableBalance: data.availableBalance || 0,
          todayEarnings: statsData.todayEarnings,
          weekEarnings: statsData.weekEarnings,
          monthEarnings: statsData.monthEarnings,
          averagePerDelivery: statsData.averagePerDelivery,
          totalDeliveries: statsData.totalDeliveries,
          successfulDeliveries: statsData.successfulDeliveries,
          cancelledDeliveries: statsData.cancelledDeliveries
        });
        
        setDailyEarnings(statsData.dailyEarnings || []);
      }
      
      // Fetch recent deliveries
      const deliveriesRes = await fetch('/api/delivery/rider/history?limit=5&status=all');
      if (deliveriesRes.ok) {
        const data = await deliveriesRes.json();
        const recent = data.deliveries.flatMap((d: any) => 
          d.suborders.map((s: any) => ({
            _id: s._id,
            orderId: d.orderId,
            deliveryFee: s.deliveryFee,
            status: s.status,
            createdAt: d.createdAt
          }))
        ).slice(0, 5);
        setRecentDeliveries(recent);
      }
      
      // Fetch bonuses (mock data - replace with real API)
      setBonuses([
        { id: '1', type: 'bonus', amount: 500, reason: 'Weekend Bonus', date: new Date().toISOString() },
        { id: '2', type: 'bonus', amount: 200, reason: 'On-Time Delivery Bonus', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '3', type: 'incentive', amount: 300, reason: '10 Deliveries Completed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      ]);
      
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'CONFIRMED': 'bg-emerald-500/10 text-emerald-600',
      'DELIVERED': 'bg-green-500/10 text-green-600',
      'CANCELLED': 'bg-red-500/10 text-red-600',
      'FAILED': 'bg-orange-500/10 text-orange-600'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500/10 text-gray-600';
  };

  const COLORS = ['#e50986', '#ac286f', '#b45287', '#e6a3ca'];

  // Prepare chart data
  const chartData = dailyEarnings.map(day => ({
    date: formatDate(day.date),
    earnings: day.earnings,
    deliveries: day.deliveries
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Wallet className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Delivery Earnings
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Track your earnings, bonuses, and performance
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">{summary.totalDeliveries} Total Deliveries</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Award className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">{formatCurrency(summary.averagePerDelivery)} Avg/Delivery</span>
              </div>
              <button
                onClick={fetchEarningsData}
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Balance Card */}
        <div className="relative mb-12 overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-white/80 text-sm mb-2">Available Balance</p>
                <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                  {formatCurrency(summary.availableBalance)}
                </p>
                <div className="flex items-center space-x-4 text-white/80 text-sm">
                  <span>Total Earned: {formatCurrency(summary.totalEarnings)}</span>
                  <span>•</span>
                  <span>Pending: {formatCurrency(summary.pendingWithdrawals)}</span>
                  <span>•</span>
                  <span>Withdrawn: {formatCurrency(summary.completedWithdrawals)}</span>
                </div>
              </div>
              
              <Link
                href="/delivery/withdraw"
                className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 group"
              >
                <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Withdraw Funds</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">Today</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {formatCurrency(summary.todayEarnings)}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Today's earnings</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">This Week</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {formatCurrency(summary.weekEarnings)}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Weekly earnings</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">This Month</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {formatCurrency(summary.monthEarnings)}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Monthly earnings</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">Average</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {formatCurrency(summary.averagePerDelivery)}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Per delivery</p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--color-text)]">Delivery Stats</h3>
              <Package className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Total Deliveries</span>
                <span className="font-semibold text-[var(--color-text)]">{summary.totalDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Successful</span>
                <span className="font-semibold text-green-600">{summary.successfulDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Cancelled/Failed</span>
                <span className="font-semibold text-red-600">{summary.cancelledDeliveries}</span>
              </div>
              <div className="pt-3 border-t border-[var(--color-border)]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Success Rate</span>
                  <span className="font-semibold text-[var(--color-primary)]">
                    {summary.totalDeliveries > 0 
                      ? Math.round((summary.successfulDeliveries / summary.totalDeliveries) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--color-text)]">Bonuses & Incentives</h3>
              <Gift className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            {bonuses.length > 0 ? (
              <div className="space-y-3">
                {bonuses.map((bonus) => (
                  <div key={bonus.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{bonus.reason}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{formatDate(bonus.date)}</p>
                    </div>
                    <span className="text-green-600 font-semibold">+{formatCurrency(bonus.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[var(--color-text-muted)] py-4">No bonuses yet</p>
            )}
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--color-text)]">Performance</h3>
              <Zap className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Daily Average</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {formatCurrency(summary.weekEarnings / 7)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Weekly Target</span>
                <span className="font-semibold text-[var(--color-text)]">5,000 KES</span>
              </div>
              <div className="pt-3">
                <div className="bg-[var(--color-border)] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((summary.weekEarnings / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  {Math.round((summary.weekEarnings / 5000) * 100)}% of weekly target
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Earnings Overview
              </h2>
              <p className="text-[var(--color-text-muted)] mt-1">Daily earnings and delivery count</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="flex bg-[var(--color-background-soft)] rounded-lg p-1">
                <button
                  onClick={() => setShowChart('area')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    showChart === 'area' 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowChart('bar')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    showChart === 'bar' 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {showChart === 'area' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e50986" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e50986" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '12px'
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#e50986"
                    strokeWidth={2}
                    fill="url(#colorEarnings)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '12px'
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Bar dataKey="earnings" fill="#e50986" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                  Recent Deliveries
                </h2>
                <p className="text-[var(--color-text-muted)] mt-1">Your latest completed deliveries</p>
              </div>
              <Link
                href="/delivery/history"
                className="text-[var(--color-primary)] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-[var(--color-border)]">
            {recentDeliveries.map((delivery) => (
              <div key={delivery._id} className="p-6 hover:bg-[var(--color-background-soft)] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                      <Package className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text)]">Order #{delivery.orderId}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{formatDate(delivery.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(delivery.deliveryFee)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                    <Link
                      href={`/delivery/orders/${delivery._id}`}
                      className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Card */}
        <div className="mt-12 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/20 rounded-full">
                <Rocket className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">Keep Going! 🚀</h3>
                <p className="text-[var(--color-text-muted)]">
                  You're {formatCurrency(5000 - summary.weekEarnings)} away from this week's target
                </p>
              </div>
            </div>
            <Link
              href="/delivery/assignments"
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105"
            >
              Accept New Deliveries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}