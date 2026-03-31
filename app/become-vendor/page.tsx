'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  Store,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  TrendingUp,
  Shield,
  Users,
  Truck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Award,
  Star,
  DollarSign,
  Clock,
  HeartHandshake,
  ChevronRight
} from 'lucide-react';

// Business types for categories (static categories)
const businessTypes: { id: string; name: string; icon: any; description: string }[] = [
  { id: 'fashion', name: 'Fashion & Apparel', icon: Store, description: 'Clothing, accessories, footwear' },
  { id: 'electronics', name: 'Electronics', icon: Store, description: 'Gadgets, computers, phones' },
  { id: 'home-garden', name: 'Home & Garden', icon: Store, description: 'Furniture, decor, gardening' },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: Store, description: 'Cosmetics, skincare, haircare' },
  { id: 'food-beverages', name: 'Food & Beverages', icon: Store, description: 'Groceries, drinks, snacks' },
  { id: 'arts-crafts', name: 'Arts & Crafts', icon: Store, description: 'Handmade, art supplies' },
  { id: 'sports', name: 'Sports & Outdoors', icon: Store, description: 'Equipment, outdoor gear' },
  { id: 'books', name: 'Books & Stationery', icon: Store, description: 'Books, office supplies' },
  { id: 'automotive', name: 'Automotive', icon: Store, description: 'Car parts, accessories' },
  { id: 'health', name: 'Health & Wellness', icon: Store, description: 'Supplements, wellness products' },
  { id: 'other', name: 'Other', icon: Store, description: 'Other business types' },
];

// Benefits of becoming a vendor
const vendorBenefits = [
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Reach thousands of customers across Kenya',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Get paid securely via M-Pesa',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    icon: Users,
    title: 'Customer Support',
    description: '24/7 dedicated support for vendors',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    icon: Truck,
    title: 'Delivery Network',
    description: 'Access our nationwide delivery network',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    icon: CreditCard,
    title: 'Easy Withdrawals',
    description: 'Withdraw earnings anytime to M-Pesa',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20'
  },
  {
    icon: Clock,
    title: 'Quick Setup',
    description: 'Start selling in minutes',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
];

interface FormData {
  businessName: string;
  businessType: string;
  mpesaNumber: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  taxId?: string;
}

export default function BecomeVendorPage() {
  const router = useRouter();
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    mpesaNumber: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    taxId: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Check if user is already a vendor
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'vendor') {
        router.push('/vendor/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData((prev) => ({
      ...prev,
      businessType: businessTypes.find(cat => cat.id === categoryId)?.name || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/become-vendor', {
        businessName: formData.businessName,
        businessType: formData.businessType,
        mpesaNumber: formData.mpesaNumber,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        businessAddress: formData.businessAddress,
        taxId: formData.taxId,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        await refreshUser();
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
        <div className="max-w-md w-full bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 text-center border border-[var(--color-border)]">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
            Application Submitted!
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            Thank you for applying to become a vendor. Our team will review your application and get back to you within 24-48 hours.
          </p>
          <div className="bg-[var(--color-primary-soft)]/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-[var(--color-text)]">
              <strong>Next steps:</strong> Check your email for verification and onboarding instructions.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-alt)] to-[var(--color-primary-soft)] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Store className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Become a Seller</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Start Your Selling Journey Today
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of successful vendors on Shaddyna. Reach millions of customers and grow your business like never before.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                  Vendor Application
                </h2>
                <p className="text-[var(--color-text-muted)] mb-6">
                  Fill out the form below to start your journey as a vendor
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Business Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                        placeholder="Enter your business name"
                      />
                    </div>
                  </div>

                  {/* Business Type - Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                      Business Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {businessTypes.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category.id)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/20'
                                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-background)]'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`} />
                            <p className={`text-sm font-medium ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                              {category.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              {category.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* M-Pesa Number */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      M-Pesa Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                      <input
                        type="tel"
                        name="mpesaNumber"
                        required
                        value={formData.mpesaNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                        placeholder="07XXXXXXXX"
                        pattern="[0-9]{10}"
                        maxLength={10}
                      />
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Enter your 10-digit M-Pesa number for payments and withdrawals
                    </p>
                  </div>

                  {/* Optional Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Business Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                          type="email"
                          name="businessEmail"
                          value={formData.businessEmail}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="business@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Business Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                          type="tel"
                          name="businessPhone"
                          value={formData.businessPhone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                          placeholder="07XXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-[var(--color-text-muted)]" />
                      <textarea
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        rows={2}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                        placeholder="Street, City, County"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Tax ID / PIN (Optional)
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="KRA PIN or Business Registration Number"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Become a Vendor
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Benefits Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Benefits Card */}
              <div className="bg-gradient-to-br from-[var(--color-primary-soft)]/10 to-[var(--color-primary)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    Why Become a Vendor?
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {vendorBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${benefit.bgColor} flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${benefit.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[var(--color-text)] text-sm">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Success Stories Preview */}
              <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Vendor Success Stories
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[var(--color-background)] rounded-xl">
                    <p className="text-sm text-[var(--color-text)] mb-1">
                      "Sales increased by 300% in the first month!"
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      - Jane, Fashion Boutique
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--color-background)] rounded-xl">
                    <p className="text-sm text-[var(--color-text)] mb-1">
                      "The platform is easy to use and customers love it."
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      - Mike, Electronics Store
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-[var(--color-primary-soft)]/10 rounded-2xl p-6 border border-[var(--color-border)] text-center">
                <HeartHandshake className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-3" />
                <h3 className="font-semibold text-[var(--color-text)] mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Our vendor support team is here to help you every step of the way.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors text-sm font-medium"
                >
                  Contact Support
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}