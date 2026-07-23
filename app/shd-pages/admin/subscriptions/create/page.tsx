// C:\Users\USER\Desktop\Projects\my-app\app\admin\subscriptions\create\page.tsx
/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateSubscription() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tier: 'basic',
    price: '',
    billingCycle: 'monthly',
    features: '',
    maxProducts: '',
    maxOrders: '',
    commissionRate: '10',
    prioritySupport: false,
    analyticsAccess: false,
    promoFeatures: false,
    customDomain: false,
    apiAccess: false,
    teamMembers: '1',
    storageLimit: '1',
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxProducts: parseInt(formData.maxProducts),
          maxOrders: parseInt(formData.maxOrders),
          commissionRate: parseFloat(formData.commissionRate),
          teamMembers: parseInt(formData.teamMembers),
          storageLimit: parseInt(formData.storageLimit),
          features: formData.features.split('\n').filter(f => f.trim())
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Subscription plan created successfully!');
        router.push('/admin/subscriptions');
      } else {
        setError(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📋 Create Subscription Plan</h1>
        <Link href="/admin/subscriptions" className="text-blue-600 hover:underline">
          ← Back to Subscriptions
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information *
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
                placeholder="e.g., Premium Vendor Plan"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border rounded-lg p-2"
                placeholder="Describe the benefits of this plan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier *</label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle *</label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Pricing *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg p-2"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%) *</label>
              <input
                type="number"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full border rounded-lg p-2"
                placeholder="10"
              />
            </div>

            {/* Limits *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Limits</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Products *</label>
              <input
                type="number"
                name="maxProducts"
                value={formData.maxProducts}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg p-2"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Orders/Month *</label>
              <input
                type="number"
                name="maxOrders"
                value={formData.maxOrders}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg p-2"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Members *</label>
              <input
                type="number"
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleChange}
                required
                min="1"
                className="w-full border rounded-lg p-2"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Limit (GB) *</label>
              <input
                type="number"
                name="storageLimit"
                value={formData.storageLimit}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg p-2"
                placeholder="1"
              />
            </div>

            {/* Features *
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-semibold mb-4">Features</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (one per line)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg p-2"
                placeholder="Unlimited products\nPriority support\nAdvanced analytics\nCustom domain"
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium mb-3">Premium Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="prioritySupport"
                    checked={formData.prioritySupport}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Priority Support</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="analyticsAccess"
                    checked={formData.analyticsAccess}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Analytics Access</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="promoFeatures"
                    checked={formData.promoFeatures}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Promotion Features</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="customDomain"
                    checked={formData.customDomain}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Custom Domain</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="apiAccess"
                    checked={formData.apiAccess}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">API Access</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active (visible to vendors)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Subscription'}
            </button>
            <Link
              href="/admin/subscriptions"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}*/

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateSubscription() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tier: 'basic',
    price: '',
    billingCycle: 'monthly',
    features: '',
    maxProducts: '',
    maxOrders: '',
    commissionRate: '10',
    prioritySupport: false,
    analyticsAccess: false,
    promoFeatures: false,
    customDomain: false,
    apiAccess: false,
    teamMembers: '1',
    storageLimit: '1',
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxProducts: parseInt(formData.maxProducts),
          maxOrders: parseInt(formData.maxOrders),
          commissionRate: parseFloat(formData.commissionRate),
          teamMembers: parseInt(formData.teamMembers),
          storageLimit: parseInt(formData.storageLimit),
          features: formData.features.split('\n').filter(f => f.trim())
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Subscription plan created successfully!' });
        setTimeout(() => {
          router.push('/admin/subscriptions');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create subscription' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary">
            📋 Create Subscription Plan
          </h1>
          <p className="text-muted mt-1">
            Create a new subscription plan for vendors
          </p>
        </div>
        <Link 
          href="/admin/subscriptions" 
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Subscriptions
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

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 border border-surface">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📝</span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="e.g., Premium Vendor Plan"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Describe the benefits of this plan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Tier *
                </label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Billing Cycle *
                </label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary appearance-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">💰</span>
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Price (KSh) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Commission Rate (%) *
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  value={formData.commissionRate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">📊</span>
              Limits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Max Products *
                </label>
                <input
                  type="number"
                  name="maxProducts"
                  value={formData.maxProducts}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Max Orders/Month *
                </label>
                <input
                  type="number"
                  name="maxOrders"
                  value={formData.maxOrders}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Team Members *
                </label>
                <input
                  type="number"
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Storage Limit (GB) *
                </label>
                <input
                  type="number"
                  name="storageLimit"
                  value={formData.storageLimit}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-surface pt-6">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-primary">⭐</span>
              Features
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Features (one per line)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Unlimited products\nPriority support\nAdvanced analytics\nCustom domain"
                />
              </div>

              <div>
                <h3 className="font-medium text-secondary mb-3">Premium Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-surface hover:bg-surface/30 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="prioritySupport"
                      checked={formData.prioritySupport}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface rounded"
                    />
                    <span className="text-sm text-secondary">⭐ Priority Support</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-surface hover:bg-surface/30 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="analyticsAccess"
                      checked={formData.analyticsAccess}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface rounded"
                    />
                    <span className="text-sm text-secondary">📊 Analytics Access</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-surface hover:bg-surface/30 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="promoFeatures"
                      checked={formData.promoFeatures}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface rounded"
                    />
                    <span className="text-sm text-secondary">📢 Promotion Features</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-surface hover:bg-surface/30 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="customDomain"
                      checked={formData.customDomain}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface rounded"
                    />
                    <span className="text-sm text-secondary">🌐 Custom Domain</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-surface hover:bg-surface/30 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="apiAccess"
                      checked={formData.apiAccess}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-surface rounded"
                    />
                    <span className="text-sm text-secondary">🔌 API Access</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-t border-surface pt-6">
            <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-surface hover:border-primary/30 transition-colors duration-200 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-primary focus:ring-primary border-surface rounded"
              />
              <div>
                <span className="font-medium text-secondary">Active</span>
                <p className="text-sm text-muted">Plan will be visible to vendors</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-surface">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-accent-dark disabled:bg-muted disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-bold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Subscription'
              )}
            </button>
            <Link
              href="/admin/subscriptions"
              className="bg-surface hover:bg-surface/70 text-secondary px-8 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}