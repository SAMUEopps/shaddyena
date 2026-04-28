// app/admin/subscription-plans/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Edit2, Trash2, Save, X, 
  Star, TrendingUp, Rocket, Crown, Zap, Award,
  CheckCircle, AlertCircle, Eye, EyeOff, 
  MoveUp, MoveDown, DollarSign, Calendar,
  Tag, Sparkles, Shield
} from 'lucide-react';

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'quarter';
  features: string[];
  popular: boolean;
  badge: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const iconMap = {
  Star: Star,
  TrendingUp: TrendingUp,
  Rocket: Rocket,
  Crown: Crown,
  Zap: Zap,
  Award: Award,
};

const periodLabels = {
  month: 'Monthly',
  year: 'Yearly',
  quarter: 'Quarterly',
};

export default function AdminSubscriptionPlans() {
  const { user, isLoading: authLoading } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: 'month',
    features: [''],
    popular: false,
    badge: '',
    icon: 'Star',
    order: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPlans();
    }
  }, [user, showInactive]);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`/api/admin/subscription-plans?includeInactive=${showInactive}`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const filteredFeatures = formData.features.filter(f => f.trim() !== '');
      if (filteredFeatures.length === 0) {
        setError('At least one feature is required');
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        period: formData.period,
        features: filteredFeatures,
        popular: formData.popular,
        badge: formData.badge,
        icon: formData.icon,
        order: parseInt(formData.order.toString()),
      };

      let response;
      if (editingPlan) {
        response = await fetch(`/api/admin/subscription-plans?id=${editingPlan._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/admin/subscription-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setSuccess(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      resetForm();
      fetchPlans();
    } catch (error: any) {
      setError(error.message || 'Failed to save plan');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subscription-plans?id=${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      setSuccess('Plan deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchPlans();
    } catch (error) {
      setError('Failed to delete plan');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    try {
      const response = await fetch(`/api/admin/subscription-plans?id=${plan._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...plan,
          isActive: !plan.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan status');
      }

      fetchPlans();
    } catch (error) {
      setError('Failed to update plan status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      period: 'month',
      features: [''],
      popular: false,
      badge: '',
      icon: 'Star',
      order: 0,
    });
    setIsModalOpen(false);
  };

  const editPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      period: plan.period,
      features: plan.features.length ? plan.features : [''],
      popular: plan.popular,
      badge: plan.badge || '',
      icon: plan.icon || 'Star',
      order: plan.order,
    });
    setIsModalOpen(true);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h1>
          <p className="text-[var(--color-text-muted)]">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
                  <Tag className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                  Subscription Plans Management
                </h1>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Create and manage vendor subscription plans
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add New Plan
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Toggle Inactive Plans */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all"
          >
            {showInactive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showInactive ? 'Hide Inactive' : 'Show Inactive'}
          </button>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
            <Tag className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-muted)]">No subscription plans found</p>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="mt-4 text-[var(--color-primary)] hover:underline"
            >
              Create your first plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const IconComponent = iconMap[plan.icon as keyof typeof iconMap] || Star;
              return (
                <div
                  key={plan._id}
                  className={`bg-[var(--color-surface)] rounded-xl border transition-all duration-300 ${
                    plan.isActive
                      ? plan.popular
                        ? 'border-[var(--color-primary)] shadow-lg ring-2 ring-[var(--color-primary)] ring-opacity-20'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                      : 'border-red-500/30 opacity-60'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-text)]">
                            {plan.name}
                          </h3>
                          {plan.badge && (
                            <span className="inline-block text-xs px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full mt-1">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      {!plan.isActive && (
                        <span className="text-xs px-2 py-1 bg-red-500/10 text-red-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-[var(--color-primary-alt)]">
                        KES {plan.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        /{periodLabels[plan.period]}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-[var(--color-text)] mb-2">Features:</p>
                      <ul className="space-y-1.5">
                        {plan.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 4 && (
                          <li className="text-xs text-[var(--color-primary)]">
                            +{plan.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)]">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                          plan.isActive
                            ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                            : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                        }`}
                      >
                        {plan.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => editPlan(plan)}
                        className="px-3 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/20 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="px-3 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[var(--color-background)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--color-background)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 hover:bg-[var(--color-surface)] rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="e.g., Pro Vendor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Price (KES) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Billing Period
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                      className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    >
                      <option value="month">Monthly</option>
                      <option value="quarter">Quarterly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  >
                    <option value="Star">Star</option>
                    <option value="TrendingUp">Trending Up</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Crown">Crown</option>
                    <option value="Zap">Zap</option>
                    <option value="Award">Award</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="e.g., Most Popular"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Features *
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-2 text-sm text-[var(--color-primary)] hover:underline"
                >
                  + Add Feature
                </button>
              </div>

              {/* Popular Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="popular" className="text-sm text-[var(--color-text)]">
                  Mark as Popular (this will unmark other plans)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}