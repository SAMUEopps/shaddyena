import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';

export default function Page() {
  return (
    <Suspense fallback={
    <div className='bg-white'>
    <div className="p-10 text-center">Loading...</div>
    </div>}>
      <HomeContent />
      
    </Suspense>
  );
}




