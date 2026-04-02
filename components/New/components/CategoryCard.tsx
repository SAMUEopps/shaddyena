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
  className="group relative min-w-[220px] sm:min-w-[260px] lg:min-w-[300px] snap-start"
>
  <div className={`relative bg-[var(--color-surface)] rounded-lg sm:rounded-xl border ${accentClass} overflow-hidden transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl hover:-translate-y-0.5`}>

    {/* Header */}
    <div className="p-2 sm:p-4 pb-1 sm:pb-2">
      <div className="flex items-start justify-between gap-2">
        
        <div className="flex-1 min-w-0">
          
          {/* Badges */}
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            {featured && (
              <span className="text-[9px] sm:text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                Featured
              </span>
            )}
            
            {productCount > 0 && (
              <span className="text-[9px] sm:text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-background-soft)] text-[var(--color-text-muted)]">
                {formatProductCount(productCount)}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-[var(--color-text)] line-clamp-1">
            {category.name}
          </h3>

          {/* Subcount */}
          {hasChildren && (
            <p className="text-[9px] sm:text-xs text-[var(--color-text-muted)]">
              {category.children!.length} subcategories
            </p>
          )}
        </div>

        {/* Icon */}
        {category.icon && (
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md bg-[var(--color-background-soft)] flex items-center justify-center">
            <span className="text-sm sm:text-xl">{category.icon}</span>
          </div>
        )}
      </div>
    </div>

    {/* Subcategories */}
    <div className="px-2 sm:px-4 pb-2 sm:pb-3">
      {hasChildren && displayChildren.length > 0 ? (
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          {displayChildren.map((sub) => (
            <div
              key={sub._id}
              className="rounded-md sm:rounded-lg bg-[var(--color-background-soft)] overflow-hidden cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/category/${sub.slug}`;
              }}
            >
              <div className="h-16 sm:h-24 relative">
                {sub.image ? (
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-lg sm:text-3xl opacity-60">
                    {sub.icon || '📦'}
                  </div>
                )}
              </div>

              <div className="p-1 text-center">
                <p className="text-[9px] sm:text-xs font-medium truncate whitespace-nowrap overflow-hidden">
                  {sub.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-[10px] text-[var(--color-text-muted)]">
          Coming soon
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="px-2 sm:px-4 pb-2 sm:pb-4">
      <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]">
        
        <span className="text-[9px] sm:text-xs text-[var(--color-text-muted)]">
          Explore
        </span>

        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-primary)]" />
      </div>
    </div>
  </div>
</Link>
  );
};

export default CategoryCard;