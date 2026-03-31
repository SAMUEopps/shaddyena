// app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Headphones,
  Users,
  Award,
  Globe,
  ChevronRight,
  Calendar,
  User,
  Building,
  ShoppingBag,
  Truck,
  HelpCircle,
  Star,
  ThumbsUp,
  CreditCard,
  RotateCcw,
  Store
} from 'lucide-react';
import Link from 'next/link';

const ContactPage = () => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
    orderNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: '',
        orderNumber: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  // Contact Information
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      details: ['+254 700 000 000', '+254 711 111 111'],
      hours: '24/7 Available',
      link: 'tel:+254700000000',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: ['support@shaddyna.com', 'vendors@shaddyna.com'],
      hours: 'Response within 24h',
      link: 'mailto:support@shaddyna.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: ['Westlands Business Park', 'Nairobi, Kenya'],
      hours: 'Mon-Fri: 9AM - 6PM',
      link: 'https://maps.google.com',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Support Categories
  const supportCategories = [
    { id: 'general', label: 'General Inquiry', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'orders', label: 'Order Issues', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'payments', label: 'Payment Problems', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'vendor', label: 'Vendor Support', icon: <Store className="w-5 h-5" /> },
    { id: 'delivery', label: 'Delivery Issues', icon: <Truck className="w-5 h-5" /> },
    { id: 'returns', label: 'Returns & Refunds', icon: <RotateCcw className="w-5 h-5" /> }
  ];

  // Office Locations
  const offices = [
    {
      city: 'Nairobi (Headquarters)',
      address: 'Westlands Business Park, 3rd Floor, Nairobi',
      phone: '+254 700 000 000',
      email: 'nairobi@shaddyna.com'
    },
    {
      city: 'Mombasa',
      address: 'Nyali Centre, 2nd Floor, Mombasa',
      phone: '+254 711 111 111',
      email: 'mombasa@shaddyna.com'
    },
    {
      city: 'Kisumu',
      address: 'Kisumu Business Park, Oginga Odinga Road',
      phone: '+254 722 222 222',
      email: 'kisumu@shaddyna.com'
    }
  ];

  // Social Media Links
  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: 'https://facebook.com', color: 'hover:bg-[#1877f2]' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com', color: 'hover:bg-gradient-to-r from-[#e4405f] to-[#f56040]' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com', color: 'hover:bg-[#1da1f2]' },
    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com', color: 'hover:bg-[#ff0000]' }
  ];

  // Quick Stats
  const stats = [
    { value: '24/7', label: 'Support Available', icon: <Clock className="w-5 h-5" /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <ThumbsUp className="w-5 h-5" /> },
    { value: '2h', label: 'Avg Response Time', icon: <Headphones className="w-5 h-5" /> },
    { value: '50K+', label: 'Happy Customers', icon: <Users className="w-5 h-5" /> }
  ];

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
              <Headphones className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              We're Here to Help
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Get in touch with our support team for any questions or assistance
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Fast Response</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Star className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group">
              <div className="inline-flex p-2 bg-[var(--color-primary)]/10 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, idx) => (
            <a
              key={idx}
              href={info.link}
              target={info.link.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl"
            >
              <div className={`inline-flex p-3 bg-gradient-to-r ${info.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <div className="text-white">{info.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-[var(--color-text)] mb-1">{detail}</p>
              ))}
              <p className="text-sm text-[var(--color-primary)] mt-3 flex items-center">
                {info.hours}
                <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </p>
            </a>
          ))}
        </div>

        {/* Contact Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Send us a Message</h2>
              <p className="text-[var(--color-text-muted)]">Fill out the form and we'll get back to you within 24 hours</p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-3 animate-slide-in">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-600 dark:text-green-400">Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {supportCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(cat.id);
                      setFormData(prev => ({ ...prev, category: cat.id }));
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === cat.id
                        ? 'bg-[var(--color-primary)] text-white shadow-lg'
                        : 'bg-[var(--color-background-soft)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subject</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
              </div>

              {activeTab === 'orders' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Order Number</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="e.g., SD-123456789"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Your Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ Preview & Quick Links */}
          <div className="space-y-8">
            {/* FAQ Preview */}
            <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="w-8 h-8 text-[var(--color-primary)]" />
                <h3 className="text-xl font-bold text-[var(--color-text)]">Quick Answers</h3>
              </div>
              <div className="space-y-4">
                {[
                  { q: "How do I track my order?", a: "Go to 'My Orders' in your account and click 'Track Order'", link: "/track-order" },
                  { q: "What's your return policy?", a: "14-day return window for most items", link: "/returns" },
                  { q: "How do I become a vendor?", a: "Click 'Become a Vendor' in the main menu", link: "/become-vendor" },
                  { q: "What payment methods do you accept?", a: "M-Pesa, Cards, PayPal, and bank transfers", link: "/payment-methods" }
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    className="block group p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all"
                  >
                    <p className="font-medium text-[var(--color-text)] mb-1">{item.q}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{item.a}</p>
                    <div className="flex items-center mt-2 text-xs text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Read more</span>
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/faq"
                className="inline-flex items-center space-x-2 mt-6 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
              >
                <span>View all FAQs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Office Locations */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <div className="flex items-center space-x-3 mb-6">
                <Building className="w-6 h-6 text-[var(--color-primary)]" />
                <h3 className="text-xl font-bold text-[var(--color-text)]">Our Offices</h3>
              </div>
              <div className="space-y-4">
                {offices.map((office, idx) => (
                  <div key={idx} className="border-b border-[var(--color-border)] last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-[var(--color-text)] mb-2">{office.city}</h4>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">{office.address}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Tel: {office.phone}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Email: {office.email}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-[var(--color-primary)]" />
                <h3 className="text-xl font-bold text-[var(--color-text)]">Business Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Monday - Friday</span>
                  <span className="text-[var(--color-text)] font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Saturday</span>
                  <span className="text-[var(--color-text)] font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Sunday</span>
                  <span className="text-[var(--color-text)] font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)]">Customer Support</span>
                  <span className="text-[var(--color-text)] font-medium text-green-500">24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social Media */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Connect With Us</h3>
            <p className="text-white/80 mb-6">Follow us on social media for updates, offers, and community news</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)]">
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Stay Updated</h3>
            <p className="text-[var(--color-text-muted)] mb-6">Subscribe to our newsletter for exclusive offers and updates</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              />
              <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;