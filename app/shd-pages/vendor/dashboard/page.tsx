/*'use client';

import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerId: {
    name: string;
  };
  products: any[];
  createdAt: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/vendors/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        await fetchOrders();
        alert('Order updated successfully');
      }
    } catch (error) {
      alert('Failed to update order');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h3>Total Orders</h3>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3>Revenue</h3>
          <p className="text-2xl font-bold">
            KSh {orders.reduce((sum, o) => sum + o.totalAmount, 0)}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3>Pending Orders</h3>
          <p className="text-2xl font-bold">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">Order #{order.orderNumber}</h3>
                <p>Customer: {order.customerId?.name || 'Unknown'}</p>
                <p>Amount: KSh {order.totalAmount}</p>
                <p>Status: <span className="font-semibold">{order.status}</span></p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button
                  onClick={() => alert('Print invoice functionality')}
                  className="block w-full bg-gray-500 text-white px-4 py-1 rounded text-sm"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}*/

/*'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerId: {
    name: string;
  };
  products: any[];
  createdAt: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/vendors/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        await fetchOrders();
        alert('Order updated successfully');
      }
    } catch (error) {
      alert('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      packed: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      pending: '⏳',
      processing: '⚙️',
      packed: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return emojis[status] || '📋';
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading dashboard...</p>
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
              🏪 Vendor Dashboard
            </h1>
            <p className="text-muted mt-1">
              Manage your orders and track your business performance
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/vendor/products"
              className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
            >
              📦 Manage Products
            </Link>
          </div>
        </div>

        {/* Stats Cards *
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Total Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">
                  {orders.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3.5 rounded-xl">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Revenue</p>
                <p className="text-3xl sm:text-4xl font-black text-primary mt-1">
                  KSh {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3.5 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Pending Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">
                  {pendingOrders}
                </p>
              </div>
              <div className="bg-yellow-100 p-3.5 rounded-xl">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Processing</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">
                  {processingOrders}
                </p>
              </div>
              <div className="bg-purple-100 p-3.5 rounded-xl">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List *
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary">
              Recent Orders
              <span className="text-base font-medium text-muted ml-2">
                ({orders.length} orders)
              </span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-secondary mb-2">No orders yet</h3>
              <p className="text-muted">When customers place orders, they will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 border border-surface"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-secondary">
                          Order #{order.orderNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        <p className="text-muted">
                          👤 Customer: <span className="text-secondary font-medium">{order.customerId?.name || 'Unknown'}</span>
                        </p>
                        <p className="text-muted">
                          💰 Amount: <span className="text-primary font-bold">KSh {order.totalAmount.toLocaleString()}</span>
                        </p>
                        <p className="text-muted">
                          📅 Date: <span className="text-secondary font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </p>
                        <p className="text-muted sm:col-span-2 lg:col-span-3">
                          📦 Products: <span className="text-secondary font-medium">{order.products.length} items</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary text-sm font-medium"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="processing">⚙️ Processing</option>
                        <option value="packed">📦 Packed</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                      <button
                        onClick={() => alert('Print invoice functionality')}
                        className="bg-surface hover:bg-surface/70 text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm whitespace-nowrap"
                      >
                        🖨️ Invoice
                      </button>
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

// app/vendor/dashboard/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerId: {
    name: string;
  };
  products: any[];
  createdAt: string;
}

interface VendorProfile {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
  payoutDetails: {
    mpesaNumber?: string;
    pochiNumber?: string;
    tillNumber?: string;
    paybillNumber?: string;
    paybillAccount?: string;
  };
  profileImage?: string;
  coverImage?: string;
  totalEarned: number;
  pendingPayout: number;
  createdAt: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    businessName: '',
    ownerName: '',
    phoneNumber: '',
    businessLocation: '',
    payoutMethod: 'MPESA' as 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL',
    payoutDetails: {
      mpesaNumber: '',
      pochiNumber: '',
      tillNumber: '',
      paybillNumber: '',
      paybillAccount: '',
    },
  });

  useEffect(() => {
    fetchOrders();
    fetchVendorProfile();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/shd-api/api/vendors/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchVendorProfile = async () => {
    try {
      const response = await fetch('/api/shd-api/api/vendors/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.vendor) {
        setVendor(data.vendor);
        setEditForm({
          businessName: data.vendor.businessName || '',
          ownerName: data.vendor.ownerName || '',
          phoneNumber: data.vendor.phoneNumber || '',
          businessLocation: data.vendor.businessLocation || '',
          payoutMethod: data.vendor.payoutMethod || 'MPESA',
          payoutDetails: {
            mpesaNumber: data.vendor.payoutDetails?.mpesaNumber || '',
            pochiNumber: data.vendor.payoutDetails?.pochiNumber || '',
            tillNumber: data.vendor.payoutDetails?.tillNumber || '',
            paybillNumber: data.vendor.payoutDetails?.paybillNumber || '',
            paybillAccount: data.vendor.payoutDetails?.paybillAccount || '',
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/shd-api/api/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        await fetchOrders();
        setMessage({ type: 'success', text: 'Order updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update order' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await fetch('/api/shd-api/api/vendors/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setVendor(data.vendor);
        setMessage({ type: 'success', text: `${type} image uploaded successfully!` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (type: 'profile' | 'cover') => {
    if (!confirm(`Remove ${type} image?`)) return;

    try {
      const response = await fetch(`/api/shd-api/api/vendors/upload?type=${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVendor(data.vendor);
        setMessage({ type: 'success', text: `${type} image removed successfully!` });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove image' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);

    try {
      const response = await fetch('/api/shd-api/api/vendors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setVendor(data.vendor);
        setShowEditModal(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      packed: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      pending: '⏳',
      processing: '⚙️',
      packed: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return emojis[status] || '📋';
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
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

        {/* Shop Header */}
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-surface">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/20 to-secondary/20">
            {vendor?.coverImage ? (
              <Image
                src={vendor.coverImage}
                alt="Shop cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🏪
              </div>
            )}
            
            {/* Cover Image Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <label className="cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white text-secondary px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium shadow-sm">
                {uploading ? '⏳ Uploading...' : '📸 Change Cover'}
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'cover');
                  }}
                  disabled={uploading}
                />
              </label>
              {vendor?.coverImage && (
                <button
                  onClick={() => handleRemoveImage('cover')}
                  className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 gap-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-surface shadow-md overflow-hidden flex-shrink-0">
                  {vendor?.profileImage ? (
                    <Image
                      src={vendor.profileImage}
                      alt="Shop profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🏪
                    </div>
                  )}
                </div>
                
                {/* Profile Image Controls */}
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <label className="cursor-pointer bg-primary hover:bg-accent-dark text-white p-2 rounded-full shadow-md transition-all duration-200 text-xs">
                    📷
                    <input
                      type="file"
                      ref={profileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'profile');
                      }}
                      disabled={uploading}
                    />
                  </label>
                  {vendor?.profileImage && (
                    <button
                      onClick={() => handleRemoveImage('profile')}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all duration-200 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Shop Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-secondary truncate">
                      {vendor?.businessName || 'My Shop'}
                    </h1>
                    <p className="text-muted text-sm">
                      📍 {vendor?.businessLocation || 'Location not set'}
                    </p>
                    <p className="text-muted text-sm">
                      👤 {vendor?.ownerName || 'Owner name not set'}
                    </p>
                    <p className="text-muted text-sm">
                      📞 {vendor?.phoneNumber || 'Phone not set'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-primary hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium whitespace-nowrap"
                  >
                    ✏️ Edit Shop Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Total Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">
                  {orders.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3.5 rounded-xl">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Revenue</p>
                <p className="text-3xl sm:text-4xl font-black text-primary mt-1">
                  KSh {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3.5 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Pending Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">
                  {pendingOrders}
                </p>
              </div>
              <div className="bg-yellow-100 p-3.5 rounded-xl">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Processing</p>
                <p className="text-3xl sm:text-4xl font-black text-secondary mt-1">
                  {processingOrders}
                </p>
              </div>
              <div className="bg-purple-100 p-3.5 rounded-xl">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary">
              Recent Orders
              <span className="text-base font-medium text-muted ml-2">
                ({orders.length} orders)
              </span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-secondary mb-2">No orders yet</h3>
              <p className="text-muted">When customers place orders, they will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 border border-surface"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-secondary">
                          Order #{order.orderNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        <p className="text-muted">
                          👤 Customer: <span className="text-secondary font-medium">{order.customerId?.name || 'Unknown'}</span>
                        </p>
                        <p className="text-muted">
                          💰 Amount: <span className="text-primary font-bold">KSh {order.totalAmount.toLocaleString()}</span>
                        </p>
                        <p className="text-muted">
                          📅 Date: <span className="text-secondary font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </p>
                        <p className="text-muted sm:col-span-2 lg:col-span-3">
                          📦 Products: <span className="text-secondary font-medium">{order.products.length} items</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary text-sm font-medium"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="processing">⚙️ Processing</option>
                        <option value="packed">📦 Packed</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                      <button
                        onClick={() => alert('Print invoice functionality coming soon')}
                        className="bg-surface hover:bg-surface/70 text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm whitespace-nowrap"
                      >
                        🖨️ Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Shop Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary">✏️ Edit Shop Details</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-muted hover:text-secondary transition-colors duration-200 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={editForm.ownerName}
                  onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Business Location
                </label>
                <input
                  type="text"
                  value={editForm.businessLocation}
                  onChange={(e) => setEditForm({ ...editForm, businessLocation: e.target.value })}
                  required
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                  placeholder="Enter business location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Payout Method
                </label>
                <select
                  value={editForm.payoutMethod}
                  onChange={(e) => setEditForm({ ...editForm, payoutMethod: e.target.value as any })}
                  className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary"
                >
                  <option value="MPESA">MPESA</option>
                  <option value="POCHI">POCHI</option>
                  <option value="TILL">TILL</option>
                  <option value="PAYBILL">PAYBILL</option>
                </select>
              </div>

              {/* Payout Details based on method */}
              {editForm.payoutMethod === 'MPESA' && (
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    MPESA Number
                  </label>
                  <input
                    type="text"
                    value={editForm.payoutDetails.mpesaNumber}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      payoutDetails: { ...editForm.payoutDetails, mpesaNumber: e.target.value }
                    })}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="Enter MPESA number"
                  />
                </div>
              )}

              {editForm.payoutMethod === 'POCHI' && (
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    POCHI Number
                  </label>
                  <input
                    type="text"
                    value={editForm.payoutDetails.pochiNumber}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      payoutDetails: { ...editForm.payoutDetails, pochiNumber: e.target.value }
                    })}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="Enter POCHI number"
                  />
                </div>
              )}

              {editForm.payoutMethod === 'TILL' && (
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Till Number
                  </label>
                  <input
                    type="text"
                    value={editForm.payoutDetails.tillNumber}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      payoutDetails: { ...editForm.payoutDetails, tillNumber: e.target.value }
                    })}
                    className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                    placeholder="Enter till number"
                  />
                </div>
              )}

              {editForm.payoutMethod === 'PAYBILL' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      Paybill Number
                    </label>
                    <input
                      type="text"
                      value={editForm.payoutDetails.paybillNumber}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        payoutDetails: { ...editForm.payoutDetails, paybillNumber: e.target.value }
                      })}
                      className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                      placeholder="Enter paybill number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={editForm.payoutDetails.paybillAccount}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        payoutDetails: { ...editForm.payoutDetails, paybillAccount: e.target.value }
                      })}
                      className="w-full border-2 border-surface bg-background rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary placeholder-muted"
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={editing}
                  className="flex-1 bg-primary hover:bg-accent-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editing ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-surface hover:bg-surface/70 text-secondary px-6 py-2.5 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}