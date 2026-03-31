// components/New/components/CategoryCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Tag, 
  TrendingUp,
  Star,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  gradient?: string;
  metadata?: {
    productCount: number;
    popular: boolean;
    featured: boolean;
  };
  children?: Category[];
}

interface CategoryCardProps {
  category: Category;
  getProductCount: (category: Category) => number;
  isFeatured: (category: Category) => boolean;
  formatProductCount: (count: number) => string;
}

// Subtle accent colors for category variation
const CATEGORY_ACCENTS = {
  'Electronics': 'bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/40',
  'Fashion': 'bg-pink-500/10 border-pink-500/20 group-hover:border-pink-500/40',
  'Home & Kitchen': 'bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40',
  'Beauty': 'bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/40',
  'Food': 'bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40',
  'Books': 'bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40',
  'Sports': 'bg-green-500/10 border-green-500/20 group-hover:border-green-500/40',
  default: 'bg-gray-500/10 border-gray-500/20 group-hover:border-gray-500/40'
};

const CategoryCard = ({ 
  category, 
  getProductCount, 
  isFeatured, 
  formatProductCount 
}: CategoryCardProps) => {
  const productCount = getProductCount(category);
  const featured = isFeatured(category);
  const accentClass = CATEGORY_ACCENTS[category.name as keyof typeof CATEGORY_ACCENTS] || CATEGORY_ACCENTS.default;
  const hasChildren = category.children && category.children.length > 0;
  const displayChildren = category.children?.slice(0, 4) || [];

  return (
    <Link
      key={category._id}
      href={`/category/${category.slug}`}
      className="group relative min-w-[300px] sm:min-w-[340px] snap-start"
    >
      <div className={`relative bg-[var(--color-surface)] rounded-xl border ${accentClass} overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
        
        {/* Header Section - Clean and Minimal */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Badges Row */}
              <div className="flex items-center gap-2 mb-2">
                {featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    Featured
                  </span>
                )}
                {category.metadata?.popular && !featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {productCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-background-soft)] px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {formatProductCount(productCount)}
                  </span>
                )}
              </div>
              
              {/* Category Name */}
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1 line-clamp-1">
                {category.name}
              </h3>
              
              {/* Subcategories Count */}
              {hasChildren && (
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <Layers className="w-3 h-3" />
                  <span>{category.children!.length} subcategories</span>
                </div>
              )}
            </div>
            
            {/* Category Icon */}
            {category.icon && (
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-background-soft)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">{category.icon}</span>
              </div>
            )}
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="px-4 pb-3">
          {hasChildren && displayChildren.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {displayChildren.map((sub) => {
                const subProductCount = getProductCount(sub);
                
                return (
                  <div
                    key={sub._id}
                    className="group/sub relative overflow-hidden rounded-lg bg-[var(--color-background-soft)] hover:bg-[var(--color-background-soft)]/80 transition-all duration-200 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/category/${sub.slug}`;
                    }}
                  >
                    {/* Subcategory Image/Icon Container */}
                    <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-[var(--color-background-soft)] to-[var(--color-surface)]">
                      {sub.image ? (
                        <Image
                          src={sub.image}
                          alt={sub.name}
                          fill
                          className="object-cover group-hover/sub:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl opacity-60 group-hover/sub:opacity-100 transition-opacity duration-200">
                            {sub.icon || '📦'}
                          </span>
                        </div>
                      )}
                      
                      {/* Subtle Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover/sub:bg-black/5 transition-colors duration-200"></div>
                      
                      {/* Product Count Badge */}
                      {subProductCount > 0 && (
                        <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                          {formatProductCount(subProductCount)}
                        </div>
                      )}
                    </div>

                    {/* Subcategory Name */}
                    <div className="p-2 text-center">
                      <p className="text-xs font-medium text-[var(--color-text)] group-hover/sub:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {sub.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="space-y-1.5">
                <div className="w-10 h-10 mx-auto bg-[var(--color-background-soft)] rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Coming soon
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            {/* Rating Placeholder */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-3 h-3 text-amber-400 fill-amber-400" 
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">
                ({Math.floor(Math.random() * 500) + 100})
              </span>
            </div>
            
            {/* Explore Link */}
            <div className="group/btn flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:gap-2 transition-all duration-200">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Hover Border Effect - Clean */}
        <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--color-primary)]/20 transition-all duration-300 pointer-events-none`}></div>
      </div>
    </Link>
  );
};

export default CategoryCard;