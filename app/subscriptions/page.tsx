/*"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, AlertCircle, Crown, Sparkles, Shield, Clock, ChevronRight } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export default function SubscriptionPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [phone, setPhone] = useState('');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Vendor',
      price: 10,
      period: 'month',
      features: [
        'Up to 50 products',
        'Basic analytics',
        'Standard support',
        'Mobile app access'
      ]
    },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);

  const handlePayment = async () => {
    setError('');
    setSuccess('');

    if (!phone || !/^(\+?254|0)?[17]\d{8}$/.test(phone)) {
      setError('Please enter a valid M-Pesa number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          amount: subscriptionPlans.find(plan => plan.id === selectedPlan)?.price,
          phone: phone.startsWith('+') ? phone : `+254${phone.replace(/^0/, '')}`
        }),
      });

      if (!response.ok) throw new Error('Payment failed. Please try again.');

      setSuccess('Subscription payment processed successfully!');
      setShowPaymentForm(false);
      setPhone('');
      
      // Auto hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to process payment');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        {/* Back Button *
        <div className="mb-4 xs:mb-5 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
          >
            <ArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        {/* Main Content *
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
          {/* Left Column - Subscription Plans *
          <div className="lg:col-span-2 space-y-5 xs:space-y-6 sm:space-y-8">
            {/* Header *
            <div>
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-1 xs:mb-1.5 sm:mb-2">
                <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl">
                  <Crown className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)]">
                  Subscription Management
                </h1>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)]">
                Manage your vendor subscription plan and payment methods
              </p>
            </div>

            {/* Current Plan Status *
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 xs:gap-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="p-1.5 xs:p-2 bg-white/20 rounded-lg">
                    <Shield className="w-4 h-4 xs:w-5 xs:h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] xs:text-[10px] sm:text-xs opacity-90 mb-0.5 xs:mb-1">Current Plan</p>
                    <h4 className="text-base xs:text-lg sm:text-xl font-bold mb-0.5 xs:mb-1">Professional Vendor</h4>
                    <p className="text-[8px] xs:text-[9px] sm:text-xs opacity-90">Renews on Dec 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 xs:gap-6">
                  <div className="text-right">
                    <p className="text-xl xs:text-2xl sm:text-3xl font-bold">{formatPrice(3000)}</p>
                    <p className="text-[8px] xs:text-[9px] sm:text-xs opacity-90">per month</p>
                  </div>
                  <div className="flex items-center gap-1 xs:gap-1.5">
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Plans Section *
            <div>
              <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3 xs:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
                Upgrade Your Plan
              </h2>
              
              <div className="grid grid-cols-1 gap-3 xs:gap-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative border rounded-lg xs:rounded-xl p-4 xs:p-5 cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20 bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-surface)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)]">
                            {plan.name}
                          </h5>
                          {plan.popular && (
                            <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-primary-alt)]">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">/{plan.period}</span>
                        </div>
                        <ul className="space-y-1.5 xs:space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-1.5 xs:gap-2 text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">
                              <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedPlan === plan.id && (
                        <div className="absolute top-3 right-3 xs:top-4 xs:right-4">
                          <div className="w-4 h-4 xs:w-5 xs:h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Section *
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6 sticky top-6">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
                Payment Method
              </h3>

              {/* M-Pesa Option *
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg xs:rounded-xl p-3 xs:p-4 mb-5 xs:mb-6 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)]">M-Pesa</p>
                      <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">Pay via M-Pesa</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-[8px] xs:text-[9px] sm:text-[10px] font-medium bg-green-500/10 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                    Connected
                  </span>
                </div>
              </div>

              {/* Alerts *
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl mb-4 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
                  <span className="text-[9px] xs:text-[10px] sm:text-xs">{error}</span>
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl mb-4 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
                  <span className="text-[9px] xs:text-[10px] sm:text-xs">{success}</span>
                </div>
              )}

              {/* Payment Form or Button *
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white py-2.5 xs:py-3 px-4 rounded-lg xs:rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm shadow-sm hover:shadow-md"
                >
                  Pay {formatPrice(subscriptionPlans.find(plan => plan.id === selectedPlan)?.price || 0)} Now
                </button>
              ) : (
                <div className="bg-[var(--color-background)] rounded-lg xs:rounded-xl p-3 xs:p-4 border border-[var(--color-border)]">
                  <label className="block text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                    Enter M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] border border-[var(--color-border)] rounded-lg px-3 xs:px-3.5 py-2 xs:py-2.5 bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                  />
                  <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)] mt-1.5 xs:mt-2">
                    You'll receive an M-Pesa prompt to complete payment
                  </p>

                  <div className="flex items-center justify-between gap-2 xs:gap-3 mt-3 xs:mt-4">
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      disabled={loading}
                      className="flex-1 px-3 xs:px-4 py-2 text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white px-3 xs:px-4 py-2 rounded-lg text-[9px] xs:text-[10px] sm:text-xs font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Confirm Payment'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Info *
              <div className="mt-4 xs:mt-5 pt-3 xs:pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-1.5 xs:gap-2 text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">
                  <Clock className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0" />
                  <span>Payment is processed securely via M-Pesa</span>
                </div>
              </div>

              {/* Plan Summary *
              {selectedPlan && (
                <div className="mt-4 xs:mt-5 pt-3 xs:pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Selected Plan:</span>
                    <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)]">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Total Amount:</span>
                    <span className="text-xs xs:text-sm sm:text-base font-bold text-[var(--color-primary-alt)]">
                      {formatPrice(subscriptionPlans.find(p => p.id === selectedPlan)?.price || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Banner *
        <div className="mt-8 xs:mt-10 sm:mt-12 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Shield className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Secure Payments</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">SSL encrypted</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Instant Activation</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">Upon payment confirmation</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Smartphone className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Mobile Payment</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">M-Pesa supported</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Auto-Renewal</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">Manage anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/


"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, AlertCircle, Crown, Sparkles, Shield, Clock, ChevronRight, TrendingUp, Rocket, Star, Zap, Gift, Tag, Award } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  badge?: string;
  icon?: React.ReactNode;
}

export default function SubscriptionPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [phone, setPhone] = useState('');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Vendor',
      price: 1000,
      period: 'month',
      badge: 'I Exist',
      icon: <Star className="w-5 h-5" />,
      features: [
        '📦 Up to 50 products',
        '📊 Basic analytics',
        '💬 Standard support',
        '📱 Mobile app access',
        '✨ New Arrivals listing'
      ]
    },
    {
      id: 'growth',
      name: 'Growth Vendor',
      price: 3000,
      period: 'month',
      popular: true,
      badge: 'I\'m Growing',
      icon: <TrendingUp className="w-5 h-5" />,
      features: [
        '📦 Up to 200 products',
        '📈 Advanced analytics',
        '⚡ Priority support',
        '💻 Mobile + Web access',
        '✨ New Arrivals listing',
        '🚀 Boosted in Best Sellers',
        '🏷️ Clearance campaigns'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Vendor',
      price: 7000,
      period: 'month',
      badge: 'I Dominate',
      icon: <Rocket className="w-5 h-5" />,
      features: [
        '📦 Unlimited products',
        '📊 Full analytics dashboard',
        '🕐 24/7 premium support',
        '💻📱 All platform access',
        '✨ New Arrivals priority',
        '🚀 Best Sellers boost',
        '🔥 Featured in Today\'s Deals',
        '🏷️ Clearance campaigns',
        '🎁 Gift Cards support'
      ]
    }
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);

  const handlePayment = async () => {
    setError('');
    setSuccess('');

    if (!phone || !/^(\+?254|0)?[17]\d{8}$/.test(phone)) {
      setError('Please enter a valid M-Pesa number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          amount: subscriptionPlans.find(plan => plan.id === selectedPlan)?.price,
          phone: phone.startsWith('+') ? phone : `+254${phone.replace(/^0/, '')}`
        }),
      });

      if (!response.ok) throw new Error('Payment failed. Please try again.');

      setSuccess('Subscription payment processed successfully!');
      setShowPaymentForm(false);
      setPhone('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to process payment');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 xs:mb-5 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
          >
            <ArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
          {/* Left Column - Subscription Plans */}
          <div className="lg:col-span-2 space-y-5 xs:space-y-6 sm:space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-1 xs:mb-1.5 sm:mb-2">
                <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl">
                  <Crown className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)]">
                  Choose Your Success Path
                </h1>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)]">
                Pick the plan that matches your business goals — from visibility to domination
              </p>
            </div>

            {/* Current Plan Status */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 xs:gap-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="p-1.5 xs:p-2 bg-white/20 rounded-lg">
                    <Shield className="w-4 h-4 xs:w-5 xs:h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] xs:text-[10px] sm:text-xs opacity-90 mb-0.5 xs:mb-1">Current Plan</p>
                    <h4 className="text-base xs:text-lg sm:text-xl font-bold mb-0.5 xs:mb-1">Growth Vendor</h4>
                    <p className="text-[8px] xs:text-[9px] sm:text-xs opacity-90">Renews on Dec 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 xs:gap-6">
                  <div className="text-right">
                    <p className="text-xl xs:text-2xl sm:text-3xl font-bold">{formatPrice(3000)}</p>
                    <p className="text-[8px] xs:text-[9px] sm:text-xs opacity-90">per month</p>
                  </div>
                  <div className="flex items-center gap-1 xs:gap-1.5">
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Plans Section */}
            <div>
              <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3 xs:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
                Upgrade Your Success
              </h2>
              
              <div className="grid grid-cols-1 gap-3 xs:gap-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative border rounded-lg xs:rounded-xl p-4 xs:p-5 cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20 bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-surface)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                            {plan.icon}
                          </div>
                          <h5 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)]">
                            {plan.name}
                          </h5>
                          {plan.popular && (
                            <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-medium rounded-full">
                              Most Popular
                            </span>
                          )}
                          <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[8px] xs:text-[9px] sm:text-[10px] font-medium rounded-full">
                            {plan.badge}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-[var(--color-primary-alt)]">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">/{plan.period}</span>
                        </div>
                        <ul className="space-y-1.5 xs:space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-1.5 xs:gap-2 text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">
                              <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedPlan === plan.id && (
                        <div className="absolute top-3 right-3 xs:top-4 xs:right-4">
                          <div className="w-4 h-4 xs:w-5 xs:h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Proposition Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                    What you're really buying:
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Not just features — you're buying <span className="font-semibold text-amber-600">visibility, traffic, and sales</span>. 
                    Higher tiers = more eyes on your products = more revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6 sticky top-6">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4 xs:w-5 xs:h-5 text-[var(--color-primary)]" />
                Payment Method
              </h3>

              {/* M-Pesa Option */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg xs:rounded-xl p-3 xs:p-4 mb-5 xs:mb-6 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)]">M-Pesa</p>
                      <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">Fast & secure payments</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-[8px] xs:text-[9px] sm:text-[10px] font-medium bg-green-500/10 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                    Available
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl mb-4 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
                  <span className="text-[9px] xs:text-[10px] sm:text-xs">{error}</span>
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl mb-4 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
                  <span className="text-[9px] xs:text-[10px] sm:text-xs">{success}</span>
                </div>
              )}

              {/* Payment Form or Button */}
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white py-2.5 xs:py-3 px-4 rounded-lg xs:rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm shadow-sm hover:shadow-md"
                >
                  Pay {formatPrice(subscriptionPlans.find(plan => plan.id === selectedPlan)?.price || 0)} Now
                </button>
              ) : (
                <div className="bg-[var(--color-background)] rounded-lg xs:rounded-xl p-3 xs:p-4 border border-[var(--color-border)]">
                  <label className="block text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                    Enter M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text)] border border-[var(--color-border)] rounded-lg px-3 xs:px-3.5 py-2 xs:py-2.5 bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                  />
                  <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)] mt-1.5 xs:mt-2">
                    You'll receive an M-Pesa prompt to complete payment
                  </p>

                  <div className="flex items-center justify-between gap-2 xs:gap-3 mt-3 xs:mt-4">
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      disabled={loading}
                      className="flex-1 px-3 xs:px-4 py-2 text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white px-3 xs:px-4 py-2 rounded-lg text-[9px] xs:text-[10px] sm:text-xs font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Confirm Payment'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="mt-4 xs:mt-5 pt-3 xs:pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-1.5 xs:gap-2 text-[8px] xs:text-[9px] sm:text-[10px] text-[var(--color-text-muted)]">
                  <Clock className="w-3 h-3 xs:w-3.5 xs:h-3.5 flex-shrink-0" />
                  <span>Payment is processed securely via M-Pesa</span>
                </div>
              </div>

              {/* Plan Summary */}
              {selectedPlan && (
                <div className="mt-4 xs:mt-5 pt-3 xs:pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Selected Plan:</span>
                    <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-[var(--color-text)]">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Total Amount:</span>
                    <span className="text-xs xs:text-sm sm:text-base font-bold text-[var(--color-primary-alt)]">
                      {formatPrice(subscriptionPlans.find(p => p.id === selectedPlan)?.price || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Banner - Now with Benefit-Focused Copy */}
        <div className="mt-8 xs:mt-10 sm:mt-12 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Shield className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Secure Payments</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">SSL encrypted transactions</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Rocket className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Instant Activation</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">Start selling immediately</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Visibility Boost</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">Get featured in key sections</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-lg xs:rounded-xl border border-[var(--color-border)] p-2 xs:p-2.5 sm:p-3 flex items-center gap-2 xs:gap-2.5 sm:gap-3">
            <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <Gift className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[var(--color-text)]">Extra Revenue</p>
              <p className="text-[7px] xs:text-[8px] text-[var(--color-text-muted)]">Gift Cards & campaigns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}/*{
  id: 'elite',
  name: 'Elite Vendor',
  price: 15000,
  period: 'month',
  features: [
    'Everything in Pro',
    'Top homepage placement',
    'Sponsored product slots',
    'Dedicated account manager',
    'Early access to new features'
  ]
}*/