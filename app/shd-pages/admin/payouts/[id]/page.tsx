// app/admin/payouts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Payout {
  _id: string;
  orderId: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    status: string;
  };
  vendorId: {
    _id: string;
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
    businessType: string;
    rating: number;
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

export default function PayoutDetail() {
  const router = useRouter();
  const params = useParams();
  const [payout, setPayout] = useState<Payout | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchPayout();
  }, []);

  const fetchPayout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPayout(data.payout);
        setFormData(data.payout);
      }
    } catch (error) {
      console.error('Failed to fetch payout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/${params.id}`, {
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
          setPayout(data.payout);
          setEditing(false);
          alert('Payout updated successfully');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update payout');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/${params.id}`, {
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
          setPayout(data.payout);
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
    if (!confirm('Are you sure you want to delete this payout?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/payouts/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Payout deleted successfully');
          router.push('/admin/payouts');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete payout');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="p-8 text-center text-muted">
        <div className="text-4xl mb-4">💰</div>
        <h2 className="text-xl font-semibold text-secondary">Payout not found</h2>
        <button
          onClick={() => router.push('/admin/payouts')}
          className="mt-4 text-primary hover:text-accent-dark transition"
        >
          ← Back to Payouts
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/payouts')}
          className="text-primary hover:text-accent-dark transition mb-4 inline-block"
        >
          ← Back to Payouts
        </button>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Payout Details
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="font-mono text-sm bg-surface px-3 py-1 rounded-lg">
                {payout._id.slice(-8)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(payout.status)}`}>
                {getStatusIcon(payout.status)} {payout.status.toUpperCase()}
              </span>
              {payout.transactionId && (
                <span className="font-mono text-sm bg-primary-light text-white px-3 py-1 rounded-lg">
                  TXN: {payout.transactionId}
                </span>
              )}
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
          {/* Payout Details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Payout Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted">Payout ID</label>
                <div className="font-mono text-sm font-medium text-secondary">
                  {payout._id}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Payout Method</label>
                <div className="font-medium text-secondary">{payout.payoutMethod}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Order Amount</label>
                <div className="font-medium text-secondary">{formatAmount(payout.amount)}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Commission</label>
                <div className="font-medium text-secondary">{formatAmount(payout.commission)}</div>
                <div className="text-xs text-muted">
                  Rate: {payout.amount > 0 ? ((payout.commission / payout.amount) * 100).toFixed(2) : 0}%
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Total Payout</label>
                <div className="text-2xl font-bold text-secondary">
                  {formatAmount(payout.totalPayout)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Status</label>
                <select
                  value={payout.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(payout.status)} focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">🔄 Processing</option>
                  <option value="completed">✅ Completed</option>
                  <option value="failed">❌ Failed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted">Retry Count</label>
                <div className="font-medium text-secondary">{payout.retryCount || 0}</div>
              </div>
            </div>

            {payout.errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <label className="text-xs text-red-600">Error Message</label>
                <div className="text-sm text-red-700">{payout.errorMessage}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted">Created At</label>
                <div className="text-sm text-secondary">{formatDate(payout.createdAt)}</div>
              </div>
              <div>
                <label className="text-xs text-muted">Updated At</label>
                <div className="text-sm text-secondary">{formatDate(payout.updatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Related Order */}
          {payout.orderId && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Related Order</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Order Number</label>
                  <Link 
                    href={`/admin/orders/${payout.orderId._id}`}
                    className="font-medium text-primary hover:text-accent-dark transition"
                  >
                    #{payout.orderId.orderNumber}
                  </Link>
                </div>
                <div>
                  <label className="text-xs text-muted">Customer</label>
                  <div className="font-medium text-secondary">{payout.orderId.customerName}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-muted">Customer Phone</label>
                  <div className="text-secondary">{payout.orderId.customerPhone}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Order Status</label>
                  <div className="text-secondary capitalize">{payout.orderId.status}</div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs text-muted">Order Total</label>
                <div className="text-xl font-bold text-secondary">
                  {formatAmount(payout.orderId.totalAmount)}
                </div>
              </div>
            </div>
          )}

          {/* Related Vendor */}
          {payout.vendorId && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Related Vendor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Business Name</label>
                  <Link 
                    href={`/admin/vendors/${payout.vendorId._id}`}
                    className="font-medium text-primary hover:text-accent-dark transition"
                  >
                    {payout.vendorId.businessName}
                  </Link>
                </div>
                <div>
                  <label className="text-xs text-muted">Business Type</label>
                  <div className="font-medium text-secondary">{payout.vendorId.businessType}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-muted">Email</label>
                  <div className="text-secondary">{payout.vendorId.businessEmail}</div>
                </div>
                <div>
                  <label className="text-xs text-muted">Phone</label>
                  <div className="text-secondary">{payout.vendorId.phoneNumber}</div>
                </div>
              </div>
              {payout.vendorId.rating && (
                <div className="mt-4">
                  <label className="text-xs text-muted">Vendor Rating</label>
                  <div className="font-medium text-secondary">⭐ {payout.vendorId.rating.toFixed(1)}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={payout.status}
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="completed">✅ Completed</option>
                <option value="failed">❌ Failed</option>
              </select>
              
              {payout.transactionId && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(payout.transactionId || '');
                    alert('Transaction ID copied to clipboard!');
                  }}
                  className="w-full border border-accent rounded-lg px-4 py-2 hover:bg-background transition text-secondary"
                >
                  📋 Copy Transaction ID
                </button>
              )}
            </div>
          </div>

          {/* Payout Details */}
          {payout.payoutDetails && Object.keys(payout.payoutDetails).length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Payout Details</h2>
              <div className="space-y-2">
                {Object.entries(payout.payoutDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-accent py-1">
                    <span className="text-xs text-muted capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-secondary">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gradient-to-br from-primary-light to-primary p-6 rounded-xl text-white">
            <h3 className="text-sm font-medium opacity-80">Total Payout</h3>
            <div className="text-3xl font-bold mt-1">{formatAmount(payout.totalPayout)}</div>
            <div className="mt-4 space-y-1 text-sm opacity-90">
              <div>Order: {formatAmount(payout.amount)}</div>
              <div>Commission: {formatAmount(payout.commission)}</div>
              <div>Status: {payout.status.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-secondary">Edit Payout</h2>
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
                  Status *
                </label>
                <select
                  required
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">🔄 Processing</option>
                  <option value="completed">✅ Completed</option>
                  <option value="failed">❌ Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount || 0}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value);
                    const commission = (amount * (formData.commissionRate || 10)) / 100;
                    setFormData({
                      ...formData,
                      amount,
                      commission,
                      totalPayout: amount - commission
                    });
                  }}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commissionRate || 10}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    const commission = (formData.amount * rate) / 100;
                    setFormData({
                      ...formData,
                      commissionRate: rate,
                      commission,
                      totalPayout: formData.amount - commission
                    });
                  }}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.transactionId || ''}
                  onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Payout Method
                </label>
                <input
                  type="text"
                  value={formData.payoutMethod || ''}
                  onChange={(e) => setFormData({...formData, payoutMethod: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Error Message (if failed)
                </label>
                <textarea
                  value={formData.errorMessage || ''}
                  onChange={(e) => setFormData({...formData, errorMessage: e.target.value})}
                  rows={3}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter error message if payout failed"
                />
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
                    setFormData(payout);
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