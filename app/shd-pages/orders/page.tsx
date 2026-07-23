'use client';

import { useState, useEffect } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: string;
  trackingNumber?: string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
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

  const confirmDelivery = async (orderId: string) => {
    try {
      const response = await fetch('/api/orders/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId })
      });

      if (response.ok) {
        alert('Order confirmed! Vendor will be paid.');
        await fetchOrders();
      }
    } catch (error) {
      alert('Failed to confirm delivery');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100';
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                {order.products.map((product, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{product.name} x{product.quantity}</span>
                    <span>KSh {product.price * product.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Delivery: {order.deliveryAddress}</p>
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">KSh {order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {order.status === 'shipped' && (
                <button
                  onClick={() => confirmDelivery(order._id)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Confirm Delivery
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}