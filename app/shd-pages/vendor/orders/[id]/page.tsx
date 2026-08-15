// // // // app/shd-pages/vendor/orders/[id]/page.tsx
// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { useParams, useRouter } from 'next/navigation';
// // // import Link from 'next/link';
// // // import LoadingSpinner from '@/app/support/components/LoadingSpinner';
// // // import MessageBanner from '../../dashboard/components/MessageBanner';


// // // interface OrderItem {
// // //   productId: string;
// // //   name: string;
// // //   quantity: number;
// // //   price: number;
// // // }

// // // interface Order {
// // //   _id: string;
// // //   orderNumber: string;
// // //   customerId: {
// // //     _id: string;
// // //     name: string;
// // //     phoneNumber: string;
// // //     email: string;
// // //   };
// // //   products: OrderItem[];
// // //   totalAmount: number;
// // //   status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
// // //   deliveryAddress: string;
// // //   deliveryPhone: string;
// // //   shippingMethod: string;
// // //   trackingNumber?: string;
// // //   transactionId?: string;
// // //   isPaid: boolean;
// // //   createdAt: string;
// // //   updatedAt: string;
// // //   rider?: {
// // //     _id: string;
// // //     name: string;
// // //     phone: string;
// // //     vehicleType: string;
// // //     rating: number;
// // //     totalDeliveries: number;
// // //   };
// // //   riderAssignedAt?: string;
// // //   pickedUpAt?: string;
// // //   deliveredAt?: string;
// // //   deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
// // //   platformCommission: number;
// // //   vendorAmount: number;
// // //   immediateWithdrawable: number;
// // //   pendingWithdrawable: number;
// // // }

// // // export default function OrderDetailsPage() {
// // //   const params = useParams();
// // //   const router = useRouter();
// // //   const orderId = params.id as string;
  
// // //   const [order, setOrder] = useState<Order | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

// // //   useEffect(() => {
// // //     fetchOrderDetails();
// // //   }, [orderId]);

// // //   const fetchOrderDetails = async () => {
// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       if (!token) {
// // //         router.push('/login');
// // //         return;
// // //       }

// // //       const response = await fetch(`/api/shd-api/api/vendors/orders/${orderId}`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         setOrder(data.order);
// // //       } else if (response.status === 404) {
// // //         setMessage({ type: 'error', text: 'Order not found' });
// // //       } else {
// // //         setMessage({ type: 'error', text: 'Failed to fetch order details' });
// // //       }
// // //     } catch (error) {
// // //       setMessage({ type: 'error', text: 'Error fetching order' });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const updateOrderStatus = async (status: string) => {
// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       const response = await fetch('/api/shd-api/api/orders/status', {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`
// // //         },
// // //         body: JSON.stringify({ orderId, status })
// // //       });

// // //       if (response.ok) {
// // //         setOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
// // //         setMessage({ type: 'success', text: 'Order status updated!' });
// // //       } else {
// // //         const data = await response.json();
// // //         setMessage({ type: 'error', text: data.error || 'Failed to update status' });
// // //       }
// // //     } catch (error) {
// // //       setMessage({ type: 'error', text: 'Error updating status' });
// // //     }
// // //   };

// // //   const getStatusColor = (status: string) => {
// // //     const colors: Record<string, string> = {
// // //       pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
// // //       processing: 'bg-blue-100 text-blue-700 border-blue-200',
// // //       packed: 'bg-purple-100 text-purple-700 border-purple-200',
// // //       shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
// // //       delivered: 'bg-green-100 text-green-700 border-green-200',
// // //       cancelled: 'bg-red-100 text-red-700 border-red-200'
// // //     };
// // //     return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
// // //   };

// // //   const getStatusEmoji = (status: string) => {
// // //     const emojis: Record<string, string> = {
// // //       pending: '⏳',
// // //       processing: '⚙️',
// // //       packed: '📦',
// // //       shipped: '🚚',
// // //       delivered: '✅',
// // //       cancelled: '❌'
// // //     };
// // //     return emojis[status] || '📋';
// // //   };

// // //   if (loading) {
// // //     return <LoadingSpinner message="Loading order details..." />;
// // //   }

// // //   if (!order) {
// // //     return (
// // //       <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
// // //         <div className="max-w-7xl mx-auto">
// // //           <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
// // //             <div className="text-6xl mb-4">🔍</div>
// // //             <h3 className="text-xl font-bold text-secondary mb-2">Order not found</h3>
// // //             <p className="text-muted mb-4">The order you're looking for doesn't exist or has been removed</p>
// // //             <Link 
// // //               href="/shd-pages/vendor/orders"
// // //               className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-block"
// // //             >
// // //               ← Back to Orders
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
// // //       <div className="max-w-7xl mx-auto">
// // //         {/* Header */}
// // //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
// // //           <div>
// // //             <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
// // //               Order #{order.orderNumber}
// // //             </h1>
// // //             <p className="text-muted text-sm mt-1">
// // //               Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
// // //                 weekday: 'long',
// // //                 year: 'numeric',
// // //                 month: 'long',
// // //                 day: 'numeric',
// // //                 hour: '2-digit',
// // //                 minute: '2-digit'
// // //               })}
// // //             </p>
// // //           </div>
// // //           <Link 
// // //             href="/shd-pages/vendor/orders"
// // //             className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
// // //           >
// // //             ← Back to Orders
// // //           </Link>
// // //         </div>

// // //         {/* Messages */}
// // //         {message && <MessageBanner type={message.type} text={message.text} />}

// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //           {/* Main Content */}
// // //           <div className="lg:col-span-2 space-y-6">
// // //             {/* Status Card */}
// // //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //               <div className="flex flex-wrap items-center justify-between gap-4">
// // //                 <div>
// // //                   <p className="text-sm text-muted font-medium">Order Status</p>
// // //                   <div className="flex items-center gap-3 mt-1">
// // //                     <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
// // //                       {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
// // //                     </span>
// // //                     {order.deliveryStatus && (
// // //                       <span className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-200">
// // //                         🚚 {order.deliveryStatus.replace('_', ' ').toUpperCase()}
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //                 <div className="flex gap-2 flex-wrap">
// // //                   {['processing', 'packed', 'shipped', 'delivered'].map((status) => (
// // //                     <button
// // //                       key={status}
// // //                       onClick={() => updateOrderStatus(status)}
// // //                       disabled={order.status === status}
// // //                       className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
// // //                         order.status === status
// // //                           ? 'bg-primary text-white cursor-default'
// // //                           : 'bg-surface hover:bg-surface/70 text-secondary hover:text-secondary'
// // //                       }`}
// // //                     >
// // //                       {getStatusEmoji(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Customer Information */}
// // //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //               <h3 className="text-lg font-bold text-secondary mb-4">👤 Customer Information</h3>
// // //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// // //                 <div>
// // //                   <p className="text-xs text-muted font-medium">Name</p>
// // //                   <p className="text-secondary font-medium">{order.customerId.name}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-xs text-muted font-medium">Phone</p>
// // //                   <p className="text-secondary font-medium">{order.customerId.phoneNumber}</p>
// // //                 </div>
// // //                 <div className="sm:col-span-2">
// // //                   <p className="text-xs text-muted font-medium">Email</p>
// // //                   <p className="text-secondary font-medium">{order.customerId.email}</p>
// // //                 </div>
// // //                 <div className="sm:col-span-2">
// // //                   <p className="text-xs text-muted font-medium">Delivery Address</p>
// // //                   <p className="text-secondary font-medium">{order.deliveryAddress}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-xs text-muted font-medium">Delivery Phone</p>
// // //                   <p className="text-secondary font-medium">{order.deliveryPhone}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-xs text-muted font-medium">Shipping Method</p>
// // //                   <p className="text-secondary font-medium">{order.shippingMethod || 'Standard'}</p>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Items */}
// // //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //               <h3 className="text-lg font-bold text-secondary mb-4">📦 Order Items</h3>
// // //               <div className="overflow-x-auto">
// // //                 <table className="w-full">
// // //                   <thead>
// // //                     <tr className="border-b border-surface">
// // //                       <th className="text-left py-2 text-xs font-medium text-muted">Item</th>
// // //                       <th className="text-right py-2 text-xs font-medium text-muted">Qty</th>
// // //                       <th className="text-right py-2 text-xs font-medium text-muted">Price</th>
// // //                       <th className="text-right py-2 text-xs font-medium text-muted">Total</th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {order.products.map((item, index) => (
// // //                       <tr key={index} className="border-b border-surface/50 last:border-0">
// // //                         <td className="py-3 text-secondary font-medium">{item.name}</td>
// // //                         <td className="py-3 text-right text-secondary">{item.quantity}</td>
// // //                         <td className="py-3 text-right text-secondary">KSh {item.price.toLocaleString()}</td>
// // //                         <td className="py-3 text-right text-secondary font-bold">
// // //                           KSh {(item.quantity * item.price).toLocaleString()}
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                   <tfoot>
// // //                     <tr>
// // //                       <td colSpan={3} className="pt-4 text-right font-bold text-secondary">Subtotal</td>
// // //                       <td className="pt-4 text-right font-bold text-secondary">
// // //                         KSh {order.totalAmount.toLocaleString()}
// // //                       </td>
// // //                     </tr>
// // //                     {order.platformCommission > 0 && (
// // //                       <tr>
// // //                         <td colSpan={3} className="text-right text-sm text-muted">Platform Commission (3%)</td>
// // //                         <td className="text-right text-sm text-muted">
// // //                           -KSh {order.platformCommission.toLocaleString()}
// // //                         </td>
// // //                       </tr>
// // //                     )}
// // //                     <tr className="border-t-2 border-secondary/20">
// // //                       <td colSpan={3} className="pt-2 text-right text-lg font-bold text-primary">Total</td>
// // //                       <td className="pt-2 text-right text-lg font-bold text-primary">
// // //                         KSh {order.totalAmount.toLocaleString()}
// // //                       </td>
// // //                     </tr>
// // //                   </tfoot>
// // //                 </table>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Sidebar */}
// // //           <div className="space-y-6">
// // //             {/* Payment Info */}
// // //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //               <h3 className="text-lg font-bold text-secondary mb-4">💳 Payment</h3>
// // //               <div className="space-y-3">
// // //                 <div className="flex justify-between">
// // //                   <span className="text-muted">Status</span>
// // //                   <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
// // //                     {order.isPaid ? '✅ Paid' : '⏳ Pending'}
// // //                   </span>
// // //                 </div>
// // //                 {order.transactionId && (
// // //                   <div className="flex justify-between">
// // //                     <span className="text-muted">Transaction ID</span>
// // //                     <span className="font-medium text-secondary text-sm">{order.transactionId}</span>
// // //                   </div>
// // //                 )}
// // //                 <div className="flex justify-between">
// // //                   <span className="text-muted">Total Amount</span>
// // //                   <span className="font-bold text-primary">KSh {order.totalAmount.toLocaleString()}</span>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Vendor Earnings */}
// // //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //               <h3 className="text-lg font-bold text-secondary mb-4">💰 Your Earnings</h3>
// // //               <div className="space-y-3">
// // //                 <div className="flex justify-between">
// // //                   <span className="text-muted">Vendor Amount (97%)</span>
// // //                   <span className="font-medium text-secondary">KSh {order.vendorAmount.toLocaleString()}</span>
// // //                 </div>
// // //                 <div className="flex justify-between text-sm">
// // //                   <span className="text-muted">Immediate Withdrawable (80%)</span>
// // //                   <span className="font-medium text-green-600">KSh {order.immediateWithdrawable.toLocaleString()}</span>
// // //                 </div>
// // //                 <div className="flex justify-between text-sm">
// // //                   <span className="text-muted">Pending Release (20%)</span>
// // //                   <span className="font-medium text-amber-600">KSh {order.pendingWithdrawable.toLocaleString()}</span>
// // //                 </div>
// // //                 {order.platformCommission > 0 && (
// // //                   <div className="flex justify-between text-sm text-muted">
// // //                     <span>Platform Commission</span>
// // //                     <span>-KSh {order.platformCommission.toLocaleString()}</span>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {/* Delivery Info */}
// // //             {order.rider && (
// // //               <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //                 <h3 className="text-lg font-bold text-secondary mb-4">🏍️ Delivery</h3>
// // //                 <div className="space-y-3">
// // //                   <div>
// // //                     <p className="text-xs text-muted font-medium">Rider</p>
// // //                     <p className="text-secondary font-medium">{order.rider.name}</p>
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-xs text-muted font-medium">Phone</p>
// // //                     <p className="text-secondary">{order.rider.phone}</p>
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-xs text-muted font-medium">Vehicle</p>
// // //                     <p className="text-secondary">{order.rider.vehicleType}</p>
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-xs text-muted font-medium">Rating</p>
// // //                     <p className="text-secondary">⭐ {order.rider.rating} ({order.rider.totalDeliveries} deliveries)</p>
// // //                   </div>
// // //                   {order.riderAssignedAt && (
// // //                     <div>
// // //                       <p className="text-xs text-muted font-medium">Assigned At</p>
// // //                       <p className="text-secondary text-sm">
// // //                         {new Date(order.riderAssignedAt).toLocaleString()}
// // //                       </p>
// // //                     </div>
// // //                   )}
// // //                   {order.deliveredAt && (
// // //                     <div>
// // //                       <p className="text-xs text-muted font-medium">Delivered At</p>
// // //                       <p className="text-secondary text-sm">
// // //                         {new Date(order.deliveredAt).toLocaleString()}
// // //                       </p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Action Buttons */}
// // //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// // //               <button
// // //                 onClick={() => {
// // //                   // Print functionality
// // //                   window.print();
// // //                 }}
// // //                 className="w-full bg-surface hover:bg-surface/70 text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
// // //               >
// // //                 🖨️ Print Order
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // app/shd-pages/vendor/orders/[id]/page.tsx
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useParams, useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import LoadingSpinner from '@/app/support/components/LoadingSpinner';
// // import MessageBanner from '../../dashboard/components/MessageBanner';

// // interface OrderItem {
// //   productId: string;
// //   name: string;
// //   quantity: number;
// //   price: number;
// // }

// // interface Order {
// //   _id: string;
// //   orderNumber: string;
// //   customerId: {
// //     _id: string;
// //     name: string;
// //     phoneNumber: string;
// //     email: string;
// //   };
// //   products: OrderItem[];
// //   totalAmount: number;
// //   status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
// //   deliveryAddress: string;
// //   deliveryPhone: string;
// //   shippingMethod: string;
// //   trackingNumber?: string;
// //   transactionId?: string;
// //   isPaid: boolean;
// //   createdAt: string;
// //   updatedAt: string;
// //   rider?: {
// //     _id: string;
// //     name: string;
// //     phone: string;
// //     vehicleType: string;
// //     rating: number;
// //     totalDeliveries: number;
// //   };
// //   riderAssignedAt?: string;
// //   pickedUpAt?: string;
// //   deliveredAt?: string;
// //   deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
// //   platformCommission: number;
// //   vendorAmount: number;
// //   immediateWithdrawable: number;
// //   pendingWithdrawable: number;
// // }

// // // Helper function for safe number formatting
// // const formatCurrency = (value: number | undefined | null): string => {
// //   if (value === undefined || value === null || isNaN(value)) {
// //     return 'KSh 0';
// //   }
// //   return `KSh ${value.toLocaleString()}`;
// // };

// // const formatDate = (dateString: string | undefined | null): string => {
// //   if (!dateString) return 'N/A';
// //   try {
// //     return new Date(dateString).toLocaleString();
// //   } catch {
// //     return 'Invalid date';
// //   }
// // };

// // const formatDateLong = (dateString: string | undefined | null): string => {
// //   if (!dateString) return 'N/A';
// //   try {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       weekday: 'long',
// //       year: 'numeric',
// //       month: 'long',
// //       day: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   } catch {
// //     return 'Invalid date';
// //   }
// // };

// // export default function OrderDetailsPage() {
// //   const params = useParams();
// //   const router = useRouter();
// //   const orderId = params.id as string;
  
// //   const [order, setOrder] = useState<Order | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

// //   useEffect(() => {
// //     fetchOrderDetails();
// //   }, [orderId]);

// //   const fetchOrderDetails = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         router.push('/login');
// //         return;
// //       }

// //       const response = await fetch(`/api/shd-api/api/vendors/orders/${orderId}`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         setOrder(data.order);
// //       } else if (response.status === 404) {
// //         setMessage({ type: 'error', text: 'Order not found' });
// //       } else {
// //         setMessage({ type: 'error', text: 'Failed to fetch order details' });
// //       }
// //     } catch (error) {
// //       setMessage({ type: 'error', text: 'Error fetching order' });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const updateOrderStatus = async (status: string) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch('/api/shd-api/api/orders/status', {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({ orderId, status })
// //       });

// //       if (response.ok) {
// //         setOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
// //         setMessage({ type: 'success', text: 'Order status updated!' });
// //       } else {
// //         const data = await response.json();
// //         setMessage({ type: 'error', text: data.error || 'Failed to update status' });
// //       }
// //     } catch (error) {
// //       setMessage({ type: 'error', text: 'Error updating status' });
// //     }
// //   };

// //   const getStatusColor = (status: string) => {
// //     const colors: Record<string, string> = {
// //       pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
// //       processing: 'bg-blue-100 text-blue-700 border-blue-200',
// //       packed: 'bg-purple-100 text-purple-700 border-purple-200',
// //       shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
// //       delivered: 'bg-green-100 text-green-700 border-green-200',
// //       cancelled: 'bg-red-100 text-red-700 border-red-200'
// //     };
// //     return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
// //   };

// //   const getStatusEmoji = (status: string) => {
// //     const emojis: Record<string, string> = {
// //       pending: '⏳',
// //       processing: '⚙️',
// //       packed: '📦',
// //       shipped: '🚚',
// //       delivered: '✅',
// //       cancelled: '❌'
// //     };
// //     return emojis[status] || '📋';
// //   };

// //   if (loading) {
// //     return <LoadingSpinner message="Loading order details..." />;
// //   }

// //   if (!order) {
// //     return (
// //       <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
// //             <div className="text-6xl mb-4">🔍</div>
// //             <h3 className="text-xl font-bold text-secondary mb-2">Order not found</h3>
// //             <p className="text-muted mb-4">The order you're looking for doesn't exist or has been removed</p>
// //             <Link 
// //               href="/shd-pages/vendor/orders"
// //               className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-block"
// //             >
// //               ← Back to Orders
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Safely access nested properties with fallbacks
// //   const customerName = order.customerId?.name || 'Unknown Customer';
// //   const customerPhone = order.customerId?.phoneNumber || 'N/A';
// //   const customerEmail = order.customerId?.email || 'N/A';
// //   const riderName = order.rider?.name || 'Not assigned';
// //   const riderPhone = order.rider?.phone || 'N/A';
// //   const riderVehicle = order.rider?.vehicleType || 'N/A';
// //   const riderRating = order.rider?.rating || 0;
// //   const riderDeliveries = order.rider?.totalDeliveries || 0;

// //   return (
// //     <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
// //           <div>
// //             <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
// //               Order #{order.orderNumber || 'N/A'}
// //             </h1>
// //             <p className="text-muted text-sm mt-1">
// //               Placed on {formatDateLong(order.createdAt)}
// //             </p>
// //           </div>
// //           <Link 
// //             href="/shd-pages/vendor/orders"
// //             className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
// //           >
// //             ← Back to Orders
// //           </Link>
// //         </div>

// //         {/* Messages */}
// //         {message && <MessageBanner type={message.type} text={message.text} />}

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Main Content */}
// //           <div className="lg:col-span-2 space-y-6">
// //             {/* Status Card */}
// //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //               <div className="flex flex-wrap items-center justify-between gap-4">
// //                 <div>
// //                   <p className="text-sm text-muted font-medium">Order Status</p>
// //                   <div className="flex items-center gap-3 mt-1">
// //                     <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status || 'pending')}`}>
// //                       {getStatusEmoji(order.status || 'pending')} {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
// //                     </span>
// //                     {order.deliveryStatus && (
// //                       <span className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-200">
// //                         🚚 {order.deliveryStatus.replace('_', ' ').toUpperCase()}
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {['processing', 'packed', 'shipped', 'delivered'].map((status) => (
// //                     <button
// //                       key={status}
// //                       onClick={() => updateOrderStatus(status)}
// //                       disabled={order.status === status}
// //                       className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
// //                         order.status === status
// //                           ? 'bg-primary text-white cursor-default'
// //                           : 'bg-surface hover:bg-surface/70 text-secondary hover:text-secondary'
// //                       }`}
// //                     >
// //                       {getStatusEmoji(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Customer Information */}
// //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //               <h3 className="text-lg font-bold text-secondary mb-4">👤 Customer Information</h3>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                 <div>
// //                   <p className="text-xs text-muted font-medium">Name</p>
// //                   <p className="text-secondary font-medium">{customerName}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-muted font-medium">Phone</p>
// //                   <p className="text-secondary font-medium">{customerPhone}</p>
// //                 </div>
// //                 <div className="sm:col-span-2">
// //                   <p className="text-xs text-muted font-medium">Email</p>
// //                   <p className="text-secondary font-medium">{customerEmail}</p>
// //                 </div>
// //                 <div className="sm:col-span-2">
// //                   <p className="text-xs text-muted font-medium">Delivery Address</p>
// //                   <p className="text-secondary font-medium">{order.deliveryAddress || 'N/A'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-muted font-medium">Delivery Phone</p>
// //                   <p className="text-secondary font-medium">{order.deliveryPhone || 'N/A'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-muted font-medium">Shipping Method</p>
// //                   <p className="text-secondary font-medium">{order.shippingMethod || 'Standard'}</p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Items */}
// //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //               <h3 className="text-lg font-bold text-secondary mb-4">📦 Order Items</h3>
// //               <div className="overflow-x-auto">
// //                 <table className="w-full">
// //                   <thead>
// //                     <tr className="border-b border-surface">
// //                       <th className="text-left py-2 text-xs font-medium text-muted">Item</th>
// //                       <th className="text-right py-2 text-xs font-medium text-muted">Qty</th>
// //                       <th className="text-right py-2 text-xs font-medium text-muted">Price</th>
// //                       <th className="text-right py-2 text-xs font-medium text-muted">Total</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {(order.products || []).map((item, index) => (
// //                       <tr key={index} className="border-b border-surface/50 last:border-0">
// //                         <td className="py-3 text-secondary font-medium">{item.name || 'Unnamed item'}</td>
// //                         <td className="py-3 text-right text-secondary">{item.quantity || 0}</td>
// //                         <td className="py-3 text-right text-secondary">{formatCurrency(item.price)}</td>
// //                         <td className="py-3 text-right text-secondary font-bold">
// //                           {formatCurrency((item.quantity || 0) * (item.price || 0))}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                   <tfoot>
// //                     <tr>
// //                       <td colSpan={3} className="pt-4 text-right font-bold text-secondary">Subtotal</td>
// //                       <td className="pt-4 text-right font-bold text-secondary">
// //                         {formatCurrency(order.totalAmount)}
// //                       </td>
// //                     </tr>
// //                     {(order.platformCommission || 0) > 0 && (
// //                       <tr>
// //                         <td colSpan={3} className="text-right text-sm text-muted">Platform Commission (3%)</td>
// //                         <td className="text-right text-sm text-muted">
// //                           -{formatCurrency(order.platformCommission)}
// //                         </td>
// //                       </tr>
// //                     )}
// //                     <tr className="border-t-2 border-secondary/20">
// //                       <td colSpan={3} className="pt-2 text-right text-lg font-bold text-primary">Total</td>
// //                       <td className="pt-2 text-right text-lg font-bold text-primary">
// //                         {formatCurrency(order.totalAmount)}
// //                       </td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Sidebar */}
// //           <div className="space-y-6">
// //             {/* Payment Info */}
// //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //               <h3 className="text-lg font-bold text-secondary mb-4">💳 Payment</h3>
// //               <div className="space-y-3">
// //                 <div className="flex justify-between">
// //                   <span className="text-muted">Status</span>
// //                   <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
// //                     {order.isPaid ? '✅ Paid' : '⏳ Pending'}
// //                   </span>
// //                 </div>
// //                 {order.transactionId && (
// //                   <div className="flex justify-between">
// //                     <span className="text-muted">Transaction ID</span>
// //                     <span className="font-medium text-secondary text-sm">{order.transactionId}</span>
// //                   </div>
// //                 )}
// //                 <div className="flex justify-between">
// //                   <span className="text-muted">Total Amount</span>
// //                   <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Vendor Earnings */}
// //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //               <h3 className="text-lg font-bold text-secondary mb-4">💰 Your Earnings</h3>
// //               <div className="space-y-3">
// //                 <div className="flex justify-between">
// //                   <span className="text-muted">Vendor Amount (97%)</span>
// //                   <span className="font-medium text-secondary">{formatCurrency(order.vendorAmount)}</span>
// //                 </div>
// //                 <div className="flex justify-between text-sm">
// //                   <span className="text-muted">Immediate Withdrawable (80%)</span>
// //                   <span className="font-medium text-green-600">{formatCurrency(order.immediateWithdrawable)}</span>
// //                 </div>
// //                 <div className="flex justify-between text-sm">
// //                   <span className="text-muted">Pending Release (20%)</span>
// //                   <span className="font-medium text-amber-600">{formatCurrency(order.pendingWithdrawable)}</span>
// //                 </div>
// //                 {(order.platformCommission || 0) > 0 && (
// //                   <div className="flex justify-between text-sm text-muted">
// //                     <span>Platform Commission</span>
// //                     <span>-{formatCurrency(order.platformCommission)}</span>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Delivery Info */}
// //             {order.rider && (
// //               <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //                 <h3 className="text-lg font-bold text-secondary mb-4">🏍️ Delivery</h3>
// //                 <div className="space-y-3">
// //                   <div>
// //                     <p className="text-xs text-muted font-medium">Rider</p>
// //                     <p className="text-secondary font-medium">{riderName}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-muted font-medium">Phone</p>
// //                     <p className="text-secondary">{riderPhone}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-muted font-medium">Vehicle</p>
// //                     <p className="text-secondary">{riderVehicle}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-xs text-muted font-medium">Rating</p>
// //                     <p className="text-secondary">⭐ {riderRating} ({riderDeliveries} deliveries)</p>
// //                   </div>
// //                   {order.riderAssignedAt && (
// //                     <div>
// //                       <p className="text-xs text-muted font-medium">Assigned At</p>
// //                       <p className="text-secondary text-sm">{formatDate(order.riderAssignedAt)}</p>
// //                     </div>
// //                   )}
// //                   {order.deliveredAt && (
// //                     <div>
// //                       <p className="text-xs text-muted font-medium">Delivered At</p>
// //                       <p className="text-secondary text-sm">{formatDate(order.deliveredAt)}</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Action Buttons */}
// //             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
// //               <button
// //                 onClick={() => {
// //                   window.print();
// //                 }}
// //                 className="w-full bg-surface hover:bg-surface/70 text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
// //               >
// //                 🖨️ Print Order
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// // app/shd-pages/vendor/orders/[id]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import LoadingSpinner from '@/app/support/components/LoadingSpinner';
// import MessageBanner from '../../dashboard/components/MessageBanner';

// interface OrderItem {
//   productId: string;
//   name: string;
//   quantity: number;
//   price: number;
//   image?: string; // Add image field
// }

// interface Order {
//   _id: string;
//   orderNumber: string;
//   customerId: {
//     _id: string;
//     name: string;
//     phoneNumber: string;
//     email: string;
//   };
//   products: OrderItem[];
//   totalAmount: number;
//   status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
//   deliveryAddress: string;
//   deliveryPhone: string;
//   shippingMethod: string;
//   trackingNumber?: string;
//   transactionId?: string;
//   isPaid: boolean;
//   createdAt: string;
//   updatedAt: string;
//   rider?: {
//     _id: string;
//     name: string;
//     phone: string;
//     vehicleType: string;
//     rating: number;
//     totalDeliveries: number;
//   };
//   riderAssignedAt?: string;
//   pickedUpAt?: string;
//   deliveredAt?: string;
//   deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
//   platformCommission: number;
//   vendorAmount: number;
//   immediateWithdrawable: number;
//   pendingWithdrawable: number;
// }

// // Helper function for safe number formatting
// const formatCurrency = (value: number | undefined | null): string => {
//   if (value === undefined || value === null || isNaN(value)) {
//     return 'KSh 0';
//   }
//   return `KSh ${value.toLocaleString()}`;
// };

// const formatDate = (dateString: string | undefined | null): string => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch {
//     return 'Invalid date';
//   }
// };

// const formatDateLong = (dateString: string | undefined | null): string => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } catch {
//     return 'Invalid date';
//   }
// };

// export default function OrderDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const orderId = params.id as string;
  
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   useEffect(() => {
//     fetchOrderDetails();
//   }, [orderId]);

//   const fetchOrderDetails = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const response = await fetch(`/api/shd-api/api/vendors/orders/${orderId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setOrder(data.order);
//       } else if (response.status === 404) {
//         setMessage({ type: 'error', text: 'Order not found' });
//       } else {
//         setMessage({ type: 'error', text: 'Failed to fetch order details' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error fetching order' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (status: string) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/orders/status', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ orderId, status })
//       });

//       if (response.ok) {
//         setOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
//         setMessage({ type: 'success', text: 'Order status updated!' });
//       } else {
//         const data = await response.json();
//         setMessage({ type: 'error', text: data.error || 'Failed to update status' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error updating status' });
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       processing: 'bg-blue-100 text-blue-700 border-blue-200',
//       packed: 'bg-purple-100 text-purple-700 border-purple-200',
//       shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
//       delivered: 'bg-green-100 text-green-700 border-green-200',
//       cancelled: 'bg-red-100 text-red-700 border-red-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
//   };

//   const getStatusEmoji = (status: string) => {
//     const emojis: Record<string, string> = {
//       pending: '⏳',
//       processing: '⚙️',
//       packed: '📦',
//       shipped: '🚚',
//       delivered: '✅',
//       cancelled: '❌'
//     };
//     return emojis[status] || '📋';
//   };

//   if (loading) {
//     return <LoadingSpinner message="Loading order details..." />;
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-xl font-bold text-secondary mb-2">Order not found</h3>
//             <p className="text-muted mb-4">The order you're looking for doesn't exist or has been removed</p>
//             <Link 
//               href="/shd-pages/vendor/orders"
//               className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-block"
//             >
//               ← Back to Orders
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Safely access nested properties with fallbacks
//   const customerName = order.customerId?.name || 'Unknown Customer';
//   const customerPhone = order.customerId?.phoneNumber || 'N/A';
//   const customerEmail = order.customerId?.email || 'N/A';
//   const riderName = order.rider?.name || 'Not assigned';
//   const riderPhone = order.rider?.phone || 'N/A';
//   const riderVehicle = order.rider?.vehicleType || 'N/A';
//   const riderRating = order.rider?.rating || 0;
//   const riderDeliveries = order.rider?.totalDeliveries || 0;

//   return (
//     <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
//               Order #{order.orderNumber || 'N/A'}
//             </h1>
//             <p className="text-muted text-sm mt-1">
//               Placed on {formatDateLong(order.createdAt)}
//             </p>
//           </div>
//           <Link 
//             href="/shd-pages/vendor/orders"
//             className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
//           >
//             ← Back to Orders
//           </Link>
//         </div>

//         {/* Messages */}
//         {message && <MessageBanner type={message.type} text={message.text} />}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Status Card */}
//             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//               <div className="flex flex-wrap items-center justify-between gap-4">
//                 <div>
//                   <p className="text-sm text-muted font-medium">Order Status</p>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status || 'pending')}`}>
//                       {getStatusEmoji(order.status || 'pending')} {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
//                     </span>
//                     {order.deliveryStatus && (
//                       <span className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-200">
//                         🚚 {order.deliveryStatus.replace('_', ' ').toUpperCase()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   {['processing', 'packed', 'shipped', 'delivered'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => updateOrderStatus(status)}
//                       disabled={order.status === status}
//                       className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                         order.status === status
//                           ? 'bg-primary text-white cursor-default'
//                           : 'bg-surface hover:bg-surface/70 text-secondary hover:text-secondary'
//                       }`}
//                     >
//                       {getStatusEmoji(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Customer Information */}
//             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//               <h3 className="text-lg font-bold text-secondary mb-4">👤 Customer Information</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <p className="text-xs text-muted font-medium">Name</p>
//                   <p className="text-secondary font-medium">{customerName}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted font-medium">Phone</p>
//                   <p className="text-secondary font-medium">{customerPhone}</p>
//                 </div>
//                 <div className="sm:col-span-2">
//                   <p className="text-xs text-muted font-medium">Email</p>
//                   <p className="text-secondary font-medium">{customerEmail}</p>
//                 </div>
//                 <div className="sm:col-span-2">
//                   <p className="text-xs text-muted font-medium">Delivery Address</p>
//                   <p className="text-secondary font-medium">{order.deliveryAddress || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted font-medium">Delivery Phone</p>
//                   <p className="text-secondary font-medium">{order.deliveryPhone || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted font-medium">Shipping Method</p>
//                   <p className="text-secondary font-medium">{order.shippingMethod || 'Standard'}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Items - Updated with images */}
//             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//               <h3 className="text-lg font-bold text-secondary mb-4">📦 Order Items</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-surface">
//                       <th className="text-left py-2 text-xs font-medium text-muted">Product</th>
//                       <th className="text-right py-2 text-xs font-medium text-muted">Qty</th>
//                       <th className="text-right py-2 text-xs font-medium text-muted">Price</th>
//                       <th className="text-right py-2 text-xs font-medium text-muted">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(order.products || []).map((item, index) => (
//                       <tr key={index} className="border-b border-surface/50 last:border-0">
//                         <td className="py-3">
//                           <div className="flex items-center gap-3">
//                             {/* Product Image */}
//                             {item.image ? (
//                               <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
//                                 <Image
//                                   src={item.image}
//                                   alt={item.name || 'Product'}
//                                   fill
//                                   className="object-cover"
//                                   sizes="48px"
//                                 />
//                               </div>
//                             ) : (
//                               <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-surface flex items-center justify-center">
//                                 <span className="text-2xl">📦</span>
//                               </div>
//                             )}
//                             <span className="text-secondary font-medium">{item.name || 'Unnamed item'}</span>
//                           </div>
//                         </td>
//                         <td className="py-3 text-right text-secondary">{item.quantity || 0}</td>
//                         <td className="py-3 text-right text-secondary">{formatCurrency(item.price)}</td>
//                         <td className="py-3 text-right text-secondary font-bold">
//                           {formatCurrency((item.quantity || 0) * (item.price || 0))}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colSpan={3} className="pt-4 text-right font-bold text-secondary">Subtotal</td>
//                       <td className="pt-4 text-right font-bold text-secondary">
//                         {formatCurrency(order.totalAmount)}
//                       </td>
//                     </tr>
//                     {(order.platformCommission || 0) > 0 && (
//                       <tr>
//                         <td colSpan={3} className="text-right text-sm text-muted">Platform Commission (3%)</td>
//                         <td className="text-right text-sm text-muted">
//                           -{formatCurrency(order.platformCommission)}
//                         </td>
//                       </tr>
//                     )}
//                     <tr className="border-t-2 border-secondary/20">
//                       <td colSpan={3} className="pt-2 text-right text-lg font-bold text-primary">Total</td>
//                       <td className="pt-2 text-right text-lg font-bold text-primary">
//                         {formatCurrency(order.totalAmount)}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Payment Info */}
//             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//               <h3 className="text-lg font-bold text-secondary mb-4">💳 Payment</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-muted">Status</span>
//                   <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
//                     {order.isPaid ? '✅ Paid' : '⏳ Pending'}
//                   </span>
//                 </div>
//                 {order.transactionId && (
//                   <div className="flex justify-between">
//                     <span className="text-muted">Transaction ID</span>
//                     <span className="font-medium text-secondary text-sm">{order.transactionId}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-muted">Total Amount</span>
//                   <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Vendor Earnings */}
//             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//               <h3 className="text-lg font-bold text-secondary mb-4">💰 Your Earnings</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-muted">Vendor Amount (97%)</span>
//                   <span className="font-medium text-secondary">{formatCurrency(order.vendorAmount)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted">Immediate Withdrawable (80%)</span>
//                   <span className="font-medium text-green-600">{formatCurrency(order.immediateWithdrawable)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted">Pending Release (20%)</span>
//                   <span className="font-medium text-amber-600">{formatCurrency(order.pendingWithdrawable)}</span>
//                 </div>
//                 {(order.platformCommission || 0) > 0 && (
//                   <div className="flex justify-between text-sm text-muted">
//                     <span>Platform Commission</span>
//                     <span>-{formatCurrency(order.platformCommission)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Delivery Info */}
//             {order.rider && (
//               <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//                 <h3 className="text-lg font-bold text-secondary mb-4">🏍️ Delivery</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-xs text-muted font-medium">Rider</p>
//                     <p className="text-secondary font-medium">{riderName}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted font-medium">Phone</p>
//                     <p className="text-secondary">{riderPhone}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted font-medium">Vehicle</p>
//                     <p className="text-secondary">{riderVehicle}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted font-medium">Rating</p>
//                     <p className="text-secondary">⭐ {riderRating} ({riderDeliveries} deliveries)</p>
//                   </div>
//                   {order.riderAssignedAt && (
//                     <div>
//                       <p className="text-xs text-muted font-medium">Assigned At</p>
//                       <p className="text-secondary text-sm">{formatDate(order.riderAssignedAt)}</p>
//                     </div>
//                   )}
//                   {order.deliveredAt && (
//                     <div>
//                       <p className="text-xs text-muted font-medium">Delivered At</p>
//                       <p className="text-secondary text-sm">{formatDate(order.deliveredAt)}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
//               <button
//                 onClick={() => {
//                   window.print();
//                 }}
//                 className="w-full bg-surface hover:bg-surface/70 text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
//               >
//                 🖨️ Print Order
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/shd-pages/vendor/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/app/support/components/LoadingSpinner';
import MessageBanner from '../../dashboard/components/MessageBanner';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string; // Add image field
  // For populated product data
  product?: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  customerId: {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
  };
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryPhone: string;
  shippingMethod: string;
  trackingNumber?: string;
  transactionId?: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  rider?: {
    _id: string;
    name: string;
    phone: string;
    vehicleType: string;
    rating: number;
    totalDeliveries: number;
  };
  riderAssignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  deliveryStatus?: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  platformCommission: number;
  vendorAmount: number;
  immediateWithdrawable: number;
  pendingWithdrawable: number;
}

// Helper function for safe number formatting
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return 'KSh 0';
  }
  return `KSh ${value.toLocaleString()}`;
};

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Invalid date';
  }
};

const formatDateLong = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid date';
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/shd-api/api/vendors/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order data:', data.order); // Debug log
        console.log('Products:', data.order.products); // Debug log
        setOrder(data.order);
      } else if (response.status === 404) {
        setMessage({ type: 'error', text: 'Order not found' });
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch order details' });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setMessage({ type: 'error', text: 'Error fetching order' });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status })
      });

      if (response.ok) {
        setOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
        setMessage({ type: 'success', text: 'Order status updated!' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating status' });
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

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-surface">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-secondary mb-2">Order not found</h3>
            <p className="text-muted mb-4">The order you're looking for doesn't exist or has been removed</p>
            <Link 
              href="/shd-pages/vendor/orders"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-block"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safely access nested properties with fallbacks
  const customerName = order.customerId?.name || 'Unknown Customer';
  const customerPhone = order.customerId?.phoneNumber || 'N/A';
  const customerEmail = order.customerId?.email || 'N/A';
  const riderName = order.rider?.name || 'Not assigned';
  const riderPhone = order.rider?.phone || 'N/A';
  const riderVehicle = order.rider?.vehicleType || 'N/A';
  const riderRating = order.rider?.rating || 0;
  const riderDeliveries = order.rider?.totalDeliveries || 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Order #{order.orderNumber || 'N/A'}
            </h1>
            <p className="text-muted text-sm mt-1">
              Placed on {formatDateLong(order.createdAt)}
            </p>
          </div>
          <Link 
            href="/shd-pages/vendor/orders"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Messages */}
        {message && <MessageBanner type={message.type} text={message.text} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted font-medium">Order Status</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status || 'pending')}`}>
                      {getStatusEmoji(order.status || 'pending')} {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                    </span>
                    {order.deliveryStatus && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-200">
                        🚚 {order.deliveryStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['processing', 'packed', 'shipped', 'delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(status)}
                      disabled={order.status === status}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        order.status === status
                          ? 'bg-primary text-white cursor-default'
                          : 'bg-surface hover:bg-surface/70 text-secondary hover:text-secondary'
                      }`}
                    >
                      {getStatusEmoji(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
              <h3 className="text-lg font-bold text-secondary mb-4">👤 Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted font-medium">Name</p>
                  <p className="text-secondary font-medium">{customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">Phone</p>
                  <p className="text-secondary font-medium">{customerPhone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted font-medium">Email</p>
                  <p className="text-secondary font-medium">{customerEmail}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted font-medium">Delivery Address</p>
                  <p className="text-secondary font-medium">{order.deliveryAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">Delivery Phone</p>
                  <p className="text-secondary font-medium">{order.deliveryPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">Shipping Method</p>
                  <p className="text-secondary font-medium">{order.shippingMethod || 'Standard'}</p>
                </div>
              </div>
            </div>

            {/* Items - Updated with proper data handling */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
              <h3 className="text-lg font-bold text-secondary mb-4">📦 Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface">
                      <th className="text-left py-2 text-xs font-medium text-muted">Product</th>
                      <th className="text-right py-2 text-xs font-medium text-muted">Qty</th>
                      <th className="text-right py-2 text-xs font-medium text-muted">Price</th>
                      <th className="text-right py-2 text-xs font-medium text-muted">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.products || []).map((item, index) => {
                      // Get product data from multiple possible sources
                      const productName = item.name || item.product?.name || 'Product';
                      const productPrice = item.price || item.product?.price || 0;
                      const productImage = item.image || item.product?.image || null;
                      const quantity = item.quantity || 0;
                      
                      return (
                        <tr key={index} className="border-b border-surface/50 last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              {/* Product Image */}
                              {productImage ? (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                                  <Image
                                    src={productImage}
                                    alt={productName}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-surface flex items-center justify-center">
                                  <span className="text-2xl">📦</span>
                                </div>
                              )}
                              <span className="text-secondary font-medium">{productName}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-secondary">{quantity}</td>
                          <td className="py-3 text-right text-secondary">{formatCurrency(productPrice)}</td>
                          <td className="py-3 text-right text-secondary font-bold">
                            {formatCurrency(quantity * productPrice)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-4 text-right font-bold text-secondary">Subtotal</td>
                      <td className="pt-4 text-right font-bold text-secondary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                    {(order.platformCommission || 0) > 0 && (
                      <tr>
                        <td colSpan={3} className="text-right text-sm text-muted">Platform Commission (3%)</td>
                        <td className="text-right text-sm text-muted">
                          -{formatCurrency(order.platformCommission)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-secondary/20">
                      <td colSpan={3} className="pt-2 text-right text-lg font-bold text-primary">Total</td>
                      <td className="pt-2 text-right text-lg font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
              <h3 className="text-lg font-bold text-secondary mb-4">💳 Payment</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.isPaid ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-muted">Transaction ID</span>
                    <span className="font-medium text-secondary text-sm">{order.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Total Amount</span>
                  <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Vendor Earnings */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
              <h3 className="text-lg font-bold text-secondary mb-4">💰 Your Earnings</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Vendor Amount (97%)</span>
                  <span className="font-medium text-secondary">{formatCurrency(order.vendorAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Immediate Withdrawable (80%)</span>
                  <span className="font-medium text-green-600">{formatCurrency(order.immediateWithdrawable)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Pending Release (20%)</span>
                  <span className="font-medium text-amber-600">{formatCurrency(order.pendingWithdrawable)}</span>
                </div>
                {(order.platformCommission || 0) > 0 && (
                  <div className="flex justify-between text-sm text-muted">
                    <span>Platform Commission</span>
                    <span>-{formatCurrency(order.platformCommission)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            {order.rider && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
                <h3 className="text-lg font-bold text-secondary mb-4">🏍️ Delivery</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted font-medium">Rider</p>
                    <p className="text-secondary font-medium">{riderName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium">Phone</p>
                    <p className="text-secondary">{riderPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium">Vehicle</p>
                    <p className="text-secondary">{riderVehicle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium">Rating</p>
                    <p className="text-secondary">⭐ {riderRating} ({riderDeliveries} deliveries)</p>
                  </div>
                  {order.riderAssignedAt && (
                    <div>
                      <p className="text-xs text-muted font-medium">Assigned At</p>
                      <p className="text-secondary text-sm">{formatDate(order.riderAssignedAt)}</p>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div>
                      <p className="text-xs text-muted font-medium">Delivered At</p>
                      <p className="text-secondary text-sm">{formatDate(order.deliveredAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-surface">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full bg-surface hover:bg-surface/70 text-secondary px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
              >
                🖨️ Print Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}