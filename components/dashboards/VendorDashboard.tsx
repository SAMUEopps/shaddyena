"use client";
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

      {/* Products Listing */}
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
                    <span className="text-sm">Active</span>
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
}