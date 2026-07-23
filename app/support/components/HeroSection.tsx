'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🛍️</div>
        <div className="absolute bottom-10 right-10 text-8xl">📦</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🏪</div>
        <div className="absolute bottom-1/4 right-1/4 text-7xl">✨</div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl sm:text-5xl">🛒</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
              Your One-Stop Shop
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
            Everything you need,
            <br className="hidden sm:block" /> 
            <span className="text-primary-light">from trusted shops</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/80 max-w-2xl">
            Discover amazing products from verified vendors across Kenya. 
            Shop with confidence and support local businesses.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
            <Link
              href="#products"
              className="bg-white text-secondary hover:bg-primary-light hover:text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Browse Products →
            </Link>
            <Link
              href="/shops"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/30"
            >
              Explore Shops
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}