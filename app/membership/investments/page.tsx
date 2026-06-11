// app/membership/investments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Truck, Rocket, TrendingUp, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface InvestmentFund {
  _id: string;
  title: string;
  category: string;
  description: string;
  minimumInvestment: number;
  durationMonths: number;
  projectedReturnRate: number;
  totalFundTarget: number;
  currentFundAmount: number;
  fundedPercentage: number;
  status: string;
  features?: string[];
}

export default function InvestmentsPage() {
  const [funds, setFunds] = useState<InvestmentFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFund, setSelectedFund] = useState<InvestmentFund | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [investing, setInvesting] = useState(false);

  const categories = [
    { id: 'all', name: 'All Funds', icon: Shield },
    { id: 'marketing', name: 'Marketing', icon: Target },
    { id: 'transport', name: 'Transport', icon: Truck },
    { id: 'tech', name: 'Tech & Innovation', icon: Rocket },
    { id: 'startup', name: 'Business Startup', icon: TrendingUp },
  ];

  useEffect(() => {
    fetchFunds();
  }, [selectedCategory]);

  const fetchFunds = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/investments' 
        : `/api/investments?category=${selectedCategory}`;
      const response = await fetch(url);
      const data = await response.json();
      setFunds(data);
    } catch (error) {
      console.error('Error fetching funds:', error);
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!selectedFund) return;
    
    if (investmentAmount < selectedFund.minimumInvestment) {
      toast.error(`Minimum investment is KES ${selectedFund.minimumInvestment.toLocaleString()}`);
      return;
    }

    setInvesting(true);
    try {
      const response = await fetch('/api/investments/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundId: selectedFund._id,
          amount: investmentAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Investment failed');
      }

      toast.success(`Successfully invested KES ${investmentAmount.toLocaleString()} in ${selectedFund.title}`);
      setSelectedFund(null);
      fetchFunds();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setInvesting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing': return Target;
      case 'transport': return Truck;
      case 'tech': return Rocket;
      case 'startup': return TrendingUp;
      default: return Shield;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing': return 'from-blue-500 to-cyan-500';
      case 'transport': return 'from-green-500 to-emerald-500';
      case 'tech': return 'from-purple-500 to-pink-500';
      case 'startup': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-soft)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/member" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] mb-4">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Investment Marketplace</h1>
          <p className="text-[var(--color-text-muted)]">Grow your savings through our curated investment funds</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Funds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funds.map((fund) => {
            const Icon = getCategoryIcon(fund.category);
            const color = getCategoryColor(fund.category);
            const expectedReturn = (fund.minimumInvestment * fund.projectedReturnRate) / 100;
            
            return (
              <div key={fund._id} className="group bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`h-32 bg-gradient-to-r ${color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Icon className="absolute bottom-4 right-4 w-12 h-12 text-white/30" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                      {fund.durationMonths} Months
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{fund.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">{fund.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                      <span>Funding Progress</span>
                      <span>{Math.round(fund.fundedPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full transition-all duration-500"
                        style={{ width: `${fund.fundedPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Minimum:</span>
                      <span className="font-semibold text-[var(--color-text)]">KES {fund.minimumInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Expected Return:</span>
                      <span className="font-semibold text-green-600">{fund.projectedReturnRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Example Return:</span>
                      <span className="font-semibold text-[var(--color-text)]">KES {expectedReturn.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedFund(fund)}
                    className="inline-flex items-center justify-center w-full gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Invest Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {funds.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No investment funds available</h3>
            <p className="text-[var(--color-text-muted)]">Check back later for new opportunities</p>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {selectedFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--color-text])">Invest in {selectedFund.title}</h2>
              <button
                onClick={() => setSelectedFund(null)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-[var(--color-background-soft)] rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[var(--color-text-muted)]">Minimum Investment:</span>
                <span className="font-semibold">KES {selectedFund.minimumInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Expected Return:</span>
                <span className="font-semibold text-green-600">{selectedFund.projectedReturnRate}%</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Investment Amount (KES)
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(selectedFund.minimumInvestment, parseInt(e.target.value) || 0))}
                min={selectedFund.minimumInvestment}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            
            <div className="mb-4 p-3 bg-blue-500/10 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-600">
                  Funds will be locked for {selectedFund.durationMonths} months. 
                  Expected returns will be paid at maturity.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFund(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                disabled={investing}
                className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                {investing ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}