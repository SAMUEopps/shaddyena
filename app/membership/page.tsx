// app/membership/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  Clock, 
  CheckCircle,
  Users,
  Target,
  Rocket,
  Gift
} from 'lucide-react';

const investmentFunds = [
  {
    id: 1,
    title: 'Marketing Fund',
    category: 'marketing',
    description: 'Support advertising campaigns, brand awareness, and customer acquisition.',
    minimum: 5000,
    duration: '9 Months',
    returnRate: '15%',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Transport Fund',
    category: 'transport',
    description: 'Support logistics, delivery vehicles, and distribution networks.',
    minimum: 5000,
    duration: '12 Months',
    returnRate: '18%',
    icon: Truck,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    title: 'Tech & Innovation Fund',
    category: 'tech',
    description: 'Platform development, AI systems, mobile apps, and new technologies.',
    minimum: 5000,
    duration: '12 Months',
    returnRate: '20%',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 4,
    title: 'Business Startup Fund',
    category: 'startup',
    description: 'Funding new businesses inside the ecosystem.',
    minimum: 5000,
    duration: '18 Months',
    returnRate: '25%',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
  },
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [amount, setAmount] = useState(100);

  const contributionPlans = {
    daily: { min: 100, label: 'Daily', frequency: 'every day' },
    weekly: { min: 100, label: 'Weekly', frequency: 'every week' },
    monthly: { min: 100, label: 'Monthly', frequency: 'every month' },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary-alt)] to-[var(--color-primary)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Become a Shaddyna Member</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Save. Invest. Grow.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Start with as little as KES 100
            </p>
            <Link
              href="/membership/register"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Join Membership
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--color-background-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Simple steps to start your savings and investment journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register as Member', desc: 'Create your account and become a Shaddyna member', icon: Users },
              { step: '02', title: 'Choose Savings Plan', desc: 'Select daily, weekly, or monthly contribution', icon: Wallet },
              { step: '03', title: 'Deposit Funds', desc: 'Start saving with as little as KES 100', icon: Gift },
              { step: '04', title: 'Invest Savings', desc: 'Grow your money through our investment funds', icon: TrendingUp },
              { step: '05', title: 'Earn Returns', desc: 'Get competitive returns on your investments', icon: BarChart3 },
              { step: '06', title: 'Withdraw', desc: 'Access your savings after investment period', icon: Clock },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-[var(--color-primary-alt)]/20 mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-[var(--color-primary-soft)]/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-[var(--color-primary-alt)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                  <p className="text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
                {idx < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-[var(--color-primary-alt)]/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Choose Your Contribution Plan
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Flexible savings plans that fit your lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.entries(contributionPlans).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key as any)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedPlan === key
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/10'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{plan.label}</h3>
                <p className="text-3xl font-bold text-[var(--color-primary-alt)] mb-2">
                  KES {plan.min}+
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Minimum {plan.frequency}</p>
                {selectedPlan === key && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto mt-8">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Contribution Amount (KES)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(100, parseInt(e.target.value) || 0))}
              min={contributionPlans[selectedPlan].min}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              Minimum: KES {contributionPlans[selectedPlan].min}
            </p>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-20 bg-[var(--color-background-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Investment Opportunities
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Grow your savings through our curated investment funds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentFunds.map((fund) => (
              <div key={fund.id} className="group bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`h-32 bg-gradient-to-r ${fund.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <fund.icon className="absolute bottom-4 right-4 w-12 h-12 text-white/30" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{fund.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">{fund.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Minimum:</span>
                      <span className="font-semibold text-[var(--color-text)]">KES {fund.minimum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Duration:</span>
                      <span className="font-semibold text-[var(--color-text)]">{fund.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Expected Return:</span>
                      <span className="font-semibold text-green-600">{fund.returnRate}</span>
                    </div>
                  </div>
                  <Link
                    href={`/membership/investments/${fund.id}`}
                    className="inline-flex items-center justify-center w-full gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Invest Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-gradient-to-r from-[var(--color-primary-alt)] to-[var(--color-primary)] rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of members who are building wealth through saving and investing
            </p>
            <Link
              href="/membership/register"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Import missing icon
function Truck(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 18a2 2 0 110 4 2 2 0 010-4zm0 0h8m-8 0v-4m0 0H5.5A1.5 1.5 0 014 12.5V10m16 8a2 2 0 110 4 2 2 0 010-4zm0 0h-4m0 0V6m0 0H9m7 0V4m0 0h2.5A1.5 1.5 0 0120 5.5V10m-7 0H4" />
    </svg>
  );
}