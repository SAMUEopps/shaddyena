/*"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Store,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Truck,
  RefreshCw,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  MoreVertical,
  ArrowUpRight,
  Calendar,
  Tag,
  Box,
  Heart,
  Share2,
  AlertCircle
} from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    pendingApproval: 0,
    outOfStock: 0
  });
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

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
        
        const uniqueCategories = Array.from(
          new Set(data.products.map((product: Product) => product.category))
        ) as string[];
        setCategories(uniqueCategories);
        
        setStats({
          totalProducts: data.products.length,
          activeProducts: data.products.filter((p: Product) => p.isActive).length,
          pendingApproval: data.products.filter((p: Product) => !p.isApproved).length,
          outOfStock: data.products.filter((p: Product) => p.stock === 0).length
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price_low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name_asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
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

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section *
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-8 md:py-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Store className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-primary)] font-medium">Vendor Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                Welcome back, {user?.firstName || 'Vendor'}
              </h1>
              <p className="text-[var(--color-text-muted)] mt-2">
                Manage your products, track sales, and grow your business
              </p>
            </div>
            <button
              onClick={() => router.push('/vendor/products/add')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Stats Grid *
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)]">{stats.totalProducts}</span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Total Products</h3>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)]">{stats.activeProducts}</span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Active Products</h3>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)]">{stats.pendingApproval}</span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Pending Approval</h3>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text)]">{stats.outOfStock}</span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Out of Stock</h3>
          </div>
        </div>

        {/* Quick Actions *
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/vendor/shop')}
            className="group bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">Manage Shop</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Update your shop information and settings</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[var(--color-text-muted)] ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
          
          <button
            onClick={() => router.push('/vendor/orders')}
            className="group bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">View Orders</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Track and manage customer orders</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[var(--color-text-muted)] ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
          
          <button
            onClick={() => router.push('/vendor/analytics')}
            className="group bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">Analytics</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">View sales insights and performance</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[var(--color-text-muted)] ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Products Section *
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <Package className="w-6 h-6 text-[var(--color-primary)]" />
                My Products
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Manage and monitor all your products
              </p>
            </div>
            <button
              onClick={() => router.push('/vendor/products/add')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Search and Filters *
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
                
                <button
                  onClick={() => fetchProducts()}
                  className="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count *
          <div className="mb-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Showing <span className="font-semibold text-[var(--color-text)]">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-[var(--color-text)]">{products.length}</span> products
            </p>
          </div>

          {/* Products Grid *
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
              <div className="inline-flex p-4 bg-[var(--color-background-soft)] rounded-full mb-4">
                <Package className="w-12 h-12 text-[var(--color-text-muted)]/50" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {products.length === 0 ? 'No products yet' : 'No products found'}
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
                {products.length === 0 
                  ? 'Start by adding your first product to your store' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {products.length === 0 && (
                <button
                  onClick={() => router.push('/vendor/products/add')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image *
                  <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-[var(--color-background-soft)]">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-[var(--color-text-muted)]/30" />
                      </div>
                    )}
                    
                    {/* Status Badges *
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {!product.isApproved && (
                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded-full">
                          Pending
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        product.isActive 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Product Info *
                  <div className="p-4 space-y-3">
                    <Link href={`/products/${product._id}`}>
                      <h3 className="font-semibold text-[var(--color-text)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors text-sm">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-background-soft)] rounded-full text-[var(--color-text-muted)]">
                        {product.category}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">SKU: {product.sku}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[var(--color-primary)] font-bold text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-[var(--color-text-muted)] line-through ml-1">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        product.stock > 10 ? 'bg-green-500/10 text-green-600' :
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={() => toggleProductStatus(product._id, product.isActive)}
                          className="w-3.5 h-3.5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-xs text-[var(--color-text-muted)]">Active</span>
                      </label>
                      
                      <div className="flex-1" />
                      
                      <button
                        onClick={() => router.push(`/vendor/products/edit/${product._id}`)}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-blue-500 transition-colors rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/products/${product._id}`}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Store,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Truck,
  RefreshCw,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  MoreVertical,
  ArrowUpRight,
  Calendar,
  Tag,
  Box,
  Heart,
  Share2,
  AlertCircle
} from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    pendingApproval: 0,
    outOfStock: 0
  });
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

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
        
        const uniqueCategories = Array.from(
          new Set(data.products.map((product: Product) => product.category))
        ) as string[];
        setCategories(uniqueCategories);
        
        setStats({
          totalProducts: data.products.length,
          activeProducts: data.products.filter((p: Product) => p.isActive).length,
          pendingApproval: data.products.filter((p: Product) => !p.isApproved).length,
          outOfStock: data.products.filter((p: Product) => p.stock === 0).length
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price_low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name_asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
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

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-6 xs:py-8 md:py-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 xs:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-0.5 xs:py-1 bg-[var(--color-primary)]/10 rounded-full mb-2 xs:mb-3 md:mb-4">
                <Store className="w-3 h-3 xs:w-4 xs:h-4 text-[var(--color-primary)]" />
                <span className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-primary)] font-medium">Vendor Dashboard</span>
              </div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                Welcome back, {user?.firstName || 'Vendor'}
              </h1>
              <p className="text-xs xs:text-sm text-[var(--color-text-muted)] mt-1 xs:mt-2">
                Manage your products, track sales, and grow your business
              </p>
            </div>
            <button
              onClick={() => router.push('/vendor/products/add')}
              className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-lg xs:rounded-xl text-xs xs:text-sm sm:text-base font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 md:py-12">
        {/* Stats Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-6 mb-6 xs:mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 xs:mb-3">
              <div className="p-1.5 xs:p-2 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)]">{stats.totalProducts}</span>
            </div>
            <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">Total Products</h3>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 xs:mb-3">
              <div className="p-1.5 xs:p-2 bg-green-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)]">{stats.activeProducts}</span>
            </div>
            <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">Active Products</h3>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 xs:mb-3">
              <div className="p-1.5 xs:p-2 bg-yellow-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)]">{stats.pendingApproval}</span>
            </div>
            <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">Pending Approval</h3>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 xs:mb-3">
              <div className="p-1.5 xs:p-2 bg-red-500/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <AlertCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)]">{stats.outOfStock}</span>
            </div>
            <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">Out of Stock</h3>
          </div>
        </div>

        {/* Quick Actions - Stack on mobile */}
        <div className="grid grid-cols-1 gap-3 xs:gap-4 md:grid-cols-3 md:gap-6 mb-6 xs:mb-8">
          <button
            onClick={() => router.push('/vendor/shop')}
            className="group bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:border-[var(--color-primary)]/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 xs:p-2.5 sm:p-3 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)]">Manage Shop</h3>
                <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">Update your shop information and settings</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
          
          <button
            onClick={() => router.push('/vendor/orders')}
            className="group bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:border-[var(--color-primary)]/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 xs:p-2.5 sm:p-3 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)]">View Orders</h3>
                <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">Track and manage customer orders</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
          
          <button
            onClick={() => router.push('/vendor/analytics')}
            className="group bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 sm:p-5 hover:border-[var(--color-primary)]/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className="p-2 xs:p-2.5 sm:p-3 bg-[var(--color-primary)]/10 rounded-lg xs:rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[var(--color-text)]">Analytics</h3>
                <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">View sales insights and performance</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 xs:gap-4 mb-4 xs:mb-6">
            <div>
              <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] flex items-center gap-1.5 xs:gap-2">
                <Package className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                My Products
              </h2>
              <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)] mt-0.5 xs:mt-1">
                Manage and monitor all your products
              </p>
            </div>
            <button
              onClick={() => router.push('/vendor/products/add')}
              className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 bg-[var(--color-primary)] text-white rounded-lg xs:rounded-xl text-xs xs:text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              Add Product
            </button>
          </div>

          {/* Search and Filters - Stack on mobile */}
          <div className="bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)] p-3 xs:p-4 mb-4 xs:mb-6">
            <div className="flex flex-col gap-3 xs:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[10px] xs:text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 xs:gap-3">
                <div className="flex-1 min-w-[120px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none px-2 xs:px-3 py-1.5 xs:py-2 pr-6 xs:pr-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[10px] xs:text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
                
                <div className="flex-1 min-w-[120px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none px-2 xs:px-3 py-1.5 xs:py-2 pr-6 xs:pr-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl text-[10px] xs:text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                  <ChevronDown className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
                
                <button
                  onClick={() => fetchProducts()}
                  className="p-1.5 xs:p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg xs:rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
                >
                  <RefreshCw className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3 xs:mb-4">
            <p className="text-[10px] xs:text-xs text-[var(--color-text-muted)]">
              Showing <span className="font-semibold text-[var(--color-text)]">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-[var(--color-text)]">{products.length}</span> products
            </p>
          </div>

          {/* Products Grid - 2 columns on mobile */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 xs:py-16 bg-[var(--color-surface)] rounded-xl xs:rounded-2xl border border-[var(--color-border)]">
              <div className="inline-flex p-3 xs:p-4 bg-[var(--color-background-soft)] rounded-full mb-3 xs:mb-4">
                <Package className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[var(--color-text-muted)]/50" />
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-[var(--color-text)] mb-1 xs:mb-2">
                {products.length === 0 ? 'No products yet' : 'No products found'}
              </h3>
              <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 xs:mb-6 max-w-md mx-auto px-4">
                {products.length === 0 
                  ? 'Start by adding your first product to your store' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {products.length === 0 && (
                <button
                  onClick={() => router.push('/vendor/products/add')}
                  className="inline-flex items-center gap-1.5 xs:gap-2 px-4 xs:px-6 py-1.5 xs:py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white rounded-lg xs:rounded-xl text-xs xs:text-sm font-medium hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 lg:gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-[var(--color-surface)] rounded-lg xs:rounded-xl sm:rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:-translate-y-0.5 xs:hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-[var(--color-background-soft)]">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-[var(--color-text-muted)]/30" />
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 sm:top-2 sm:left-2 flex flex-col gap-0.5 xs:gap-1">
                      {!product.isApproved && (
                        <span className="px-1 xs:px-1.5 sm:px-2 py-0.5 bg-yellow-500 text-white text-[8px] xs:text-[10px] sm:text-xs font-medium rounded-full">
                          Pending
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="px-1 xs:px-1.5 sm:px-2 py-0.5 bg-red-500 text-white text-[8px] xs:text-[10px] sm:text-xs font-medium rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-2 sm:right-2">
                      <span className={`px-1 xs:px-1.5 sm:px-2 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium rounded-full ${
                        product.isActive 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-1.5 xs:p-2 sm:p-3 space-y-1.5 xs:space-y-2 sm:space-y-3">
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--color-text)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2">
                      <span className="text-[8px] xs:text-[10px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 bg-[var(--color-background-soft)] rounded-full text-[var(--color-text-muted)] truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">
                        {product.category}
                      </span>
                      <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)] truncate">SKU: {product.sku}</span>
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div>
                        <span className="text-[var(--color-primary)] font-bold text-[10px] xs:text-xs sm:text-sm md:text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[7px] xs:text-[9px] sm:text-xs text-[var(--color-text-muted)] line-through ml-0.5 xs:ml-1">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className={`text-[7px] xs:text-[9px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full ${
                        product.stock > 10 ? 'bg-green-500/10 text-green-600' :
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 pt-1 xs:pt-1.5 sm:pt-2 border-t border-[var(--color-border)]">
                      <label className="flex items-center gap-0.5 xs:gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={() => toggleProductStatus(product._id, product.isActive)}
                          className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-muted)]">Active</span>
                      </label>
                      
                      <div className="flex-1" />
                      
                      <button
                        onClick={() => router.push(`/vendor/products/edit/${product._id}`)}
                        className="p-1 xs:p-1.5 text-[var(--color-text-muted)] hover:text-blue-500 transition-colors rounded-lg"
                      >
                        <Edit className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-1 xs:p-1.5 text-[var(--color-text-muted)] hover:text-red-500 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <Link
                        href={`/products/${product._id}`}
                        className="p-1 xs:p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors rounded-lg"
                      >
                        <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}