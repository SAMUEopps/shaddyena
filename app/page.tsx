import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';

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
      <HomeContent />
    </Suspense>
  );
}




