// 'use client';

// import Link from 'next/link';
// import EmptyState from './EmptyState';
// import ProductCard from './ProductCard';


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

// interface ProductSectionProps {
//   products: Product[];
//   addingToCart: string | null;
//   onAddToCart: (product: Product) => void;
// }

// export default function ProductSection({ products, addingToCart, onAddToCart }: ProductSectionProps) {
//   const displayProducts = products.slice(0, 8);

//   return (
//     <section id="products">
//       <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//         <div>
//           <h2 className="text-2xl sm:text-3xl font-black text-secondary flex items-center gap-3">
//             <span>📦</span> Featured Products
//           </h2>
//           <p className="text-muted text-sm mt-1">
//             {products.length} products available
//           </p>
//         </div>
//         <Link
//           href="/products"
//           className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium flex items-center gap-2"
//         >
//           View all 
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </Link>
//       </div>

//       {products.length === 0 ? (
//         <EmptyState icon="📦" message="No products available at the moment" />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//             {displayProducts.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 onAddToCart={onAddToCart}
//                 isAdding={addingToCart === product._id}
//               />
//             ))}
//           </div>
          
//           {products.length > 8 && (
//             <div className="text-center mt-8">
//               <Link
//                 href="/products"
//                 className="inline-block bg-primary hover:bg-accent-dark text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
//               >
//                 View All {products.length} Products →
//               </Link>
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

'use client';

import Link from 'next/link';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

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

interface ProductSectionProps {
  products: Product[];
  addingToCart: string | null;
  onAddToCart: (product: Product) => void;
}

export default function ProductSection({ products, addingToCart, onAddToCart }: ProductSectionProps) {
  const displayProducts = products.slice(0, 8);

  return (
    <section id="products">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-secondary flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">📦</span> Featured Products
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-0.5 sm:mt-1">
            {products.length} products available
          </p>
        </div>
        <Link
          href="/products"
          className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2"
        >
          View all 
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState icon="📦" message="No products available at the moment" />
      ) : (
        <>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                isAdding={addingToCart === product._id}
              />
            ))}
          </div>
          
          {products.length > 8 && (
            <div className="text-center mt-6 sm:mt-8">
              <Link
                href="/products"
                className="inline-block bg-primary hover:bg-accent-dark text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium text-sm sm:text-base"
              >
                View All {products.length} Products →
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}