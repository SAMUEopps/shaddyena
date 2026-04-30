// app/admin/vendor-subscriptions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Crown,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Shield,
  Activity,
  Package,
  Star,
  Zap,
  Award,
  Flame,
  Gift,
  BarChart,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Smartphone,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface VendorSubscription {
  _id: string;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    referralCount: number;
    referralCode: string;
    createdAt: string;
  };
  tier: 'basic' | 'growth' | 'pro' | 'elite';
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'grace_period';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentHistory: {
    paymentId: string;
    planId: string;
    amount: number;
    paidAt: string;
    validUntil: string;
  }[];
  monthlyUsage: {
    todayDealsUsed: number;
    bestSellersUsed: number;
    newArrivalsUsed: number;
    clearanceUsed: number;
    giftCardsCreated: number;
    month: string;
    lastResetAt: string;
  };
  featuredProducts: {
    productId: string;
    category: string;
    featuredAt: string;
    expiresAt: string;
  }[];
  gracePeriodEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

const tierColors = {
  basic: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/30', icon: Star },
  growth: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', icon: TrendingUp },
  pro: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30', icon: Zap },
  elite: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30', icon: Award }
};

const statusColors = {
  active: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle },
  expired: { bg: 'bg-red-500/10', text: 'text-red-500', icon: XCircle },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: XCircle },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Clock },
  grace_period: { bg: 'bg-orange-500/10', text: 'text-orange-500', icon: AlertCircle }
};

export default function AdminVendorSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<VendorSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<VendorSubscription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    avgTier: 'basic',
    expiringSoon: 0,
    usageStats: {
      todayDeals: 0,
      bestSellers: 0,
      newArrivals: 0,
      clearance: 0,
      giftCards: 0
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/vendor-subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.vendorId?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.vendorId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.vendorId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.vendorId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesTier = tierFilter === 'all' || sub.tier === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  if (!user || user.role !== 'admin') {
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
                  <Users className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                  Vendor Subscriptions
                </h1>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Monitor and manage all vendor subscription plans and usage
              </p>
            </div>
            <button
              onClick={fetchSubscriptions}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Total Vendors</span>
              <Users className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalVendors}</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Active Subscriptions</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.activeSubscriptions}</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">KES {stats.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Avg. Tier</span>
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] capitalize">{stats.avgTier}</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Expiring Soon (7 days)</span>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.expiringSoon}</p>
          </div>
        </div>

        {/* Usage Summary */}
        <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl p-6 mb-8 border border-[var(--color-primary)]/20">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-primary)]" />
            Platform Usage Summary (Current Month)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.usageStats.todayDeals}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Today's Deals</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.usageStats.bestSellers}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Best Sellers</p>
            </div>
            <div className="text-center">
              <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.usageStats.newArrivals}</p>
              <p className="text-xs text-[var(--color-text-muted)]">New Arrivals</p>
            </div>
            <div className="text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.usageStats.clearance}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Clearance</p>
            </div>
            <div className="text-center">
              <Gift className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--color-text)]">{stats.usageStats.giftCards}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Gift Cards</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search by vendor name, email, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="grace_period">Grace Period</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="all">All Tiers</option>
              <option value="basic">Basic</option>
              <option value="growth">Growth</option>
              <option value="pro">Pro</option>
              <option value="elite">Elite</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Vendor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Plan</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Valid Until</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Usage</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {currentItems.map((sub) => {
                    const TierIcon = tierColors[sub.tier].icon;
                    const StatusIcon = statusColors[sub.status].icon;
                    const daysRemaining = getDaysRemaining(sub.endDate);
                    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
                    
                    return (
                      <tr key={sub._id} className="hover:bg-[var(--color-background)] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--color-text)]">
                              {sub.vendorId?.businessName || `${sub.vendorId?.firstName} ${sub.vendorId?.lastName}`}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">{sub.vendorId?.email}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{sub.vendorId?.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${tierColors[sub.tier].bg} ${tierColors[sub.tier].text}`}>
                            <TierIcon className="w-3 h-3" />
                            <span className="text-sm font-medium capitalize">{sub.tier}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${statusColors[sub.status].bg} ${statusColors[sub.status].text}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="text-sm capitalize">{sub.status.replace('_', ' ')}</span>
                          </div>
                          {sub.status === 'grace_period' && sub.gracePeriodEndsAt && (
                            <p className="text-xs text-orange-500 mt-1">
                              Grace until {new Date(sub.gracePeriodEndsAt).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-[var(--color-text)]">
                              {new Date(sub.endDate).toLocaleDateString()}
                            </p>
                            {isExpiringSoon && sub.status === 'active' && (
                              <p className="text-xs text-orange-500">{daysRemaining} days left</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span className="text-[var(--color-text-muted)]">{sub.monthlyUsage.todayDealsUsed}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-[var(--color-text-muted)]">{sub.monthlyUsage.bestSellersUsed}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedSubscription(sub);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-[var(--color-text-muted)]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-background)] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--color-background)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Subscription Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-[var(--color-surface)] rounded-lg"
              >
                <XCircle className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Vendor Info */}
              <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Business Name</p>
                    <p className="font-medium">{selectedSubscription.vendorId?.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Business Type</p>
                    <p className="font-medium">{selectedSubscription.vendorId?.businessType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Contact Person</p>
                    <p className="font-medium">{selectedSubscription.vendorId?.firstName} {selectedSubscription.vendorId?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                    <p className="font-medium">{selectedSubscription.vendorId?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Phone</p>
                    <p className="font-medium">{selectedSubscription.vendorId?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Referral Code</p>
                    <p className="font-mono text-sm">{selectedSubscription.vendorId?.referralCode}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Subscription Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Current Tier</p>
                    <p className="font-medium capitalize">{selectedSubscription.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Status</p>
                    <p className="font-medium capitalize">{selectedSubscription.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Auto Renew</p>
                    <p className="font-medium">{selectedSubscription.autoRenew ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Subscribed Since</p>
                    <p className="font-medium">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Payment History</h3>
                <div className="space-y-3">
                  {selectedSubscription.paymentHistory.map((payment, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[var(--color-background)] rounded-lg">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">KES {payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{new Date(payment.paidAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--color-text)]">Valid until:</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{new Date(payment.validUntil).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Usage */}
              <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Feature Usage (Current Month)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">{selectedSubscription.monthlyUsage.todayDealsUsed}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Today's Deals</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">{selectedSubscription.monthlyUsage.bestSellersUsed}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Best Sellers</p>
                  </div>
                  <div className="text-center">
                    <Package className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">{selectedSubscription.monthlyUsage.newArrivalsUsed}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">New Arrivals</p>
                  </div>
                  <div className="text-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">{selectedSubscription.monthlyUsage.clearanceUsed}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Clearance</p>
                  </div>
                  <div className="text-center">
                    <Gift className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">{selectedSubscription.monthlyUsage.giftCardsCreated}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Gift Cards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}