// C:\Users\USER\Desktop\Projects\my-app\app\admin\vendors\page.tsx
/*'use client';

import { useState, useEffect } from 'react';

interface Vendor {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  isActive: boolean;
  totalEarned: number;
  pendingPayout: number;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  payoutMethod: string;
  createdAt: string;
}

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVendors(data.vendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorStatus = async (vendorId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/vendors/toggle-status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vendorId, isActive: !currentStatus })
      });

      if (response.ok) {
        alert('Vendor status updated');
        fetchVendors();
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
    vendor.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🏪 Vendors</h1>
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{vendor.businessName}</div>
                    <div className="text-sm text-gray-500">{vendor.payoutMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{vendor.ownerName}</div>
                    <div className="text-sm text-gray-500">{vendor.userId?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{vendor.businessLocation}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-green-600">KSh {vendor.totalEarned || 0}</div>
                    <div className="text-sm text-gray-500">Pending: KSh {vendor.pendingPayout || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleVendorStatus(vendor._id, vendor.isActive)}
                      className={`text-sm font-medium ${
                        vendor.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {vendor.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVendors.length === 0 && (
          <div className="text-center py-8 text-gray-500">No vendors found</div>
        )}
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Vendor {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  isActive: boolean;
  totalEarned: number;
  pendingPayout: number;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  payoutMethod: string;
  createdAt: string;
}

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVendors(data.vendors || []);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      setMessage({ type: 'error', text: 'Failed to load vendors' });
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorStatus = async (vendorId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this vendor?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/vendors/toggle-status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vendorId, isActive: !currentStatus })
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Vendor ${currentStatus ? 'deactivated' : 'activated'} successfully` 
        });
        fetchVendors();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update vendor status' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    // Search filter
    const searchMatch = vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.businessLocation.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const statusMatch = filter === 'all' || 
      (filter === 'active' && vendor.isActive) ||
      (filter === 'inactive' && !vendor.isActive);
    
    return searchMatch && statusMatch;
  });

  const getStatusCounts = () => {
    const counts = {
      all: vendors.length,
      active: vendors.filter(v => v.isActive).length,
      inactive: vendors.filter(v => !v.isActive).length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            🏪 Vendors
          </h1>
          <p className="text-muted mt-1">
            Manage all vendors on the platform
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVendors}
            className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface hover:bg-surface/70 text-secondary'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'active'
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-surface hover:bg-surface/70 text-secondary'
            }`}
          >
            ✅ Active ({statusCounts.active})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'inactive'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-surface hover:bg-surface/70 text-secondary'
            }`}
          >
            ⛔ Inactive ({statusCounts.inactive})
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No vendors found</h3>
            <p className="text-muted">
              {search || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No vendors have registered yet'}
            </p>
            {(search || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
                className="mt-4 text-primary hover:text-accent-dark font-medium transition-colors duration-200"
              >
                Clear filters →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface/30">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Business</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Owner</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Location</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Earnings</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-surface/30 transition-colors duration-200">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-secondary">{vendor.businessName}</div>
                      <div className="text-xs text-muted">
                        {vendor.payoutMethod}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-secondary">{vendor.ownerName}</div>
                      <div className="text-xs text-muted truncate max-w-[150px]">
                        {vendor.userId?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-muted">{vendor.businessLocation}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-primary">KSh {vendor.totalEarned?.toLocaleString() || 0}</div>
                      <div className="text-xs text-muted">
                        Pending: KSh {vendor.pendingPayout?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        vendor.isActive 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {vendor.isActive ? '✅ Active' : '⛔ Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => toggleVendorStatus(vendor._id, vendor.isActive)}
                        className={`text-sm font-medium transition-colors duration-200 ${
                          vendor.isActive 
                            ? 'text-red-500 hover:text-red-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                      >
                        {vendor.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredVendors.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-surface">
          <div className="text-sm text-muted">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-muted">
              Total Earnings: <span className="font-bold text-primary">
                KSh {filteredVendors.reduce((sum, vendor) => sum + (vendor.totalEarned || 0), 0).toLocaleString()}
              </span>
            </span>
            <span className="text-muted">
              Pending Payouts: <span className="font-bold text-amber-600">
                KSh {filteredVendors.reduce((sum, vendor) => sum + (vendor.pendingPayout || 0), 0).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}