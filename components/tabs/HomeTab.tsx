{/*import { useEffect, useRef, useState } from "react";
import Icons from "../icons/Icons";

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

      {/* Hero Banner *
      <div className="mb-4">
        {/* Desktop Hero *
        <div className="hidden md:block bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Discover Amazing Products</h2>
          <p className="text-lg mb-6">Shop from hundreds of vendors with secure M-Pesa payments</p>
          <button className="bg-white text-[#182155] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Shopping
          </button>
        </div>

        {/* Mobile Hero Carousel *
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

      {/* Featured Categories *
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          {/* Show "View All" only on mobile for horizontal scroll *
          <button className="md:hidden text-[#bf2c7e] text-sm font-medium">
            View All
          </button>
        </div>
        
        {/* Desktop Categories Grid *
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

        {/* Mobile Categories Horizontal Scroll *
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
          
          {/* Scroll indicator for mobile *
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

      <Icons />

      {/* Featured Products *
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
}*/}

import { useEffect, useRef, useState } from "react";
import Icons from "../icons/Icons";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  vendorId: string;
  shopId: string;
  rating?: {
    average: number;
    count: number;
  };
  vendor?: {
    businessName: string;
  };
  shop?: {
    businessName: string;
  };
  createdAt: string;
  isActive: boolean;
  isApproved: boolean;
}

export default function HomeTab() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?limit=8&page=1");
        const data = await res.json();
        
        if (data.products) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    const filterAndSortProducts = () => {
      let filtered = products;

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory !== 'All Categories') {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }

      // Sort products
      switch (sortBy) {
        case 'price-low':
          filtered = [...filtered].sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered = [...filtered].sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        default:
          break;
      }

      setFilteredProducts(filtered);
    };

    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Mock functions for cart and wishlist (you can replace with your actual implementations)
   const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      vendorId: product.vendorId,
      shopId: product.shopId,
      sku: product._id, // Using _id as sku for simplicity
      quantity: 1
    });
  };

const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        vendorId: product.vendorId,
        shopId: product.shopId
      });
    }
  };

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
      <div className="mb-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
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
                onClick={() => setSelectedCategory(category)}
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
                  onClick={() => setSelectedCategory(category)}
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
        </div>
      </div>

      <Icons />

      {/* Search and Sort Controls *
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] focus:border-transparent"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>*/}

      {/* Featured Products */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48"></div>
                <div className="p-4">
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                  <div className="flex justify-between mt-3">
                    <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/products/${product._id}`}>
                  <div className="bg-gray-200 h-48 relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-[#bf2c7e] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Vendor/Shop Info */}
                  {(product.vendor || product.shop) && (
                    <p className="text-sm text-gray-500 mt-1">
                      By {product.shop?.businessName || product.vendor?.businessName || 'Unknown Seller'}
                    </p>
                  )}
                  
                  {/* Rating */}
                  {product.rating && product.rating.count > 0 && (
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.round(product.rating.average))}
                        {'☆'.repeat(5 - Math.round(product.rating.average))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-[#bf2c7e] font-bold">
                        KSh {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through ml-1">
                          KSh {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="bg-[#182155] text-white px-3 py-1 rounded text-sm hover:bg-[#2a3170] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`p-2 rounded-full ${
                        isInWishlist(product._id) 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill={isInWishlist(product._id) ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Vendor-specific info *
                  {role === 'vendor' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Status: {product.stock > 0 ? 'Active' : 'Out of stock'}</span>
                        <span>Views: 156</span>
                      </div>
                    </div>
                  )}*/}
                </div>
              </div>
            ))}
          </div>
        )}
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