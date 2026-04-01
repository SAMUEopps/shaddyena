// components/New/components/Footer.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, 
  ArrowUpRight, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitStatus('success');
      setEmail('');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  const footerLinks = {
    shop: [
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Best Sellers', href: '/best-sellers' },
      { name: 'Trending Now', href: '/trending' },
      { name: 'Sale', href: '/sale' },
    ],
    help: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Track Order', href: '/track-order' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers', badge: 'Hiring' },
      { name: 'Hiring', href: '/hiring', },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Cookies', href: '/cookies' },
    ],
  };

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'Orders over $50' },
    { icon: ShieldCheck, title: 'Secure Pay', desc: '100% Protected' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30 Days' },
    { icon: CreditCard, title: 'Gift Cards', desc: 'Available' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="relative bg-[var(--color-background)] text-[var(--color-text)] overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent" />

      {/* Trust Features Bar */}
      <div className="border-b border-[var(--color-border)]/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={feature.title}
                className="flex items-center gap-3 group cursor-default"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--color-text)]">{feature.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <Link href="/" className="inline-block">
                <span className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] bg-clip-text text-transparent">
                  Shaddyna
                </span>
              </Link>
              <p className="mt-4 text-[var(--color-text-muted)] text-sm leading-relaxed max-w-sm">
                Your destination for fashion, lifestyle, and unique finds. Quality products from trusted vendors worldwide.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text)]">
                Stay Updated
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-[var(--color-primary-alt)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'}`} />
                </button>
              </form>
              {submitStatus === 'success' && (
                <p className="text-xs text-green-500 animate-fade-in">
                  Thanks for subscribing!
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <a href="mailto:support@shaddyna.com" className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group">
                <Mail className="w-4 h-4" />
                <span className="group-hover:underline">support@shaddyna.com</span>
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group">
                <Phone className="w-4 h-4" />
                <span className="group-hover:underline">+254 (7) 123-4567-89</span>
              </a>
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, KENYA</span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Shop Links */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text)]">
                  Shop
                </h3>
                <ul className="space-y-3">
                  {footerLinks.shop.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-200 inline-flex items-center gap-1 group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-primary)] transition-all duration-200 ${hoveredLink === link.name ? 'w-full' : 'w-0'}`} />
                        </span>
                        <ArrowUpRight className={`w-3 h-3 transition-all duration-200 ${hoveredLink === link.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help Links */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text)]">
                  Help
                </h3>
                <ul className="space-y-3">
                  {footerLinks.help.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-200 inline-flex items-center gap-1 group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-primary)] transition-all duration-200 ${hoveredLink === link.name ? 'w-full' : 'w-0'}`} />
                        </span>
                        <ArrowUpRight className={`w-3 h-3 transition-all duration-200 ${hoveredLink === link.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text)]">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-200 inline-flex items-center gap-1 group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-primary)] transition-all duration-200 ${hoveredLink === link.name ? 'w-full' : 'w-0'}`} />
                        </span>
                        {link.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full font-medium">
                            {link.badge}
                          </span>
                        )}
                        <ArrowUpRight className={`w-3 h-3 transition-all duration-200 ${hoveredLink === link.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--color-text)]">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-200 inline-flex items-center gap-1 group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-primary)] transition-all duration-200 ${hoveredLink === link.name ? 'w-full' : 'w-0'}`} />
                        </span>
                        <ArrowUpRight className={`w-3 h-3 transition-all duration-200 ${hoveredLink === link.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border)]/50 bg-[var(--color-background-soft)]/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} Shaddyna. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[var(--color-text-muted)] ${social.color} transition-all duration-200 hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                <div 
                  key={method}
                  className="px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[10px] font-medium text-[var(--color-text-muted)]"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Back to top"
      >
        <svg 
          className="w-5 h-5 rotate-180 group-hover:-translate-y-0.5 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Add these animations to your global.css */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;