'use client';

import Link from 'next/link';
import Image from 'next/image';

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

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      href={`/shops/${shop._id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group"
    >
      {/* Shop Cover Image */}
      <div className="relative h-28 sm:h-32 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
        {shop.coverImage ? (
          <Image
            src={shop.coverImage}
            alt={shop.businessName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🏪
          </div>
        )}
        
        {/* Profile Image Overlay */}
        <div className="absolute -bottom-6 left-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white bg-white shadow-md overflow-hidden">
            {shop.profileImage ? (
              <Image
                src={shop.profileImage}
                alt={shop.businessName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">
                🏪
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 pb-4 px-4 sm:px-5">
        <h3 className="font-bold text-base sm:text-lg text-secondary group-hover:text-primary transition-colors duration-200 truncate">
          {shop.businessName}
        </h3>

        <div className="mt-2 space-y-1">
          <p className="text-muted text-sm flex items-center gap-1.5">
            <span>👤</span> {shop.ownerName}
          </p>
          <p className="text-muted text-sm flex items-center gap-1.5 truncate">
            <span>📍</span> {shop.businessLocation}
          </p>
          <p className="text-muted text-sm flex items-center gap-1.5">
            <span>📱</span> {shop.phoneNumber}
          </p>
        </div>

        <div className="border-t border-surface mt-3 pt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-muted flex items-center gap-1">
            📦 {shop.productCount} product{shop.productCount !== 1 ? 's' : ''}
          </span>
          <span className="text-primary font-bold text-sm">
            KSh {shop.totalEarned?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}