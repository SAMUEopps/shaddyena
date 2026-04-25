'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Search,
  ChevronDown,
  Trash2,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Filter,
  X,
  User,
  Store,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Box
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isApproved: boolean;
  sku: string;
  categoryPath: string;
  description?: string;
  vendorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName?: string;
  };
  shopId: {
    _id: string;
    businessName: string;
    logo?: string;
  };
  createdAt: string;
  rating?: {
    average: number;
    count: number;
  };
}

interface FilterOptions {
  search: string;
  status: string;
  category: string;
  vendorId: string;
  sortBy: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    category: 'all',
    vendorId: 'all',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    outOfStock: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters.sortBy]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, filters.search, filters.status, filters.category, filters.vendorId]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy: filters.sortBy
      });
      
      const response = await fetch(`/api/admin/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setTotalPages(data.totalPages);
        setCategories(data.categories);
        setVendors(data.vendors);
        
        // Calculate stats
        const total = data.total;
        const active = data.products.filter((p: Product) => p.isActive && p.isApproved).length;
        const pending = data.products.filter((p: Product) => !p.isApproved).length;
        const outOfStock = data.products.filter((p: Product) => p.stock === 0).length;
        
        setStats({ total, active, pending, outOfStock });
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.shopId?.businessName.toLowerCase().includes(searchLower) ||
        product.vendorId?.firstName?.toLowerCase().includes(searchLower) ||
        product.vendorId?.lastName?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(p => p.isActive && p.isApproved);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(p => !p.isActive);
    } else if (filters.status === 'pending') {
      filtered = filtered.filter(p => !p.isApproved);
    } else if (filters.status === 'out_of_stock') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => 
        p.categoryPath?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Vendor filter
    if (filters.vendorId !== 'all') {
      filtered = filtered.filter(p => p.vendorId?._id === filters.vendorId);
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setDeletingId(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from local state
        setProducts(products.filter(product => product._id !== productId));
        setFilteredProducts(filteredProducts.filter(product => product._id !== productId));
        
        // Update stats
        const deletedProduct = products.find(p => p._id === productId);
        if (deletedProduct) {
          setStats(prev => ({
            total: prev.total - 1,
            active: deletedProduct.isActive && deletedProduct.isApproved ? prev.active - 1 : prev.active,
            pending: !deletedProduct.isApproved ? prev.pending - 1 : prev.pending,
            outOfStock: deletedProduct.stock === 0 ? prev.outOfStock - 1 : prev.outOfStock
          }));
        }
        
        alert('Product deleted successfully');
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`)) return;

    let successCount = 0;
    for (const productId of selectedProducts) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
      }
    }

    if (successCount > 0) {
      setProducts(products.filter(p => !selectedProducts.includes(p._id)));
      setFilteredProducts(filteredProducts.filter(p => !selectedProducts.includes(p._id)));
      setSelectedProducts([]);
      alert(`Successfully deleted ${successCount} product(s)`);
      fetchProducts(); // Refresh stats
    } else {
      alert('Failed to delete products');
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

  const getStatusBadge = (product: Product) => {
    if (!product.isApproved) {
      return { color: 'bg-yellow-500', text: 'Pending Approval', icon: Clock };
    }
    if (!product.isActive) {
      return { color: 'bg-gray-500', text: 'Inactive', icon: XCircle };
    }
    if (product.stock === 0) {
      return { color: 'bg-red-500', text: 'Out of Stock', icon: AlertCircle };
    }
    return { color: 'bg-green-500', text: 'Active', icon: CheckCircle };
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      vendorId: 'all',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.search !== '' || 
    filters.status !== 'all' || 
    filters.category !== 'all' || 
    filters.vendorId !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
                Products Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">View and manage all products across the marketplace</p>
            </div>
            <button
              onClick={() => fetchProducts()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Total Products</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.active}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Active Products</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pending}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Pending Approval</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{stats.outOfStock}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Out of Stock</p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, vendor, shop..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
              
              <div className="flex-1" />
              
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="stock_low">Stock: Low to High</option>
                <option value="stock_high">Stock: High to Low</option>
              </select>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Approval</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
                  <select
                    value={filters.vendorId}
                    onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Vendors</option>
                    {vendors.map(vendor => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName || `${vendor.firstName} ${vendor.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-indigo-50 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-900">
              {selectedProducts.length} product(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}

        {/* Products Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {hasActiveFilters ? 'Try adjusting your filters' : 'No products available in the marketplace'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(filteredProducts.map(p => p._id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor / Shop</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const status = getStatusBadge(product);
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product._id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images && product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <Link href={`/products/${product._id}`} target="_blank">
                                <h3 className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                              {product.categoryPath && (
                                <p className="text-xs text-gray-400 mt-0.5">{product.categoryPath}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {product.vendorId?.businessName || `${product.vendorId?.firstName || ''} ${product.vendorId?.lastName || ''}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Store className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{product.shopId?.businessName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <>
                                <br />
                                <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            product.stock > 10 ? 'text-green-600' :
                            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {product.stock}
                          </span>
                          {product.stock <= 5 && product.stock > 0 && (
                            <p className="text-xs text-yellow-600">Low stock</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.text}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(product.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/products/${product._id}`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={deletingId === product._id}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === product._id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}