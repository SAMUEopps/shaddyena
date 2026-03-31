// app/returns/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  Gift,
  FileText,
  AlertCircle,
  Shield,
  Truck,
  CreditCard,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  RefreshCw,
  UserCheck,
  ThumbsUp,
  HelpCircle,
  BarChart3,
  Star
} from 'lucide-react';
import Link from 'next/link';

const ReturnsPolicyPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('process');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [returnRequestStep, setReturnRequestStep] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return Process Steps
  const returnSteps = [
    {
      step: 1,
      title: 'Request Return',
      description: 'Submit a return request through your account',
      icon: <FileText className="w-8 h-8" />,
      details: 'Go to "My Orders", select the item, and click "Return Item". Provide reason and photos if applicable.',
      timeframe: 'Within 14 days of delivery',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Get Approval',
      description: 'Our team reviews your request',
      icon: <UserCheck className="w-8 h-8" />,
      details: 'You\'ll receive email confirmation within 24-48 hours with return authorization and instructions.',
      timeframe: '24-48 hours',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 3,
      title: 'Ship Back Item',
      description: 'Pack and return the item',
      icon: <Package className="w-8 h-8" />,
      details: 'Use original packaging, include all accessories, and use provided return label if applicable.',
      timeframe: '7 days after approval',
      color: 'from-orange-500 to-red-500'
    },
    {
      step: 4,
      title: 'Quality Check',
      description: 'Item inspection',
      icon: <Shield className="w-8 h-8" />,
      details: 'We verify the item meets return conditions (unused, original condition).',
      timeframe: '3-5 business days',
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: 5,
      title: 'Refund Processed',
      description: 'Money returned to you',
      icon: <CreditCard className="w-8 h-8" />,
      details: 'Refund issued to original payment method. M-Pesa is instant, cards take 5-10 business days.',
      timeframe: '3-10 business days',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  // Non-returnable items
  const nonReturnableItems = [
    {
      category: 'Perishable Goods',
      items: ['Fresh food', 'Flowers', 'Prepared meals', 'Frozen items'],
      icon: <AlertCircle className="w-5 h-5" />,
      reason: 'Due to health and safety regulations'
    },
    {
      category: 'Personal Care',
      items: ['Cosmetics', 'Perfumes', 'Hygiene products', 'Underwear', 'Swimwear'],
      icon: <AlertCircle className="w-5 h-5" />,
      reason: 'Hygiene reasons - cannot be resold'
    },
    {
      category: 'Digital Products',
      items: ['Gift cards', 'Vouchers', 'Software licenses', 'e-books'],
      icon: <Gift className="w-5 h-5" />,
      reason: 'Digital items are final sale'
    },
    {
      category: 'Custom Items',
      items: ['Personalized gifts', 'Custom prints', 'Made-to-order products'],
      icon: <Package className="w-5 h-5" />,
      reason: 'Made specifically for you'
    }
  ];

  // Return FAQs
  const returnFaqs = [
    {
      id: 'timeframe',
      question: 'How long do I have to return an item?',
      answer: 'You have 14 days from the date of delivery to initiate a return. Items must be shipped back within 7 days after return approval. We recommend initiating returns as soon as possible to ensure timely processing.',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'condition',
      question: 'What condition must items be in for return?',
      answer: 'Items must be unused, unwashed, and in original packaging with all tags attached. We reserve the right to refuse returns that show signs of wear, use, or damage. Electronics must be returned with all original accessories and packaging.',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'shipping-cost',
      question: 'Who pays for return shipping?',
      answer: 'Return shipping costs are customer\'s responsibility unless the item is defective, damaged, or incorrect. For defective items, we provide a free return label. Standard return shipping costs KES 150-500 depending on location.',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'refund-time',
      question: 'How long does a refund take?',
      answer: 'Once we receive and inspect your return (3-5 business days), refunds are processed within 3-10 business days. M-Pesa refunds are instant, credit cards take 5-10 business days, and PayPal refunds take 3-5 business days.',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 'partial-refund',
      question: 'Can I get a partial refund?',
      answer: 'Yes, partial refunds are issued for: items returned without original packaging, items with minor damage not reported, or missing accessories. We\'ll notify you of any partial refunds before processing.',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      id: 'exchange',
      question: 'Can I exchange an item instead of refund?',
      answer: 'Yes! We offer exchanges for size, color, or similar items. Initiate a return request and select "Exchange" as your preferred resolution. We\'ll process the exchange once we receive your return. Additional shipping may apply.',
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      id: 'damaged',
      question: 'What if I received a damaged item?',
      answer: 'Contact us immediately within 48 hours of delivery. Take photos of the damage and packaging. We\'ll arrange a free return and send a replacement or full refund. Our support team is available 24/7 for damaged item claims.',
      icon: <AlertCircle className="w-5 h-5" />
    }
  ];

  // Refund Statistics
  const refundStats = [
    { label: 'Average Processing Time', value: '2-3 days', icon: <Clock className="w-4 h-4" /> },
    { label: 'Customer Satisfaction', value: '96%', icon: <Star className="w-4 h-4" /> },
    { label: 'Successful Returns', value: '98%', icon: <ThumbsUp className="w-4 h-4" /> },
    { label: 'M-Pesa Refund Speed', value: 'Instant', icon: <CreditCard className="w-4 h-4" /> }
  ];

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
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
              <RotateCcw className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Returns & Refunds
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Shop with confidence - Easy returns, fast refunds
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <RefreshCw className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">14-day return window</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Full refund guaranteed</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">100% satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {refundStats.map((stat, idx) => (
            <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group">
              <div className="inline-flex p-2 bg-[var(--color-primary)]/10 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Return Process Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">
            Simple Return Process
          </h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12">
            Follow these 5 easy steps to return your item
          </p>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)] to-[var(--color-primary)]/20 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {returnSteps.map((step, idx) => (
                <div key={step.step} className="relative group">
                  <div className="bg-[var(--color-surface)] rounded-xl p-6 text-center border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 h-full">
                    {/* Step Number Badge */}
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {step.step}
                    </div>
                    
                    <div className="mt-4 mb-4 flex justify-center">
                      <div className={`p-3 bg-gradient-to-r ${step.color} rounded-2xl text-white group-hover:scale-110 transition-transform`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-3">
                      {step.description}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                      <div className="flex items-center justify-center space-x-2 text-xs text-[var(--color-primary)] mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{step.timeframe}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Flow Diagram */}
        <div className="mb-16 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6 text-center">
            Return Journey
          </h3>
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {['Request', 'Approval', 'Return', 'Inspect', 'Refund'].map((stage, idx) => (
                <div key={stage} className="flex-1 w-full">
                  <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center relative group hover:shadow-lg transition-all">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${idx <= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'} group-hover:scale-110`}>
                        {idx === 0 && <FileText className="w-6 h-6" />}
                        {idx === 1 && <UserCheck className="w-6 h-6" />}
                        {idx === 2 && <Package className="w-6 h-6" />}
                        {idx === 3 && <Shield className="w-6 h-6" />}
                        {idx === 4 && <CreditCard className="w-6 h-6" />}
                      </div>
                      <p className="font-medium text-[var(--color-text)]">{stage}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {idx === 0 && '24/7 online'}
                        {idx === 1 && '24-48 hours'}
                        {idx === 2 && '7 days'}
                        {idx === 3 && '3-5 days'}
                        {idx === 4 && 'Instant-10 days'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Arrow Indicators */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 flex justify-between px-8 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <ArrowRight key={i} className="w-6 h-6 text-[var(--color-primary)] opacity-50" />
              ))}
            </div>
          </div>
        </div>

        {/* Eligibility & Conditions Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-[var(--color-border)] mb-8">
            <button
              onClick={() => setActiveTab('process')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'process'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Return Conditions
              {activeTab === 'process' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('exceptions')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'exceptions'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Non-Returnable Items
              {activeTab === 'exceptions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
          </div>

          {activeTab === 'process' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Eligibility Section */}
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">Return Eligibility</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--color-text-muted)]">Within 14 days of delivery date</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--color-text-muted)]">Item must be unused and in original condition</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--color-text-muted)]">All original tags and packaging included</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--color-text-muted)]">Proof of purchase required</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--color-text-muted)]">Defective items qualify for free return shipping</span>
                  </li>
                </ul>
              </div>

              {/* Refund Methods */}
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">Refund Methods</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex-shrink-0">
                      <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text)]">M-Pesa</p>
                      <p className="text-sm text-[var(--color-text-muted)]">Instant refund to your M-Pesa account</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex-shrink-0">
                      <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text)]">Credit/Debit Card</p>
                      <p className="text-sm text-[var(--color-text-muted)]">5-10 business days to your card</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex-shrink-0">
                      <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text)]">Store Credit</p>
                      <p className="text-sm text-[var(--color-text-muted)]">Immediate credit + 5% bonus on your next purchase</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-[var(--color-primary)]/5 rounded-lg">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-primary)]">Note:</strong> Store credit never expires and can be used with any vendor
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exceptions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nonReturnableItems.map((item, idx) => (
                <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all group">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-[var(--color-text)]">{item.category}</h3>
                  </div>
                  <ul className="space-y-2 mb-3">
                    {item.items.map((subItem, subIdx) => (
                      <li key={subIdx} className="text-sm text-[var(--color-text-muted)] flex items-center space-x-2">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span>{subItem}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3 mt-2">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {returnFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-[var(--color-primary)]">{faq.icon}</div>
                    <h3 className="font-semibold text-[var(--color-text)]">{faq.question}</h3>
                  </div>
                  {openFaq === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-[var(--color-primary)]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                  )}
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-4 pt-2 border-t border-[var(--color-border)] bg-[var(--color-background-soft)]/50 animate-slide-in">
                    <p className="text-[var(--color-text-muted)]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/orders" className="group bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-[var(--color-primary)]" />
              <ArrowRight className="w-5 h-5 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">My Orders</h3>
            <p className="text-sm text-[var(--color-text-muted)]">View and manage your orders, initiate returns</p>
          </Link>

          <Link href="/contact" className="group bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-[var(--color-primary)]" />
              <ArrowRight className="w-5 h-5 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Need Help?</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Contact our support team for assistance</p>
          </Link>

          <Link href="/faq" className="group bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <HelpCircle className="w-8 h-8 text-[var(--color-primary)]" />
              <ArrowRight className="w-5 h-5 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">More Questions</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Visit our comprehensive FAQ section</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicyPage;