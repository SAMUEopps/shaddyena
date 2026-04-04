/*import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';
import Navbar from '@/components/New/components/Navbar';

export default function Page() {
  return (
    <Suspense fallback={
    <div className='bg-white'>
     <div className='bg-white'>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]" />
        </div>
      </div>
    </div>}>
    
        <Navbar />
      <HomeContent />
    </Suspense>
  );
}*/

// app/page.tsx
import { Suspense } from 'react';
import ThreeTierNavbar from '@/components/New/components/ThreeTierNavbar';
import HeroSection from '@/components/New/components/HeroSection';
import ShopByCategory from '@/components/New/components/ShopByCategory';
import ShopPreview from '@/components/New/components/ShopPreview';
import ProductShowcase from '@/components/New/components/ProductShowcase';
import HomeContent from '@/components/home/HomeContent';


export default function Page() {
  return (
    <Suspense fallback={
      <div className='bg-[var(--color-background)]'>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
        </div>
      </div>
    }>
    <ThreeTierNavbar />
    <main className="pt-[calc(2.5rem+4rem+3.5rem)]">
      <HeroSection />
      {/*<ShopByCategoryTwo />*/}
      <ShopByCategory />
      <ShopPreview />
      <ProductShowcase />
      {/*<HomeContent /> */}
    </main>
    </Suspense>
  );
}