/*"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Payment {
  _id: string;
  userId: string;
  planId: string;
  phone: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  stkRequest?: any;
  stkCallback?: any;
  mpesaReceipt?: string | null;
  createdAt: string;
}

interface ReferralPayment {
  paymentId: string;
  amount: number;
  referralBonus: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface VendorEarnings {
  availableEarnings: number;
  withdrawnEarnings: number;
  totalEarnings: number;
  hasPendingRequest: boolean;
}

interface WithdrawalRequestSummary {
  pendingCount: number;
  totalRequests: number;
}

export default function EarningsTab() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [referralPayments, setReferralPayments] = useState<ReferralPayment[]>([]);
  const [subscriptionAmount, setSubscriptionAmount] = useState<number>(3000);
  const [vendorEarnings, setVendorEarnings] = useState<VendorEarnings>({
    availableEarnings: 0,
    withdrawnEarnings: 0,
    totalEarnings: 0,
    hasPendingRequest: false
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequestSummary>({
    pendingCount: 0,
    totalRequests: 0
  });

  /** -------------------------------
   *  FETCH PAYMENT HISTORY
   *  -------------------------------- *
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments/history");
      if (!res.ok) return;

      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
    }
  };

  const fetchReferralEarnings = async () => {
    try {
      const response = await fetch("/api/payments/referral-earnings", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch referral earnings");
        return;
      }

      const { totalEarnings = 0, payments = [] } = await response.json();

      setReferralEarnings(totalEarnings);
      setReferralPayments(payments);
    } catch (error) {
      console.error("Failed to fetch referral earnings:", error);
    }
  };

  /** -------------------------------
   *  FETCH VENDOR EARNINGS
   *  -------------------------------- *
  const fetchVendorEarnings = async () => {
    if (user?.role !== 'vendor') return;
    
    try {
      const response = await fetch("/api/earnings/refferal");
      if (!response.ok) {
        console.warn("Failed to fetch vendor earnings");
        return;
      }
      
      const data = await response.json();
      setVendorEarnings(data);
    } catch (error) {
      console.error("Failed to fetch vendor earnings:", error);
    }
  };

  /** -------------------------------
   *  FETCH WITHDRAWAL REQUESTS (ADMIN)
   *  -------------------------------- *
  const fetchWithdrawalRequests = async () => {
    if (user?.role !== 'admin') return;
    
    try {
      const response = await fetch("/api/earnings/admin/withdrawal-requests?limit=5");
      if (!response.ok) {
        console.warn("Failed to fetch withdrawal requests");
        return;
      }
      
      const data = await response.json();
      setWithdrawalRequests({
        pendingCount: data.pendingCount,
        totalRequests: data.total
      });
    } catch (error) {
      console.error("Failed to fetch withdrawal requests:", error);
    }
  };

  /** -------------------------------
   *  HANDLE WITHDRAWAL REQUEST
   *  -------------------------------- *
  const handleRequestWithdrawal = async () => {
    if (vendorEarnings.availableEarnings <= 0) {
      alert("No available earnings to withdraw");
      return;
    }
    
    if (vendorEarnings.hasPendingRequest) {
      alert("You already have a pending withdrawal request");
      return;
    }
    
    try {
      const response = await fetch("/api/earnings/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: vendorEarnings.availableEarnings
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Withdrawal request submitted successfully!");
        fetchVendorEarnings(); // Refresh data
      } else {
        alert(data.error || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      alert("Failed to submit withdrawal request");
    }
  };

  /** -------------------------------
   *  RUN FETCHERS ON LOAD
   *  -------------------------------- *
  useEffect(() => {
    fetchPayments();
    fetchReferralEarnings();
    
    if (user?.role === 'vendor') {
      fetchVendorEarnings();
    }
    
    if (user?.role === 'admin') {
      fetchWithdrawalRequests();
    }
  }, [user?.role]);

  /** -------------------------------
   *  HANDLE CARD CLICKS
   *  -------------------------------- *
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

  return (
    <div className="space-y-8">
      {/* Title *
      <h2 className="text-2xl text-gray-700 font-bold">Refferals & Earnings</h2>

      {/* Payment Summary Cards *
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Subscription Card *
          {/*{user?.role === 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
          <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">KSh {subscriptionAmount}</p>
        </div>)}*

        {/* Referral Earnings Card *
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Referral Earnings</h3>
          <p className="text-3xl font-bold text-green-600">KSh {referralEarnings.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">Earnings from vendors you referred.</p>
        </div>

        {/* Total Transactions *
          {user?.role === 'vendor' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">{payments.length}</p>
          <p className="text-gray-500 text-sm">All your subscription payments.</p>
        </div>
          )}

        {/* Vendor Earnings Card - Only for vendors *
        {/*{user?.role === 'vendor' && (
          <div 
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleVendorEarningsClick}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg text-gray-700 font-semibold">Vendor Earnings</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Click to request
              </span>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              KSh {vendorEarnings.availableEarnings.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm">
              Available: KSh {vendorEarnings.availableEarnings.toFixed(2)}
              <br />
              Withdrawn: KSh {vendorEarnings.withdrawnEarnings.toFixed(2)}
            </p>
            {vendorEarnings.hasPendingRequest && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 text-sm">Withdrawal request pending</p>
              </div>
            )}
          </div>
        )}*
       {user?.role === 'vendor' && (
  <div
    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
    onClick={handleVendorEarningsClick}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg text-gray-700 font-semibold">Vendor Earnings</h3>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        Click to request
      </span>
    </div>

    {/* Safe render *
    <p className="text-3xl font-bold text-orange-600">
      KSh {Number(vendorEarnings.availableEarnings).toFixed(2)}
    </p>

    <p className="text-gray-500 text-sm">
      Available: KSh {Number(vendorEarnings.availableEarnings).toFixed(2)}
      <br />
      Withdrawn: KSh {Number(vendorEarnings.withdrawnEarnings).toFixed(2)}
    </p>

    {vendorEarnings.hasPendingRequest && (
      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-700 text-sm">Withdrawal request pending</p>
      </div>
    )}
  </div>
)}

        {/* Withdrawal Requests Card - Only for admin *
        {user?.role === 'admin' && (
          <div 
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleAdminWithdrawalsClick}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg text-gray-700 font-semibold">Withdrawal Requests</h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Click to manage
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {withdrawalRequests.pendingCount}
            </p>
            <p className="text-gray-500 text-sm">
              Pending: {withdrawalRequests.pendingCount}
              <br />
              Total: {withdrawalRequests.totalRequests}
            </p>
          </div>
        )}
      </div>

      {/* Payment History *
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl text-gray-700 font-bold mb-4">Payment History</h3>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-3">ID</th>
              <th className="py-3">Date</th>
              <th className="py-3">Description</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {/* Normal Payments *
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="py-3">{p._id.slice(-6)}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>Subscription Payment</td>
                <td className="font-semibold">KSh {p.amount}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      p.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : p.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}

            {/* Referral Bonus Payments *
            {referralPayments.map((p) => (
              <tr key={p.paymentId} className="bg-green-50">
                <td className="py-3">{p.paymentId.slice(-6)}</td>
                <td>{new Date().toLocaleDateString()}</td>
                <td>
                  Referral Bonus from{" "}
                  <strong>
                    {p.user.firstName} {p.user.lastName}
                  </strong>
                </td>
                <td className="font-bold text-green-700">
                  KSh {p.referralBonus.toFixed(2)}
                </td>
                <td>
                  <span className="px-3 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                    COMPLETED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}*/













/*"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
}

export default function ReferralEarningsTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [referralPayments, setReferralPayments] = useState<ReferralPayment[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<ReferralEarningsSummary>({
    totalEarnings: 0,
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    thisMonthEarnings: 0
  });

  /** -------------------------------
   *  FETCH REFERRAL EARNINGS SUMMARY
   *  -------------------------------- *
  const fetchReferralEarnings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payments/referral-earnings", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch referral earnings");
        return;
      }

      const data = await response.json();
      
      setReferralEarnings(data.totalEarnings || 0);
      setReferralPayments(data.payments || []);
      setEarningsSummary({
        totalEarnings: data.totalEarnings || 0,
        totalReferrals: data.totalReferrals || 0,
        pendingReferrals: data.pendingReferrals || 0,
        completedReferrals: data.completedReferrals || 0,
        thisMonthEarnings: data.thisMonthEarnings || 0
      });
    } catch (error) {
      console.error("Failed to fetch referral earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------------
   *  FORMAT CURRENCY
   *  -------------------------------- *
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  /** -------------------------------
   *  FORMAT DATE
   *  -------------------------------- *
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /** -------------------------------
   *  RUN FETCHERS ON LOAD
   *  -------------------------------- *
  useEffect(() => {
    fetchReferralEarnings();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title *
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800 font-bold">Referral Earnings</h2>
        <button
          onClick={fetchReferralEarnings}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Earnings Summary Cards *
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings Card *
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-gray-700 font-semibold">Total Earnings</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(earningsSummary.totalEarnings)}
          </p>
          <p className="text-gray-600 text-sm">Lifetime earnings from referrals</p>
        </div>

        {/* This Month Earnings Card *
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-gray-700 font-semibold">This Month</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {formatCurrency(earningsSummary.thisMonthEarnings)}
          </p>
          <p className="text-gray-600 text-sm">Earnings this calendar month</p>
        </div>

        {/* Total Referrals Card *
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-gray-700 font-semibold">Total Referrals</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {earningsSummary.totalReferrals}
          </p>
          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              {earningsSummary.completedReferrals} completed
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
              {earningsSummary.pendingReferrals} pending
            </span>
          </div>
        </div>

        {/* Referral Bonus Rate Card *
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-gray-700 font-semibold">Bonus Rate</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            20%
          </p>
          <p className="text-gray-600 text-sm">Of referred vendor's subscription</p>
        </div>
      </div>

      {/* Referral Payments History *
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl text-gray-800 font-bold">Referral Payment History</h3>
          <p className="text-gray-600">All bonus payments from your referrals</p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading referral payments...</p>
          </div>
        ) : referralPayments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Referral Payments Yet</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't received any referral payments yet. Share your referral link to start earning!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Referred Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Referral User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Your Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralPayments.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {/*<div className="font-medium text-gray-900">
                          {payment.referredVendor.businessName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.referredVendor.email}
                        </div>*
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {payment.user.firstName} {payment.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Vendor subscription
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-bold text-lg text-green-600">
                          {formatCurrency(payment.referralBonus)}
                        </span>
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          20%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
        )}
      </div>

      {/* Referral Instructions *
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How Referral Earnings Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Share Your Link</h4>
              <p className="text-gray-600 text-sm mt-1">
                Share your unique referral link with potential vendors
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">They Subscribe</h4>
              <p className="text-gray-600 text-sm mt-1">
                When they subscribe as vendors using your link
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Earn 20% Bonus</h4>
              <p className="text-gray-600 text-sm mt-1">
                Receive 20% of their subscription amount as referral bonus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// -------------------------------
// TYPES
// -------------------------------
interface ReferredUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface ReferralData {
  referrals: ReferredUser[];
  referredByUser?: {
    firstName: string;
    lastName: string;
    referralCode: string;
  };
}

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
export default function EarningsAndReferralsTab() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'earnings' | 'referrals'>('earnings');
  const [loading, setLoading] = useState(true);
  
  // Referral State
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralEarnings, setReferralEarnings] = useState<ReferralEarningsSummary>({
    totalEarnings: 0,
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    thisMonthEarnings: 0,
    payments: []
  });
  
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
  const [subscriptionAmount] = useState<number>(3000);

  // -------------------------------
  // FETCH ALL DATA
  // -------------------------------
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Always fetch referral data for all users
      await fetchReferralData();
      
      if (user?.role === 'vendor') {
        await fetchVendorEarnings();
      } else if (user?.role === 'admin') {
        await fetchAdminStats();
      }
      
      // Fetch referral earnings for everyone
      await fetchReferralEarnings();
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // REFERRAL DATA
  // -------------------------------
  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referrals');
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
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

  // -------------------------------
  // VENDOR EARNINGS
  // -------------------------------
  const fetchVendorEarnings = async () => {
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
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await fetch("/api/earnings/vendor/transactions?limit=5");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // -------------------------------
  // ADMIN STATS
  // -------------------------------
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

  const copyToClipboard = async (text: string, message: string = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register${user?.referralCode ? `?ref=${user.referralCode}` : ''}`
    : '';

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

  const handleManageEarningsClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin/earnings');
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
          <h2 className="text-2xl text-gray-800 font-bold">Earnings & Referrals</h2>
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
          <h2 className="text-2xl text-gray-800 font-bold">Earnings & Referrals</h2>
          <p className="text-gray-600 mt-1">
            {user?.role === 'vendor' 
              ? 'Manage your earnings and track referrals' 
              : 'Manage payments and referral programs'}
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
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'earnings'
                  ? 'bg-white text-[#bf2c7e] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'referrals'
                  ? 'bg-white text-[#bf2c7e] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Referrals
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-8">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* VENDOR VIEW */}
              {user?.role === 'vendor' && (
                <>
                  {/* Vendor Subscription Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
                    <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(subscriptionAmount)}</p>
                    <p className="text-gray-500 text-sm mt-2">Next payment due in 15 days</p>
                  </div>

                  {/* Vendor Earnings Card */}
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
                  </div>

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

                  {/* People Referred */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg text-gray-700 font-semibold mb-2">People Referred</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-1">
                      {referralData?.referrals?.length || 0}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Total people who joined using your code
                    </p>
                    {/*{referralData?.referralCount !== undefined && (
                      <p className="text-xs text-gray-500 mt-2">
                        Count from profile: {user?.referralCount || 0}
                      </p>
                    )}*/}
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
                             {/*} <div className="font-medium text-gray-900">
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
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="space-y-8">
            {/* Referral Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Referrals */}
              <div className="bg-gradient-to-r from-[#bf2c7e]/10 to-[#bf2c7e]/5 p-6 rounded-xl border border-[#bf2c7e]/20">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Referrals</h3>
                <p className="text-3xl font-bold text-[#bf2c7e]">{user?.referralCount || 0}</p>
                <p className="text-gray-600 text-sm mt-2">People joined using your code</p>
              </div>

              {/* Referral Earnings */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Earnings</h3>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(referralEarnings.totalEarnings)}</p>
                <p className="text-gray-600 text-sm mt-2">From {referralEarnings.completedReferrals} completed referrals</p>
              </div>

              {/* This Month Earnings */}
              {/*<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg text-gray-700 font-semibold mb-2">This Month</h3>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(referralEarnings.thisMonthEarnings)}</p>
                <p className="text-gray-600 text-sm mt-2">Earnings this month</p>
              </div>*/}
            </div>

            {/* Referral Link Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-[#bf2c7e] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Your Referral Link & Code</h3>
              </div>

              {/* Referral Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Referral Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={user?.referralCode || 'N/A'}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-gray-900 bg-gray-50 text-lg font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(user?.referralCode || '', 'Referral code copied!')}
                    className="bg-[#bf2c7e] text-white px-6 py-3 rounded-r-lg hover:bg-[#a8256c] transition-colors font-medium"
                  >
                    Copy Code
                  </button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Referral Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-gray-900 bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink, 'Referral link copied!')}
                    className="bg-gray-800 text-white px-6 py-3 rounded-r-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    Copy Link
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Share this link with friends and earn 20% of their vendor subscription!
                </p>
              </div>

              {/* Share Buttons */}
              {/*<div className="flex space-x-3 mt-6">
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join using my referral link: ${referralLink}`)}`, '_blank')}
                  className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                  </svg>
                  Share on WhatsApp
                </button>
                <button
                  onClick={() => window.open(`mailto:?subject=Join with my referral&body=Join using my referral link: ${referralLink}`, '_blank')}
                  className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Share by Email
                </button>
              </div>*/}
            </div>

            {/* Referred Users List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">People You've Referred</h3>
                <span className="text-sm text-gray-600">
                  {referralData?.referrals?.length || 0} people
                </span>
              </div>

              {referralData?.referrals && referralData.referrals.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {referralData.referrals.map((referral) => (
                    <div key={referral._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#bf2c7e]/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-[#bf2c7e]">
                            {referral.firstName.charAt(0)}{referral.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {referral.firstName} {referral.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{referral.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {formatDate(referral.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">No one has joined using your referral code yet.</p>
                  <p className="text-sm text-gray-500">Share your link to start earning rewards!</p>
                </div>
              )}
            </div>

            {/* Referred By Section */}
            {referralData?.referredByUser && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-lg font-semibold text-green-800">You were referred by</h4>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Referrer Name</p>
                      <p className="font-medium text-gray-900">
                        {referralData.referredByUser.firstName} {referralData.referredByUser.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Referral Code Used</p>
                      <p className="font-medium text-[#bf2c7e] font-mono">
                        {referralData.referredByUser.referralCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How It Works Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">How Referral Earnings Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Share Your Link</h4>
                  <p className="text-gray-600 text-sm">
                    Share your unique referral link with potential vendors
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">They Subscribe</h4>
                  <p className="text-gray-600 text-sm">
                    When they subscribe as vendors using your link
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#bf2c7e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#bf2c7e]">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Earn 20% Bonus</h4>
                  <p className="text-gray-600 text-sm">
                    Receive 20% of their subscription amount as referral bonus
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg">
                  <span className="text-gray-600 mr-2">Commission Rate:</span>
                  <span className="font-bold text-green-600">20%</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Of every vendor subscription through your referral</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {/*{user?.role === 'vendor' && transactions.length === 0 && activeTab === 'earnings' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Earnings Yet</h3>
            <p className="text-gray-600 mb-6">Your earnings will appear here once customers purchase your products.</p>
            <button 
              onClick={() => router.push('/vendor/products')}
              className="px-6 py-3 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Products
            </button>
          </div>
        )}*/}

        {user?.role === 'admin' && withdrawalRequests.length === 0 && activeTab === 'earnings' && (
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