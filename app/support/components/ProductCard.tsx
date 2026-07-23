// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   image?: string;
//   vendorId: {
//     _id: string;
//     businessName: string;
//   };
//   stock: number;
// }

// interface ProductCardProps {
//   product: Product;
//   onAddToCart: (product: Product) => void;
//   isAdding: boolean;
// }

// export default function ProductCard({ product, onAddToCart, isAdding }: ProductCardProps) {
//   const getStockBadge = () => {
//     if (product.stock <= 0) {
//       return (
//         <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
//           Out of Stock
//         </div>
//       );
//     }
//     if (product.stock < 5) {
//       return (
//         <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
//           Low Stock
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group">
//       {/* Product Image */}
//       <div className="relative h-44 sm:h-52 bg-gradient-to-br from-surface to-background overflow-hidden">
//         {product.image ? (
//           <Image
//             src={product.image}
//             alt={product.name}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
//             📦
//           </div>
//         )}
        
//         {getStockBadge()}
//       </div>

//       <div className="p-4 sm:p-5">
//         <h3 className="font-bold text-base sm:text-lg truncate text-secondary group-hover:text-primary transition-colors duration-200">
//           {product.name}
//         </h3>

//         <p className="text-muted text-sm line-clamp-2 h-10 sm:h-12 mt-1">
//           {product.description || 'No description available'}
//         </p>

//         <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
//           <span className="text-primary font-black text-lg sm:text-xl">
//             KSh {product.price.toLocaleString()}
//           </span>
//           <span className="text-sm text-muted">
//             Stock: {product.stock}
//           </span>
//         </div>

//         <Link
//           href={`/shops/${product.vendorId._id}`}
//           className="text-primary hover:text-accent-dark text-sm flex items-center gap-1 mt-2 transition-colors duration-200 group/link"
//         >
//           🏪 {product.vendorId.businessName}
//           <svg className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </Link>

//         <button
//           onClick={() => onAddToCart(product)}
//           disabled={product.stock <= 0}
//           className={`mt-4 w-full py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] relative ${
//             product.stock > 0
//               ? 'bg-primary hover:bg-accent-dark text-white'
//               : 'bg-muted/30 text-muted cursor-not-allowed'
//           }`}
//         >
//           {isAdding ? (
//             <span className="flex items-center justify-center gap-2">
//               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Adding...
//             </span>
//           ) : (
//             product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  vendorId: {
    _id: string;
    businessName: string;
  };
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

export default function ProductCard({ product, onAddToCart, isAdding }: ProductCardProps) {
  const getStockBadge = () => {
    if (product.stock <= 0) {
      return (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full shadow-md">
          Out of Stock
        </div>
      );
    }
    if (product.stock < 5) {
      return (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 bg-yellow-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full shadow-md">
          Low Stock
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-surface to-background overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
            📦
          </div>
        )}
        
        {getStockBadge()}
      </div>

      <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-sm sm:text-base md:text-lg truncate text-secondary group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-muted text-[10px] sm:text-xs md:text-sm line-clamp-2 h-6 sm:h-8 md:h-10 lg:h-12 mt-0.5 sm:mt-1">
          {product.description || 'No description available'}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 mt-1.5 sm:mt-2 md:mt-3">
          <span className="text-primary font-black text-sm sm:text-base md:text-lg lg:text-xl">
            KSh {product.price.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs md:text-sm text-muted">
            Stock: {product.stock}
          </span>
        </div>

        <Link
          href={`/shops/${product.vendorId._id}`}
          className="text-primary hover:text-accent-dark text-[10px] sm:text-xs md:text-sm flex items-center gap-0.5 sm:gap-1 mt-1 sm:mt-1.5 md:mt-2 transition-colors duration-200 group/link truncate"
        >
          🏪 {product.vendorId.businessName}
          <svg className="w-2 h-2 sm:w-3 sm:h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className={`mt-2 sm:mt-2.5 md:mt-3 lg:mt-4 w-full py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-[10px] sm:text-xs md:text-sm lg:text-base rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] relative ${
            product.stock > 0
              ? 'bg-primary hover:bg-accent-dark text-white'
              : 'bg-muted/30 text-muted cursor-not-allowed'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="hidden xs:inline">Adding...</span>
              <span className="xs:hidden">...</span>
            </span>
          ) : (
            product.stock > 0 ? (
              <>
                <span className="hidden xs:inline">🛒 Add to Cart</span>
                <span className="xs:hidden">🛒 Add</span>
              </>
            ) : (
              <>
                <span className="hidden xs:inline">Out of Stock</span>
                <span className="xs:hidden">Sold</span>
              </>
            )
          )}
        </button>
      </div>
    </div>
  );
}