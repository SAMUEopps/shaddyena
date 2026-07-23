// // app/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
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

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [shops, setShops] = useState<Shop[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [cartCount, setCartCount] = useState(0);
//   const [addingToCart, setAddingToCart] = useState<string | null>(null);

//   useEffect(() => {
//     fetchData();
//     const cart = localStorage.getItem("cart");
//     if (cart) {
//       setCartCount(JSON.parse(cart).length);
//     }
//   }, []);

//   const fetchData = async () => {
//   try {
//     const [productsResponse, shopsResponse] = await Promise.all([
//       fetch('/api/shd-api/api/products'),
//       fetch('/api/shd-api/api/shops')
//     ]);

//     const productsData = await productsResponse.json();
//     const shopsData = await shopsResponse.json();


//     console.log("🛒 Products API Response:", productsData);
//     console.log("🏪 Shops API Response:", shopsData);

//     console.log(
//       "First Product:",
//       productsData.products?.[0]
//     );

//     console.log(
//       "First Product Vendor:",
//       productsData.products?.[0]?.vendorId
//     );

//     console.log(
//   "Products:",
//   JSON.stringify(productsData.products, null, 2)
// );

// console.log(
//   "First Product:",
//   JSON.stringify(productsData.products?.[0], null, 2)
// );

// console.log(
//   "First Product Vendor:",
//   JSON.stringify(productsData.products?.[0]?.vendorId, null, 2)
// );


//     setProducts(productsData.products || []);
//     setShops(shopsData.shops || []);

//   } catch (error) {
//     console.error("Fetch data error:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   const addToCart = (product: Product) => {
//     setAddingToCart(product._id);
    
//     const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const exists = cart.find((item: any) => item._id === product._id);
//     let updatedCart;

//     if (exists) {
//       updatedCart = cart.map((item: any) =>
//         item._id === product._id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     } else {
//       updatedCart = [...cart, { ...product, quantity: 1 }];
//     }

//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     setCartCount(updatedCart.length);
    
//     setTimeout(() => {
//       setAddingToCart(null);
//     }, 1000);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
//           <p className="mt-4 text-muted font-medium">Loading amazing products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* HERO SECTION */}
//       <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-white overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-10 left-10 text-8xl">🛍️</div>
//           <div className="absolute bottom-10 right-10 text-8xl">📦</div>
//           <div className="absolute top-1/2 left-1/4 text-6xl">🏪</div>
//           <div className="absolute bottom-1/4 right-1/4 text-7xl">✨</div>
//         </div>
        
//         <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 relative z-10">
//           <div className="max-w-3xl">
//             <div className="flex items-center gap-3 mb-4">
//               <span className="text-4xl sm:text-5xl">🛒</span>
//               <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
//                 Your One-Stop Shop
//               </span>
//             </div>
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
//               Everything you need,
//               <br className="hidden sm:block" /> 
//               <span className="text-primary-light">from trusted shops</span>
//             </h1>
//             <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/80 max-w-2xl">
//               Discover amazing products from verified vendors across Kenya. 
//               Shop with confidence and support local businesses.
//             </p>
//             <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
//               <Link
//                 href="#products"
//                 className="bg-white text-secondary hover:bg-primary-light hover:text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
//               >
//                 Browse Products →
//               </Link>
//               <Link
//                 href="/shops"
//                 className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/30"
//               >
//                 Explore Shops
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
//         {/* PRODUCTS SECTION */}
//         <section id="products">
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div>
//               <h2 className="text-2xl sm:text-3xl font-black text-secondary flex items-center gap-3">
//                 <span>📦</span> Featured Products
//               </h2>
//               <p className="text-muted text-sm mt-1">
//                 {products.length} products available
//               </p>
//             </div>
//             <Link
//               href="/products"
//               className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium flex items-center gap-2"
//             >
//               View all 
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
//           </div>

//           {products.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl border border-surface">
//               <div className="text-6xl mb-4">📦</div>
//               <p className="text-muted text-lg">No products available at the moment</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//               {products.slice(0, 8).map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group"
//                 >
//                   {/* Product Image */}
//                   <div className="relative h-44 sm:h-52 bg-gradient-to-br from-surface to-background overflow-hidden">
//                     {product.image ? (
//                       <Image
//                         src={product.image}
//                         alt={product.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                         sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
//                         📦
//                       </div>
//                     )}
                    
//                     {/* Stock Badge */}
//                     {product.stock <= 0 && (
//                       <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
//                         Out of Stock
//                       </div>
//                     )}
//                     {product.stock > 0 && product.stock < 5 && (
//                       <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
//                         Low Stock
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-4 sm:p-5">
//                     <h3 className="font-bold text-base sm:text-lg truncate text-secondary group-hover:text-primary transition-colors duration-200">
//                       {product.name}
//                     </h3>

//                     <p className="text-muted text-sm line-clamp-2 h-10 sm:h-12 mt-1">
//                       {product.description || 'No description available'}
//                     </p>

//                     <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
//                       <span className="text-primary font-black text-lg sm:text-xl">
//                         KSh {product.price.toLocaleString()}
//                       </span>
//                       <span className="text-sm text-muted">
//                         Stock: {product.stock}
//                       </span>
//                     </div>

//                     <Link
//                       href={`/shops/${product.vendorId._id}`}
//                       className="text-primary hover:text-accent-dark text-sm flex items-center gap-1 mt-2 transition-colors duration-200 group/link"
//                     >
//                       🏪 {product.vendorId.businessName}
//                       <svg className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </Link>

//                     <button
//                       onClick={() => addToCart(product)}
//                       disabled={product.stock <= 0}
//                       className={`mt-4 w-full py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] relative ${
//                         product.stock > 0
//                           ? 'bg-primary hover:bg-accent-dark text-white'
//                           : 'bg-muted/30 text-muted cursor-not-allowed'
//                       }`}
//                     >
//                       {addingToCart === product._id ? (
//                         <span className="flex items-center justify-center gap-2">
//                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Adding...
//                         </span>
//                       ) : (
//                         product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
          
//           {/* View More Products Button */}
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
//         </section>

//         {/* SHOPS SECTION */}
//         <section className="mt-12 sm:mt-16 lg:mt-20">
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div>
//               <h2 className="text-2xl sm:text-3xl font-black text-secondary flex items-center gap-3">
//                 <span>🏪</span> Featured Shops
//               </h2>
//               <p className="text-muted text-sm mt-1">
//                 {shops.length} shops available
//               </p>
//             </div>
//             <Link
//               href="/shops"
//               className="text-primary hover:text-accent-dark transition-colors duration-200 font-medium flex items-center gap-2"
//             >
//               View all 
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
//           </div>

//           {shops.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl border border-surface">
//               <div className="text-6xl mb-4">🏪</div>
//               <p className="text-muted text-lg">No shops registered yet</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {shops.slice(0, 6).map((shop) => (
//                 <Link
//                   key={shop._id}
//                   href={`/shops/${shop._id}`}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface hover:border-primary/20 group"
//                 >
//                   {/* Shop Cover Image */}
//                   <div className="relative h-28 sm:h-32 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
//                     {shop.coverImage ? (
//                       <Image
//                         src={shop.coverImage}
//                         alt={shop.businessName}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-5xl">
//                         🏪
//                       </div>
//                     )}
                    
//                     {/* Profile Image Overlay */}
//                     <div className="absolute -bottom-6 left-4">
//                       <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white bg-white shadow-md overflow-hidden">
//                         {shop.profileImage ? (
//                           <Image
//                             src={shop.profileImage}
//                             alt={shop.businessName}
//                             fill
//                             className="object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-xl">
//                             🏪
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="pt-8 pb-4 px-4 sm:px-5">
//                     <h3 className="font-bold text-base sm:text-lg text-secondary group-hover:text-primary transition-colors duration-200 truncate">
//                       {shop.businessName}
//                     </h3>

//                     <div className="mt-2 space-y-1">
//                       <p className="text-muted text-sm flex items-center gap-1.5">
//                         <span>👤</span> {shop.ownerName}
//                       </p>
//                       <p className="text-muted text-sm flex items-center gap-1.5 truncate">
//                         <span>📍</span> {shop.businessLocation}
//                       </p>
//                       <p className="text-muted text-sm flex items-center gap-1.5">
//                         <span>📱</span> {shop.phoneNumber}
//                       </p>
//                     </div>

//                     <div className="border-t border-surface mt-3 pt-3 flex flex-wrap items-center justify-between gap-2">
//                       <span className="text-sm text-muted flex items-center gap-1">
//                         📦 {shop.productCount} product{shop.productCount !== 1 ? 's' : ''}
//                       </span>
//                       <span className="text-primary font-bold text-sm">
//                         KSh {shop.totalEarned?.toLocaleString() || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
          
//           {/* View More Shops Button */}
//           {shops.length > 6 && (
//             <div className="text-center mt-8">
//               <Link
//                 href="/shops"
//                 className="inline-block bg-primary hover:bg-accent-dark text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
//               >
//                 View All {shops.length} Shops →
//               </Link>
//             </div>
//           )}
//         </section>

//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import HeroSection from './components/HeroSection';
import ProductSection from './components/ProductSection';
import ShopSection from './components/ShopSection';

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartCount(JSON.parse(cart).length);
    }
  };

  const fetchData = async () => {
    try {
      const [productsResponse, shopsResponse] = await Promise.all([
        fetch('/api/shd-api/api/products'),
        fetch('/api/shd-api/api/shops')
      ]);

      const productsData = await productsResponse.json();
      const shopsData = await shopsResponse.json();

      // Debug logs
      console.log("🛒 Products API Response:", productsData);
      console.log("🏪 Shops API Response:", shopsData);
      console.log("First Product:", JSON.stringify(productsData.products?.[0], null, 2));
      console.log("First Product Vendor:", JSON.stringify(productsData.products?.[0]?.vendorId, null, 2));

      setProducts(productsData.products || []);
      setShops(shopsData.shops || []);
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setAddingToCart(product._id);
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item: any) => item._id === product._id);
    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item: any) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <ProductSection
          products={products}
          addingToCart={addingToCart}
          onAddToCart={addToCart}
        />
        
        <ShopSection shops={shops} />
      </div>
    </div>
  );
}