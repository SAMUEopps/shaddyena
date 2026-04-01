// app/press/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Newspaper,
  Download,
  FileText,
  Image,
  Video,
  Award,
  Star,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Share2,
  ExternalLink,
  BookOpen,
  Mic,
  Tv,
  Radio,
  Zap,
  Heart,
  Building,
  BarChart3,
  Sparkles,
  Quote,
  MapPin,
  Rocket,
  ShoppingBag,
  Store
} from 'lucide-react';
import Link from 'next/link';


const PressPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [copiedLogo, setCopiedLogo] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Press Releases
  const pressReleases = [
    {
      id: '1',
      title: 'Shaddyna Raises $5M Series A to Expand E-commerce Operations in East Africa',
      date: 'March 15, 2024',
      summary: 'The funding round was led by leading VC firms to accelerate growth and expand delivery network across Kenya and East Africa.',
      category: 'funding',
      source: 'TechCrunch',
      sourceLogo: '🔷',
      url: '#',
      image: '/press/funding.jpg',
      featured: true
    },
    {
      id: '2',
      title: 'Shaddyna Launches AI-Powered Vendor Tools to Boost Small Business Sales',
      date: 'February 28, 2024',
      summary: 'New tools help vendors optimize pricing, predict inventory needs, and reach more customers through personalized recommendations.',
      category: 'product',
      source: 'Business Daily Africa',
      sourceLogo: '📰',
      url: '#',
      image: '/press/product-launch.jpg',
      featured: false
    },
    {
      id: '3',
      title: 'How Shaddyna is Revolutionizing E-commerce for Kenyan SMEs',
      date: 'January 20, 2024',
      summary: 'Feature story on how the platform is empowering local entrepreneurs to sell online and reach customers nationwide.',
      category: 'feature',
      source: 'The Nation',
      sourceLogo: '📖',
      url: '#',
      image: '/press/feature.jpg',
      featured: false
    },
    {
      id: '4',
      title: 'Shaddyna Partners with Safaricom to Offer M-Pesa Payment Integration',
      date: 'December 10, 2023',
      summary: 'Strategic partnership simplifies mobile payments for customers and vendors across the platform.',
      category: 'partnership',
      source: 'Citizen Digital',
      sourceLogo: '📺',
      url: '#',
      image: '/press/partnership.jpg',
      featured: false
    }
  ];

  // Media Mentions
  const mediaMentions = [
    {
      id: '1',
      title: 'Top 10 Kenyan Startups to Watch in 2024',
      publication: 'Forbes Africa',
      logo: '📈',
      date: 'January 5, 2024',
      url: '#',
      type: 'feature'
    },
    {
      id: '2',
      title: 'Shaddyna Named Among Most Innovative Companies in East Africa',
      publication: 'Fast Company',
      logo: '⚡',
      date: 'February 10, 2024',
      url: '#',
      type: 'award'
    },
    {
      id: '3',
      title: 'How E-commerce is Transforming Retail in Kenya',
      publication: 'CNN International',
      logo: '🌍',
      date: 'March 1, 2024',
      url: '#',
      type: 'feature'
    },
    {
      id: '4',
      title: 'Shaddyna CEO Featured in Entrepreneur Magazine',
      publication: 'Entrepreneur',
      logo: '💡',
      date: 'February 15, 2024',
      url: '#',
      type: 'profile'
    },
    {
      id: '5',
      title: 'The Future of Online Shopping in Africa',
      publication: 'BBC News',
      logo: '📺',
      date: 'January 28, 2024',
      url: '#',
      type: 'feature'
    },
    {
      id: '6',
      title: 'Shaddyna Wins Best E-commerce Platform Award',
      publication: 'Kenya Digital Awards',
      logo: '🏆',
      date: 'December 5, 2023',
      url: '#',
      type: 'award'
    }
  ];

  // Company Stats & Infographics
  const companyStats = [
    { value: '50,000+', label: 'Active Customers', icon: <Users className="w-5 h-5" />, growth: '+125%' },
    { value: '2,000+', label: 'Vendors', icon: <Store className="w-5 h-5" />, growth: '+80%' },
    { value: '100,000+', label: 'Products Sold', icon: <ShoppingBag className="w-5 h-5" />, growth: '+200%' },
    { value: '98%', label: 'Customer Satisfaction', icon: <Star className="w-5 h-5" />, growth: '+15%' },
    { value: '15+', label: 'Counties Served', icon: <MapPin className="w-5 h-5" />, growth: 'Expanding' },
    { value: '24/7', label: 'Support Available', icon: <Clock className="w-5 h-5" />, growth: 'Always' }
  ];

  // Key Milestones for Infographic
  const milestones = [
    { year: '2021', event: 'Company Founded', icon: <Rocket className="w-5 h-5" /> },
    { year: '2022', event: '10,000 Customers', icon: <Users className="w-5 h-5" /> },
    { year: '2023', event: '500+ Vendors', icon: <Store className="w-5 h-5" /> },
    { year: '2024', event: '$5M Series A', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  // Media Kit Resources
  const mediaKitResources = [
    { name: 'Logo Package', type: 'ZIP', size: '2.5 MB', icon: <Image className="w-5 h-5" />, url: '#' },
    { name: 'Brand Guidelines', type: 'PDF', size: '1.2 MB', icon: <FileText className="w-5 h-5" />, url: '#' },
    { name: 'Press Photos', type: 'ZIP', size: '15 MB', icon: <Image className="w-5 h-5" />, url: '#' },
    { name: 'Company Fact Sheet', type: 'PDF', size: '0.8 MB', icon: <FileText className="w-5 h-5" />, url: '#' },
    { name: 'Executive Bios', type: 'PDF', size: '1.1 MB', icon: <Users className="w-5 h-5" />, url: '#' },
    { name: 'Media Kit (Complete)', type: 'ZIP', size: '25 MB', icon: <Download className="w-5 h-5" />, url: '#' }
  ];

  // Awards & Recognition
  const awards = [
    { name: 'Best E-commerce Platform 2023', issuer: 'Kenya Digital Awards', year: '2023', icon: <Award className="w-5 h-5" /> },
    { name: 'Innovation in Retail Tech', issuer: 'East Africa Tech Summit', year: '2023', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Customer Service Excellence', issuer: 'Kenya Customer Experience Awards', year: '2024', icon: <Star className="w-5 h-5" /> },
    { name: 'Top 50 Startups in Africa', issuer: 'African Business Magazine', year: '2024', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  // Press Contact
  const pressContacts = [
    {
      name: 'Sarah Wanjiku',
      role: 'Head of Communications',
      email: 'press@shaddyna.com',
      phone: '+254 700 000 000',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'James Otieno',
      role: 'PR Manager',
      email: 'james.otieno@shaddyna.com',
      phone: '+254 711 111 111',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const copyToClipboard = (text: string, type: 'logo' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'logo') {
      setCopiedLogo(true);
      setTimeout(() => setCopiedLogo(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  if (!mounted) return null;

  const featuredRelease = pressReleases.find(r => r.featured);
  const otherReleases = pressReleases.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-20 md:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Newspaper className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-8 leading-relaxed">
              Latest news, media coverage, and resources for journalists
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#press-releases"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all hover:scale-105"
              >
                Latest News
              </Link>
              <Link
                href="#media-kit"
                className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-semibold hover:border-[var(--color-primary)] transition-all"
              >
                Download Media Kit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Press Release */}
        {featuredRelease && (
          <div id="press-releases" className="mb-20 scroll-mt-20">
            <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-2xl overflow-hidden border border-[var(--color-border)]">
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                    FEATURED
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">{featuredRelease.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-3">
                  {featuredRelease.title}
                </h2>
                <p className="text-[var(--color-text-muted)] mb-4">{featuredRelease.summary}</p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{featuredRelease.sourceLogo}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{featuredRelease.source}</span>
                  </div>
                  <Link
                    href={featuredRelease.url}
                    className="inline-flex items-center space-x-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
                  >
                    <span>Read Full Story</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Mentions Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">In the News</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Featured in leading publications around the world
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {mediaMentions.slice(0, 6).map((mention, idx) => (
              <a
                key={idx}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-lg"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{mention.logo}</div>
                <p className="text-xs font-medium text-[var(--color-text)]">{mention.publication}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{mention.date}</p>
              </a>
            ))}
          </div>

          {/* All Media Mentions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaMentions.map((mention) => (
              <a
                key={mention.id}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{mention.logo}</div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">{mention.publication}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">{mention.date}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                </div>
                <p className="text-sm text-[var(--color-text)]">{mention.title}</p>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full capitalize">
                    {mention.type}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Press Releases Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Press Releases</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Official announcements and company news
          </p>
          
          <div className="space-y-4">
            {otherReleases.map((release) => (
              <div
                key={release.id}
                className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm text-[var(--color-text-muted)]">{release.date}</span>
                      <span className="text-xs px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full capitalize">
                        {release.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{release.title}</h3>
                    <p className="text-[var(--color-text-muted)] mb-3">{release.summary}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{release.sourceLogo}</span>
                      <span className="text-sm text-[var(--color-text-muted)]">{release.source}</span>
                    </div>
                  </div>
                  <Link
                    href={release.url}
                    className="flex-shrink-0 px-4 py-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Statistics & Infographics */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Company Snapshot</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Key metrics and milestones
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {companyStats.map((stat, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all">
                <div className="inline-flex p-2 bg-[var(--color-primary)]/10 rounded-lg mb-2">
                  {stat.icon}
                </div>
                <p className="text-xl font-bold text-[var(--color-text)]">{stat.value}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                <p className="text-xs text-green-500 mt-1">{stat.growth}</p>
              </div>
            ))}
          </div>

          {/* Milestone Timeline */}
          <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-6 text-center">Our Journey</h3>
            <div className="flex flex-wrap justify-between items-center gap-4">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex-1 text-center relative">
                  <div className="inline-flex p-3 bg-[var(--color-primary)]/10 rounded-full mb-2">
                    {milestone.icon}
                  </div>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{milestone.year}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{milestone.event}</p>
                  {idx < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-[var(--color-border)] transform -translate-y-1/2 -z-10"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Awards & Recognition</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            We're honored to be recognized for our work
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-5 text-center border border-[var(--color-border)] hover:shadow-lg transition-all group">
                <div className="inline-flex p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-3 text-white group-hover:scale-110 transition-transform">
                  {award.icon}
                </div>
                <h3 className="font-bold text-[var(--color-text)] mb-1">{award.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{award.issuer}</p>
                <p className="text-xs text-[var(--color-primary)] mt-2">{award.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit Section */}
        <div id="media-kit" className="mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Media Kit</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Download logos, photos, and brand assets
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Downloadable Resources */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                Resources
              </h3>
              <div className="space-y-3">
                {mediaKitResources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    className="flex items-center justify-between p-3 bg-[var(--color-background-soft)] rounded-xl hover:bg-[var(--color-primary)]/10 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                        {resource.icon}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{resource.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{resource.type} • {resource.size}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-[var(--color-primary)]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Logo Download */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)]">
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Logo Assets</h3>
              <div className="bg-[var(--color-background-soft)] rounded-xl p-6 text-center mb-4">
                <div className="inline-flex p-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl mb-3">
                  <span className="text-3xl font-bold text-white">S</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Primary Logo (Color)</p>
                <button
                  onClick={() => copyToClipboard('Shaddyna Logo URL', 'logo')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-sm hover:bg-[var(--color-primary)]/20 transition-colors"
                >
                  {copiedLogo ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Logo URL</span>
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-[var(--color-background-soft)] rounded-lg">
                  <div className="text-2xl mb-1">⚪</div>
                  <p className="text-xs text-[var(--color-text-muted)]">White Logo</p>
                  <button className="text-xs text-[var(--color-primary)] mt-1">Download</button>
                </div>
                <div className="text-center p-3 bg-[var(--color-background-soft)] rounded-lg">
                  <div className="text-2xl mb-1">⬛</div>
                  <p className="text-xs text-[var(--color-text-muted)]">Black Logo</p>
                  <button className="text-xs text-[var(--color-primary)] mt-1">Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Press Contact */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Press Contact</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            For media inquiries, please reach out to our communications team
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pressContacts.map((contact, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {contact.name[0]}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">{contact.name}</h3>
                <p className="text-sm text-[var(--color-primary)] mb-3">{contact.role}</p>
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => copyToClipboard(contact.email, 'email')}
                    className="flex items-center justify-center space-x-2 w-full text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                    {copiedEmail && <Check className="w-3 h-3 text-green-500" />}
                  </button>
                  <a href={`tel:${contact.phone}`} className="flex items-center justify-center space-x-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
                <div className="flex justify-center space-x-3">
                  <a href={contact.linkedin} className="p-2 bg-[var(--color-background-soft)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors">
                    <Linkedin className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </a>
                  <a href={contact.twitter} className="p-2 bg-[var(--color-background-soft)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors">
                    <Twitter className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              For general inquiries: <a href="mailto:info@shaddyna.com" className="text-[var(--color-primary)]">info@shaddyna.com</a>
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-alt)]/10 rounded-2xl p-8 text-center border border-[var(--color-border)]">
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Subscribe to Press Updates</h3>
          <p className="text-[var(--color-text-muted)] mb-6">Get the latest news and announcements delivered to your inbox</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            />
            <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PressPage;