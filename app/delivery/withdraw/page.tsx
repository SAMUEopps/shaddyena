// app/delivery/withdraw/page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowLeft, CreditCard, Smartphone, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Withdrawal {
  _id: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'M-PESA' | 'BANK_TRANSFER';
  phoneNumber?: string;
  reference?: string;
  mpesaReceipt?: string;
  createdAt: string;
  processedAt?: string;
}

export default function WithdrawPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-PESA' | 'BANK_TRANSFER'>('M-PESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'delivery') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch balance
      const balanceRes = await fetch('/api/delivery/rider/earnings');
      const balanceData = await balanceRes.json();
      setBalance(balanceData.totalEarnings);

      // Fetch withdrawal history
      const historyRes = await fetch('/api/delivery/rider/withdrawals');
      const historyData = await historyRes.json();
      setWithdrawals(historyData.withdrawals || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const withdrawAmount = Number(amount);
    if (withdrawAmount < 50) {
      setError('Minimum withdrawal amount is 50 KES');
      return;
    }
    if (withdrawAmount > balance) {
      setError('Insufficient balance');
      return;
    }
    if (paymentMethod === 'M-PESA' && !phoneNumber.match(/^0?[17]\d{8}$/)) {
      setError('Please enter a valid M-PESA phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/delivery/rider/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          paymentMethod,
          phoneNumber: paymentMethod === 'M-PESA' ? phoneNumber : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process withdrawal');
      }

      setSuccess('Withdrawal request submitted successfully!');
      setAmount('');
      setPhoneNumber('');
      fetchData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Withdrawal Form *
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Earnings</h1>

            {/* Balance Card *
            <div className="bg-gradient-to-r from-[#bf2c7e] to-[#a8246e] text-white rounded-lg p-6 mb-6">
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-3xl font-bold mt-2">
                {new Intl.NumberFormat('en-KE', {
                  style: 'currency',
                  currency: 'KES',
                  minimumFractionDigits: 0
                }).format(balance)}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Withdraw (KES)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="50"
                  max={balance}
                  step="10"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                  placeholder="Enter amount"
                />
                <p className="mt-1 text-sm text-gray-500">Minimum: 50 KES</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('M-PESA')}
                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg ${
                      paymentMethod === 'M-PESA'
                        ? 'border-[#bf2c7e] bg-pink-50 text-[#bf2c7e]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Smartphone className="h-5 w-5" />
                    <span>M-PESA</span>
                  </button>
                  {/*<button
                    type="button"
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-[#bf2c7e] bg-pink-50 text-[#bf2c7e]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Bank</span>
                  </button>*
                </div>
              </div>

              {paymentMethod === 'M-PESA' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-PESA Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                    placeholder="e.g., 0712345678"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the M-PESA number to receive payment
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || balance < 50}
                className="w-full py-3 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Quick Info *
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Info</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Withdrawals are processed within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Minimum withdrawal: 50 KES</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>No withdrawal fees</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History *
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h2>
        
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No withdrawal requests yet</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES',
                        minimumFractionDigits: 0
                      }).format(withdrawal.amount)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(withdrawal.createdAt)}
                    </p>
                    {withdrawal.mpesaReceipt && (
                      <p className="text-sm text-gray-600 mt-1">
                        Receipt: {withdrawal.mpesaReceipt}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {withdrawal.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

// app/delivery/withdraw/page.tsx 
/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowLeft, CreditCard, Smartphone, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';

interface Withdrawal {
  _id: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'M-PESA' | 'BANK_TRANSFER';
  phoneNumber?: string;
  reference?: string;
  mpesaReceipt?: string;
  createdAt: string;
  processedAt?: string;
}

interface EarningsData {
  totalEarnings: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  availableBalance: number;
}

export default function WithdrawPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
    availableBalance: 0
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-PESA' | 'BANK_TRANSFER'>('M-PESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'delivery') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch balance with proper earnings data
      const balanceRes = await fetch('/api/delivery/rider/earnings');
      if (!balanceRes.ok) {
        throw new Error('Failed to fetch earnings');
      }
      const balanceData = await balanceRes.json();
      console.log('📊 Earnings data received:', balanceData);
      
      // Set earnings data with available balance
      setEarningsData({
        totalEarnings: balanceData.totalEarnings || 0,
        pendingWithdrawals: balanceData.pendingWithdrawals || 0,
        completedWithdrawals: balanceData.completedWithdrawals || 0,
        availableBalance: balanceData.availableBalance || 0
      });

      // Fetch withdrawal history
      const historyRes = await fetch('/api/delivery/rider/withdrawals');
      if (!historyRes.ok) {
        throw new Error('Failed to fetch history');
      }
      const historyData = await historyRes.json();
      setWithdrawals(historyData.withdrawals || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const withdrawAmount = Number(amount);
    if (withdrawAmount < 50) {
      setError('Minimum withdrawal amount is 50 KES');
      return;
    }
    if (withdrawAmount > earningsData.availableBalance) {
      setError(`Insufficient balance. Available: ${formatCurrency(earningsData.availableBalance)}`);
      return;
    }
    if (paymentMethod === 'M-PESA' && !phoneNumber.match(/^0?[17]\d{8}$/)) {
      setError('Please enter a valid M-PESA phone number (e.g., 0712345678)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/delivery/rider/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          paymentMethod,
          phoneNumber: paymentMethod === 'M-PESA' ? phoneNumber : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // If the error contains balance details, show them
        if (data.details) {
          throw new Error(`${data.message}. Available: ${formatCurrency(data.details.availableBalance)}`);
        }
        throw new Error(data.message || 'Failed to process withdrawal');
      }

      setSuccess('Withdrawal request submitted successfully!');
      setAmount('');
      setPhoneNumber('');
      fetchData(); // Refresh data to update balance
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Withdrawal Form *
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Earnings</h1>

            {/* Balance Card *
            <div className="bg-gradient-to-r from-[#bf2c7e] to-[#a8246e] text-white rounded-lg p-6 mb-6">
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(earningsData.availableBalance)}
              </p>
              
              {/* Breakdown *
              <div className="mt-4 pt-4 border-t border-white border-opacity-20 text-sm">
                <div className="flex justify-between">
                  <span>Total Earned:</span>
                  <span className="font-medium">{formatCurrency(earningsData.totalEarnings)}</span>
                </div>
                {earningsData.pendingWithdrawals > 0 && (
                  <div className="flex justify-between mt-1 text-yellow-200">
                    <span>Pending Withdrawals:</span>
                    <span className="font-medium">-{formatCurrency(earningsData.pendingWithdrawals)}</span>
                  </div>
                )}
                {earningsData.completedWithdrawals > 0 && (
                  <div className="flex justify-between mt-1 text-green-200">
                    <span>Already Withdrawn:</span>
                    <span className="font-medium">-{formatCurrency(earningsData.completedWithdrawals)}</span>
                  </div>
                )}
                <div className="flex justify-between mt-2 pt-2 border-t border-white border-opacity-20 font-bold">
                  <span>Available Now:</span>
                  <span>{formatCurrency(earningsData.availableBalance)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Withdraw (KES)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="50"
                  max={earningsData.availableBalance}
                  step="10"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                  placeholder="Enter amount"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">Minimum: 50 KES</p>
                  <button
                    type="button"
                    onClick={() => setAmount(earningsData.availableBalance.toString())}
                    className="text-sm text-[#bf2c7e] hover:text-[#a8246e]"
                  >
                    Max: {formatCurrency(earningsData.availableBalance)}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('M-PESA')}
                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg ${
                      paymentMethod === 'M-PESA'
                        ? 'border-[#bf2c7e] bg-pink-50 text-[#bf2c7e]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Smartphone className="h-5 w-5" />
                    <span>M-PESA</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'M-PESA' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-PESA Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                    placeholder="e.g., 0712345678"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the M-PESA number to receive payment
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || earningsData.availableBalance < 50}
                className="w-full py-3 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Quick Info *
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Info</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Withdrawals are processed within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Minimum withdrawal: 50 KES</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Available = Total - Pending - Withdrawn</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>No withdrawal fees</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History *
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h2>
        
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No withdrawal requests yet</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(withdrawal.createdAt)}
                    </p>
                    {withdrawal.mpesaReceipt && (
                      <p className="text-sm text-gray-600 mt-1">
                        Receipt: {withdrawal.mpesaReceipt}
                      </p>
                    )}
                    {withdrawal.reference && (
                      <p className="text-xs text-gray-400 mt-1">
                        Ref: {withdrawal.reference}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {withdrawal.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

// app/delivery/withdraw/page.tsx (Refactored)
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Wallet,
  ArrowLeft,
  CreditCard,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Shield,
  Award,
  TrendingUp,
  History,
  XCircle,
  ChevronRight
} from 'lucide-react';

interface Withdrawal {
  _id: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'M-PESA' | 'BANK_TRANSFER';
  phoneNumber?: string;
  reference?: string;
  mpesaReceipt?: string;
  createdAt: string;
  processedAt?: string;
}

interface EarningsData {
  totalEarnings: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  availableBalance: number;
}

export default function WithdrawPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
    availableBalance: 0
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-PESA' | 'BANK_TRANSFER'>('M-PESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'delivery') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const balanceRes = await fetch('/api/delivery/rider/earnings');
      if (!balanceRes.ok) {
        throw new Error('Failed to fetch earnings');
      }
      const balanceData = await balanceRes.json();
      
      setEarningsData({
        totalEarnings: balanceData.totalEarnings || 0,
        pendingWithdrawals: balanceData.pendingWithdrawals || 0,
        completedWithdrawals: balanceData.completedWithdrawals || 0,
        availableBalance: balanceData.availableBalance || 0
      });

      const historyRes = await fetch('/api/delivery/rider/withdrawals');
      if (!historyRes.ok) {
        throw new Error('Failed to fetch history');
      }
      const historyData = await historyRes.json();
      setWithdrawals(historyData.withdrawals || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const withdrawAmount = Number(amount);
    if (withdrawAmount < 50) {
      setError('Minimum withdrawal amount is 50 KES');
      return;
    }
    if (withdrawAmount > earningsData.availableBalance) {
      setError(`Insufficient balance. Available: ${formatCurrency(earningsData.availableBalance)}`);
      return;
    }
    if (paymentMethod === 'M-PESA' && !phoneNumber.match(/^0?[17]\d{8}$/)) {
      setError('Please enter a valid M-PESA phone number (e.g., 0712345678)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/delivery/rider/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          paymentMethod,
          phoneNumber: paymentMethod === 'M-PESA' ? phoneNumber : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          throw new Error(`${data.message}. Available: ${formatCurrency(data.details.availableBalance)}`);
        }
        throw new Error(data.message || 'Failed to process withdrawal');
      }

      setSuccess('Withdrawal request submitted successfully!');
      setAmount('');
      setPhoneNumber('');
      fetchData();
      toast.success('Withdrawal request submitted!');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'PENDING': 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
      'PROCESSING': 'bg-blue-500/10 text-blue-600 border-blue-200',
      'COMPLETED': 'bg-green-500/10 text-green-600 border-green-200',
      'FAILED': 'bg-red-500/10 text-red-600 border-red-200',
      'CANCELLED': 'bg-gray-500/10 text-gray-600 border-gray-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500/10 text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'PROCESSING': return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              Withdraw Earnings
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Request payout for your completed deliveries
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Secure & Fast</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">24-48h Processing</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Award className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">No Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Withdrawal Form */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Request Withdrawal</h2>
              
              {/* Balance Card */}
              <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-6 mb-8">
                <p className="text-white/80 text-sm mb-2">Available Balance</p>
                <p className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(earningsData.availableBalance)}
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white/70 text-xs">Total Earned</p>
                    <p className="text-white font-semibold text-sm">{formatCurrency(earningsData.totalEarnings)}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Pending</p>
                    <p className="text-yellow-200 font-semibold text-sm">{formatCurrency(earningsData.pendingWithdrawals)}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Withdrawn</p>
                    <p className="text-green-200 font-semibold text-sm">{formatCurrency(earningsData.completedWithdrawals)}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-800">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Amount to Withdraw (KES)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]">
                      KES
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="50"
                      max={earningsData.availableBalance}
                      step="10"
                      required
                      className="w-full pl-16 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-[var(--color-text-muted)]">Minimum: 50 KES</p>
                    <button
                      type="button"
                      onClick={() => setAmount(earningsData.availableBalance.toString())}
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      Withdraw All
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('M-PESA')}
                      className={`flex items-center justify-center gap-2 p-4 border rounded-xl transition-all ${
                        paymentMethod === 'M-PESA'
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="font-medium">M-PESA</span>
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 p-4 border border-[var(--color-border)] rounded-xl text-[var(--color-text-muted)] opacity-50 cursor-not-allowed"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Bank Transfer</span>
                      <span className="text-xs">(Coming Soon)</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'M-PESA' && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      M-PESA Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      placeholder="e.g., 0712345678"
                    />
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      We'll send the payment to this M-PESA number
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || earningsData.availableBalance < 50}
                  className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Request Withdrawal'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-semibold text-[var(--color-text)] mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                Quick Info
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-text-muted)]">Withdrawals processed within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-text-muted)]">Minimum withdrawal: 50 KES</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-text-muted)]">Available = Total - Pending - Withdrawn</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--color-text-muted)]">No withdrawal fees</span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-semibold text-[var(--color-text)] mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="text-[var(--color-text-muted)]">✓ Complete more deliveries to increase earnings</li>
                <li className="text-[var(--color-text-muted)]">✓ Maintain high rating for bonus opportunities</li>
                <li className="text-[var(--color-text-muted)]">✓ Withdraw when balance is substantial</li>
                <li className="text-[var(--color-text-muted)]">✓ Keep phone number updated for payments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Withdrawal History
              </h2>
              <p className="text-[var(--color-text-muted)] mt-1">Track your past withdrawal requests</p>
            </div>
            <History className="w-5 h-5 text-[var(--color-text-muted)]" />
          </div>
          
          {withdrawals.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
              <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Wallet className="w-12 h-12 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No Withdrawals Yet</h3>
              <p className="text-[var(--color-text-muted)]">
                Your withdrawal history will appear here once you make your first request.
              </p>
            </div>
          ) : (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <div className="divide-y divide-[var(--color-border)]">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} className="p-6 hover:bg-[var(--color-background-soft)] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${getStatusBadge(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text)]">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            {formatDate(withdrawal.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(withdrawal.status)}`}>
                            {getStatusIcon(withdrawal.status)}
                            <span>{withdrawal.status}</span>
                          </span>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {withdrawal.paymentMethod}
                          </p>
                        </div>
                        {withdrawal.mpesaReceipt && (
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Receipt: {withdrawal.mpesaReceipt}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {withdrawal.status === 'COMPLETED' && withdrawal.processedAt && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                        <p className="text-xs text-green-600">
                          Processed on {formatDate(withdrawal.processedAt)}
                        </p>
                      </div>
                    )}
                    
                    {withdrawal.status === 'FAILED' && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                        <p className="text-xs text-red-600">
                          Failed to process. Please contact support.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/delivery-earnings"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5" />
            <span>View Earnings Dashboard</span>
          </Link>
          <Link
            href="/delivery/assignments"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105"
          >
            <span>Start New Delivery</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}