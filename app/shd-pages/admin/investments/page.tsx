// app/admin/investments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Investment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isMember: boolean;
  };
  type: 'TRANSPORT' | 'MARKETING' | 'TECHNOLOGY' | 'STARTUP';
  amount: number;
  returns: number;
  status: 'active' | 'completed' | 'cancelled';
  duration: number;
  startDate: string;
  endDate: string;
  expectedReturn: number;
  actualReturn?: number;
  createdAt: string;
}

interface Stats {
  totalInvestments: number;
  successRate: string;
  statusBreakdown: Array<{ _id: string; count: number; totalAmount: number }>;
  typeBreakdown: Array<{ _id: string; count: number; totalAmount: number; totalReturns: number }>;
  performanceStats: {
    totalInvested: number;
    totalReturns: number;
    avgReturn: number;
    avgReturnRate: number;
    bestPerformer: number;
    worstPerformer: number;
  };
  monthlyTrends: Array<{ _id: { year: number; month: number }; count: number; totalAmount: number }>;
  topInvestors: Array<{
    userName: string;
    userEmail: string;
    totalInvested: number;
    totalReturns: number;
    count: number;
    avgReturnRate: number;
  }>;
  roiStats: {
    avgROI: number;
    totalROI: number;
    maxROI: number;
    minROI: number;
  };
  summary: {
    totalInvested: number;
    totalReturns: number;
    activeAmount: number;
    completedAmount: number;
  };
}

export default function AdminInvestments() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchInvestments();
    fetchStats();
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/investments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInvestments(data.investments);
      }
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/stats?period=${period}`, {
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

  const handleStatusChange = async (investmentId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/${investmentId}`, {
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
          setInvestments(investments.map(inv => 
            inv._id === investmentId ? { ...inv, ...data.investment } : inv
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

  const handleDeleteInvestment = async (investmentId: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/${investmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInvestments(investments.filter(inv => inv._id !== investmentId));
          alert('Investment deleted successfully');
          fetchStats();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete investment');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedInvestments.length === 0) {
      alert('Please select at least one investment');
      return;
    }

    const actionMessages = {
      delete: `delete ${selectedInvestments.length} investments`,
      updateStatus: `update status for ${selectedInvestments.length} investments to "${value}"`,
      updateType: `update type for ${selectedInvestments.length} investments to "${value}"`,
      calculateReturns: `calculate returns for ${selectedInvestments.length} investments`
    };

    if (!confirm(`Are you sure you want to ${actionMessages[action as keyof typeof actionMessages] || action}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/investments/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          investmentIds: selectedInvestments, 
          action,
          value 
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setSelectedInvestments([]);
        fetchInvestments();
        fetchStats();
      } else {
        alert(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const toggleInvestmentSelection = (investmentId: string) => {
    setSelectedInvestments(prev =>
      prev.includes(investmentId)
        ? prev.filter(id => id !== investmentId)
        : [...prev, investmentId]
    );
  };

  const selectAllInvestments = () => {
    if (selectedInvestments.length === filteredInvestments.length) {
      setSelectedInvestments([]);
    } else {
      setSelectedInvestments(filteredInvestments.map(inv => inv._id));
    }
  };

  const filteredInvestments = investments.filter(investment => {
    if (statusFilter !== 'all' && investment.status !== statusFilter) return false;
    if (typeFilter !== 'all' && investment.type !== typeFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return investment.type.toLowerCase().includes(searchLower) ||
             investment.userId?.name?.toLowerCase().includes(searchLower) ||
             investment.userId?.email?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      TRANSPORT: 'bg-purple-100 text-purple-800 border-purple-200',
      MARKETING: 'bg-pink-100 text-pink-800 border-pink-200',
      TECHNOLOGY: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      STARTUP: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      TRANSPORT: '🚗',
      MARKETING: '📢',
      TECHNOLOGY: '💻',
      STARTUP: '🚀'
    };
    return icons[type] || '💰';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
            <div className="text-sm text-muted">Total Investments</div>
            <div className="text-2xl font-bold text-secondary">{stats.totalInvestments}</div>
            <div className="text-xs text-muted mt-1">
              Success Rate: {stats.successRate}%
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-muted">Total Invested</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalInvested)}</div>
            <div className="text-xs text-muted mt-1">
              Active: {formatAmount(stats.summary.activeAmount)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-accent-dark">
            <div className="text-sm text-muted">Total Returns</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(stats.summary.totalReturns)}</div>
            <div className="text-xs text-muted mt-1">
              Avg ROI: {stats.roiStats.avgROI.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
            <div className="text-sm text-muted">Active Investments</div>
            <div className="text-2xl font-bold text-secondary">
              {stats.statusBreakdown.find(s => s._id === 'active')?.count || 0}
            </div>
            <div className="text-xs text-muted mt-1">
              Completed: {stats.statusBreakdown.find(s => s._id === 'completed')?.count || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
            <div className="text-sm text-muted">Top Performer</div>
            <div className="text-2xl font-bold text-secondary">
              {(stats.performanceStats.bestPerformer * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted mt-1">
              Best ROI across all investments
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
          💰 Investments Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search investments..."
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
            <option value="active">✅ Active</option>
            <option value="completed">📊 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">All Types</option>
            <option value="TRANSPORT">🚗 Transport</option>
            <option value="MARKETING">📢 Marketing</option>
            <option value="TECHNOLOGY">💻 Technology</option>
            <option value="STARTUP">🚀 Startup</option>
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
      {selectedInvestments.length > 0 && (
        <div className="bg-surface p-4 rounded-xl mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-secondary">
            {selectedInvestments.length} investment{selectedInvestments.length > 1 ? 's' : ''} selected
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
            <option value="active">✅ Active</option>
            <option value="completed">📊 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
          <select
            onChange={(e) => handleBulkAction('updateType', e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Update Type</option>
            <option value="TRANSPORT">🚗 Transport</option>
            <option value="MARKETING">📢 Marketing</option>
            <option value="TECHNOLOGY">💻 Technology</option>
            <option value="STARTUP">🚀 Startup</option>
          </select>
          <button
            onClick={() => handleBulkAction('calculateReturns')}
            className="bg-accent-dark text-white px-4 py-2 rounded-lg text-sm hover:bg-primary transition"
          >
            Calculate Returns
          </button>
          <button
            onClick={() => setSelectedInvestments([])}
            className="text-muted hover:text-text text-sm transition"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Investments Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={selectAllInvestments}
                    checked={selectedInvestments.length === filteredInvestments.length && filteredInvestments.length > 0}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Investment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Returns</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredInvestments.map((investment) => (
                <tr key={investment._id} className="hover:bg-background transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedInvestments.includes(investment._id)}
                      onChange={() => toggleInvestmentSelection(investment._id)}
                      className="rounded border-accent text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">
                      {investment.type}
                    </div>
                    <div className="text-xs text-muted">
                      Duration: {investment.duration} months
                    </div>
                    <div className="text-xs text-muted">
                      Start: {formatDate(investment.startDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary">
                      {investment.userId?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-muted">
                      {investment.userId?.email || 'N/A'}
                    </div>
                    {investment.userId?.isMember && (
                      <span className="text-xs text-primary">⭐ Member</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(investment.type)}`}>
                      {getTypeIcon(investment.type)} {investment.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-secondary">
                      {formatAmount(investment.amount)}
                    </div>
                    <div className="text-xs text-muted">
                      Expected: {formatAmount(investment.expectedReturn)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-secondary">
                      {formatAmount(investment.returns)}
                    </div>
                    <div className="text-xs text-muted">
                      {investment.amount > 0 ? ((investment.returns / investment.amount) * 100).toFixed(1) : 0}% ROI
                    </div>
                    {investment.actualReturn !== undefined && investment.actualReturn !== null && (
                      <div className="text-xs text-muted">
                        Actual: {formatAmount(investment.actualReturn)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={investment.status}
                      onChange={(e) => handleStatusChange(investment._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(investment.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="active">✅ Active</option>
                      <option value="completed">📊 Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/admin/investments/${investment._id}`)}
                        className="text-primary hover:text-accent-dark text-sm font-medium transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteInvestment(investment._id)}
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
        {filteredInvestments.length === 0 && (
          <div className="text-center py-8 text-muted">
            No investments found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-muted">
        <span>
          Showing {filteredInvestments.length} of {investments.length} investments
          {search && ` (filtered from ${investments.length} total)`}
        </span>
        <span>
          {selectedInvestments.length > 0 && `${selectedInvestments.length} selected`}
        </span>
      </div>
    </div>
  );
}