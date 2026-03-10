// app/admin/withdrawals/page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
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
  Download,
  RefreshCw,
  Eye
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
  availableBalance: number;
}

export default function RiderWithdrawalsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [riderBalances, setRiderBalances] = useState<Map<string, RiderBalance>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [processingNotes, setProcessingNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
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
      
      // Fetch rider balances for all unique userIds
      //const userIds = [...new Set(data.requests.map((r: WithdrawalRequest) => r.userId._id))];
      //await fetchRiderBalances(userIds);

      const userIds: string[] = [
        ...new Set((data.requests as WithdrawalRequest[]).map((r) => r.userId._id))
        ];
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
      
      // Refresh the list
      fetchRequests();
      
      // Clear success message after 3 seconds
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'PROCESSING': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'FAILED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-gray-600 mt-1">Manage rider and vendor withdrawal requests</p>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

   
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="all">All</option>
            </select>
            <button
              onClick={() => fetchRequests()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rider/User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No withdrawal requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => {
                const balance = riderBalances.get(request.userId._id);
                return (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#bf2c7e] bg-opacity-10 rounded-full flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-[#bf2c7e]" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.userId.firstName} {request.userId.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.userId.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {request.userRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(request.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {balance ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            Available: {formatCurrency(balance.availableBalance)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: {formatCurrency(balance.totalEarnings)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Loading...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {request.paymentMethod === 'M-PESA' ? (
                          <Smartphone className="h-4 w-4 text-green-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {request.paymentMethod}
                        </span>
                      </div>
                      {request.phoneNumber && (
                        <div className="text-xs text-gray-500 mt-1">
                          {request.phoneNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {request.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowProcessModal(true);
                            }}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request)}
                            className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'COMPLETED' && request.mpesaReceipt && (
                        <span className="text-sm text-gray-600">
                          Receipt: {request.mpesaReceipt}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showProcessModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Process Withdrawal</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Amount to pay:</p>
              <p className="text-2xl font-bold text-[#bf2c7e]">
                {formatCurrency(selectedRequest.amount)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                To: {selectedRequest.userId.firstName} {selectedRequest.userId.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {selectedRequest.phoneNumber || selectedRequest.userId.mpesaNumber || selectedRequest.userId.phone}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-PESA Transaction Code
                </label>
                <input
                  type="text"
                  value={mpesaReceipt}
                  onChange={(e) => setMpesaReceipt(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                  placeholder="e.g., PPI72A0K1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                  placeholder="Add any notes about this payment..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleProcessRequest}
                  disabled={isProcessing || !mpesaReceipt}
                  className="flex-1 bg-[#bf2c7e] text-white py-2 rounded-lg hover:bg-[#a8246e] disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
                <button
                  onClick={() => {
                    setShowProcessModal(false);
                    setSelectedRequest(null);
                    setMpesaReceipt('');
                    setProcessingNotes('');
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
}*/

// app/admin/withdrawals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
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
  Download,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  Calendar,
  Hash,
  Banknote
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
  availableBalance: number;
}

export default function RiderWithdrawalsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [riderBalances, setRiderBalances] = useState<Map<string, RiderBalance>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [processingNotes, setProcessingNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
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
      
      const userIds: string[] = [
        ...new Set((data.requests as WithdrawalRequest[]).map((r) => r.userId._id))
      ];
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
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'PROCESSING': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'FAILED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage rider and vendor withdrawal requests</p>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="mb-4 p-3 sm:p-4 bg-green-50 rounded-lg flex items-start gap-2 sm:gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 rounded-lg flex items-start gap-2 sm:gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center justify-between w-full sm:hidden mb-2"
        >
          <span className="text-sm font-medium text-gray-700">Search & Filters</span>
          {showMobileFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {/* Filter Content - Always visible on desktop, toggle on mobile */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or receipt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c] bg-white"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="all">All</option>
              </select>
              <button
                onClick={() => fetchRequests()}
                className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex-shrink-0"
              >
                <RefreshCw className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider/User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const balance = riderBalances.get(request.userId._id);
                  return (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10 bg-[#bf2c7e] bg-opacity-10 rounded-full flex items-center justify-center">
                            <Wallet className="h-4 sm:h-5 w-4 sm:w-5 text-[#bf2c7e]" />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.userId.firstName} {request.userId.lastName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                              {request.userId.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              {request.userRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(request.amount)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {balance ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              {formatCurrency(balance.availableBalance)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total: {formatCurrency(balance.totalEarnings)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">...</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {request.paymentMethod === 'M-PESA' ? (
                            <Smartphone className="h-3 sm:h-4 w-3 sm:w-4 text-green-600" />
                          ) : (
                            <CreditCard className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600" />
                          )}
                          <span className="text-xs sm:text-sm text-gray-600">
                            {request.paymentMethod === 'M-PESA' ? 'M-PESA' : 'Bank'}
                          </span>
                        </div>
                        {request.phoneNumber && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">
                            {request.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="hidden sm:inline">{request.status}</span>
                          <span className="sm:hidden">{request.status.charAt(0)}</span>
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                        {formatShortDate(request.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        {request.status === 'PENDING' && (
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowProcessModal(true);
                              }}
                              className="text-xs sm:text-sm bg-green-600 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-green-700 whitespace-nowrap"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request)}
                              className="text-xs sm:text-sm bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-red-700 whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status === 'COMPLETED' && request.mpesaReceipt && (
                          <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[100px] block">
                            {request.mpesaReceipt}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="sm:hidden space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No withdrawal requests found
          </div>
        ) : (
          filteredRequests.map((request) => {
            const balance = riderBalances.get(request.userId._id);
            const isExpanded = expandedRows.has(request._id);
            
            return (
              <div key={request._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Card Header - Always visible */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-[#bf2c7e] bg-opacity-10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-[#bf2c7e]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.userId.firstName} {request.userId.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">{request.userRole}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-lg font-bold text-[#bf2c7e]">{formatCurrency(request.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-700">{formatShortDate(request.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => toggleRowExpansion(request._id)}
                    className="flex items-center justify-center w-full text-sm text-[#bf2c7e] font-medium"
                  >
                    {isExpanded ? (
                      <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>Show Details <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {/* Contact Information */}
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{request.userId.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{request.phoneNumber || request.userId.phone}</span>
                      </div>

                      {/* Payment Details */}
                      <div className="flex items-center gap-2 text-sm">
                        {request.paymentMethod === 'M-PESA' ? (
                          <Smartphone className="h-4 w-4 text-green-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="text-gray-600">{request.paymentMethod}</span>
                      </div>

                      {/* Balance Information */}
                      {balance && (
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Available Balance:</span>
                            <span className="font-medium">{formatCurrency(balance.availableBalance)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Total Earnings:</span>
                            <span>{formatCurrency(balance.totalEarnings)}</span>
                          </div>
                        </div>
                      )}

                      {/* Receipt Information */}
                      {request.status === 'COMPLETED' && request.mpesaReceipt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Receipt: {request.mpesaReceipt}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {request.status === 'PENDING' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowProcessModal(true);
                            }}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request)}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
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

      {/* Process Modal - Mobile Optimized */}
      {showProcessModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-xl sm:rounded-lg max-w-md w-full p-4 sm:p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Process Withdrawal</h2>
              <button
                onClick={() => {
                  setShowProcessModal(false);
                  setSelectedRequest(null);
                  setMpesaReceipt('');
                  setProcessingNotes('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">Amount to pay:</p>
              <p className="text-xl sm:text-2xl font-bold text-[#bf2c7e]">
                {formatCurrency(selectedRequest.amount)}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs sm:text-sm text-gray-600">
                  To: {selectedRequest.userId.firstName} {selectedRequest.userId.lastName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {selectedRequest.phoneNumber || selectedRequest.userId.mpesaNumber || selectedRequest.userId.phone}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  M-PESA Transaction Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={mpesaReceipt}
                  onChange={(e) => setMpesaReceipt(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                  placeholder="e.g., PPI72A0K1"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff199c]"
                  placeholder="Add any notes about this payment..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => {
                    setShowProcessModal(false);
                    setSelectedRequest(null);
                    setMpesaReceipt('');
                    setProcessingNotes('');
                  }}
                  className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessRequest}
                  disabled={isProcessing || !mpesaReceipt}
                  className="w-full sm:flex-1 bg-[#bf2c7e] text-white py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-[#a8246e] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}