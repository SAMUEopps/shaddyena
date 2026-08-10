// app/shd-pages/vendor/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/support/components/LoadingSpinner';
import MessageBanner from '../dashboard/components/MessageBanner';


interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerId: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryPhone: string;
  createdAt: string;
  rider?: {
    name: string;
    phone: string;
    vehicleType: string;
    rating: number;
  };
  deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/shd-api/api/vendors/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch orders' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching orders' });
    } finally {
      setLoading(false);
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

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Search by order number or customer name
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return order.orderNumber.toLowerCase().includes(search) ||
             order.customerId.name.toLowerCase().includes(search);
    }
    
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">📋 All Orders</h1>
            <p className="text-muted text-sm mt-1">
              {orders.length} total orders • {filteredOrders.length} shown
            </p>
          </div>
          <Link 
            href="/shd-pages/vendor/dashboard"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Messages */}
        {message && <MessageBanner type={message.type} text={message.text} />}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 border border-surface">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by order # or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-surface rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface hover:bg-surface/70 text-secondary'
                }`}
              >
                All
              </button>
              {['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === status 
                      ? 'bg-primary text-white' 
                      : 'bg-surface hover:bg-surface/70 text-secondary'
                  }`}
                >
                  {getStatusEmoji(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-secondary mb-2">No orders found</h3>
            <p className="text-muted">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search terms' 
                : 'When customers place orders, they will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link 
                key={order._id} 
                href={`/shd-pages/vendor/orders/${order._id}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-surface hover:border-primary/30 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.deliveryStatus && (
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
                          🚚 {order.deliveryStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                      <p className="text-muted">
                        👤 <span className="text-secondary font-medium">{order.customerId.name}</span>
                      </p>
                      <p className="text-muted">
                        📞 <span className="text-secondary font-medium">{order.deliveryPhone}</span>
                      </p>
                      <p className="text-muted sm:col-span-2">
                        📍 <span className="text-secondary font-medium">{order.deliveryAddress}</span>
                      </p>
                    </div>

                    {order.rider && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                        <span>🏍️</span>
                        <span>{order.rider.name}</span>
                        <span>•</span>
                        <span>⭐ {order.rider.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        KSh {order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-primary/30 group-hover:text-primary transition-colors">
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}