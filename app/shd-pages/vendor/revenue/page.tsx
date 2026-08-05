// app/shd-pages/vendor/revenue/page.tsx
'use client';

import { useState, useEffect } from 'react';


import { useVendorData } from '../dashboard/components/useVendorData';
import LoadingSpinner from '../dashboard/components/LoadingSpinner';
import MessageBanner from '../dashboard/components/MessageBanner';

interface RevenueStats {
  totalRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  lifetimeEarnings: number;
}

interface WithdrawalHistory {
  _id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'MPESA' | 'BANK';
  reference: string;
  createdAt: string;
}

export default function RevenuePage() {
  const { vendor, loading } = useVendorData();
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'MPESA' | 'BANK'>('MPESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', accountName: '' });
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (vendor) {
      setRevenueStats({
        totalRevenue: vendor.totalRevenue || 0,
        availableBalance: vendor.availableBalance || 0,
        pendingBalance: vendor.pendingBalance || 0,
        totalWithdrawn: vendor.totalWithdrawn || 0,
        lifetimeEarnings: vendor.lifetimeEarnings || 0
      });

      // Set default phone from vendor profile
      setPhoneNumber(vendor.payoutDetails?.mpesaNumber || vendor.phoneNumber || '');
      fetchWithdrawalHistory();
    }
  }, [vendor]);

  const fetchWithdrawalHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/vendors/withdrawals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWithdrawalHistory(data.withdrawals || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      showMessage('error', 'Please enter a valid amount');
      return;
    }

    if (amount > (revenueStats?.availableBalance || 0)) {
      showMessage('error', 'Insufficient balance');
      return;
    }

    if (withdrawMethod === 'MPESA' && !phoneNumber) {
      showMessage('error', 'Please enter your phone number');
      return;
    }

    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/vendors/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          method: withdrawMethod,
          phoneNumber: withdrawMethod === 'MPESA' ? phoneNumber : undefined,
          bankDetails: withdrawMethod === 'BANK' ? bankDetails : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Withdrawal request submitted successfully!');
        setWithdrawAmount('');
        setShowWithdrawModal(false);
        // Refresh stats
        if (vendor) {
          vendor.availableBalance = data.newBalance || vendor.availableBalance - amount;
          vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) + amount;
          setRevenueStats({
            totalRevenue: vendor.totalRevenue || 0,
            availableBalance: vendor.availableBalance || 0,
            pendingBalance: vendor.pendingBalance || 0,
            totalWithdrawn: vendor.totalWithdrawn || 0,
            lifetimeEarnings: vendor.lifetimeEarnings || 0
          });
        }
        fetchWithdrawalHistory();
      } else {
        showMessage('error', data.error || 'Withdrawal failed');
      }
    } catch (error) {
      showMessage('error', 'Failed to process withdrawal');
    } finally {
      setLoadingAction(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading revenue data..." />;
  }

  const stats = revenueStats || {
    totalRevenue: 0,
    availableBalance: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    lifetimeEarnings: 0
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
        {message && <MessageBanner type={message.type} text={message.text} />}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Revenue Dashboard</h1>
          <p className="text-muted text-sm">Track your earnings and manage withdrawals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
            <p className="text-sm text-muted">Total Revenue</p>
            <p className="text-2xl font-bold text-secondary mt-1">KSh {stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
            <p className="text-sm text-muted">Available Balance</p>
            <p className="text-2xl font-bold text-green-600 mt-1">KSh {stats.availableBalance.toLocaleString()}</p>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={stats.availableBalance <= 0}
              className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
            <p className="text-sm text-muted">Pending Balance</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">KSh {stats.pendingBalance.toLocaleString()}</p>
            <p className="text-xs text-muted mt-1">Released on delivery</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
            <p className="text-sm text-muted">Total Withdrawn</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">KSh {stats.totalWithdrawn.toLocaleString()}</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-surface mb-8">
          <h2 className="text-lg font-semibold text-secondary mb-4">Revenue Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted">Total Earned (Lifetime)</span>
              <span className="font-semibold">KSh {stats.lifetimeEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted">Available for Withdrawal</span>
              <span className="font-semibold text-green-600">KSh {stats.availableBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted">Pending (On Delivery)</span>
              <span className="font-semibold text-yellow-600">KSh {stats.pendingBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Already Withdrawn</span>
              <span className="font-semibold text-purple-600">KSh {stats.totalWithdrawn.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
          <h2 className="text-lg font-semibold text-secondary mb-4">Withdrawal History</h2>
          {withdrawalHistory.length === 0 ? (
            <p className="text-muted text-center py-8">No withdrawals yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted border-b">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalHistory.map((withdrawal) => (
                    <tr key={withdrawal._id} className="border-b last:border-0">
                      <td className="py-3 text-sm">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-medium">KSh {withdrawal.amount.toLocaleString()}</td>
                      <td className="py-3 text-sm">{withdrawal.method}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                          withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-muted">{withdrawal.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted">Available Balance</p>
              <p className="text-2xl font-bold text-secondary">
                KSh {stats.availableBalance.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (KSh)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  max={stats.availableBalance}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as 'MPESA' | 'BANK')}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="MPESA">M-PESA</option>
                  <option value="BANK">Bank Transfer</option>
                </select>
              </div>

              {withdrawMethod === 'MPESA' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="2547XXXXXXXX"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}

              {withdrawMethod === 'BANK' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Number</label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Name</label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleWithdraw}
                disabled={loadingAction}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAction ? 'Processing...' : 'Withdraw Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}