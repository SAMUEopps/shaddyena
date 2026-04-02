'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Store,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  MessageCircle,
  Activity,
  Building2,
  DollarSign,
  UserCheck,
  UserX,
  BadgeCheck,
  Sparkles,
  Briefcase,
  MapPin,
  FileText,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Star,
  Zap
} from 'lucide-react';

interface SellerRequest {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  businessName: string;
  businessType: string;
  mpesaNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface StatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalBusinesses: number;
  uniqueBusinessTypes: number;
  approvalRate: number;
}

export default function SellerRequestsTab() {
  const { user: currentUser } = useAuth();
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalBusinesses: 0,
    uniqueBusinessTypes: 0,
    approvalRate: 0
  });

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, pagination.page, search]);

  const fetchRequests = async () => {
    if (currentUser?.role !== 'admin') return;
    
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        status: statusFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/admin/seller-requests?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setPagination({
          ...data.pagination,
          hasNext: data.pagination.page < data.pagination.pages,
          hasPrev: data.pagination.page > 1
        });
        calculateStats(data.requests, data.pagination.total);
      } else {
        throw new Error('Failed to fetch seller requests');
      }
    } catch (error) {
      console.error('Error fetching seller requests:', error);
      setError('Failed to load seller requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (requestsList: SellerRequest[], total: number) => {
    const businessTypes = new Set(requestsList.map(r => r.businessType));
    const approved = requestsList.filter(r => r.status === 'approved').length;
    
    setStats({
      total: total,
      pending: requestsList.filter(r => r.status === 'pending').length,
      approved: approved,
      rejected: requestsList.filter(r => r.status === 'rejected').length,
      totalBusinesses: requestsList.length,
      uniqueBusinessTypes: businessTypes.size,
      approvalRate: total > 0 ? (approved / total) * 100 : 0
    });
  };

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(requestId);
      
      const response = await fetch(`/api/admin/seller-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...(action === 'reject' && { rejectionReason: rejectReason })
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchRequests();
        setRejectingId(null);
        setRejectReason('');
        setShowDetailsModal(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process request');
      }
    } catch (error: any) {
      console.error('Error processing request:', error);
      setError(error.message || 'Failed to process request');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessing(null);
    }
  };

  const handleViewDetails = (request: SellerRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: <Clock className="w-3 h-3" />, label: 'Pending' };
      case 'approved':
        return { bg: 'bg-green-500/10', text: 'text-green-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Approved' };
      case 'rejected':
        return { bg: 'bg-red-500/10', text: 'text-red-600', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', icon: <AlertCircle className="w-3 h-3" />, label: status };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
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
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl animate-bounce-subtle">
                <Store className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Seller Requests</h1>
                <p className="text-[var(--color-text-muted)]">Review and manage vendor applications</p>
              </div>
            </div>
            <button
              onClick={() => fetchRequests()}
              className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 w-fit"
            >
              <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Store className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              <span className="text-xs text-[var(--color-text-muted)]">Total</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Requests</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-amber-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Pending</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.pending}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Awaiting review</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-green-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Approved</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.approved}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Vendors added</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-red-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.rejected}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Declined</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-blue-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Businesses</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.totalBusinesses}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total applicants</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-purple-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Types</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.uniqueBusinessTypes}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Business types</p>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] hover:border-emerald-500 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-[var(--color-text-muted)]">Rate</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.approvalRate.toFixed(1)}%</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Approval rate</p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="mb-8 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
                <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Review Queue</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stats.pending} pending request{stats.pending !== 1 ? 's' : ''} waiting for your review
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Approved</p>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Rejected</p>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Pending</p>
              </div>
            </div>
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
                placeholder="Search by business name, user name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="w-full lg:w-64">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--color-text-muted)]">Loading seller requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Store className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">No seller requests found.</p>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all"
              >
                View All Requests
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => {
                const statusBadge = getStatusBadge(request.status);
                
                return (
                  <div
                    key={request._id}
                    className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20 p-6 pb-12">
                      <div className="flex justify-end">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 backdrop-blur-md ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </div>
                      </div>
                      
                      {/* User Avatar */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] border-4 border-[var(--color-surface)] shadow-lg overflow-hidden">
                          {request.user.avatar ? (
                            <img
                              src={request.user.avatar}
                              alt={`${request.user.firstName} ${request.user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {request.user.firstName.charAt(0)}{request.user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-12 p-4">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {request.businessName}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-600">
                            <Briefcase className="w-3 h-3" />
                            <span>{request.businessType}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>{request.user.firstName} {request.user.lastName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{request.user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{request.user.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <span>{request.mpesaNumber}</span>
                        </div>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-4 p-2 bg-[var(--color-background-soft)] rounded-lg">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Requested: {formatDate(request.createdAt)}</span>
                        </div>
                        {request.reviewedAt && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Reviewed: {formatDate(request.reviewedAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Review Info */}
                      {request.reviewedBy && (
                        <div className="mb-4 p-2 bg-[var(--color-background-soft)] rounded-lg">
                          <p className="text-xs text-[var(--color-text-muted)] text-center">
                            Reviewed by {request.reviewedBy.firstName} {request.reviewedBy.lastName}
                          </p>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="flex-1 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-primary)]/10 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View Details</span>
                        </button>
                        
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(request._id, 'approve')}
                              disabled={processing === request._id}
                              className="flex-1 p-2 text-green-600 hover:bg-green-500/10 transition-colors rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              {processing === request._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-green-600"></div>
                              ) : (
                                <>
                                  <ThumbsUp className="w-4 h-4" />
                                  <span className="text-sm">Approve</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setRejectingId(request._id)}
                              disabled={processing === request._id}
                              className="flex-1 p-2 text-red-600 hover:bg-red-500/10 transition-colors rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span className="text-sm">Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrev}
                    className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                  <span className="px-4 py-2 text-sm text-[var(--color-text)]">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNext}
                    className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] px-6 py-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/50 shadow-lg overflow-hidden">
                    {selectedRequest.user.avatar ? (
                      <img
                        src={selectedRequest.user.avatar}
                        alt={`${selectedRequest.user.firstName} ${selectedRequest.user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {selectedRequest.user.firstName.charAt(0)}{selectedRequest.user.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{selectedRequest.businessName}</h2>
                    <p className="text-sm opacity-90">{selectedRequest.businessType}</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                {/* Status */}
                <div className="mb-6 flex justify-center">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                    selectedRequest.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                    selectedRequest.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {selectedRequest.status === 'pending' && <Clock className="w-4 h-4" />}
                    {selectedRequest.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                    {selectedRequest.status === 'rejected' && <XCircle className="w-4 h-4" />}
                    <span>{selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Information */}
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>User Information</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Name:</span> {selectedRequest.user.firstName} {selectedRequest.user.lastName}</p>
                      <p><span className="text-[var(--color-text-muted)]">Email:</span> {selectedRequest.user.email}</p>
                      <p><span className="text-[var(--color-text-muted)]">Phone:</span> {selectedRequest.user.phone}</p>
                    </div>
                  </div>
                  
                  {/* Business Information */}
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-3 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Business Information</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[var(--color-text-muted)]">Business Name:</span> {selectedRequest.businessName}</p>
                      <p><span className="text-[var(--color-text-muted)]">Business Type:</span> {selectedRequest.businessType}</p>
                      <p><span className="text-[var(--color-text-muted)]">M-Pesa Number:</span> {selectedRequest.mpesaNumber}</p>
                    </div>
                  </div>
                </div>
                
                {/* Request Dates */}
                <div className="mt-6 p-4 bg-[var(--color-background-soft)] rounded-xl">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--color-text-muted)]">Requested On</p>
                      <p className="font-medium text-[var(--color-text)]">{formatDateTime(selectedRequest.createdAt)}</p>
                    </div>
                    {selectedRequest.reviewedAt && (
                      <div>
                        <p className="text-[var(--color-text-muted)]">Reviewed On</p>
                        <p className="font-medium text-[var(--color-text)]">{formatDateTime(selectedRequest.reviewedAt)}</p>
                      </div>
                    )}
                  </div>
                  {selectedRequest.reviewedBy && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                      <p className="text-[var(--color-text-muted)] text-sm">Reviewed By</p>
                      <p className="font-medium text-[var(--color-text)]">{selectedRequest.reviewedBy.firstName} {selectedRequest.reviewedBy.lastName}</p>
                    </div>
                  )}
                </div>
                
                {/* Rejection Reason */}
                {selectedRequest.rejectionReason && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h3 className="font-semibold text-red-600 mb-2 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Rejection Reason</span>
                    </h3>
                    <p className="text-sm text-[var(--color-text)]">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
                
                {/* Modal Actions */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setRejectingId(selectedRequest._id);
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center space-x-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest._id, 'approve')}
                      disabled={processing === selectedRequest._id}
                      className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center space-x-2 disabled:opacity-50"
                    >
                      {processing === selectedRequest._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      ) : (
                        <>
                          <ThumbsUp className="w-4 h-4" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
            setRejectingId(null);
            setRejectReason('');
          }}></div>
          
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-[var(--color-surface)] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4">
                  <MessageSquare className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Rejection Reason</h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-4">
                    Please provide a reason for rejecting this seller request.
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all resize-none"
                    rows={4}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-[var(--color-background-soft)] flex space-x-3">
                <button
                  onClick={() => {
                    setRejectingId(null);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:bg-[var(--color-background)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(rejectingId, 'reject')}
                  disabled={!rejectReason.trim() || processing === rejectingId}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {processing === rejectingId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="w-4 h-4" />
                      <span>Confirm Reject</span>
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