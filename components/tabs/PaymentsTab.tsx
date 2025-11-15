/*type PaymentsTabProps = {
  role: 'customer' | 'vendor' | 'admin';
};

export default function PaymentsTab({ role }: PaymentsTabProps) {
  const isCustomer = role === 'customer';
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  
  const payments = [
    { id: 'PAY-78901', date: '12 Oct 2023', description: 'Order ORD-12345', amount: 'KSh 5,499', type: 'M-Pesa', status: 'Completed' },
    { id: 'PAY-78902', date: '11 Oct 2023', description: 'Order ORD-12346', amount: 'KSh 3,200', type: 'M-Pesa', status: 'Completed' },
    { id: 'PAY-78903', date: '10 Oct 2023', description: 'Vendor Payout', amount: 'KSh 4,674', type: 'Bank Transfer', status: 'Processing' },
    { id: 'PAY-78904', date: '9 Oct 2023', description: 'Subscription Renewal', amount: 'KSh 4,999', type: 'M-Pesa', status: 'Completed' },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isCustomer ? 'My Payments' : isVendor ? 'Earnings & Payouts' : 'Payment Management'}
        </h1>
        
        {isCustomer && (
          <button className="bg-[#bf2c7e] text-white px-4 py-2 rounded-lg font-medium">
            Add M-Pesa Funds
          </button>
        )}
      </div>
      
   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isCustomer ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">M-Pesa Balance</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 5,250</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 12,480</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <p className="text-2xl font-bold text-yellow-600">KSh 0</p>
            </div>
          </>
        ) : isVendor ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 24,580</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 85,420</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Next Payout</h3>
              <p className="text-2xl font-bold text-green-600">KSh 24,580</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 254,800</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Commission</h3>
              <p className="text-2xl font-bold text-gray-900">KSh 38,220</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
              <p className="text-2xl font-bold text-yellow-600">KSh 12,450</p>
            </div>
          </>
        )}
      </div>
      
    
      {isCustomer && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">M-Pesa Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="07XX XXX XXX" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="text" 
                  placeholder="KSh" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                />
              </div>
              <button className="bg-[#bf2c7e] text-white px-6 py-2 rounded-lg font-medium">
                Add Funds
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">How to Pay with M-Pesa</h3>
              <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                <li>Enter your M-Pesa registered phone number</li>
                <li>Enter the amount you want to deposit</li>
                <li>Click "Add Funds" button</li>
                <li>Check your phone for M-Pesa prompt</li>
                <li>Enter your M-Pesa PIN to complete transaction</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
 
      {isVendor && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Request Payout</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Available for payout: <span className="font-bold">KSh 24,580</span></p>
              <p className="text-sm text-gray-500">Payouts are processed every Friday</p>
            </div>
            <button className="bg-[#bf2c7e] text-white px-6 py-2 rounded-lg font-medium">
              Request Payout
            </button>
          </div>
        </div>
      )}
      
 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
            <option>All Transactions</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
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

export default function PaymentsTab() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [referralPayments, setReferralPayments] = useState<ReferralPayment[]>([]);
  const [subscriptionAmount, setSubscriptionAmount] = useState<number>(3000);

  /** -------------------------------
   *  FETCH PAYMENT HISTORY
   *  -------------------------------- */
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments/history"); // ⬅ no headers
      if (!res.ok) return;

      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
    }
  };

  /** -------------------------------
   *  FETCH REFERRAL EARNINGS
   *  -------------------------------- */
  /*const fetchReferralEarnings = async () => {
    try {
      const res = await fetch("/api/payments/referral-earnings"); // ⬅ no headers
      if (!res.ok) return;

      const data = await res.json();
      setReferralEarnings(data.totalEarnings || 0);
      setReferralPayments(data.payments || []);
    } catch (err) {
      console.error("Failed to fetch referral earnings:", err);
    }
  };*/

  const fetchReferralEarnings = async () => {
  try {
    const response = await fetch("/api/payments/referral-earnings", {
      method: "GET",
      credentials: "include", // ⬅ VERY IMPORTANT (sends JWT cookie)
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
   *  RUN FETCHERS ON LOAD
   *  -------------------------------- */
  useEffect(() => {
    fetchPayments();
    fetchReferralEarnings();
  }, []);

  /** -------------------------------
   *  INITIATE SUBSCRIPTION PAYMENT
   *  -------------------------------- */
  /*const initiatePayment = async () => {
    if (!user?.mpesaNumber) {
      alert("Add your M-Pesa number in profile first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ⬅ only this is needed
        },
        body: JSON.stringify({
          amount: subscriptionAmount,
          phone: user.mpesaNumber,
          planId: "MONTHLY",
        }),
      });

      const data = await res.json();
      alert(data.message || "Processing payment...");
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Try again.");
    }
    setLoading(false);
  };*/
  return (
    <div className="space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-bold">Payments & Subscription</h2>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Subscription Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Vendor Subscription</h3>

          <p className="text-gray-600 mb-3">
            Monthly Vendor Subscription Fee
          </p>

          <p className="text-3xl font-bold text-blue-600 mb-4">
            KSh {subscriptionAmount}
          </p>

          {/*<button
            onClick={initiatePayment}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-70"
          >
            {loading ? "Processing…" : "Pay Now"}
          </button>*/}
        </div>

        {/* Referral Earnings Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Referral Earnings</h3>

          <p className="text-3xl font-bold text-green-600">
            KSh {referralEarnings.toFixed(2)}
          </p>

          <p className="text-gray-500 text-sm">
            Earnings from vendors you referred.
          </p>
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>

          <p className="text-3xl font-bold text-purple-600">
            {payments.length}
          </p>

          <p className="text-gray-500 text-sm">
            All your subscription payments.
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Payment History</h3>

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
