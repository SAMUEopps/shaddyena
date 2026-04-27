// app/dashboard/withdrawals/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Building2,
  CreditCard,
  Wallet,
  Loader2
} from 'lucide-react';

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  paymentMethod: string;
  mpesaTransactionCode?: string;
  requestedAt: string;
  completedAt?: string;
  adminNotes?: string;
}

interface EarningsSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  withdrawals: Withdrawal[];
}

export default function WithdrawalsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchEarnings();
    }
  }, [user, authLoading]);

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/referrals/earnings-summary');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 1) {
      toast.error('Minimum withdrawal amount is KES 100');
      return;
    }

    if (!earnings || amount > earnings.availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/referrals/request-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          paymentMethod,
          phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : undefined,
          bankDetails: paymentMethod === 'bank' ? bankDetails : undefined
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setPhoneNumber('');
        setBankDetails({ bankName: '', accountNumber: '', accountName: '' });
        fetchEarnings();
      } else {
        toast.error(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs"><Clock className="w-3 h-3" /> Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs"><AlertCircle className="w-3 h-3" /> Approved</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return null;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">Withdraw Earnings</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Request payout for your referral earnings</p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={!earnings || earnings.availableBalance < 1}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(earnings?.totalEarnings || 0)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Total Earnings</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(earnings?.availableBalance || 0)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Available Balance</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(earnings?.pendingWithdrawals || 0)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Pending Withdrawals</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(earnings?.completedWithdrawals || 0)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Total Withdrawn</p>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Withdrawal History</h2>
          </div>
          
          {earnings?.withdrawals && earnings.withdrawals.length > 0 ? (
            <div className="divide-y divide-[var(--color-border)]">
              {earnings.withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-6 hover:bg-[var(--color-background-soft)] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-lg font-semibold text-[var(--color-text)]">
                          {formatCurrency(withdrawal.amount)}
                        </p>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          {withdrawal.paymentMethod === 'mpesa' ? 
                            <Phone className="w-4 h-4" /> : 
                            <Building2 className="w-4 h-4" />
                          }
                          {withdrawal.paymentMethod === 'mpesa' ? 'M-PESA' : 'Bank Transfer'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Requested: {formatDate(withdrawal.requestedAt)}
                        </span>
                        {withdrawal.completedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Completed: {formatDate(withdrawal.completedAt)}
                          </span>
                        )}
                      </div>
                      {withdrawal.mpesaTransactionCode && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                          Transaction Code: {withdrawal.mpesaTransactionCode}
                        </p>
                      )}
                      {withdrawal.adminNotes && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          Note: {withdrawal.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Wallet className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No Withdrawals Yet</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                You haven't made any withdrawal requests yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-bold text-[var(--color-text)]">Request Withdrawal</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Available balance: {formatCurrency(earnings?.availableBalance || 0)}
              </p>
            </div>

            <form onSubmit={handleWithdrawRequest} className="p-6 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount (min 100)"
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                  required
                  min="1"
                  step="1"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    M-PESA
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Bank Transfer
                  </button>
                </div>
              </div>

              {/* M-PESA Phone Number */}
              {paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    M-PESA Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 254712345678"
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                    required={paymentMethod === 'mpesa'}
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Enter phone number in international format (e.g., 254712345678)
                  </p>
                </div>
              )}

              {/* Bank Details */}
              {paymentMethod === 'bank' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                      required={paymentMethod === 'bank'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                      required={paymentMethod === 'bank'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                      required={paymentMethod === 'bank'}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}