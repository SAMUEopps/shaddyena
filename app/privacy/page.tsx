// app/privacy-policy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  Server,
  Users,
  BarChart3,
  CreditCard,
  MapPin,
  Smartphone,
  Laptop,
  Clock,
  Download,
  Settings,
  Trash2,
  Globe,
  Link2,
  Share2,
  FileCheck,
  Award,
  Bell,
  Search,
  MessageCircle,
  ShoppingBag,
  Target,
  Truck
} from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('April 1, 2024');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation sections for quick access
  const sections = [
    { id: 'introduction', title: 'Introduction', icon: <FileText className="w-4 h-4" /> },
    { id: 'information', title: 'Information We Collect', icon: <Database className="w-4 h-4" /> },
    { id: 'usage', title: 'How We Use Your Information', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sharing', title: 'Data Sharing', icon: <Share2 className="w-4 h-4" /> },
    { id: 'rights', title: 'Your Rights', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'retention', title: 'Data Retention', icon: <Clock className="w-4 h-4" /> },
    { id: 'security', title: 'Security Measures', icon: <Lock className="w-4 h-4" /> },
    { id: 'cookies', title: 'Cookies', icon: <Cookie className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact Us', icon: <Mail className="w-4 h-4" /> }
  ];

  const [activeSection, setActiveSection] = useState('introduction');

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-4">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] text-sm">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
              <h3 className="font-semibold text-[var(--color-text)] mb-3 px-3">On this page</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background-soft)]'
                    }`}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Introduction
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] space-y-4">
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  At Shaddyna ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform, website, and services.
                </p>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  By using Shaddyna, you consent to the data practices described in this policy. Please read this policy carefully to understand our practices regarding your personal data.
                </p>
                <div className="bg-[var(--color-primary)]/5 rounded-lg p-4 border-l-4 border-[var(--color-primary)]">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-primary)]">Important:</strong> This policy applies to all users of Shaddyna, including customers, vendors, delivery partners, and visitors. If you have any questions about this policy, please contact us at <a href="mailto:privacy@shaddyna.com" className="text-[var(--color-primary)]">privacy@shaddyna.com</a>.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="information" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Information We Collect
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Personal Information</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Name, email address, phone number</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Shipping and billing addresses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Date of birth and identification (for vendors)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Payment information (processed securely)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Server className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Technical Information</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>IP address and device information</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Browser type and operating system</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Cookies and tracking technologies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Usage data and browsing behavior</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                    <h3 className="font-semibold text-[var(--color-text)]">Transaction Information</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Order history and purchase details</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Payment status and transaction IDs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Delivery and tracking information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Returns and refund history</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="usage" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                How We Use Your Information
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: <ShoppingBag className="w-5 h-5" />, title: 'Order Processing', desc: 'Process and fulfill your orders, including payments and delivery' },
                    { icon: <MessageCircle className="w-5 h-5" />, title: 'Customer Support', desc: 'Respond to your inquiries and provide assistance' },
                    { icon: <Bell className="w-5 h-5" />, title: 'Communication', desc: 'Send order confirmations, updates, and promotional offers' },
                    { icon: <BarChart3 className="w-5 h-5" />, title: 'Personalization', desc: 'Customize your shopping experience and recommendations' },
                    { icon: <Shield className="w-5 h-5" />, title: 'Fraud Prevention', desc: 'Detect and prevent fraudulent activities' },
                    { icon: <Search className="w-5 h-5" />, title: 'Platform Improvement', desc: 'Analyze usage to improve our services' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors">
                      <div className="text-[var(--color-primary)]">{item.icon}</div>
                      <div>
                        <h4 className="font-medium text-[var(--color-text)]">{item.title}</h4>
                        <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section id="sharing" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Data Sharing
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] space-y-4">
                <p className="text-[var(--color-text-muted)]">
                  We share your information with trusted third parties to provide and improve our services:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Payment Processors</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">Safaricom M-Pesa, Visa, Mastercard, PayPal</p>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Shipping Partners</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">G4S, DHL, Swift Logistics, Fargo</p>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Analytics Providers</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">Google Analytics, Facebook Pixel</p>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Vendors</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">Order details shared with sellers for fulfillment</p>
                  </div>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-4 border-l-4 border-amber-500">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong className="text-amber-500">Note:</strong> We never sell your personal information to third parties. All data sharing is strictly for service delivery and legal compliance.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="rights" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Your Rights
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: <Eye className="w-5 h-5" />, title: 'Access', desc: 'Request a copy of your personal data' },
                    { icon: <FileCheck className="w-5 h-5" />, title: 'Rectification', desc: 'Correct inaccurate or incomplete data' },
                    { icon: <Trash2 className="w-5 h-5" />, title: 'Deletion', desc: 'Request deletion of your data (Right to be forgotten)' },
                    { icon: <Download className="w-5 h-5" />, title: 'Portability', desc: 'Receive your data in a portable format' },
                    { icon: <Settings className="w-5 h-5" />, title: 'Opt-out', desc: 'Unsubscribe from marketing communications' },
                    { icon: <AlertCircle className="w-5 h-5" />, title: 'Restrict', desc: 'Limit how we use your data' }
                  ].map((right, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[var(--color-background-soft)] transition-colors">
                      <div className="text-[var(--color-primary)]">{right.icon}</div>
                      <div>
                        <h4 className="font-medium text-[var(--color-text)]">{right.title}</h4>
                        <p className="text-sm text-[var(--color-text-muted)]">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[var(--color-primary)]/5 rounded-lg p-4">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    To exercise any of these rights, contact us at <a href="mailto:privacy@shaddyna.com" className="text-[var(--color-primary)]">privacy@shaddyna.com</a>.
                    We will respond within 30 days as required by data protection laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section id="retention" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Data Retention
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] space-y-4">
                <p className="text-[var(--color-text-muted)]">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy:
                </p>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  <li className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                    <span><strong className="text-[var(--color-text)]">Account Information:</strong> Retained while your account is active and for 5 years after closure for legal and tax purposes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                    <span><strong className="text-[var(--color-text)]">Transaction Data:</strong> Retained for 7 years as required by tax laws</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                    <span><strong className="text-[var(--color-text)]">Marketing Data:</strong> Retained until you unsubscribe or request deletion</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                    <span><strong className="text-[var(--color-text)]">Usage Data:</strong> Anonymized after 12 months</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Security Measures */}
            <section id="security" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Security Measures
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Lock className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Data Protection</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>SSL/TLS encryption for all data transmission</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>PCI DSS compliant payment processing</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Regular security audits and penetration testing</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-text)]">Access Controls</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Role-based access to sensitive data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Multi-factor authentication for staff</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Regular security training for employees</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Cookies & Tracking
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] space-y-4">
                <p className="text-[var(--color-text-muted)]">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-3 text-center">
                    <Cookie className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                    <h4 className="font-medium text-[var(--color-text)] text-sm">Essential Cookies</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">Required for basic site functionality</p>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-3 text-center">
                    <BarChart3 className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                    <h4 className="font-medium text-[var(--color-text)] text-sm">Analytics Cookies</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">Help us understand user behavior</p>
                  </div>
                  <div className="bg-[var(--color-background-soft)] rounded-lg p-3 text-center">
                    <Target className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                    <h4 className="font-medium text-[var(--color-text)] text-sm">Marketing Cookies</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">Personalize ads and promotions</p>
                  </div>
                </div>
                <div className="bg-[var(--color-primary)]/5 rounded-lg p-4">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    You can manage your cookie preferences in your browser settings. For detailed information, please see our{' '}
                    <Link href="/cookies" className="text-[var(--color-primary)] hover:underline">
                      Cookies Policy
                    </Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
                Contact Us
              </h2>
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <p className="text-[var(--color-text-muted)] mb-6">
                  If you have questions about this Privacy Policy or how we handle your data, please contact our Data Protection Officer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      <a href="mailto:privacy@shaddyna.com" className="text-[var(--color-text)] hover:text-[var(--color-primary)]">privacy@shaddyna.com</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                      <a href="tel:+254700000000" className="text-[var(--color-text)] hover:text-[var(--color-primary)]">+254 700 000 000</a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
                      <span className="text-[var(--color-text-muted)]">Westlands Business Park, 3rd Floor<br />Nairobi, Kenya</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
                      <span className="text-[var(--color-text-muted)]">Response Time: Within 2 business days</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)] text-center">
                    This Privacy Policy was last updated on {lastUpdated}. We may update this policy from time to time. 
                    Continued use of Shaddyna after changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;