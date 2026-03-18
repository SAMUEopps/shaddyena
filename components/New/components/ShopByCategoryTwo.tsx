// components/home/ShopByCategory.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';

// Dummy data for categories with rich imagery
const categories = [
  {
    id: 1,
    name: 'Women\'s Fashion',
    slug: 'womens-fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop',
    productCount: '15K+',
    icon: '👗',
    gradient: 'from-pink-500 to-rose-500',
    subcategories: ['Dresses', 'Tops', 'Bottoms', 'Outerwear'],
  },
  {
    id: 2,
    name: 'Men\'s Collection',
    slug: 'mens-collection',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop',
    productCount: '12K+',
    icon: '👔',
    gradient: 'from-blue-500 to-indigo-500',
    subcategories: ['Shirts', 'Pants', 'Suits', 'Accessories'],
  },
  {
    id: 3,
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop',
    productCount: '8K+',
    icon: '📱',
    gradient: 'from-purple-500 to-violet-500',
    subcategories: ['Phones', 'Laptops', 'Audio', 'Gaming'],
  },
  {
    id: 4,
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop',
    productCount: '10K+',
    icon: '🏠',
    gradient: 'from-green-500 to-emerald-500',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
  },
  {
    id: 5,
    name: 'Beauty & Health',
    slug: 'beauty-health',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop',
    productCount: '7K+',
    icon: '💄',
    gradient: 'from-orange-500 to-amber-500',
    subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
  },
  {
    id: 6,
    name: 'Jewelry & Watches',
    slug: 'jewelry-watches',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop',
    productCount: '5K+',
    icon: '⌚',
    gradient: 'from-yellow-500 to-amber-500',
    subcategories: ['Necklaces', 'Rings', 'Watches', 'Bracelets'],
  },
  {
    id: 7,
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop',
    productCount: '6K+',
    icon: '⚽',
    gradient: 'from-red-500 to-rose-500',
    subcategories: ['Gym', 'Camping', 'Cycling', 'Running'],
  },
  {
    id: 8,
    name: 'Toys & Games',
    slug: 'toys-games',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop',
    productCount: '4K+',
    icon: '🎮',
    gradient: 'from-cyan-500 to-blue-500',
    subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'Outdoor'],
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
      const scrollAmount = 320;
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
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative min-w-[260px] sm:min-w-[280px] snap-start"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Category Card */}
              <div className="relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                
                {/* Image Container */}
                <div className="relative h-44 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10`}></div>
                  
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Icon Overlay */}
                  <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-xl shadow-lg transform group-hover:scale-110 transition-all duration-300 z-20">
                    {category.icon}
                  </div>

                  {/* Product Count */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold shadow-lg z-20">
                    {category.productCount}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {category.name}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary-soft)]/20 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.subcategories.slice(0, 3).map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-[var(--color-background-soft)] text-[var(--color-text-muted)] rounded-full"
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-background-soft)] text-[var(--color-text-muted)] rounded-full">
                        +{category.subcategories.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Animated underline */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Add custom animation for shine effect */}
      <style jsx>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .group:hover .animate-shine {
          animation: shine 1.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ShopByCategory;