"use client";
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  createdAt: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  category: string;
  vendorId: string;
  shopId: string;
  vendor?: {
    businessName: string;
  };
  shop?: {
    businessName: string;
  };
  rating?: {
    average: number;
    count: number;
  };
}

interface ProductsTabProps {
  role: string;
}

export default function Products({ role }: ProductsTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.products.map((product: Product) => product.category))
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center bg-white items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className='bg-white '>
          <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              </div>
            </div>
          </div>
        </header> 
        
        
           <div className="px-4">
    <div className="px-4 sm:px-0 bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        {/*<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {role === 'vendor' ? 'Products' : role === 'admin' ? 'All Products' : 'Products'}
        </h1>*/}
        
        {role === 'vendor' && (
          <Link 
            href="/vendor/products/add"
            className="bg-[#bf2c7e] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#e5178a] transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
          >
            Add New Product
          </Link>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col space-y-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] text-sm sm:text-base"
            />
          </div>
          
          {/* Filter Toggle for Mobile */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
              {showFilters ? ' ↑' : ' ↓'}
            </button>
          </div>
          {/* Filters - Responsive Layout */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:flex sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0`}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] text-sm sm:text-base text-gray-700"
            >
              <option value="All Categories" className="text-gray-700">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="text-gray-700">{category}</option>
              ))}
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] text-sm sm:text-base text-gray-700"
            >
              <option value="newest" className="text-gray-700">Newest</option>
              <option value="oldest" className="text-gray-700">Oldest</option>
              <option value="price-low" className="text-gray-700">Price: Low to High</option>
              <option value="price-high" className="text-gray-700">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Products Count */}
      <div className="mb-4 px-0">
        <p className="text-gray-600 text-sm sm:text-base">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 px-0">
          <div className="text-gray-400 text-5xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-0 sm:px-0">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <Link href={`/products/${product._id}`}>
                <div className="bg-gray-200 h-32 sm:h-40 md:h-48 relative">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                      Sale
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-[#bf2c7e] transition-colors line-clamp-2 text-sm sm:text-base leading-tight">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Vendor/Shop Info */}
                {(product.vendor || product.shop) && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    By {product.shop?.businessName || product.vendor?.businessName || 'Unknown Seller'}
                  </p>
                )}
                
                {/* Rating */}
                {product.rating && product.rating.count > 0 && (
                  <div className="flex items-center mt-1 mb-2">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(Math.round(product.rating.average))}
                      {'☆'.repeat(5 - Math.round(product.rating.average))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
                  </div>
                )}
                
                {/* Price and Stock */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-[#bf2c7e] font-bold text-sm sm:text-base">
                      KSh {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? 'In stock' : 'Out'}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-[#182155] text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-[#2a3170] disabled:opacity-50 disabled:cursor-not-allowed flex-1 mr-2"
                  >
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                      isInWishlist(product._id) 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
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
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Status: {product.stock > 0 ? 'Active' : 'Out'}</span>
                      <span>Views: 156</span>
                    </div>
                  </div>
                )}*/}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8 px-2">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button className="px-2 sm:px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">
              Previous
            </button>
            <button className="px-2 sm:px-3 py-1 rounded bg-[#bf2c7e] text-white text-sm">1</button>
            <button className="px-2 sm:px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">2</button>
            <button className="px-2 sm:px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">3</button>
            <button className="px-2 sm:px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">Next</button>
          </nav>
        </div>
      )}
    </div>
     </div>
     </div>
  );
}