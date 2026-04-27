// app/admin/withdrawals/page.tsx
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  Send,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface Withdrawal {
  _id: string;
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  paymentMethod: string;
  mpesaTransactionCode?: string;
  phoneNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    referralCode: string;
    referralCount: number;
  };
  processedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminWithdrawalsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processAction, setProcessAction] = useState<'completed' | 'rejected'>('completed');
  const [mpesaCode, setMpesaCode] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
    if (user && user.role === 'admin') {
      fetchWithdrawals();
    }
  }, [user, authLoading, statusFilter, pagination.page]);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/withdrawals?status=${statusFilter}&page=${pagination.page}&limit=${pagination.limit}`);
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch withdrawals');
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal) return;

    if (processAction === 'completed' && selectedWithdrawal.paymentMethod === 'mpesa' && !mpesaCode) {
      toast.error('Please enter M-PESA transaction code');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/withdrawals/${selectedWithdrawal._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: processAction,
          mpesaTransactionCode: processAction === 'completed' ? mpesaCode : undefined,
          adminNotes: adminNotes || undefined
        })
      });

      if (response.ok) {
        toast.success(`Withdrawal ${processAction === 'completed' ? 'completed' : 'rejected'} successfully`);
        setShowProcessModal(false);
        setSelectedWithdrawal(null);
        setMpesaCode('');
        setAdminNotes('');
        fetchWithdrawals();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to process withdrawal');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWithdrawal = async (withdrawal: Withdrawal) => {
    if (!confirm('Are you sure you want to delete this pending withdrawal request?')) return;

    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawal._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Withdrawal request deleted successfully');
        fetchWithdrawals();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete withdrawal');
      }
    } catch (error) {
      toast.error('Something went wrong');
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
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">Withdrawal Requests</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage user withdrawal requests</p>
            </div>
            <button
              onClick={fetchWithdrawals}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-6 border border-[var(--color-border)]">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-[var(--color-background)] text-[var(--color-text-muted)] hover:bg-yellow-500/10'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'approved'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--color-background)] text-[var(--color-text-muted)] hover:bg-blue-500/10'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-[var(--color-background)] text-[var(--color-text-muted)] hover:bg-green-500/10'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-[var(--color-background)] text-[var(--color-text-muted)] hover:bg-red-500/10'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-gray-500 text-white'
                  : 'bg-[var(--color-background)] text-[var(--color-text-muted)] hover:bg-gray-500/10'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">User</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Method</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Requested</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--color-text)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--color-text-muted)]">
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">
                            {withdrawal.userId.firstName} {withdrawal.userId.lastName}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">{withdrawal.userId.email}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">Code: {withdrawal.userId.referralCode}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-[var(--color-text)]">{formatCurrency(withdrawal.amount)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-[var(--color-text)]">
                          {withdrawal.paymentMethod === 'mpesa' ? 
                            <Phone className="w-4 h-4" /> : 
                            <Building2 className="w-4 h-4" />
                          }
                          {withdrawal.paymentMethod === 'mpesa' ? 'M-PESA' : 'Bank'}
                        </div>
                        {withdrawal.paymentMethod === 'mpesa' && withdrawal.phoneNumber && (
                          <p className="text-xs text-[var(--color-text-muted)]">{withdrawal.phoneNumber}</p>
                        )}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(withdrawal.status)}
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-[var(--color-text-muted)]">{formatDate(withdrawal.requestedAt)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowProcessModal(true);
                              setProcessAction('completed');
                              setMpesaCode('');
                              setAdminNotes('');
                            }}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Process as Completed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowProcessModal(true);
                              setProcessAction('rejected');
                              setMpesaCode('');
                              setAdminNotes('');
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {withdrawal.status === 'pending' && (
                            <button
                              onClick={() => handleDeleteWithdrawal(withdrawal)}
                              className="p-2 text-gray-500 hover:bg-gray-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[var(--color-border)] flex justify-between items-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Process Modal */}
      {showProcessModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {processAction === 'completed' ? 'Complete Withdrawal' : 'Reject Withdrawal'}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                User: {selectedWithdrawal.userId.firstName} {selectedWithdrawal.userId.lastName}<br />
                Amount: {formatCurrency(selectedWithdrawal.amount)}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {processAction === 'completed' && selectedWithdrawal.paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    M-PESA Transaction Code
                  </label>
                  <input
                    type="text"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value)}
                    placeholder="e.g., QWERTY1234"
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                    required
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Enter the M-PESA transaction code from the payment sent to the user
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this withdrawal..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)] resize-none"
                />
              </div>

              {processAction === 'completed' && selectedWithdrawal.paymentMethod === 'bank' && (
                <div className="bg-blue-500/10 rounded-lg p-4">
                  <p className="text-sm text-blue-500 mb-2">Bank Transfer Details:</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Bank: {selectedWithdrawal.bankDetails?.bankName}<br />
                    Account: {selectedWithdrawal.bankDetails?.accountNumber}<br />
                    Name: {selectedWithdrawal.bankDetails?.accountName}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessWithdrawal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {processAction === 'completed' ? 'Mark as Completed' : 'Reject Withdrawal'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}