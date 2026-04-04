// app/delivery/my-deliveries/page.tsx
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
  User,
  Phone,
  Navigation,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  MessageCircle,
  Navigation2,
  Calendar,
  DollarSign,
  Shield,
  Star,
  ArrowLeft,
  Eye,
  Route
} from 'lucide-react';

interface Delivery {
  _id: string;
  orderId: string;
  createdAt: string;
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
    status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CONFIRMED';
    deliveryFee: number;
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: string;
      notes?: string;
      confirmationCode?: string;
      confirmedAt?: string;
      riderConfirmedAt?: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    amount: number;
  }[];
}

interface VendorInfo {
  _id: string;
  businessName: string;
  phone: string;
  address: string;
}

interface DeliveryResponse {
  deliveries: Delivery[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export default function MyDeliveriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [vendorInfo, setVendorInfo] = useState<Record<string, VendorInfo>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchDeliveries();
    }
  }, [currentPage, user]);

  const fetchDeliveries = async () => {
    if (!user || user.role !== 'delivery') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch active deliveries (ASSIGNED, PICKED_UP, IN_TRANSIT)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: 'active' // This will get non-completed deliveries
      });
      
      const response = await fetch(`/api/delivery/rider?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch deliveries');
      }
      
      const data: DeliveryResponse = await response.json();
      setDeliveries(data.deliveries);
      setTotalPages(data.totalPages);
      setTotalDeliveries(data.total);
      
      // Fetch vendor info for each delivery
      await fetchVendorInfo(data.deliveries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendorInfo = async (deliveries: Delivery[]) => {
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

  const handleDeliveryAction = async (
    deliveryId: string,
    suborderId: string,
    action: 'accept' | 'pickup' | 'deliver',
    price?: string
  ) => {
    setActionLoading(`${deliveryId}-${suborderId}`);

    let mappedAction;

    if (action === 'accept') mappedAction = 'pickup';
    else if (action === 'pickup') mappedAction = 'in_transit'; // 🔥 FIX
    else if (action === 'deliver') mappedAction = 'deliver';

    
    try {
      let payload: any = {
        orderId: deliveryId,
        suborderId: suborderId,
        //action: action === 'accept' ? 'pickup' : action === 'pickup' ? 'pickup' : 'deliver'
        action: mappedAction
      };
      
      if (action === 'pickup' && price) {
        payload.deliveryPrice = parseFloat(price);
      }
      
      const response = await fetch('/api/delivery/rider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Action failed');
      }
      
      toast.success(data.message || 'Action completed successfully');
      
      // Refresh deliveries
      await fetchDeliveries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to perform action');
      console.error('Action error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'DELIVERED': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'IN_TRANSIT': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'PICKED_UP': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'ASSIGNED': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'DELIVERED': return <Package className="w-4 h-4" />;
      case 'IN_TRANSIT': return <Truck className="w-4 h-4" />;
      case 'PICKED_UP': return <Package className="w-4 h-4" />;
      case 'ASSIGNED': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'ASSIGNED': return 'Ready for Pickup';
      case 'PICKED_UP': return 'Picked Up';
      case 'IN_TRANSIT': return 'In Transit';
      case 'DELIVERED': return 'Delivered';
      case 'CONFIRMED': return 'Confirmed';
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
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDistance = () => {
    // Simulated distance - in real app, you'd calculate from addresses
    return Math.floor(Math.random() * 15) + 2;
  };

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
              <Truck className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              My Deliveries
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Manage your active deliveries and update their status
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Package className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">{totalDeliveries} Active Deliveries</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Navigation className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Real-time Tracking</span>
              </div>
              <button
                onClick={fetchDeliveries}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-sm text-[var(--color-text-muted)]">Waiting</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
              {deliveries.filter(d => d.suborders.some(s => s.status === 'ASSIGNED')).length}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Ready for pickup</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-[var(--color-text-muted)]">Active</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
              {deliveries.filter(d => d.suborders.some(s => s.status === 'PICKED_UP' || s.status === 'IN_TRANSIT')).length}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">In progress</p>
          </div>

          <div className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm text-[var(--color-text-muted)]">Today's Earnings</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text)] mb-1">
              {formatCurrency(
                deliveries.reduce((sum, d) => 
                  sum + d.suborders.reduce((subSum, so) => 
                    subSum + (so.status === 'DELIVERED' || so.status === 'CONFIRMED' ? so.deliveryFee : 0), 0
                  ), 0
                )
              )}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Completed deliveries</p>
          </div>
        </div>

        {/* Deliveries List */}
        {deliveries.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
            <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Package className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No Active Deliveries</h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              You don't have any active deliveries at the moment.
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Check back later for new assignments or refresh the page.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {deliveries.map((delivery) => 
              delivery.suborders.map((suborder) => {
                const vendor = vendorInfo[suborder.vendorId];
                const distance = getEstimatedDistance();
                const isPriceSet = deliveryPrice[`${delivery._id}-${suborder._id}`];
                
                return (
                  <div
                    key={`${delivery._id}-${suborder._id}`}
                    className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Status Header */}
                    <div className={`px-6 py-4 border-b border-[var(--color-border)] ${getStatusColor(suborder.status)} bg-opacity-5`}>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(suborder.status)}
                          <span className="font-semibold text-[var(--color-text)]">
                            {getStatusText(suborder.status)}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-inherit">
                            Order #{delivery.orderId}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(delivery.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Locations */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Pickup Location */}
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Store className="w-4 h-4 text-green-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--color-text)]">Pickup from Vendor</p>
                              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                {vendor?.businessName || 'Vendor Store'}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                {suborder.deliveryDetails?.pickupAddress || vendor?.address || 'Address not available'}
                              </p>
                              {vendor?.phone && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <Phone className="w-3 h-3 text-[var(--color-text-muted)]" />
                                  <span className="text-xs text-[var(--color-text-muted)]">{vendor.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Delivery Location */}
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-blue-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--color-text)]">Deliver to Customer</p>
                              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                {suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                {delivery.shipping.city}, {delivery.shipping.country}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Phone className="w-3 h-3 text-[var(--color-text-muted)]" />
                                <span className="text-xs text-[var(--color-text-muted)]">{delivery.shipping.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Route Info */}
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Route className="w-4 h-4 text-purple-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--color-text)]">Route Information</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-[var(--color-text)]">~{distance} km</span>
                                <span className="text-sm text-[var(--color-text-muted)]">Est. {Math.floor(distance * 3)} mins</span>
                                <span className="text-sm font-semibold text-[var(--color-primary)]">
                                  {formatCurrency(suborder.deliveryFee || 0)} delivery fee
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order Items Summary */}
                          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Order Items</p>
                            <div className="flex flex-wrap gap-2">
                              {suborder.items.slice(0, 3).map((item, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-[var(--color-background-soft)] rounded-full text-[var(--color-text-muted)]">
                                  {item.name} x{item.quantity}
                                </span>
                              ))}
                              {suborder.items.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-[var(--color-background-soft)] rounded-full text-[var(--color-text-muted)]">
                                  +{suborder.items.length - 3} more
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--color-text)] mt-2">
                              Total: {formatCurrency(suborder.amount)}
                            </p>
                          </div>
                        </div>

                        {/* Right Column - Actions */}
                        <div className="space-y-4">
                          {/* Contact Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => window.open(`tel:${vendor?.phone || ''}`)}
                              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
                            >
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">Vendor</span>
                            </button>
                            <button
                              onClick={() => window.open(`tel:${delivery.shipping.phone}`)}
                              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
                            >
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">Customer</span>
                            </button>
                          </div>

                          {/* WhatsApp Contact */}
                          <button
                            onClick={() => window.open(`https://wa.me/${vendor?.phone?.replace(/\D/g, '') || ''}`, '_blank')}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 hover:scale-105"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat on WhatsApp</span>
                          </button>

                          {/* Navigation */}
                          <button
                            onClick={() => {
                              const address = suborder.status === 'ASSIGNED' 
                                ? (suborder.deliveryDetails?.pickupAddress || vendor?.address)
                                : (suborder.deliveryDetails?.dropoffAddress || delivery.shipping.address);
                              if (address) {
                                window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
                              }
                            }}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
                          >
                            <Navigation2 className="w-4 h-4" />
                            <span>Open in Maps</span>
                          </button>

                          {/* Action Buttons based on Status */}
                          {suborder.status === 'ASSIGNED' && (
                            <>
                              <div className="space-y-2">
                                <label className="text-sm text-[var(--color-text-muted)]">Delivery Price (KES)</label>
                                <input
                                  type="number"
                                  placeholder="Enter delivery fee"
                                  value={deliveryPrice[`${delivery._id}-${suborder._id}`] || ''}
                                  onChange={(e) => setDeliveryPrice(prev => ({
                                    ...prev,
                                    [`${delivery._id}-${suborder._id}`]: e.target.value
                                  }))}
                                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                                />
                              </div>
                              <button
                                onClick={() => handleDeliveryAction(delivery._id, suborder._id, 'pickup', deliveryPrice[`${delivery._id}-${suborder._id}`])}
                                disabled={actionLoading === `${delivery._id}-${suborder._id}` || !deliveryPrice[`${delivery._id}-${suborder._id}`]}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoading === `${delivery._id}-${suborder._id}` ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Package className="w-5 h-5" />
                                    <span>Accept & Pick Up</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}

                          {suborder.status === 'PICKED_UP' && (
                            <button
                              onClick={() => handleDeliveryAction(delivery._id, suborder._id, 'pickup')}
                              disabled={actionLoading === `${delivery._id}-${suborder._id}`}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                            >
                              {actionLoading === `${delivery._id}-${suborder._id}` ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <Truck className="w-5 h-5" />
                                  <span>Mark as In Transit</span>
                                </>
                              )}
                            </button>
                          )}

                          {suborder.status === 'IN_TRANSIT' && (
                            <button
                              onClick={() => handleDeliveryAction(delivery._id, suborder._id, 'deliver')}
                              disabled={actionLoading === `${delivery._id}-${suborder._id}`}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                            >
                              {actionLoading === `${delivery._id}-${suborder._id}` ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  <span>Mark as Delivered</span>
                                </>
                              )}
                            </button>
                          )}

                          {(suborder.status === 'DELIVERED' || suborder.status === 'CONFIRMED') && (
                            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                              <p className="text-sm font-medium text-green-600">Delivery Completed</p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                Earnings: {formatCurrency(suborder.deliveryFee)}
                              </p>
                            </div>
                          )}

                          {/* View Details Link */}
                          <Link
                            href={`/delivery/orders/${delivery._id}/${suborder._id}`}
                            className="flex items-center justify-center space-x-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors pt-4"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Order Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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