// app/admin/transactions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  _id: string;
  transactionId: string;
  receiptNumber: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  type: 'collection' | 'payout' | 'refund';
  orderId?: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
  };
  vendorId?: {
    _id: string;
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
  };
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalTransactions: number;
  successRate: string;
  statusBreakdown: Array<{ _id: string; count: number; total: number }>;
  typeBreakdown: Array<{ _id: string; count: number; total: number }>;
  dailyStats: Array<{ _id: string; count: number; total: number; success: number; failed: number }>;
  monthlyStats: Array<{ _id: string; count: number; total: number }>;
  topCustomers: Array<{ _id: string; count: number; total: number }>;
  recentTransactions: Transaction[];
  summary: {
    totalAmount: number;
    totalPending: number;
    totalSuccess: number;
    totalFailed: number;
    totalCancelled: number;
  };
}

export default function AdminTransactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransactions(transactions.map(t => 
            t._id === transactionId ? { ...t, ...data.transaction } : t
          ));
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransactions(transactions.filter(t => t._id !== transactionId));
          alert('Transaction deleted successfully');
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete transaction');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedTransactions.length === 0) {
      alert('Please select at least one transaction');
      return;
    }

    const actionMessages = {
      delete: `delete ${selectedTransactions.length} transactions`,
      updateStatus: `update status for ${selectedTransactions.length} transactions to "${value}"`,
      updateType: `update type for ${selectedTransactions.length} transactions to "${value}"`
    };

    if (!confirm(`Are you sure you want to ${actionMessages[action as keyof typeof actionMessages] || action}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/transactions/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          transactionIds: selectedTransactions, 
          action,
          value 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedTransactions([]);
        fetchTransactions();
        fetchStats();
      } else {
        alert(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleTransactionSelection = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const selectAllTransactions = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t._id));
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (statusFilter !== 'all' && transaction.status !== statusFilter) return false;
    if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return transaction.transactionId.toLowerCase().includes(searchLower) ||
             transaction.receiptNumber?.toLowerCase().includes(searchLower) ||
             transaction.phoneNumber.includes(search) ||
             transaction.orderId?.orderNumber?.toLowerCase().includes(searchLower) ||
             transaction.vendorId?.businessName?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      collection: 'bg-blue-100 text-blue-800 border-blue-200',
      payout: 'bg-purple-100 text-purple-800 border-purple-200',
      refund: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      collection: '💰',
      payout: '💸',
      refund: '↩️'
    };
    return icons[type] || '💳';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-primary">
            <div className="text-sm text-muted">Total Transactions</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalTransactions}</div>
            <div className="text-xs text-muted mt-1">
              Success Rate: {stats.successRate}%
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Total Amount</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalAmount)}</div>
            <div className="text-xs text-muted mt-1">
              {stats.summary.totalSuccess > 0 && `Success: ${formatAmount(stats.summary.totalSuccess)}`}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
            <div className="text-sm text-muted">Pending</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalPending)}</div>
            <div className="text-xs text-muted mt-1">
              {stats.statusBreakdown.find(s => s._id === 'pending')?.count || 0} transactions
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
            <div className="text-sm text-muted">Failed</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalFailed)}</div>
            <div className="text-xs text-muted mt-1">
              {stats.statusBreakdown.find(s => s._id === 'failed')?.count || 0} transactions
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-sm text-muted">Collections</div>
            <div className="text-2xl font-bold text-secondary">
              {stats.typeBreakdown.find(t => t._id === 'collection')?.count || 0}
            </div>
            <div className="text-xs text-muted mt-1">
              Payouts: {stats.typeBreakdown.find(t => t._id === 'payout')?.count || 0}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          💳 Transactions
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="success">✅ Success</option>
            <option value="failed">❌ Failed</option>
            <option value="cancelled">🚫 Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Types</option>
            <option value="collection">💰 Collection</option>
            <option value="payout">💸 Payout</option>
            <option value="refund">↩️ Refund</option>
          </select>
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              fetchStats();
            }}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => handleBulkAction('delete')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Delete Selected
          </button>
          <select
            onChange={(e) => handleBulkAction('updateStatus', e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="success">✅ Success</option>
            <option value="failed">❌ Failed</option>
            <option value="cancelled">🚫 Cancelled</option>
          </select>
          <select
            onChange={(e) => handleBulkAction('updateType', e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Type</option>
            <option value="collection">💰 Collection</option>
            <option value="payout">💸 Payout</option>
            <option value="refund">↩️ Refund</option>
          </select>
          <button
            onClick={() => setSelectedTransactions([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllTransactions}
                    checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Transaction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Customer/Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction._id)}
                      onChange={() => toggleTransactionSelection(transaction._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm font-medium text-secondary">
                      {transaction.transactionId}
                    </div>
                    {transaction.receiptNumber && (
                      <div className="text-xs text-muted">
                        Receipt: {transaction.receiptNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                      {getTypeIcon(transaction.type)} {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-secondary">{transaction.phoneNumber}</div>
                    {transaction.orderId && (
                      <div className="text-xs text-muted">
                        Order: #{transaction.orderId.orderNumber}
                      </div>
                    )}
                    {transaction.vendorId && (
                      <div className="text-xs text-muted">
                        Vendor: {transaction.vendorId.businessName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-secondary">
                      {formatAmount(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={transaction.status}
                      onChange={(e) => handleStatusChange(transaction._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="success">✅ Success</option>
                      <option value="failed">❌ Failed</option>
                      <option value="cancelled">🚫 Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/shd-pages/admin/transactions/${transaction._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted">
            No transactions found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredTransactions.length} of {transactions.length} transactions
          {search && ` (filtered from ${transactions.length} total)`}
        </span>
        <span>
          {selectedTransactions.length > 0 && `${selectedTransactions.length} selected`}
        </span>
      </div>
    </div>
  );
}