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

"use client";

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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
   *  -------------------------------- */
  useEffect(() => {
    fetchReferralEarnings();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
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

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings Card */}
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

        {/* This Month Earnings Card */}
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

        {/* Total Referrals Card */}
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

        {/* Referral Bonus Rate Card */}
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

      {/* Referral Payments History */}
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
                        </div>*/}
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

      {/* Referral Instructions */}
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
}