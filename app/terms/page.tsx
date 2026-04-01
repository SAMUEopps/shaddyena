// app/terms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  UserCheck,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Scale,
  Gavel,
  XCircle,
  CheckCircle,
  BookOpen,
  Eye,
  Lock,
  Users,
  Store,
  Truck,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  Printer,
  Clock,
  DollarSign,
  Building,
  FileCheck,
  Heart,
  Star,
  Award,
  HelpCircle,
  Cookie,
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

const TermsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('acceptance');
  const [lastUpdated, setLastUpdated] = useState('April 1, 2024');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Terms sections
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileCheck className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            By accessing or using the Shaddyna marketplace platform ("Shaddyna," "we," "our," or "us"), including our website, mobile applications, and related services (collectively, the "Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Platform.
          </p>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            These Terms constitute a legally binding agreement between you and Shaddyna. We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Platform after any changes constitutes your acceptance of the modified Terms.
          </p>
          <div className="bg-amber-500/10 rounded-lg p-4 border-l-4 border-amber-500">
            <p className="text-sm text-[var(--color-text-muted)]">
              <strong className="text-amber-500">Important:</strong> By using Shaddyna, you confirm that you are at least 18 years old and have the legal capacity to enter into this agreement.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'accounts',
      title: 'Accounts & Responsibilities',
      icon: <UserCheck className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Account Registration</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              To access certain features of our Platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Account Security</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to:
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Maintain the confidentiality of your password</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Notify us immediately of any unauthorized access</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Ensure you log out of your account after each session</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Not share your account credentials with others</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Account Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-[var(--color-background-soft)] rounded-lg p-3">
                <ShoppingBag className="w-5 h-5 text-[var(--color-primary)] mb-2" />
                <p className="font-medium text-[var(--color-text)] text-sm">Customer</p>
                <p className="text-xs text-[var(--color-text-muted)]">Buy products from vendors</p>
              </div>
              <div className="bg-[var(--color-background-soft)] rounded-lg p-3">
                <Store className="w-5 h-5 text-[var(--color-primary)] mb-2" />
                <p className="font-medium text-[var(--color-text)] text-sm">Vendor</p>
                <p className="text-xs text-[var(--color-text-muted)]">Sell products on the platform</p>
              </div>
              <div className="bg-[var(--color-background-soft)] rounded-lg p-3">
                <Truck className="w-5 h-5 text-[var(--color-primary)] mb-2" />
                <p className="font-medium text-[var(--color-text)] text-sm">Delivery Partner</p>
                <p className="text-xs text-[var(--color-text-muted)]">Facilitate order deliveries</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'use',
      title: 'Use of Platform',
      icon: <ShoppingBag className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            Shaddyna provides a marketplace connecting buyers, sellers, and delivery partners. You agree to use the Platform in compliance with all applicable laws and regulations.
          </p>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Prohibited Activities</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-2">You may not:</p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Post prohibited or illegal items</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Engage in fraudulent or deceptive practices</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Manipulate prices or reviews</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Use the Platform for unauthorized commercial purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-text-muted)]">Interfere with Platform operations or security</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Vendor Responsibilities</h3>
            <p className="text-[var(--color-text-muted)] text-sm">
              Vendors agree to provide accurate product descriptions, maintain reasonable pricing, fulfill orders promptly, and provide quality customer service. Failure to meet these standards may result in account suspension.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Payment Methods</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              We accept payments via M-Pesa, Visa/Mastercard, PayPal, and bank transfers. All payments are processed securely through our payment partners.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Fees & Charges</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]"><strong>Customers:</strong> Pay product price plus delivery fees. No platform fees.</span>
              </li>
              <li className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]"><strong>Vendors:</strong> Pay subscription fees and sales commissions (5-15% depending on category).</span>
              </li>
              <li className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 text-[var(--color-primary)] mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]"><strong>Delivery Partners:</strong> Earn delivery fees as per agreed rates.</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Cancellations & Refunds</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Orders can be canceled within 15 minutes of placement. Refunds are processed according to our Returns Policy. Refunds typically take 3-10 business days depending on payment method.
            </p>
            <Link href="/returns" className="inline-flex items-center space-x-1 text-sm text-[var(--color-primary)] hover:underline mt-2">
              <span>View Returns Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            All content on the Shaddyna Platform, including text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of Shaddyna or its content suppliers and is protected by Kenyan and international copyright laws.
          </p>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Our Rights</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Shaddyna owns all intellectual property rights in the Platform. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">User Content</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              By posting content on the Platform, you grant Shaddyna a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with our services.
            </p>
          </div>
          <div className="bg-[var(--color-primary)]/5 rounded-lg p-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-primary)]">Trademark Notice:</strong> "Shaddyna" and the Shaddyna logo are registered trademarks. Unauthorized use is prohibited.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Disclaimers & Liability',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Platform as Marketplace</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Shaddyna is a marketplace platform connecting buyers and sellers. We do not manufacture, store, or inspect products. We are not a party to transactions between buyers and sellers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Disclaimer of Warranties</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Limitation of Liability</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHADDYNA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <XCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users of the Platform.
          </p>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Grounds for Termination</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]">Violation of these Terms</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]">Fraudulent or illegal activity</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]">Non-payment of fees</span>
              </li>
              <li className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm text-[var(--color-text-muted)]">Harm to other users or the Platform</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Effects of Termination</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Upon termination, your right to use the Platform will immediately cease. Any pending transactions will be canceled, and outstanding fees become immediately due.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'governing',
      title: 'Governing Law',
      icon: <Gavel className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law provisions.
          </p>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-2">Dispute Resolution</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiations. If unresolved, disputes shall be submitted to binding arbitration in Nairobi, Kenya, in accordance with the Arbitration Act of Kenya.
            </p>
          </div>
          <div className="bg-[var(--color-primary)]/5 rounded-lg p-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-primary)]">Jurisdiction:</strong> You agree that any legal action shall be brought exclusively in the courts of Nairobi, Kenya.
            </p>
          </div>
        </div>
      )
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
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
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6">
              <Scale className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-4">
              Please read these terms carefully before using the Shaddyna platform.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] text-sm">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={() => {
              const text = sections.map(s => `${s.title}\n\n${s.content.props.children.map((c: any) => {
                if (typeof c === 'string') return c;
                return '';
              }).join('\n')}`).join('\n\n');
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'shaddyna-terms.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border]) rounded-lg text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

        {/* Terms Sections - Accordion Style */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--color-background-soft)] transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-[var(--color-primary)]">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    {section.title}
                  </h2>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                )}
              </button>
              
              {expandedSection === section.id && (
                <div className="px-6 pb-6 pt-2 border-t border-[var(--color-border)] bg-[var(--color-background-soft)]/30 animate-slide-in">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl p-6 border border-[var(--color-border)]">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
              <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">Questions About These Terms?</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                If you have any questions about these Terms & Conditions, please contact our legal team:
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:legal@shaddyna.com" className="inline-flex items-center space-x-2 text-sm text-[var(--color-primary)] hover:underline">
                  <Mail className="w-4 h-4" />
                  <span>legal@shaddyna.com</span>
                </a>
                <a href="tel:+254700000000" className="inline-flex items-center space-x-2 text-sm text-[var(--color-primary)] hover:underline">
                  <Phone className="w-4 h-4" />
                  <span>+254 700 000 000</span>
                </a>
                <Link href="/contact" className="inline-flex items-center space-x-2 text-sm text-[var(--color-primary)] hover:underline">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Form</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Policies */}
        <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Related Policies</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="flex items-center space-x-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              <Shield className="w-4 h-4" />
              <span>Privacy Policy</span>
            </Link>
            <Link href="/cookie-policy" className="flex items-center space-x-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              <Cookie className="w-4 h-4" />
              <span>Cookie Policy</span>
            </Link>
            <Link href="/returns" className="flex items-center space-x-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span>Returns Policy</span>
            </Link>
            <Link href="/faq" className="flex items-center space-x-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </Link>
          </div>
        </div>

        {/* Last Updated Notice */}
        <div className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} Shaddyna. All rights reserved.</p>
          <p className="mt-1">These Terms & Conditions were last updated on {lastUpdated}.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;