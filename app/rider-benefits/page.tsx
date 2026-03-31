'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Bike,
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
  Smartphone,
  MapPin,
  Navigation,
  Target,
  ThumbsUp,
  Star,
  Gift,
  Lock,
  ChevronRight,
  Phone,
  Mail,
  Trophy,
  Fuel,
  Car,
  Battery,
  Wifi,
  Cloud,
  Sun,
  Moon,
  Coffee,
  Users as UsersIcon,
  Briefcase,
  Home,
  TrendingUp as TrendingUpIcon,
  BarChart,
  PieChart,
  Timer,
  Compass,
  IdCard
} from 'lucide-react';

// Rider benefits data
const benefits = [
  {
    icon: TrendingUp,
    title: 'High Earnings Potential',
    description: 'Earn competitive rates per delivery with daily payouts and performance bonuses.',
    details: 'Average riders earn KES 500-1,500 daily. Top performers earn KES 50,000+ monthly.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    stats: 'KES 500-1,500/day'
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Work when you want, take breaks when you need. No fixed hours or minimum requirements.',
    details: 'Choose your own hours, work part-time or full-time. Perfect for students, freelancers, and anyone seeking flexibility.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    stats: '24/7 Availability'
  },
  {
    icon: Shield,
    title: 'Insurance Coverage',
    description: 'Comprehensive insurance coverage for you and your vehicle while on delivery.',
    details: 'Accident insurance, vehicle protection, and liability coverage provided at no cost.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    stats: 'Full Coverage'
  },
  {
    icon: DollarSign,
    title: 'Daily Payouts',
    description: 'Get paid instantly to your M-Pesa account after each delivery shift.',
    details: 'Daily withdrawals, no waiting period, transparent payment tracking.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    stats: 'Instant Withdrawals'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a supportive community of professional riders and get 24/7 assistance.',
    details: 'Rider forums, WhatsApp groups, and dedicated support team always ready to help.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    stats: '24/7 Support'
  },
  {
    icon: Award,
    title: 'Performance Bonuses',
    description: 'Earn extra bonuses for excellent service, high ratings, and completing milestones.',
    details: 'Weekly bonuses, monthly incentives, and special rewards for top performers.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    stats: 'Up to +50% Bonus'
  },
];

// Additional perks
const perks = [
  {
    icon: Fuel,
    title: 'Fuel Discounts',
    description: 'Exclusive fuel discounts at partner stations across Kenya',
    color: 'text-red-500'
  },
  {
    icon: Wifi,
    title: 'Free Internet',
    description: 'Free data bundles for navigation and app usage',
    color: 'text-blue-500'
  },
  {
    icon: Briefcase,
    title: 'Free Gear',
    description: 'Branded rider kit including helmet, jacket, and phone mount',
    color: 'text-purple-500'
  },
  {
    icon: Coffee,
    title: 'Rider Lounges',
    description: 'Access to comfortable waiting areas with refreshments',
    color: 'text-orange-500'
  },
  {
    icon: Home,
    title: 'Referral Bonuses',
    description: 'Earn KES 1,000 for every rider you refer who completes 50 deliveries',
    color: 'text-green-500'
  },
  {
    icon: Trophy,
    title: 'Monthly Awards',
    description: 'Recognition and prizes for top-performing riders',
    color: 'text-yellow-500'
  },
];

// Earnings breakdown
const earningsBreakdown = [
  {
    title: 'Base Delivery Fee',
    amount: 'KES 100-300',
    description: 'Per delivery based on distance',
    icon: MapPin,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Peak Time Bonus',
    amount: '+KES 50',
    description: 'During busy hours (11am-2pm, 5pm-8pm)',
    icon: Timer,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Distance Bonus',
    amount: '+KES 10/km',
    description: 'Extra for deliveries over 5km',
    icon: Navigation,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Rainy Day Bonus',
    amount: '+KES 100',
    description: 'Extra during heavy rainfall',
    icon: Cloud,
    gradient: 'from-gray-500 to-slate-500'
  },
  {
    title: '5-Star Rating Bonus',
    amount: '+KES 50',
    description: 'Per delivery when rated 5 stars',
    icon: Star,
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    title: 'Weekly Performance Bonus',
    amount: 'KES 1,000-5,000',
    description: 'Based on deliveries completed',
    icon: TrendingUpIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
];

// Success stories
const successStories = [
  {
    name: 'John Kamau',
    role: 'Full-Time Rider',
    image: '/avatars/john.jpg',
    story: 'I started as a part-time rider to supplement my income. Within 3 months, I was earning more than my full-time job! Now I ride full-time and love the flexibility.',
    achievement: 'Top Rider 2024',
    earnings: 'KES 65,000/month',
    deliveries: '1,200+',
    rating: 4.9,
    quote: 'This changed my life. I now have time for my family and earn more than ever.'
  },
  {
    name: 'Mary Wanjiku',
    role: 'Student Rider',
    image: '/avatars/mary.jpg',
    story: 'As a university student, I needed flexible work that fits around my classes. Being a rider allows me to earn and study at the same time. The support team is amazing!',
    achievement: 'Student Ambassador',
    earnings: 'KES 35,000/month',
    deliveries: '450+',
    rating: 4.8,
    quote: 'Perfect for students! I can work when I want and focus on studies when I need to.'
  },
  {
    name: 'Peter Ochieng',
    role: 'Weekend Rider',
    image: '/avatars/peter.jpg',
    story: 'I ride on weekends only and still make KES 8,000-10,000 weekly. It\'s the perfect side hustle. The bonuses and incentives keep me motivated!',
    achievement: 'Most Improved',
    earnings: 'KES 40,000/month',
    deliveries: '800+',
    rating: 4.9,
    quote: 'Best decision I made. Great pay, flexible hours, and amazing community.'
  },
];

// Requirements
const requirements = [
  {
    icon: Bike,
    title: 'Reliable Vehicle',
    description: 'Motorcycle, bicycle, car, or truck in good condition',
    details: 'Must have valid insurance and registration',
    iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-500'
  },
  {
    icon: IdCard,
    title: 'Valid ID & License',
    description: 'National ID and valid driving/rider license',
    details: 'Motorcycle license for bikes, driving license for cars/trucks',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-500'
  },
  {
    icon: Smartphone,
    title: 'Smartphone',
    description: 'Android or iOS smartphone with internet',
    details: 'For navigation and app updates',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-500'
  },
  {
    icon: MapPin,
    title: 'Valid Location',
    description: 'Based in any major town or city',
    details: 'Must be able to operate within service areas',
    iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-500'
  },
];

// FAQ items
const faqs = [
  {
    question: 'How do I become a rider?',
    answer: 'Simply click on "Become a Rider" in the main menu, fill out the application form, and our team will review your application within 24-48 hours. You\'ll receive training and onboarding materials once approved.'
  },
  {
    question: 'How much can I earn as a rider?',
    answer: 'Earnings vary based on deliveries completed, distance, and performance bonuses. On average, riders earn KES 500-1,500 per day. Full-time riders can earn KES 40,000-60,000+ monthly, while part-time riders earn KES 15,000-25,000 monthly.'
  },
  {
    question: 'When do I get paid?',
    answer: 'You can withdraw your earnings daily to your M-Pesa account. Payments are processed instantly and you can withdraw any amount at any time.'
  },
  {
    question: 'What equipment do I need?',
    answer: 'You need a reliable vehicle (motorcycle, bicycle, car, or truck), a smartphone with internet, and a valid license. We provide branded rider gear including helmet, jacket, and phone mount.'
  },
  {
    question: 'Do I need insurance?',
    answer: 'We provide comprehensive insurance coverage while you\'re on delivery. This includes accident insurance, vehicle protection, and third-party liability coverage at no cost to you.'
  },
  {
    question: 'Can I choose my working hours?',
    answer: 'Absolutely! There are no fixed hours or minimum requirements. You can log in and start delivering whenever you want, and take breaks whenever you need.'
  }
];

// Platform features
const platformFeatures = [
  {
    icon: Navigation,
    title: 'Smart Route Optimization',
    description: 'AI-powered routes to minimize travel time and maximize deliveries',
  },
  {
    icon: MessageCircle,
    title: 'In-App Communication',
    description: 'Direct chat with customers and support team',
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'Track your earnings, ratings, and delivery statistics',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    description: 'Real-time navigation and delivery tracking',
  },
];

export default function RiderBenefitsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'earnings' | 'requirements'>('earnings');
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBecomeRider = () => {
    if (user) {
      router.push('/become-rider');
    } else {
      router.push('/login?redirect=/become-rider');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-alt)] to-[var(--color-primary-soft)]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" />
          <Bike className="absolute bottom-0 right-0 w-64 h-64 text-white opacity-20 transform -translate-x-1/2" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-in slide-in-from-top">
              <Bike className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Join Our Delivery Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Become a Rider with{' '}
              <span className="inline-block animate-bounce-subtle">Shaddyna</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join Kenya's fastest-growing delivery network. Enjoy flexible hours, competitive pay, and amazing benefits. Start earning today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBecomeRider}
                className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 group"
              >
                Apply to Become a Rider
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#benefits"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                View Benefits
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
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">2,500+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Active Riders</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">100K+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Deliveries/Month</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">KES 15M+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Paid to Riders</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">4.8★</div>
              <div className="text-sm text-[var(--color-text-muted)]">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Why Ride with <span className="text-[var(--color-primary)]">Shaddyna</span>?
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Discover the perks and advantages of being part of our delivery fleet
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
                  <p className="text-sm text-[var(--color-text-muted)] mb-2">
                    {benefit.details}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                    <span className="text-lg font-bold text-[var(--color-primary)]">{benefit.stats}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Earnings Breakdown */}
      <section className="py-20 bg-[var(--color-primary-soft)]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Earnings Breakdown
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              See how you can maximize your earnings with our transparent payment structure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earningsBreakdown.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`bg-gradient-to-r ${item.gradient} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-1">{item.title}</h3>
                  <p className="text-2xl font-bold text-[var(--color-primary)] mb-2">{item.amount}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Potential Monthly Earnings</h3>
            <p className="text-4xl font-bold mb-4">KES 40,000 - 80,000+</p>
            <p className="text-white/90">Based on full-time work with bonuses and incentives</p>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              What You Need to Get Started
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Simple requirements to become a Shaddyna rider
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, index) => {
              const Icon = req.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`p-3 rounded-xl ${req.iconBg} w-fit mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${req.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{req.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-2">{req.description}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{req.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-20 bg-[var(--color-primary-soft)]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Exclusive Rider Perks
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Enjoy additional benefits and rewards as part of our community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--color-surface)] transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-[var(--color-primary-soft)]/20 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${perk.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">{perk.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{perk.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Technology at Your Fingertips
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Our rider app makes deliveries simple and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-[var(--color-primary-soft)]/10 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-[var(--color-primary-soft)]/20 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{feature.description}</p>
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
              Rider Success Stories
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Real stories from riders who transformed their lives
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] flex items-center justify-center text-white font-bold text-lg">
                    {story.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">{story.name}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{story.role}</p>
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
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Monthly Earnings</p>
                    <p className="text-sm font-bold text-[var(--color-primary)]">{story.earnings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Deliveries</p>
                    <p className="text-sm font-bold text-[var(--color-text)]">{story.deliveries}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] px-2 py-1 rounded-full">
                    {story.achievement}
                  </span>
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
              Everything you need to know about becoming a rider
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
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our growing team of professional riders and start earning today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBecomeRider}
              className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 group"
            >
              Apply Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/contact"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              Contact Support
              <Phone className="w-5 h-5" />
            </a>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No registration fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Start earning immediately</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free training provided</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}