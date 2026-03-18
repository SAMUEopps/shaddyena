// components/home/ShopByCategory.tsx
'use client';

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

      {/* Navigation Header with Title */}
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

      {/* Categories Carousel */}
      <div className="relative">
        {/* Scroll Container */}
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
              {/* Main Category Card */}
              <div className="relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500">
                
                {/* Header with gradient */}
                <div className={`absolute top-0 left-0 right-0 h-16 opacity-90`}>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                </div>

                {/* Category Title and Icon */}
                <div className="relative z-10 p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/*<div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-3xl shadow-xl transform -mt-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {category.icon}
                      </div>*/}
                      <div>
                        <h3 className="text-xl font-bold text-[var(--color-primary-alt)] mb-0.5 drop-shadow-md">
                          {category.name}
                        </h3>
                        {/*<span className="text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                          {category.productCount} products
                        </span>*/}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcategories Grid - 2x2 layout */}
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
                        {/* Subcategory Image */}
                        <div className="relative h-20 w-full overflow-hidden">
                          <Image
                            src={sub.image}
                            alt={sub.name}
                            fill
                            className="object-cover group-hover/sub:scale-110 transition-transform duration-500"
                          />
                          {/* Gradient overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover/sub:opacity-30 transition-opacity duration-300`}></div>
                          
                          {/* Product count badge */}
                          {/*<div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full">
                            {sub.count}
                          </div>*/}
                        </div>

                        {/* Subcategory Name */}
                        <div className="p-2 text-center">
                          <p className="text-xs font-medium text-[var(--color-text)] group-hover/sub:text-[var(--color-primary)] transition-colors">
                            {sub.name}
                          </p>
                        </div>

                        {/* Hover effect shine */}
                        <div className="absolute inset-0 opacity-0 group-hover/sub:opacity-100 pointer-events-none overflow-hidden">
                          <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar with View All */}
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

                {/* Animated border on hover */}
                <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--color-primary)]/50 transition-all duration-500 pointer-events-none`}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shine animation */}
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

export default ShopByCategory;