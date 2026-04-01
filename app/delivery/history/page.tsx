// app/delivery/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Package,
  MapPin,
  Store,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  Award,
  CalendarDays,
  ChevronRight,
  User,
  Phone,
  Receipt,
  FileText
} from 'lucide-react';

interface DeliveryHistory {
  _id: string;
  orderId: string;
  createdAt: string;
  completedAt?: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
  };
  suborders: {
    _id: string;
    vendorId: string;
    shopId: string;
    status: 'DELIVERED' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
    deliveryFee: number;
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: string;
      notes?: string;
      confirmationCode?: string;
      confirmedAt?: string;
      riderConfirmedAt?: string;
      actualTime?: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    amount: number;
    completedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
  }[];
}

interface VendorInfo {
  _id: string;
  businessName: string;
  phone: string;
  address: string;
}

interface DeliveryResponse {
  deliveries: DeliveryHistory[];
  totalPages: number;
  currentPage: number;
  total: number;
  totalEarnings: number;
}

type DateFilter = 'today' | 'week' | 'month' | 'all';
type StatusFilter = 'all' | 'DELIVERED' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';

export default function DeliveryHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [deliveries, setDeliveries] = useState<DeliveryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorInfo, setVendorInfo] = useState<Record<string, VendorInfo>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
  
  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Date range picker for custom ranges
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchDeliveryHistory();
    }
  }, [user, currentPage, dateFilter, statusFilter]);

  const fetchDeliveryHistory = async () => {
    if (!user || user.role !== 'delivery') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: 'completed' // Get completed deliveries only
      });
      
      // Add date filter
      if (dateFilter !== 'all') {
        queryParams.append('dateFilter', dateFilter);
      }
      
      // Add status filter
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      // Add search query
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/delivery/rider/history?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch delivery history');
      }
      
      const data: DeliveryResponse = await response.json();
      setDeliveries(data.deliveries);
      setTotalPages(data.totalPages);
      setTotalDeliveries(data.total);
      setTotalEarnings(data.totalEarnings);
      
      // Fetch vendor info for each delivery
      await fetchVendorInfo(data.deliveries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendorInfo = async (deliveries: DeliveryHistory[]) => {
    const vendorIds = new Set<string>();
    deliveries.forEach(delivery => {
      delivery.suborders.forEach(suborder => {
        vendorIds.add(suborder.vendorId);
      });
    });

    const vendorInfoMap: Record<string, VendorInfo> = {};
    
    for (const vendorId of vendorIds) {
      try {
        const response = await fetch(`/api/vendors/${vendorId}`);
        if (response.ok) {
          const data = await response.json();
          vendorInfoMap[vendorId] = {
            _id: data._id,
            businessName: data.businessName,
            phone: data.phone,
            address: data.address
          };
        }
      } catch (error) {
        console.error(`Failed to fetch vendor ${vendorId}:`, error);
      }
    }
    
    setVendorInfo(vendorInfoMap);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    setCurrentPage(1);
    setShowDatePicker(false);
  };

  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      // In a real implementation, you'd make an API call with custom dates
      setDateFilter('all');
      // setCustomDateRange({ start: startDate, end: endDate });
      fetchDeliveryHistory();
      setShowDatePicker(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'DELIVERED': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'FAILED': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'DELIVERED': return <Package className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'Confirmed';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      case 'FAILED': return 'Failed';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleExpand = (deliveryId: string) => {
    if (expandedDelivery === deliveryId) {
      setExpandedDelivery(null);
    } else {
      setExpandedDelivery(deliveryId);
    }
  };

  const exportToCSV = () => {
    // Prepare CSV data
    const headers = ['Order ID', 'Date', 'Vendor', 'Status', 'Delivery Fee', 'Items', 'Pickup Location', 'Dropoff Location'];
    const rows = deliveries.flatMap(delivery => 
      delivery.suborders.map(suborder => [
        delivery.orderId,
        formatDate(delivery.createdAt),
        vendorInfo[suborder.vendorId]?.businessName || 'Unknown',
        getStatusText(suborder.status),
        suborder.deliveryFee.toString(),
        suborder.items.length.toString(),
        suborder.deliveryDetails?.pickupAddress || vendorInfo[suborder.vendorId]?.address || 'N/A',
        suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address
      ])
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export started!');
  };

  // Filter deliveries based on search (client-side for instant filtering)
  const filteredDeliveries = deliveries.filter(delivery => {
    if (!searchQuery) return true;
    return delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Clock className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Delivery History
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Track and review your completed deliveries
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Package className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">{totalDeliveries} Total Deliveries</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">{formatCurrency(totalEarnings)} Total Earned</span>
              </div>
              <button
                onClick={fetchDeliveryHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {deliveries.reduce((count, d) => 
                count + d.suborders.filter(s => s.status === 'DELIVERED' || s.status === 'CONFIRMED').length, 0
              )}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Successful Deliveries</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {deliveries.reduce((count, d) => 
                count + d.suborders.filter(s => s.status === 'CANCELLED' || s.status === 'FAILED').length, 0
              )}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Cancelled/Failed</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {formatCurrency(totalEarnings)}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Earnings</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {deliveries.length > 0 ? Math.round(totalEarnings / deliveries.length) : 0}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Avg. Earnings/Delivery</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search by Order ID..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all"
              >
                <Calendar className="w-5 h-5 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text)]">
                  {dateFilter === 'today' ? 'Today' : 
                   dateFilter === 'week' ? 'This Week' : 
                   dateFilter === 'month' ? 'This Month' : 'All Time'}
                </span>
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
              </button>
              
              {showDatePicker && (
                <div className="absolute top-full mt-2 right-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg z-10 p-4 min-w-[200px]">
                  <button
                    onClick={() => handleDateFilterChange('today')}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleDateFilterChange('week')}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => handleDateFilterChange('month')}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => handleDateFilterChange('all')}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--color-background-soft)] rounded-lg transition-colors"
                  >
                    All Time
                  </button>
                  <div className="border-t border-[var(--color-border)] my-2 pt-2">
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm"
                      />
                      <button
                        onClick={handleCustomDateRange}
                        className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-hover)]"
                      >
                        Apply Range
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <option value="all">All Status</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || dateFilter !== 'all' || statusFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <span className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full text-sm">
                  <span>Search: {searchQuery}</span>
                  <button onClick={handleClearSearch} className="hover:text-[var(--color-primary)]">×</button>
                </span>
              )}
              {dateFilter !== 'all' && (
                <span className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full text-sm">
                  <span>{dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month'}</span>
                  <button onClick={() => handleDateFilterChange('all')} className="hover:text-[var(--color-primary)]">×</button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full text-sm">
                  <span>{getStatusText(statusFilter)}</span>
                  <button onClick={() => setStatusFilter('all')} className="hover:text-[var(--color-primary)]">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Deliveries List */}
        {filteredDeliveries.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Package className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No Delivery History</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              You haven't completed any deliveries yet.
            </p>
            <Link
              href="/delivery/assignments"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              <Truck className="w-5 h-5" />
              <span>View Active Deliveries</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 overflow-hidden"
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpand(delivery._id)}
                  className="p-6 cursor-pointer hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                        <Package className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text)]">Order #{delivery.orderId}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-[var(--color-text-muted)]" />
                          <span className="text-xs text-[var(--color-text-muted)]">{formatDate(delivery.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-[var(--color-text)]">
                          {formatCurrency(delivery.suborders.reduce((sum, s) => sum + s.deliveryFee, 0))}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(delivery.suborders[0]?.status)}`}>
                        {getStatusIcon(delivery.suborders[0]?.status)}
                        <span>{getStatusText(delivery.suborders[0]?.status)}</span>
                      </div>
                      {expandedDelivery === delivery._id ? (
                        <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedDelivery === delivery._id && (
                  <div className="border-t border-[var(--color-border)] p-6 bg-[var(--color-background-soft)]/30 animate-slide-in">
                    {delivery.suborders.map((suborder, idx) => {
                      const vendor = vendorInfo[suborder.vendorId];
                      return (
                        <div key={suborder._id} className="space-y-4">
                          {/* Vendor Info */}
                          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Store className="w-5 h-5 text-[var(--color-primary)]" />
                                <div>
                                  <p className="font-medium text-[var(--color-text)]">{vendor?.businessName || 'Vendor Store'}</p>
                                  <p className="text-sm text-[var(--color-text-muted)]">{vendor?.address}</p>
                                </div>
                              </div>
                              {vendor?.phone && (
                                <button
                                  onClick={() => window.open(`tel:${vendor.phone}`)}
                                  className="flex items-center space-x-1 text-sm text-[var(--color-primary)] hover:underline"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Call</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Delivery Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-[var(--color-text)]">Pickup Location</p>
                                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                    {suborder.deliveryDetails?.pickupAddress || vendor?.address || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-[var(--color-text)]">Dropoff Location</p>
                                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                    {suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address}
                                  </p>
                                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    {delivery.shipping.city}, {delivery.shipping.country}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                            <p className="font-medium text-[var(--color-text)] mb-3">Order Items</p>
                            <div className="space-y-2">
                              {suborder.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex justify-between items-center py-2 border-b border-[var(--color-border)] last:border-0">
                                  <div className="flex items-center space-x-3">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                    ) : (
                                      <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-[var(--color-primary)]" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm text-[var(--color-text)]">{item.name}</p>
                                      <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <span className="text-sm font-medium text-[var(--color-text)]">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex justify-between">
                              <span className="text-sm font-medium text-[var(--color-text)]">Subtotal</span>
                              <span className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(suborder.amount)}</span>
                            </div>
                          </div>

                          {/* Delivery Timeline */}
                          {suborder.deliveryDetails?.actualTime && (
                            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                              <div className="flex items-center space-x-2 mb-3">
                                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                                <span className="text-sm font-medium text-[var(--color-text)]">Delivery Timeline</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-[var(--color-text-muted)]">Order Placed</span>
                                  <span className="text-[var(--color-text)]">{formatDate(delivery.createdAt)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-[var(--color-text-muted)]">Delivered</span>
                                  <span className="text-[var(--color-text)]">{formatDate(suborder.deliveryDetails.actualTime)}</span>
                                </div>
                                {suborder.deliveryDetails.confirmedAt && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-text-muted)]">Confirmed by Customer</span>
                                    <span className="text-[var(--color-text)]">{formatDate(suborder.deliveryDetails.confirmedAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Cancellation Reason (if applicable) */}
                          {(suborder.status === 'CANCELLED' || suborder.status === 'FAILED') && suborder.cancellationReason && (
                            <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-red-600">Cancellation Reason</p>
                                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{suborder.cancellationReason}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* View Full Details Button */}
                          <div className="flex justify-end">
                            <Link
                              href={`/delivery/orders/${delivery._id}/${suborder._id}`}
                              className="inline-flex items-center space-x-2 px-4 py-2 text-[var(--color-primary)] hover:underline transition-all"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Full Details</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-[var(--color-text)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}