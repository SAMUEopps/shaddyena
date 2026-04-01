// app/hiring/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  MessageCircle,
  FileText,
  Search,
  Filter,
  Eye,
  Clock,
  DollarSign,
  Calendar,
  BarChart3,
  Award,
  Rocket,
  Zap,
  Target,
  Building,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Laptop,
  Coffee,
  Heart,
  Gift,
  Crown,
  Download
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HiringPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [activeTab, setActiveTab] = useState('employers');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hiring Process Steps
  const hiringSteps = [
    {
      step: 1,
      title: 'Create Account',
      description: 'Sign up as an employer and verify your business',
      icon: <Users className="w-8 h-8" />,
      details: 'Provide your company details, verify email, and complete business verification.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Post Job',
      description: 'Create detailed job listings with requirements',
      icon: <FileText className="w-8 h-8" />,
      details: 'Add job title, description, requirements, salary range, and location.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 3,
      title: 'Review Applicants',
      description: 'Browse qualified candidates',
      icon: <Users className="w-8 h-8" />,
      details: 'Review applications, filter by skills, and shortlist top candidates.',
      color: 'from-orange-500 to-red-500'
    },
    {
      step: 4,
      title: 'Interview & Hire',
      description: 'Connect with candidates and make offers',
      icon: <MessageCircle className="w-8 h-8" />,
      details: 'Schedule interviews, negotiate terms, and hire the perfect candidate.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Pricing Plans
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'KES 2,999',
      period: 'per job post',
      description: 'Perfect for small businesses testing the platform',
      features: [
        '1 active job post',
        '30 days listing duration',
        'Basic applicant tracking',
        'Email support',
        'Standard visibility',
        'Applicant analytics'
      ],
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-gray-500 to-gray-600',
      recommended: false,
      buttonText: 'Get Started',
      badge: ''
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'KES 7,999',
      period: 'per month',
      description: 'Most popular for growing businesses',
      features: [
        '5 active job posts',
        '90 days listing duration',
        'Advanced applicant tracking',
        'Priority support',
        'Featured job placement',
        'Advanced analytics',
        'Candidate matching',
        'Video interviews'
      ],
      icon: <Star className="w-8 h-8" />,
      color: 'from-[var(--color-primary)] to-[var(--color-primary-alt)]',
      recommended: true,
      buttonText: 'Start Free Trial',
      badge: 'MOST POPULAR'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored solutions',
      description: 'For large organizations with high-volume hiring',
      features: [
        'Unlimited job posts',
        'Unlimited listing duration',
        'Dedicated account manager',
        '24/7 priority support',
        'API access',
        'Custom branding',
        'Bulk hiring tools',
        'ATS integration',
        'Recruitment analytics dashboard'
      ],
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      recommended: false,
      buttonText: 'Contact Sales',
      badge: 'BEST VALUE'
    }
  ];

  // Success Stories
  const successStories = [
    {
      company: 'TechZone Kenya',
      logo: '🚀',
      industry: 'Electronics Retail',
      hiringNeeds: 'Needed 5 tech support specialists for rapid expansion',
      result: 'Hired 4 candidates within 2 weeks, reduced response time by 60%',
      testimonial: 'Shaddyna Hiring helped us find qualified tech support staff quickly. The candidate quality was exceptional!',
      name: 'James Mwangi',
      role: 'HR Manager',
      rating: 5
    },
    {
      company: 'FreshBasket',
      logo: '🛒',
      industry: 'Grocery Delivery',
      hiringNeeds: 'Hired 20 delivery riders for Nairobi expansion',
      result: 'All positions filled in 3 weeks, delivery capacity increased by 200%',
      testimonial: 'The platform made it easy to find reliable riders. The screening tools saved us so much time!',
      name: 'Grace Wanjiku',
      role: 'Operations Director',
      rating: 5
    },
    {
      company: 'CreativeHub',
      logo: '🎨',
      industry: 'Digital Agency',
      hiringNeeds: 'Looking for freelance graphic designers and content writers',
      result: 'Built a network of 15+ freelancers, project completion rate 95%',
      testimonial: 'Perfect platform for finding talented freelancers. The quality and professionalism are top-notch.',
      name: 'Kevin Omondi',
      role: 'Creative Director',
      rating: 5
    }
  ];

  // Top Employers
  const topEmployers = [
    { name: 'Safaricom', industry: 'Telecom', jobs: 12, logo: '📱', rating: 4.8 },
    { name: 'KCB Bank', industry: 'Banking', jobs: 8, logo: '🏦', rating: 4.7 },
    { name: 'Jumia Kenya', industry: 'E-commerce', jobs: 15, logo: '📦', rating: 4.6 },
    { name: 'Twiga Foods', industry: 'Agri-tech', jobs: 6, logo: '🌾', rating: 4.9 },
    { name: 'Airtel Kenya', industry: 'Telecom', jobs: 10, logo: '📡', rating: 4.5 },
    { name: 'Equity Bank', industry: 'Banking', jobs: 7, logo: '💰', rating: 4.7 }
  ];

  // Freelance Marketplace Info
  const freelanceStats = [
    { value: '5,000+', label: 'Freelancers', icon: <Users className="w-5 h-5" /> },
    { value: '1,200+', label: 'Gigs Posted', icon: <Briefcase className="w-5 h-5" /> },
    { value: '95%', label: 'Completion Rate', icon: <CheckCircle className="w-5 h-5" /> },
    { value: '48h', label: 'Avg Response', icon: <Clock className="w-5 h-5" /> }
  ];

  const freelanceCategories = [
    { name: 'Web Development', count: 450, icon: <Laptop className="w-5 h-5" /> },
    { name: 'Graphic Design', count: 380, icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Content Writing', count: 320, icon: <FileText className="w-5 h-5" /> },
    { name: 'Digital Marketing', count: 290, icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Data Entry', count: 210, icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Customer Support', count: 180, icon: <MessageCircle className="w-5 h-5" /> }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-20 md:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Briefcase className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6">
              Find Top Talent on <span className="text-[var(--color-primary)]">Shaddyna</span>
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-8 leading-relaxed">
              Connect with qualified professionals, freelancers, and vendors to grow your business
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#post-job"
                className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all hover:scale-105"
              >
                Post a Job
              </Link>
              <Link
                href="#find-talent"
                className="px-8 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-semibold hover:border-[var(--color-primary)] transition-all"
              >
                Find Talent
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs: Employers / Freelancers */}
        <div className="mb-12">
          <div className="flex border-b border-[var(--color-border)] mb-8">
            <button
              onClick={() => setActiveTab('employers')}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'employers'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              For Employers
              {activeTab === 'employers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'freelancers'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              For Freelancers
              {activeTab === 'freelancers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
          </div>

          {activeTab === 'employers' ? (
            <div className="space-y-16">
              {/* How It Works Section */}
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">How It Works</h2>
                <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
                  Post jobs, find candidates, and hire in just 4 simple steps
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hiringSteps.map((step) => (
                    <div key={step.step} className="group relative">
                      <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl h-full">
                        <div className={`absolute -top-3 left-6 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                          {step.step}
                        </div>
                        <div className="mt-4 mb-4">
                          <div className={`inline-flex p-3 bg-gradient-to-r ${step.color} rounded-xl text-white group-hover:scale-110 transition-transform`}>
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{step.title}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] mb-3">{step.description}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Plans */}
              <div id="post-job" className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Simple, Transparent Pricing</h2>
                <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
                  Choose the plan that works best for your hiring needs
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {pricingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative bg-[var(--color-surface)] rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                        plan.recommended
                          ? 'border-[var(--color-primary)] shadow-lg scale-105'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                          {plan.badge}
                        </div>
                      )}
                      <div className="p-6 text-center">
                        <div className={`inline-flex p-3 bg-gradient-to-r ${plan.color} rounded-xl mb-4 text-white`}>
                          {plan.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{plan.name}</h3>
                        <div className="mb-3">
                          <span className="text-3xl font-bold text-[var(--color-text)]">{plan.price}</span>
                          <span className="text-[var(--color-text-muted)]">/{plan.period}</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-4">{plan.description}</p>
                        <ul className="space-y-2 mb-6 text-left">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={plan.id === 'enterprise' ? '/contact' : '/hiring/post'}
                          className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                            plan.recommended
                              ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                              : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                          }`}
                        >
                          {plan.buttonText}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Stories */}
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Success Stories</h2>
                <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
                  See how businesses like yours found top talent through Shaddyna
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {successStories.map((story, idx) => (
                    <div key={idx} className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-3xl">{story.logo}</div>
                        <div>
                          <h3 className="font-bold text-[var(--color-text)]">{story.company}</h3>
                          <p className="text-xs text-[var(--color-text-muted)]">{story.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-3 italic">"{story.testimonial}"</p>
                      <div className="border-t border-[var(--color-border)] pt-3 mt-3">
                        <p className="text-xs text-[var(--color-primary)] font-medium mb-1">Hiring Need:</p>
                        <p className="text-sm text-[var(--color-text)] mb-2">{story.hiringNeeds}</p>
                        <p className="text-xs text-green-500 font-medium">Result: {story.result}</p>
                      </div>
                      <div className="mt-3 pt-2">
                        <p className="text-xs text-[var(--color-text-muted)]">- {story.name}, {story.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Employers */}
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Top Employers on Shaddyna</h2>
                <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
                  Join these trusted companies already hiring through our platform
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {topEmployers.map((employer, idx) => (
                    <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group">
                      <div className="text-3xl mb-2">{employer.logo}</div>
                      <h3 className="font-semibold text-[var(--color-text)] text-sm">{employer.name}</h3>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{employer.industry}</p>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-[var(--color-text)]">{employer.rating}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">• {employer.jobs} jobs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Freelance Marketplace Section */}
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Freelance Marketplace</h2>
                <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
                  Connect with talented freelancers for your projects
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {freelanceStats.map((stat, idx) => (
                    <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)]">
                      <div className="inline-flex p-2 bg-[var(--color-primary)]/10 rounded-lg mb-2">
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-6 border border-[var(--color-border)]">
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Popular Categories</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {freelanceCategories.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                          <div className="flex items-center space-x-2">
                            {cat.icon}
                            <span className="text-sm text-[var(--color-text)]">{cat.name}</span>
                          </div>
                          <span className="text-xs text-[var(--color-primary)]">{cat.count}+ freelancers</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Why Hire Freelancers?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--color-text-muted)]">Cost-effective - pay only for work done</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--color-text-muted)]">Access to global talent pool</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--color-text-muted)]">Flexible engagement - hourly or project-based</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--color-text-muted)]">Scale your team up or down as needed</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--color-text-muted)]">No long-term commitment required</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Hire Freelancers */}
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">How to Hire Freelancers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-bold text-[var(--color-text)] mb-2">1. Post a Gig</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Describe your project, budget, and timeline</p>
                  </div>
                  <div className="text-center p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-bold text-[var(--color-text)] mb-2">2. Review Proposals</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Get applications from qualified freelancers</p>
                  </div>
                  <div className="text-center p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-bold text-[var(--color-text)] mb-2">3. Hire & Collaborate</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Select your freelancer and start working</p>
                  </div>
                </div>
              </div>

              {/* Success Stories - Freelancers */}
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Freelancer Success Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        JM
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text)]">John Mwangi</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Web Developer</p>
                      </div>
                    </div>
                    <p className="text-[var(--color-text-muted)] mb-3">
                      "I've completed over 50 projects through Shaddyna. The platform connects me with quality clients who value my work. My income has tripled!"
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-[var(--color-text)]">5.0 rating</span>
                      <span className="text-[var(--color-text-muted)]">• 50+ projects</span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        SK
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text)]">Sarah Kimani</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Graphic Designer</p>
                      </div>
                    </div>
                    <p className="text-[var(--color-text-muted)] mb-3">
                      "Shaddyna has been a game-changer for my freelance career. I now work with amazing brands and have a steady stream of projects."
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-[var(--color-text)]">4.9 rating</span>
                      <span className="text-[var(--color-text-muted)]">• 100+ projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Next Great Hire?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join hundreds of businesses already using Shaddyna to build their teams
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/hiring/post"
              className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
            >
              Post a Job for Free
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringPage;