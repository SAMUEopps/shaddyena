// app/admin/investments/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Investment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isMember: boolean;
    totalInvestments: number;
    availableBalance: number;
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

export default function InvestmentDetail() {
  const router = useRouter();
  const params = useParams();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchInvestment();
  }, []);

  const fetchInvestment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInvestment(data.investment);
        setFormData(data.investment);
      }
    } catch (error) {
      console.error('Failed to fetch investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInvestment(data.investment);
          setEditing(false);
          alert('Investment updated successfully');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update investment');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/${params.id}`, {
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
          setInvestment(data.investment);
          alert('Status updated successfully');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this investment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/investments/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Investment deleted successfully');
          router.push('/admin/investments');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete investment');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

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
    return new Date(date).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
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

  if (!investment) {
    return (
      <div className="p-8 text-center text-muted">
        <div className="text-4xl mb-4">💰</div>
        <h2 className="text-xl font-semibold text-secondary">Investment not found</h2>
        <button
          onClick={() => router.push('/admin/investments')}
          className="mt-4 text-primary hover:text-accent-dark transition"
        >
          ← Back to Investments
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/investments')}
          className="text-primary hover:text-accent-dark transition mb-4 inline-block"
        >
          ← Back to Investments
        </button>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Investment Details
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(investment.type)}`}>
                {getTypeIcon(investment.type)} {investment.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(investment.status)}`}>
                {investment.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary-light text-white">
                {investment.duration} months
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Investment Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted">Investment ID</label>
                <div className="font-mono text-sm font-medium text-secondary">
                  {investment._id}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Type</label>
                <div className="font-medium text-secondary">{investment.type}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Amount Invested</label>
                <div className="text-2xl font-bold text-secondary">
                  {formatAmount(investment.amount)}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Expected Return</label>
                <div className="text-xl font-bold text-secondary">
                  {formatAmount(investment.expectedReturn)}
                </div>
                <div className="text-xs text-muted">
                  {investment.amount > 0 ? ((investment.expectedReturn / investment.amount) * 100).toFixed(1) : 0}% ROI
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Actual Return</label>
                <div className={`text-xl font-bold ${investment.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(investment.returns)}
                </div>
                <div className="text-xs text-muted">
                  {investment.amount > 0 ? ((investment.returns / investment.amount) * 100).toFixed(1) : 0}% ROI
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Duration</label>
                <div className="font-medium text-secondary">{investment.duration} months</div>
              </div>
              <div>
                <label className="text-xs text-muted">Status</label>
                <select
                  value={investment.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(investment.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="active">✅ Active</option>
                  <option value="completed">📊 Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Start Date</label>
                <div className="text-sm text-secondary">{formatDate(investment.startDate)}</div>
              </div>
              <div>
                <label className="text-xs text-muted">End Date</label>
                <div className="text-sm text-secondary">{formatDate(investment.endDate)}</div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-muted">Created At</label>
              <div className="text-sm text-secondary">{formatDate(investment.createdAt)}</div>
            </div>
          </div>

          {/* Related User */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Investor Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted">Name</label>
                <Link 
                  href={`/admin/users/${investment.userId._id}`}
                  className="font-medium text-primary hover:text-accent-dark transition"
                >
                  {investment.userId?.name || 'N/A'}
                </Link>
              </div>
              <div>
                <label className="text-xs text-muted">Email</label>
                <div className="font-medium text-secondary">{investment.userId?.email || 'N/A'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Phone Number</label>
                <div className="text-secondary">{investment.userId?.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Member Status</label>
                <div className="text-secondary">
                  {investment.userId?.isMember ? '⭐ Member' : 'Regular User'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Total Investments</label>
                <div className="font-medium text-secondary">
                  {investment.userId?.totalInvestments || 0}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Available Balance</label>
                <div className="font-medium text-secondary">
                  {formatAmount(investment.userId?.availableBalance || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-primary-light to-primary p-6 rounded-xl text-white">
            <h3 className="text-sm font-medium opacity-80">Investment Summary</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="opacity-80">Invested</span>
                <span className="font-bold">{formatAmount(investment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Returns</span>
                <span className="font-bold">{formatAmount(investment.returns)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">ROI</span>
                <span className="font-bold">
                  {investment.amount > 0 ? ((investment.returns / investment.amount) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Duration</span>
                <span className="font-bold">{investment.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Status</span>
                <span className="font-bold">{investment.status.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={investment.status}
              >
                <option value="active">✅ Active</option>
                <option value="completed">📊 Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(investment._id);
                  alert('Investment ID copied to clipboard!');
                }}
                className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
              >
                📋 Copy Investment ID
              </button>
            </div>
          </div>

          {/* ROI Analysis */}
          {investment.status === 'completed' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">ROI Analysis</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted">Expected ROI</div>
                  <div className="font-bold text-secondary">
                    {investment.amount > 0 ? ((investment.expectedReturn / investment.amount) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted">Actual ROI</div>
                  <div className={`font-bold ${investment.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {investment.amount > 0 ? ((investment.returns / investment.amount) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted">Performance</div>
                  <div className="font-bold text-secondary">
                    {investment.returns >= investment.expectedReturn ? '📈 Exceeded Expectations' : 
                     investment.returns > 0 ? '📊 Met Expectations' : '📉 Below Expectations'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-secondary">Edit Investment</h2>
              <button
                onClick={() => setEditing(false)}
                className="text-muted hover:text-text text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Type *
                </label>
                <select
                  required
                  value={formData.type || 'TRANSPORT'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="TRANSPORT">🚗 Transport</option>
                  <option value="MARKETING">📢 Marketing</option>
                  <option value="TECHNOLOGY">💻 Technology</option>
                  <option value="STARTUP">🚀 Startup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Amount (KSh) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount || 0}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value);
                    setFormData({...formData, amount});
                  }}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Expected Return (KSh) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.expectedReturn || 0}
                  onChange={(e) => setFormData({...formData, expectedReturn: parseFloat(e.target.value)})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Actual Return (KSh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.actualReturn || 0}
                  onChange={(e) => setFormData({...formData, actualReturn: parseFloat(e.target.value)})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Duration (months) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration || 0}
                  onChange={(e) => {
                    const duration = parseInt(e.target.value);
                    const startDate = new Date();
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + duration);
                    setFormData({
                      ...formData,
                      duration,
                      startDate: startDate.toISOString(),
                      endDate: endDate.toISOString()
                    });
                  }}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">✅ Active</option>
                  <option value="completed">📊 Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(investment);
                  }}
                  className="flex-1 border border-accent rounded-lg px-6 py-2 hover:bg-background transition"
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