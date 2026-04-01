// app/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Heart,
  Target,
  Lightbulb,
  Users,
  Shield,
  Rocket,
  Award,
  TrendingUp,
  ShoppingBag,
  Store,
  Truck,
  Smile,
  Globe,
  Star,
  CheckCircle,
  ChevronRight,
  Play,
  Calendar,
  MapPin,
  Briefcase,
  Quote,
  Sparkles,
  Zap,
  Coffee,
  Crown,
  BookOpen,
  Eye,
  Flag,
  BarChart3,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Company Values
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. We strive to exceed expectations every day.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Integrity',
      description: 'We build lasting relationships through transparency, honesty, and ethical practices.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Constantly evolving with technology to provide the best shopping experience.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Empowering local businesses and creating opportunities for growth.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Milestones Timeline
  const milestones = [
    {
      year: '2021',
      title: 'The Beginning',
      description: 'Shaddyna was founded with a vision to revolutionize e-commerce in Kenya.',
      icon: <Rocket className="w-6 h-6" />,
      achievements: ['Started with 50 vendors', 'First 100 orders', 'Launched in Nairobi']
    },
    {
      year: '2022',
      title: 'Rapid Growth',
      description: 'Expanded services and reached new milestones in customer satisfaction.',
      icon: <TrendingUp className="w-6 h-6" />,
      achievements: ['10,000+ happy customers', '500+ vendors joined', 'Launched mobile app']
    },
    {
      year: '2023',
      title: 'Expansion',
      description: 'Extended delivery network across major Kenyan cities.',
      icon: <Globe className="w-6 h-6" />,
      achievements: ['Delivery to 15 counties', '1,000+ products listed', '24/7 customer support']
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Launched AI-powered recommendations and enhanced vendor tools.',
      icon: <Sparkles className="w-6 h-6" />,
      achievements: ['50,000+ active users', '2,000+ vendors', '98% satisfaction rate']
    }
  ];

  // Stats
  const stats = [
    { value: '50,000+', label: 'Happy Customers', icon: <Smile className="w-6 h-6" />, trend: '+125%' },
    { value: '2,000+', label: 'Trusted Vendors', icon: <Store className="w-6 h-6" />, trend: '+80%' },
    { value: '100,000+', label: 'Products Sold', icon: <ShoppingBag className="w-6 h-6" />, trend: '+200%' },
    { value: '98%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" />, trend: '+15%' },
    { value: '24/7', label: 'Support Available', icon: <Clock className="w-6 h-6" />, trend: 'Always' },
    { value: '15+', label: 'Counties Served', icon: <MapPin className="w-6 h-6" />, trend: 'Growing' }
  ];

  // Team Members (Leadership)
  const team = [
    {
      name: 'Sarah Wanjiku',
      role: 'CEO & Co-founder',
      bio: 'Former e-commerce executive with 10+ years of experience in retail technology.',
      image: '/team/sarah.jpg',
      icon: <Crown className="w-5 h-5" />,
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'James Otieno',
      role: 'CTO & Co-founder',
      bio: 'Tech innovator passionate about creating seamless digital experiences.',
      image: '/team/james.jpg',
      icon: <Zap className="w-5 h-5" />,
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Grace Muthoni',
      role: 'Head of Operations',
      bio: 'Logistics expert ensuring smooth deliveries across the country.',
      image: '/team/grace.jpg',
      icon: <Truck className="w-5 h-5" />,
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Michael Kiprono',
      role: 'Head of Vendor Relations',
      bio: 'Building strong partnerships with local businesses and entrepreneurs.',
      image: '/team/michael.jpg',
      icon: <Store className="w-5 h-5" />,
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Anne Mwangi',
      role: 'Regular Customer',
      content: 'Shaddyna has transformed how I shop. The convenience, variety, and customer service are unmatched!',
      avatar: '/avatars/anne.jpg',
      rating: 5,
      icon: <Star className="w-5 h-5 fill-current" />
    },
    {
      name: 'David Kariuki',
      role: 'Vendor',
      content: 'Being a vendor on Shaddyna has helped my business grow exponentially. The platform is easy to use and the support team is amazing!',
      avatar: '/avatars/david.jpg',
      rating: 5,
      icon: <Star className="w-5 h-5 fill-current" />
    },
    {
      name: 'Mary Nduta',
      role: 'Small Business Owner',
      content: 'The exposure and reach I\'ve gained through Shaddyna is incredible. My sales have tripled in just 6 months!',
      avatar: '/avatars/mary.jpg',
      rating: 5,
      icon: <Star className="w-5 h-5 fill-current" />
    }
  ];

  // Awards & Recognitions
  const awards = [
    { name: 'Best E-commerce Platform 2023', issuer: 'Kenya Digital Awards', year: '2023', icon: <Award className="w-5 h-5" /> },
    { name: 'Innovation in Retail Tech', issuer: 'East Africa Tech Summit', year: '2023', icon: <Lightbulb className="w-5 h-5" /> },
    { name: 'Customer Service Excellence', issuer: 'Kenya Customer Experience Awards', year: '2024', icon: <Star className="w-5 h-5" /> }
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
              <Heart className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6">
              Empowering Kenyan Commerce
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-8 leading-relaxed">
              We're on a mission to connect Kenyan buyers with local sellers, creating a vibrant marketplace that celebrates local entrepreneurship.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Globe className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">Nationwide Delivery</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">2,000+ Vendors</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
                <Smile className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm">50,000+ Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-2xl p-8 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 group">
            <div className="inline-flex p-3 bg-[var(--color-primary)]/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">Our Mission</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              To create a seamless, trustworthy, and accessible e-commerce platform that empowers Kenyan entrepreneurs and provides customers with a superior shopping experience.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[var(--color-primary-alt)]/5 to-transparent rounded-2xl p-8 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 group">
            <div className="inline-flex p-3 bg-[var(--color-primary-alt)]/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8 text-[var(--color-primary-alt)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">Our Vision</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              To become Kenya's most loved and trusted marketplace, connecting every Kenyan with the products they need while fostering economic growth and digital inclusion.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-12 text-center">
            Shaddyna by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 group">
                <div className="inline-flex p-2 bg-[var(--color-primary)]/10 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">{stat.label}</p>
                <p className="text-xs text-green-500 font-medium">{stat.trend}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Our Core Values</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            These principles guide everything we do, from how we treat our customers to how we support our vendors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl">
                <div className={`inline-flex p-3 bg-gradient-to-r ${value.color} rounded-xl mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{value.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Our Journey</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            From a small idea to a thriving marketplace - here's how we've grown
          </p>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary-alt)] to-transparent transform md:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`relative flex flex-col md:flex-row ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-8`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full transform -translate-x-1/2 md:-translate-x-1/2 z-10"></div>
                  
                  {/* Content */}
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-20 md:pl-0`}>
                    <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300">
                      <div className={`inline-flex p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-lg mb-3 ${idx % 2 === 0 ? '' : ''}`}>
                        {milestone.icon}
                      </div>
                      <div className="text-sm text-[var(--color-primary)] font-semibold mb-1">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{milestone.title}</h3>
                      <p className="text-[var(--color-text-muted)] text-sm mb-3">{milestone.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.achievements.map((achievement, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Meet the Team</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            The passionate people behind Shaddyna who work tirelessly to serve you better
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl text-center">
                <div className="relative mb-4 inline-block">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full flex items-center justify-center">
                    <div className="w-22 h-22 bg-[var(--color-surface)] rounded-full flex items-center justify-center">
                      <div className="text-4xl">{member.icon}</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{member.name}</h3>
                <p className="text-sm text-[var(--color-primary)] mb-2">{member.role}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">What Our Community Says</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Real stories from customers and vendors who trust Shaddyna
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--color-primary)]/20" />
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-[var(--color-text-muted)] mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{testimonial.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Awards & Recognition</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            We're honored to be recognized for our commitment to excellence
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award, idx) => (
              <div key={idx} className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-6 border border-[var(--color-border)] text-center group hover:shadow-xl transition-all">
                <div className="inline-flex p-3 bg-[var(--color-primary)]/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  {award.icon}
                </div>
                <h3 className="font-bold text-[var(--color-text)] mb-2">{award.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{award.issuer}</p>
                <p className="text-xs text-[var(--color-primary)] mt-2">{award.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're a customer looking for great products or a vendor wanting to grow your business, we're here for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
            >
              Start Shopping
            </Link>
            <Link
              href="/become-vendor"
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105 border border-white/30"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;