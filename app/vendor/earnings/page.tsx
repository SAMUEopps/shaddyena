/*'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import WithdrawalRequestModal from '@/components/WithdrawalRequestModal';
import AvailableFunds from '@/components/AvailableFunds';
import { OrderService } from '@/components/orders/details/services/orderService';
import type { Order as ImportedOrder, Suborder as ImportedSuborder } from '@/components/orders/details/types/orders';
import {
  TrendingUp,
  Wallet,
  Clock,
  Lock,
  Gift,
  Package,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  ShoppingBag,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  User,
  MapPin,
  Phone,
  CreditCard
} from 'lucide-react';

// Types
interface VendorOrder {
  order: ImportedOrder;
  suborder: ImportedSuborder;
}

interface EarningsData {
  totalEarnings: number;
  totalOrders: number;
  averageOrderValue: number;
  balance: {
    available: number;
    pendingWithdrawals: number;
    netAvailable: number;
    locked: number;
    referral: number;
  };
  monthlyEarnings: Array<{
    month: string;
    earnings: number;
    orders: number;
  }>;
  topProducts: Array<{
    productName: string;
    totalRevenue: number;
    quantitySold: number;
  }>;
  recentTransactions: Array<{
    orderId: string;
    date: string;
    amount: number;
    commission: number;
    netAmount: number;
    status: string;
    customerName: string;
    isWithdrawable: boolean;
    suborderId?: string;
  }>;
}

interface Withdrawal {
  _id: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  type: 'IMMEDIATE' | 'REGULAR';
  reason?: string;
  adminNotes?: string;
  mpesaReceipt?: string;
  vendor: {
    mpesaNumber: string;
    name: string;
    businessName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AvailableFund {
  _id: string;
  orderId: string;
  amount: number;
  netAmount: number;
  type: string;
  metadata: {
    isImmediateRelease?: boolean;
    percentage?: number;
    holdUntil?: string;
    breakdown?: {
      totalAmount: number;
      commission: number;
      vendorEarnings: number;
      immediateRelease: number;
      remaining20Percent: number;
    };
  };
  scheduledAt: string;
  withdrawalStatus: string;
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick, buttonText }: any) => (
  <div className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-xl transition-all duration-300 hover:border-[var(--color-primary)]/30">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-2">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color === 'text-green-600' ? 'from-green-500/10 to-emerald-500/10' : 
        color === 'text-yellow-600' ? 'from-yellow-500/10 to-amber-500/10' :
        color === 'text-blue-600' ? 'from-blue-500/10 to-cyan-500/10' :
        color === 'text-purple-600' ? 'from-purple-500/10 to-pink-500/10' :
        'from-gray-500/10 to-slate-500/10'} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    {onClick && (
      <button
        onClick={onClick}
        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
      >
        {buttonText || 'Request Withdrawal'}
      </button>
    )}
    {buttonText === 'View Locked Funds' && (
      <Link
        href="/vendor/locked-funds"
        className="inline-block mt-4 w-full text-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300"
      >
        View Locked Funds
      </Link>
    )}
  </div>
);

// Main Component
export default function OrderPaymentsTab() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [availableFunds, setAvailableFunds] = useState<AvailableFund[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalTab, setWithdrawalTab] = useState<'history' | 'available'>('history');
  const [activeTab, setActiveTab] = useState<'earnings' | 'orders'>('earnings');
  const [refreshKey, setRefreshKey] = useState(0);
  const [riders, setRiders] = useState<Array<{ _id: string; firstName: string; lastName: string; phone?: string }>>([]);
  const [selectedRiders, setSelectedRiders] = useState<Record<string, string>>({}); 
  const [assigningRider, setAssigningRider] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    if (!user || user.role !== 'vendor') return;

    try {
      setLoading(true);
      setError(null);
      
      const earningsParams = new URLSearchParams({ dateRange, status: statusFilter });
      const earningsResponse = await fetch(`/api/vendor/earnings?${earningsParams}`);
      if (!earningsResponse.ok) throw new Error('Failed to fetch earnings');
      const earnings = await earningsResponse.json();

      const withdrawalsResponse = await fetch('/api/vendor/withdraw');
      if (!withdrawalsResponse.ok) throw new Error('Failed to fetch withdrawals');
      const withdrawalData = await withdrawalsResponse.json();

      const fundsResponse = await fetch('/api/vendor/funds/available');
      if (!fundsResponse.ok) throw new Error('Failed to fetch available funds');
      const funds = await fundsResponse.json();

      setEarningsData({
        ...earnings,
        balance: withdrawalData.balance || {
          available: 0, pendingWithdrawals: 0, netAvailable: 0, locked: 0, referral: 0
        }
      });
      setWithdrawals(withdrawalData.withdrawals || []);
      setAvailableFunds(funds || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user, dateRange, statusFilter, refreshKey]);

  const fetchOrders = async () => {
    if (!user || user.role !== 'vendor') return;
    
    setOrdersLoading(true);
    try {
      const data = await OrderService.fetchOrders('/api/orders/vendor', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const flattened: VendorOrder[] = [];
      data.orders.forEach((order: any) => {
        order.suborders.forEach((suborder: any) => {
          flattened.push({ order, suborder });
        });
      });
      setVendorOrders(flattened);
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const response = await fetch('/api/riders/available');
      if (response.ok) {
        const data = await response.json();
        setRiders(data.riders || []);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'vendor') { router.push('/unauthorized'); return; }
    fetchRiders();
    if (activeTab === 'earnings') fetchData();
    else fetchOrders();
  }, [user, isLoading, activeTab, currentPage, statusFilter, searchTerm, refreshKey]);

  const handleMarkAsReady = async (orderId: string, suborderId: string) => {
    try {
      await OrderService.markAsReadyForPickup(orderId, suborderId);
      await fetchOrders();
    } catch (error) {
      setError('Failed to mark order as ready for pickup');
    }
  };

  const handleRiderAssignment = async (orderId: string, suborderId: string) => {
    const riderId = selectedRiders[suborderId];
    if (!riderId) { alert('Please select a rider first'); return; }

    setAssigningRider(prev => ({ ...prev, [suborderId]: true }));
    try {
      await OrderService.assignRider(orderId, suborderId, riderId, 0);
      await fetchOrders();
      setSelectedRiders(prev => ({ ...prev, [suborderId]: '' }));
      alert('Rider assigned successfully!');
    } catch (error) {
      setError('Failed to assign rider');
    } finally {
      setAssigningRider(prev => ({ ...prev, [suborderId]: false }));
    }
  };

  const getStats = () => ({
    total: vendorOrders.length,
    pending: vendorOrders.filter(vo => vo.suborder.status === 'PENDING').length,
    processing: vendorOrders.filter(vo => vo.suborder.status === 'PROCESSING').length,
    readyForPickup: vendorOrders.filter(vo => vo.suborder.status === 'READY_FOR_PICKUP').length,
    shipped: vendorOrders.filter(vo => vo.suborder.status === 'SHIPPED').length,
    delivered: vendorOrders.filter(vo => vo.suborder.status === 'DELIVERED').length,
    cancelled: vendorOrders.filter(vo => vo.suborder.status === 'CANCELLED').length,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-16 h-16 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') return null;

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header *
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">Vendor Dashboard</h1>
          </div>
          <p className="text-[var(--color-text-muted)]">Manage your orders, earnings and withdrawal requests</p>
        </div>

        {/* Main Tabs *
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] mb-8 overflow-hidden">
          <div className="border-b border-[var(--color-border)]">
            <nav className="flex gap-1 p-1">
              <button
                onClick={() => setActiveTab('earnings')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === 'earnings'
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                }`}
              >
                Earnings & Payments
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                }`}
              >
                Order Management
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'earnings' ? (
              <EarningsView
                earningsData={earningsData}
                withdrawals={withdrawals}
                availableFunds={availableFunds}
                selectedFunds={selectedFunds}
                withdrawalTab={withdrawalTab}
                loading={loading}
                error={error}
                dateRange={dateRange}
                statusFilter={statusFilter}
                user={user}
                onDateRangeChange={setDateRange}
                onStatusFilterChange={setStatusFilter}
                onFundSelection={(id: string) => setSelectedFunds(prev => 
                  prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
                )}
                onSelectAllAvailable={() => {
                  const available = availableFunds.filter(f => f.withdrawalStatus === 'AVAILABLE');
                  setSelectedFunds(prev => prev.length === available.length ? [] : available.map(f => f._id));
                }}
                onWithdrawalClick={() => setShowWithdrawalModal(true)}
                onWithdrawalTabChange={setWithdrawalTab}
                onRefresh={() => setRefreshKey(prev => prev + 1)}
              />
            ) : (
              <OrdersView
                vendorOrders={vendorOrders}
                ordersLoading={ordersLoading}
                error={error}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                totalOrders={totalOrders}
                stats={stats}
                selectedRiders={selectedRiders}
                assigningRider={assigningRider}
                riders={riders}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onPageChange={setCurrentPage}
                onRefresh={fetchOrders}
                onMarkAsReady={handleMarkAsReady}
                onRiderAssignment={handleRiderAssignment}
                onSelectedRiderChange={(suborderId: string, riderId: string) => 
                  setSelectedRiders(prev => ({ ...prev, [suborderId]: riderId }))
                }
              />
            )}
          </div>
        </div>

        {/* Withdrawal Modal *
        {showWithdrawalModal && (
          <WithdrawalRequestModal
            selectedFunds={selectedFunds.map(id => availableFunds.find(f => f._id === id)!).filter(Boolean)}
            onClose={() => {
              setShowWithdrawalModal(false);
              setSelectedFunds([]);
            }}
            onSuccess={() => {
              setShowWithdrawalModal(false);
              setSelectedFunds([]);
              setRefreshKey(prev => prev + 1);
            }}
            defaultMpesaNumber={user.mpesaNumber || ''}
          />
        )}
      </div>
    </div>
  );
}

// Earnings View Component
function EarningsView({
  earningsData,
  withdrawals,
  availableFunds,
  selectedFunds,
  withdrawalTab,
  loading,
  error,
  dateRange,
  statusFilter,
  user,
  onDateRangeChange,
  onStatusFilterChange,
  onFundSelection,
  onSelectAllAvailable,
  onWithdrawalClick,
  onWithdrawalTabChange,
  onRefresh
}: any) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-[var(--color-text-muted)]">Loading earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
        <p className="text-red-500/80 mb-4">{error}</p>
        <button 
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
        <p className="text-yellow-600">No earnings data available</p>
        <button onClick={onRefresh} className="mt-4 px-5 py-2.5 bg-yellow-500 text-white rounded-xl">Refresh</button>
      </div>
    );
  }

  const totalSelectedAmount = selectedFunds.reduce((sum: number, id: string) => {
    const fund = availableFunds.find((f: any) => f._id === id);
    return sum + (fund?.netAmount || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid *
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard 
          title="Available Balance" 
          value={`KSh ${earningsData.balance.available.toLocaleString()}`}
          icon={Wallet}
          color="text-green-600"
          onClick={onWithdrawalClick}
          buttonText="Request Withdrawal"
          subtitle={earningsData.balance.netAvailable > 0 ? `${earningsData.balance.netAvailable.toLocaleString()} KSh withdrawable` : ''}
        />
        <StatCard 
          title="Pending Withdrawals" 
          value={`KSh ${earningsData.balance.pendingWithdrawals.toLocaleString()}`}
          icon={Clock}
          color="text-yellow-600"
          subtitle="Awaiting admin approval"
        />
        <StatCard 
          title="Locked Funds" 
          value={`KSh ${earningsData.balance.locked.toLocaleString()}`}
          icon={Lock}
          color="text-blue-600"
          buttonText="View Locked Funds"
          subtitle="Available after delivery"
        />
        <StatCard 
          title="Referral Earnings" 
          value={`KSh ${earningsData.balance.referral.toLocaleString()}`}
          icon={Gift}
          color="text-purple-600"
          subtitle="From referred vendors"
        />
        <StatCard 
          title="Total Orders" 
          value={earningsData.totalOrders}
          icon={Package}
          color="text-gray-600"
        />
      </div>

      {/* Withdrawal Tabs *
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => onWithdrawalTabChange('history')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                withdrawalTab === 'history'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
              }`}
            >
              Withdrawal History
            </button>
            <button
              onClick={() => onWithdrawalTabChange('available')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                withdrawalTab === 'available'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
              }`}
            >
              Available Funds ({availableFunds.filter((f: any) => f.withdrawalStatus === 'AVAILABLE').length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {withdrawalTab === 'history' ? (
            <WithdrawalHistory withdrawals={withdrawals} />
          ) : (
            <AvailableFunds 
              funds={availableFunds}
              selectedFunds={selectedFunds}
              onSelectFund={onFundSelection}
              onSelectAll={onSelectAllAvailable}
              onRequestWithdrawal={onWithdrawalClick}
              totalSelected={totalSelectedAmount}
            />
          )}
        </div>
      </div>

      {/* Filters *
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
              Date Range
            </label>
            <select 
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--color-primary)]" />
              Order Status
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart *
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
            Monthly Earnings
          </h2>
          <div className="h-64">
            {earningsData.monthlyEarnings?.length > 0 ? (
              <div className="flex items-end justify-between h-full space-x-2">
                {earningsData.monthlyEarnings.map((month: any, index: number) => {
                  const maxEarning = Math.max(...earningsData.monthlyEarnings.map((m: any) => m.earnings || 0), 1);
                  const height = Math.max(20, (month.earnings / maxEarning) * 200);
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full">
                        <div 
                          className="bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            KSh {month.earnings.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-3">{month.month}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[var(--color-text-muted)]">No monthly earnings data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products *
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--color-primary)]" />
            Top Products
          </h2>
          {earningsData.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {earningsData.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--color-background-soft)] rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">{product.productName}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{product.quantitySold} units sold</p>
                  </div>
                  <p className="text-sm font-bold text-[var(--color-primary)]">
                    KSh {product.totalRevenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-[var(--color-text-muted)]">No top products data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions *
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--color-primary)]" />
            Recent Transactions
          </h2>
        </div>
        {earningsData.recentTransactions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-background-soft)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Net Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {earningsData.recentTransactions.map((transaction: any, index: number) => (
                  <tr key={index} className="hover:bg-[var(--color-background-soft)] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[var(--color-text)]">{transaction.orderId}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">{transaction.customerName}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">KSh {transaction.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-red-500">-KSh {transaction.commission.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">KSh {transaction.netAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                        transaction.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-600' :
                        transaction.status === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-gray-500/10 text-gray-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-[var(--color-text-muted)]">No recent transactions available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Orders View Component
function OrdersView({
  vendorOrders,
  ordersLoading,
  error,
  searchTerm,
  statusFilter,
  currentPage,
  totalPages,
  totalOrders,
  stats,
  selectedRiders,
  assigningRider,
  riders,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onRefresh,
  onMarkAsReady,
  onRiderAssignment,
  onSelectedRiderChange
}: any) {
  if (ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-[var(--color-text-muted)]">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header *
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Vendor Orders</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{totalOrders} total orders</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search order ID or customer..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 w-full sm:w-64"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <button
            onClick={onRefresh}
            className="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>
      
      {/* Stats Cards *
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Total</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Ready</p>
          <p className="text-2xl font-bold text-purple-600">{stats.readyForPickup}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Shipped</p>
          <p className="text-2xl font-bold text-cyan-600">{stats.shipped}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>
      
      {/* Orders Table *
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {vendorOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
              <Package className="w-12 h-12 text-[var(--color-text-muted)]/50" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No vendor orders yet</h3>
            <p className="text-[var(--color-text-muted)]">You haven't received any orders from customers yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Items & Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {vendorOrders.map((vendorOrder: VendorOrder, idx: number) => {
                    const { order, suborder } = vendorOrder;
                    const riderId = suborder.riderId?.toString();
                    const itemCount = suborder.items?.length || order.items.filter((i: any) => i.vendorId === suborder.vendorId).length;
                    
                    return (
                      <tr key={`${order._id}-${suborder.vendorId}`} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm font-medium text-[var(--color-text)]">{order.orderId}</div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-1">{itemCount} item(s)</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                          {OrderService.formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-[var(--color-text)]">{OrderService.getBuyerName(order.buyerId)}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">{order.shipping.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-[var(--color-primary)]">
                            {OrderService.formatCurrency(suborder.netAmount, order.currency)}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Gross: {OrderService.formatCurrency(suborder.amount, order.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              suborder.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                              suborder.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600' :
                              suborder.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-600' :
                              suborder.status === 'IN_TRANSIT' ? 'bg-cyan-500/10 text-cyan-600' :
                              suborder.status === 'READY_FOR_PICKUP' ? 'bg-purple-500/10 text-purple-600' :
                              suborder.status === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-600' :
                              suborder.status === 'PENDING' ? 'bg-gray-500/10 text-gray-600' :
                              'bg-red-500/10 text-red-600'
                            }`}>
                              {suborder.status === 'READY_FOR_PICKUP' ? 'Ready for Pickup' : suborder.status}
                            </span>
                            {riderId && <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Truck className="w-3 h-3" /> Rider assigned</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/orders/${order._id}?vendorView=true&suborderId=${suborder._id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Link>
                            
                            {suborder.status === 'PROCESSING' && (
                              <button
                                onClick={() => onMarkAsReady(order._id, suborder._id || '')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:opacity-90 transition-all duration-300"
                              >
                                <Package className="w-3.5 h-3.5" />
                                Mark Ready
                              </button>
                            )}

                            {suborder.status === 'READY_FOR_PICKUP' && !riderId && (
                              <div className="flex items-center gap-2">
                                <select
                                  value={selectedRiders[suborder._id || ''] || ''}
                                  onChange={(e) => onSelectedRiderChange(suborder._id || '', e.target.value)}
                                  className="px-2 py-1.5 text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                                  disabled={assigningRider[suborder._id || '']}
                                >
                                  <option value="">Select Rider</option>
                                  {riders.map((rider: any) => (
                                    <option key={rider._id} value={rider._id}>
                                      {rider.firstName} {rider.lastName}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => onRiderAssignment(order._id, suborder._id || '')}
                                  disabled={!selectedRiders[suborder._id || ''] || assigningRider[suborder._id || '']}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                                >
                                  {assigningRider[suborder._id || ''] ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Truck className="w-3.5 h-3.5" />
                                  )}
                                  Assign
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination *
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="text-sm text-[var(--color-text-muted)]">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Withdrawal History Component
function WithdrawalHistory({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
          <Clock className="w-12 h-12 text-[var(--color-text-muted)]/50" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No withdrawal history</h3>
        <p className="text-[var(--color-text-muted)]">You haven't made any withdrawal requests yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[var(--color-background-soft)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">MPESA</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
              <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                {new Date(withdrawal.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-mono text-[var(--color-text)]">{withdrawal.orderId}</td>
              <td className="px-6 py-4 text-sm font-semibold text-[var(--color-text)]">
                KSh {withdrawal.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  withdrawal.type === 'IMMEDIATE' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  {withdrawal.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  withdrawal.status === 'PROCESSED' ? 'bg-green-500/10 text-green-600' :
                  withdrawal.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-600' :
                  withdrawal.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-red-500/10 text-red-600'
                }`}>
                  {withdrawal.status}
                </span>
                {withdrawal.adminNotes && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{withdrawal.adminNotes}</p>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                {withdrawal.vendor.mpesaNumber}
                {withdrawal.mpesaReceipt && (
                  <p className="text-xs text-green-600 mt-1">Receipt: {withdrawal.mpesaReceipt}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import WithdrawalRequestModal from '@/components/WithdrawalRequestModal';
import AvailableFunds from '@/components/AvailableFunds';
import { OrderService } from '@/components/orders/details/services/orderService';
import type { Order as ImportedOrder, Suborder as ImportedSuborder } from '@/components/orders/details/types/orders';
import {
  TrendingUp,
  Wallet,
  Clock,
  Lock,
  Gift,
  Package,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  ShoppingBag,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  User,
  MapPin,
  Phone,
  CreditCard
} from 'lucide-react';

// Types
interface VendorOrder {
  order: ImportedOrder;
  suborder: ImportedSuborder;
}

interface EarningsData {
  totalEarnings: number;
  totalOrders: number;
  averageOrderValue: number;
  balance: {
    available: number;
    pendingWithdrawals: number;
    netAvailable: number;
    locked: number;
    referral: number;
  };
  monthlyEarnings: Array<{
    month: string;
    earnings: number;
    orders: number;
  }>;
  topProducts: Array<{
    productName: string;
    totalRevenue: number;
    quantitySold: number;
  }>;
  recentTransactions: Array<{
    orderId: string;
    date: string;
    amount: number;
    commission: number;
    netAmount: number;
    status: string;
    customerName: string;
    isWithdrawable: boolean;
    suborderId?: string;
  }>;
}

interface Withdrawal {
  _id: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  type: 'IMMEDIATE' | 'REGULAR';
  reason?: string;
  adminNotes?: string;
  mpesaReceipt?: string;
  vendor: {
    mpesaNumber: string;
    name: string;
    businessName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AvailableFund {
  _id: string;
  orderId: string;
  amount: number;
  netAmount: number;
  type: string;
  metadata: {
    isImmediateRelease?: boolean;
    percentage?: number;
    holdUntil?: string;
    breakdown?: {
      totalAmount: number;
      commission: number;
      vendorEarnings: number;
      immediateRelease: number;
      remaining20Percent: number;
    };
  };
  scheduledAt: string;
  withdrawalStatus: string;
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick, buttonText }: any) => (
  <div className="group bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 hover:border-[var(--color-primary)]/30">
    <div className="flex items-start justify-between gap-2 xs:gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium text-[var(--color-text-muted)] truncate">{title}</p>
        <p className={`text-sm xs:text-base sm:text-lg md:text-2xl font-bold ${color} mt-0.5 xs:mt-1 break-words`}>{value}</p>
        {subtitle && <p className="text-[7px] xs:text-[8px] sm:text-[10px] md:text-xs text-[var(--color-text-muted)] mt-1 xs:mt-1.5 sm:mt-2 truncate">{subtitle}</p>}
      </div>
      <div className={`p-1.5 xs:p-2 sm:p-2.5 md:p-3 rounded-lg xs:rounded-xl bg-gradient-to-br ${color === 'text-green-600' ? 'from-green-500/10 to-emerald-500/10' : 
        color === 'text-yellow-600' ? 'from-yellow-500/10 to-amber-500/10' :
        color === 'text-blue-600' ? 'from-blue-500/10 to-cyan-500/10' :
        color === 'text-purple-600' ? 'from-purple-500/10 to-pink-500/10' :
        'from-gray-500/10 to-slate-500/10'} group-hover:scale-110 transition-transform flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${color}`} />
      </div>
    </div>
    {onClick && (
      <button
        onClick={onClick}
        className="mt-3 xs:mt-3.5 sm:mt-4 w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
      >
        {buttonText || 'Request Withdrawal'}
      </button>
    )}
    {buttonText === 'View Locked Funds' && (
      <Link
        href="/vendor/locked-funds"
        className="inline-block mt-3 xs:mt-3.5 sm:mt-4 w-full text-center px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs font-medium hover:bg-blue-700 transition-all duration-300"
      >
        View Locked Funds
      </Link>
    )}
  </div>
);

// Main Component
export default function OrderPaymentsTab() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [availableFunds, setAvailableFunds] = useState<AvailableFund[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalTab, setWithdrawalTab] = useState<'history' | 'available'>('history');
  const [activeTab, setActiveTab] = useState<'earnings' | 'orders'>('earnings');
  const [refreshKey, setRefreshKey] = useState(0);
  const [riders, setRiders] = useState<Array<{ _id: string; firstName: string; lastName: string; phone?: string }>>([]);
  const [selectedRiders, setSelectedRiders] = useState<Record<string, string>>({}); 
  const [assigningRider, setAssigningRider] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    if (!user || user.role !== 'vendor') return;

    try {
      setLoading(true);
      setError(null);
      
      const earningsParams = new URLSearchParams({ dateRange, status: statusFilter });
      const earningsResponse = await fetch(`/api/vendor/earnings?${earningsParams}`);
      if (!earningsResponse.ok) throw new Error('Failed to fetch earnings');
      const earnings = await earningsResponse.json();

      const withdrawalsResponse = await fetch('/api/vendor/withdraw');
      if (!withdrawalsResponse.ok) throw new Error('Failed to fetch withdrawals');
      const withdrawalData = await withdrawalsResponse.json();

      const fundsResponse = await fetch('/api/vendor/funds/available');
      if (!fundsResponse.ok) throw new Error('Failed to fetch available funds');
      const funds = await fundsResponse.json();

      setEarningsData({
        ...earnings,
        balance: withdrawalData.balance || {
          available: 0, pendingWithdrawals: 0, netAvailable: 0, locked: 0, referral: 0
        }
      });
      setWithdrawals(withdrawalData.withdrawals || []);
      setAvailableFunds(funds || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user, dateRange, statusFilter, refreshKey]);

  const fetchOrders = async () => {
    if (!user || user.role !== 'vendor') return;
    
    setOrdersLoading(true);
    try {
      const data = await OrderService.fetchOrders('/api/orders/vendor', {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const flattened: VendorOrder[] = [];
      data.orders.forEach((order: any) => {
        order.suborders.forEach((suborder: any) => {
          flattened.push({ order, suborder });
        });
      });
      setVendorOrders(flattened);
      setTotalPages(data.totalPages);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const response = await fetch('/api/riders/available');
      if (response.ok) {
        const data = await response.json();
        setRiders(data.riders || []);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'vendor') { router.push('/unauthorized'); return; }
    fetchRiders();
    if (activeTab === 'earnings') fetchData();
    else fetchOrders();
  }, [user, isLoading, activeTab, currentPage, statusFilter, searchTerm, refreshKey]);

  const handleMarkAsReady = async (orderId: string, suborderId: string) => {
    try {
      await OrderService.markAsReadyForPickup(orderId, suborderId);
      await fetchOrders();
    } catch (error) {
      setError('Failed to mark order as ready for pickup');
    }
  };

  const handleRiderAssignment = async (orderId: string, suborderId: string) => {
    const riderId = selectedRiders[suborderId];
    if (!riderId) { alert('Please select a rider first'); return; }

    setAssigningRider(prev => ({ ...prev, [suborderId]: true }));
    try {
      await OrderService.assignRider(orderId, suborderId, riderId, 0);
      await fetchOrders();
      setSelectedRiders(prev => ({ ...prev, [suborderId]: '' }));
      alert('Rider assigned successfully!');
    } catch (error) {
      setError('Failed to assign rider');
    } finally {
      setAssigningRider(prev => ({ ...prev, [suborderId]: false }));
    }
  };

  const getStats = () => ({
    total: vendorOrders.length,
    pending: vendorOrders.filter(vo => vo.suborder.status === 'PENDING').length,
    processing: vendorOrders.filter(vo => vo.suborder.status === 'PROCESSING').length,
    readyForPickup: vendorOrders.filter(vo => vo.suborder.status === 'READY_FOR_PICKUP').length,
    shipped: vendorOrders.filter(vo => vo.suborder.status === 'SHIPPED').length,
    delivered: vendorOrders.filter(vo => vo.suborder.status === 'DELIVERED').length,
    cancelled: vendorOrders.filter(vo => vo.suborder.status === 'CANCELLED').length,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 xs:border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') return null;

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-5 xs:mb-6 sm:mb-7 md:mb-8">
          <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-1 xs:mb-1.5 sm:mb-2">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl">
              <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text)]">Vendor Dashboard</h1>
          </div>
          <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)]">Manage your orders, earnings and withdrawal requests</p>
        </div>

        {/* Main Tabs */}
        <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] mb-6 xs:mb-7 sm:mb-8 overflow-hidden">
          <div className="border-b border-[var(--color-border)]">
            <nav className="flex gap-0.5 xs:gap-1 p-1 xs:p-1.5">
              <button
                onClick={() => setActiveTab('earnings')}
                className={`flex-1 py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium rounded-lg xs:rounded-xl transition-all duration-300 ${
                  activeTab === 'earnings'
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                }`}
              >
                Earnings & Payments
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium rounded-lg xs:rounded-xl transition-all duration-300 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                }`}
              >
                Order Management
              </button>
            </nav>
          </div>

          <div className="p-3 xs:p-4 sm:p-5 md:p-6">
            {activeTab === 'earnings' ? (
              <EarningsView
                earningsData={earningsData}
                withdrawals={withdrawals}
                availableFunds={availableFunds}
                selectedFunds={selectedFunds}
                withdrawalTab={withdrawalTab}
                loading={loading}
                error={error}
                dateRange={dateRange}
                statusFilter={statusFilter}
                user={user}
                onDateRangeChange={setDateRange}
                onStatusFilterChange={setStatusFilter}
                onFundSelection={(id: string) => setSelectedFunds(prev => 
                  prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
                )}
                onSelectAllAvailable={() => {
                  const available = availableFunds.filter(f => f.withdrawalStatus === 'AVAILABLE');
                  setSelectedFunds(prev => prev.length === available.length ? [] : available.map(f => f._id));
                }}
                onWithdrawalClick={() => setShowWithdrawalModal(true)}
                onWithdrawalTabChange={setWithdrawalTab}
                onRefresh={() => setRefreshKey(prev => prev + 1)}
              />
            ) : (
              <OrdersView
                vendorOrders={vendorOrders}
                ordersLoading={ordersLoading}
                error={error}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                totalOrders={totalOrders}
                stats={stats}
                selectedRiders={selectedRiders}
                assigningRider={assigningRider}
                riders={riders}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onPageChange={setCurrentPage}
                onRefresh={fetchOrders}
                onMarkAsReady={handleMarkAsReady}
                onRiderAssignment={handleRiderAssignment}
                onSelectedRiderChange={(suborderId: string, riderId: string) => 
                  setSelectedRiders(prev => ({ ...prev, [suborderId]: riderId }))
                }
              />
            )}
          </div>
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawalModal && (
          <WithdrawalRequestModal
            selectedFunds={selectedFunds.map(id => availableFunds.find(f => f._id === id)!).filter(Boolean)}
            onClose={() => {
              setShowWithdrawalModal(false);
              setSelectedFunds([]);
            }}
            onSuccess={() => {
              setShowWithdrawalModal(false);
              setSelectedFunds([]);
              setRefreshKey(prev => prev + 1);
            }}
            defaultMpesaNumber={user.mpesaNumber || ''}
          />
        )}
      </div>
    </div>
  );
}

// Earnings View Component
function EarningsView({
  earningsData,
  withdrawals,
  availableFunds,
  selectedFunds,
  withdrawalTab,
  loading,
  error,
  dateRange,
  statusFilter,
  user,
  onDateRangeChange,
  onStatusFilterChange,
  onFundSelection,
  onSelectAllAvailable,
  onWithdrawalClick,
  onWithdrawalTabChange,
  onRefresh
}: any) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 xs:py-16 sm:py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 border-3 xs:border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <p className="mt-3 xs:mt-4 text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)]">Loading earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl xs:rounded-2xl p-6 xs:p-7 sm:p-8 text-center">
        <AlertCircle className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 xs:mb-4" />
        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-red-600 mb-2">Error Loading Data</h3>
        <p className="text-xs xs:text-sm text-red-500/80 mb-3 xs:mb-4">{error}</p>
        <button 
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-red-500 text-white rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm hover:bg-red-600 transition-all duration-300"
        >
          <RefreshCw className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl xs:rounded-2xl p-6 xs:p-7 sm:p-8 text-center">
        <p className="text-xs xs:text-sm text-yellow-600">No earnings data available</p>
        <button onClick={onRefresh} className="mt-3 xs:mt-4 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-yellow-500 text-white rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm">Refresh</button>
      </div>
    );
  }

  const totalSelectedAmount = selectedFunds.reduce((sum: number, id: string) => {
    const fund = availableFunds.find((f: any) => f._id === id);
    return sum + (fund?.netAmount || 0);
  }, 0);

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6">
      {/* Stats Grid - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-5">
        <StatCard 
          title="Available Balance" 
          value={`KSh ${earningsData.balance.available.toLocaleString()}`}
          icon={Wallet}
          color="text-green-600"
          onClick={onWithdrawalClick}
          buttonText="Request Withdrawal"
          subtitle={earningsData.balance.netAvailable > 0 ? `${earningsData.balance.netAvailable.toLocaleString()} KSh withdrawable` : ''}
        />
        <StatCard 
          title="Pending Withdrawals" 
          value={`KSh ${earningsData.balance.pendingWithdrawals.toLocaleString()}`}
          icon={Clock}
          color="text-yellow-600"
          subtitle="Awaiting admin approval"
        />
        <StatCard 
          title="Locked Funds" 
          value={`KSh ${earningsData.balance.locked.toLocaleString()}`}
          icon={Lock}
          color="text-blue-600"
          buttonText="View Locked Funds"
          subtitle="Available after delivery"
        />
        <StatCard 
          title="Referral Earnings" 
          value={`KSh ${earningsData.balance.referral.toLocaleString()}`}
          icon={Gift}
          color="text-purple-600"
          subtitle="From referred vendors"
        />
      </div>

      {/* Withdrawal Tabs */}
      <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-0.5 xs:gap-1 p-1 xs:p-1.5">
            <button
              onClick={() => onWithdrawalTabChange('history')}
              className={`flex-1 py-1.5 xs:py-2 sm:py-2.5 px-2 xs:px-3 text-[9px] xs:text-[10px] sm:text-xs font-medium rounded-lg xs:rounded-xl transition-all duration-300 ${
                withdrawalTab === 'history'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
              }`}
            >
              Withdrawal History
            </button>
            <button
              onClick={() => onWithdrawalTabChange('available')}
              className={`flex-1 py-1.5 xs:py-2 sm:py-2.5 px-2 xs:px-3 text-[9px] xs:text-[10px] sm:text-xs font-medium rounded-lg xs:rounded-xl transition-all duration-300 ${
                withdrawalTab === 'available'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-lg'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
              }`}
            >
              Available Funds ({availableFunds.filter((f: any) => f.withdrawalStatus === 'AVAILABLE').length})
            </button>
          </div>
        </div>

        <div className="p-3 xs:p-4 sm:p-5 md:p-6">
          {withdrawalTab === 'history' ? (
            <WithdrawalHistory withdrawals={withdrawals} />
          ) : (
            <AvailableFunds 
              funds={availableFunds}
              selectedFunds={selectedFunds}
              onSelectFund={onFundSelection}
              onSelectAll={onSelectAllAvailable}
              onRequestWithdrawal={onWithdrawalClick}
              totalSelected={totalSelectedAmount}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-5">
          <div>
            <label className="block text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
              Date Range
            </label>
            <select 
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)] mb-1 xs:mb-1.5 sm:mb-2 flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <Filter className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
              Order Status
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
        <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6">
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3 xs:mb-4 flex items-center gap-1.5 xs:gap-2">
            <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
            Monthly Earnings
          </h2>
          <div className="h-48 xs:h-56 sm:h-64">
            {earningsData.monthlyEarnings?.length > 0 ? (
              <div className="flex items-end justify-between h-full space-x-1 xs:space-x-1.5 sm:space-x-2">
                {earningsData.monthlyEarnings.map((month: any, index: number) => {
                  const maxEarning = Math.max(...earningsData.monthlyEarnings.map((m: any) => m.earnings || 0), 1);
                  const height = Math.max(20, (month.earnings / maxEarning) * 200);
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full">
                        <div 
                          className="bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-6 xs:-top-7 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-[var(--color-primary)] text-white text-[8px] xs:text-[9px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            KSh {month.earnings.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-2 xs:mt-2.5 sm:mt-3">{month.month}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">No monthly earnings data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6">
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3 xs:mb-4 flex items-center gap-1.5 xs:gap-2">
            <Star className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
            Top Products
          </h2>
          {earningsData.topProducts?.length > 0 ? (
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              {earningsData.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 xs:p-2.5 sm:p-3 bg-[var(--color-background-soft)] rounded-lg xs:rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)] truncate">{product.productName}</p>
                    <p className="text-[7px] xs:text-[8px] sm:text-[10px] text-[var(--color-text-muted)]">{product.quantitySold} units sold</p>
                  </div>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-[var(--color-primary)] flex-shrink-0 ml-2">
                    KSh {product.totalRevenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 xs:h-56 sm:h-64 flex items-center justify-center">
              <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">No top products data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions - Horizontal scroll on mobile */}
      <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-3 xs:px-4 sm:px-5 md:px-6 py-3 xs:py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] flex items-center gap-1.5 xs:gap-2">
            <FileText className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
            Recent Transactions
          </h2>
        </div>
        {earningsData.recentTransactions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] xs:min-w-[700px] sm:min-w-full">
              <thead className="bg-[var(--color-background-soft)]">
                <tr>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Order ID</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Date</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Customer</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Amount</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Commission</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Net Earnings</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {earningsData.recentTransactions.map((transaction: any, index: number) => (
                  <tr key={index} className="hover:bg-[var(--color-background-soft)] transition-colors">
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs font-mono text-[var(--color-text)]">{transaction.orderId}</td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text)] truncate max-w-[100px]">{transaction.customerName}</td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text)]">KSh {transaction.amount.toLocaleString()}</td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs text-red-500">-KSh {transaction.commission.toLocaleString()}</td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs font-semibold text-green-600">KSh {transaction.netAmount.toLocaleString()}</td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                      <span className={`inline-flex items-center gap-0.5 xs:gap-1 px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-1 rounded-full text-[7px] xs:text-[8px] sm:text-[10px] font-medium ${
                        transaction.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                        transaction.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-600' :
                        transaction.status === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-gray-500/10 text-gray-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 xs:p-10 sm:p-12 text-center">
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">No recent transactions available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Orders View Component
function OrdersView({
  vendorOrders,
  ordersLoading,
  error,
  searchTerm,
  statusFilter,
  currentPage,
  totalPages,
  totalOrders,
  stats,
  selectedRiders,
  assigningRider,
  riders,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onRefresh,
  onMarkAsReady,
  onRiderAssignment,
  onSelectedRiderChange
}: any) {
  if (ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 xs:py-16 sm:py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 border-3 xs:border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <p className="mt-3 xs:mt-4 text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)]">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 xs:gap-4">
        <div>
          <h2 className="text-base xs:text-lg sm:text-xl font-bold text-[var(--color-text)]">Vendor Orders</h2>
          <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">{totalOrders} total orders</p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 xs:flex-initial">
            <Search className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-3.5 xs:h-3.5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search order..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 xs:pl-9 pr-3 xs:pr-4 py-1.5 xs:py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 w-full xs:w-48 sm:w-56"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-2 xs:px-3 py-1.5 xs:py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY_FOR_PICKUP">Ready</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <button
            onClick={onRefresh}
            className="p-1.5 xs:p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl hover:border-[var(--color-primary)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>
      
      {/* Stats Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Total</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Pending</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Processing</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Ready</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-purple-600">{stats.readyForPickup}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Shipped</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-cyan-600">{stats.shipped}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Delivered</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-3 text-center">
          <p className="text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">Cancelled</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {vendorOrders.length === 0 ? (
          <div className="p-8 xs:p-10 sm:p-12 text-center">
            <div className="inline-flex p-2.5 xs:p-3 sm:p-4 bg-[var(--color-background-soft)] rounded-full mb-3 xs:mb-4">
              <Package className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[var(--color-text-muted)]/50" />
            </div>
            <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-[var(--color-text)] mb-1 xs:mb-2">No vendor orders yet</h3>
            <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">You haven't received any orders from customers yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Order ID</th>
                    <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Date</th>
                    <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Customer</th>
                    <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Amount</th>
                    <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                    <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {vendorOrders.map((vendorOrder: VendorOrder, idx: number) => {
                    const { order, suborder } = vendorOrder;
                    const riderId = suborder.riderId?.toString();
                    const itemCount = suborder.items?.length || order.items.filter((i: any) => i.vendorId === suborder.vendorId).length;
                    
                    return (
                      <tr key={`${order._id}-${suborder.vendorId}`} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text)]">{order.orderId}</div>
                          <div className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)] mt-0.5">{itemCount} item(s)</div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">
                          {OrderService.formatDate(order.createdAt)}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text)]">{OrderService.getBuyerName(order.buyerId)}</div>
                          <div className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">{order.shipping.phone}</div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-[var(--color-primary)]">
                            {OrderService.formatCurrency(suborder.netAmount, order.currency)}
                          </div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div className="space-y-0.5 xs:space-y-1">
                            <span className={`inline-flex items-center gap-0.5 xs:gap-1 px-1 xs:px-1.5 py-0.5 rounded-full text-[7px] xs:text-[8px] font-medium ${
                              suborder.status === 'DELIVERED' ? 'bg-green-500/10 text-green-600' :
                              suborder.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600' :
                              suborder.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-600' :
                              suborder.status === 'IN_TRANSIT' ? 'bg-cyan-500/10 text-cyan-600' :
                              suborder.status === 'READY_FOR_PICKUP' ? 'bg-purple-500/10 text-purple-600' :
                              suborder.status === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-600' :
                              suborder.status === 'PENDING' ? 'bg-gray-500/10 text-gray-600' :
                              'bg-red-500/10 text-red-600'
                            }`}>
                              {suborder.status === 'READY_FOR_PICKUP' ? 'Ready' : suborder.status.substring(0, 4)}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div className="flex flex-wrap gap-1 xs:gap-1.5">
                            <Link
                              href={`/orders/${order._id}?vendorView=true&suborderId=${suborder._id}`}
                              className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 py-0.5 xs:py-1 text-[7px] xs:text-[8px] text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
                            >
                              <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                              View
                            </Link>
                            
                            {suborder.status === 'PROCESSING' && (
                              <button
                                onClick={() => onMarkAsReady(order._id, suborder._id || '')}
                                className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 py-0.5 xs:py-1 text-[7px] xs:text-[8px] text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:opacity-90 transition-all duration-300"
                              >
                                <Package className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                                Ready
                              </button>
                            )}

                            {suborder.status === 'READY_FOR_PICKUP' && !riderId && (
                              <div className="flex items-center gap-1">
                                <select
                                  value={selectedRiders[suborder._id || ''] || ''}
                                  onChange={(e) => onSelectedRiderChange(suborder._id || '', e.target.value)}
                                  className="px-1 xs:px-1.5 py-0.5 xs:py-1 text-[7px] xs:text-[8px] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                                  disabled={assigningRider[suborder._id || '']}
                                >
                                  <option value="">Select</option>
                                  {riders.map((rider: any) => (
                                    <option key={rider._id} value={rider._id}>
                                      {rider.firstName}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => onRiderAssignment(order._id, suborder._id || '')}
                                  disabled={!selectedRiders[suborder._id || ''] || assigningRider[suborder._id || '']}
                                  className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 py-0.5 xs:py-1 text-[7px] xs:text-[8px] text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                                >
                                  {assigningRider[suborder._id || ''] ? (
                                    <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Truck className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                                  )}
                                  Assign
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-4 border-t border-[var(--color-border)] flex flex-col xs:flex-row justify-between items-center gap-2 xs:gap-3">
                <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-1.5 xs:gap-2">
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 xs:p-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  </button>
                  <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 xs:p-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Withdrawal History Component
function WithdrawalHistory({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-8 xs:py-10 sm:py-12">
        <div className="inline-flex p-2.5 xs:p-3 sm:p-4 bg-[var(--color-background-soft)] rounded-full mb-3 xs:mb-4">
          <Clock className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[var(--color-text-muted)]/50" />
        </div>
        <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)] mb-1 xs:mb-2">No withdrawal history</h3>
        <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">You haven't made any withdrawal requests yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-[var(--color-background-soft)]">
          <tr>
            <th className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Date</th>
            <th className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Order ID</th>
            <th className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Amount</th>
            <th className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Type</th>
            <th className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-left text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[var(--color-text-muted)] uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
              <td className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">
                {new Date(withdrawal.createdAt).toLocaleDateString()}
              </td>
              <td className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-[8px] xs:text-[9px] sm:text-[10px] font-mono text-[var(--color-text)]">{withdrawal.orderId}</td>
              <td className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-[var(--color-text)]">
                KSh {withdrawal.amount.toLocaleString()}
              </td>
              <td className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5">
                <span className={`inline-flex items-center gap-0.5 xs:gap-1 px-1 xs:px-1.5 py-0.5 rounded-full text-[7px] xs:text-[8px] font-medium ${
                  withdrawal.type === 'IMMEDIATE' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  {withdrawal.type}
                </span>
              </td>
              <td className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5">
                <span className={`inline-flex items-center gap-0.5 xs:gap-1 px-1 xs:px-1.5 py-0.5 rounded-full text-[7px] xs:text-[8px] font-medium ${
                  withdrawal.status === 'PROCESSED' ? 'bg-green-500/10 text-green-600' :
                  withdrawal.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-600' :
                  withdrawal.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-red-500/10 text-red-600'
                }`}>
                  {withdrawal.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}