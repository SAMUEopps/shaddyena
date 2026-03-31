// app/shipping/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Truck,
  Rocket,
  Bike,
  Globe,
  MapPin,
  Clock,
  CreditCard,
  Search,
  CheckCircle,
  AlertCircle,
  Package,
  TrendingUp,
  Shield,
  Smartphone,
  Mail,
  Phone,
  ChevronRight,
  Calendar,
  Navigation,
  LocateFixed,
  Timer,
  DollarSign,
  Gift,
  Award
} from 'lucide-react';
import Link from 'next/link';

const ShippingInfoPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('standard');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<null | {
    status: string;
    location: string;
    estimatedDelivery: string;
    history: Array<{ date: string; status: string; location: string }>;
  }>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      // Simulate tracking lookup - In real app, this would be an API call
      setTrackingResult({
        status: 'In Transit',
        location: 'Nairobi Sortation Center',
        estimatedDelivery: '2 days',
        history: [
          { date: '2024-03-30 14:30', status: 'Order Confirmed', location: 'Online' },
          { date: '2024-03-30 16:45', status: 'Processing', location: 'Vendor Warehouse' },
          { date: '2024-03-31 09:15', status: 'Picked Up', location: 'Vendor Location' },
          { date: '2024-03-31 14:20', status: 'In Transit', location: 'Nairobi Sortation Center' },
        ]
      });
    }
  };

  // Delivery Options
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      icon: <Truck className="w-8 h-8" />,
      description: 'Reliable and affordable delivery',
      time: '3-7 business days',
      cost: 'KES 150 - 500',
      features: ['Tracking included', 'Insurance included', 'Doorstep delivery']
    },
    {
      id: 'express',
      name: 'Express Delivery',
      icon: <Rocket className="w-8 h-8" />,
      description: 'Faster delivery for urgent orders',
      time: '1-3 business days',
      cost: 'KES 500 - 1,500',
      features: ['Priority handling', 'Real-time tracking', 'Express support']
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      icon: <Bike className="w-8 h-8" />,
      description: 'Get it today! Available in select cities',
      time: 'Same day (order before 12 PM)',
      cost: 'KES 800 - 2,000',
      features: ['Instant dispatch', 'Live rider tracking', 'Within 5-8 hours']
    }
  ];

  // Shipping Rates by Location
  const shippingRates = [
    { region: 'Nairobi (CBD & Suburbs)', standard: 'KES 150', express: 'KES 500', sameDay: 'KES 800' },
    { region: 'Kiambu, Machakos, Kajiado', standard: 'KES 250', express: 'KES 700', sameDay: 'KES 1,200' },
    { region: 'Other Kenyan Counties', standard: 'KES 400', express: 'KES 1,000', sameDay: 'N/A' },
    { region: 'East Africa (Uganda, Tanzania, Rwanda)', standard: 'KES 1,500', express: 'KES 3,000', sameDay: 'N/A' },
    { region: 'International (Rest of Africa)', standard: 'KES 3,500', express: 'KES 7,000', sameDay: 'N/A' }
  ];

  // Free Shipping Thresholds
  const freeShippingThresholds = [
    { minAmount: 'KES 5,000', benefit: 'Free Standard Delivery', icon: <Package className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { minAmount: 'KES 10,000', benefit: 'Free Express Delivery', icon: <Rocket className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { minAmount: 'KES 15,000', benefit: 'Free Same Day Delivery*', icon: <Bike className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' }
  ];

  // Shipping Partners
  const shippingPartners = [
    { name: 'G4S', logo: '🚚', description: 'Secure nationwide delivery' },
    { name: 'DHL', logo: '✈️', description: 'International shipping expert' },
    { name: 'Fargo', logo: '📦', description: 'Fast and reliable' },
    { name: 'Swift', logo: '⚡', description: 'Express delivery partner' }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-16 md:py-24">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Truck className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Shipping Information
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Fast, reliable delivery across Kenya and beyond
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Orders processed within 24h</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">100% insured packages</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Doorstep delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Delivery Options Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">
            Choose Your Delivery Speed
          </h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12">
            Select the option that best fits your needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedDeliveryType(option.id)}
                className={`
                  relative cursor-pointer group p-6 rounded-2xl transition-all duration-300
                  ${selectedDeliveryType === option.id
                    ? 'bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 border-2 border-[var(--color-primary)] shadow-xl scale-105'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                {selectedDeliveryType === option.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                )}
                <div className={`text-[var(--color-primary)] mb-4 ${selectedDeliveryType === option.id ? 'scale-110' : ''} transition-transform`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  {option.name}
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-3">
                  {option.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-[var(--color-text)]">{option.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-[var(--color-text)] font-semibold">{option.cost}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)]">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Shipping Banner */}
        <div className="mb-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <Gift className="w-12 h-12 text-white mx-auto mb-4 animate-bounce-subtle" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Free Shipping Available!
            </h3>
            <p className="text-white/90 mb-6">
              Reach these thresholds and enjoy free delivery
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {freeShippingThresholds.map((threshold, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[180px] border border-white/20">
                  <div className={`inline-flex p-2 bg-gradient-to-r ${threshold.color} rounded-lg mb-2`}>
                    {threshold.icon}
                  </div>
                  <p className="text-white font-bold text-lg">{threshold.minAmount}</p>
                  <p className="text-white/80 text-sm">{threshold.benefit}</p>
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm mt-4">*Same day delivery free for orders over KES 15,000 in Nairobi</p>
          </div>
        </div>

        {/* Shipping Rates Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Shipping Rates by Location
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)]">
              <thead className="bg-[var(--color-primary)]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Region</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Standard</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Express</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Same Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {shippingRates.map((rate, idx) => (
                  <tr key={idx} className="hover:bg-[var(--color-background-soft)] transition-colors">
                    <td className="px-6 py-4 text-[var(--color-text)] font-medium">{rate.region}</td>
                    <td className="px-6 py-4 text-[var(--color-text)]">{rate.standard}</td>
                    <td className="px-6 py-4 text-[var(--color-text)]">{rate.express}</td>
                    <td className="px-6 py-4 text-[var(--color-text)]">{rate.sameDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Tracking Section */}
        <div className="mb-16 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Navigation className="w-8 h-8 text-[var(--color-primary)]" />
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Track Your Order</h2>
              </div>
              <p className="text-[var(--color-text-muted)] mb-6">
                Enter your tracking number to get real-time updates on your delivery status
              </p>
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Enter tracking number (e.g., SD-123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105"
                >
                  Track Order
                </button>
              </form>
            </div>
            
            {trackingResult && (
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] animate-slide-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">Tracking Details</h3>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                    {trackingResult.status}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Current Location:</span>
                    <span className="text-[var(--color-text)] font-medium">{trackingResult.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Estimated Delivery:</span>
                    <span className="text-[var(--color-text)] font-medium text-green-500">{trackingResult.estimatedDelivery}</span>
                  </div>
                </div>
                <div className="border-t border-[var(--color-border)] pt-4">
                  <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Tracking History</h4>
                  <div className="space-y-3">
                    {trackingResult.history.map((event, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[var(--color-text)]">{event.status}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{event.date} • {event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Important Information Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Important Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Processing Time</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Orders are processed within 24 hours. You'll receive a confirmation email with tracking details once shipped.
              </p>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Business Days</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Delivery times are based on business days (Monday-Friday). Orders placed on weekends are processed on Monday.
              </p>
            </div>
            
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Delivery Issues</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                If you haven't received your order within the estimated timeframe, contact our support team immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Partners */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 text-center">Our Trusted Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shippingPartners.map((partner, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-6 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{partner.logo}</div>
                <h3 className="font-semibold text-[var(--color-text)]">{partner.name}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Still have questions about shipping?</h3>
          <p className="text-[var(--color-text-muted)] mb-6">Check our FAQ or contact our support team for assistance</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105"
            >
              <span>Visit FAQ</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;