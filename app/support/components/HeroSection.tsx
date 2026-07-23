// // 'use client';

// // import Link from 'next/link';

// // export default function HeroSection() {
// //   return (
// //     <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-white overflow-hidden">
// //       <div className="absolute inset-0 opacity-10">
// //         <div className="absolute top-10 left-10 text-8xl">🛍️</div>
// //         <div className="absolute bottom-10 right-10 text-8xl">📦</div>
// //         <div className="absolute top-1/2 left-1/4 text-6xl">🏪</div>
// //         <div className="absolute bottom-1/4 right-1/4 text-7xl">✨</div>
// //       </div>
      
// //       <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 relative z-10">
// //         <div className="max-w-3xl">
// //           <div className="flex items-center gap-3 mb-4">
// //             <span className="text-4xl sm:text-5xl">🛒</span>
// //             <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
// //               Your One-Stop Shop
// //             </span>
// //           </div>
// //           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
// //             Everything you need,
// //             <br className="hidden sm:block" /> 
// //             <span className="text-primary-light">from trusted shops</span>
// //           </h1>
// //           <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/80 max-w-2xl">
// //             Discover amazing products from verified vendors across Kenya. 
// //             Shop with confidence and support local businesses.
// //           </p>
// //           <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
// //             <Link
// //               href="#products"
// //               className="bg-white text-secondary hover:bg-primary-light hover:text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
// //             >
// //               Browse Products →
// //             </Link>
// //             <Link
// //               href="/shops"
// //               className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/30"
// //             >
// //               Explore Shops
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// 'use client';

// import Link from 'next/link';

// export default function HeroSection() {
//   return (
//     <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-white overflow-hidden">
//       {/* Decorative Icons - Responsive */}
//       <div className="absolute inset-0 opacity-10 pointer-events-none">
//         <div className="absolute top-4 sm:top-6 md:top-8 lg:top-10 left-4 sm:left-6 md:left-8 lg:left-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">🛍️</div>
//         <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">📦</div>
//         <div className="absolute top-1/2 left-1/4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">🏪</div>
//         <div className="absolute bottom-1/4 right-1/4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">✨</div>
//       </div>
      
//       <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 relative z-10">
//         <div className="max-w-3xl mx-auto sm:mx-0">
//           {/* Badge */}
//           <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">🛒</span>
//             <span className="bg-white/20 backdrop-blur-sm px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
//               Your One-Stop Shop
//             </span>
//           </div>

//           {/* Heading */}
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black leading-tight">
//             Everything you need,
//             <br className="hidden sm:block" /> 
//             <span className="text-primary-light">from trusted shops</span>
//           </h1>

//           {/* Description */}
//           <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl">
//             Discover amazing products from verified vendors across Kenya. 
//             Shop with confidence and support local businesses.
//           </p>

//           {/* Buttons */}
//           <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 flex flex-wrap gap-2 sm:gap-3">
//             <Link
//               href="#products"
//               className="bg-white text-secondary hover:bg-primary-light hover:text-white px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base md:text-lg"
//             >
//               Browse Products →
//             </Link>
//             <Link
//               href="/shops"
//               className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-medium transition-all duration-200 border border-white/30 text-sm sm:text-base md:text-lg"
//             >
//               Explore Shops
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
  {
    icon: '🎨',
    title: 'Showcase Your Products Beautifully',
    highlight: 'Post stunning ad posters',
    description:
      'Create eye-catching product promotions and let thousands of shoppers discover what your business offers.',
  },
  {
    icon: '🚀',
    title: 'Grow Your Business Online',
    highlight: 'Reach more customers',
    description:
      'Connect with buyers across Kenya and turn your shop into a powerful digital storefront.',
  },
  {
    icon: '🏪',
    title: 'Your Shop. Your Brand. Your Sales.',
    highlight: 'Sell with confidence',
    description:
      'Create your vendor profile, upload products, run promotions and build loyal customers.',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-white overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-8 left-8 text-7xl sm:text-8xl">
          🛍️
        </div>

        <div className="absolute bottom-8 right-8 text-7xl sm:text-8xl">
          📦
        </div>

        <div className="absolute top-1/2 left-1/4 text-6xl">
          ✨
        </div>

        <div className="absolute bottom-1/4 right-1/4 text-6xl">
          🚀
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28 relative z-10">

        <div className="max-w-4xl mx-auto text-center">

          {/* Vendor Badge */}
          <div className="flex justify-center items-center gap-3 mb-5">
            <span className="text-3xl sm:text-4xl">
              {slides[current].icon}
            </span>

            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20">
              Vendor Advertising Platform
            </span>
          </div>


          {/* Carousel Content */}
          <div
            key={current}
            className="animate-[fadeIn_0.7s_ease-in-out]"
          >

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">

              {slides[current].title}

              <br />

              <span className="text-primary-light">
                {slides[current].highlight}
              </span>

            </h1>


            <p className="mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
              {slides[current].description}
            </p>

          </div>


          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              href="/vendor/register"
              className="
              bg-white text-secondary 
              hover:bg-primary-light hover:text-white
              px-6 sm:px-8 py-3 rounded-xl
              font-bold shadow-lg
              transition-all duration-300
              hover:-translate-y-1
              "
            >
              Become a Vendor →
            </Link>


            <Link
              href="/shops"
              className="
              bg-white/20 backdrop-blur-md
              hover:bg-white/30
              border border-white/30
              px-6 sm:px-8 py-3
              rounded-xl font-medium
              transition-all duration-300
              "
            >
              View Marketplace
            </Link>

          </div>


          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-10">

            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${
                    current === index
                      ? 'w-10 bg-white'
                      : 'w-3 bg-white/40'
                  }
                `}
              />
            ))}

          </div>


        </div>

      </div>


      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
}