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

export default function PaymentsTab() {
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
      const response = await fetch("/api/earnings/vendor");
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
      
      <h2 className="text-2xl text-gray-700 font-bold">Payments & Subscription</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
          <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">KSh {subscriptionAmount}</p>
        </div>

       
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Referral Earnings</h3>
          <p className="text-3xl font-bold text-green-600">KSh {referralEarnings.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">Earnings from vendors you referred.</p>
        </div>

        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">{payments.length}</p>
          <p className="text-gray-500 text-sm">All your subscription payments.</p>
        </div>

        
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
        )}

        
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
import { useRouter } from "next/navigation";

interface VendorEarningsSummary {
  availableEarnings: number;
  withdrawnEarnings: number;
  totalEarnings: number;
  hasPendingRequest: boolean;
  pendingAmount: number;
}

interface VendorTransaction {
  _id: string;
  orderId: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: string;
  createdAt: string;
}

export default function PaymentsTab() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [vendorEarnings, setVendorEarnings] = useState<VendorEarningsSummary>({
    availableEarnings: 0,
    withdrawnEarnings: 0,
    totalEarnings: 0,
    hasPendingRequest: false,
    pendingAmount: 0
  });
  const [transactions, setTransactions] = useState<VendorTransaction[]>([]);
  const [subscriptionAmount, setSubscriptionAmount] = useState<number>(3000);

  /** -------------------------------
   *  FETCH VENDOR EARNINGS SUMMARY
   *  -------------------------------- *
  const fetchVendorEarnings = async () => {
    if (user?.role !== 'vendor') return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/earnings/vendor");
      if (!response.ok) {
        console.warn("Failed to fetch vendor earnings");
        return;
      }
      
      const data = await response.json();
      setVendorEarnings(data.summary);
      
      // Also fetch recent transactions
      fetchRecentTransactions();
    } catch (error) {
      console.error("Failed to fetch vendor earnings:", error);
    } finally {
      setLoading(false);
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

  /** -------------------------------
   *  HANDLE CARD CLICKS
   *  -------------------------------- *
  const handleVendorEarningsClick = () => {
    if (user?.role === 'vendor') {
      router.push('/vendor/withdrawals');
    }
  };

  /** -------------------------------
   *  RUN FETCHERS ON LOAD
   *  -------------------------------- *
  useEffect(() => {
    if (user?.role === 'vendor') {
      fetchVendorEarnings();
    }
  }, [user?.role]);

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl text-gray-700 font-bold">Payments & Earnings</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#bf2c7e]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <h2 className="text-2xl text-gray-700 font-bold">Payments & Earnings</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
        {user?.role === 'vendor' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
            <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
            <p className="text-3xl font-bold text-blue-600">KSh {subscriptionAmount}</p>
            <p className="text-gray-500 text-sm mt-2">Next payment due in 15 days</p>
          </div>
        )}

     
        {user?.role === 'vendor' && (
          <div 
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-[#bf2c7e]"
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
                  KSh {vendorEarnings.availableEarnings.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Available for withdrawal</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending: </span>
                <span className="font-medium text-yellow-600">
                  KSh {vendorEarnings.pendingAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Withdrawn: </span>
                <span className="font-medium text-blue-600">
                  KSh {vendorEarnings.withdrawnEarnings.toFixed(2)}
                </span>
              </div>
            </div>
            {vendorEarnings.hasPendingRequest && (
              <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Withdrawal request pending
                </p>
              </div>
            )}
          </div>
        )}

      
        {user?.role === 'vendor' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-purple-600">
              KSh {vendorEarnings.totalEarnings.toFixed(2)}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">From Orders: </span>
                <span className="font-medium">{transactions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available: </span>
                <span className="font-medium text-green-600">
                  {((vendorEarnings.availableEarnings / vendorEarnings.totalEarnings) * 100 || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

     
      {user?.role === 'vendor' && transactions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-gray-700 font-bold">Recent Transactions</h3>
            <button 
              onClick={() => router.push('/vendor/withdrawals')}
              className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium"
            >
              View All →
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
                      <span className="font-mono text-sm">{transaction.orderId.slice(-8)}</span>
                    </td>
                    <td className="py-4 px-4">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      KSh {transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-red-600">
                      -KSh {transaction.commission.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-bold text-green-700">
                      KSh {transaction.netAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : transaction.status === 'WITHDRAWN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

     
      {user?.role === 'vendor' && transactions.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Earnings Yet</h3>
          <p className="text-gray-600 mb-6">Your earnings will appear here once customers purchase your products.</p>
          <button 
            onClick={() => router.push('/vendor/products')}
            className="px-6 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Products
          </button>
        </div>
      )}
    </div>
  );
}*/

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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

export default function PaymentsTab() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
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

  /** -------------------------------
   *  VENDOR: FETCH EARNINGS SUMMARY
   *  -------------------------------- */
  const fetchVendorEarnings = async () => {
    if (user?.role !== 'vendor') return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/earnings/vendor");
      if (!response.ok) {
        console.warn("Failed to fetch vendor earnings");
        return;
      }
      
      const data = await response.json();
      setVendorEarnings(data.summary);
      
      // Also fetch recent transactions
      fetchRecentTransactions();
    } catch (error) {
      console.error("Failed to fetch vendor earnings:", error);
    } finally {
      setLoading(false);
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

  /** -------------------------------
   *  ADMIN: FETCH WITHDRAWAL STATS & REQUESTS
   *  -------------------------------- */
  const fetchAdminStats = async () => {
    if (user?.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/earnings/admin/withdrawal-requests?limit=5");
      if (response.ok) {
        const data = await response.json();
        setWithdrawalStats(data.stats || {});
        setWithdrawalRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleManageEarningsClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin/earnings');
    }
  };

  /** -------------------------------
   *  RUN FETCHERS ON LOAD
   *  -------------------------------- */
  useEffect(() => {
    if (user?.role === 'vendor') {
      fetchVendorEarnings();
    } else if (user?.role === 'admin') {
      fetchAdminStats();
    }
  }, [user?.role]);

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl text-gray-700 font-bold">Payments & Earnings</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#bf2c7e]"></div>
        </div>
      </div>
    );
  }

  // Calculate admin totals
  const totalPendingRequests = withdrawalStats.PENDING?.count || 0;
  const totalPendingAmount = withdrawalStats.PENDING?.totalAmount || 0;
  const totalProcessedAmount = withdrawalStats.PROCESSED?.totalAmount || 0;
  const totalRequests = Object.values(withdrawalStats).reduce((sum, stat) => sum + (stat?.count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <h2 className="text-2xl text-gray-700 font-bold">
        {user?.role === 'vendor' ? 'Vendor Earnings' : 'Payment Management'}
      </h2>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VENDOR VIEW */}
        {user?.role === 'vendor' && (
          <>
            {/* Vendor Subscription Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg text-gray-700 font-semibold mb-2">Vendor Subscription</h3>
              <p className="text-gray-600 mb-3">Monthly Vendor Subscription Fee</p>
              <p className="text-3xl font-bold text-blue-600">KSh {subscriptionAmount}</p>
              <p className="text-gray-500 text-sm mt-2">Next payment due in 15 days</p>
            </div>

            {/* Vendor Earnings Card */}
            <div 
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-[#bf2c7e]"
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
                    KSh {vendorEarnings.availableEarnings.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Available for withdrawal</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending: </span>
                  <span className="font-medium text-yellow-600">
                    KSh {vendorEarnings.pendingAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Withdrawn: </span>
                  <span className="font-medium text-blue-600">
                    KSh {vendorEarnings.withdrawnEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
              {vendorEarnings.hasPendingRequest && (
                <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-700 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Withdrawal request pending: KSh {(vendorEarnings.pendingRequestAmount ?? 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Total Earnings Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg text-gray-700 font-semibold mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-purple-600">
                KSh {vendorEarnings.totalEarnings.toFixed(2)}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">From Orders: </span>
                  <span className="font-medium">{transactions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available: </span>
                  <span className="font-medium text-green-600">
                    {((vendorEarnings.availableEarnings / vendorEarnings.totalEarnings) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
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
                    KSh {totalPendingAmount.toFixed(2)}
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
                    KSh {totalProcessedAmount.toFixed(2)}
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

            {/* Earnings Management Card */}
            <div 
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500"
              onClick={handleManageEarningsClick}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg text-gray-700 font-semibold">Earnings Management</h3>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                  Manage all
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xl font-bold text-purple-600">All Vendor Earnings</p>
                  <p className="text-sm text-gray-600 mt-1">View and manage all vendor earnings</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-700">
                    Manage individual earnings, update status, and handle disputes
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions/Requests Section */}
      {user?.role === 'vendor' && transactions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-gray-700 font-bold">Recent Transactions</h3>
            <button 
              onClick={() => router.push('/vendor/withdrawals')}
              className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium"
            >
              View All →
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
                      <span className="font-mono text-sm">{transaction.orderId.slice(-8)}</span>
                    </td>
                    <td className="py-4 px-4">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      KSh {transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-red-600">
                      -KSh {transaction.commission.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-bold text-green-700">
                      KSh {transaction.netAmount.toFixed(2)}
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
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-gray-700 font-bold">Recent Withdrawal Requests</h3>
            <button 
              onClick={() => router.push('/admin/withdrawal-requests')}
              className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="pb-3 px-4">Vendor</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">M-Pesa</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {withdrawalRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      {/*<div>
                        <p className="font-medium">
                          {request.vendorDetails.firstName} {request.vendorDetails.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{request.vendorDetails.email}</p>
                        {request.vendorDetails.businessName && (
                          <p className="text-xs text-gray-400">{request.vendorDetails.businessName}</p>
                        )}
                      </div>*/}
                    </td>
                    <td className="py-4 px-4">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                   {/* <td className="py-4 px-4 font-mono text-sm">
                      {request.vendorDetails.mpesaNumber || 'Not set'}
                    </td>*/}
                    <td className="py-4 px-4 font-bold text-green-700">
                      KSh {request.totalAmount.toFixed(2)}
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
                        className="text-sm text-[#bf2c7e] hover:text-[#a8246e] font-medium"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {user?.role === 'vendor' && transactions.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Earnings Yet</h3>
          <p className="text-gray-600 mb-6">Your earnings will appear here once customers purchase your products.</p>
          <button 
            onClick={() => router.push('/vendor/products')}
            className="px-6 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Products
          </button>
        </div>
      )}

      {user?.role === 'admin' && withdrawalRequests.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Withdrawals</h3>
          <p className="text-gray-600 mb-6">All withdrawal requests are currently processed.</p>
          <button 
            onClick={() => router.push('/admin/earnings')}
            className="px-6 py-2 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View All Earnings
          </button>
        </div>
      )}
    </div>
  );
}