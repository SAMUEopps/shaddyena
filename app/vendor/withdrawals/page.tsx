"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface VendorEarnings {
  availableEarnings: number;
  withdrawnEarnings: number;
  totalEarnings: number;
  hasPendingRequest: boolean;
}

interface Transaction {
  _id: string;
  orderId: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: string;
  createdAt: string;
}

export default function VendorWithdrawalsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [earnings, setEarnings] = useState<VendorEarnings>({
    availableEarnings: 0,
    withdrawnEarnings: 0,
    totalEarnings: 0,
    hasPendingRequest: false
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (user?.role !== 'vendor') {
      router.push('/dashboard');
      return;
    }
    
    fetchEarnings();
    fetchTransactions();
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/earnings/vendor');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
        setWithdrawAmount(data.availableEarnings);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/earnings/vendor/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async () => {
    if (withdrawAmount <= 0 || withdrawAmount > earnings.availableEarnings) {
      alert('Invalid withdrawal amount');
      return;
    }
    
    if (earnings.hasPendingRequest) {
      alert('You already have a pending withdrawal request');
      return;
    }
    
    setIsRequesting(true);
    
    try {
      const response = await fetch('/api/earnings/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: withdrawAmount }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Withdrawal request submitted successfully!');
        fetchEarnings();
        fetchTransactions();
      } else {
        alert(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      alert('Failed to submit withdrawal request');
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Vendor Earnings & Withdrawals</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Earnings</h3>
          <p className="text-3xl font-bold text-green-600">
            KSh {earnings.availableEarnings.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-2">Ready for withdrawal</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Withdrawn</h3>
          <p className="text-3xl font-bold text-blue-600">
            KSh {earnings.withdrawnEarnings.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-2">Previously withdrawn</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-purple-600">
            KSh {earnings.totalEarnings.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-2">All-time earnings</p>
        </div>
      </div>
      
      {/* Withdrawal Request Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Request Withdrawal</h2>
        
        {earnings.hasPendingRequest ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              ⚠️ You have a pending withdrawal request. Please wait for it to be processed before submitting a new one.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Withdrawal Amount</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                  min="0"
                  max={earnings.availableEarnings}
                  step="0.01"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
                <button
                  onClick={() => setWithdrawAmount(earnings.availableEarnings)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Max
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Available: KSh {earnings.availableEarnings.toFixed(2)}
              </p>
            </div>
            
            <button
              onClick={handleWithdrawRequest}
              disabled={withdrawAmount <= 0 || isRequesting}
              className={`px-6 py-3 rounded-lg font-semibold ${
                withdrawAmount > 0 && !isRequesting
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isRequesting ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> Withdrawal requests are processed within 2-3 business days. 
                The funds will be sent to your registered M-Pesa number: {user?.mpesaNumber || 'Not set'}
              </p>
            </div>
          </>
        )}
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-600">Order ID</th>
                <th className="py-3 px-4 text-left text-gray-600">Date</th>
                <th className="py-3 px-4 text-left text-gray-600">Amount</th>
                <th className="py-3 px-4 text-left text-gray-600">Commission</th>
                <th className="py-3 px-4 text-left text-gray-600">Net Amount</th>
                <th className="py-3 px-4 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b">
                  <td className="py-3 px-4">{transaction.orderId.slice(-8)}</td>
                  <td className="py-3 px-4">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">KSh {transaction.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">KSh {transaction.commission.toFixed(2)}</td>
                  <td className="py-3 px-4 font-semibold">
                    KSh {transaction.netAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
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
    </div>
  );
}