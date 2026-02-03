'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import WithdrawalRequestModal from '@/components/WithdrawalRequestModal';
import AvailableFunds from '@/components/AvailableFunds';

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

export default function VendorEarningsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [availableFunds, setAvailableFunds] = useState<AvailableFund[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalTab, setWithdrawalTab] = useState<'history' | 'available'>('history');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user || user.role !== 'vendor') return;

    try {
      setLoading(true);
      setError(null);
      
      // Fetch earnings data
      const earningsParams = new URLSearchParams({
        dateRange,
        status: statusFilter,
      });

      const earningsResponse = await fetch(`/api/vendor/earnings?${earningsParams}`);
      if (!earningsResponse.ok) {
        const errorData = await earningsResponse.json().catch(() => ({ message: 'Failed to fetch earnings' }));
        throw new Error(errorData.message || 'Failed to fetch earnings');
      }
      const earnings = await earningsResponse.json();

      // Fetch withdrawal data
      const withdrawalsResponse = await fetch('/api/vendor/withdraw');
      if (!withdrawalsResponse.ok) {
        const errorData = await withdrawalsResponse.json().catch(() => ({ message: 'Failed to fetch withdrawals' }));
        throw new Error(errorData.message || 'Failed to fetch withdrawals');
      }
      const withdrawalData = await withdrawalsResponse.json();

      // Fetch available funds
      const fundsResponse = await fetch('/api/vendor/funds/available');
      if (!fundsResponse.ok) {
        const errorData = await fundsResponse.json().catch(() => ({ message: 'Failed to fetch available funds' }));
        throw new Error(errorData.message || 'Failed to fetch available funds');
      }
      const funds = await fundsResponse.json();

      setEarningsData({
        ...earnings,
        balance: withdrawalData.balance || {
          available: 0,
          pendingWithdrawals: 0,
          netAvailable: 0,
          locked: 0,
          referral: 0
        }
      });
      setWithdrawals(withdrawalData.withdrawals || []);
      setAvailableFunds(funds || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user, dateRange, statusFilter, refreshKey]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'vendor') {
      router.push('/unauthorized');
      return;
    }
    fetchData();
  }, [user, isLoading, fetchData, router]);

  const handleDateRangeChange = (newDateRange: string) => {
    setDateRange(newDateRange);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  const handleFundSelection = (fundId: string) => {
    setSelectedFunds(prev => 
      prev.includes(fundId) 
        ? prev.filter(id => id !== fundId)
        : [...prev, fundId]
    );
  };

  const handleSelectAllAvailable = () => {
    const availableFundsFiltered = availableFunds.filter(fund => fund.withdrawalStatus === 'AVAILABLE');
    if (selectedFunds.length === availableFundsFiltered.length) {
      setSelectedFunds([]);
    } else {
      setSelectedFunds(availableFundsFiltered.map(f => f._id));
    }
  };

  const handleWithdrawalSuccess = () => {
    setShowWithdrawalModal(false);
    setSelectedFunds([]);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf2c7e]"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return null; // Router will handle redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf2c7e]"></div>
          <p className="mt-4 text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push('/vendor')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <p className="text-yellow-800">No earnings data available</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Earnings & Withdrawals</h1>
          <p className="text-gray-600">Manage your earnings and withdrawal requests</p>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {earningsData.balance.available.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              disabled={earningsData.balance.netAvailable <= 0}
              className={`mt-4 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                earningsData.balance.netAvailable > 0
                  ? 'bg-[#bf2c7e] text-white hover:bg-[#a8246e]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Request Withdrawal
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-yellow-600">
                  KSh {earningsData.balance.pendingWithdrawals.toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Awaiting admin approval</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locked Funds (20%)</p>
                <p className="text-2xl font-bold text-blue-600">
                  KSh {earningsData.balance.locked.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Available in 24 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Referral Earnings</p>
                <p className="text-2xl font-bold text-purple-600">
                  KSh {earningsData.balance.referral.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">From referred vendors</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {earningsData.totalOrders}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setWithdrawalTab('history')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  withdrawalTab === 'history'
                    ? 'border-[#bf2c7e] text-[#bf2c7e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Withdrawal History
              </button>
              <button
                onClick={() => setWithdrawalTab('available')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  withdrawalTab === 'available'
                    ? 'border-[#bf2c7e] text-[#bf2c7e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Funds
              </button>
            </nav>
          </div>

          <div className="p-6">
            {withdrawalTab === 'history' ? (
              <WithdrawalHistory withdrawals={withdrawals} />
            ) : (
              <AvailableFunds 
                funds={availableFunds}
                selectedFunds={selectedFunds}
                onSelectFund={handleFundSelection}
                onSelectAll={handleSelectAllAvailable}
                onRequestWithdrawal={() => setShowWithdrawalModal(true)}
                totalSelected={selectedFunds.reduce((sum, id) => {
                  const fund = availableFunds.find(f => f._id === id);
                  return sum + (fund?.netAmount || 0);
                }, 0)}
              />
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select 
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
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

        {/* Earnings Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Earnings</h2>
            <div className="h-64">
              {earningsData.monthlyEarnings && earningsData.monthlyEarnings.length > 0 ? (
                <div className="flex items-end justify-between h-full space-x-2">
                  {earningsData.monthlyEarnings.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-[#bf2c7e] w-full rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ 
                          height: `${Math.max(
                            10, 
                            (month.earnings / Math.max(...earningsData.monthlyEarnings.map(m => m.earnings || 1))) * 100
                          )}%` 
                        }}
                        title={`KSh ${month.earnings.toLocaleString()}`}
                      ></div>
                      <p className="text-xs text-gray-600 mt-2">{month.month}</p>
                      <p className="text-xs text-gray-500">KSh {month.earnings.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No monthly earnings data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
            {earningsData.topProducts && earningsData.topProducts.length > 0 ? (
              <div className="space-y-4">
                {earningsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.quantitySold} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">KSh {product.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No top products data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          {earningsData.recentTransactions && earningsData.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earningsData.recentTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KSh {transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KSh {transaction.commission.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        KSh {transaction.netAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          transaction.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
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
            <div className="p-6 text-center">
              <p className="text-gray-500">No recent transactions available</p>
            </div>
          )}
        </div>
      </div>

      {showWithdrawalModal && (
        <WithdrawalRequestModal
          selectedFunds={selectedFunds.map(id => availableFunds.find(f => f._id === id)!).filter(Boolean)}
          onClose={() => {
            setShowWithdrawalModal(false);
            setSelectedFunds([]);
          }}
          onSuccess={handleWithdrawalSuccess}
          defaultMpesaNumber={user.mpesaNumber || ''}
        />
      )}
    </div>
  );
}

// Withdrawal History Component
function WithdrawalHistory({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No withdrawal history</h3>
        <p className="mt-1 text-gray-500">You haven't made any withdrawal requests yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MPESA</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(withdrawal.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {withdrawal.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                KSh {withdrawal.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  withdrawal.type === 'IMMEDIATE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {withdrawal.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  withdrawal.status === 'PROCESSED'
                    ? 'bg-green-100 text-green-800'
                    : withdrawal.status === 'APPROVED'
                    ? 'bg-blue-100 text-blue-800'
                    : withdrawal.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {withdrawal.status}
                </span>
                {withdrawal.adminNotes && (
                  <p className="text-xs text-gray-500 mt-1">{withdrawal.adminNotes}</p>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {withdrawal.vendor.mpesaNumber}
                {withdrawal.mpesaReceipt && (
                  <p className="text-xs text-green-600">Receipt: {withdrawal.mpesaReceipt}</p>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {withdrawal.reason || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}