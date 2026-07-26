// app/admin/users/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isMember: boolean;
  isVerified: boolean;
  totalSavings: number;
  totalInvestments: number;
  availableBalance: number;
  referralEarnings: number;
  referralCommissionEarnings: number;
  referralSubscriptionEarnings: number;
  referralCode: string;
  referredBy: string | null;
  referrals: string[];
  memberSince?: string;
  createdAt: string;
}

export default function UserDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setFormData(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/users/${params.id}`, {
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
          setUser(data.user);
          setEditing(false);
          alert('User updated successfully');
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-muted">
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-secondary">User not found</h2>
        <button
          onClick={() => router.push('/admin/users')}
          className="mt-4 text-primary hover:text-accent-dark transition"
        >
          ← Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-primary hover:text-accent-dark transition"
        >
          ← Back to Users
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                {user.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {user.isVerified ? '✓ Verified' : '⚠ Unverified'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isMember ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                  {user.isMember ? '★ Member' : 'Non-member'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
            >
              {editing ? 'Cancel' : 'Edit User'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-muted mb-3">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted">Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="font-medium text-secondary">{user.name}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="font-medium text-secondary">{user.email}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber || ''}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="font-medium text-secondary">{user.phoneNumber}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted">Role</label>
                  {editing ? (
                    <select
                      value={formData.role || 'customer'}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="rider">Rider</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <div className="font-medium text-secondary capitalize">{user.role}</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted mb-3">Financial Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted">Available Balance</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.availableBalance || 0}
                      onChange={(e) => setFormData({...formData, availableBalance: parseFloat(e.target.value) || 0})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="font-medium text-secondary">KSh {user.availableBalance?.toLocaleString() || 0}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted">Total Savings</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.totalSavings || 0}
                      onChange={(e) => setFormData({...formData, totalSavings: parseFloat(e.target.value) || 0})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="font-medium text-secondary">KSh {user.totalSavings?.toLocaleString() || 0}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted">Total Investments</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.totalInvestments || 0}
                      onChange={(e) => setFormData({...formData, totalInvestments: parseFloat(e.target.value) || 0})}
                      className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="font-medium text-secondary">KSh {user.totalInvestments?.toLocaleString() || 0}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted">Referral Earnings</label>
                  <div className="font-medium text-secondary">KSh {user.referralEarnings?.toLocaleString() || 0}</div>
                  <div className="text-xs text-muted">
                    Commission: KSh {user.referralCommissionEarnings?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-muted">
                    Subscription: KSh {user.referralSubscriptionEarnings?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-accent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Referral Information</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted">Referral Code:</span>
                    <span className="ml-2 font-mono font-medium text-secondary">{user.referralCode}</span>
                  </div>
                  <div>
                    <span className="text-muted">Referred By:</span>
                    <span className="ml-2 text-secondary">{user.referredBy || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-muted">Total Referrals:</span>
                    <span className="ml-2 text-secondary">{user.referrals?.length || 0}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Account Information</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted">Joined:</span>
                    <span className="ml-2 text-secondary">
                      {new Date(user.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {user.memberSince && (
                    <div>
                      <span className="text-muted">Member Since:</span>
                      <span className="ml-2 text-secondary">
                        {new Date(user.memberSince).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {editing && (
            <div className="mt-6 pt-6 border-t border-accent flex flex-wrap gap-3">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent-dark transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(user);
                }}
                className="px-6 py-2 border border-accent rounded-lg hover:bg-background transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for role badge colors
function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800 border-red-200';
    case 'vendor': return 'bg-green-100 text-green-800 border-green-200';
    case 'rider': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}