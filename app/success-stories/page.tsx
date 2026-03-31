'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Star,
  Quote,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Award,
  Users,
  Heart,
  Share2,
  Bookmark,
  Filter,
  Search,
  Calendar,
  MapPin,
  Briefcase,
  Bike,
  Store,
  ShoppingBag,
  Trophy,
  Target,
  Rocket,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  X,
  CheckCircle,
  Clock,
  DollarSign,
  ThumbsUp,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ExternalLink
} from 'lucide-react';

// Success story types
type StoryType = 'vendor' | 'rider' | 'customer';
type StoryCategory = 'all' | 'featured' | 'recent' | 'top-rated';

interface SuccessStory {
  id: number;
  name: string;
  role: string;
  type: StoryType;
  image: string;
  story: string;
  fullStory: string;
  achievement: string;
  stats: {
    label: string;
    value: string;
    icon: any;
  }[];
  rating: number;
  date: string;
  location: string;
  category: string;
  featured: boolean;
  videoUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  beforeAfter?: {
    before: string;
    after: string;
    description: string;
  };
  tips?: string[];
}

// Success stories data
const successStories: SuccessStory[] = [
  {
    id: 1,
    name: 'Jane Wanjiku',
    role: 'Fashion Entrepreneur',
    type: 'vendor',
    image: '/avatars/jane.jpg',
    story: 'My sales increased by 300% in the first 3 months! The platform is incredibly easy to use and the support team is amazing.',
    fullStory: "When I started my fashion boutique, I never imagined it would grow this fast. Shaddyna provided me with the tools and exposure I needed to reach customers across Kenya. Within the first month, I was getting orders from Nairobi, Mombasa, and even Kisumu. The analytics dashboard helped me understand my customers better, and the promotion tools allowed me to run successful campaigns. Today, I'm managing a team of 5 employees and planning to open a physical store soon.",
    achievement: 'Top Vendor 2024',
    stats: [
      { label: 'Monthly Sales', value: 'KES 500K+', icon: DollarSign },
      { label: 'Orders', value: '2,500+', icon: ShoppingBag },
      { label: 'Rating', value: '4.9★', icon: Star },
      { label: 'Growth', value: '300%', icon: TrendingUp },
    ],
    rating: 4.9,
    date: 'March 2024',
    location: 'Nairobi',
    category: 'Fashion',
    featured: true,
    tips: [
      'Use high-quality product photos',
      'Respond to customer queries quickly',
      'Offer occasional promotions',
      'Maintain consistent inventory',
    ],
    beforeAfter: {
      before: 'Small home-based business with 10-15 monthly sales',
      after: 'Full-scale operation with 200+ monthly orders',
      description: 'From a small home business to a thriving online store'
    }
  },
  {
    id: 2,
    name: 'John Kamau',
    role: 'Delivery Rider',
    type: 'rider',
    image: '/avatars/john.jpg',
    story: 'I started part-time and now earn more than my previous full-time job. The flexibility and support are unmatched!',
    fullStory: "I joined Shaddyna as a part-time rider while looking for a full-time job. Within two months, I realized I was earning more than I ever did in my previous job. The peak time bonuses and performance incentives make a huge difference. I now ride full-time and have enough time to spend with my family. The community of riders is amazing, and the support team is always there when I need help.",
    achievement: 'Top Rider 2024',
    stats: [
      { label: 'Monthly Earnings', value: 'KES 65K+', icon: DollarSign },
      { label: 'Deliveries', value: '1,200+', icon: Bike },
      { label: 'Rating', value: '4.9★', icon: Star },
      { label: 'Efficiency', value: '98%', icon: Target },
    ],
    rating: 4.9,
    date: 'February 2024',
    location: 'Nairobi',
    category: 'Delivery',
    featured: true,
    tips: [
      'Maintain your vehicle regularly',
      'Learn the best routes',
      'Communicate clearly with customers',
      'Keep your phone charged',
    ]
  },
  {
    id: 3,
    name: 'Sarah Mwangi',
    role: 'Natural Beauty Founder',
    type: 'vendor',
    image: '/avatars/sarah.jpg',
    story: 'From a home-based business to a nationwide brand. The delivery network made all the difference!',
    fullStory: "Starting my natural beauty products business was a dream. Shaddyna helped me turn that dream into reality. Their delivery network allowed me to reach customers all over Kenya, and the secure payment system gave my customers confidence. I've since expanded my product line from 5 to over 30 products and am now looking to export to neighboring countries.",
    achievement: 'Customer Favorite',
    stats: [
      { label: 'Products', value: '30+', icon: Store },
      { label: 'Customers', value: '5,000+', icon: Users },
      { label: 'Rating', value: '4.9★', icon: Star },
      { label: 'Repeat Rate', value: '85%', icon: Heart },
    ],
    rating: 4.9,
    date: 'January 2024',
    location: 'Mombasa',
    category: 'Beauty',
    featured: true,
  },
  {
    id: 4,
    name: 'Peter Ochieng',
    role: 'Electronics Vendor',
    type: 'vendor',
    image: '/avatars/peter.jpg',
    story: 'The analytics tools helped me understand my customers better. I can now target the right products to the right people.',
    fullStory: "I've been selling electronics for years, but Shaddyna's analytics tools showed me insights I never had before. I discovered which products were most popular in different regions and adjusted my inventory accordingly. Sales increased by 200%, and I've been able to reduce dead stock significantly.",
    achievement: 'Fastest Growing',
    stats: [
      { label: 'Sales Growth', value: '200%', icon: TrendingUp },
      { label: 'Products', value: '500+', icon: Store },
      { label: 'Rating', value: '4.8★', icon: Star },
      { label: 'Regions', value: '8', icon: MapPin },
    ],
    rating: 4.8,
    date: 'December 2023',
    location: 'Kisumu',
    category: 'Electronics',
    featured: false,
  },
  {
    id: 5,
    name: 'Mary Wanjiru',
    role: 'Part-time Rider',
    type: 'rider',
    image: '/avatars/mary.jpg',
    story: 'As a university student, this is the perfect job. I can work around my classes and still earn good money.',
    fullStory: "Being a student, I needed something flexible that wouldn't interfere with my studies. Shaddyna's rider program is perfect. I ride on weekends and evenings, and I'm able to cover my school fees and living expenses. The app is easy to use, and I love the instant payouts.",
    achievement: 'Student Ambassador',
    stats: [
      { label: 'Monthly', value: 'KES 35K+', icon: DollarSign },
      { label: 'Deliveries', value: '450+', icon: Bike },
      { label: 'Rating', value: '4.8★', icon: Star },
      { label: 'On-Time', value: '97%', icon: Clock },
    ],
    rating: 4.8,
    date: 'November 2023',
    location: 'Nairobi',
    category: 'Delivery',
    featured: false,
  },
  {
    id: 6,
    name: 'James Ndungu',
    role: 'Home & Garden Vendor',
    type: 'vendor',
    image: '/avatars/james.jpg',
    story: "The platform's marketing tools helped me reach customers I never thought possible. My business has tripled in size!",
    fullStory: "I started selling handmade furniture as a hobby. Through Shaddyna, I've turned it into a full-time business with 10 employees. The marketing tools allowed me to run targeted campaigns, and the customer base grew exponentially. I now supply to interior designers and hotels across Kenya.",
    achievement: 'Business of the Year',
    stats: [
      { label: 'Revenue', value: 'KES 1.2M+', icon: DollarSign },
      { label: 'Employees', value: '10', icon: Users },
      { label: 'Rating', value: '4.9★', icon: Star },
      { label: 'Growth', value: '300%', icon: TrendingUp },
    ],
    rating: 4.9,
    date: 'October 2023',
    location: 'Nakuru',
    category: 'Home & Garden',
    featured: true,
  },
];

// Filter categories
const categories = [
  { id: 'all', label: 'All Stories', icon: Sparkles },
  { id: 'vendor', label: 'Vendors', icon: Store },
  { id: 'rider', label: 'Riders', icon: Bike },
  { id: 'customer', label: 'Customers', icon: ShoppingBag },
];

// Filter options
const filterOptions = [
  { id: 'all', label: 'All Stories' },
  { id: 'featured', label: 'Featured' },
  { id: 'recent', label: 'Most Recent' },
  { id: 'top-rated', label: 'Top Rated' },
];

export default function SuccessStoriesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<StoryType | 'all'>('all');
  const [selectedFilter, setSelectedFilter] = useState<StoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const storiesPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter stories based on selection
  const filteredStories = successStories.filter(story => {
    const matchesType = selectedType === 'all' || story.type === selectedType;
    const matchesSearch = story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.story.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'featured') matchesFilter = story.featured;
    if (selectedFilter === 'top-rated') matchesFilter = story.rating >= 4.8;
    
    return matchesType && matchesSearch && matchesFilter;
  });

  // Sort stories
  const sortedStories = [...filteredStories].sort((a, b) => {
    if (selectedFilter === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (selectedFilter === 'top-rated') {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = sortedStories.slice(indexOfFirstStory, indexOfLastStory);
  const totalPages = Math.ceil(sortedStories.length / storiesPerPage);

  const handleStoryClick = (story: SuccessStory) => {
    setSelectedStory(story);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
    document.body.style.overflow = 'auto';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this success story on Shaddyna!`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-alt)] to-[var(--color-primary-soft)]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Success Stories</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Real Stories, Real{' '}
              <span className="inline-block">Success</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover how Shaddyna has transformed businesses and lives across Kenya. Get inspired by our community of successful vendors, riders, and customers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary-soft)]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Success Stories</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">KES 50M+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Total Earnings</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-sm text-[var(--color-text-muted)]">Lives Changed</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover:scale-110 transition-transform">4.8★</div>
              <div className="text-sm text-[var(--color-text-muted)]">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 sticky top-0 bg-[var(--color-background)]/95 backdrop-blur-md z-30 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedType === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedType(category.id as StoryType | 'all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-white shadow-lg'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)]/20 border border-[var(--color-border)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as StoryCategory)}
                className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              >
                {filterOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStories.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-2">No stories found</h3>
              <p className="text-[var(--color-text-muted)]">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentStories.map((story) => {
                const Icon = story.type === 'vendor' ? Store : story.type === 'rider' ? Bike : ShoppingBag;
                return (
                  <div
                    key={story.id}
                    className="group bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleStoryClick(story)}
                  >
                    <div className="relative h-48 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] p-6">
                      <div className="absolute top-4 right-4">
                        {story.featured && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                          {story.name[0]}
                        </div>
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{story.name}</h3>
                          <p className="text-white/80 text-sm">{story.role}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Icon className="w-3 h-3" />
                            <span className="text-xs capitalize">{story.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-6">
                        <div className="flex items-center gap-1 text-white/80 text-sm">
                          <MapPin className="w-3 h-3" />
                          {story.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-1 mb-3">
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
                        <span className="text-sm text-[var(--color-text-muted)] ml-2">{story.rating}</span>
                      </div>
                      
                      <p className="text-[var(--color-text-muted)] mb-4 line-clamp-3 italic">"{story.story}"</p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {story.stats.slice(0, 2).map((stat, idx) => {
                          const StatIcon = stat.icon;
                          return (
                            <div key={idx} className="bg-[var(--color-background)] rounded-lg p-2 text-center">
                              <StatIcon className="w-4 h-4 text-[var(--color-primary)] mx-auto mb-1" />
                              <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                              <p className="text-sm font-bold text-[var(--color-text)]">{stat.value}</p>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">{story.date}</span>
                        <span className="text-[var(--color-primary)] font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Read Story
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-soft)]/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === i + 1
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border border-[var(--color-border)] hover:bg-[var(--color-primary-soft)]/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-soft)]/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of successful vendors and riders today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/become-vendor')}
              className="px-8 py-4 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 group"
            >
              Become a Vendor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/become-rider')}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              Become a Rider
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      {isModalOpen && selectedStory && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={closeModal}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={closeModal} />
            
            <div className="relative inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-[var(--color-surface)] rounded-2xl shadow-xl sm:my-8 sm:align-middle" onClick={e => e.stopPropagation()}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative h-64 md:h-80 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] p-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold">
                    {selectedStory.name[0]}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl md:text-3xl font-bold">{selectedStory.name}</h2>
                    <p className="text-white/90 text-lg">{selectedStory.role}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedStory.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedStory.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
                {/* Achievement Badge */}
                <div className="inline-flex items-center gap-2 bg-[var(--color-primary-soft)]/20 text-[var(--color-primary)] px-3 py-1 rounded-full mb-4">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">{selectedStory.achievement}</span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedStory.rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-[var(--color-border)]'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-[var(--color-text-muted)] ml-2">{selectedStory.rating} out of 5</span>
                </div>
                
                {/* Full Story */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">Their Journey</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">{selectedStory.fullStory}</p>
                </div>
                
                {/* Quote */}
                <div className="bg-[var(--color-primary-soft)]/10 rounded-xl p-6 mb-6">
                  <Quote className="w-8 h-8 text-[var(--color-primary)] mb-3 opacity-50" />
                  <p className="text-lg italic text-[var(--color-text)]">"{selectedStory.story}"</p>
                </div>
                
                {/* Stats */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">Key Achievements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedStory.stats.map((stat, idx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={idx} className="bg-[var(--color-background)] rounded-xl p-4 text-center">
                          <StatIcon className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                          <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                          <p className="text-lg font-bold text-[var(--color-text)]">{stat.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Tips Section */}
                {selectedStory.tips && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">Pro Tips from {selectedStory.name}</h3>
                    <ul className="space-y-2">
                      {selectedStory.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-[var(--color-text-muted)]">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Before/After */}
                {selectedStory.beforeAfter && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">The Transformation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[var(--color-background)] rounded-xl p-4">
                        <p className="text-sm text-[var(--color-text-muted)] mb-2">Before</p>
                        <p className="text-[var(--color-text)]">{selectedStory.beforeAfter.before}</p>
                      </div>
                      <div className="bg-[var(--color-background)] rounded-xl p-4">
                        <p className="text-sm text-[var(--color-text-muted)] mb-2">After</p>
                        <p className="text-[var(--color-text)]">{selectedStory.beforeAfter.after}</p>
                      </div>
                    </div>
                    <p className="text-sm text-center text-[var(--color-text-muted)] mt-3">
                      {selectedStory.beforeAfter.description}
                    </p>
                  </div>
                )}
                
                {/* Share Section */}
                <div className="pt-6 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--color-text-muted)]">Share this story:</span>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 rounded-lg bg-blue-700/10 text-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="p-2 rounded-lg bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white transition-colors relative"
                      >
                        <Copy className="w-4 h-4" />
                        {copied && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => router.push(selectedStory.type === 'vendor' ? '/become-vendor' : '/become-rider')}
                      className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors inline-flex items-center gap-2"
                    >
                      {selectedStory.type === 'vendor' ? 'Become a Vendor' : 'Become a Rider'}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}