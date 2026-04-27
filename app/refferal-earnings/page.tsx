/*"use client";

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
      } else*
        
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
  };*

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
      {/* Header *
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

      {/* Main Content *
      <div className="space-y-8">
        {/* Payment Summary Cards *
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* VENDOR VIEW *
          {user?.role === 'vendor' && (
            <>
              {/* Vendor Subscription Card *
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
                <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(subscriptionAmount)}</p>
                <p className="text-gray-500 text-sm mt-2">Next payment due in 15 days</p>
              </div>*

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
              </div>*

              {/* Referral Earnings Card *
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

          {/* ADMIN VIEW *
          {user?.role === 'admin' && (
            <>
              {/* Pending Withdrawals Card *
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

              {/* Processed Withdrawals Card *
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

              {/* Referral Program Card *
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

          {/* USER VIEW (Non-vendor, non-admin) *
          {!['vendor', 'admin'].includes(user?.role || '') && (
            <>
              {/* Referral Earnings Card *
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

              {/* Your Referral Code *
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

        {/* Recent Transactions/Requests Section *
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

        {/* Admin Recent Withdrawal Requests *
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

        {/* Referral Payments Table (for all users) *
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
                          </div>*
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

        {/* Empty States *
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
}*/

/*'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Gift,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wallet,
  Award,
  Sparkles,
  Calendar,
  Mail,
  Phone,
  Building,
  UserCheck,
  Star,
  Zap,
  Rocket,
  Crown,
  Target,
  Heart,
  BarChart3,
  PieChart,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Download,
  Filter,
  Eye
} from 'lucide-react';

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
// MAIN COMPONENT
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

  const handleAdminWithdrawalsClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin/withdrawal-requests');
    }
  };

  // Calculate admin totals
  const totalPendingRequests = withdrawalStats.PENDING?.count || 0;
  const totalPendingAmount = withdrawalStats.PENDING?.totalAmount || 0;
  const totalProcessedAmount = withdrawalStats.PROCESSED?.totalAmount || 0;
  const totalRequests = Object.values(withdrawalStats).reduce((sum, stat) => sum + (stat?.count || 0), 0);

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
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section *
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Back Button *
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
              {user?.role === 'admin' ? 'Payment Management' : 'Your Earnings'}
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              {user?.role === 'admin' 
                ? 'Manage vendor withdrawals and track referral payments'
                : 'Track your referral earnings and commission payments'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Gift className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">20% Commission</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Real-time Tracking</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Unlimited Earnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards Grid *
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* ADMIN VIEW *
          {user?.role === 'admin' && (
            <>
              {/* Pending Withdrawals Card *
              <div 
                className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={handleAdminWithdrawalsClick}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs rounded-full">
                    Click to manage
                  </span>
                </div>
                <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
                  {totalPendingRequests}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Pending Withdrawal Requests</p>
                <div className="border-t border-[var(--color-border)] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Total Amount:</span>
                    <span className="font-semibold text-yellow-500">{formatCurrency(totalPendingAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-[var(--color-text-muted)]">Total Requests:</span>
                    <span className="font-semibold text-[var(--color-text)]">{totalRequests}</span>
                  </div>
                </div>
              </div>

              {/* Processed Withdrawals Card *
              <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
                  {formatCurrency(totalProcessedAmount)}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Total Processed Payments</p>
                <div className="border-t border-[var(--color-border)] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Completed:</span>
                    <span className="font-semibold text-green-500">{withdrawalStats.PROCESSED?.count || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-[var(--color-text-muted)]">Approved:</span>
                    <span className="font-semibold text-blue-500">{withdrawalStats.APPROVED?.count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Referral Program Stats Card *
              <div className="group bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[var(--color-text)] mb-1">20% Commission</p>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">On vendor subscriptions</p>
                <div className="border-t border-purple-500/20 pt-3">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Monitor referral activity and earnings across the platform
                  </p>
                </div>
              </div>
            </>
          )}

          {/* USER VIEW (Non-admin, non-vendor) *
          {!['admin'].includes(user?.role || '') && (
            <>
              {/* Total Referral Earnings Card *
              <div className="group bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
                  {formatCurrency(referralEarnings.totalEarnings)}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Total Referral Earnings</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                    {referralEarnings.completedReferrals} Completed
                  </span>
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                    {referralEarnings.pendingReferrals} Pending
                  </span>
                </div>
              </div>

              {/* Referral Stats Card *
              <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
                  {referralEarnings.totalReferrals}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Total Referrals</p>
                <div className="border-t border-[var(--color-border)] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">This Month:</span>
                    <span className="font-semibold text-[var(--color-primary)]">
                      {formatCurrency(referralEarnings.thisMonthEarnings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Earnings Card *
              <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
                  {formatCurrency(referralEarnings.thisMonthEarnings)}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">This Month's Earnings</p>
                <div className="border-t border-[var(--color-border)] pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Commission Rate:</span>
                    <span className="font-semibold text-green-500">20%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Referral Payments Table *
        {referralEarnings.payments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                  Referral Payment History
                </h2>
                <p className="text-[var(--color-text-muted)] mt-1">
                  All your referral commission payments
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-background-soft)]">
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Referred Vendor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Referred By</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Subscription</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Your Bonus (20%)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {referralEarnings.payments.map((payment) => (
                      <tr key={payment.paymentId} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            {/*<p className="font-medium text-[var(--color-text)]">
                              {payment.referredVendor.businessName}
                            </p>*
                            {/*<p className="text-sm text-[var(--color-text-muted)]">
                              {payment.referredVendor.email}
                            </p>*
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--color-text)]">
                              {payment.user.firstName} {payment.user.lastName}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                              {payment.user.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-[var(--color-text)]">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(payment.referralBonus)}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-500 rounded-full">
                              20%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text-muted)]">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                            <CheckCircle className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admin Recent Withdrawal Requests *
        {user?.role === 'admin' && withdrawalRequests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                  Recent Withdrawal Requests
                </h2>
                <p className="text-[var(--color-text-muted)] mt-1">
                  Pending and recent vendor withdrawal requests
                </p>
              </div>
              <button 
                onClick={() => router.push('/admin/withdrawal-requests')}
                className="inline-flex items-center space-x-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-background-soft)]">
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Vendor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {withdrawalRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--color-text)]">
                              {request.vendorDetails?.firstName} {request.vendorDetails?.lastName}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">{request.vendorDetails?.email}</p>
                            {request.vendorDetails?.businessName && (
                              <p className="text-xs text-[var(--color-text-muted)]">{request.vendorDetails.businessName}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text-muted)]">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600">
                            {formatCurrency(request.totalAmount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === 'PENDING' 
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : request.status === 'APPROVED'
                              ? 'bg-blue-500/10 text-blue-500'
                              : request.status === 'PROCESSED'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/admin/withdrawal-requests/${request._id}`)}
                            className="inline-flex items-center space-x-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section *
        <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">How Referral Earnings Work</h2>
            <p className="text-[var(--color-text-muted)]">Simple steps to start earning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-[var(--color-primary)]">1</span>
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">Share Your Link</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Share your unique referral link with potential vendors
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-green-500">2</span>
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">They Subscribe</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                When they subscribe as vendors using your link
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-purple-500">3</span>
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">Earn 20% Bonus</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Receive 20% of their subscription amount as referral bonus
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Award className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text)] font-medium">Commission Rate:</span>
              <span className="text-[var(--color-primary)] font-bold">20%</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-3">
              Of every vendor subscription through your referral
            </p>
          </div>
        </div>

        {/* Empty State for No Payments *
        {referralEarnings.payments.length === 0 && user?.role !== 'admin' && (
          <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Gift className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No Earnings Yet</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              You haven't received any referral payments yet.
            </p>
            <Link
              href="/referrals"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              <span>Start Referring</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Empty State for Admin *
        {user?.role === 'admin' && withdrawalRequests.length === 0 && (
          <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-green-500/10 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">All Caught Up!</h3>
            <p className="text-[var(--color-text-muted)]">
              No pending withdrawal requests at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}*/


'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Gift,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wallet,
  Award,
  Sparkles,
  Calendar,
  Mail,
  Phone,
  Building,
  UserCheck,
  Star,
  Zap,
  Rocket,
  Crown,
  Target,
  Heart,
  BarChart3,
  PieChart,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Download,
  Filter,
  Eye,
  ArrowLeftToLine
} from 'lucide-react';

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
// MAIN COMPONENT
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

  const handleAdminWithdrawalsClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin/withdrawal-requests');
    }
  };

  // Calculate admin totals
  const totalPendingRequests = withdrawalStats.PENDING?.count || 0;
  const totalPendingAmount = withdrawalStats.PENDING?.totalAmount || 0;
  const totalProcessedAmount = withdrawalStats.PROCESSED?.totalAmount || 0;
  const totalRequests = Object.values(withdrawalStats).reduce((sum, stat) => sum + (stat?.count || 0), 0);

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
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-10 sm:py-12">
          <div className="flex justify-center items-center h-48 xs:h-56 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 xs:py-10 sm:py-12 md:py-16">
        <div className="absolute top-0 right-0 w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 relative">
          {/* Back Button */}
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 xs:p-2.5 sm:p-3 bg-[var(--color-primary)]/10 rounded-xl xs:rounded-2xl mb-3 xs:mb-4 sm:mb-6 animate-bounce-subtle">
              <Wallet className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-2 xs:mb-3 sm:mb-4">
              {user?.role === 'admin' ? 'Payment Management' : 'Your Earnings'}
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] mb-4 xs:mb-5 sm:mb-6">
              {user?.role === 'admin' 
                ? 'Manage vendor withdrawals and track referral payments'
                : 'Track your referral earnings and commission payments'}
            </p>
            <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-[var(--color-surface)] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-[var(--color-border)]">
                <Gift className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                <span className="text-[9px] xs:text-[10px] sm:text-xs">20% Commission</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-[var(--color-surface)] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-[var(--color-border)]">
                <Clock className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                <span className="text-[9px] xs:text-[10px] sm:text-xs">Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-[var(--color-surface)] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-[var(--color-border)]">
                <TrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                <span className="text-[9px] xs:text-[10px] sm:text-xs">Unlimited Earnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-10 md:py-12">
        {/* Stats Cards Grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-8 xs:mb-10 sm:mb-12">
          
          {/* ADMIN VIEW */}
          {user?.role === 'admin' && (
            <>
              {/* Pending Withdrawals Card */}
              <div 
                className="group bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={handleAdminWithdrawalsClick}
              >
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-yellow-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  </div>
                  <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[8px] xs:text-[9px] sm:text-xs rounded-full">
                    Click to manage
                  </span>
                </div>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">
                  {totalPendingRequests}
                </p>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-2 xs:mb-3">Pending Withdrawal Requests</p>
                <div className="border-t border-[var(--color-border)] pt-2 xs:pt-2.5 sm:pt-3">
                  <div className="flex justify-between text-[9px] xs:text-[10px] sm:text-xs">
                    <span className="text-[var(--color-text-muted)]">Total Amount:</span>
                    <span className="font-semibold text-yellow-500">{formatCurrency(totalPendingAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[9px] xs:text-[10px] sm:text-xs mt-1">
                    <span className="text-[var(--color-text-muted)]">Total Requests:</span>
                    <span className="font-semibold text-[var(--color-text)]">{totalRequests}</span>
                  </div>
                </div>
              </div>

              {/* Processed Withdrawals Card */}
              <div className="group bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-green-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                </div>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">
                  {formatCurrency(totalProcessedAmount)}
                </p>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-2 xs:mb-3">Total Processed Payments</p>
                <div className="border-t border-[var(--color-border)] pt-2 xs:pt-2.5 sm:pt-3">
                  <div className="flex justify-between text-[9px] xs:text-[10px] sm:text-xs">
                    <span className="text-[var(--color-text-muted)]">Completed:</span>
                    <span className="font-semibold text-green-500">{withdrawalStats.PROCESSED?.count || 0}</span>
                  </div>
                  <div className="flex justify-between text-[9px] xs:text-[10px] sm:text-xs mt-1">
                    <span className="text-[var(--color-text-muted)]">Approved:</span>
                    <span className="font-semibold text-blue-500">{withdrawalStats.APPROVED?.count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Referral Program Stats Card */}
              <div className="group bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-purple-500/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-purple-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                    <Award className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-lg xs:text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">20% Commission</p>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-2 xs:mb-3">On vendor subscriptions</p>
                <div className="border-t border-purple-500/20 pt-2 xs:pt-2.5 sm:pt-3">
                  <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">
                    Monitor referral activity and earnings across the platform
                  </p>
                </div>
              </div>
            </>
          )}

          {/* USER VIEW (Non-admin) */}
          {!['admin'].includes(user?.role || '') && (
            <>
              {/* Total Referral Earnings Card */}
              <div className="group bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-green-500/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-green-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                    <DollarSign className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                </div>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">
                  {formatCurrency(referralEarnings.totalEarnings)}
                </p>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-2 xs:mb-3">Total Referral Earnings</p>
                <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
                  <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-green-500/10 text-green-500 text-[7px] xs:text-[8px] sm:text-[10px] rounded-full">
                    {referralEarnings.completedReferrals} Completed
                  </span>
                  <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-yellow-500/10 text-yellow-500 text-[7px] xs:text-[8px] sm:text-[10px] rounded-full">
                    {referralEarnings.pendingReferrals} Pending
                  </span>
                </div>
              </div>

              {/* Referral Stats Card */}
              <div className="group bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-blue-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">
                  {referralEarnings.totalReferrals}
                </p>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-2 xs:mb-3">Total Referrals</p>
                <div className="border-t border-[var(--color-border)] pt-2 xs:pt-2.5 sm:pt-3">
                  <div className="flex justify-between text-[9px] xs:text-[10px] sm:text-xs">
                    <span className="text-[var(--color-text-muted)]">This Month:</span>
                    <span className="font-semibold text-[var(--color-primary)]">
                      {formatCurrency(referralEarnings.thisMonthEarnings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Earnings Card */}
              <div className="group bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="p-2 xs:p-2.5 sm:p-3 bg-purple-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">
                  {formatCurrency(referralEarnings.thisMonthEarnings)}
                </p>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-2 xs:mb-3">This Month's Earnings</p>
                <div className="border-t border-[var(--color-border)] pt-2 xs:pt-2.5 sm:pt-3">
                  <div className="flex items-center justify-between text-[9px] xs:text-[10px] sm:text-xs">
                    <span className="text-[var(--color-text-muted)]">Commission Rate:</span>
                    <span className="font-semibold text-green-500">20%</span>
                  </div>
                </div>
              </div>

            <div className="group bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                <div className="p-2 xs:p-2.5 sm:p-3 bg-orange-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                  <ArrowLeftToLine className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-orange-500" />
                </div>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Withdraw</span>
              </div>
              <Link href="/referral-withdrawals">
                <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-0.5 xs:mb-1">
                  Withdraw
                </p>
                <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">Request your earnings</p>
              </Link>
            </div>
            </>
          )}
        </div>

        {/* Referral Payments Table */}
        {referralEarnings.payments.length > 0 && (
          <div className="mb-8 xs:mb-10 sm:mb-12">
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
              <div>
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] flex items-center">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-5 xs:h-6 sm:h-8 rounded-full mr-2 xs:mr-3"></span>
                  Referral Payment History
                </h2>
                <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">
                  All your referral commission payments
                </p>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <RefreshCw className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[var(--color-background-soft)]">
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Referred Vendor</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Referred By</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Subscription</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Your Bonus (20%)</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Date</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {referralEarnings.payments.map((payment) => (
                      <tr key={payment.paymentId} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        {/*<td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">
                          {payment.referredVendor.businessName || 'N/A'}
                        </td>*/}
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div>
                            <p className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text)]">
                              {payment.user.firstName} {payment.user.lastName}
                            </p>
                            <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">
                              {payment.user.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text)]">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div className="flex flex-wrap items-center gap-1 xs:gap-1.5">
                            <span className="text-[8px] xs:text-[9px] sm:text-xs font-bold text-green-600">
                              {formatCurrency(payment.referralBonus)}
                            </span>
                            <span className="px-1 xs:px-1.5 py-0.5 text-[6px] xs:text-[7px] bg-green-500/10 text-green-500 rounded-full">
                              20%
                            </span>
                          </div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <span className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 py-0.5 xs:py-1 bg-green-500/10 text-green-500 rounded-full text-[7px] xs:text-[8px] sm:text-[9px]">
                            <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5" />
                            <span>Paid</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admin Recent Withdrawal Requests */}
        {user?.role === 'admin' && withdrawalRequests.length > 0 && (
          <div className="mb-8 xs:mb-10 sm:mb-12">
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
              <div>
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] flex items-center">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-5 xs:h-6 sm:h-8 rounded-full mr-2 xs:mr-3"></span>
                  Recent Withdrawal Requests
                </h2>
                <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">
                  Pending and recent vendor withdrawal requests
                </p>
              </div>
              <button 
                onClick={() => router.push('/admin/withdrawal-requests')}
                className="inline-flex items-center gap-1 xs:gap-1.5 text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
              </button>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[var(--color-background-soft)]">
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Vendor</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Date</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Amount</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Status</th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-[8px] xs:text-[9px] sm:text-xs font-semibold text-[var(--color-text)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {withdrawalRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <div>
                            <p className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-[var(--color-text)]">
                              {request.vendorDetails?.firstName} {request.vendorDetails?.lastName}
                            </p>
                            <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">{request.vendorDetails?.email}</p>
                          </div>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 text-[7px] xs:text-[8px] sm:text-[9px] text-[var(--color-text-muted)]">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <span className="text-[8px] xs:text-[9px] sm:text-xs font-bold text-green-600">
                            {formatCurrency(request.totalAmount)}
                          </span>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <span className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full text-[7px] xs:text-[8px] sm:text-[9px] font-medium ${
                            request.status === 'PENDING' 
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : request.status === 'APPROVED'
                              ? 'bg-blue-500/10 text-blue-500'
                              : request.status === 'PROCESSED'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3">
                          <button
                            onClick={() => router.push(`/admin/withdrawal-requests/${request._id}`)}
                            className="inline-flex items-center gap-0.5 xs:gap-1 text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                          >
                            <Eye className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-7 md:p-8 border border-[var(--color-border)]">
          <div className="text-center mb-5 xs:mb-6 sm:mb-7 md:mb-8">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] mb-1 xs:mb-2">How Referral Earnings Work</h2>
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Simple steps to start earning</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl xs:text-3xl font-bold text-[var(--color-primary)]">1</span>
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)] mb-1 xs:mb-2">Share Your Link</h3>
              <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] px-2">
                Share your unique referral link with potential vendors
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl xs:text-3xl font-bold text-green-500">2</span>
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)] mb-1 xs:mb-2">They Subscribe</h3>
              <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] px-2">
                When they subscribe as vendors using your link
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl xs:text-3xl font-bold text-purple-500">3</span>
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)] mb-1 xs:mb-2">Earn 20% Bonus</h3>
              <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] px-2">
                Receive 20% of their subscription amount as referral bonus
              </p>
            </div>
          </div>
          
          <div className="mt-6 xs:mt-7 sm:mt-8 pt-5 xs:pt-6 sm:pt-6 border-t border-[var(--color-border)] text-center">
            <div className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Award className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-[var(--color-primary)]" />
              <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] font-medium">Commission Rate:</span>
              <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] font-bold">20%</span>
            </div>
            <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] mt-2 xs:mt-3">
              Of every vendor subscription through your referral
            </p>
          </div>
        </div>

        {/* Empty State for No Payments */}
        {referralEarnings.payments.length === 0 && user?.role !== 'admin' && (
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-8 xs:p-10 sm:p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-3 xs:p-3.5 sm:p-4 bg-[var(--color-primary)]/10 rounded-full mb-3 xs:mb-4">
              <Gift className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-[var(--color-text)] mb-1 xs:mb-2">No Earnings Yet</h3>
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mb-3 xs:mb-4">
              You haven't received any referral payments yet.
            </p>
            <Link
              href="/referrals"
              className="inline-flex items-center gap-1.5 xs:gap-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              <span>Start Referring</span>
              <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        )}

        {/* Empty State for Admin */}
        {user?.role === 'admin' && withdrawalRequests.length === 0 && (
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-8 xs:p-10 sm:p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-3 xs:p-3.5 sm:p-4 bg-green-500/10 rounded-full mb-3 xs:mb-4">
              <CheckCircle className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-green-500" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-[var(--color-text)] mb-1 xs:mb-2">All Caught Up!</h3>
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">
              No pending withdrawal requests at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Add bounce animation */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}