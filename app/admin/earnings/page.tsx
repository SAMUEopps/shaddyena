"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Download, 

  CheckCircle, 
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Eye
} from 'lucide-react';

interface VendorEarning {
  _id: string;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
  };
  orderId: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PAID' | 'WITHDRAWN';
  createdAt: string;
  updatedAt: string;
}

interface VendorSummary {
  vendorId: string;
  vendorName: string;
  businessName?: string;
  totalEarnings: number;
  totalCommission: number;
  totalNetAmount: number;
  pendingCount: number;
  withdrawnCount: number;
}

interface DashboardStats {
  totalEarnings: number;
  totalCommission: number;
  totalNetAmount: number;
  pendingEarnings: number;
  withdrawnEarnings: number;
  totalVendors: number;
}

export default function AdminEarningsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'vendors'>('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalEarnings: 0,
    totalCommission: 0,
    totalNetAmount: 0,
    pendingEarnings: 0,
    withdrawnEarnings: 0,
    totalVendors: 0
  });
  
  const [earnings, setEarnings] = useState<VendorEarning[]>([]);
  const [vendorSummaries, setVendorSummaries] = useState<VendorSummary[]>([]);
  const [selectedEarning, setSelectedEarning] = useState<VendorEarning | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    fetchDashboardStats();
    fetchAllEarnings();
    fetchVendorSummaries();
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/earnings/stats');
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchAllEarnings = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);
      
      const response = await fetch(`/api/admin/earnings/all?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEarnings(data.earnings || []);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorSummaries = async () => {
    try {
      const response = await fetch('/api/admin/earnings/vendor-summaries');
      if (response.ok) {
        const data = await response.json();
        setVendorSummaries(data.summaries || []);
      }
    } catch (error) {
      console.error('Error fetching vendor summaries:', error);
    }
  };

  const handleUpdateStatus = async (earningId: string, newStatus: 'AVAILABLE') => {
    try {
      const response = await fetch(`/api/admin/earnings/${earningId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        alert('Earning status updated successfully!');
        fetchAllEarnings();
        fetchDashboardStats();
        setSelectedEarning(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating earning status:', error);
      alert('Failed to update status');
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Order ID', 'Vendor', 'Business', 'Amount', 'Commission', 'Net Amount', 'Status', 'Created Date'];
    const rows = earnings.map(earning => [
      earning.orderId,
      `${earning.vendorId.firstName} ${earning.vendorId.lastName}`,
      earning.vendorId.businessName || 'N/A',
      `KSh ${earning.amount.toFixed(2)}`,
      `KSh ${earning.commission.toFixed(2)}`,
      `KSh ${earning.netAmount.toFixed(2)}`,
      earning.status,
      new Date(earning.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Earnings Management</h1>
        <p className="text-gray-600">View and manage all vendor earnings, update status, and handle disputes</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium text-sm md:text-base ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Dashboard Overview</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-3 font-medium text-sm md:text-base ${activeTab === 'earnings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <DollarSign size={18} />
            <span>All Vendor Earnings</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-3 font-medium text-sm md:text-base ${activeTab === 'vendors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>Vendor Summaries</span>
          </div>
        </button>
      </div>

      {/* Dashboard Overview */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Platform Revenue</h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="text-blue-600" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                KSh {dashboardStats.totalCommission.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">From all vendor transactions</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Vendor Earnings</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                KSh {dashboardStats.totalNetAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">Total paid to vendors</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Pending Earnings</h3>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="text-yellow-600" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                KSh {dashboardStats.pendingEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">Awaiting withdrawal</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Active Vendors</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="text-purple-600" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardStats.totalVendors}
              </p>
              <p className="text-sm text-gray-500 mt-2">With earnings records</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('earnings')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="text-blue-600" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">View All Earnings</h3>
                    <p className="text-sm text-gray-500">Browse all vendor earnings</p>
                  </div>
                </div>
              </button>

              <button
                onClick={exportToCSV}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="text-green-600" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Export Data</h3>
                    <p className="text-sm text-gray-500">Download earnings report</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('vendors')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="text-purple-600" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Vendor Analytics</h3>
                    <p className="text-sm text-gray-500">View vendor summaries</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* All Vendor Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-lg shadow">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by order ID, vendor name, or business..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={fetchAllEarnings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earnings.map((earning) => (
                  <tr key={earning._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {earning.orderId.slice(-8)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          {earning.vendorId.firstName} {earning.vendorId.lastName}
                        </p>
                        <p className="text-gray-500 text-xs">{earning.vendorId.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {earning.vendorId.businessName || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      KSh {earning.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      KSh {earning.commission.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-green-700">
                      KSh {earning.netAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        earning.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : earning.status === 'PAID'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {earning.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(earning.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEarning(earning)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {/*{earning.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(earning._id, 'PAID')}
                              className="p-1 text-green-400 hover:text-green-600"
                              title="Mark as Paid"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(earning._id, 'WITHDRAWN')}
                              className="p-1 text-blue-400 hover:text-blue-600"
                              title="Mark as Withdrawn"
                            >
                              <DollarSign size={18} />
                            </button>
                          </>
                        )}*/}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {earnings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No earnings found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Export Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Export to CSV
            </button>
          </div>
        </div>
      )}

      {/* Vendor Summaries Tab */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Vendor Earnings Summary</h2>
            <p className="text-gray-600 text-sm mt-1">Total earnings breakdown by vendor</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawn</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendorSummaries.map((vendor) => (
                  <tr key={vendor.vendorId} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {vendor.vendorName}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {vendor.businessName || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      KSh {vendor.totalEarnings.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      KSh {vendor.totalCommission.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-green-700">
                      KSh {vendor.totalNetAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {vendor.pendingCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {vendor.withdrawnCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <button
                        onClick={() => {
                          // Navigate to vendor details or filter by vendor
                          setSearchQuery(vendor.vendorName.split(' ')[0]);
                          setActiveTab('earnings');
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                
                {vendorSummaries.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No vendor data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Earning Details Modal */}
      {selectedEarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Earning Details</h3>
                  <p className="text-gray-600 text-sm">Order ID: {selectedEarning.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedEarning(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Vendor Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {selectedEarning.vendorId.firstName} {selectedEarning.vendorId.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedEarning.vendorId.email}</p>
                      {selectedEarning.vendorId.businessName && (
                        <p className="text-sm text-gray-600 mt-1">
                          Business: {selectedEarning.vendorId.businessName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEarning.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedEarning.status === 'PAID'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedEarning.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Updated: {new Date(selectedEarning.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Financial Breakdown</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Amount:</span>
                        <span className="font-medium">KSh {selectedEarning.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Commission:</span>
                        <span className="font-medium text-blue-600">
                          KSh {selectedEarning.commission.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 font-semibold">Vendor Earnings:</span>
                        <span className="font-bold text-green-700">
                          KSh {selectedEarning.netAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Timeline</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">
                        Created: {new Date(selectedEarning.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">
                        Last Updated: {new Date(selectedEarning.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedEarning.status === 'PENDING' && (
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Update Status</h4>
                  <div className="flex gap-3">
                    {/*<button
                      onClick={() => handleUpdateStatus(selectedEarning._id, 'PAID')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Mark as Paid
                    </button>*/}
                    <button
                      onClick={() => handleUpdateStatus(selectedEarning._id, 'AVAILABLE')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <DollarSign size={18} />
                      Mark as Available
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}