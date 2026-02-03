'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import WithdrawalActionModal from '@/components/admin/WithdrawalActionModal';

interface Withdrawal {
  _id: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  type: 'IMMEDIATE' | 'REGULAR';
  reason?: string;
  adminNotes?: string;
  mpesaReceipt?: string;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
  };
  vendor: {
    mpesaNumber: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  admin?: {
    approvedBy?: {
      firstName: string;
      lastName: string;
    };
    approvedAt?: string;
    rejectedBy?: {
      firstName: string;
      lastName: string;
    };
    rejectedAt?: string;
    rejectionReason?: string;
  };
}

interface Stats {
  PENDING?: { count: number; totalAmount: number };
  APPROVED?: { count: number; totalAmount: number };
  PROCESSED?: { count: number; totalAmount: number };
  REJECTED?: { count: number; totalAmount: number };
}

export default function AdminWithdrawalsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const fetchWithdrawals = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      const response = await fetch(`/api/admin/withdrawals?${params}`);
      if (!response.ok) throw new Error('Failed to fetch withdrawals');
      
      const data = await response.json();
      setWithdrawals(data.withdrawals);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
    fetchWithdrawals();
  }, [user, isLoading, statusFilter]);

  const handleActionClick = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowActionModal(true);
  };

  const handleActionComplete = () => {
    setShowActionModal(false);
    setSelectedWithdrawal(null);
    fetchWithdrawals(pagination.page);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchWithdrawals()}
            className="px-4 py-2 bg-[#bf2c7e] text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Withdrawal Requests</h1>
          <p className="text-gray-600">Manage vendor withdrawal requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.PENDING?.count || 0}
            </p>
            <p className="text-sm text-gray-500">
              KSh {(stats.PENDING?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.APPROVED?.count || 0}
            </p>
            <p className="text-sm text-gray-500">
              KSh {(stats.APPROVED?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Processed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.PROCESSED?.count || 0}
            </p>
            <p className="text-sm text-gray-500">
              KSh {(stats.PROCESSED?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.REJECTED?.count || 0}
            </p>
            <p className="text-sm text-gray-500">
              KSh {(stats.REJECTED?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="PROCESSED">Processed</option>
                <option value="REJECTED">Rejected</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MPESA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {withdrawal.vendorId?.businessName || `${withdrawal.vendorId?.firstName} ${withdrawal.vendorId?.lastName}`}
                        </p>
                        <p className="text-xs text-gray-500">{withdrawal.vendorId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KSh {withdrawal.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        withdrawal.type === 'IMMEDIATE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {withdrawal.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.vendor.mpesaNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        withdrawal.status === 'PROCESSED'
                          ? 'bg-green-100 text-green-800'
                          : withdrawal.status === 'APPROVED'
                          ? 'bg-blue-100 text-blue-800'
                          : withdrawal.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {withdrawal.status === 'PENDING' && (
                        <button
                          onClick={() => handleActionClick(withdrawal)}
                          className="px-3 py-1 bg-[#bf2c7e] text-white rounded-lg hover:bg-[#a8246e]"
                        >
                          Process
                        </button>
                      )}
                      {withdrawal.status === 'APPROVED' && (
                        <span className="text-gray-500">Awaiting M-PESA</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchWithdrawals(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchWithdrawals(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showActionModal && selectedWithdrawal && (
        <WithdrawalActionModal
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowActionModal(false);
            setSelectedWithdrawal(null);
          }}
          onSuccess={handleActionComplete}
        />
      )}
    </div>
  );
}