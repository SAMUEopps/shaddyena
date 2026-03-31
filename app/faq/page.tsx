// app/faq/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  HelpCircle,
  User,
  CreditCard,
  ShoppingBag,
  Package,
  Store,
  MessageCircle,
  ArrowUp,
  Phone,
  Mail,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // FAQ Data Structure
  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-5 h-5" />, color: 'primary' },
    { id: 'account', name: 'Account & Login', icon: <User className="w-5 h-5" />, color: 'blue' },
    { id: 'payments', name: 'Payments', icon: <CreditCard className="w-5 h-5" />, color: 'green' },
    { id: 'orders', name: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, color: 'orange' },
    { id: 'products', name: 'Products', icon: <Package className="w-5 h-5" />, color: 'purple' },
    { id: 'vendors', name: 'Vendors', icon: <Store className="w-5 h-5" />, color: 'pink' },
  ];

  const faqs: FAQItem[] = [
    // Account & Login
    {
      id: 'create-account',
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Click on the "Sign Up" button in the top right corner. You can sign up using your email address, phone number, or social media accounts (Google/Facebook). Fill in your details, verify your email/phone, and you\'re ready to start shopping!',
      category: 'account',
      popular: true
    },
    {
      id: 'reset-password',
      question: 'I forgot my password. How can I reset it?',
      answer: 'No worries! Click on "Login" then select "Forgot Password". Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password. If you don\'t receive the email, check your spam folder or contact our support team.',
      category: 'account'
    },
    {
      id: 'edit-profile',
      question: 'How can I edit my profile information?',
      answer: 'After logging in, go to your "Account Dashboard" and click on "Profile Settings". Here you can update your personal information, change your password, add/update your address, and manage your notification preferences. Don\'t forget to save your changes!',
      category: 'account'
    },
    {
      id: 'delete-account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, please contact our support team at support@shaddyna.com. Include your account email and reason for deletion. Please note that account deletion is permanent and cannot be undone. Any pending orders or funds will be processed before deletion.',
      category: 'account'
    },

    // Payments
    {
      id: 'payment-methods',
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods for your convenience: M-Pesa (Lipa Na M-Pesa), Visa and Mastercard credit/debit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway.',
      category: 'payments',
      popular: true
    },
    {
      id: 'mpesa-payment',
      question: 'How do I pay with M-Pesa?',
      answer: 'Simply select M-Pesa at checkout. You\'ll receive a prompt to enter your M-Pesa PIN. Complete the payment on your phone, and the transaction will be confirmed instantly. Keep your confirmation message as proof of payment.',
      category: 'payments'
    },
    {
      id: 'payment-failed',
      question: 'What should I do if my payment fails?',
      answer: 'If your payment fails, first check your internet connection and ensure you have sufficient funds. Try again after a few minutes. If the problem persists, try a different payment method. Contact your bank or M-Pesa support if the issue continues. Your order will remain in your cart until payment is successful.',
      category: 'payments'
    },
    {
      id: 'refund-processing',
      question: 'How long does a refund take?',
      answer: 'Refunds are processed within 3-5 business days after the return is approved. M-Pesa refunds are instant, while card refunds may take 5-10 business days depending on your bank. You\'ll receive email confirmation once your refund is processed.',
      category: 'payments'
    },

    // Orders
    {
      id: 'place-order',
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, review your cart, then proceed to checkout. Enter your shipping details, select a payment method, and confirm your order. You\'ll receive an order confirmation email with your order number and details.',
      category: 'orders',
      popular: true
    },
    {
      id: 'modify-order',
      question: 'Can I modify my order after placing it?',
      answer: 'Orders can only be modified within 15 minutes of placement. Contact our support team immediately with your order number and requested changes. Once the order is processed or shipped, modifications are no longer possible.',
      category: 'orders'
    },
    {
      id: 'cancel-order',
      question: 'How do I cancel my order?',
      answer: 'To cancel an order, go to "My Orders" in your account, find the order you want to cancel, and click "Cancel Order". Orders can be canceled within 15 minutes of placement. After that, contact support for assistance. If the order is already shipped, you\'ll need to initiate a return.',
      category: 'orders'
    },
    {
      id: 'track-order',
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also track your order in "My Orders" section. Click on "Track Order" to see real-time updates on your delivery status. Delivery typically takes 2-5 business days.',
      category: 'orders'
    },

    // Products
    {
      id: 'product-authenticity',
      question: 'Are all products authentic?',
      answer: 'Yes! We verify all vendors and products to ensure authenticity. Our team carefully screens sellers and products. If you receive a counterfeit item, we offer full refunds and will investigate the seller. Customer satisfaction is our top priority.',
      category: 'products',
      popular: true
    },
    {
      id: 'warranty',
      question: 'Do products come with warranty?',
      answer: 'Warranty coverage varies by product and vendor. Each product page clearly shows warranty information. Many electronics and appliances come with manufacturer warranty. Contact us if you need warranty support.',
      category: 'products'
    },
    {
      id: 'stock-availability',
      question: 'How do I know if a product is in stock?',
      answer: 'Product pages show real-time stock availability. "In Stock" means available for immediate shipping. "Low Stock" indicates limited quantities remaining. "Out of Stock" means currently unavailable - click "Notify Me" to get an email when restocked.',
      category: 'products'
    },
    {
      id: 'product-returns',
      question: 'What is your return policy?',
      answer: 'We offer a 14-day return policy for most items. Products must be unused and in original packaging. Some items like perishables, personal care, and customized products are non-returnable. Visit our Returns Policy page for detailed information.',
      category: 'products'
    },

    // Vendors
    {
      id: 'become-seller',
      question: 'How do I become a seller on Shaddyna?',
      answer: 'Click on "Become a Vendor" in the main menu. Fill out the application form with your business details, product information, and required documents. Our team will review your application within 3-5 business days. Once approved, you can start listing products!',
      category: 'vendors',
      popular: true
    },
    {
      id: 'vendor-fees',
      question: 'What fees do vendors pay?',
      answer: 'We have a transparent fee structure: No setup fee, monthly subscription plans starting from KES 1,999, and a small commission on each sale (5-15% depending on category). No hidden charges! Check our Vendor Benefits page for complete details.',
      category: 'vendors'
    },
    {
      id: 'vendor-support',
      question: 'What support do vendors receive?',
      answer: 'Vendors get dedicated support including: seller dashboard with analytics, marketing tools, 24/7 support, seller education resources, and promotional opportunities. We help you grow your business!',
      category: 'vendors'
    },
    {
      id: 'vendor-payouts',
      question: 'How do vendor payouts work?',
      answer: 'Payouts are processed weekly for approved orders. You can request withdrawal to your M-Pesa or bank account. Minimum payout is KES 1,000. Detailed earnings reports are available in your vendor dashboard.',
      category: 'vendors'
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Popular FAQs (shown at the top)
  const popularFaqs = faqs.filter(faq => faq.popular);

  // Toggle accordion item
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 bg-[var(--color-primary)]/10 rounded-2xl mb-6">
              <HelpCircle className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-8">
              Find answers to common questions about Shaddyna marketplace
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-12 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg">
                <MessageCircle className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">24/7</p>
                <p className="text-sm text-[var(--color-text-muted)]">Support Available</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">&lt; 24h</p>
                <p className="text-sm text-[var(--color-text-muted)]">Average Response Time</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">98%</p>
                <p className="text-sm text-[var(--color-text-muted)]">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Questions Section */}
        {searchQuery === '' && activeCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center">
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
              Popular Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularFaqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => {
                    toggleItem(faq.id);
                    setActiveCategory(faq.category);
                  }}
                  className="group p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:shadow-md transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text)] font-medium group-hover:text-[var(--color-primary)] transition-colors">
                      {faq.question}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${activeCategory === category.id
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 scale-105'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:scale-105'
                  }
                `}
              >
                {category.icon}
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    }
                  `}>
                    {faqs.filter(f => f.category === category.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[var(--color-background-soft)] transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 mb-1">
                      {faq.popular && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                          Popular
                        </span>
                      )}
                      <span className="text-sm text-[var(--color-text-muted)] capitalize">
                        {faqCategories.find(c => c.id === faq.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {openItems.includes(faq.id) ? (
                      <ChevronDown className="w-5 h-5 text-[var(--color-primary)]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-5 pt-2 border-t border-[var(--color-border)] bg-[var(--color-background-soft)]/50 animate-slide-in">
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.id === 'become-seller' && (
                      <Link
                        href="/become-vendor"
                        className="inline-flex items-center space-x-2 mt-4 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                      >
                        <span>Apply Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                No results found
              </h3>
              <p className="text-[var(--color-text-muted)]">
                We couldn't find any FAQs matching "{searchQuery}". Try different keywords or contact our support team.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="mt-16 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">
              Still have questions?
            </h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contact Support</span>
              </a>
              <a
                href="mailto:support@shaddyna.com"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                <span>support@shaddyna.com</span>
              </a>
              <a
                href="tel:+254700000000"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>+254 700 000 000</span>
              </a>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-6 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Available 24/7 for your convenience</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-110 z-50 animate-bounce-subtle"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default FAQPage;