'use client';

import Link from 'next/link';
import EmptyState from './EmptyState';
import ShopCard from './ShopCard';


interface Shop {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  profileImage?: string;
  coverImage?: string;
  productCount: number;
  totalEarned: number;
  createdAt: string;
}

interface ShopSectionProps {
  shops: Shop[];
}

export default function ShopSection({ shops }: ShopSectionProps) {
  const displayShops = shops.slice(0, 6);

  return (
    <section className="mt-12 sm:mt-16 lg:mt-20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-secondary flex items-center gap-3">
            <span>🏪</span> Featured Shops
          </h2>
          <p className="text-muted text-sm mt-1">
            {shops.length} shops available
          </p>
        </div>
        <Link
          href="/shops"
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium flex items-center gap-2"
        >
          View all 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {shops.length === 0 ? (
        <EmptyState icon="🏪" message="No shops registered yet" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
          
          {shops.length > 6 && (
            <div className="text-center mt-8">
              <Link
                href="/shops"
                className="inline-block bg-primary hover:bg-accent-dark text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
              >
                View All {shops.length} Shops →
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}