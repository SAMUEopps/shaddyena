'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Store,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Users,
  Building2,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Navigation,
  DollarSign,
  Package,
  TrendingUp,
  Edit,
  MoreVertical,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Zap,
  Verified,
  Unlock,
  Lock,
  Home,
  Briefcase,
  Truck,
  Crown,
  Activity,
  BarChart3,
  Settings,
  EyeOff
} from 'lucide-react';

interface Shop {
  _id: string;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  operatingHours: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  rating?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalShops: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface StatsData {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  totalVendors: number;
  shopsWithProducts: number;
  avgRating: number;
}

export default function ShopsTab() {
  const { user: currentUser } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Pagination and filter states
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalShops: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    totalVendors: 0,
    shopsWithProducts: 0,
    avgRating: 0
  });

  const fetchShops = async (page = 1) => {
    if (currentUser?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      
      if (search) params.append('search', search);
      if (cityFilter) params.append('city', cityFilter);
      
      const response = await fetch(`/api/shops?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch shops');
      }
      
      const data = await response.json();
      setShops(data.shops);
      setPagination(data.pagination);
      
      // Calculate stats
      calculateStats(data.shops, data.pagination.totalShops);
      
      setError('');
    } catch (err) {
      setError('Failed to load shops. Please try again.');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (shopsList: Shop[], total: number) => {
    setStats({
      total: total,
      active: shopsList.filter(s => s.isActive).length,
      inactive: shopsList.filter(s => !s.isActive).length,
      verified: shopsList.filter(s => s.isVerified).length,
      unverified: shopsList.filter(s => !s.isVerified).length,
      totalVendors: shopsList.filter(s => s.vendorId).length,
      shopsWithProducts: 0, // Would need separate API call
      avgRating: shopsList.reduce((acc, s) => acc + (s.rating?.average || 0), 0) / (shopsList.length || 1)
    });
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchShops();
    }
  }, [currentUser, search, cityFilter]);

  const handleToggleActive = async (shopId: string, currentActive: boolean) => {
    const action = currentActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this shop?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      
      if (response.ok) {
        setSuccessMessage(`Shop ${action}d successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchShops(pagination.currentPage);
      } else {
        throw new Error('Failed to update shop status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update shop status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleVerify = async (shopId: string, currentVerified: boolean) => {
    const action = currentVerified ? 'unverify' : 'verify';
    if (!confirm(`Are you sure you want to ${action} this shop?`)) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      
      if (response.ok) {
        setSuccessMessage(`Shop ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchShops(pagination.currentPage);
      } else {
        throw new Error('Failed to update verification status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (shop: Shop) => {
    setSelectedShop(shop);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedShop) return;
    
    setDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/shops/${selectedShop._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Shop deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchShops(pagination.currentPage);
        setShowDeleteModal(false);
        setSelectedShop(null);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete shop');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete shop');
      console.error('Error deleting shop:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return { bg: 'bg-green-500/10', text: 'text-green-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Active' };
    }
    return { bg: 'bg-red-500/10', text: 'text-red-600', icon: <XCircle className="w-3 h-3" />, label: 'Inactive' };
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: <Verified className="w-3 h-3" />, label: 'Verified' };
    }
    return { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: <AlertCircle className="w-3 h-3" />, label: 'Unverified' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
        ))}
      </div>
    );
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Access Denied</h2>
          <p className="text-[var(--color-text-muted)]">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl">
                <Store className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Shop Management</h1>
                <p className="text-[var(--color-text-muted)]">Manage and monitor all vendor shops on the platform</p>
              </div>
            </div>
            <button
              onClick={() => fetchShops(pagination.currentPage)}
              className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 w-fit"
            >
              <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Store className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Shops</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.active}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active shops</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.inactive}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Inactive shops</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Verified className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Verified</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.verified}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Verified shops</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-amber-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Unverified</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.unverified}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Need review</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-purple-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Vendors</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalVendors}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active vendors</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-orange-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Products</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">--</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total products</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-yellow-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Rating</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.avgRating.toFixed(1)}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Average rating</p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search shops by name, description, or business type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            {/* City Filter */}
            <div className="w-full lg:w-64 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
            >
              <Filter className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text)]">More Filters</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[var(--color-border)] animate-slide-in">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Verification</label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setVerificationFilter('');
                  }}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Shops Grid */}
        {error && (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--color-text-muted)]">Loading shops...</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Store className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">No shops found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops.map((shop) => {
                const statusBadge = getStatusBadge(shop.isActive);
                const verificationBadge = getVerificationBadge(shop.isVerified);
                
                return (
                  <div
                    key={shop._id}
                    className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    {/* Banner Area */}
                    <div className="relative h-32 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20">
                      {shop.banner ? (
                        <img
                          src={shop.banner}
                          alt={shop.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="w-12 h-12 text-[var(--color-primary)]/40" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </div>
                      </div>
                      
                      {/* Logo */}
                      <div className="absolute -bottom-8 left-4">
                        <div className="w-16 h-16 rounded-xl bg-[var(--color-surface)] border-4 border-[var(--color-border)] overflow-hidden shadow-lg">
                          {shop.logo ? (
                            <img
                              src={shop.logo}
                              alt={shop.businessName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center">
                              <span className="text-white font-bold text-xl">
                                {shop.businessName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-10 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                            {shop.businessName}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)]">{shop.businessType}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getRatingStars(shop.rating?.average || 0)}
                          <span className="text-xs text-[var(--color-text-muted)] ml-1">
                            ({shop.rating?.count || 0})
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
                        {shop.description || 'No description provided'}
                      </p>
                      
                      {/* Location */}
                      <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)] mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{shop.location.city}, {shop.location.country}</span>
                      </div>
                      
                      {/* Vendor Info */}
                      <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)] mb-3">
                        <Users className="w-3 h-3" />
                        <span>{shop.vendorId?.firstName} {shop.vendorId?.lastName}</span>
                      </div>
                      
                      {/* Verification Badge */}
                      <div className="mb-4">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${verificationBadge.bg} ${verificationBadge.text}`}>
                          {verificationBadge.icon}
                          <span>{verificationBadge.label}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(shop)}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(shop._id, shop.isActive)}
                            className={`p-2 transition-colors rounded-lg ${
                              shop.isActive 
                                ? 'text-red-500 hover:bg-red-500/10' 
                                : 'text-green-500 hover:bg-green-500/10'
                            }`}
                            title={shop.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {shop.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleVerify(shop._id, shop.isVerified)}
                            className={`p-2 transition-colors rounded-lg ${
                              shop.isVerified 
                                ? 'text-amber-500 hover:bg-amber-500/10' 
                                : 'text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={shop.isVerified ? 'Unverify' : 'Verify'}
                          >
                            {shop.isVerified ? <AlertCircle className="w-4 h-4" /> : <Verified className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(shop)}
                            className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                            title="Delete Shop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(shop.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {shops.length} of {pagination.totalShops} shops
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchShops(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchShops(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Shop Details Modal */}
      {showDetailsModal && selectedShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {/* Modal Header with Banner */}
              <div className="relative h-48 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)]">
                {selectedShop.banner && (
                  <img
                    src={selectedShop.banner}
                    alt={selectedShop.businessName}
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-2xl bg-[var(--color-surface)] border-4 border-[var(--color-border)] overflow-hidden shadow-xl">
                    {selectedShop.logo ? (
                      <img
                        src={selectedShop.logo}
                        alt={selectedShop.businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {selectedShop.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="pt-16 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text)]">{selectedShop.businessName}</h2>
                    <p className="text-[var(--color-text-muted)]">{selectedShop.businessType}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${selectedShop.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                      {selectedShop.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{selectedShop.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${selectedShop.isVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {selectedShop.isVerified ? <Verified className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{selectedShop.isVerified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Shop Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Vendor Information */}
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-4">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Vendor Information</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Name:</span> {selectedShop.vendorId?.firstName} {selectedShop.vendorId?.lastName}</p>
                      <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedShop.vendorId?.email}</p>
                      <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedShop.vendorId?.phone}</p>
                    </div>
                  </div>
                  
                  {/* Location Information */}
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-4">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Location</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Address:</span> {selectedShop.location.address}</p>
                      <p><span className="text-[var(--color-text-muted)]">City:</span> {selectedShop.location.city}</p>
                      <p><span className="text-[var(--color-text-muted)]">Country:</span> {selectedShop.location.country}</p>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-[var(--color-background-soft)] rounded-xl p-4">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Contact</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedShop.contact.phone}</p>
                      <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedShop.contact.email}</p>
                    </div>
                  </div>
                  
                  {/* Social Media */}
                  {selectedShop.socialMedia && Object.values(selectedShop.socialMedia).some(v => v) && (
                    <div className="bg-[var(--color-background-soft)] rounded-xl p-4">
                      <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-[var(--color-primary)]" />
                        <span>Social Media</span>
                      </h3>
                      <div className="flex space-x-3">
                        {selectedShop.socialMedia.facebook && (
                          <a href={selectedShop.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {selectedShop.socialMedia.instagram && (
                          <a href={selectedShop.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:opacity-80">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {selectedShop.socialMedia.twitter && (
                          <a href={selectedShop.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:opacity-80">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {selectedShop.socialMedia.youtube && (
                          <a href={selectedShop.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:opacity-80">
                            <Youtube className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                {selectedShop.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-2">About</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{selectedShop.description}</p>
                  </div>
                )}
                
                {/* Operating Hours */}
                {selectedShop.operatingHours && selectedShop.operatingHours.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Operating Hours</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {selectedShop.operatingHours.map((hour, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-[var(--color-text-muted)]">{hour.day}:</span>
                          <span className="text-[var(--color-text)]">
                            {hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background-soft)] transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.open(`/shop/${selectedShop._id}`, '_blank');
                    }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Shop</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <AlertCircle className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Delete Shop</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">{selectedShop.businessName}</span>?
                  </p>
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-600">
                      <strong>Warning:</strong> This action cannot be undone. All products and data associated with this shop will be permanently deleted.
                    </p>
                  </div>
                  {deleteError && (
                    <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                      <p className="text-sm text-red-600">{deleteError}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-[var(--color-background-soft)] flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background)] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Shop</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}