"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// -------------------------------
// TYPES
// -------------------------------
interface ReferralPayment {
  paymentId: string;
  amount: number;
  referralBonus: number;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  referredVendor: {
    businessName: string;
    email: string;
  };
  createdAt: string;
}

interface ReferralEarningsSummary {
  totalEarnings: number;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  thisMonthEarnings: number;
  payments: ReferralPayment[];
}

interface VendorEarningsSummary {
  availableEarnings: number;
  withdrawnEarnings: number;
  totalEarnings: number;
  hasPendingRequest: boolean;
  pendingAmount: number;
  pendingRequestAmount: number;
}

interface VendorTransaction {
  _id: string;
  orderId: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: string;
  createdAt: string;
  withdrawalRequestId?: string;
}

interface WithdrawalStats {
  PENDING?: { count: number; totalAmount: number };
  APPROVED?: { count: number; totalAmount: number };
  REJECTED?: { count: number; totalAmount: number };
  PROCESSED?: { count: number; totalAmount: number };
}

interface WithdrawalRequest {
  _id: string;
  vendorId: string;
  vendorDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mpesaNumber?: string;
    businessName?: string;
  };
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  createdAt: string;
}

// -------------------------------
// EARNINGS TAB COMPONENT
// -------------------------------
export default function RefferalEarningsTab() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  
  // Vendor/Admin Earnings State
  const [vendorEarnings, setVendorEarnings] = useState<VendorEarningsSummary>({
    availableEarnings: 0,
    withdrawnEarnings: 0,
    totalEarnings: 0,
    hasPendingRequest: false,
    pendingAmount: 0,
    pendingRequestAmount: 0
  });
  const [withdrawalStats, setWithdrawalStats] = useState<WithdrawalStats>({});
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [transactions, setTransactions] = useState<VendorTransaction[]>([]);
  
  // Referral Earnings State
  const [referralEarnings, setReferralEarnings] = useState<ReferralEarningsSummary>({
    totalEarnings: 0,
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    thisMonthEarnings: 0,
    payments: []
  });
  
  const [subscriptionAmount] = useState<number>(3000);

  // -------------------------------
  // FETCH DATA
  // -------------------------------
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Always fetch referral earnings
      await fetchReferralEarnings();
      
      /*if (user?.role === 'vendor') {
        await fetchVendorEarnings();
      } else*/
        
        if (user?.role === 'admin') {
        await fetchAdminStats();
      }
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralEarnings = async () => {
    try {
      const response = await fetch("/api/payments/referral-earnings", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        const data = await response.json();
        setReferralEarnings(data);
      }
    } catch (error) {
      console.error("Failed to fetch referral earnings:", error);
    }
  };

  /*const fetchVendorEarnings = async () => {
    if (user?.role !== 'vendor') return;
    
    try {
      const response = await fetch("/api/earnings/vendor");
      if (response.ok) {
        const data = await response.json();
        setVendorEarnings(data.summary || data);
        await fetchRecentTransactions();
      }
    } catch (error) {
      console.error("Failed to fetch vendor earnings:", error);
    }
  };*/

/*  const fetchRecentTransactions = async () => {
    try {
      const response = await fetch("/api/earnings/vendor/transactions?limit=5");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };*/

  const fetchAdminStats = async () => {
    if (user?.role !== 'admin') return;
    
    try {
      const response = await fetch("/api/earnings/admin/withdrawal-requests?limit=5");
      if (response.ok) {
        const data = await response.json();
        setWithdrawalStats(data.stats || {});
        setWithdrawalRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  // -------------------------------
  // UTILITY FUNCTIONS
  // -------------------------------
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleRefresh = async () => {
    await refreshUser();
    await fetchAllData();
    toast.success('Data updated!');
  };

  const handleVendorEarningsClick = () => {
    if (user?.role === 'vendor') {
      router.push('/vendor/withdrawals');
    }
  };

  const handleAdminWithdrawalsClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin/withdrawal-requests');
    }
  };

  // -------------------------------
  // USE EFFECT
  // -------------------------------
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // -------------------------------
  // LOADING STATE
  // -------------------------------
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-gray-800 font-bold">Earnings</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#bf2c7e]"></div>
        </div>
      </div>
    );
  }

  // Calculate admin totals
  const totalPendingRequests = withdrawalStats.PENDING?.count || 0;
  const totalPendingAmount = withdrawalStats.PENDING?.totalAmount || 0;
  const totalProcessedAmount = withdrawalStats.PROCESSED?.totalAmount || 0;
  const totalRequests = Object.values(withdrawalStats).reduce((sum, stat) => sum + (stat?.count || 0), 0);

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 font-bold">Earnings</h2>
          <p className="text-gray-600 mt-1">
            {user?.role === 'vendor' 
              ? 'Manage your earnings and transactions' 
              : user?.role === 'admin'
              ? 'Manage payments and withdrawal requests'
              : 'Track your referral earnings'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* VENDOR VIEW */}
          {user?.role === 'vendor' && (
            <>
              {/* Vendor Subscription Card *
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
                <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(subscriptionAmount)}</p>
                <p className="text-gray-500 text-sm mt-2">Next payment due in 15 days</p>
              </div>*/}

              {/* Vendor Earnings Card *
              <div 
                className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-[#bf2c7e] hover:shadow-md transition-all cursor-pointer"
                onClick={handleVendorEarningsClick}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-gray-700 font-semibold">Vendor Earnings</h3>
                  <span className="text-xs bg-[#bf2c7e] text-white px-2 py-1 rounded">
                    Click to manage
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(vendorEarnings.availableEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">Available for withdrawal</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending: </span>
                    <span className="font-medium text-yellow-600">
                      {formatCurrency(vendorEarnings.pendingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Withdrawn: </span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(vendorEarnings.withdrawnEarnings)}
                    </span>
                  </div>
                </div>
                {vendorEarnings.hasPendingRequest && (
                  <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Withdrawal request pending: {formatCurrency(vendorEarnings.pendingRequestAmount)}
                    </p>
                  </div>
                )}
              </div>*/}

              {/* Referral Earnings Card */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg text-gray-700 font-semibold">Referral Earnings</h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {formatCurrency(referralEarnings.totalEarnings)}
                </p>
                <p className="text-gray-600 text-sm">From {referralEarnings.totalReferrals} referrals</p>
                <div className="mt-4 flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                    {referralEarnings.completedReferrals} completed
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    {referralEarnings.pendingReferrals} pending
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ADMIN VIEW */}
          {user?.role === 'admin' && (
            <>
              {/* Pending Withdrawals Card */}
              <div 
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-[#bf2c7e]"
                onClick={handleAdminWithdrawalsClick}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-gray-700 font-semibold">Pending Withdrawals</h3>
                  <span className="text-xs bg-[#bf2c7e] text-white px-2 py-1 rounded">
                    Click to manage
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {totalPendingRequests}
                    </p>
                    <p className="text-sm text-gray-600">Requests waiting approval</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount: </span>
                    <span className="font-medium text-yellow-700">
                      {formatCurrency(totalPendingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Requests: </span>
                    <span className="font-medium text-gray-700">{totalRequests}</span>
                  </div>
                </div>
              </div>

              {/* Processed Withdrawals Card */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Processed Withdrawals</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalProcessedAmount)}
                    </p>
                    <p className="text-sm text-gray-600">Total paid out to vendors</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed: </span>
                    <span className="font-medium text-green-700">
                      {withdrawalStats.PROCESSED?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Approved: </span>
                    <span className="font-medium text-blue-600">
                      {withdrawalStats.APPROVED?.count || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Referral Program Card */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Referral Program</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xl font-bold text-purple-600">20% Commission</p>
                    <p className="text-sm text-gray-600">On vendor subscriptions</p>
                  </div>
                  <div className="pt-2 border-t border-purple-200">
                    <p className="text-sm text-gray-700">
                      Monitor referral activity and earnings
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* USER VIEW (Non-vendor, non-admin) */}
          {!['vendor', 'admin'].includes(user?.role || '') && (
            <>
              {/* Referral Earnings Card */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg text-gray-700 font-semibold">Referral Earnings</h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {formatCurrency(referralEarnings.totalEarnings)}
                </p>
                <p className="text-gray-600 text-sm">From {referralEarnings.totalReferrals} referrals</p>
                <div className="mt-4 flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                    {referralEarnings.completedReferrals} completed
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    {referralEarnings.pendingReferrals} pending
                  </span>
                </div>
              </div>

              {/* Your Referral Code */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Your Referral Code</h3>
                <div className="flex items-center mb-4">
                  <code className="text-2xl font-bold text-[#bf2c7e] bg-gray-100 px-4 py-2 rounded-lg">
                    {user?.referralCode || 'N/A'}
                  </code>
                </div>
                <p className="text-gray-600 text-sm">
                  Share this code with friends to earn 20% commission
                </p>
              </div>
            </>
          )}
        </div>

        {/* Recent Transactions/Requests Section */}
        {user?.role === 'vendor' && transactions.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-gray-700 font-bold">Recent Transactions</h3>
              <button 
                onClick={() => router.push('/vendor/withdrawals')}
                className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="pb-3 px-4">Order ID</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 px-4">Commission</th>
                    <th className="pb-3 px-4">Net Amount</th>
                    <th className="pb-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm">{transaction.orderId?.slice(-8)}</span>
                      </td>
                      <td className="py-4 px-4">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-4 px-4 text-red-600">
                        -{formatCurrency(transaction.commission)}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-700">
                        {formatCurrency(transaction.netAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : transaction.status === 'WITHDRAWN'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'HOLD'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.status}
                          {transaction.withdrawalRequestId && ' (In Request)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Recent Withdrawal Requests */}
        {user?.role === 'admin' && withdrawalRequests.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-gray-700 font-bold">Recent Withdrawal Requests</h3>
              <button 
                onClick={() => router.push('/admin/withdrawal-requests')}
                className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="pb-3 px-4">Vendor</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {withdrawalRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">
                            {request.vendorDetails?.firstName} {request.vendorDetails?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{request.vendorDetails?.email}</p>
                          {request.vendorDetails?.businessName && (
                            <p className="text-xs text-gray-400">{request.vendorDetails.businessName}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-700">
                        {formatCurrency(request.totalAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800'
                            : request.status === 'PROCESSED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => router.push(`/admin/withdrawal-requests/${request._id}`)}
                          className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium flex items-center"
                        >
                          Manage
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Referral Payments Table (for all users) */}
        {referralEarnings.payments.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-gray-700 font-bold">Referral Payments</h3>
              <p className="text-sm text-gray-600">
                Total earned: <span className="font-bold text-green-600">
                  {formatCurrency(referralEarnings.totalEarnings)}
                </span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="pb-3 px-4">Referred Vendor</th>
                    <th className="pb-3 px-4">Referred By</th>
                    <th className="pb-3 px-4">Subscription</th>
                    <th className="pb-3 px-4">Your Bonus (20%)</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {referralEarnings.payments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          {/*<div className="font-medium text-gray-900">
                            {payment.referredVendor.businessName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.referredVendor.email}
                          </div>*/}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.user.firstName} {payment.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="font-bold text-lg text-green-600">
                            {formatCurrency(payment.referralBonus)}
                          </span>
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            20%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty States */}
        {user?.role === 'admin' && withdrawalRequests.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Withdrawals</h3>
            <p className="text-gray-600 mb-6">All withdrawal requests are currently processed.</p>
          </div>
        )}
      </div>
    </div>
  );
}