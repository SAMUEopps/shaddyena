"use client";

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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
   *  -------------------------------- */
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
      {/* Title */}
      <h2 className="text-2xl text-gray-700 font-bold">Refferals & Earnings</h2>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Subscription Card */}
          {/*{user?.role === 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
          <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">KSh {subscriptionAmount}</p>
        </div>)}*/}

        {/* Referral Earnings Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Referral Earnings</h3>
          <p className="text-3xl font-bold text-green-600">KSh {referralEarnings.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">Earnings from vendors you referred.</p>
        </div>

        {/* Total Transactions */}
          {user?.role === 'vendor' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">{payments.length}</p>
          <p className="text-gray-500 text-sm">All your subscription payments.</p>
        </div>
          )}

        {/* Vendor Earnings Card - Only for vendors */}
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
        )}*/}
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

    {/* Safe render */}
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

        {/* Withdrawal Requests Card - Only for admin */}
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

      {/* Payment History */}
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
            {/* Normal Payments */}
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

            {/* Referral Bonus Payments */}
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
}