// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import Link from 'next/link';
// // // import { useRouter } from 'next/navigation';

// // // export default function Navigation() {
// // //   const [user, setUser] = useState<any>(null);
// // //   const [mounted, setMounted] = useState(false);
// // //   const router = useRouter();

// // //   useEffect(() => {
// // //     setMounted(true);

// // //     const userData = localStorage.getItem('user');

// // //     if (userData) {
// // //       setUser(JSON.parse(userData));
// // //     }
// // //   }, []);

// // //   const handleLogout = () => {
// // //     localStorage.removeItem('token');
// // //     localStorage.removeItem('user');
// // //     setUser(null);
// // //     router.push('/login');
// // //   };

// // //   if (!mounted) {
// // //     return (
// // //       <nav className="bg-white shadow-md">
// // //         <div className="container mx-auto px-4 py-3">
// // //           <Link href="/" className="text-2xl font-bold text-blue-600">
// // //             Shaddyna
// // //           </Link>
// // //         </div>
// // //       </nav>
// // //     );
// // //   }

// // //   return (
// // //     <nav className="bg-white shadow-md">
// // //       <div className="container mx-auto px-4 py-3 flex justify-between items-center">

// // //         <Link href="/" className="text-2xl font-bold text-blue-600">
// // //           Shaddyna
// // //         </Link>

// // //         <div className="flex items-center space-x-4">
// // //           {user ? (
// // //             <>
// // //               <span className="text-gray-700">
// // //                 Hi, {user.name}
// // //               </span>

// // //               {user.role === 'vendor' && (
// // //                 <Link 
// // //                   href="/vendor/dashboard"
// // //                   className="text-blue-600 hover:underline"
// // //                 >
// // //                   Vendor Dashboard
// // //                 </Link>
// // //               )}

// // //               {user.role === 'admin' && (
// // //                 <Link 
// // //                   href="/admin/dashboard"
// // //                   className="text-blue-600 hover:underline"
// // //                 >
// // //                   Admin
// // //                 </Link>
// // //               )}

// // //               <Link 
// // //                 href="/orders"
// // //                 className="text-blue-600 hover:underline"
// // //               >
// // //                 Orders
// // //               </Link>

// // //               <button
// // //                 onClick={handleLogout}
// // //                 className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
// // //               >
// // //                 Logout
// // //               </button>
// // //             </>
// // //           ) : (
// // //             <>
// // //               <Link href="/login" className="text-blue-600 hover:underline">
// // //                 Login
// // //               </Link>

// // //               <Link 
// // //                 href="/register"
// // //                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// // //               >
// // //                 Register
// // //               </Link>
// // //             </>
// // //           )}
// // //         </div>

// // //       </div>
// // //     </nav>
// // //   );
// // // }

// // 'use client';

// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { useState, useEffect } from 'react';

// // export default function Navigation() {
// //   const pathname = usePathname();
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [userRole, setUserRole] = useState<string | null>(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     const userStr = localStorage.getItem('user');
// //     if (token && userStr) {
// //       try {
// //         const user = JSON.parse(userStr);
// //         setIsLoggedIn(true);
// //         setUserRole(user.role);
// //       } catch (e) {
// //         // Invalid JSON
// //       }
// //     }
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     setIsLoggedIn(false);
// //     setUserRole(null);
// //     window.location.href = '/';
// //   };

// //   return (
// //     <nav className="bg-white shadow-md sticky top-0 z-50">
// //       <div className="container mx-auto px-4">
// //         <div className="flex flex-wrap items-center justify-between py-3">
// //           <Link href="/" className="text-2xl font-bold text-blue-600">
// //             🛍️ Shaddyna
// //           </Link>

// //           <div className="flex flex-wrap items-center gap-4">
// //             <Link href="/" className={`hover:text-blue-600 ${pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}>
// //               Home
// //             </Link>
// //             <Link href="/shops" className={`hover:text-blue-600 ${pathname === '/shops' ? 'text-blue-600 font-semibold' : ''}`}>
// //               Shops
// //             </Link>
// //             <Link href="/cart" className="hover:text-blue-600">
// //               🛒 Cart
// //             </Link>
            
// //             {isLoggedIn ? (
// //               <>
// //                 {userRole === 'admin' && (
// //                   <Link href="/admin/dashboard" className="hover:text-blue-600">
// //                     Admin
// //                   </Link>
// //                 )}
// //                 {userRole === 'vendor' && (
// //                   <>
// //                     <Link href="/vendor/dashboard" className="hover:text-blue-600">
// //                       Dashboard
// //                     </Link>
// //                     <Link href="/vendor/products" className="hover:text-blue-600">
// //                       Products
// //                     </Link>
// //                   </>
// //                 )}
// //                 {userRole === 'customer' && (
// //                   <Link href="/orders" className="hover:text-blue-600">
// //                     Orders
// //                   </Link>
// //                 )}
// //                 <button
// //                   onClick={handleLogout}
// //                   className="text-red-600 hover:text-red-800 font-medium"
// //                 >
// //                   Logout
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 <Link href="/login" className="hover:text-blue-600">
// //                   Login
// //                 </Link>
// //                 <Link 
// //                   href="/register" 
// //                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //                 >
// //                   Register
// //                 </Link>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // C:\Users\USER\Desktop\Projects\my-app\components\Navigation.tsx
// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState, useEffect } from 'react';

// export default function Navigation() {
//   const pathname = usePathname();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');
//     if (token && userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         setIsLoggedIn(true);
//         setUserRole(user.role);
//       } catch (e) {
//         // Invalid JSON
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setUserRole(null);
//     window.location.href = '/';
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap items-center justify-between py-3">
//           <Link href="/" className="text-2xl font-bold text-blue-600">
//             🛍️ Shaddyna
//           </Link>

//           <div className="flex flex-wrap items-center gap-4">
//             <Link href="/" className={`hover:text-blue-600 ${pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}>
//               Home
//             </Link>
//             <Link href="/shops" className={`hover:text-blue-600 ${pathname === '/shops' ? 'text-blue-600 font-semibold' : ''}`}>
//               Shops
//             </Link>
//             <Link href="/cart" className="hover:text-blue-600">
//               🛒 Cart
//             </Link>
            
//             {isLoggedIn ? (
//               <>
//                 <Link href="/profile" className="hover:text-blue-600">
//                   👤 Profile
//                 </Link>
//                 {userRole === 'admin' && (
//                   <Link href="/admin/dashboard" className="hover:text-blue-600">
//                     Admin
//                   </Link>
//                 )}
//                 {userRole === 'vendor' && (
//                   <>
//                     <Link href="/vendor/dashboard" className="hover:text-blue-600">
//                       Dashboard
//                     </Link>
//                     <Link href="/vendor/products" className="hover:text-blue-600">
//                       Products
//                     </Link>
//                   </>
//                 )}
//                 {userRole === 'customer' && (
//                   <Link href="/orders" className="hover:text-blue-600">
//                     Orders
//                   </Link>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="text-red-600 hover:text-red-800 font-medium"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link href="/login" className="hover:text-blue-600">
//                   Login
//                 </Link>
//                 <Link 
//                   href="/register" 
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// C:\Users\USER\Desktop\Projects\my-app\components\Navigation.tsx
/*'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cartCount,setCartCount] = useState(0);
  const [showServices, setShowServices] = useState(false);


  useEffect(() => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const cart = localStorage.getItem("cart");

  if (cart) {
    setCartCount(JSON.parse(cart).length);
  }

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUserRole(user.role);
    } catch {
      // ignore invalid JSON
    }
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  };

  const cart = localStorage.getItem("cart");



  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-3">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Shaddyna
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className={`hover:text-blue-600 ${pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}>
              Home
            </Link>
            <Link href="/shops" className={`hover:text-blue-600 ${pathname === '/shops' ? 'text-blue-600 font-semibold' : ''}`}>
              Shops
            </Link>
            <Link href="/cart" className="hover:text-blue-600">
               Cart ({cartCount})
            </Link>


            <div
              className="relative"
              onMouseEnter={() => setShowServices(true)}
              onMouseLeave={() => setShowServices(false)}
            >
              <button className="flex items-center gap-1 hover:text-pink-600">
                Services
                <span className="text-xs">▼</span>
              </button>

              {showServices && (
               
                  <div className="absolute left-0 top-full w-56 rounded-lg bg-white shadow-xl border border-gray-100 py-2">
                  <Link
                    href="/membership/activate"
                    className="block px-4 py-2 hover:bg-pink-50"
                  >
                    🌟 Membership
                  </Link>

                  <Link
                    href="/events"
                    className="block px-4 py-2 hover:bg-pink-50"
                  >
                    🎉 Events
                  </Link>

                  {userRole === "vendor" && (
                    <Link
                      href="/vendor/subscriptions"
                      className="block px-4 py-2 hover:bg-pink-50"
                    >
                      💎 Vendor Subscriptions
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="hover:text-blue-600">
                   Profile
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin/dashboard" className="text-red-600 hover:text-red-800 font-semibold">
                     Admin
                  </Link>
                )}
                {userRole === 'vendor' && (
                  <>
                    <Link href="/vendor/dashboard" className="hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link href="/vendor/products" className="hover:text-blue-600">
                      Products
                    </Link>
                  </>
                )}
                {userRole === 'rider' && (
                  <Link href="/rider/dashboard" className="hover:text-blue-600">
                    🏍️ Rider
                  </Link>
                )}
                {userRole === 'customer' && (
                  <>
                    <Link href="/orders" className="hover:text-blue-600">
                      Orders
                    </Link>
                    <Link href="/membership/dashboard" className="hover:text-blue-600">
                      🌟 Member
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showServices, setShowServices] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const cart = localStorage.getItem("cart");

    if (cart) {
      setCartCount(JSON.parse(cart).length);
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserRole(user.role);
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const NavLink = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`block px-3 py-2 rounded-lg transition-all duration-200 hover:text-primary hover:bg-surface ${
          isActive ? 'text-primary font-semibold bg-surface' : 'text-secondary'
        } ${className}`}
      >
        {children}
      </Link>
    );
  };

  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:text-primary hover:bg-surface ${
          isActive ? 'text-primary font-semibold bg-surface' : 'text-secondary'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl sm:text-3xl font-bold text-primary hover:text-accent-dark transition-colors duration-200"
          >
            Shaddyna
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/shd-pages/shops">Shops</NavLink>
            
            {/* Cart with badge */}
            <Link 
              href="/shd-pages/cart" 
              className="relative px-3 py-2 rounded-lg hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowServices(true)}
              onMouseLeave={() => setShowServices(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-primary hover:bg-surface transition-all duration-200 text-secondary">
                Services
                <span className="text-xs transition-transform duration-200" style={{ transform: showServices ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▼
                </span>
              </button>

              {showServices && (
                <div className="absolute left-0 top-full w-56 rounded-lg bg-white shadow-xl border border-surface py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/shd-pages/membership/activate"
                    className="block px-4 py-2.5 hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
                  >
                     Membership
                  </Link>
                  <Link
                    href="/shd-pages/events"
                    className="block px-4 py-2.5 hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
                  >
                     Events
                  </Link>
                  {userRole === "vendor" && (
                    <Link
                      href="/shd-pages/vendor/subscriptions"
                      className="block px-4 py-2.5 hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
                    >
                      💎 Vendor Subscriptions
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Auth Links */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1 lg:gap-2">
                <NavLink href="/shd-pages/profile">Profile</NavLink>
                {userRole === 'admin' && (
                  <NavLink href="/shd-pages/admin/dashboard" className="text-primary font-semibold">
                    Admin
                  </NavLink>
                )}
                {userRole === 'vendor' && (
                  <>
                    <NavLink href="/shd-pages/vendor/dashboard">Dashboard</NavLink>
                    <NavLink href="/shd-pages/vendor/products">Products</NavLink>
                  </>
                )}
                {userRole === 'rider' && (
                  <NavLink href="/shd-pages/rider/dashboard">🏍️ Rider</NavLink>
                )}
                {userRole === 'customer' && (
                  <>
                    <NavLink href="/shd-pages/orders">Orders</NavLink>
                    <NavLink href="/shd-pages/membership/dashboard">🌟 Member</NavLink>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-primary hover:text-accent-dark hover:bg-surface transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/shd-pages/login" 
                  className="px-4 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  href="/shd-pages/register" 
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent-dark transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors duration-200 text-secondary"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              <MobileNavLink href="/">Home</MobileNavLink>
              <MobileNavLink href="/shd-pages/shops">Shops</MobileNavLink>
              
              {/* Mobile Cart */}
              <Link 
                href="/shd-pages/cart" 
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-primary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Services */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setShowServices(!showServices)}
                  className="flex items-center justify-between w-full py-1 text-secondary hover:text-primary transition-colors duration-200"
                >
                  <span>Services</span>
                  <span className={`transition-transform duration-200 ${showServices ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showServices && (
                  <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/shd-pages/membership/activate"
                      className="block px-4 py-2.5 rounded-lg hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
                    >
                       Membership
                    </Link>
                    <Link
                      href="/shd-pages/events"
                      className="block px-4 py-2.5 rounded-lg hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
                    >
                       Events
                    </Link>
                    {userRole === "vendor" && (
                      <Link
                        href="/shd-pages/vendor/subscriptions"
                        className="block px-4 py-2.5 rounded-lg hover:text-primary hover:bg-surface transition-all duration-200 text-secondary"
                      >
                        💎 Vendor Subscriptions
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Auth Links */}
              {isLoggedIn ? (
                <>
                  <MobileNavLink href="/shd-pages/profile">Profile</MobileNavLink>
                  {userRole === 'admin' && (
                    <MobileNavLink href="/shd-pages/admin/dashboard">Admin</MobileNavLink>
                  )}
                  {userRole === 'vendor' && (
                    <>
                      <MobileNavLink href="/shd-pages/vendor/dashboard">Dashboard</MobileNavLink>
                      <MobileNavLink href="/shd-pages/vendor/products">Products</MobileNavLink>
                    </>
                  )}
                  {userRole === 'rider' && (
                    <MobileNavLink href="/shd-pages/rider/dashboard">🏍️ Rider</MobileNavLink>
                  )}
                  {userRole === 'customer' && (
                    <>
                      <MobileNavLink href="/shd-pages/orders">Orders</MobileNavLink>
                      <MobileNavLink href="/shd-pages/membership/dashboard">🌟 Member</MobileNavLink>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-left rounded-lg text-primary hover:text-accent-dark hover:bg-surface transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-4 pt-2">
                  <Link 
                    href="/shd-pages/login" 
                    className="px-4 py-3 rounded-lg text-center text-secondary hover:text-primary hover:bg-surface transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/shd-pages/register" 
                    className="px-4 py-3 rounded-lg text-center bg-primary text-white hover:bg-accent-dark transition-all duration-200 shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}