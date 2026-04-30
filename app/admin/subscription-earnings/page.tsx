// app/admin/referral-withdrawals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Download,
  Eye,
  RefreshCw,
  Wallet,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Calendar,
  Banknote,
  Smartphone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Send,
  MessageCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferralWithdrawal {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    referralCode: string;
    referralCount: number;
  };
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  withdrawalMethod: 'MPESA' | 'BANK' | 'WALLET';
  withdrawalDetails: {
    phone?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
  notes?: string;
  rejectionReason?: string;
  metadata?: any;
}

interface Stats {
  totalPending: number;
  totalProcessing: number;
  totalCompleted: number;
  totalAmount: number;
  averageAmount: number;
  pendingAmount: number;
  completedThisMonth: number;
}

const statusColors = {
  PENDING: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Clock },
  PROCESSING: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: RefreshCw },
  COMPLETED: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle },
  FAILED: { bg: 'bg-red-500/10', text: 'text-red-500', icon: XCircle },
  CANCELLED: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: XCircle }
};

export default function AdminReferralWithdrawals() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<ReferralWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalPending: 0,
    totalProcessing: 0,
    totalCompleted: 0,
    totalAmount: 0,
    averageAmount: 0,
    pendingAmount: 0,
    completedThisMonth: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<ReferralWithdrawal | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processingAmount, setProcessingAmount] = useState(false);
  const [processData, setProcessData] = useState({
    transactionId: '',
    notes: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchWithdrawals();
    }
  }, [user]);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/admin/referral-withdrawals');
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async (withdrawalId: string, status: 'PROCESSING' | 'COMPLETED' | 'FAILED') => {
    setProcessingAmount(true);
    try {
      const response = await fetch('/api/admin/referral-withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId,
          status,
          transactionId: processData.transactionId,
          notes: processData.notes
        })
      });

      if (response.ok) {
        toast.success(`Withdrawal ${status.toLowerCase()} successfully`);
        setShowProcessModal(false);
        setProcessData({ transactionId: '', notes: '' });
        fetchWithdrawals();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      toast.error('Error processing withdrawal');
    } finally {
      setProcessingAmount(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = 
      w.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.userId?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWithdrawals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

  const getTotalPages = () => totalPages;

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h1>
          <p className="text-[var(--color-text-muted)]">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
                  <Award className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                  Referral Bonus Withdrawals
                </h1>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Manage and process referral bonus withdrawal requests
              </p>
            </div>
            <button
              onClick={fetchWithdrawals}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Pending Requests</span>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalPending}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              KES {stats.pendingAmount.toLocaleString()} pending
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Processing</span>
              <RefreshCw className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalProcessing}</p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalCompleted}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              KES {stats.completedThisMonth.toLocaleString()} this month
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Total Disbursed</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              KES {stats.totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Avg. KES {stats.averageAmount.toLocaleString()} per withdrawal
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Withdrawals Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Method</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Requested</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {currentItems.map((withdrawal) => {
                    const StatusIcon = statusColors[withdrawal.status].icon;
                    
                    return (
                      <tr key={withdrawal._id} className="hover:bg-[var(--color-background)] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--color-text)]">
                              {withdrawal.userId?.firstName} {withdrawal.userId?.lastName}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">{withdrawal.userId?.email}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{withdrawal.userId?.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-lg font-bold text-[var(--color-primary-alt)]">
                            KES {withdrawal.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            Referrals: {withdrawal.userId?.referralCount || 0}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {withdrawal.withdrawalMethod === 'MPESA' ? (
                              <Smartphone className="w-4 h-4 text-green-500" />
                            ) : (
                              <Banknote className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm">{withdrawal.withdrawalMethod}</span>
                          </div>
                          {withdrawal.withdrawalMethod === 'MPESA' && withdrawal.withdrawalDetails.phone && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              {withdrawal.withdrawalDetails.phone}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${statusColors[withdrawal.status].bg} ${statusColors[withdrawal.status].text}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="text-sm">{withdrawal.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[var(--color-text)]">
                            {new Date(withdrawal.requestedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {new Date(withdrawal.requestedAt).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowProcessModal(true);
                              }}
                              className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all"
                              disabled={withdrawal.status !== 'PENDING'}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                              }}
                              className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-[var(--color-text-muted)]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Process Withdrawal Modal */}
      {showProcessModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-background)] rounded-xl w-full max-w-md">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Process Withdrawal
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[var(--color-surface)] rounded-lg p-4">
                <p className="text-sm text-[var(--color-text-muted)]">User</p>
                <p className="font-medium">{selectedWithdrawal.userId?.firstName} {selectedWithdrawal.userId?.lastName}</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">Amount</p>
                <p className="text-2xl font-bold text-[var(--color-primary-alt)]">
                  KES {selectedWithdrawal.amount.toLocaleString()}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">Method</p>
                <p className="font-medium">{selectedWithdrawal.withdrawalMethod}</p>
                {selectedWithdrawal.withdrawalDetails.phone && (
                  <>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">Phone</p>
                    <p className="font-medium">{selectedWithdrawal.withdrawalDetails.phone}</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Transaction ID / Receipt
                </label>
                <input
                  type="text"
                  value={processData.transactionId}
                  onChange={(e) => setProcessData({ ...processData, transactionId: e.target.value })}
                  placeholder="e.g., MPESA Receipt Number"
                  className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={processData.notes}
                  onChange={(e) => setProcessData({ ...processData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about this transaction..."
                  className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowProcessModal(false);
                    setProcessData({ transactionId: '', notes: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleProcessWithdrawal(selectedWithdrawal._id, 'PROCESSING')}
                  disabled={processingAmount}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {processingAmount ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Mark as Processing'}
                </button>
                <button
                  onClick={() => handleProcessWithdrawal(selectedWithdrawal._id, 'COMPLETED')}
                  disabled={processingAmount}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {processingAmount ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}