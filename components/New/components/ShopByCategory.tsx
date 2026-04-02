// components/home/ShopByCategory.tsx
/*'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Enhanced dummy data for categories with subcategory images
const categories = [
  {
    id: 1,
    name: "Women's Fashion",
    slug: 'womens-fashion',
    icon: '👗',
    gradient: 'from-pink-500 to-rose-500',
    productCount: '15K+',
    subcategories: [
      { name: 'Dresses', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200&auto=format&fit=crop', count: '3.2K' },
      { name: 'Tops', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200&auto=format&fit=crop', count: '2.8K' },
      { name: 'Bottoms', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200&auto=format&fit=crop', count: '1.9K' },
      { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200&auto=format&fit=crop', count: '1.5K' },
    ]
  },
  {
    id: 2,
    name: "Men's Collection",
    slug: 'mens-collection',
    icon: '👔',
    gradient: 'from-blue-500 to-indigo-500',
    productCount: '12K+',
    subcategories: [
      { name: 'Shirts', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&auto=format&fit=crop', count: '2.5K' },
      { name: 'Pants', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&auto=format&fit=crop', count: '2.1K' },
      { name: 'Suits', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&auto=format&fit=crop', count: '1.2K' },
      { name: 'Accessories', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&auto=format&fit=crop', count: '1.8K' },
    ]
  },
  {
    id: 3,
    name: 'Electronics',
    slug: 'electronics',
    icon: '📱',
    gradient: 'from-purple-500 to-violet-500',
    productCount: '8K+',
    subcategories: [
      { name: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop', count: '2.3K' },
      { name: 'Laptops', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop', count: '1.7K' },
      { name: 'Audio', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop', count: '1.4K' },
      { name: 'Gaming', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop', count: '1.1K' },
    ]
  },
  {
    id: 4,
    name: 'Home & Living',
    slug: 'home-living',
    icon: '🏠',
    gradient: 'from-green-500 to-emerald-500',
    productCount: '10K+',
    subcategories: [
      { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop', count: '2.4K' },
      { name: 'Decor', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop', count: '2.2K' },
      { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop', count: '1.8K' },
      { name: 'Bedding', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop', count: '1.3K' },
    ]
  },
  {
    id: 5,
    name: 'Beauty & Health',
    slug: 'beauty-health',
    icon: '💄',
    gradient: 'from-orange-500 to-amber-500',
    productCount: '7K+',
    subcategories: [
      { name: 'Skincare', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&auto=format&fit=crop', count: '1.9K' },
      { name: 'Makeup', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&auto=format&fit=crop', count: '1.6K' },
      { name: 'Haircare', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&auto=format&fit=crop', count: '1.2K' },
      { name: 'Fragrance', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&auto=format&fit=crop', count: '0.9K' },
    ]
  },
  {
    id: 6,
    name: 'Jewelry & Watches',
    slug: 'jewelry-watches',
    icon: '⌚',
    gradient: 'from-yellow-500 to-amber-500',
    productCount: '5K+',
    subcategories: [
      { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&auto=format&fit=crop', count: '1.1K' },
      { name: 'Rings', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&auto=format&fit=crop', count: '0.8K' },
      { name: 'Watches', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&auto=format&fit=crop', count: '1.3K' },
      { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&auto=format&fit=crop', count: '0.7K' },
    ]
  },
  {
    id: 7,
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    icon: '⚽',
    gradient: 'from-red-500 to-rose-500',
    productCount: '6K+',
    subcategories: [
      { name: 'Gym', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&auto=format&fit=crop', count: '1.5K' },
      { name: 'Camping', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&auto=format&fit=crop', count: '1.2K' },
      { name: 'Cycling', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&auto=format&fit=crop', count: '1.1K' },
      { name: 'Running', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&auto=format&fit=crop', count: '1.3K' },
    ]
  },
  {
    id: 8,
    name: 'Toys & Games',
    slug: 'toys-games',
    icon: '🎮',
    gradient: 'from-cyan-500 to-blue-500',
    productCount: '4K+',
    subcategories: [
      { name: 'Action Figures', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&auto=format&fit=crop', count: '0.9K' },
      { name: 'Board Games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&auto=format&fit=crop', count: '0.7K' },
      { name: 'Puzzles', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&auto=format&fit=crop', count: '0.5K' },
      { name: 'Outdoor', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&auto=format&fit=crop', count: '0.8K' },
    ]
  },
];

const ShopByCategory = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Width of card + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">

      {/* Navigation Header with Title *
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-primary-alt)]">
          Shop by Category
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)] shadow-md flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories Carousel *
      <div className="relative">
        {/* Scroll Container *
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative min-w-[320px] sm:min-w-[340px] snap-start"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Main Category Card *
              <div className="relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500">
                
                {/* Header with gradient *
                <div className={`absolute top-0 left-0 right-0 h-16 opacity-90`}>
                  {/* Decorative pattern *
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                </div>

                {/* Category Title and Icon *
                <div className="relative z-10 p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/*<div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-3xl shadow-xl transform -mt-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {category.icon}
                      </div>*
                      <div>
                        <h3 className="text-xl font-bold text-[var(--color-primary-alt)] mb-0.5 drop-shadow-md">
                          {category.name}
                        </h3>
                        {/*<span className="text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                          {category.productCount} products
                        </span>*
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcategories Grid - 2x2 layout *
                <div className="relative p-3 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    {category.subcategories.map((sub, idx) => (
                      <div
                        key={idx}
                        className="group/sub relative overflow-hidden rounded-lg bg-[var(--color-background-soft)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/category/${category.slug}/${sub.name.toLowerCase()}`;
                        }}
                      >
                        {/* Subcategory Image *
                        <div className="relative h-20 w-full overflow-hidden">
                          <Image
                            src={sub.image}
                            alt={sub.name}
                            fill
                            className="object-cover group-hover/sub:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient overlay *
                          <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover/sub:opacity-30 transition-opacity duration-300`}></div>
                          
                          {/* Product count badge *
                          {/*<div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full">
                            {sub.count}
                          </div>*
                        </div>

                        {/* Subcategory Name *
                        <div className="p-2 text-center">
                          <p className="text-xs font-medium text-[var(--color-text)] group-hover/sub:text-[var(--color-primary)] transition-colors">
                            {sub.name}
                          </p>
                        </div>

                        {/* Hover effect shine *
                        <div className="absolute inset-0 opacity-0 group-hover/sub:opacity-100 pointer-events-none overflow-hidden">
                          <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar with View All *
                <div className="relative px-5 pb-5">
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      4 subcategories
                    </span>
                    <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] group-hover:gap-2 transition-all">
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Animated border on hover *
                <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shine animation *
      <style jsx>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ShopByCategory;*/

/*// components/home/ShopByCategory.tsx (updated)

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  gradient?: string;
  productCount?: number;
  children?: Category[];
}

const gradientColors = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-violet-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-yellow-500 to-amber-500',
  'from-red-500 to-rose-500',
  'from-cyan-500 to-blue-500',
];

const ShopByCategory = () => {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category?level=1&featured=true');
        if (response.data.categories) {
          // Fetch children for each category (limit to 4 subcategories)
          const categoriesWithChildren = await Promise.all(
            response.data.categories.slice(0, 8).map(async (category: Category, index: number) => {
              const childrenRes = await axios.get(`/api/category?parentId=${category._id}&limit=4`);
              return {
                ...category,
                gradient: gradientColors[index % gradientColors.length],
                children: childrenRes.data.categories || []
              };
            })
          );
          setCategories(categoriesWithChildren);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted || loading) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-primary-alt)]">
            Shop by Category
          </h2>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      {/* Navigation Header with Title *
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-primary-alt)]">
          Shop by Category
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)] shadow-md flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories Carousel *
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="group relative min-w-[320px] sm:min-w-[340px] snap-start"
              onMouseEnter={() => setHoveredId(category._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Header with gradient *
                <div className={`absolute top-0 left-0 right-0 h-16 opacity-90 bg-gradient-to-r ${category.gradient}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                </div>

                {/* Category Title and Icon *
                <div className="relative z-10 p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-0.5 drop-shadow-md">
                          {category.name}
                        </h3>
                        {category.productCount && category.productCount > 0 && (
                          <span className="text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                            {category.productCount}+ products
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcategories Grid - 2x2 layout *
                <div className="relative p-3 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    {category.children?.slice(0, 4).map((sub, idx) => (
                      <div
                        key={sub._id}
                        className="group/sub relative overflow-hidden rounded-lg bg-[var(--color-background-soft)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/category/${sub.slug}`;
                        }}
                      >
                        {/* Subcategory Image *
                        <div className="relative h-20 w-full overflow-hidden">
                          {sub.image ? (
                            <Image
                              src={sub.image}
                              alt={sub.name}
                              fill
                              className="object-cover group-hover/sub:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <span className="text-2xl">📦</span>
                            </div>
                          )}
                          <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover/sub:opacity-30 transition-opacity duration-300`}></div>
                          
                          {sub.productCount && sub.productCount > 0 && (
                            <div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full">
                              {sub.productCount}
                            </div>
                          )}
                        </div>

                        {/* Subcategory Name *
                        <div className="p-2 text-center">
                          <p className="text-xs font-medium text-[var(--color-text)] group-hover/sub:text-[var(--color-primary)] transition-colors">
                            {sub.name}
                          </p>
                        </div>

                        {/* Hover effect shine *
                        <div className="absolute inset-0 opacity-0 group-hover/sub:opacity-100 pointer-events-none overflow-hidden">
                          <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar with View All *
                <div className="relative px-5 pb-5">
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {category.children?.length || 0} subcategories
                    </span>
                    <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] group-hover:gap-2 transition-all">
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Animated border on hover *
                <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ShopByCategory;*/ 
// components/home/ShopByCategory.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import CategoryCard from './CategoryCard';

interface CategoryMetadata {
  productCount: number;
  popular: boolean;
  featured: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  gradient?: string;
  metadata?: CategoryMetadata;
  productCount?: number; // For backward compatibility
  children?: Category[];
  path?: string;
  level?: number;
}

const gradientColors = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-violet-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-yellow-500 to-amber-500',
  'from-red-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-teal-500 to-emerald-500',
  'from-indigo-500 to-purple-500',
];

const ShopByCategory = () => {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const fetchCategories = async () => {
      try {
        // Fetch featured/popular level 1 categories
        const response = await axios.get('/api/category?level=1&featured=true&limit=8');
       // const response = await axios.get('/api/category?level=1&limit=8');
        if (response.data.categories && response.data.categories.length > 0) {
          // Fetch children for each category and get accurate product counts
          const categoriesWithChildren = await Promise.all(
            response.data.categories.map(async (category: Category, index: number) => {
              try {
                // Fetch subcategories (level 2)
                const childrenRes = await axios.get(`/api/category?parentId=${category._id}&limit=4`);
                
                // Get product counts for subcategories with null safety
                const childrenWithCounts = childrenRes.data.categories?.map((child: Category) => ({
                  ...child,
                  productCount: child.metadata?.productCount ?? 0,
                  hasProducts: (child.metadata?.productCount ?? 0) > 0
                })) || [];
                
                // Sort subcategories by product count (popular first)
                const sortedChildren = childrenWithCounts.sort((a: Category, b: Category) => 
                  (b.metadata?.productCount ?? 0) - (a.metadata?.productCount ?? 0)
                );
                
                return {
                  ...category,
                  gradient: gradientColors[index % gradientColors.length],
                  productCount: category.metadata?.productCount ?? 0,
                  children: sortedChildren,
                  hasProducts: (category.metadata?.productCount ?? 0) > 0
                };
              } catch (error) {
                console.error(`Error fetching children for ${category.name}:`, error);
                return {
                  ...category,
                  gradient: gradientColors[index % gradientColors.length],
                  productCount: category.metadata?.productCount ?? 0,
                  children: [],
                  hasProducts: (category.metadata?.productCount ?? 0) > 0
                };
              }
            })
          );
          
          // Filter categories that have products (optional - show only categories with products)
          const categoriesWithProducts = categoriesWithChildren.filter(cat => cat.hasProducts);
          //const categoriesWithProducts = categoriesWithChildren;
          
          setCategories(categoriesWithProducts.length > 0 ? categoriesWithProducts : categoriesWithChildren);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360; // Increased for better scrolling
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const formatProductCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return count.toString();
  };

  const getProductCount = (category: Category): number => {
    return category.metadata?.productCount ?? category.productCount ?? 0;
  };

  const isFeatured = (category: Category): boolean => {
    return category.metadata?.featured ?? false;
  };

  if (!mounted || loading) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-primary-alt)]">
            Shop by Category
          </h2>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Section Header with Decoration */}
      <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
        {/* Title */}
        <div>
          <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-primary-alt)] leading-tight">
            Shop by Category
          </h2>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-2">
          
          {/* All Categories Button */}
          <Link 
            href="/categories"
            className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 lg:px-5 py-1 xs:py-1.5 sm:py-2 lg:py-2.5 rounded-full border border-[var(--color-primary-alt)] bg-[var(--color-surface)] text-[var(--color-primary-alt)] text-[9px] xs:text-[10px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:bg-[var(--color-primary-alt)] hover:text-white hover:scale-105"
          >
            <span className="hidden xs:inline">All Categories</span>
            <span className="xs:hidden">All</span>
            <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 transition-transform duration-300" />
          </Link>

          {/* Scroll buttons - HIDDEN on very small screens */}
          <div className="hidden xs:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-105"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={() => scroll('right')}
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)] shadow-sm flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all duration-300 hover:scale-105"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-0 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/*{categories.map((category) => {
            const productCount = getProductCount(category);
            const featured = isFeatured(category);
            
            return (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className="group relative min-w-[320px] sm:min-w-[360px] snap-start"
              >
                <div className="relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  {/* Header with gradient *
                  <div className={`absolute top-0 left-0 right-0 h-20 opacity-90 bg-gradient-to-r ${category.gradient}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                    {/* Decorative sparkles for featured categories *
                    {featured && (
                      <div className="absolute top-2 right-2">
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Category Title and Stats *
                  <div className="relative z-10 p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md line-clamp-1">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {productCount > 0 && (
                            <span className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              {formatProductCount(productCount)} products
                            </span>
                          )}
                          {category.children && category.children.length > 0 && (
                            <span className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              {category.children.length} subcategories
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Category Icon *
                      {category.icon && (
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-xl">{category.icon}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subcategories Grid - 2x2 layout *
                  <div className="relative p-4 pt-2">
                    {category.children && category.children.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {category.children.slice(0, 4).map((sub) => {
                          const subProductCount = getProductCount(sub);
                          
                          return (
                            <div
                              key={sub._id}
                              className="group/sub relative overflow-hidden rounded-lg bg-[var(--color-background-soft)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/category/${sub.slug}`;
                              }}
                            >
                              {/* Subcategory Image/Icon *
                              <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                {sub.image ? (
                                  <Image
                                    src={sub.image}
                                    alt={sub.name}
                                    fill
                                    className="object-cover group-hover/sub:scale-110 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-3xl opacity-50">{sub.icon || '📦'}</span>
                                  </div>
                                )}
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover/sub:opacity-30 transition-opacity duration-300`}></div>
                                
                                {/* Product count badge *
                                {subProductCount > 0 && (
                                  <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                    {formatProductCount(subProductCount)}
                                  </div>
                                )}
                              </div>

                              {/* Subcategory Name *
                              <div className="p-2 text-center">
                                <p className="text-xs font-medium text-[var(--color-text)] group-hover/sub:text-[var(--color-primary)] transition-colors line-clamp-2">
                                  {sub.name}
                                </p>
                              </div>

                              {/* Hover effect shine *
                              <div className="absolute inset-0 opacity-0 group-hover/sub:opacity-100 pointer-events-none overflow-hidden">
                                <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8 text-center">
                        <p className="text-sm text-[var(--color-text-muted)]">
                          No subcategories available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar with View All *
                  <div className="relative px-5 pb-5">
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {productCount} products total
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] group-hover:gap-2 transition-all">
                        <span>Browse All</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Animated border on hover *
                  <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
                </div>
              </Link>
            );
          })}*/}
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                getProductCount={getProductCount}
                isFeatured={isFeatured}
                formatProductCount={formatProductCount}
              />
            ))}
        </div>
      </div>

      {/* Optional: View All Categories Link */}
      {categories.length >= 4 && (
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 hover:scale-105"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ShopByCategory;