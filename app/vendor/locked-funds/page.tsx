// app/vendor/locked-funds/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Clock, Wallet, Info } from 'lucide-react';

interface LockedFund {
  _id: string;
  orderId: string;
  amount: number;
  netAmount: number;
  type: string;
  metadata: {
    isImmediateRelease?: boolean;
    percentage?: number;
    holdUntil?: string;
    breakdown?: {
      totalAmount: number;
      commission: number;
      vendorEarnings: number;
      immediateRelease: number;
      remaining20Percent: number;
    };
  };
  scheduledAt: string;
  withdrawalStatus: string;
  createdAt: string;
}

interface WithdrawalRequest {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function LockedFundsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [lockedFunds, setLockedFunds] = useState<LockedFund[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [reason, setReason] = useState('');
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'vendor') {
      router.push('/unauthorized');
      return;
    }
    fetchLockedFunds();
    fetchPendingWithdrawals();
  }, [user, isLoading]);

  const fetchLockedFunds = async () => {
    try {
      const response = await fetch('/api/vendor/funds/locked');
      if (!response.ok) throw new Error('Failed to fetch locked funds');
      const data = await response.json();
      setLockedFunds(data);
      setMpesaNumber(user?.mpesaNumber || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingWithdrawals = async () => {
    try {
      const response = await fetch('/api/vendor/withdrawals/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingWithdrawals(data);
      }
    } catch (err) {
      console.error('Error fetching pending withdrawals:', err);
    }
  };

  const handleSelectFund = (fundId: string) => {
    setSelectedFunds(prev => 
      prev.includes(fundId) 
        ? prev.filter(id => id !== fundId)
        : [...prev, fundId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFunds.length === lockedFunds.length) {
      setSelectedFunds([]);
    } else {
      setSelectedFunds(lockedFunds.map(f => f._id));
    }
  };

  const handleSubmitWithdrawal = async () => {
    if (selectedFunds.length === 0) {
      setError('Please select at least one fund to withdraw');
      return;
    }

    if (!mpesaNumber) {
      setError('Please enter your M-PESA number');
      return;
    }

    // Validate M-PESA number
    const mpesaRegex = /^(07\d{8}|7\d{8}|\+2547\d{8}|2547\d{8})$/;
    if (!mpesaRegex.test(mpesaNumber)) {
      setError('Please enter a valid M-PESA number (e.g., 0712345678)');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/vendor/withdrawals/locked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundIds: selectedFunds,
          mpesaNumber,
          reason: reason || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit withdrawal request');
      }

      setSuccess(`Withdrawal request submitted successfully! Amount: KSh ${data.totalAmount.toLocaleString()}`);
      setSelectedFunds([]);
      setReason('');
      setShowWithdrawalModal(false);
      
      // Refresh data
      fetchLockedFunds();
      fetchPendingWithdrawals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const totalSelected = selectedFunds.reduce((sum, id) => {
    const fund = lockedFunds.find(f => f._id === id);
    return sum + (fund?.amount || 0);
  }, 0);

  const totalLocked = lockedFunds.reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Locked Funds Withdrawal</h1>
          </div>
          <button
            onClick={() => router.push('/vendor/dashboard')}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Locked Funds</p>
                <p className="text-3xl font-bold text-blue-600">
                  KSh {totalLocked.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">20% hold from completed orders</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selected Amount</p>
                <p className="text-3xl font-bold text-purple-600">
                  KSh {totalSelected.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{selectedFunds.length} items selected</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingWithdrawals.length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting admin approval</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Locked Funds by Order</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-[#bf2c7e] hover:text-[#a8246e]"
                >
                  {selectedFunds.length === lockedFunds.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={() => setShowWithdrawalModal(true)}
                  disabled={selectedFunds.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedFunds.length > 0
                      ? 'bg-[#bf2c7e] text-white hover:bg-[#a8246e]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Withdraw Selected (KSh {totalSelected.toLocaleString()})
                </button>
              </div>
            </div>
          </div>

          {lockedFunds.length === 0 ? (
            <div className="p-12 text-center">
              <Lock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No locked funds</h3>
              <p className="mt-2 text-gray-500">
                You don't have any locked funds at the moment. Locked funds appear when orders are completed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedFunds.length === lockedFunds.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-[#bf2c7e] rounded border-gray-300 focus:ring-[#bf2c7e]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (20% Hold)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Order Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lockedFunds.map((fund) => (
                    <tr key={fund._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFunds.includes(fund._id)}
                          onChange={() => handleSelectFund(fund._id)}
                          className="h-4 w-4 text-[#bf2c7e] rounded border-gray-300 focus:ring-[#bf2c7e]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{fund.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-blue-600">
                          KSh {fund.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          KSh {fund.metadata?.breakdown?.totalAmount?.toLocaleString() || 'N/A'}
                        </div>
                        {fund.metadata?.breakdown && (
                          <div className="text-xs text-gray-500">
                            Commission: KSh {fund.metadata.breakdown.commission.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(fund.scheduledAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          LOCKED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About Locked Funds:</p>
            <p>These are the 20% portions held from your completed orders. You can withdraw them at any time. 
               Once you submit a withdrawal request, an admin will process it and send the money to your M-PESA.</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Withdraw Locked Funds</h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Amount to withdraw:</p>
              <p className="text-2xl font-bold text-blue-600">
                KSh {totalSelected.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From {selectedFunds.length} order(s)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-PESA Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                  placeholder="e.g., 0712345678"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the M-PESA number to receive payment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e]"
                  placeholder="Add any notes about this withdrawal..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitWithdrawal}
                  disabled={submitting}
                  className="flex-1 bg-[#bf2c7e] text-white py-2 rounded-lg hover:bg-[#a8246e] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => {
                    setShowWithdrawalModal(false);
                    setReason('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}