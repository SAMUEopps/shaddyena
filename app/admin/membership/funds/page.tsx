// app/admin/membership/funds/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  Target,
  Truck,
  Rocket,
  Shield,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Fund {
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
  remainingAmount: number;
  status: string;
  features: string[];
  createdAt: string;
}

export default function AdminFundsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [showFundModal, setShowFundModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'marketing',
    description: '',
    longDescription: '',
    minimumInvestment: 5000,
    durationMonths: 12,
    projectedReturnRate: 15,
    totalFundTarget: 1000000,
    features: [] as string[],
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch('/api/admin/investments/funds');
      if (!response.ok) {
        if (response.status === 403) {
          router.push('/membership/login');
          return;
        }
        throw new Error('Failed to fetch funds');
      }
      const data = await response.json();
      setFunds(data.funds);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching funds:', error);
      toast.error('Failed to load funds');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/investments/funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create fund');
      }

      toast.success('Investment fund created successfully');
      setShowCreateModal(false);
      setFormData({
        title: '',
        category: 'marketing',
        description: '',
        longDescription: '',
        minimumInvestment: 5000,
        durationMonths: 12,
        projectedReturnRate: 15,
        totalFundTarget: 1000000,
        features: [],
      });
      fetchFunds();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing': return Target;
      case 'transport': return Truck;
      case 'tech': return Rocket;
      default: return TrendingUp;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing': return 'from-blue-500 to-cyan-500';
      case 'transport': return 'from-green-500 to-emerald-500';
      case 'tech': return 'from-purple-500 to-pink-500';
      default: return 'from-orange-500 to-red-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding': return 'bg-blue-500/10 text-blue-600';
      case 'active': return 'bg-green-500/10 text-green-600';
      case 'closed': return 'bg-yellow-500/10 text-yellow-600';
      case 'completed': return 'bg-purple-500/10 text-purple-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading funds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-soft)]">
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/membership" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Investment Funds</h1>
                <p className="text-sm text-[var(--color-text-muted)]">Manage investment opportunities</p>
              </div>
            </div>
            {/*<button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Fund
            </button>*/}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Funds</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalFunds}</p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Active Funds</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.activeFunds}</p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Target</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">KES {stats.totalTarget.toLocaleString()}</p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Raised</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">KES {stats.totalRaised.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Funds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funds.map((fund) => {
            const Icon = getCategoryIcon(fund.category);
            const color = getCategoryColor(fund.category);
            return (
              <div key={fund._id} className="bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-xl transition-all duration-300">
                <div className={`h-32 bg-gradient-to-r ${color} relative overflow-hidden`}>
                  <Icon className="absolute bottom-4 right-4 w-12 h-12 text-white/30" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(fund.status)}`}>
                      {fund.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{fund.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">{fund.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Minimum:</span>
                      <span className="font-semibold">KES {fund.minimumInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Duration:</span>
                      <span className="font-semibold">{fund.durationMonths} Months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Return:</span>
                      <span className="font-semibold text-green-600">{fund.projectedReturnRate}%</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                      <span>Progress</span>
                      <span>{Math.round(fund.fundedPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, fund.fundedPercentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFund(fund);
                        setShowFundModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-background-soft)] text-[var(--color-text)] px-3 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-background)] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        // Edit fund
                        //toast.info('Edit functionality coming soon');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create Fund Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">Create Investment Fund</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFund} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Fund Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g., Marketing Fund 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="marketing">Marketing</option>
                  <option value="transport">Transport</option>
                  <option value="tech">Tech & Innovation</option>
                  <option value="startup">Business Startup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Describe the fund's purpose..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Min Investment (KES) *
                  </label>
                  <input
                    type="number"
                    value={formData.minimumInvestment}
                    onChange={(e) => setFormData({ ...formData, minimumInvestment: parseInt(e.target.value) || 0 })}
                    required
                    min={1000}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Duration (Months) *
                  </label>
                  <input
                    type="number"
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 0 })}
                    required
                    min={1}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Return Rate (%) *
                  </label>
                  <input
                    type="number"
                    value={formData.projectedReturnRate}
                    onChange={(e) => setFormData({ ...formData, projectedReturnRate: parseFloat(e.target.value) || 0 })}
                    required
                    min={0}
                    max={100}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Fund Target (KES) *
                  </label>
                  <input
                    type="number"
                    value={formData.totalFundTarget}
                    onChange={(e) => setFormData({ ...formData, totalFundTarget: parseInt(e.target.value) || 0 })}
                    required
                    min={10000}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Create Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Detail Modal */}
      {showFundModal && selectedFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">{selectedFund.title}</h2>
              <button
                onClick={() => setShowFundModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Category</p>
                  <p className="font-medium text-[var(--color-text)] capitalize">{selectedFund.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedFund.status)}`}>
                    {selectedFund.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Minimum Investment</p>
                  <p className="font-medium text-[var(--color-text)]">KES {selectedFund.minimumInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Duration</p>
                  <p className="font-medium text-[var(--color-text)]">{selectedFund.durationMonths} Months</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Return Rate</p>
                  <p className="font-medium text-green-600">{selectedFund.projectedReturnRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Progress</p>
                  <p className="font-medium text-[var(--color-text)]">{Math.round(selectedFund.fundedPercentage)}%</p>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4">
                <h3 className="font-semibold text-[var(--color-text)] mb-2">Description</h3>
                <p className="text-[var(--color-text-muted)]">{selectedFund.description}</p>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4">
                <h3 className="font-semibold text-[var(--color-text)] mb-2">Funding Progress</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--color-text-muted)]">Raised: KES {selectedFund.currentFundAmount.toLocaleString()}</span>
                  <span className="text-[var(--color-text-muted)]">Target: KES {selectedFund.totalFundTarget.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, selectedFund.fundedPercentage)}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Remaining: KES {selectedFund.remainingAmount.toLocaleString()}
                </p>
              </div>

              {selectedFund.features && selectedFund.features.length > 0 && (
                <div className="border-t border-[var(--color-border)] pt-4">
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedFund.features.map((feature, idx) => (
                      <li key={idx} className="text-[var(--color-text-muted)]">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-[var(--color-border)] pt-4 flex gap-3">
                <button
                  onClick={() => setShowFundModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}