// C:\Users\USER\Desktop\Projects\my-app\app\admin\reconcile\page.tsx
/*'use client';

import { useState, useEffect } from 'react';

interface Reconciliation {
  date: string;
  mpesaBalance: any;
  totalCollected: number;
  totalPayouts: number;
  totalPendingPayouts: number;
  totalFailedPayouts: number;
  commissions: number;
  netBalance: number;
  collectionsCount: number;
  payoutsCount: number;
  pendingCount: number;
  failedCount: number;
}

export default function AdminReconcile() {
  const [reconciliation, setReconciliation] = useState<Reconciliation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReconciliation();
  }, []);

  const fetchReconciliation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/reconcile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setReconciliation(data);
    } catch (error) {
      console.error('Failed to fetch reconciliation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reconciliation) {
    return <div>Failed to load reconciliation data</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 Reconciliation</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500">As of {new Date(reconciliation.date).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <p className="text-sm text-gray-600">Total Collected</p>
          <p className="text-2xl font-bold text-blue-600">KSh {reconciliation.totalCollected?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">{reconciliation.collectionsCount} transactions</p>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <p className="text-sm text-gray-600">Total Payouts</p>
          <p className="text-2xl font-bold text-green-600">KSh {reconciliation.totalPayouts?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">{reconciliation.payoutsCount} completed</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6">
          <p className="text-sm text-gray-600">Pending Payouts</p>
          <p className="text-2xl font-bold text-yellow-600">KSh {reconciliation.totalPendingPayouts?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">{reconciliation.pendingCount} pending</p>
        </div>

        <div className="bg-red-50 rounded-xl p-6">
          <p className="text-sm text-gray-600">Failed Payouts</p>
          <p className="text-2xl font-bold text-red-600">KSh {reconciliation.totalFailedPayouts?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">{reconciliation.failedCount} failed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Commission Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Collected</span>
              <span className="font-medium">KSh {reconciliation.totalCollected?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commission (10%)</span>
              <span className="font-medium text-orange-600">KSh {reconciliation.commissions?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Net Balance</span>
              <span className="font-bold text-green-600 text-xl">KSh {reconciliation.netBalance?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/transactions'}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
            >
              View All Transactions
            </button>
            <button
              onClick={() => window.location.href = '/admin/payouts'}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
            >
              Manage Payouts
            </button>
            <button
              onClick={() => window.location.href = '/admin/payouts/retry'}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-center"
            >
              Retry Failed Payouts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Reconciliation {
  date: string;
  mpesaBalance: any;
  totalCollected: number;
  totalPayouts: number;
  totalPendingPayouts: number;
  totalFailedPayouts: number;
  commissions: number;
  netBalance: number;
  collectionsCount: number;
  payoutsCount: number;
  pendingCount: number;
  failedCount: number;
}

export default function AdminReconcile() {
  const [reconciliation, setReconciliation] = useState<Reconciliation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReconciliation();
  }, []);

  const fetchReconciliation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/admin/reconcile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reconciliation data');
      }
      
      const data = await response.json();
      setReconciliation(data);
    } catch (error) {
      console.error('Failed to fetch reconciliation:', error);
      setError('Failed to load reconciliation data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !reconciliation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-muted">{error || 'Failed to load reconciliation data'}</p>
          <button 
            onClick={fetchReconciliation}
            className="mt-4 bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Total Collected',
      value: reconciliation.totalCollected,
      icon: '💰',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      textColor: 'text-blue-600',
      count: reconciliation.collectionsCount,
      countLabel: 'transactions'
    },
    {
      label: 'Total Payouts',
      value: reconciliation.totalPayouts,
      icon: '💳',
      color: 'bg-green-50 text-green-700 border-green-200',
      textColor: 'text-green-600',
      count: reconciliation.payoutsCount,
      countLabel: 'completed'
    },
    {
      label: 'Pending Payouts',
      value: reconciliation.totalPendingPayouts,
      icon: '⏳',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      textColor: 'text-yellow-600',
      count: reconciliation.pendingCount,
      countLabel: 'pending'
    },
    {
      label: 'Failed Payouts',
      value: reconciliation.totalFailedPayouts,
      icon: '❌',
      color: 'bg-red-50 text-red-700 border-red-200',
      textColor: 'text-red-600',
      count: reconciliation.failedCount,
      countLabel: 'failed'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📊 Reconciliation
          </h1>
          <p className="text-muted mt-1">
            Financial overview and reconciliation summary
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchReconciliation}
            className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Date */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 border border-surface">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm text-muted">As of</p>
            <p className="font-medium text-secondary">
              {new Date(reconciliation.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border ${stat.color} hover:border-primary/20`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
                <p className={`text-2xl sm:text-3xl font-black ${stat.textColor} mt-1`}>
                  KSh {stat.value?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted mt-1">
                  {stat.count} {stat.countLabel}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/50`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Summary */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <h3 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
            <span className="text-primary">📈</span>
            Commission Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-surface/30">
              <span className="text-muted">Total Collected</span>
              <span className="font-medium text-secondary">
                KSh {reconciliation.totalCollected?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-surface/30">
              <span className="text-muted">Commission (10%)</span>
              <span className="font-medium text-primary">
                KSh {reconciliation.commissions?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5 border border-primary/20">
              <span className="font-semibold text-secondary">Net Balance</span>
              <span className="font-black text-2xl text-primary">
                KSh {reconciliation.netBalance?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-surface">
          <h3 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
            <span className="text-primary">⚡</span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/transactions"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-accent-dark text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <span>💰</span>
              View All Transactions
            </Link>
            <Link
              href="/admin/payouts"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <span>💳</span>
              Manage Payouts
            </Link>
            <Link
              href="/admin/payouts/retry"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <span>🔄</span>
              Retry Failed Payouts
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 bg-surface/30 border border-surface rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-medium text-secondary">Reconciliation Notes</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li>• All amounts are in Kenyan Shillings (KSh)</li>
              <li>• Commission rate is 10% of total collected</li>
              <li>• Net balance = Total Collected - Commission - Total Payouts</li>
              <li>• Pending payouts will be processed in the next batch</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}