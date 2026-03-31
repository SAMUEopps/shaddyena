'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Store,
  TrendingUp,
  Shield,
  Users,
  CreditCard,
  Clock,
  Award,
  BarChart3,
  Truck,
  Headphones,
  Globe,
  Rocket,
  DollarSign,
  HeartHandshake,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Calendar,
  MessageCircle,
  Video,
  BookOpen,
  Smartphone,
  Package,
  ShoppingBag,
  LineChart,
  PieChart,
  Target,
  ThumbsUp,
  Star,
  Gift,
  Lock,
  RefreshCw,
  ChevronRight,
  Play,
  Phone,
  Mail,
  MapPin,
  Building2
} from 'lucide-react';

// Vendor benefits data
const benefits = [
  {
    icon: TrendingUp,
    title: 'Increase Sales',
    description: 'Reach thousands of active customers and grow your revenue exponentially.',
    details: 'Access to a large customer base, targeted marketing, and sales analytics.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    icon: Users,
    title: 'Massive Audience',
    description: 'Connect with customers across Kenya and beyond.',
    details: 'Millions of monthly visitors, diverse customer segments, and repeat buyers.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Get paid instantly and securely via M-Pesa.',
    details: 'Automated payments, fraud protection, and daily/weekly withdrawals.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    icon: Truck,
    title: 'Delivery Network',
    description: 'Access our nationwide delivery infrastructure.',
    details: 'Door-to-door delivery, real-time tracking, and discounted rates.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track sales, inventory, and customer behavior in real-time.',
    details: 'Advanced analytics, sales reports, and performance insights.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team for all your vendor needs.',
    details: 'Priority support, onboarding assistance, and technical help.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
];

// Additional features
const features = [
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Manage your store on the go with our vendor mobile app',
  },
  {
    icon: Video,
    title: 'Product Videos',
    description: 'Showcase your products with video demonstrations',
  },
  {
    icon: MessageCircle,
    title: 'Customer Chat',
    description: 'Direct communication with your customers',
  },
  {
    icon: Calendar,
    title: 'Promotion Tools',
    description: 'Create discounts, coupons, and flash sales',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track stock levels and get low-stock alerts',
  },
  {
    icon: LineChart,
    title: 'Sales Forecasting',
    description: 'AI-powered sales predictions and insights',
  },
];

// Success stories
const successStories = [
  {
    name: 'Jane Wanjiku',
    business: 'Fashion Haven',
    image: '/avatars/jane.jpg',
    story: 'My sales increased by 300% in the first 3 months! The platform is incredibly easy to use and the support team is amazing.',
    achievement: 'Top Vendor 2024',
    sales: 'KES 500K+',
    rating: 4.9,
    quote: 'Shaddyna transformed my small business into a thriving online store.'
  },
  {
    name: 'Michael Otieno',
    business: 'Tech Hub Kenya',
    image: '/avatars/michael.jpg',
    story: 'The analytics tools helped me understand my customers better. I can now target the right products to the right people.',
    achievement: 'Fastest Growing',
    sales: 'KES 750K+',
    rating: 4.8,
    quote: 'Best decision I made for my electronics business.'
  },
  {
    name: 'Sarah Mwangi',
    business: 'Natural Beauty',
    image: '/avatars/sarah.jpg',
    story: 'From a home-based business to a nationwide brand. The delivery network made all the difference!',
    achievement: 'Customer Favorite',
    sales: 'KES 300K+',
    rating: 4.9,
    quote: 'The platform helped me reach customers I never thought possible.'
  },
];

// Pricing tiers
const pricingTiers = [
  {
    name: 'Basic',
    price: 'Free',
    period: 'forever',
    icon: Store,
    features: [
      'Up to 50 products',
      'Basic analytics',
      'Email support',
      'M-Pesa payments',
      'Basic listing',
      'Standard delivery rates'
    ],
    cta: 'Start Selling',
    popular: false,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Professional',
    price: 'KES 2,500',
    period: 'per month',
    icon: Rocket,
    features: [
      'Unlimited products',
      'Advanced analytics',
      'Priority support',
      'Promotion tools',
      'Featured listings',
      'Discounted delivery rates',
      'Customer chat',
      'Product videos'
    ],
    cta: 'Get Started',
    popular: true,
    color: 'from-[var(--color-primary)] to-[var(--color-primary-alt)]'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    icon: Building2,
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'Bulk upload tools',
      'White-label options',
      'Priority listing',
      'Custom reporting'
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-purple-500 to-pink-500'
  }
];

// FAQ items
const faqs = [
  {
    question: 'How do I become a vendor?',
    answer: 'Simply click on "Become a Vendor" in the main menu, fill out the application form, and our team will review your application within 24-48 hours.'
  },
  {
    question: 'What are the commission fees?',
    answer: 'We charge a competitive commission of 10% on each sale. Professional plan subscribers enjoy reduced commission rates of 8%.'
  },
  {
    question: 'How do I get paid?',
    answer: 'Payments are automatically processed to your M-Pesa account on a daily or weekly basis. You can choose your payout frequency in your vendor dashboard.'
  },
  {
    question: 'Can I sell products from anywhere?',
    answer: 'Yes! You can sell from anywhere in Kenya. Our delivery network covers all major towns and cities across the country.'
  },
  {
    question: 'What kind of support do vendors receive?',
    answer: 'All vendors receive dedicated support. Professional and Enterprise plan members get priority support with faster response times.'
  },
  {
    question: 'How do I list my products?',
    answer: 'Our easy-to-use dashboard allows you to list products with photos, descriptions, pricing, and inventory management tools.'
  }
];

export default function VendorBenefitsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBecomeVendor = () => {
    if (user) {
      router.push('/become-vendor');
    } else {
      router.push('/login?redirect=/become-vendor');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-alt)] to-[var(--color-primary-soft)]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Vendor Benefits</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Grow Your Business with{' '}
              <span className="inline-block animate-pulse-slow">Shaddyna</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join Kenya's fastest-growing e-commerce platform and unlock unlimited potential for your business. Start selling to thousands of customers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBecomeVendor}
                className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 group"
              >
                Become a Vendor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#benefits"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">10K+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Active Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">500K+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Monthly Orders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">KES 50M+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Vendor Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">98%</div>
              <div className="text-sm text-[var(--color-text-muted)]">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Why Sell on <span className="text-[var(--color-primary)]">Shaddyna</span>?
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Discover the tools and support you need to build a successful online business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`p-3 rounded-xl ${benefit.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-3">
                    {benefit.description}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {benefit.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[var(--color-primary-soft)]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Start with our free plan and upgrade as your business grows
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={index}
                  className={`relative bg-[var(--color-surface)] rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                    tier.popular
                      ? 'border-[var(--color-primary)] shadow-xl scale-105 md:scale-110'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white px-4 py-1 text-sm font-medium rounded-bl-xl">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8">
                    <div className="mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${tier.color} w-fit mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{tier.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[var(--color-text)]">{tier.price}</span>
                        <span className="text-[var(--color-text-muted)]">/{tier.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={handleBecomeVendor}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white hover:shadow-lg'
                          : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Powerful Tools for Your Business
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Everything you need to manage and grow your online store
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--color-primary-soft)]/10 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-[var(--color-primary-soft)]/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">{feature.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-primary-soft)]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Vendor Success Stories
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Hear from vendors who have transformed their businesses on Shaddyna
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setHoveredStory(index)}
                onMouseLeave={() => setHoveredStory(null)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center text-white font-bold">
                    {story.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">{story.name}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{story.business}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(story.rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-[var(--color-border)]'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-[var(--color-text-muted)]">{story.rating}</span>
                </div>
                
                <p className="text-[var(--color-text-muted)] italic mb-4">"{story.story}"</p>
                
                <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                  <span className="text-sm font-medium text-[var(--color-primary)]">{story.achievement}</span>
                  <span className="text-sm font-bold text-[var(--color-text)]">{story.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--color-text-muted)]">
              Got questions? We've got answers
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
              >
                <button
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[var(--color-primary-soft)]/5 transition-colors"
                >
                  <span className="font-semibold text-[var(--color-text)]">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-300 ${
                      selectedFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {selectedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[var(--color-text-muted)]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful vendors and grow your business with Shaddyna
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBecomeVendor}
              className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 group"
            >
              Become a Vendor Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/contact"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              Contact Sales Team
              <Phone className="w-5 h-5" />
            </a>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free onboarding</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}