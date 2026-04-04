'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Wallet,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Smartphone,
  CreditCard,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  Calendar,
  Hash,
  Banknote,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Printer,
  Send,
  Ban,
  Shield,
  DollarSign,
  History,
  Receipt,
  Truck
} from 'lucide-react';

interface WithdrawalRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mpesaNumber?: string;
  };
  userRole: 'delivery' | 'vendor';
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'M-PESA' | 'BANK_TRANSFER';
  phoneNumber?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode?: string;
  };
  reference?: string;
  mpesaReceipt?: string;
  processedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface RiderBalance {
  userId: string;
  totalEarnings: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  availableBalance: number;
}

interface StatsData {
  totalRequests: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  averageAmount: number;
}

export default function RiderWithdrawalsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [riderBalances, setRiderBalances] = useState<Map<string, RiderBalance>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [processingNotes, setProcessingNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    totalRequests: 0,
    totalAmount: 0,
    pendingAmount: 0,
    completedAmount: 0,
    pendingCount: 0,
    processingCount: 0,
    completedCount: 0,
    failedCount: 0,
    averageAmount: 0
  });

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchRequests();
  }, [user, statusFilter]);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `/api/admin/withdrawals/rider?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data.requests || []);
      calculateStats(data.requests || []);
      
      const userIds: string[] = [...new Set((data.requests as WithdrawalRequest[]).map((r) => r.userId._id))];
      await fetchRiderBalances(userIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRiderBalances = async (userIds: string[]) => {
    try {
      const balances = new Map();
      for (const userId of userIds) {
        const response = await fetch(`/api/admin/rider-balance?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          balances.set(userId, data);
        }
      }
      setRiderBalances(balances);
    } catch (err) {
      console.error('Error fetching rider balances:', err);
    }
  };

  const calculateStats = (requestsList: WithdrawalRequest[]) => {
    const totalAmount = requestsList.reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = requestsList.filter(r => r.status === 'PENDING').reduce((sum, r) => sum + r.amount, 0);
    const completedAmount = requestsList.filter(r => r.status === 'COMPLETED').reduce((sum, r) => sum + r.amount, 0);
    
    setStats({
      totalRequests: requestsList.length,
      totalAmount: totalAmount,
      pendingAmount: pendingAmount,
      completedAmount: completedAmount,
      pendingCount: requestsList.filter(r => r.status === 'PENDING').length,
      processingCount: requestsList.filter(r => r.status === 'PROCESSING').length,
      completedCount: requestsList.filter(r => r.status === 'COMPLETED').length,
      failedCount: requestsList.filter(r => r.status === 'FAILED').length,
      averageAmount: requestsList.length > 0 ? totalAmount / requestsList.length : 0
    });
  };

  const handleProcessRequest = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/withdrawals/rider/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: selectedRequest._id,
          status: 'COMPLETED',
          mpesaReceipt,
          notes: processingNotes
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process withdrawal');
      }

      setSuccess('Withdrawal processed successfully!');
      setShowProcessModal(false);
      setSelectedRequest(null);
      setMpesaReceipt('');
      setProcessingNotes('');
      
      fetchRequests();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async (request: WithdrawalRequest) => {
    if (!confirm('Are you sure you want to reject this withdrawal request?')) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/withdrawals/rider/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: request._id,
          status: 'FAILED',
          notes: 'Request rejected by admin'
        })
      });

      if (!response.ok) throw new Error('Failed to reject request');

      setSuccess('Request rejected successfully');
      fetchRequests();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: <Clock className="w-3 h-3" />, label: 'Pending' };
      case 'PROCESSING':
        return { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: <RefreshCw className="w-3 h-3 animate-spin" />, label: 'Processing' };
      case 'COMPLETED':
        return { bg: 'bg-green-500/10', text: 'text-green-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Completed' };
      case 'FAILED':
        return { bg: 'bg-red-500/10', text: 'text-red-600', icon: <XCircle className="w-3 h-3" />, label: 'Failed' };
      case 'CANCELLED':
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', icon: <Ban className="w-3 h-3" />, label: 'Cancelled' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', icon: <AlertCircle className="w-3 h-3" />, label: status };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.userId.firstName?.toLowerCase().includes(searchLower) ||
      request.userId.lastName?.toLowerCase().includes(searchLower) ||
      request.userId.email?.toLowerCase().includes(searchLower) ||
      request.reference?.toLowerCase().includes(searchLower) ||
      request.mpesaReceipt?.toLowerCase().includes(searchLower)
    );
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h2>
          <p className="text-[var(--color-text-muted)]">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl animate-bounce-subtle">
                <Wallet className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Withdrawal Requests</h1>
                <p className="text-[var(--color-text-muted)]">Manage rider and vendor withdrawal requests</p>
              </div>
            </div>
            <button
              onClick={() => fetchRequests()}
              className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 w-fit"
            >
              <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalRequests}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Requests</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Amount</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(stats.totalAmount)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total requested</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-amber-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Pending</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.pendingCount}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Awaiting</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Processing</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.processingCount}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">In progress</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Completed</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.completedCount}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Paid out</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Failed</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.failedCount}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Declined</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-purple-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Average</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(stats.averageAmount)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Per request</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Pending</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{formatCurrency(stats.pendingAmount)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Awaiting amount</p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="mb-8 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
                <Truck className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Withdrawal Summary</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stats.pendingCount} pending request{stats.pendingCount !== 1 ? 's' : ''} totaling {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.completedAmount)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Paid Out</p>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pendingAmount)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Pending</p>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--color-primary)]">{stats.completedCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search by name, email, or receipt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="w-full lg:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="all">All Requests</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Rider/User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const statusBadge = getStatusBadge(request.status);
                    const balance = riderBalances.get(request.userId._id);
                    return (
                      <tr key={request._id} className="hover:bg-[var(--color-background-soft)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full flex items-center justify-center text-white font-bold">
                              {request.userId.firstName.charAt(0)}{request.userId.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--color-text)]">
                                {request.userId.firstName} {request.userId.lastName}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)]">{request.userId.email}</p>
                              <p className="text-xs text-[var(--color-primary)] capitalize">{request.userRole}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-lg font-bold text-[var(--color-primary)]">{formatCurrency(request.amount)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {balance ? (
                            <div>
                              <p className="font-semibold text-[var(--color-text)]">{formatCurrency(balance.availableBalance)}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">Available</p>
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--color-text-muted)]">Loading...</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {request.paymentMethod === 'M-PESA' ? (
                              <Smartphone className="w-4 h-4 text-green-500" />
                            ) : (
                              <CreditCard className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm text-[var(--color-text)]">{request.paymentMethod}</span>
                          </div>
                          {request.phoneNumber && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{request.phoneNumber}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.icon}
                            <span>{statusBadge.label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[var(--color-text-muted)]">{formatShortDate(request.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowProcessModal(true);
                                  }}
                                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
                                >
                                  Process
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request)}
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
              <p className="text-[var(--color-text-muted)]">No withdrawal requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              const balance = riderBalances.get(request.userId._id);
              const isExpanded = expandedRows.has(request._id);
              
              return (
                <div key={request._id} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full flex items-center justify-center text-white font-bold">
                          {request.userId.firstName.charAt(0)}{request.userId.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text)]">
                            {request.userId.firstName} {request.userId.lastName}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">{request.userRole}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.icon}
                        <span>{statusBadge.label}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Amount</p>
                        <p className="text-xl font-bold text-[var(--color-primary)]">{formatCurrency(request.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--color-text-muted)]">Date</p>
                        <p className="text-sm text-[var(--color-text)]">{formatShortDate(request.createdAt)}</p>
                      </div>
                    </div>
                    
                    {balance && (
                      <div className="mb-3 p-3 bg-[var(--color-background-soft)] rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-muted)]">Available Balance:</span>
                          <span className="font-semibold text-[var(--color-text)]">{formatCurrency(balance.availableBalance)}</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => toggleRowExpansion(request._id)}
                      className="flex items-center justify-center w-full py-2 text-sm text-[var(--color-primary)] font-medium"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                      ) : (
                        <>Show Details <ChevronDown className="w-4 h-4 ml-1" /></>
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)] space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-[var(--color-text)]">{request.userId.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-[var(--color-text)]">{request.phoneNumber || request.userId.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          {request.paymentMethod === 'M-PESA' ? (
                            <Smartphone className="w-4 h-4 text-green-500" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-[var(--color-text)]">{request.paymentMethod}</span>
                        </div>
                        
                        {request.status === 'PENDING' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowProcessModal(true);
                              }}
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Process Modal */}
      {showProcessModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => {
            setShowProcessModal(false);
            setSelectedRequest(null);
            setMpesaReceipt('');
            setProcessingNotes('');
          }}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10 mb-4">
                  <Send className="h-7 w-7 text-green-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Process Withdrawal</h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-4">
                    Confirm payment for this withdrawal request
                  </p>
                </div>
                
                <div className="mb-4 p-4 bg-[var(--color-background-soft)] rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--color-text-muted)]">Amount:</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">{formatCurrency(selectedRequest.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-muted)]">Recipient:</span>
                    <span className="font-medium text-[var(--color-text)]">{selectedRequest.userId.firstName} {selectedRequest.userId.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[var(--color-text-muted)]">Phone:</span>
                    <span className="font-medium text-[var(--color-text)]">{selectedRequest.phoneNumber || selectedRequest.userId.mpesaNumber || selectedRequest.userId.phone}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      M-PESA Transaction Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={mpesaReceipt}
                      onChange={(e) => setMpesaReceipt(e.target.value)}
                      placeholder="e.g., PPI72A0K1"
                      className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={processingNotes}
                      onChange={(e) => setProcessingNotes(e.target.value)}
                      rows={3}
                      placeholder="Add any notes about this payment..."
                      className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-[var(--color-background-soft)] flex space-x-3">
                <button
                  onClick={() => {
                    setShowProcessModal(false);
                    setSelectedRequest(null);
                    setMpesaReceipt('');
                    setProcessingNotes('');
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessRequest}
                  disabled={isProcessing || !mpesaReceipt}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Payment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailsModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] px-6 py-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/50 shadow-lg flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">Withdrawal Details</h2>
                    <p className="text-sm opacity-90">Request ID: {selectedRequest._id.slice(-8)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <User className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>User Information</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Name:</span> {selectedRequest.userId.firstName} {selectedRequest.userId.lastName}</p>
                      <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedRequest.userId.email}</p>
                      <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedRequest.userId.phone}</p>
                      <p><span className="text-[var(--color-text-muted)]">Role:</span> <span className="capitalize">{selectedRequest.userRole}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Payment Information</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Amount:</span> <span className="font-bold text-[var(--color-primary)]">{formatCurrency(selectedRequest.amount)}</span></p>
                      <p><span className="text-[var(--color-text-muted)]">Method:</span> {selectedRequest.paymentMethod}</p>
                      {selectedRequest.phoneNumber && (
                        <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedRequest.phoneNumber}</p>
                      )}
                      {selectedRequest.mpesaReceipt && (
                        <p><span className="text-[var(--color-text-muted)]">Receipt:</span> {selectedRequest.mpesaReceipt}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[var(--color-background-soft)] rounded-xl">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--color-text-muted)]">Requested On</p>
                      <p className="font-medium text-[var(--color-text)]">{formatDate(selectedRequest.createdAt)}</p>
                    </div>
                    {selectedRequest.processedAt && (
                      <div>
                        <p className="text-[var(--color-text-muted)]">Processed On</p>
                        <p className="font-medium text-[var(--color-text)]">{formatDate(selectedRequest.processedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedRequest.notes && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <h3 className="font-semibold text-amber-600 mb-2 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Notes</span>
                    </h3>
                    <p className="text-sm text-[var(--color-text)]">{selectedRequest.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-[var(--color-border)]">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-all"
                  >
                    Close
                  </button>
                  {selectedRequest.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setSelectedRequest(selectedRequest);
                          setShowProcessModal(true);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
                      >
                        Process Payment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}