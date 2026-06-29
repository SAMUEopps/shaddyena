// components/home/HeroSection.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Clock, Shield, TrendingUp, Sparkles } from 'lucide-react';

// Dummy data for hero sections
const heroData = {
  mainFeature: {
    id: 1,
    title: '',
    //title: 'Shaddyna Collection 2026',
    //description: 'Discover the latest trends in fashion with up to 40% off on selected items',
    description: '',
    buttonText: '',
    //buttonText: 'Shop Now',
    buttonLink: '/summer-collection',
    //image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop',
    image: '/hero/Shaddyna.png',
    //discount: '40% OFF',
    discount: '',
  },
  
  topRight: {
    id: 2,
    title: 'Flash Sale',
    subtitle: 'Ends in 24h',
    discount: '60%',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&auto=format&fit=crop',
    link: '/flash-sale',
  },
  
  bottomRight: {
    id: 3,
    title: 'New Arrivals',
    subtitle: 'Spring Collection',
    items: '200+ items',
    image: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=400&auto=format&fit=crop',
    link: '/new-arrivals',
  },
  
  topLeft: {
    id: 4,
    title: 'Free Shipping',
    subtitle: 'On orders $50+',
    icon: 'truck',
    link: '/shipping',
  },
  
  bottomLeft: {
    id: 5,
    title: 'Member Exclusive',
    subtitle: 'Join for extra 20% off',
    badge: 'NEW',
    link: '/membership',
  },
};

const stats = {
  topLeft: {
    value: '50K+',
    label: 'Happy Customers',
    trend: '+25%',
  },
  bottomLeft: {
    value: '1000+',
    label: 'Daily Deals',
    trend: 'Updated',
  },
};

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    setMounted(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

      {/* 
        Main Grid Container
        - 4 columns: 1fr (left) 2fr (middle) 1fr (right)
        - 2 rows: both 1fr to create equal height sections
        - Middle section spans both rows (row-span-2)
        - Left and Right sections each take 1 row
      *
      <div className="relative grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 min-h-[600px]">
        
        {/* LEFT COLUMN - Top Section *
        <div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-primary-alt)] rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          {/* Animated background pattern *
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,white,transparent_50%)] animate-pulse-slow"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {stats.topLeft.trend}
              </span>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-white mb-1">{stats.topLeft.value}</div>
              <p className="text-white/90 text-sm">{stats.topLeft.label}</p>
              
              <div className="flex items-center gap-2 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN - Bottom Section *
        <div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-[var(--color-primary)]/30">
          {/* Decorative badge *
          <div className="absolute top-4 right-4 bg-[var(--color-primary-alt)] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-slow">
            {heroData.bottomLeft.badge}
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[var(--color-primary-soft)]/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-[var(--color-primary-alt)]" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{heroData.bottomLeft.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">{heroData.bottomLeft.subtitle}</p>
              
              <Link 
                href={heroData.bottomLeft.link}
                className="inline-flex items-center text-[var(--color-primary-alt)] hover:text-[var(--color-primary-hover)] font-medium text-sm group/link"
              >
                Join Now
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Main Feature (spans both rows) *
        <div className="lg:col-span-2 lg:row-span-2 group relative bg-[var(--color-primary-alt)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] min-h-[300px] lg:min-h-0">
          {/* Background Image *
          {/*<div className="absolute inset-0">
            <Image
              src={heroData.mainFeature.image}
              alt={heroData.mainFeature.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>*
          {/* Background Image *
<div className="absolute inset-0">
<Image
  src={heroData.mainFeature.image}
  alt={heroData.mainFeature.title}
  fill
  priority
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
/>
</div>

{/* Gradient Overlay *
{/*<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>*
          
          {/* Content *
          <div className="relative h-full flex flex-col justify-end p-8">
            {/* Discount badge *
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-lg font-bold border border-white/30 animate-pulse-slow">
              {heroData.mainFeature.discount}
            </div>
            
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {heroData.mainFeature.title}
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                {heroData.mainFeature.description}
              </p>
              
              <Link
                href={heroData.mainFeature.buttonLink}
                className="inline-flex items-center bg-white text-[var(--color-primary-alt)] px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 group/btn"
              >
                {heroData.mainFeature.buttonText}
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Top Section (Flash Sale) *
        <div className="lg:col-span-1 lg:row-span-1 group relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative h-full flex items-center p-6">
            {/* Small decorative image *
            <div className="absolute right-2 bottom-2 w-20 h-20 rounded-lg overflow-hidden opacity-30">
              <Image
                src={heroData.topRight.image}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">{heroData.topRight.subtitle}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{heroData.topRight.title}</h3>
              
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-white">{heroData.topRight.discount}</span>
                <span className="text-white/80">OFF</span>
              </div>
              
              {/* Countdown timer *
              <div className="flex gap-2 mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                  <div className="text-white font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-white/70 text-xs">Hrs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                  <div className="text-white font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-white/70 text-xs">Min</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                  <div className="text-white font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-white/70 text-xs">Sec</div>
                </div>
              </div>
              
              <Link 
                href={heroData.topRight.link}
                className="inline-flex items-center text-white hover:text-white/90 font-medium text-sm group/link"
              >
                Grab Deal
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Bottom Section (New Arrivals) *
        <div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-[var(--color-primary)]/30">
          <div className="relative h-full flex">
            {/* Content *
            <div className="flex-1 p-6">
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{heroData.bottomRight.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">{heroData.bottomRight.subtitle}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold text-[var(--color-primary-alt)]">{heroData.bottomRight.items}</span>
              </div>
              
              <Link 
                href={heroData.bottomRight.link}
                className="inline-flex items-center text-[var(--color-primary-alt)] hover:text-[var(--color-primary-hover)] font-medium text-sm group/link"
              >
                Explore
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Image *
            <div className="relative w-24 h-full">
              <Image
                src={heroData.bottomRight.image}
                alt=""
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Note *
      <div className="mt-4 text-center text-sm text-[var(--color-text-muted)] lg:hidden">
        <span className="inline-flex items-center gap-1">
          <Shield className="w-4 h-4" />
          Swipe for more deals
        </span>
      </div>
    </section>
  );
};

export default HeroSection;*'*/

// components/home/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Clock, Shield, TrendingUp, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Dummy data for hero sections
const heroData = {
  mainFeature: {
    id: 1,
    title: 'Shaddyna Collection 2026',
    description: 'Discover the latest trends in fashion with up to 40% off on selected items',
    buttonText: 'Shop Now',
    buttonLink: '/summer-collection',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop',
    discount: '40% OFF',
  },
  
  topRight: {
    id: 2,
    title: 'Flash Sale',
    subtitle: 'Ends in 24h',
    discount: '60%',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&auto=format&fit=crop',
    link: '/flash-sale',
  },
  
  bottomRight: {
    id: 3,
    title: 'New Arrivals',
    subtitle: 'Spring Collection',
    items: '200+ items',
    image: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=400&auto=format&fit=crop',
    link: '/new-arrivals',
  },
  
  topLeft: {
    id: 4,
    title: 'Free Shipping',
    subtitle: 'On orders $50+',
    icon: 'truck',
    link: '/shipping',
  },
  
  bottomLeft: {
    id: 5,
    title: 'Member Exclusive',
    subtitle: 'Join for extra 20% off',
    badge: 'NEW',
    link: '/membership',
  },
};

const stats = {
  topLeft: {
    value: '50K+',
    label: 'Happy Customers',
    trend: '+25%',
  },
  bottomLeft: {
    value: '1000+',
    label: 'Daily Deals',
    trend: 'Updated',
  },
};

const HeroSection = () => {
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    setMounted(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

      {/* 
        Main Grid Container
        - 4 columns: 1fr (left) 2fr (middle) 1fr (right)
        - 2 rows: both 1fr to create equal height sections
        - Middle section spans both rows (row-span-2)
        - Left and Right sections each take 1 row
      */}
      <div className="relative grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 min-h-[600px]">
        
        {/* LEFT COLUMN - Top Section */}
        {/*<div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-primary-alt)] rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          {/* Animated background pattern *
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,white,transparent_50%)] animate-pulse-slow"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {stats.topLeft.trend}
              </span>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-white mb-1">{stats.topLeft.value}</div>
              <p className="text-white/90 text-sm">{stats.topLeft.label}</p>
              
              <div className="flex items-center gap-2 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>*/}

              {/* LEFT COLUMN - Bottom Section */}
      <div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-surface)] border border-[var(--color-border]) rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-[var(--color-primary)]/30">
        {/* Decorative badge */}
        <div className="absolute top-4 right-4 bg-[var(--color-primary-alt)] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-slow">
          {user?.role === 'admin' ? 'ADMIN' : heroData.bottomLeft.badge}
        </div>
        
        <div className="relative h-full flex flex-col justify-between">
          <div className="w-12 h-12 bg-[var(--color-primary-soft)]/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {user?.role === 'admin' ? (
              <Settings className="w-6 h-6 text-[var(--color-primary-alt)]" />
            ) : (
              <Sparkles className="w-6 h-6 text-[var(--color-primary-alt)]" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">
              {user?.role === 'admin' ? 'Admin Panel' : heroData.bottomLeft.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              {user?.role === 'admin' ? 'Manage members, funds & more' : heroData.bottomLeft.subtitle}
            </p>
            
            <Link 
              href={user?.role === 'admin' ? '/admin/membership' : '/membership'}
              className="inline-flex items-center text-[var(--color-primary-alt)] hover:text-[var(--color-primary-hover)] font-medium text-sm group/link"
            >
              {user?.role === 'admin' ? 'Go to Admin' : 'Join Now'}
              <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

        {/* LEFT COLUMN - Bottom Section */}
        {/*<div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-[var(--color-primary)]/30">
          {/* Decorative badge *
          <div className="absolute top-4 right-4 bg-[var(--color-primary-alt)] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-slow">
            {heroData.bottomLeft.badge}
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[var(--color-primary-soft)]/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-[var(--color-primary-alt)]" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{heroData.bottomLeft.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">{heroData.bottomLeft.subtitle}</p>
              
              <Link 
                href={heroData.bottomLeft.link}
                className="inline-flex items-center text-[var(--color-primary-alt)] hover:text-[var(--color-primary-hover)] font-medium text-sm group/link"
              >
                Join Now
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>*/}

        <div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-[var(--color-primary)]/30">
          {/* Decorative badge */}
          <div className="absolute top-4 right-4 bg-[var(--color-primary-alt)] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-slow">
            {heroData.bottomLeft.badge}
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-[var(--color-primary-soft)]/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-[var(--color-primary-alt)]" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{heroData.bottomLeft.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">{heroData.bottomLeft.subtitle}</p>
              
              <Link 
                href="/membership"  // Changed from heroData.bottomLeft.link
                className="inline-flex items-center text-[var(--color-primary-alt)] hover:text-[var(--color-primary-hover)] font-medium text-sm group/link"
              >
                Join Now
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Main Feature (spans both rows) */}
        <div className="lg:col-span-2 lg:row-span-2 group relative bg-[var(--color-primary-alt)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] min-h-[300px] lg:min-h-0">
          {/* Background Image */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <Image
              src={heroData.mainFeature.image}
              alt={heroData.mainFeature.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8">
            {/* Discount badge */}
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-lg font-bold border border-white/30 animate-pulse-slow">
              {heroData.mainFeature.discount}
            </div>
            
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {heroData.mainFeature.title}
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                {heroData.mainFeature.description}
              </p>
              
              <Link
                href={heroData.mainFeature.buttonLink}
                className="inline-flex items-center bg-white text-[var(--color-primary-alt)] px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 group/btn"
              >
                {heroData.mainFeature.buttonText}
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Top Section (Flash Sale) */}
        <div className="lg:col-span-1 lg:row-span-1 group relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative h-full flex items-center p-6">
            {/* Small decorative image */}
            <div className="absolute right-2 bottom-2 w-20 h-20 rounded-lg overflow-hidden opacity-30">
              <Image
                src={heroData.topRight.image}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">{heroData.topRight.subtitle}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{heroData.topRight.title}</h3>
              
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-white">{heroData.topRight.discount}</span>
                <span className="text-white/80">OFF</span>
              </div>
              
              {/* Countdown timer */}
              <div className="flex gap-2 mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                  <div className="text-white font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-white/70 text-xs">Hrs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                  <div className="text-white font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-white/70 text-xs">Min</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center min-w-[40px]">
                  <div className="text-white font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-white/70 text-xs">Sec</div>
                </div>
              </div>
              
              <Link 
                href={heroData.topRight.link}
                className="inline-flex items-center text-white hover:text-white/90 font-medium text-sm group/link"
              >
                Grab Deal
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Bottom Section (New Arrivals) */}
        <div className="lg:col-span-1 lg:row-span-1 group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-[var(--color-primary)]/30">
          <div className="relative h-full flex">
            {/* Content */}
            <div className="flex-1 p-6">
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{heroData.bottomRight.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">{heroData.bottomRight.subtitle}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold text-[var(--color-primary-alt)]">{heroData.bottomRight.items}</span>
              </div>
              
              <Link 
                href={heroData.bottomRight.link}
                className="inline-flex items-center text-[var(--color-primary-alt)] hover:text-[var(--color-primary-hover)] font-medium text-sm group/link"
              >
                Explore
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Image */}
            <div className="relative w-24 h-full">
              <Image
                src={heroData.bottomRight.image}
                alt=""
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Note */}
      <div className="mt-4 text-center text-sm text-[var(--color-text-muted)] lg:hidden">
        <span className="inline-flex items-center gap-1">
          <Shield className="w-4 h-4" />
          Swipe for more deals
        </span>
      </div>
    </section>
  );
};

export default HeroSection;