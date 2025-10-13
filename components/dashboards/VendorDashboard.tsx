/*"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";


interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isApproved: boolean;
  sku: string;
  category: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigateToShop = () => {
    router.push('/vendor/shop');
  };

  const navigateToAddProduct = () => {
    router.push('/vendor/products/add');
  };

  const navigateToEditProduct = (productId: string) => {
    router.push(`/vendor/products/edit/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendor/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setProducts(products.map(product => 
          product._id === productId 
            ? { ...product, isActive: !currentStatus }
            : product
        ));
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Total Sales</h2>
          <p className="mt-2 text-2xl text-gray-700 font-bold">KSh 85,420</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Orders</h2>
          <p className="mt-2 text-2xl text-gray-700 font-bold">42</p>
          <p className="text-sm text-gray-500">Pending: 5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Products</h2>
          <p className="mt-2 text-2xl text-gray-700 font-bold">{products.length}</p>
          <p className="text-sm text-gray-500">Active: {products.filter(p => p.isActive).length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Commission</h2>
          <p className="mt-2 text-2xl text-gray-700 font-bold">KSh 8,542</p>
          <p className="text-sm text-gray-500">15% platform fee</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Shop Management Card *
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shop Management</h2>
          <div className="bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">My Shop</p>
                <p className="text-sm opacity-90">Manage your shop information and settings</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🏪</span>
              </div>
            </div>
          </div>
          <button 
            onClick={navigateToShop}
            className="w-full bg-[#bf2c7e] text-white py-2 rounded-md text-sm font-medium hover:bg-[#e5178a] transition-colors"
          >
            Manage Shop
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
          <div className="bg-[#f0f9ff] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">Premium Store</p>
                <p className="text-sm text-gray-500">Renews on: 15th Oct 2023</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            </div>
            <button className="mt-4 w-full bg-[#182155] text-white py-2 rounded-md text-sm">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-gray-700">Order #12345</p>
                <p className="text-sm text-gray-500">2 products • KSh 2,400</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Processing</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-gray-700">Order #12346</p>
                <p className="text-sm text-gray-500">1 product • KSh 1,200</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Shipped</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-gray-700">Order #12347</p>
                <p className="text-sm text-gray-500">3 products • KSh 3,800</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Delivered</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-900 mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={navigateToAddProduct}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded text-sm"
            >
              Add Product
            </button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded text-sm">
              View Analytics
            </button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded text-sm">
              Process Orders
            </button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded text-sm">
              Update Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Listing *
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">My Products ({products.length})</h2>
          <button 
            onClick={navigateToAddProduct}
            className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e5178a]"
          >
            Add New Product
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#bf2c7e]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No products found</p>
            <button 
              onClick={navigateToAddProduct}
              className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e5178a]"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="bg-gray-200 h-40 rounded-lg mb-3 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-[#bf2c7e] font-bold">KSh {product.price.toLocaleString()}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} in stock
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.isApproved ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() => toggleProductStatus(product._id, product.isActive)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateToEditProduct(product._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isApproved: boolean;
  sku: string;
  category: string;
  description?: string;
  originalPrice?: number;
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
  createdAt: string;
}

export default function VendorDashboard() {
  const router = useRouter();
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

  const navigateToShop = () => {
    router.push('/vendor/shop');
  };

  const navigateToAddProduct = () => {
    router.push('/vendor/products/add');
  };

  const navigateToEditProduct = (productId: string) => {
    router.push(`/vendor/products/edit/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendor/products');
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
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setProducts(products.map(product => 
          product._id === productId 
            ? { ...product, isActive: !currentStatus }
            : product
        ));
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2c7e]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-0 sm:px-0 bg-white">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Total Sales</h2>
            <p className="mt-2 text-2xl text-gray-700 font-bold">KSh 85,420</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Orders</h2>
            <p className="mt-2 text-2xl text-gray-700 font-bold">42</p>
            <p className="text-sm text-gray-500">Pending: 5</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Products</h2>
            <p className="mt-2 text-2xl text-gray-700 font-bold">{products.length}</p>
            <p className="text-sm text-gray-500">Active: {products.filter(p => p.isActive).length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Commission</h2>
            <p className="mt-2 text-2xl text-gray-700 font-bold">KSh 8,542</p>
            <p className="text-sm text-gray-500">15% platform fee</p>
          </div>
        </div>
        
        {/* Shop Management & Subscription */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shop Management Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shop Management</h2>
            <div className="bg-gradient-to-r from-[#182155] to-[#bf2c7e] text-white p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">My Shop</p>
                  <p className="text-sm opacity-90">Manage your shop information and settings</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏪</span>
                </div>
              </div>
            </div>
            <button 
              onClick={navigateToShop}
              className="w-full bg-[#bf2c7e] text-white py-2 rounded-md text-sm font-medium hover:bg-[#e5178a] transition-colors"
            >
              Manage Shop
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
            <div className="bg-[#f0f9ff] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Premium Store</p>
                  <p className="text-sm text-gray-500">Renews on: 15th Oct 2023</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
              </div>
              <button className="mt-4 w-full bg-[#182155] text-white py-2 rounded-md text-sm">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Products Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Products ({products.length})</h2>
          <button 
            onClick={navigateToAddProduct}
            className="bg-[#bf2c7e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e5178a] transition-colors w-full sm:w-auto text-center"
          >
            Add New Product
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col space-y-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search your products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] text-sm sm:text-base"
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
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] text-sm sm:text-base text-gray-700"
              >
                <option value="All Categories" className="text-gray-700">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="text-gray-700">{category}</option>
                ))}
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2c7e] text-sm sm:text-base text-gray-700"
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
        <div className="mb-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {products.length === 0 ? 'No products yet' : 'No products found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0 
                ? 'Start by adding your first product to your store' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            <button 
              onClick={navigateToAddProduct}
              className="bg-[#bf2c7e] text-white px-6 py-2 rounded-md font-medium hover:bg-[#e5178a] transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                {/* Product Image */}
                <div className="bg-gray-200 h-40 md:h-48 relative">
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
                  {/* Sale Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Sale
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight mb-1">
                    {product.name}
                  </h3>
                  
                  {/* Category */}
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                  
                  {/* Price *
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[#bf2c7e] font-bold text-base">
                      KSh {product.price.toLocaleString()}
                    </span>
                    
                    {/* Stock Status *
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </div>*/}

                  {/* Price & Stock with Icons for Mobile */}
<div className="flex items-center justify-between mt-auto">
  <div className="flex items-center gap-1 xs:gap-2">
    <span className="text-[#bf2c7e] font-bold text-xs xs:text-sm sm:text-base">
      KSh {product.price.toLocaleString()}
    </span>
  </div>
  
  {/* Stock Status with Icon */}
  <div className="flex items-center gap-1">
    <div className={`hidden xs:block text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded ${
      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {product.stock} stock
    </div>
    {/* Icon for extra small screens */}
    <div className="xs:hidden">
      {product.stock > 0 ? (
        <div className="w-2 h-2 bg-green-500 rounded-full" title={`${product.stock} in stock`} />
      ) : (
        <div className="w-2 h-2 bg-red-500 rounded-full" title="Out of stock" />
      )}
    </div>
  </div>
</div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={() => toggleProductStatus(product._id, product.isActive)}
                          className="rounded text-[#bf2c7e] focus:ring-[#bf2c7e]"
                        />
                        <span className="text-xs text-gray-700">Active</span>
                      </label>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigateToEditProduct(product._id)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">
                Previous
              </button>
              <button className="px-3 py-1 rounded bg-[#bf2c7e] text-white text-sm">1</button>
              <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">2</button>
              <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">3</button>
              <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm">Next</button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}