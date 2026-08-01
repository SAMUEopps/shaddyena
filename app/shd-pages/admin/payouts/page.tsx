// app/admin/payouts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Payout {
  _id: string;
  orderId: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
  };
  vendorId: {
    _id: string;
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
    businessType: string;
  };
  amount: number;
  commission: number;
  totalPayout: number;
  payoutMethod: string;
  payoutDetails: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalPayouts: number;
  successRate: string;
  avgCommissionRate: string;
  statusBreakdown: Array<{ _id: string; count: number; total: number }>;
  vendorStats: Array<{
    vendorName: string;
    vendorEmail: string;
    count: number;
    totalPayout: number;
    totalCommission: number;
    avgPayout: number;
  }>;
  dailyStats: Array<{ _id: string; count: number; total: number; commission: number }>;
  monthlyStats: Array<{ _id: string; count: number; total: number }>;
  topVendors: Array<{ vendorName: string; totalPayout: number; count: number }>;
  recentPayouts: Payout[];
  summary: {
    totalAmount: number;
    totalCommission: number;
    totalPending: number;
    totalProcessing: number;
    totalCompleted: number;
    totalFailed: number;
  };
}

export default function AdminPayouts() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchPayouts();
    fetchStats();
  }, []);

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/payouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPayouts(data.payouts);
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/stats?period=${period}`, {
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

  const handleStatusChange = async (payoutId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/${payoutId}`, {
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
          setPayouts(payouts.map(p => 
            p._id === payoutId ? { ...p, ...data.payout } : p
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

  const handleDeletePayout = async (payoutId: string) => {
    if (!confirm('Are you sure you want to delete this payout?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/${payoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPayouts(payouts.filter(p => p._id !== payoutId));
          alert('Payout deleted successfully');
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete payout');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedPayouts.length === 0) {
      alert('Please select at least one payout');
      return;
    }

    const actionMessages = {
      delete: `delete ${selectedPayouts.length} payouts`,
      updateStatus: `update status for ${selectedPayouts.length} payouts to "${value}"`,
      process: `process ${selectedPayouts.length} payouts`,
      complete: `complete ${selectedPayouts.length} payouts`
    };

    if (!confirm(`Are you sure you want to ${actionMessages[action as keyof typeof actionMessages] || action}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/payouts/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          payoutIds: selectedPayouts, 
          action,
          value 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedPayouts([]);
        fetchPayouts();
        fetchStats();
      } else {
        alert(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const togglePayoutSelection = (payoutId: string) => {
    setSelectedPayouts(prev =>
      prev.includes(payoutId)
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
    );
  };

  const selectAllPayouts = () => {
    if (selectedPayouts.length === filteredPayouts.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(filteredPayouts.map(p => p._id));
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    if (statusFilter !== 'all' && payout.status !== statusFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return payout.orderId?.orderNumber?.toLowerCase().includes(searchLower) ||
             payout.vendorId?.businessName?.toLowerCase().includes(searchLower) ||
             payout.transactionId?.toLowerCase().includes(searchLower) ||
             payout.payoutMethod?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      processing: '🔄',
      completed: '✅',
      failed: '❌'
    };
    return icons[status] || '📋';
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
            <div className="text-sm text-muted">Total Payouts</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalPayouts}</div>
            <div className="text-xs text-muted mt-1">
              Success Rate: {stats.successRate}%
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Total Payout Amount</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalAmount)}</div>
            <div className="text-xs text-muted mt-1">
              Commission: {formatAmount(stats.summary.totalCommission)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
            <div className="text-sm text-muted">Completed</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalCompleted)}</div>
            <div className="text-xs text-muted mt-1">
              {stats.statusBreakdown.find(s => s._id === 'completed')?.count || 0} transactions
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
            <div className="text-sm text-muted">Pending</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalPending)}</div>
            <div className="text-xs text-muted mt-1">
              {stats.statusBreakdown.find(s => s._id === 'pending')?.count || 0} transactions
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-sm text-muted">Avg Commission Rate</div>
            <div className="text-2xl font-bold text-secondary">{stats.avgCommissionRate}%</div>
            <div className="text-xs text-muted mt-1">
              Processing: {stats.statusBreakdown.find(s => s._id === 'processing')?.count || 0}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          💰 Payouts Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search payouts..."
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
            <option value="processing">🔄 Processing</option>
            <option value="completed">✅ Completed</option>
            <option value="failed">❌ Failed</option>
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
      {selectedPayouts.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedPayouts.length} payout{selectedPayouts.length > 1 ? 's' : ''} selected
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
            <option value="processing">🔄 Processing</option>
            <option value="completed">✅ Completed</option>
            <option value="failed">❌ Failed</option>
          </select>
          <button
            onClick={() => handleBulkAction('process')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            Process Selected
          </button>
          <button
            onClick={() => handleBulkAction('complete')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            Complete Selected
          </button>
          <button
            onClick={() => setSelectedPayouts([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Payouts Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllPayouts}
                    checked={selectedPayouts.length === filteredPayouts.length && filteredPayouts.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Commission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredPayouts.map((payout) => (
                <tr key={payout._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout._id)}
                      onChange={() => togglePayoutSelection(payout._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">
                      #{payout.orderId?.orderNumber || 'N/A'}
                    </div>
                    <div className="text-xs text-muted">
                      {payout.orderId?.customerName || 'N/A'}
                    </div>
                    <div className="text-xs text-muted">
                      {payout.payoutMethod}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">
                      {payout.vendorId?.businessName || 'N/A'}
                    </div>
                    <div className="text-xs text-muted">
                      {payout.vendorId?.phoneNumber || 'N/A'}
                    </div>
                    {payout.transactionId && (
                      <div className="text-xs font-mono text-primary">
                        TXN: {payout.transactionId}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-secondary">
                      {formatAmount(payout.totalPayout)}
                    </div>
                    <div className="text-xs text-muted">
                      Order: {formatAmount(payout.amount)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-secondary">
                      {formatAmount(payout.commission)}
                    </div>
                    <div className="text-xs text-muted">
                      {payout.retryCount > 0 && `Retry: ${payout.retryCount}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={payout.status}
                      onChange={(e) => handleStatusChange(payout._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payout.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="processing">🔄 Processing</option>
                      <option value="completed">✅ Completed</option>
                      <option value="failed">❌ Failed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted">
                      {formatDate(payout.createdAt)}
                    </div>
                    {payout.updatedAt !== payout.createdAt && (
                      <div className="text-xs text-muted">
                        Updated: {formatDate(payout.updatedAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/admin/payouts/${payout._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeletePayout(payout._id)}
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
        {filteredPayouts.length === 0 && (
          <div className="text-center py-8 text-muted">
            No payouts found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredPayouts.length} of {payouts.length} payouts
          {search && ` (filtered from ${payouts.length} total)`}
        </span>
        <span>
          {selectedPayouts.length > 0 && `${selectedPayouts.length} selected`}
        </span>
      </div>
    </div>
  );
}