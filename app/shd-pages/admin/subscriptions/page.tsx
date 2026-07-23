// C:\Users\USER\Desktop\Projects\my-app\app\admin\subscriptions\page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subscription {
  _id: string;
  name: string;
  description: string;
  tier: string;
  price: number;
  billingCycle: string;
  features: string[];
  maxProducts: number;
  maxOrders: number;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionStatus = async (subscriptionId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        alert(`Subscription ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchSubscriptions();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update subscription');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to delete this subscription? This will affect vendors on this plan.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Subscription deleted successfully');
        fetchSubscriptions();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete subscription');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'active') return sub.isActive;
    if (filter === 'inactive') return !sub.isActive;
    return true;
  });

  const getTierBadge = (tier: string) => {
    const badges = {
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-amber-100 text-amber-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return badges[tier as keyof typeof badges] || badges.basic;
  };

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
        <h1 className="text-3xl font-bold">📋 Subscriptions</h1>
        <Link
          href="/admin/subscriptions/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Subscription
        </Link>
      </div>

      {/* Filters *
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Plans</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="bg-gray-100 px-4 py-2 rounded-lg">
          Total: {filteredSubscriptions.length} plans
        </span>
      </div>

      {/* Subscriptions Grid *
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((sub) => (
          <div key={sub._id} className="bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTierBadge(sub.tier)}`}>
                  {sub.tier.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {sub.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{sub.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sub.description}</p>

              <div className="mb-4">
                <p className="text-2xl font-bold text-blue-600">KSh {sub.price}</p>
                <p className="text-sm text-gray-500">/{sub.billingCycle}</p>
              </div>

              <div className="space-y-2 text-sm">
                <p>📦 {sub.maxProducts} products</p>
                <p>📋 {sub.maxOrders} orders/month</p>
                <p>💰 {sub.commissionRate}% commission</p>
                <p className="text-xs text-gray-500">
                  {sub.features.length} features included
                </p>
              </div>

              <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                <Link
                  href={`/admin/subscriptions/${sub._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </Link>
                <Link
                  href={`/admin/subscriptions/edit/${sub._id}`}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleSubscriptionStatus(sub._id, sub.isActive)}
                  className={`text-sm font-medium ${
                    sub.isActive
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  {sub.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteSubscription(sub._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-gray-500">No subscriptions found</p>
          <Link
            href="/admin/subscriptions/create"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Create your first subscription plan
          </Link>
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subscription {
  _id: string;
  name: string;
  description: string;
  tier: string;
  price: number;
  billingCycle: string;
  features: string[];
  maxProducts: number;
  maxOrders: number;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionStatus = async (subscriptionId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this subscription?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Subscription ${currentStatus ? 'deactivated' : 'activated'} successfully` 
        });
        fetchSubscriptions();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update subscription' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to delete this subscription? This will affect vendors on this plan.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/admin/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Subscription deleted successfully' });
        fetchSubscriptions();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete subscription' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'active') return sub.isActive;
    if (filter === 'inactive') return !sub.isActive;
    return true;
  });

  const getTierBadge = (tier: string) => {
    const badges: Record<string, string> = {
      basic: 'bg-blue-100 text-blue-700 border-blue-200',
      premium: 'bg-purple-100 text-purple-700 border-purple-200',
      enterprise: 'bg-amber-100 text-amber-700 border-amber-200',
      custom: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return badges[tier] || badges.basic;
  };

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
            📋 Subscriptions
          </h1>
          <p className="text-muted mt-1">
            Manage subscription plans for vendors
          </p>
        </div>
        <Link
          href="/admin/subscriptions/create"
          className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
        >
          + Create Subscription
        </Link>
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
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 border-surface bg-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
        >
          <option value="all">All Plans</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="bg-surface/50 px-4 py-2.5 rounded-xl text-sm text-secondary font-medium border border-surface">
          Total: {filteredSubscriptions.length} plan{filteredSubscriptions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-secondary mb-2">No subscriptions found</h3>
          <p className="text-muted mb-6">
            {filter !== 'all' ? 'Try adjusting your filter' : 'Create your first subscription plan'}
          </p>
          {filter !== 'all' ? (
            <button
              onClick={() => setFilter('all')}
              className="text-primary hover:text-accent-dark font-medium transition-colors duration-200"
            >
              Clear filter →
            </button>
          ) : (
            <Link
              href="/admin/subscriptions/create"
              className="inline-block bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Create Subscription
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSubscriptions.map((sub) => (
            <div 
              key={sub._id} 
              className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                sub.isActive ? 'border-surface hover:border-primary/30' : 'border-red-200 hover:border-red-300'
              }`}
            >
              <div className="p-6">
                {/* Badges */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getTierBadge(sub.tier)}`}>
                    {sub.tier.toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    sub.isActive 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}>
                    {sub.isActive ? '✅ Active' : '⛔ Inactive'}
                  </span>
                </div>

                {/* Plan Info */}
                <h3 className="text-xl font-bold text-secondary mb-1">{sub.name}</h3>
                <p className="text-muted text-sm mb-4 line-clamp-2">{sub.description}</p>

                <div className="mb-4">
                  <p className="text-2xl font-black text-primary">KSh {sub.price.toLocaleString()}</p>
                  <p className="text-sm text-muted">/{sub.billingCycle}</p>
                </div>

                {/* Features */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">📦</span>
                    <span className="text-secondary">{sub.maxProducts} products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">📋</span>
                    <span className="text-secondary">{sub.maxOrders} orders/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">💰</span>
                    <span className="text-secondary">{sub.commissionRate}% commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">📌</span>
                    <span className="text-muted text-xs">{sub.features.length} features included</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-surface flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/subscriptions/${sub._id}`}
                    className="text-primary hover:text-accent-dark text-sm font-medium transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  <span className="text-muted">|</span>
                  <Link
                    href={`/admin/subscriptions/edit/${sub._id}`}
                    className="text-accent-dark hover:text-accent-dark/80 text-sm font-medium transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <span className="text-muted">|</span>
                  <button
                    onClick={() => toggleSubscriptionStatus(sub._id, sub.isActive)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      sub.isActive
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-green-500 hover:text-green-700'
                    }`}
                  >
                    {sub.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    onClick={() => handleDeleteSubscription(sub._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}