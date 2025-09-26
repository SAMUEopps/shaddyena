import { useEffect, useRef, useState } from "react";

export default function HomeTab() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Auto-slide effect for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const clientWidth = carouselRef.current.clientWidth;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (carouselRef.current.scrollLeft >= maxScrollLeft) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Shaddyna</h1>

      {/* Hero Banner */}
      <div className="mb-4">
        {/* Desktop Hero */}
        <div className="hidden md:block bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Discover Amazing Products</h2>
          <p className="text-lg mb-6">Shop from hundreds of vendors with secure M-Pesa payments</p>
          <button className="bg-white text-[#182155] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Shopping
          </button>
        </div>

        {/* Mobile Hero Carousel */}
        <div className="block md:hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-scroll no-scrollbar space-x-4 rounded-lg snap-x snap-mandatory"
          >
            <img
              src="/hero/hero_mobile1.png"
              alt="Hero Slide 1"
              className="min-w-full object-cover rounded-lg snap-center"
            />
            <img
              src="/hero/hero_mobile2.png"
              alt="Hero Slide 2"
              className="min-w-full object-cover rounded-lg snap-center"
            />
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          {/* Show "View All" only on mobile for horizontal scroll */}
          <button className="md:hidden text-[#bf2c7e] text-sm font-medium">
            View All
          </button>
        </div>
        
        {/* Desktop Categories Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category}
                className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-16 w-16 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:from-[#182155] group-hover:to-[#bf2c7e] group-hover:scale-110 transition-all duration-200">
                  <span className="text-2xl group-hover:text-white transition-colors duration-200">📦</span>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-[#bf2c7e] transition-colors duration-200">{category}</h3>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Loading categories...</p>
          )}
        </div>

        {/* Mobile Categories Horizontal Scroll */}
        <div className="md:hidden">
          <div
            ref={categoriesScrollRef}
            className="flex overflow-x-auto pb-4 space-x-3 no-scrollbar scroll-smooth"
          >
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={category}
                  className="flex-shrink-0 w-24 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95"
                >
                  <div className="p-3">
                    <div className="bg-[#bf2c7e] h-14 w-14 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                      <span className="text-lg text-white">
                        {['📦', '📦', '📦', '📦', '📦', '📦', '📦', '📦'][index % 8]}
                      </span>
                    </div>
                    <h3 className="text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2">
                      {category}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              // Skeleton loader for mobile
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex-shrink-0 w-24 animate-pulse">
                    <div className="bg-gray-200 h-14 w-14 rounded-full mx-auto mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded mx-2 mb-1"></div>
                    <div className="bg-gray-200 h-3 rounded mx-2"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Scroll indicator for mobile */}
          {categories.length > 0 && (
            <div className="flex justify-center space-x-1 mt-2">
              {categories.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-gray-300"
                />
              ))}
              <span className="text-xs text-gray-500 ml-1"></span>
            </div>
          )}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 mb-3 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-medium text-gray-900">Premium Product {item}</h3>
              <div className="flex items-center mt-1 mb-2">
                <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#bf2c7e] font-bold">KSh 1,200</span>
                <button className="bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white text-xs px-3 py-1 rounded-lg hover:shadow-md transition-shadow duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

    {/* Promotional Banner *
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Seller</h2>
            <p className="text-gray-600 mb-4">Join thousands of vendors selling on our platform. Start your online store today!</p>
            <button className="bg-[#bf2c7e] text-white px-6 py-2 rounded-lg font-semibold">
              Register as Vendor
            </button>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="bg-gray-300 h-32 w-48 rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Testimonials *
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Customer Name</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">"Great shopping experience! The M-Pesa payment was seamless and delivery was fast."</p>
            </div>
          ))}
        </div>
      </div>*/}