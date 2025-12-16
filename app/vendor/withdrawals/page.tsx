/*"use client";

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
    return <div className="bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className='bg-gray-50'>
    <div className="p-8">
      <h1 className="text-2xl text-gray-700 font-bold text-gray-800 mb-6">Vendor Earnings & Withdrawals</h1>
  
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
    </div>
  );
}*/

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

interface VendorInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName?: string;
  mpesaNumber?: string;
}

export default function VendorWithdrawalsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [earnings, setEarnings] = useState<VendorEarningsSummary>({
    availableEarnings: 0,
    withdrawnEarnings: 0,
    totalEarnings: 0,
    hasPendingRequest: false,
    pendingAmount: 0
  });
  
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [transactions, setTransactions] = useState<VendorTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.role !== 'vendor') {
      router.push('/dashboard');
      return;
    }
    
    fetchEarnings();
    fetchTransactions();
  }, [user, page]);

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/earnings/vendor');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data.summary);
        setVendorInfo(data.vendor);
        setWithdrawAmount(data.summary.availableEarnings);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/earnings/vendor/transactions?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setTotalPages(data.totalPages);
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
    
    if (!vendorInfo?.mpesaNumber) {
      alert('Please update your M-Pesa number in your profile settings');
      router.push('/vendor/profile');
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
        alert(data.message || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      alert('Failed to submit withdrawal request');
    } finally {
      setIsRequesting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'AVAILABLE': { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
      'WITHDRAWN': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Withdrawn' },
      'HOLD': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'On Hold' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Vendor Earnings & Withdrawals</h1>
          <p className="text-gray-600 mt-2">Manage your earnings from product sales</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Available Earnings</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              KSh {earnings.availableEarnings.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm mt-2">Ready for withdrawal</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Total Withdrawn</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              KSh {earnings.withdrawnEarnings.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm mt-2">Previously withdrawn</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              KSh {earnings.totalEarnings.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm mt-2">All-time earnings</p>
          </div>
        </div>
        
        {/* Withdrawal Request Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Request Withdrawal</h2>
          
          {earnings.hasPendingRequest ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-700 font-medium">
                  You have a pending withdrawal request. Please wait for it to be processed before submitting a new one.
                </p>
              </div>
              <p className="text-yellow-600 text-sm mt-2 ml-7">
                Withdrawal requests are typically processed within 2-3 business days.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Withdrawal Amount</label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KSh</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                      min="100"
                      max={earnings.availableEarnings}
                      step="1"
                      className="border border-gray-300 rounded-lg pl-12 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setWithdrawAmount(earnings.availableEarnings)}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Max
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    Available: <span className="font-medium text-green-600">KSh {earnings.availableEarnings.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Minimum: <span className="font-medium">KSh 100</span>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Payment Details</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">M-Pesa Number:</span>
                    <span className="font-medium">
                      {vendorInfo?.mpesaNumber || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {vendorInfo?.firstName} {vendorInfo?.lastName}
                    </span>
                  </div>
                  {!vendorInfo?.mpesaNumber && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-700 text-sm">
                        ⚠️ Please update your M-Pesa number in your profile settings to receive payments.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleWithdrawRequest}
                disabled={withdrawAmount < 100 || withdrawAmount > earnings.availableEarnings || isRequesting || !vendorInfo?.mpesaNumber}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors w-full md:w-auto ${
                  withdrawAmount >= 100 && withdrawAmount <= earnings.availableEarnings && !isRequesting && vendorInfo?.mpesaNumber
                    ? 'bg-[#bf2c7e] text-white hover:bg-[#a8246e]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isRequesting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Submit Withdrawal Request'
                )}
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Important Information
                </h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Withdrawal requests are processed within 2-3 business days</li>
                  <li>• Minimum withdrawal amount is KSh 100</li>
                  <li>• Platform commission is deducted from each sale</li>
                  <li>• Earnings become available 24 hours after order delivery</li>
                  <li>• You can only have one pending withdrawal request at a time</li>
                </ul>
              </div>
            </>
          )}
        </div>
        
        {/* Earnings History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Earnings History</h2>
            <p className="text-gray-600 text-sm mt-1">Track your earnings from each order</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-left text-gray-600 font-medium">Order ID</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-medium">Date</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-medium">Amount</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-medium">Commission</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-medium">Net Amount</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No earnings history yet</p>
                      <p className="text-gray-400 text-sm mt-1">Your earnings will appear here once customers purchase your products</p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-900">
                          {transaction.orderId.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">
                        KSh {transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-red-600 font-medium">
                        -KSh {transaction.commission.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 font-bold text-green-700">
                        KSh {transaction.netAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}