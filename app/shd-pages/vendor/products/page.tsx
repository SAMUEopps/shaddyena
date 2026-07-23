/*'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendor/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description
        })
      });

      if (response.ok) {
        alert('Product added successfully!');
        setShowForm(false);
        setFormData({ name: '', price: '', stock: '', description: '' });
        await fetchProducts();
      }
    } catch (error) {
      alert('Failed to add product');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center py-8">Loading products...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price (KSh)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-2xl font-bold text-blue-600">KSh {product.price}</p>
            <p className="text-sm">Stock: {product.stock}</p>
            <p className="text-sm">
              Status: {product.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}*/

/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendors/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product added successfully!' });
        setShowForm(false);
        setFormData({ name: '', price: '', stock: '', description: '' });
        await fetchProducts();
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to add product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add product' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        await fetchProducts();
        setMessage({ type: 'success', text: 'Product status updated!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product status' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Header *
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary">
              📦 My Products
            </h1>
            <p className="text-muted mt-1">
              Manage your product inventory
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/vendor/dashboard"
              className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setMessage(null);
              }}
              className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              {showForm ? '✕ Cancel' : '➕ Add Product'}
            </button>
          </div>
        </div>

        {/* Messages *
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Add Product Form *
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-surface animate-in slide-in-from-top-2 duration-200">
            <h2 className="text-xl font-bold text-secondary mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Price (KSh)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Describe your product..."
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                >
                  ➕ Add Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', price: '', stock: '', description: '' });
                  }}
                  className="bg-surface hover:bg-surface/70 text-secondary px-6 py-2.5 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid *
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No products yet</h3>
            <p className="text-muted mb-6">Start adding products to your shop</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-surface hover:border-primary/20 group"
              >
                <div className="h-32 sm:h-36 bg-surface rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  📦
                </div>
                
                <h3 className="font-bold text-secondary truncate">
                  {product.name}
                </h3>
                
                <p className="text-muted text-sm line-clamp-2 h-10 mt-1">
                  {product.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary font-black text-xl">
                    KSh {product.price.toLocaleString()}
                  </span>
                  <span className={`text-sm font-medium ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {product.stock > 0 ? `📦 ${product.stock}` : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.isActive ? '✅ Active' : '⛔ Inactive'}
                  </span>
                  <button
                    onClick={() => toggleProductStatus(product._id, product.isActive)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      product.isActive 
                        ? 'text-red-500 hover:text-red-700' 
                        : 'text-green-500 hover:text-green-700'
                    }`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

// app/vendor/products/page.tsx
/*'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  description: string;
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    stock: '',
    description: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendors/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || ''
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
    setFormData({ name: '', price: '', stock: '', description: '' });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description
    };

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingProduct ? 'Product updated successfully!' : 'Product added successfully!' 
        });
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', stock: '', description: '' });
        await fetchProducts();
        
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save product' });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        await fetchProducts();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        await fetchProducts();
        setMessage({ type: 'success', text: 'Product status updated!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product status' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Header *
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary">
              📦 My Products
            </h1>
            <p className="text-muted mt-1">
              Manage your product inventory
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/vendor/dashboard"
              className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null);
                setFormData({ name: '', price: '', stock: '', description: '' });
                setMessage(null);
              }}
              className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              {showForm ? '✕ Cancel' : '➕ Add Product'}
            </button>
          </div>
        </div>

        {/* Messages *
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Add/Edit Product Form *
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-surface animate-in slide-in-from-top-2 duration-200">
            <h2 className="text-xl font-bold text-secondary mb-6">
              {editingProduct ? '✏️ Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Price (KSh)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Describe your product..."
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
                >
                  {editingProduct ? '💾 Update Product' : '➕ Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-surface hover:bg-surface/70 text-secondary px-6 py-2.5 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid *
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No products yet</h3>
            <p className="text-muted mb-6">Start adding products to your shop</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-surface hover:border-primary/20 group"
              >
                <div className="h-32 sm:h-36 bg-surface rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  📦
                </div>
                
                <h3 className="font-bold text-secondary truncate">
                  {product.name}
                </h3>
                
                <p className="text-muted text-sm line-clamp-2 h-10 mt-1">
                  {product.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary font-black text-xl">
                    KSh {product.price.toLocaleString()}
                  </span>
                  <span className={`text-sm font-medium ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {product.stock > 0 ? `📦 ${product.stock}` : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.isActive ? '✅ Active' : '⛔ Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-surface flex justify-between items-center">
                  <button
                    onClick={() => toggleProductStatus(product._id, product.isActive)}
                    className={`text-xs font-medium transition-colors duration-200 ${
                      product.isActive 
                        ? 'text-orange-500 hover:text-orange-700' 
                        : 'text-green-500 hover:text-green-700'
                    }`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <span className="text-xs text-muted">
                    Updated: {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}*/

// app/vendor/products/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  description: string;
  image?: File | null;
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendors/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      image: null,
    });
    setImagePreview(product.image || null);
    setShowForm(true);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
    setFormData({ name: '', price: '', stock: '', description: '', image: null });
    setImagePreview(null);
    setMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (productId?: string): Promise<{ imageUrl: string; imagePublicId: string } | null> => {
    if (!formData.image) return null;

    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', formData.image);
      if (productId) {
        formDataObj.append('productId', productId);
      }

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      return {
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (uploading) {
      setMessage({ type: 'error', text: 'Please wait for image upload to complete' });
      return;
    }

    try {
      let imageData = null;

      if (editingProduct && formData.image) {
        // Upload image for existing product
        imageData = await uploadImage(editingProduct._id);
        if (!imageData) {
          setMessage({ type: 'error', text: 'Failed to upload image' });
          return;
        }
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        ...(editingProduct && !formData.image && { image: editingProduct.image }),
        ...(editingProduct && !formData.image && { imagePublicId: editingProduct.imagePublicId }),
        ...(imageData && { image: imageData.imageUrl, imagePublicId: imageData.imagePublicId }),
      };

      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingProduct ? 'Product updated successfully!' : 'Product added successfully!' 
        });
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', stock: '', description: '', image: null });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await fetchProducts();
        
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save product' });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        await fetchProducts();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleRemoveImage = async (productId: string) => {
    if (!confirm('Remove product image?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ removeImage: true })
      });

      if (response.ok) {
        await fetchProducts();
        setMessage({ type: 'success', text: 'Image removed successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove image' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        await fetchProducts();
        setMessage({ type: 'success', text: 'Product status updated!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product status' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-secondary">
              📦 My Products
            </h1>
            <p className="text-muted mt-1">
              Manage your product inventory
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/vendor/dashboard"
              className="bg-surface hover:bg-surface/70 text-secondary px-5 py-2.5 rounded-xl transition-all duration-200 font-medium"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null);
                setFormData({ name: '', price: '', stock: '', description: '', image: null });
                setImagePreview(null);
                setMessage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              {showForm ? '✕ Cancel' : '➕ Add Product'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-surface animate-in slide-in-from-top-2 duration-200">
            <h2 className="text-xl font-bold text-secondary mb-6">
              {editingProduct ? '✏️ Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Price (KSh)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted resize-none"
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="flex-1 border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                  />
                  {editingProduct && editingProduct.image && !formData.image && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(editingProduct._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border-2 border-surface">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? '⏳ Uploading...' : (editingProduct ? '💾 Update Product' : '➕ Add Product')}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-surface hover:bg-surface/70 text-secondary px-6 py-2.5 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-secondary mb-2">No products yet</h3>
            <p className="text-muted mb-6">Start adding products to your shop</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-surface hover:border-primary/20 group"
              >
                <div className="h-32 sm:h-36 bg-surface rounded-xl overflow-hidden relative mb-4 group-hover:scale-105 transition-transform duration-300">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      📦
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-secondary truncate">
                  {product.name}
                </h3>
                
                <p className="text-muted text-sm line-clamp-2 h-10 mt-1">
                  {product.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary font-black text-xl">
                    KSh {product.price.toLocaleString()}
                  </span>
                  <span className={`text-sm font-medium ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {product.stock > 0 ? `📦 ${product.stock}` : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.isActive ? '✅ Active' : '⛔ Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-surface flex justify-between items-center">
                  <button
                    onClick={() => toggleProductStatus(product._id, product.isActive)}
                    className={`text-xs font-medium transition-colors duration-200 ${
                      product.isActive 
                        ? 'text-orange-500 hover:text-orange-700' 
                        : 'text-green-500 hover:text-green-700'
                    }`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <span className="text-xs text-muted">
                    Updated: {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}