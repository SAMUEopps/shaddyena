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

// app/delivery/withdraw/page.tsx - Complete fixed version
'use client';

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
        {/* Left Column - Withdrawal Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Earnings</h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-[#bf2c7e] to-[#a8246e] text-white rounded-lg p-6 mb-6">
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(earningsData.availableBalance)}
              </p>
              
              {/* Breakdown */}
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

        {/* Right Column - Quick Info */}
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

      {/* Withdrawal History */}
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
}