// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';

// interface Shop {
//   _id: string;
//   businessName: string;
//   ownerName: string;
//   phoneNumber: string;
//   businessLocation: string;
//   profileImage?: string;
//   coverImage?: string;
//   productCount: number;
//   totalEarned: number;
//   createdAt: string;
// }

// interface ShopCardProps {
//   shop: Shop;
// }

// export default function ShopCard({ shop }: ShopCardProps) {
//   return (
//     <Link
//       href={`/shops/${shop._id}`}
//       className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group"
//     >
//       {/* Shop Cover Image */}
//       <div className="relative h-28 sm:h-32 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
//         {shop.coverImage ? (
//           <Image
//             src={shop.coverImage}
//             alt={shop.businessName}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-5xl">
//             🏪
//           </div>
//         )}
        
//         {/* Profile Image Overlay */}
//         <div className="absolute -bottom-6 left-4">
//           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white bg-white shadow-md overflow-hidden">
//             {shop.profileImage ? (
//               <Image
//                 src={shop.profileImage}
//                 alt={shop.businessName}
//                 fill
//                 className="object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-xl">
//                 🏪
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="pt-8 pb-4 px-4 sm:px-5">
//         <h3 className="font-bold text-base sm:text-lg text-secondary group-hover:text-primary transition-colors duration-200 truncate">
//           {shop.businessName}
//         </h3>

//         <div className="mt-2 space-y-1">
//           <p className="text-muted text-sm flex items-center gap-1.5">
//             <span>👤</span> {shop.ownerName}
//           </p>
//           <p className="text-muted text-sm flex items-center gap-1.5 truncate">
//             <span>📍</span> {shop.businessLocation}
//           </p>
//           <p className="text-muted text-sm flex items-center gap-1.5">
//             <span>📱</span> {shop.phoneNumber}
//           </p>
//         </div>

//         <div className="border-t border-surface mt-3 pt-3 flex flex-wrap items-center justify-between gap-2">
//           <span className="text-sm text-muted flex items-center gap-1">
//             📦 {shop.productCount} product{shop.productCount !== 1 ? 's' : ''}
//           </span>
//           <span className="text-primary font-bold text-sm">
//             KSh {shop.totalEarned?.toLocaleString() || 0}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }

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
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group h-full flex flex-col"
    >
      {/* Shop Cover Image */}
      <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden flex-shrink-0">
        {shop.coverImage ? (
          <Image
            src={shop.coverImage}
            alt={shop.businessName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl">
            🏪
          </div>
        )}
        
        {/* Profile Image Overlay */}
        <div className="absolute -bottom-4 left-2 sm:left-3 md:left-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl border-2 border-white bg-white shadow-md overflow-hidden">
            {shop.profileImage ? (
              <Image
                src={shop.profileImage}
                alt={shop.businessName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl">
                🏪
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-5 sm:pt-6 md:pt-7 lg:pt-8 pb-3 sm:pb-3.5 md:pb-4 lg:pb-5 px-2.5 sm:px-3 md:px-4 lg:px-5 flex-1 flex flex-col">
        <h3 className="font-bold text-sm sm:text-base md:text-lg text-secondary group-hover:text-primary transition-colors duration-200 truncate">
          {shop.businessName}
        </h3>

        <div className="mt-1 sm:mt-1.5 md:mt-2 space-y-0.5 sm:space-y-1 flex-1">
          <p className="text-muted text-[10px] sm:text-xs md:text-sm flex items-center gap-0.5 sm:gap-1 truncate">
            <span className="text-xs sm:text-sm">👤</span> {shop.ownerName}
          </p>
          <p className="text-muted text-[10px] sm:text-xs md:text-sm flex items-center gap-0.5 sm:gap-1 truncate">
            <span className="text-xs sm:text-sm">📍</span> {shop.businessLocation}
          </p>
          <p className="text-muted text-[10px] sm:text-xs md:text-sm flex items-center gap-0.5 sm:gap-1">
            <span className="text-xs sm:text-sm">📱</span> {shop.phoneNumber}
          </p>
        </div>

        <div className="border-t border-surface mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 pt-1.5 sm:pt-2 md:pt-2.5 lg:pt-3 flex flex-wrap items-center justify-between gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-xs md:text-sm text-muted flex items-center gap-0.5 sm:gap-1">
            📦 {shop.productCount} product{shop.productCount !== 1 ? 's' : ''}
          </span>
          <span className="text-primary font-bold text-[10px] sm:text-xs md:text-sm lg:text-base">
            KSh {shop.totalEarned?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}