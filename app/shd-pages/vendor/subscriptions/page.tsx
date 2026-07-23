// C:\Users\USER\Desktop\Projects\my-app\app\vendor\subscriptions\page.tsx
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
  prioritySupport: boolean;
  analyticsAccess: boolean;
  promoFeatures: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  teamMembers: number;
  storageLimit: number;
  isActive: boolean;
}

interface VendorSubscription {
  _id: string;
  subscriptionId: Subscription;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  amountPaid: number;
}

export default function VendorSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<VendorSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch available subscriptions
      const subsResponse = await fetch('/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const subsData = await subsResponse.json();
      setSubscriptions(subsData.subscriptions || []);

      // Fetch vendor's current subscription
      const currentResponse = await fetch('/api/vendor/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const currentData = await currentResponse.json();
      setCurrentSubscription(currentData.subscription || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to upgrade to this plan?')) return;
    
    setUpgrading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/vendor/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptionId })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Subscription upgraded successfully!');
        fetchData();
      } else {
        alert(data.error || 'Failed to upgrade subscription');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancelAutoRenew = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/vendor/subscriptions/cancel-auto-renew', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Auto-renew cancelled successfully');
        fetchData();
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">📋 Subscription Plans</h1>

        {/* Current Subscription *
        {currentSubscription && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Current Plan</h2>
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{currentSubscription.subscriptionId?.name || 'No Plan'}</p>
                <p className="text-gray-600">Status: {currentSubscription.status.toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  Valid until: {new Date(currentSubscription.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Auto-renew: {currentSubscription.autoRenew ? '✅ Enabled' : '❌ Disabled'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">KSh {currentSubscription.amountPaid}</p>
                <p className="text-sm text-gray-500">Paid on {new Date(currentSubscription.startDate).toLocaleDateString()}</p>
                {currentSubscription.autoRenew && (
                  <button
                    onClick={handleCancelAutoRenew}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Cancel Auto-Renew
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Plans *
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => {
            const isCurrent = currentSubscription?.subscriptionId?._id === sub._id;
            const isUpgrade = currentSubscription && !isCurrent;
            
            return (
              <div key={sub._id} className={`bg-white rounded-xl shadow hover:shadow-lg transition ${
                isCurrent ? 'ring-2 ring-blue-600' : ''
              }`}>
                <div className="p-6">
                  {isCurrent && (
                    <div className="bg-blue-600 text-white text-center text-xs font-semibold py-1 px-3 rounded-full inline-block mb-3">
                      CURRENT PLAN
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sub.tier === 'basic' ? 'bg-blue-100 text-blue-800' :
                      sub.tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                      sub.tier === 'enterprise' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sub.tier.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.isActive ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{sub.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{sub.description}</p>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-600">KSh {sub.price}</p>
                    <p className="text-sm text-gray-500">/{sub.billingCycle}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>📦 {sub.maxProducts} products</p>
                    <p>📋 {sub.maxOrders} orders/month</p>
                    <p>💰 {sub.commissionRate}% commission</p>
                    <p>👥 {sub.teamMembers} team members</p>
                    <p>💾 {sub.storageLimit} GB storage</p>
                    {sub.prioritySupport && <p>⭐ Priority Support</p>}
                    {sub.analyticsAccess && <p>📊 Analytics Access</p>}
                    {sub.promoFeatures && <p>📢 Promotion Features</p>}
                    {sub.customDomain && <p>🌐 Custom Domain</p>}
                    {sub.apiAccess && <p>🔌 API Access</p>}
                  </div>

                  {sub.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-semibold text-sm mb-2">Features:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {sub.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                        {sub.features.length > 3 && (
                          <li className="text-blue-600">+ {sub.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {!isCurrent && sub.isActive && (
                    <button
                      onClick={() => handleUpgrade(sub._id)}
                      disabled={upgrading}
                      className={`mt-6 w-full py-2 rounded-lg font-semibold ${
                        isUpgrade
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:bg-gray-400`}
                    >
                      {upgrading ? 'Processing...' : isUpgrade ? 'Upgrade to this Plan' : 'Subscribe Now'}
                    </button>
                  )}

                  {isCurrent && (
                    <div className="mt-6 w-full py-2 rounded-lg bg-gray-100 text-gray-600 text-center font-semibold">
                      ✅ Active Plan
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-gray-500">No subscription plans available</p>
          </div>
        )}
      </div>
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
  prioritySupport: boolean;
  analyticsAccess: boolean;
  promoFeatures: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  teamMembers: number;
  storageLimit: number;
  isActive: boolean;
}

interface VendorSubscription {
  _id: string;
  subscriptionId: Subscription;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  amountPaid: number;
}

export default function VendorSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<VendorSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const subsResponse = await fetch('/api/shd-api/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const subsData = await subsResponse.json();
      setSubscriptions(subsData.subscriptions || []);

      const currentResponse = await fetch('/api/shd-api/api/vendor/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const currentData = await currentResponse.json();
      setCurrentSubscription(currentData.subscription || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to upgrade to this plan?')) return;
    
    setUpgrading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/vendor/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptionId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Subscription upgraded successfully!' });
        fetchData();
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upgrade subscription' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancelAutoRenew = async () => {
    if (!confirm('Are you sure you want to cancel auto-renew?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/vendor/subscriptions/cancel-auto-renew', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Auto-renew cancelled successfully' });
        fetchData();
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-blue-100 text-blue-700 border-blue-200',
      premium: 'bg-purple-100 text-purple-700 border-purple-200',
      enterprise: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return colors[tier] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-blue-50 text-blue-700 border-blue-200',
      premium: 'bg-purple-50 text-purple-700 border-purple-200',
      enterprise: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return colors[tier] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary">
              📋 Subscription Plans
            </h1>
            <p className="text-muted mt-1">
              Choose the perfect plan for your business
            </p>
          </div>
          <Link
            href="/vendor/dashboard"
            className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
          >
            ← Dashboard
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

        {/* Current Subscription */}
        {currentSubscription && (
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 mb-8 border border-surface">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-secondary">Current Plan</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    ✅ Active
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-primary">
                  {currentSubscription.subscriptionId?.name || 'No Plan'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                  <p className="text-muted">
                    Status: <span className="font-medium text-secondary capitalize">{currentSubscription.status}</span>
                  </p>
                  <p className="text-muted">
                    Valid until: <span className="font-medium text-secondary">
                      {new Date(currentSubscription.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="text-muted">
                    Auto-renew: <span className={`font-medium ${currentSubscription.autoRenew ? 'text-green-600' : 'text-red-500'}`}>
                      {currentSubscription.autoRenew ? '✅ Enabled' : '❌ Disabled'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl sm:text-3xl font-black text-primary">
                  KSh {currentSubscription.amountPaid.toLocaleString()}
                </p>
                <p className="text-sm text-muted">
                  Paid on {new Date(currentSubscription.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                {currentSubscription.autoRenew && (
                  <button
                    onClick={handleCancelAutoRenew}
                    className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                  >
                    Cancel Auto-Renew
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Plans */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No subscription plans available</h3>
            <p className="text-muted">Check back later for available plans</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {subscriptions.map((sub) => {
              const isCurrent = currentSubscription?.subscriptionId?._id === sub._id;
              const isUpgrade = currentSubscription && !isCurrent;
              
              return (
                <div 
                  key={sub._id} 
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                    isCurrent ? 'border-primary' : 'border-surface hover:border-primary/30'
                  }`}
                >
                  <div className="p-6 sm:p-7">
                    {/* Tier Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(sub.tier)}`}>
                        {sub.tier.toUpperCase()}
                      </span>
                      {isCurrent && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                          CURRENT
                        </span>
                      )}
                    </div>

                    {/* Plan Name & Price */}
                    <h3 className="text-xl font-bold text-secondary mb-1">{sub.name}</h3>
                    <p className="text-muted text-sm mb-4">{sub.description}</p>

                    <div className="mb-4">
                      <p className="text-3xl font-black text-primary">
                        KSh {sub.price.toLocaleString()}
                      </p>
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
                        <span className="text-primary">👥</span>
                        <span className="text-secondary">{sub.teamMembers} team members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">💾</span>
                        <span className="text-secondary">{sub.storageLimit} GB storage</span>
                      </div>
                    </div>

                    {/* Premium Features */}
                    <div className="mt-4 pt-4 border-t border-surface">
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {sub.prioritySupport && (
                          <span className="flex items-center gap-1 text-green-600">⭐ Priority Support</span>
                        )}
                        {sub.analyticsAccess && (
                          <span className="flex items-center gap-1 text-blue-600">📊 Analytics</span>
                        )}
                        {sub.promoFeatures && (
                          <span className="flex items-center gap-1 text-purple-600">📢 Promotions</span>
                        )}
                        {sub.customDomain && (
                          <span className="flex items-center gap-1 text-amber-600">🌐 Custom Domain</span>
                        )}
                        {sub.apiAccess && (
                          <span className="flex items-center gap-1 text-indigo-600">🔌 API Access</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {!isCurrent && sub.isActive && (
                      <button
                        onClick={() => handleUpgrade(sub._id)}
                        disabled={upgrading}
                        className={`mt-6 w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                          isUpgrade
                            ? 'bg-primary hover:bg-accent-dark text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        } disabled:bg-muted disabled:cursor-not-allowed`}
                      >
                        {upgrading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          isUpgrade ? '⬆️ Upgrade' : '🚀 Subscribe'
                        )}
                      </button>
                    )}

                    {isCurrent && (
                      <div className="mt-6 w-full py-3 rounded-xl bg-surface/50 text-secondary text-center font-bold">
                        ✅ Active Plan
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upgrade Info */}
        {currentSubscription && (
          <div className="mt-8 bg-surface/30 border border-surface rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-secondary mb-3">💡 Plan Benefits</h3>
            <ul className="space-y-2 text-muted">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Upgrade anytime to access more features
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Higher tier plans offer better commission rates
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                All plans include priority support
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                Cancel or change your plan at any time
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}