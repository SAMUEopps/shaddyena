// // 'use client';

// // import { useState, useEffect } from 'react';

// // interface Order {
// //   _id: string;
// //   orderNumber: string;
// //   totalAmount: number;
// //   status: string;
// //   products: Array<{
// //     name: string;
// //     quantity: number;
// //     price: number;
// //   }>;
// //   deliveryAddress: string;
// //   trackingNumber?: string;
// //   createdAt: string;
// // }

// // export default function Orders() {
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchOrders();
// //   }, []);

// //   const fetchOrders = async () => {
// //     try {
// //       const response = await fetch('/api/shd-api/api/orders', {
// //         headers: {
// //           'Authorization': `Bearer ${localStorage.getItem('token')}`
// //         }
// //       });
// //       const data = await response.json();
// //       setOrders(data.orders || []);
// //     } catch (error) {
// //       console.error('Failed to fetch orders:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const confirmDelivery = async (orderId: string) => {
// //     try {
// //       const response = await fetch('/api/shd-api/api/orders/confirm', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}`
// //         },
// //         body: JSON.stringify({ orderId })
// //       });

// //       if (response.ok) {
// //         alert('Order confirmed! Vendor will be paid.');
// //         await fetchOrders();
// //       }
// //     } catch (error) {
// //       alert('Failed to confirm delivery');
// //     }
// //   };

// //   const getStatusColor = (status: string) => {
// //     const colors = {
// //       pending: 'bg-yellow-100 text-yellow-800',
// //       processing: 'bg-blue-100 text-blue-800',
// //       packed: 'bg-purple-100 text-purple-800',
// //       shipped: 'bg-indigo-100 text-indigo-800',
// //       delivered: 'bg-green-100 text-green-800',
// //       cancelled: 'bg-red-100 text-red-800'
// //     };
// //     return colors[status as keyof typeof colors] || 'bg-gray-100';
// //   };

// //   if (loading) return <div className="text-center py-8">Loading orders...</div>;

// //   return (
// //     <div className="container mx-auto p-4">
// //       <h1 className="text-3xl font-bold mb-8">My Orders</h1>

// //       {orders.length === 0 ? (
// //         <div className="text-center py-8">
// //           <p className="text-gray-500">No orders yet</p>
// //         </div>
// //       ) : (
// //         <div className="space-y-6">
// //           {orders.map((order) => (
// //             <div key={order._id} className="border p-6 rounded-lg shadow">
// //               <div className="flex justify-between items-start mb-4">
// //                 <div>
// //                   <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
// //                   <p className="text-sm text-gray-500">
// //                     {new Date(order.createdAt).toLocaleDateString()}
// //                   </p>
// //                 </div>
// //                 <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
// //                   {order.status.toUpperCase()}
// //                 </span>
// //               </div>

// //               <div className="space-y-2">
// //                 {order.products.map((product, idx) => (
// //                   <div key={idx} className="flex justify-between">
// //                     <span>{product.name} x{product.quantity}</span>
// //                     <span>KSh {product.price * product.quantity}</span>
// //                   </div>
// //                 ))}
// //               </div>

// //               <div className="mt-4 pt-4 border-t">
// //                 <div className="flex justify-between items-center">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Delivery: {order.deliveryAddress}</p>
// //                     {order.trackingNumber && (
// //                       <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
// //                     )}
// //                   </div>
// //                   <div className="text-right">
// //                     <p className="text-2xl font-bold">KSh {order.totalAmount}</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {order.status === 'shipped' && (
// //                 <button
// //                   onClick={() => confirmDelivery(order._id)}
// //                   className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
// //                 >
// //                   Confirm Delivery
// //                 </button>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // C:\Users\USER\Desktop\Projects\shaddyena\app\shd-pages\orders\page.tsx
// 'use client';

// import { useState, useEffect } from 'react';

// interface Order {
//   _id: string;
//   orderNumber: string;
//   totalAmount: number;
//   status: string;
//   products: Array<{
//     name: string;
//     quantity: number;
//     price: number;
//   }>;
//   deliveryAddress: string;
//   trackingNumber?: string;
//   createdAt: string;
//   deliveryId?: string;
//   deliveryStatus?: string;
// }

// export default function Orders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [confirming, setConfirming] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch('/api/shd-api/api/orders', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setOrders(data.orders || []);
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelivery = async (orderId: string, deliveryId: string) => {
//     setConfirming(true);
//     try {
//       const response = await fetch('/api/shd-api/api/orders/confirm-delivery', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ deliveryId })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert(`✅ Delivery confirmed successfully!\n\nConfirmation Code: ${data.confirmationCode}\n\nPlease provide this code to your rider.`);
//         await fetchOrders();
//         setShowConfirmModal(false);
//         setSelectedOrder(null);
//       } else {
//         const error = await response.json();
//         alert(`❌ ${error.error || 'Failed to confirm delivery'}`);
//       }
//     } catch (error) {
//       alert('Failed to confirm delivery');
//     } finally {
//       setConfirming(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       processing: 'bg-blue-100 text-blue-800',
//       packed: 'bg-purple-100 text-purple-800',
//       shipped: 'bg-indigo-100 text-indigo-800',
//       delivered: 'bg-green-100 text-green-800',
//       awaiting_confirmation: 'bg-orange-100 text-orange-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getDeliveryStatusLabel = (status?: string) => {
//     if (!status) return 'Not assigned';
//     const labels: Record<string, string> = {
//       pending: 'Waiting for rider',
//       accepted: 'Rider accepted',
//       picked_up: 'Picked up',
//       in_transit: 'In transit',
//       delivered: 'Delivered - Awaiting your confirmation',
//       awaiting_confirmation: '⚠️ Confirm delivery',
//       completed: '✅ Completed'
//     };
//     return labels[status] || status;
//   };

//   if (loading) return <div className="text-center py-8">Loading orders...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-8">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-gray-500">No orders yet</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div key={order._id} className="border p-6 rounded-lg shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
//                   <p className="text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
//                   {order.status.toUpperCase()}
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 {order.products.map((product, idx) => (
//                   <div key={idx} className="flex justify-between">
//                     <span>{product.name} x{product.quantity}</span>
//                     <span>KSh {product.price * product.quantity}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-4 pt-4 border-t">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-gray-600">Delivery: {order.deliveryAddress}</p>
//                     {order.trackingNumber && (
//                       <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
//                     )}
//                     <p className="text-sm text-gray-600 mt-1">
//                       Delivery Status: {getDeliveryStatusLabel(order.deliveryStatus)}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold">KSh {order.totalAmount}</p>
//                   </div>
//                 </div>
//               </div>

//               {order.deliveryStatus === 'awaiting_confirmation' && order.deliveryId && (
//                 <button
//                   onClick={() => {
//                     setSelectedOrder(order);
//                     setShowConfirmModal(true);
//                   }}
//                   className="mt-4 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition font-semibold animate-pulse"
//                 >
//                   ⚠️ Confirm Delivery Receipt
//                 </button>
//               )}

//               {order.deliveryStatus === 'completed' && (
//                 <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
//                   <p className="text-green-700 font-semibold">✅ Delivery Completed</p>
//                   <p className="text-sm text-green-600">Thank you for confirming your delivery!</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Confirm Delivery Modal */}
//       {showConfirmModal && selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-5xl mb-4">📦</div>
//               <h3 className="text-xl font-bold text-gray-900">Confirm Delivery</h3>
//               <p className="text-sm text-gray-600 mt-2">
//                 Has your order from <span className="font-semibold">#{selectedOrder.orderNumber}</span> been delivered safely?
//               </p>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//               <p className="text-sm text-yellow-800">
//                 ⚠️ Once you confirm, you'll receive a confirmation code to give to your rider.
//                 This completes the delivery process.
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => confirmDelivery(selectedOrder._id, selectedOrder.deliveryId!)}
//                 disabled={confirming}
//                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
//                   confirming
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-green-600 text-white hover:bg-green-700'
//                 }`}
//               >
//                 {confirming ? 'Confirming...' : '✅ Yes, I received it'}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowConfirmModal(false);
//                   setSelectedOrder(null);
//                 }}
//                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// C:\Users\USER\Desktop\Projects\shaddyena\app\shd-pages\orders\page.tsx
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
  deliveryId?: string;
  deliveryStatus?: string;
  customerConfirmed?: boolean;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [codeExpiresAt, setCodeExpiresAt] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/shd-api/api/orders', {
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

  const confirmDelivery = async (orderId: string, deliveryId: string) => {
    setConfirming(true);
    try {
      const response = await fetch('/api/shd-api/api/orders/confirm-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ deliveryId })
      });

      if (response.ok) {
        const data = await response.json();
        // Show the confirmation code to the customer
        setConfirmationCode(data.confirmationCode);
        setCodeExpiresAt(data.expiresAt);
        setShowCodeModal(true);
        setShowConfirmModal(false);
        await fetchOrders();
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Failed to confirm delivery'}`);
      }
    } catch (error) {
      alert('Failed to confirm delivery');
    } finally {
      setConfirming(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      awaiting_confirmation: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryStatusLabel = (status?: string) => {
    if (!status) return 'Not assigned';
    const labels: Record<string, string> = {
      pending: 'Waiting for rider',
      accepted: 'Rider accepted',
      picked_up: 'Picked up',
      in_transit: 'In transit',
      delivered: '📦 Delivered - Confirm receipt to get code',
      awaiting_confirmation: '⚠️ Confirm your delivery',
      completed: '✅ Completed'
    };
    return labels[status] || status;
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
                    <p className="text-sm text-gray-600 mt-1">
                      Delivery Status: {getDeliveryStatusLabel(order.deliveryStatus)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">KSh {order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {order.deliveryStatus === 'awaiting_confirmation' && order.deliveryId && (
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowConfirmModal(true);
                  }}
                  className="mt-4 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition font-semibold animate-pulse"
                >
                  📦 Confirm Delivery Receipt
                </button>
              )}

              {order.deliveryStatus === 'completed' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 font-semibold">✅ Delivery Completed</p>
                  <p className="text-sm text-green-600">Thank you for confirming your delivery!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delivery Modal */}
      {showConfirmModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Delivery Receipt</h3>
              <p className="text-sm text-gray-600 mt-2">
                Has your order from <span className="font-semibold">#{selectedOrder.orderNumber}</span> been delivered safely?
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ By confirming, you'll receive a 6-digit code to share with your rider.
                <br />
                <span className="font-semibold">Only confirm if you have received your package.</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => confirmDelivery(selectedOrder._id, selectedOrder.deliveryId!)}
                disabled={confirming}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  confirming
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {confirming ? 'Confirming...' : '✅ Yes, I received it'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Confirmation Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-xl font-bold text-gray-900">Your Confirmation Code</h3>
              <p className="text-sm text-gray-600 mt-2">
                Share this code with your rider to complete the delivery.
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Your 6-digit code:</p>
                <p className="text-4xl font-bold text-green-700 tracking-widest font-mono">
                  {confirmationCode}
                </p>
                {codeExpiresAt && (
                  <p className="text-xs text-red-500 mt-2">
                    ⏰ Expires at: {new Date(codeExpiresAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ Please share this code with your rider. 
                <br />
                <span className="font-semibold">Do not share this code with anyone else.</span>
                <br />
                <span className="text-xs">This code expires in 15 minutes.</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Copy code to clipboard
                  navigator.clipboard.writeText(confirmationCode);
                  alert('✅ Code copied to clipboard!');
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                📋 Copy Code
              </button>
              <button
                onClick={() => {
                  setShowCodeModal(false);
                  setConfirmationCode('');
                  setSelectedOrder(null);
                  fetchOrders();
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}