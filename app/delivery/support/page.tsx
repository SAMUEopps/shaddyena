// app/delivery/support/page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  LifeBuoy,
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  Package,
  CreditCard,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  User,
  MapPin,
  Truck,
  RefreshCw,
  ExternalLink,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  Star,
  Shield,
  Zap,
  Headphones
} from 'lucide-react';

interface SupportTicket {
  _id: string;
  orderId?: string;
  suborderId?: string;
  type: 'order_issue' | 'payment_issue' | 'app_issue' | 'other';
  category: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  resolution?: string;
  assignedTo?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface EmergencyAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  color: string;
}

const emergencyActions: EmergencyAction[] = [
  {
    id: 'customer_not_available',
    title: 'Customer Not Available',
    description: 'Unable to reach customer at delivery location',
    icon: <User className="w-6 h-6" />,
    action: 'report_unavailable',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'order_damaged',
    title: 'Order Damaged',
    description: 'Package is damaged or items are broken',
    icon: <Package className="w-6 h-6" />,
    action: 'report_damaged',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'wrong_address',
    title: 'Wrong Address',
    description: 'Address doesn\'t match or is incorrect',
    icon: <MapPin className="w-6 h-6" />,
    action: 'report_address_issue',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'payment_issue',
    title: 'Payment Issue',
    description: 'Delivery payment not received',
    icon: <CreditCard className="w-6 h-6" />,
    action: 'report_payment',
    color: 'from-blue-500 to-cyan-500'
  }
];

const supportCategories = [
  { id: 'order_issue', label: 'Order Issue', icon: <Package className="w-4 h-4" /> },
  { id: 'payment_issue', label: 'Payment Issue', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'app_issue', label: 'App Issue', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'other', label: 'Other', icon: <HelpCircle className="w-4 h-4" /> }
];

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I mark an order as delivered?',
    answer: 'Navigate to My Deliveries, select the order, and tap "Mark as Delivered". You\'ll need to enter the confirmation code provided by the customer.',
    category: 'delivery',
    helpful: 0
  },
  {
    id: '2',
    question: 'What should I do if customer is not available?',
    answer: 'Use the emergency action button "Customer Not Available". We\'ll attempt to contact them. Wait 10 minutes before marking as undeliverable.',
    category: 'delivery',
    helpful: 0
  },
  {
    id: '3',
    question: 'How long does it take to receive payments?',
    answer: 'Withdrawals are processed within 24-48 hours. Once processed, funds arrive instantly to your M-PESA.',
    category: 'payment',
    helpful: 0
  },
  {
    id: '4',
    question: 'What if the delivery address is wrong?',
    answer: 'Contact the customer first. If unreachable, use "Wrong Address" emergency action. Support will verify and update the address.',
    category: 'order',
    helpful: 0
  },
  {
    id: '5',
    question: 'How do I report a damaged package?',
    answer: 'Take photos of the damage, then use the "Order Damaged" emergency action. Upload photos and describe the damage in detail.',
    category: 'order',
    helpful: 0
  },
  {
    id: '6',
    question: 'Can I cancel a delivery after accepting?',
    answer: 'Yes, but only before pickup. Contact support immediately with the order ID and reason for cancellation.',
    category: 'delivery',
    helpful: 0
  }
];

export default function DeliverySupportPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [orderId, setOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'tickets' | 'faq'>('report');
  const [searchFaq, setSearchFaq] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('all');
  const [faqHelpfulness, setFaqHelpfulness] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/delivery/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/delivery/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedCategory,
          orderId: orderId || undefined,
          description,
          priority
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      toast.success('Issue reported successfully! Support will contact you soon.');
      setShowReportForm(false);
      setSelectedCategory('');
      setOrderId('');
      setDescription('');
      setPriority('medium');
      fetchTickets();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmergencyAction = async (action: string) => {
    toast.loading('Processing emergency action...');
    try {
      // In production, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.dismiss();
      toast.success('Emergency action reported! Support team notified.');
      setShowReportForm(true);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to process emergency action');
    }
  };

  const handleFaqHelpful = async (faqId: string, helpful: boolean) => {
    setFaqHelpfulness(prev => ({ ...prev, [faqId]: helpful }));
    // In production, send feedback to API
    toast.success(helpful ? 'Thanks for your feedback!' : 'We\'ll improve this answer.');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'closed': return 'bg-gray-500/10 text-gray-600 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500/10 text-red-600';
      case 'high': return 'bg-orange-500/10 text-orange-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      default: return 'bg-blue-500/10 text-blue-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchFaq.toLowerCase());
    const matchesCategory = selectedFaqCategory === 'all' || faq.category === selectedFaqCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section *
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-12 md:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <LifeBuoy className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              Delivery Support
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Get help with deliveries, payments, or any issues you encounter
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Headphones className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Zap className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Emergency Response</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Rider Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Emergency Actions *
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-8 rounded-full mr-3"></span>
            Emergency Actions
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">Quick actions for urgent delivery issues</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleEmergencyAction(action.action)}
                className="group relative overflow-hidden bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Contact *
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fastest</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-white/80 text-sm mb-4">Get instant help from support team</p>
            <button
              onClick={() => window.open('https://wa.me/254700000000', '_blank')}
              className="w-full py-2 bg-white text-green-600 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Phone className="w-8 h-8" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">24/7</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Call Support</h3>
            <p className="text-white/80 text-sm mb-4">Speak directly with a support agent</p>
            <button
              onClick={() => window.open('tel:+254700000000', '_blank')}
              className="w-full py-2 bg-white text-blue-600 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Call Now
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Response &lt; 2h</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-white/80 text-sm mb-4">Send detailed issue reports</p>
            <button
              onClick={() => window.location.href = 'mailto:support@shaddyna.com'}
              className="w-full py-2 bg-white text-purple-600 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Send Email
            </button>
          </div>
        </div>

        {/* Tabs *
        <div className="mb-8">
          <div className="flex space-x-2 border-b border-[var(--color-border)]">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'report'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Report Issue
              {activeTab === 'report' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'tickets'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              My Tickets
              {tickets.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
                  {tickets.length}
                </span>
              )}
              {activeTab === 'tickets' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'faq'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              FAQ
              {activeTab === 'faq' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
          </div>
        </div>

        {/* Report Issue Form *
        {activeTab === 'report' && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Report an Issue</h2>
                <p className="text-[var(--color-text-muted)]">We'll help resolve your problem quickly</p>
              </div>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Issue Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {supportCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
                        selectedCategory === cat.id
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-123456"
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Minor issue</option>
                  <option value="high">High - Delivery issue</option>
                  <option value="urgent">Urgent - Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileText className="w-8 h-8 text-[var(--color-text-muted)] mb-2" />
                    <span className="text-[var(--color-text-muted)]">Click to upload photos or documents</span>
                    <span className="text-xs text-[var(--color-text-muted)] mt-1">PNG, JPG, PDF up to 10MB</span>
                  </label>
                </div>
                {attachments.length > 0 && (
                  <p className="text-sm text-[var(--color-text-muted)] mt-2">
                    {attachments.length} file(s) selected
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Submit Report</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        )}

        {/* My Tickets *
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {tickets.length === 0 ? (
              <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
                <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                  <HelpCircle className="w-12 h-12 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No Support Tickets</h3>
                <p className="text-[var(--color-text-muted)] mb-4">
                  You haven't submitted any support tickets yet.
                </p>
                <button
                  onClick={() => setActiveTab('report')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>Report an Issue</span>
                </button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'resolved' && <CheckCircle className="w-5 h-5" />}
                        {ticket.status === 'in_progress' && <RefreshCw className="w-5 h-5" />}
                        {ticket.status === 'pending' && <Clock className="w-5 h-5" />}
                        {ticket.status === 'closed' && <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text)]">
                          #{ticket._id.slice(-6)}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[var(--color-text)] font-medium">
                      {supportCategories.find(c => c.id === ticket.type)?.label || ticket.type}
                    </p>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">
                      {ticket.description}
                    </p>
                    {ticket.orderId && (
                      <p className="text-sm text-[var(--color-text-muted)] mt-2">
                        Order: {ticket.orderId}
                      </p>
                    )}
                  </div>

                  {ticket.resolution && (
                    <div className="mt-4 p-4 bg-green-500/5 rounded-xl border border-green-500/20">
                      <p className="text-sm font-medium text-green-600 mb-1">Resolution</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{ticket.resolution}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedCategory(ticket.type);
                        setOrderId(ticket.orderId || '');
                        setActiveTab('report');
                      }}
                      className="text-sm text-[var(--color-primary)] hover:underline flex items-center space-x-1"
                    >
                      <span>Follow Up</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FAQ Section *
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* FAQ Filters *
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchFaq}
                    onChange={(e) => setSearchFaq(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
                <select
                  value={selectedFaqCategory}
                  onChange={(e) => setSelectedFaqCategory(e.target.value)}
                  className="px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="all">All Categories</option>
                  <option value="delivery">Delivery</option>
                  <option value="payment">Payment</option>
                  <option value="order">Order Issues</option>
                </select>
              </div>
            </div>

            {/* FAQ List *
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-[var(--color-text-muted)]">Was this helpful?</span>
                        <button
                          onClick={() => handleFaqHelpful(faq.id, true)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all ${
                            faqHelpfulness[faq.id] === true
                              ? 'bg-green-500/10 text-green-600'
                              : 'text-[var(--color-text-muted)] hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">Yes</span>
                        </button>
                        <button
                          onClick={() => handleFaqHelpful(faq.id, false)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all ${
                            faqHelpfulness[faq.id] === false
                              ? 'bg-red-500/10 text-red-600'
                              : 'text-[var(--color-text-muted)] hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-sm">No</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedCategory('other');
                          setDescription(`Regarding: ${faq.question}\n\n`);
                          setActiveTab('report');
                        }}
                        className="text-sm text-[var(--color-primary)] hover:underline flex items-center space-x-1"
                      >
                        <span>Still need help?</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="bg-[var(--color-surface)] rounded-2xl p-12 text-center border border-[var(--color-border)]">
                <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                  <Search className="w-12 h-12 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No FAQs Found</h3>
                <p className="text-[var(--color-text-muted)] mb-4">
                  Try searching with different keywords or browse categories.
                </p>
                <button
                  onClick={() => {
                    setSearchFaq('');
                    setSelectedFaqCategory('all');
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Still Need Help *
        <div className="mt-12 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-2xl p-8 text-center border border-[var(--color-border)]">
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Still Need Help?</h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/254700000000', '_blank')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Live Chat</span>
            </button>
            <button
              onClick={() => window.open('tel:+254700000000', '_blank')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              <span>Call Support</span>
            </button>
            <Link
              href="/delivery/my-deliveries"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl hover:border-[var(--color-primary)] transition-all duration-300"
            >
              <Package className="w-5 h-5" />
              <span>Back to Deliveries</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}*/

// app/delivery/support/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  LifeBuoy,
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  Package,
  CreditCard,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  User,
  MapPin,
  Truck,
  RefreshCw,
  ExternalLink,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  Star,
  Shield,
  Zap,
  Headphones
} from 'lucide-react';

interface SupportTicket {
  _id: string;
  orderId?: string;
  suborderId?: string;
  type: 'order_issue' | 'payment_issue' | 'app_issue' | 'other';
  category: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  resolution?: string;
  assignedTo?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface EmergencyAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  color: string;
}

const emergencyActions: EmergencyAction[] = [
  {
    id: 'customer_not_available',
    title: 'Customer Not Available',
    description: 'Unable to reach customer at delivery location',
    icon: <User className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
    action: 'report_unavailable',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'order_damaged',
    title: 'Order Damaged',
    description: 'Package is damaged or items are broken',
    icon: <Package className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
    action: 'report_damaged',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'wrong_address',
    title: 'Wrong Address',
    description: 'Address doesn\'t match or is incorrect',
    icon: <MapPin className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
    action: 'report_address_issue',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'payment_issue',
    title: 'Payment Issue',
    description: 'Delivery payment not received',
    icon: <CreditCard className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />,
    action: 'report_payment',
    color: 'from-blue-500 to-cyan-500'
  }
];

const supportCategories = [
  { id: 'order_issue', label: 'Order Issue', icon: <Package className="w-3 h-3 xs:w-4 xs:h-4" /> },
  { id: 'payment_issue', label: 'Payment Issue', icon: <CreditCard className="w-3 h-3 xs:w-4 xs:h-4" /> },
  { id: 'app_issue', label: 'App Issue', icon: <Smartphone className="w-3 h-3 xs:w-4 xs:h-4" /> },
  { id: 'other', label: 'Other', icon: <HelpCircle className="w-3 h-3 xs:w-4 xs:h-4" /> }
];

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I mark an order as delivered?',
    answer: 'Navigate to My Deliveries, select the order, and tap "Mark as Delivered". You\'ll need to enter the confirmation code provided by the customer.',
    category: 'delivery',
    helpful: 0
  },
  {
    id: '2',
    question: 'What should I do if customer is not available?',
    answer: 'Use the emergency action button "Customer Not Available". We\'ll attempt to contact them. Wait 10 minutes before marking as undeliverable.',
    category: 'delivery',
    helpful: 0
  },
  {
    id: '3',
    question: 'How long does it take to receive payments?',
    answer: 'Withdrawals are processed within 24-48 hours. Once processed, funds arrive instantly to your M-PESA.',
    category: 'payment',
    helpful: 0
  },
  {
    id: '4',
    question: 'What if the delivery address is wrong?',
    answer: 'Contact the customer first. If unreachable, use "Wrong Address" emergency action. Support will verify and update the address.',
    category: 'order',
    helpful: 0
  },
  {
    id: '5',
    question: 'How do I report a damaged package?',
    answer: 'Take photos of the damage, then use the "Order Damaged" emergency action. Upload photos and describe the damage in detail.',
    category: 'order',
    helpful: 0
  },
  {
    id: '6',
    question: 'Can I cancel a delivery after accepting?',
    answer: 'Yes, but only before pickup. Contact support immediately with the order ID and reason for cancellation.',
    category: 'delivery',
    helpful: 0
  }
];

export default function DeliverySupportPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [orderId, setOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'tickets' | 'faq'>('report');
  const [searchFaq, setSearchFaq] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('all');
  const [faqHelpfulness, setFaqHelpfulness] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/delivery/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/delivery/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedCategory,
          orderId: orderId || undefined,
          description,
          priority
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      toast.success('Issue reported successfully! Support will contact you soon.');
      setShowReportForm(false);
      setSelectedCategory('');
      setOrderId('');
      setDescription('');
      setPriority('medium');
      fetchTickets();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmergencyAction = async (action: string) => {
    toast.loading('Processing emergency action...');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.dismiss();
      toast.success('Emergency action reported! Support team notified.');
      setShowReportForm(true);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to process emergency action');
    }
  };

  const handleFaqHelpful = async (faqId: string, helpful: boolean) => {
    setFaqHelpfulness(prev => ({ ...prev, [faqId]: helpful }));
    toast.success(helpful ? 'Thanks for your feedback!' : 'We\'ll improve this answer.');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'closed': return 'bg-gray-500/10 text-gray-600 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500/10 text-red-600';
      case 'high': return 'bg-orange-500/10 text-orange-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      default: return 'bg-blue-500/10 text-blue-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchFaq.toLowerCase());
    const matchesCategory = selectedFaqCategory === 'all' || faq.category === selectedFaqCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 xs:py-10 sm:py-12 md:py-16">
        <div className="absolute top-0 right-0 w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-1.5 xs:space-x-2 px-3 xs:px-4 py-1.5 xs:py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-xs xs:text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 group"
            >
              <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 xs:p-2.5 sm:p-3 bg-[var(--color-primary)]/10 rounded-xl xs:rounded-2xl mb-3 xs:mb-4 sm:mb-6 animate-bounce-subtle">
              <LifeBuoy className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-2 xs:mb-3 sm:mb-4">
              Delivery Support
            </h1>
            <p className="text-sm xs:text-base sm:text-lg text-[var(--color-text-muted)] mb-4 xs:mb-5 sm:mb-6">
              Get help with deliveries, payments, or any issues you encounter
            </p>
            <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center">
              <div className="flex items-center space-x-1.5 xs:space-x-2 bg-[var(--color-surface)] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-[var(--color-border)]">
                <Headphones className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                <span className="text-[10px] xs:text-xs sm:text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-1.5 xs:space-x-2 bg-[var(--color-surface)] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-[var(--color-border)]">
                <Zap className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                <span className="text-[10px] xs:text-xs sm:text-sm">Emergency Response</span>
              </div>
              <div className="flex items-center space-x-1.5 xs:space-x-2 bg-[var(--color-surface)] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full border border-[var(--color-border)]">
                <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
                <span className="text-[10px] xs:text-xs sm:text-sm">Rider Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-10 md:py-12">
        {/* Emergency Actions - 2 columns on mobile */}
        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-2 xs:mb-3 flex items-center">
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] w-1 h-5 xs:h-6 sm:h-8 rounded-full mr-2 xs:mr-3"></span>
            Emergency Actions
          </h2>
          <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 xs:mb-5 sm:mb-6">Quick actions for urgent delivery issues</p>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {emergencyActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleEmergencyAction(action.action)}
                className="group relative overflow-hidden bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="p-1.5 xs:p-2 sm:p-3 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl w-fit mb-2 xs:mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-[var(--color-text)] mb-1 xs:mb-2">
                    {action.title}
                  </h3>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Contact - 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6 mb-8 xs:mb-10 sm:mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
              <MessageCircle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
              <span className="text-[8px] xs:text-[10px] bg-white/20 px-1.5 xs:px-2 py-0.5 rounded-full">Fastest</span>
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-1 xs:mb-2">Live Chat</h3>
            <p className="text-white/80 text-[10px] xs:text-xs sm:text-sm mb-3 xs:mb-4">Get instant help from support team</p>
            <button
              onClick={() => window.open('https://wa.me/254700000000', '_blank')}
              className="w-full py-1.5 xs:py-2 bg-white text-green-600 rounded-lg xs:rounded-xl font-medium hover:scale-105 transition-transform text-[10px] xs:text-xs sm:text-sm"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
              <Phone className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
              <span className="text-[8px] xs:text-[10px] bg-white/20 px-1.5 xs:px-2 py-0.5 rounded-full">24/7</span>
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-1 xs:mb-2">Call Support</h3>
            <p className="text-white/80 text-[10px] xs:text-xs sm:text-sm mb-3 xs:mb-4">Speak directly with a support agent</p>
            <button
              onClick={() => window.open('tel:+254700000000', '_blank')}
              className="w-full py-1.5 xs:py-2 bg-white text-blue-600 rounded-lg xs:rounded-xl font-medium hover:scale-105 transition-transform text-[10px] xs:text-xs sm:text-sm"
            >
              Call Now
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
              <Mail className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
              <span className="text-[8px] xs:text-[10px] bg-white/20 px-1.5 xs:px-2 py-0.5 rounded-full">Response &lt; 2h</span>
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-1 xs:mb-2">Email Support</h3>
            <p className="text-white/80 text-[10px] xs:text-xs sm:text-sm mb-3 xs:mb-4">Send detailed issue reports</p>
            <button
              onClick={() => window.location.href = 'mailto:support@shaddyna.com'}
              className="w-full py-1.5 xs:py-2 bg-white text-purple-600 rounded-lg xs:rounded-xl font-medium hover:scale-105 transition-transform text-[10px] xs:text-xs sm:text-sm"
            >
              Send Email
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 xs:mb-8">
          <div className="flex space-x-1 xs:space-x-2 border-b border-[var(--color-border)] overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-medium transition-all relative text-xs xs:text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'report'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Report Issue
              {activeTab === 'report' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-medium transition-all relative text-xs xs:text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'tickets'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              My Tickets
              {tickets.length > 0 && (
                <span className="ml-1 xs:ml-2 px-1.5 xs:px-2 py-0.5 text-[8px] xs:text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
                  {tickets.length}
                </span>
              )}
              {activeTab === 'tickets' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-medium transition-all relative text-xs xs:text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              FAQ
              {activeTab === 'faq' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
              )}
            </button>
          </div>
        </div>

        {/* Report Issue Form */}
        {activeTab === 'report' && (
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6 md:p-8">
            <div className="flex items-center space-x-2 xs:space-x-3 mb-4 xs:mb-5 sm:mb-6">
              <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)]">Report an Issue</h2>
                <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)]">We'll help resolve your problem quickly</p>
              </div>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div>
                <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                  Issue Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3">
                  {supportCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-center space-x-1.5 xs:space-x-2 px-2 xs:px-3 py-2 xs:py-2.5 rounded-lg xs:rounded-xl border transition-all text-[10px] xs:text-xs sm:text-sm ${
                        selectedCategory === cat.id
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-123456"
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Minor issue</option>
                  <option value="high">High - Delivery issue</option>
                  <option value="urgent">Urgent - Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1.5 xs:mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg xs:rounded-xl p-4 xs:p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileText className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-[var(--color-text-muted)] mb-1 xs:mb-2" />
                    <span className="text-[10px] xs:text-xs text-[var(--color-text-muted)] text-center">Click to upload photos or documents</span>
                    <span className="text-[8px] xs:text-[10px] text-[var(--color-text-muted)] mt-0.5 xs:mt-1">PNG, JPG, PDF up to 10MB</span>
                  </label>
                </div>
                {attachments.length > 0 && (
                  <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)] mt-1.5 xs:mt-2">
                    {attachments.length} file(s) selected
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 xs:py-3 sm:py-4 bg-[var(--color-primary)] text-white rounded-lg xs:rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:scale-105 disabled:opacity-50 text-sm xs:text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4 xs:w-5 xs:h-5" />
                    <span>Submit Report</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        )}

        {/* My Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            {tickets.length === 0 ? (
              <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-6 xs:p-8 sm:p-12 text-center border border-[var(--color-border)]">
                <div className="inline-flex p-2.5 xs:p-3 sm:p-4 bg-[var(--color-primary)]/10 rounded-full mb-2.5 xs:mb-3 sm:mb-4">
                  <HelpCircle className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-1 xs:mb-2">No Support Tickets</h3>
                <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] mb-3 xs:mb-4">
                  You haven't submitted any support tickets yet.
                </p>
                <button
                  onClick={() => setActiveTab('report')}
                  className="inline-flex items-center space-x-1.5 xs:space-x-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg xs:rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 text-[10px] xs:text-xs sm:text-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  <span>Report an Issue</span>
                </button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-4 xs:p-5 sm:p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4 mb-3 xs:mb-4">
                    <div className="flex items-center space-x-2 xs:space-x-3">
                      <div className={`p-1.5 xs:p-2 rounded-lg ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'resolved' && <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                        {ticket.status === 'in_progress' && <RefreshCw className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                        {ticket.status === 'pending' && <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                        {ticket.status === 'closed' && <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div>
                        <p className="text-xs xs:text-sm font-semibold text-[var(--color-text)]">
                          #{ticket._id.slice(-6)}
                        </p>
                        <p className="text-[9px] xs:text-[10px] text-[var(--color-text-muted)]">
                          {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 xs:gap-3">
                      <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 xs:mb-4">
                    <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text)] font-medium">
                      {supportCategories.find(c => c.id === ticket.type)?.label || ticket.type}
                    </p>
                    <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">
                      {ticket.description}
                    </p>
                    {ticket.orderId && (
                      <p className="text-[9px] xs:text-[10px] text-[var(--color-text-muted)] mt-1 xs:mt-2">
                        Order: {ticket.orderId}
                      </p>
                    )}
                  </div>

                  {ticket.resolution && (
                    <div className="mt-3 xs:mt-4 p-2.5 xs:p-3 sm:p-4 bg-green-500/5 rounded-lg xs:rounded-xl border border-green-500/20">
                      <p className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-green-600 mb-0.5 xs:mb-1">Resolution</p>
                      <p className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">{ticket.resolution}</p>
                    </div>
                  )}

                  <div className="mt-3 xs:mt-4 pt-2.5 xs:pt-3 sm:pt-4 border-t border-[var(--color-border)] flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedCategory(ticket.type);
                        setOrderId(ticket.orderId || '');
                        setActiveTab('report');
                      }}
                      className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-primary)] hover:underline flex items-center space-x-0.5 xs:space-x-1"
                    >
                      <span>Follow Up</span>
                      <ChevronRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* FAQ Filters */}
            <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-6">
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchFaq}
                    onChange={(e) => setSearchFaq(e.target.value)}
                    className="w-full pl-9 xs:pl-12 pr-3 xs:pr-4 py-2 xs:py-3 text-sm xs:text-base bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  />
                </div>
                <select
                  value={selectedFaqCategory}
                  onChange={(e) => setSelectedFaqCategory(e.target.value)}
                  className="px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <option value="all">All Categories</option>
                  <option value="delivery">Delivery</option>
                  <option value="payment">Payment</option>
                  <option value="order">Order Issues</option>
                </select>
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-3 xs:space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300"
                >
                  <div className="p-4 xs:p-5 sm:p-6">
                    <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-3 xs:gap-4">
                      <div className="flex-1">
                        <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)] mb-1.5 xs:mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 xs:mt-4 pt-2.5 xs:pt-3 sm:pt-4 border-t border-[var(--color-border)] flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3">
                      <div className="flex flex-wrap items-center gap-2 xs:gap-3">
                        <span className="text-[8px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)]">Was this helpful?</span>
                        <button
                          onClick={() => handleFaqHelpful(faq.id, true)}
                          className={`flex items-center space-x-0.5 xs:space-x-1 px-2 xs:px-3 py-0.5 xs:py-1 rounded-lg transition-all text-[9px] xs:text-[10px] ${
                            faqHelpfulness[faq.id] === true
                              ? 'bg-green-500/10 text-green-600'
                              : 'text-[var(--color-text-muted)] hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                          <span>Yes</span>
                        </button>
                        <button
                          onClick={() => handleFaqHelpful(faq.id, false)}
                          className={`flex items-center space-x-0.5 xs:space-x-1 px-2 xs:px-3 py-0.5 xs:py-1 rounded-lg transition-all text-[9px] xs:text-[10px] ${
                            faqHelpfulness[faq.id] === false
                              ? 'bg-red-500/10 text-red-600'
                              : 'text-[var(--color-text-muted)] hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                          <span>No</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedCategory('other');
                          setDescription(`Regarding: ${faq.question}\n\n`);
                          setActiveTab('report');
                        }}
                        className="text-[9px] xs:text-[10px] text-[var(--color-primary)] hover:underline flex items-center space-x-0.5 xs:space-x-1"
                      >
                        <span>Still need help?</span>
                        <ChevronRight className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl p-6 xs:p-8 sm:p-12 text-center border border-[var(--color-border)]">
                <div className="inline-flex p-2.5 xs:p-3 sm:p-4 bg-[var(--color-primary)]/10 rounded-full mb-2.5 xs:mb-3 sm:mb-4">
                  <Search className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-1 xs:mb-2">No FAQs Found</h3>
                <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] mb-3 xs:mb-4">
                  Try searching with different keywords or browse categories.
                </p>
                <button
                  onClick={() => {
                    setSearchFaq('');
                    setSelectedFaqCategory('all');
                  }}
                  className="inline-flex items-center space-x-1.5 xs:space-x-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg xs:rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 text-[10px] xs:text-xs sm:text-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-8 xs:mt-10 sm:mt-12 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-xl xs:rounded-2xl p-5 xs:p-6 sm:p-8 text-center border border-[var(--color-border)]">
          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] mb-1.5 xs:mb-2 sm:mb-3">Still Need Help?</h3>
          <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] mb-3 xs:mb-4 sm:mb-6">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/254700000000', '_blank')}
              className="inline-flex items-center space-x-1.5 xs:space-x-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-green-500 text-white rounded-lg xs:rounded-xl hover:bg-green-600 transition-all duration-300 hover:scale-105 text-[10px] xs:text-xs sm:text-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span>Live Chat</span>
            </button>
            <button
              onClick={() => window.open('tel:+254700000000', '_blank')}
              className="inline-flex items-center space-x-1.5 xs:space-x-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg xs:rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 text-[10px] xs:text-xs sm:text-sm"
            >
              <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span>Call Support</span>
            </button>
            <Link
              href="/delivery/my-deliveries"
              className="inline-flex items-center space-x-1.5 xs:space-x-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg xs:rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 text-[10px] xs:text-xs sm:text-sm"
            >
              <Package className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              <span>Back to Deliveries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}