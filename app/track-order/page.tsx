// app/track-order/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle,
  CreditCard,
  Box,
  Truck,
  MapPin,
  Home,
  Clock,
  AlertCircle,
  Search,
  Phone,
  Mail,
  Map,
  Calendar,
  ChevronRight,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  Store,
  User,
  Navigation,
  Smartphone,
  Headphones,
  ThumbsUp,
  Star
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Define order status types
type OrderStatus = 'received' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

interface Order {
  orderNumber: string;
  status: OrderStatus;
  statusDate: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  carrier?: string;
  vendor?: {
    name: string;
    phone: string;
    email: string;
  };
  timeline: Array<{
    status: OrderStatus;
    title: string;
    date: string;
    description: string;
    completed: boolean;
  }>;
}

const TrackOrderPage = () => {
  const [mounted, setMounted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [activeOrder, setActiveOrder] = useState<string | null>(null);

  // Mock order data for demonstration
  const mockOrders: Record<string, Order> = {
    'SD-123456789': {
      orderNumber: 'SD-123456789',
      status: 'shipped',
      statusDate: '2024-03-31T14:30:00',
      estimatedDelivery: '2024-04-03',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 3499 },
        { name: 'Phone Case', quantity: 2, price: 599 }
      ],
      total: 4697,
      shippingAddress: '123 Ngong Road, Nairobi, Kenya',
      trackingNumber: 'TRK-987654321',
      carrier: 'G4S Courier',
      vendor: {
        name: 'TechZone Kenya',
        phone: '+254 700 123 456',
        email: 'support@techzone.co.ke'
      },
      timeline: [
        {
          status: 'received',
          title: 'Order Received',
          date: '2024-03-30 10:00',
          description: 'Your order has been received and is being processed.',
          completed: true
        },
        {
          status: 'confirmed',
          title: 'Payment Confirmed',
          date: '2024-03-30 10:05',
          description: 'Payment has been successfully processed.',
          completed: true
        },
        {
          status: 'packed',
          title: 'Order Packed',
          date: '2024-03-30 15:30',
          description: 'Your items have been packed and ready for pickup.',
          completed: true
        },
        {
          status: 'shipped',
          title: 'Shipped',
          date: '2024-03-31 09:00',
          description: 'Your order is on the way! Track with number: TRK-987654321',
          completed: true
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          date: '2024-04-02 08:00',
          description: 'Your order is out for delivery today!',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          date: '2024-04-02 17:00',
          description: 'Your order has been delivered.',
          completed: false
        }
      ]
    },
    'SD-987654321': {
      orderNumber: 'SD-987654321',
      status: 'out_for_delivery',
      statusDate: '2024-04-01T08:00:00',
      estimatedDelivery: 'Today',
      items: [
        { name: 'Running Shoes', quantity: 1, price: 4599 },
        { name: 'Sports Wear', quantity: 1, price: 1999 }
      ],
      total: 6598,
      shippingAddress: '45 Mombasa Road, Nairobi, Kenya',
      trackingNumber: 'TRK-123456789',
      carrier: 'Swift Logistics',
      vendor: {
        name: 'Sporty Kenya',
        phone: '+254 722 987 654',
        email: 'hello@sportykenya.com'
      },
      timeline: [
        {
          status: 'received',
          title: 'Order Received',
          date: '2024-03-29 14:20',
          description: 'Your order has been received.',
          completed: true
        },
        {
          status: 'confirmed',
          title: 'Payment Confirmed',
          date: '2024-03-29 14:25',
          description: 'M-Pesa payment confirmed.',
          completed: true
        },
        {
          status: 'packed',
          title: 'Order Packed',
          date: '2024-03-30 11:00',
          description: 'Items packed and ready.',
          completed: true
        },
        {
          status: 'shipped',
          title: 'Shipped',
          date: '2024-03-31 16:00',
          description: 'Order shipped with Swift Logistics.',
          completed: true
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          date: '2024-04-01 08:00',
          description: 'Your order is out for delivery today!',
          completed: true
        },
        {
          status: 'delivered',
          title: 'Delivered',
          date: 'Pending',
          description: 'Awaiting delivery confirmation.',
          completed: false
        }
      ]
    }
  };

  // Status configuration
  const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string; bgColor: string }> = {
    received: {
      label: 'Order Received',
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    },
    confirmed: {
      label: 'Payment Confirmed',
      icon: CreditCard,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
    packed: {
      label: 'Packed',
      icon: Box,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500'
    },
    shipped: {
      label: 'Shipped',
      icon: Truck,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500'
    },
    out_for_delivery: {
      label: 'Out for Delivery',
      icon: MapPin,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500'
    },
    delivered: {
      label: 'Delivered',
      icon: Home,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!orderNumber.trim()) {
      setError('Please enter your order number');
      return;
    }
    
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderNumber];
      if (order) {
        setOrderData(order);
        setActiveOrder(orderNumber);
        setError('');
      } else {
        setError('Order not found. Please check your order number and try again.');
        setOrderData(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusProgress = (status: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['received', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return (currentIndex / (statusOrder.length - 1)) * 100;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Navigation className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Enter your order details to see real-time delivery status
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Form */}
        {!orderData && (
          <div className="bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Search className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Find Your Order</h2>
              <p className="text-[var(--color-text-muted)]">Enter your order number and email/phone to track your package</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Order Number *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., SD-123456789"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Email or Phone Number *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter your email or phone number"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[var(--color-text-muted)]">
                Don't have an order number? Check your confirmation email or SMS
              </p>
            </div>
          </div>
        )}

        {/* Order Tracking Details */}
        {orderData && (
          <div className="space-y-6 animate-slide-in">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-6 text-white">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Order Number</p>
                  <p className="text-2xl font-bold">{orderData.orderNumber}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Estimated Delivery</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <p className="text-xl font-bold">{orderData.estimatedDelivery}</p>
                  </div>
                </div>
                <div>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                    orderData.status === 'delivered' ? 'bg-green-500/20' : 'bg-white/20'
                  } backdrop-blur-sm`}>
                    {statusConfig[orderData.status].icon && 
                      React.createElement(statusConfig[orderData.status].icon, { className: "w-5 h-5" })
                    }
                    <span className="font-medium">{statusConfig[orderData.status].label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-muted)]">Order Progress</span>
                  <span className="text-sm font-medium text-[var(--color-primary)]">
                    {Math.round(getStatusProgress(orderData.status))}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full transition-all duration-500"
                    style={{ width: `${getStatusProgress(orderData.status)}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--color-border)]"></div>
                <div className="space-y-6">
                  {orderData.timeline.map((event, idx) => {
                    const StatusIcon = statusConfig[event.status].icon;
                    const isCompleted = event.completed;
                    const isCurrent = event.status === orderData.status;
                    
                    return (
                      <div key={idx} className="relative flex items-start space-x-4">
                        <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? `bg-gradient-to-r ${statusConfig[event.status].color === 'text-green-500' ? 'from-green-500 to-emerald-500' : 'from-[var(--color-primary)] to-[var(--color-primary-alt)]'} text-white`
                            : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            StatusIcon && <StatusIcon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <h3 className={`font-semibold ${
                              isCompleted ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
                            }`}>
                              {event.title}
                            </h3>
                            <span className={`text-xs ${
                              isCompleted ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                            }`}>
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            isCompleted ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-muted)]/60'
                          }`}>
                            {event.description}
                          </p>
                          {event.status === 'shipped' && orderData.trackingNumber && (
                            <div className="mt-2 p-3 bg-[var(--color-primary)]/5 rounded-lg border border-[var(--color-border)]">
                              <p className="text-xs text-[var(--color-text-muted)]">Tracking Number</p>
                              <p className="text-sm font-mono text-[var(--color-primary)]">{orderData.trackingNumber}</p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">Carrier: {orderData.carrier}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items & Shipping */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                  <div className="flex items-center space-x-2 mb-4">
                    <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="text-lg font-bold text-[var(--color-text)]">Order Items</h3>
                  </div>
                  <div className="space-y-3">
                    {orderData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-[var(--color-border)] last:border-0">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{item.name}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-[var(--color-text)]">KES {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t border-[var(--color-border)]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[var(--color-text)]">Total</span>
                        <span className="text-xl font-bold text-[var(--color-primary)]">KES {orderData.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="text-lg font-bold text-[var(--color-text)]">Shipping Address</h3>
                  </div>
                  <p className="text-[var(--color-text)]">{orderData.shippingAddress}</p>
                </div>
              </div>

              {/* Vendor & Support */}
              <div className="space-y-6">
                {orderData.vendor && (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                    <div className="flex items-center space-x-2 mb-4">
                      <Store className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="text-lg font-bold text-[var(--color-text)]">Vendor</h3>
                    </div>
                    <p className="font-medium text-[var(--color-text)] mb-2">{orderData.vendor.name}</p>
                    <div className="space-y-2">
                      <a href={`tel:${orderData.vendor.phone}`} className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                        <Phone className="w-4 h-4" />
                        <span>{orderData.vendor.phone}</span>
                      </a>
                      <a href={`mailto:${orderData.vendor.email}`} className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                        <Mail className="w-4 h-4" />
                        <span>{orderData.vendor.email}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Need Help? */}
                <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
                  <div className="flex items-center space-x-2 mb-4">
                    <Headphones className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="text-lg font-bold text-[var(--color-text)]">Need Help?</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    Having issues with your order? Contact our support team
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-all"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </div>

                {/* Track Another Order */}
                <button
                  onClick={() => {
                    setOrderData(null);
                    setOrderNumber('');
                    setEmailOrPhone('');
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Track Another Order</span>
                </button>
              </div>
            </div>

            {/* Delivery Tips */}
            <div className="bg-[var(--color-primary)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                  <ThumbsUp className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-text)] mb-1">Delivery Tips</h4>
                  <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
                    <li>• Keep your phone handy for delivery calls</li>
                    <li>• Ensure someone is available to receive the package</li>
                    <li>• Check tracking for real-time updates</li>
                    <li>• Contact support if delivery is delayed beyond estimated date</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;