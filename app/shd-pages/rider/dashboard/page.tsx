// // // // // // C:\Users\USER\Desktop\Projects\my-app\app\rider\dashboard\page.tsx
// // // // // 'use client';

// // // // // import { useState, useEffect } from 'react';
// // // // // import { useRouter } from 'next/navigation';
// // // // // import Link from 'next/link';

// // // // // interface Delivery {
// // // // //   id: string;
// // // // //   orderId: string;
// // // // //   customerName: string;
// // // // //   customerPhone: string;
// // // // //   pickupLocation: string;
// // // // //   dropoffLocation: string;
// // // // //   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
// // // // //   distance: number;
// // // // //   earnings: number;
// // // // //   createdAt: string;
// // // // //   estimatedTime: string;
// // // // // }

// // // // // interface RiderStats {
// // // // //   totalDeliveries: number;
// // // // //   totalEarned: number;
// // // // //   pendingPayout: number;
// // // // //   rating: number;
// // // // //   isAvailable: boolean;
// // // // //   onlineTime: string;
// // // // // }

// // // // // export default function RiderDashboard() {
// // // // //   const router = useRouter();
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [stats, setStats] = useState<RiderStats>({
// // // // //     totalDeliveries: 0,
// // // // //     totalEarned: 0,
// // // // //     pendingPayout: 0,
// // // // //     rating: 5.0,
// // // // //     isAvailable: true,
// // // // //     onlineTime: '0h 0m'
// // // // //   });
// // // // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // // // //   const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
// // // // //   const [isOnline, setIsOnline] = useState(true);

// // // // //   // Fetch dashboard data
// // // // //   useEffect(() => {
// // // // //     const fetchDashboardData = async () => {
// // // // //       try {
// // // // //         const token = localStorage.getItem('token');
// // // // //         if (!token) {
// // // // //           router.push('/shd-pages/login');
// // // // //           return;
// // // // //         }

// // // // //         // Fetch rider stats
// // // // //         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // // // //           headers: {
// // // // //             'Authorization': `Bearer ${token}`
// // // // //           }
// // // // //         });

// // // // //         if (statsResponse.ok) {
// // // // //           const data = await statsResponse.json();
// // // // //           setStats(data);
// // // // //           setIsOnline(data.isAvailable);
// // // // //         }

// // // // //         // Fetch deliveries
// // // // //         const deliveriesResponse = await fetch('/api/shd-api/api/riders/deliveries', {
// // // // //           headers: {
// // // // //             'Authorization': `Bearer ${token}`
// // // // //           }
// // // // //         });

// // // // //         if (deliveriesResponse.ok) {
// // // // //           const data = await deliveriesResponse.json();
// // // // //           setDeliveries(data);
// // // // //         }

// // // // //       } catch (error) {
// // // // //         console.error('Error fetching dashboard data:', error);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchDashboardData();
// // // // //   }, [router]);

// // // // //   const toggleAvailability = async () => {
// // // // //     try {
// // // // //       const token = localStorage.getItem('token');
// // // // //       const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         },
// // // // //         body: JSON.stringify({ isAvailable: !isOnline })
// // // // //       });

// // // // //       if (response.ok) {
// // // // //         setIsOnline(!isOnline);
// // // // //         setStats(prev => ({ ...prev, isAvailable: !isOnline }));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error toggling availability:', error);
// // // // //     }
// // // // //   };

// // // // //   const acceptDelivery = async (deliveryId: string) => {
// // // // //     try {
// // // // //       const token = localStorage.getItem('token');
// // // // //       const response = await fetch(`/api/shd-api/api/riders/accept-delivery/${deliveryId}`, {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });

// // // // //       if (response.ok) {
// // // // //         // Update deliveries list
// // // // //         setDeliveries(prev => 
// // // // //           prev.map(d => 
// // // // //             d.id === deliveryId 
// // // // //               ? { ...d, status: 'accepted' } 
// // // // //               : d
// // // // //           )
// // // // //         );
// // // // //         alert('Delivery accepted!');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error accepting delivery:', error);
// // // // //     }
// // // // //   };

// // // // //   const updateDeliveryStatus = async (deliveryId: string, status: string) => {
// // // // //     try {
// // // // //       const token = localStorage.getItem('token');
// // // // //       const response = await fetch(`/api/shd-api/api/riders/update-delivery/${deliveryId}`, {
// // // // //         method: 'PUT',
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         },
// // // // //         body: JSON.stringify({ status })
// // // // //       });

// // // // //       if (response.ok) {
// // // // //         setDeliveries(prev => 
// // // // //           prev.map(d => 
// // // // //             d.id === deliveryId 
// // // // //               ? { ...d, status: status as any } 
// // // // //               : d
// // // // //           )
// // // // //         );
        
// // // // //         if (status === 'delivered') {
// // // // //           // Refresh stats
// // // // //           const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // // // //             headers: {
// // // // //               'Authorization': `Bearer ${token}`
// // // // //             }
// // // // //           });
// // // // //           if (statsResponse.ok) {
// // // // //             const data = await statsResponse.json();
// // // // //             setStats(data);
// // // // //           }
// // // // //         }
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error updating delivery status:', error);
// // // // //     }
// // // // //   };

// // // // //   const getStatusBadgeColor = (status: string) => {
// // // // //     const colors = {
// // // // //       pending: 'bg-yellow-100 text-yellow-800',
// // // // //       accepted: 'bg-blue-100 text-blue-800',
// // // // //       picked_up: 'bg-purple-100 text-purple-800',
// // // // //       in_transit: 'bg-indigo-100 text-indigo-800',
// // // // //       delivered: 'bg-green-100 text-green-800'
// // // // //     };
// // // // //     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
// // // // //   };

// // // // //   const getStatusLabel = (status: string) => {
// // // // //     return status.replace('_', ' ').toUpperCase();
// // // // //   };

// // // // //   const filteredDeliveries = deliveries.filter(d => {
// // // // //     if (activeTab === 'available') return d.status === 'pending';
// // // // //     if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit'].includes(d.status);
// // // // //     if (activeTab === 'history') return d.status === 'delivered';
// // // // //     return true;
// // // // //   });

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center">
// // // // //         <div className="text-center">
// // // // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
// // // // //           <p className="mt-4 text-gray-600">Loading dashboard...</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gray-50 py-6">
// // // // //       <div className="max-w-6xl mx-auto px-4">
// // // // //         {/* Header */}
// // // // //         <div className="bg-white rounded-xl shadow p-6 mb-6">
// // // // //           <div className="flex flex-wrap items-center justify-between">
// // // // //             <div>
// // // // //               <h1 className="text-2xl font-bold text-gray-900">🏍️ Rider Dashboard</h1>
// // // // //               <p className="text-sm text-gray-600">Manage your deliveries and earnings</p>
// // // // //             </div>
// // // // //             <div className="flex items-center space-x-4">
// // // // //               <button
// // // // //                 onClick={toggleAvailability}
// // // // //                 className={`px-6 py-2 rounded-lg font-semibold transition ${
// // // // //                   isOnline 
// // // // //                     ? 'bg-green-600 text-white hover:bg-green-700' 
// // // // //                     : 'bg-red-600 text-white hover:bg-red-700'
// // // // //                 }`}
// // // // //               >
// // // // //                 {isOnline ? '🟢 Online' : '🔴 Offline'}
// // // // //               </button>
// // // // //               <Link
// // // // //                 href="/rider/profile"
// // // // //                 className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
// // // // //               >
// // // // //                 👤
// // // // //               </Link>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Stats Cards */}
// // // // //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// // // // //           <div className="bg-white rounded-xl shadow p-6">
// // // // //             <div className="flex items-center justify-between">
// // // // //               <div>
// // // // //                 <p className="text-sm text-gray-500">Total Deliveries</p>
// // // // //                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
// // // // //               </div>
// // // // //               <div className="bg-blue-100 p-3 rounded-full">
// // // // //                 📦
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="bg-white rounded-xl shadow p-6">
// // // // //             <div className="flex items-center justify-between">
// // // // //               <div>
// // // // //                 <p className="text-sm text-gray-500">Total Earned</p>
// // // // //                 <p className="text-2xl font-bold text-green-600">KSh {stats.totalEarned}</p>
// // // // //               </div>
// // // // //               <div className="bg-green-100 p-3 rounded-full">
// // // // //                 💰
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="bg-white rounded-xl shadow p-6">
// // // // //             <div className="flex items-center justify-between">
// // // // //               <div>
// // // // //                 <p className="text-sm text-gray-500">Pending Payout</p>
// // // // //                 <p className="text-2xl font-bold text-orange-600">KSh {stats.pendingPayout}</p>
// // // // //               </div>
// // // // //               <div className="bg-orange-100 p-3 rounded-full">
// // // // //                 ⏳
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="bg-white rounded-xl shadow p-6">
// // // // //             <div className="flex items-center justify-between">
// // // // //               <div>
// // // // //                 <p className="text-sm text-gray-500">Rating</p>
// // // // //                 <p className="text-2xl font-bold text-yellow-500">⭐ {stats.rating}</p>
// // // // //               </div>
// // // // //               <div className="bg-yellow-100 p-3 rounded-full">
// // // // //                 ⭐
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Delivery Tabs */}
// // // // //         <div className="bg-white rounded-xl shadow">
// // // // //           <div className="border-b">
// // // // //             <div className="flex space-x-4 p-4">
// // // // //               <button
// // // // //                 onClick={() => setActiveTab('available')}
// // // // //                 className={`px-4 py-2 rounded-lg font-semibold transition ${
// // // // //                   activeTab === 'available'
// // // // //                     ? 'bg-purple-600 text-white'
// // // // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // // // //                 }`}
// // // // //               >
// // // // //                 Available ({deliveries.filter(d => d.status === 'pending').length})
// // // // //               </button>
// // // // //               <button
// // // // //                 onClick={() => setActiveTab('ongoing')}
// // // // //                 className={`px-4 py-2 rounded-lg font-semibold transition ${
// // // // //                   activeTab === 'ongoing'
// // // // //                     ? 'bg-blue-600 text-white'
// // // // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // // // //                 }`}
// // // // //               >
// // // // //                 Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit'].includes(d.status)).length})
// // // // //               </button>
// // // // //               <button
// // // // //                 onClick={() => setActiveTab('history')}
// // // // //                 className={`px-4 py-2 rounded-lg font-semibold transition ${
// // // // //                   activeTab === 'history'
// // // // //                     ? 'bg-gray-600 text-white'
// // // // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // // // //                 }`}
// // // // //               >
// // // // //                 History ({deliveries.filter(d => d.status === 'delivered').length})
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Deliveries List */}
// // // // //           <div className="p-4">
// // // // //             {filteredDeliveries.length === 0 ? (
// // // // //               <div className="text-center py-12">
// // // // //                 <p className="text-4xl mb-4">🚚</p>
// // // // //                 <h3 className="text-lg font-semibold text-gray-700">No deliveries</h3>
// // // // //                 <p className="text-sm text-gray-500">
// // // // //                   {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
// // // // //                   {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
// // // // //                   {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
// // // // //                 </p>
// // // // //               </div>
// // // // //             ) : (
// // // // //               <div className="space-y-4">
// // // // //                 {filteredDeliveries.map((delivery) => (
// // // // //                   <div
// // // // //                     key={delivery.id}
// // // // //                     className="border rounded-lg p-4 hover:shadow-md transition"
// // // // //                   >
// // // // //                     <div className="flex flex-wrap items-start justify-between">
// // // // //                       <div className="flex-1">
// // // // //                         <div className="flex items-center space-x-3 mb-2">
// // // // //                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
// // // // //                             {getStatusLabel(delivery.status)}
// // // // //                           </span>
// // // // //                           <span className="text-sm text-gray-500">Order #{delivery.orderId}</span>
// // // // //                         </div>

// // // // //                         <div className="space-y-1">
// // // // //                           <p className="text-sm">
// // // // //                             <span className="font-medium">Customer:</span> {delivery.customerName}
// // // // //                           </p>
// // // // //                           <p className="text-sm">
// // // // //                             <span className="font-medium">Phone:</span> {delivery.customerPhone}
// // // // //                           </p>
// // // // //                           <p className="text-sm">
// // // // //                             <span className="font-medium">Pickup:</span> {delivery.pickupLocation}
// // // // //                           </p>
// // // // //                           <p className="text-sm">
// // // // //                             <span className="font-medium">Dropoff:</span> {delivery.dropoffLocation}
// // // // //                           </p>
// // // // //                           <p className="text-sm">
// // // // //                             <span className="font-medium">Distance:</span> {delivery.distance} km
// // // // //                           </p>
// // // // //                           <p className="text-sm">
// // // // //                             <span className="font-medium">Earnings:</span> KSh {delivery.earnings}
// // // // //                           </p>
// // // // //                           <p className="text-sm text-gray-500">
// // // // //                             <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
// // // // //                           </p>
// // // // //                         </div>
// // // // //                       </div>

// // // // //                       <div className="flex flex-col space-y-2 mt-3 md:mt-0">
// // // // //                         {delivery.status === 'pending' && (
// // // // //                           <button
// // // // //                             onClick={() => acceptDelivery(delivery.id)}
// // // // //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// // // // //                           >
// // // // //                             Accept Delivery
// // // // //                           </button>
// // // // //                         )}

// // // // //                         {delivery.status === 'accepted' && (
// // // // //                           <button
// // // // //                             onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
// // // // //                             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
// // // // //                           >
// // // // //                             Mark as Picked Up
// // // // //                           </button>
// // // // //                         )}

// // // // //                         {delivery.status === 'picked_up' && (
// // // // //                           <button
// // // // //                             onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
// // // // //                             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
// // // // //                           >
// // // // //                             Start Delivery
// // // // //                           </button>
// // // // //                         )}

// // // // //                         {delivery.status === 'in_transit' && (
// // // // //                           <button
// // // // //                             onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
// // // // //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// // // // //                           >
// // // // //                             Mark as Delivered
// // // // //                           </button>
// // // // //                         )}

// // // // //                         <Link
// // // // //                           href={`/shd-pages/rider/delivery/${delivery.id}`}
// // // // //                           className="text-purple-600 hover:underline text-sm text-center"
// // // // //                         >
// // // // //                           View Details →
// // // // //                         </Link>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Quick Actions */}
// // // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// // // // //           <Link
// // // // //             href="/rider/earnings"
// // // // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // // // //           >
// // // // //             <div>
// // // // //               <p className="text-sm text-gray-500">My Earnings</p>
// // // // //               <p className="font-semibold">View payment history</p>
// // // // //             </div>
// // // // //             <span className="text-2xl">💰</span>
// // // // //           </Link>

// // // // //           <Link
// // // // //             href="/rider/profile"
// // // // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // // // //           >
// // // // //             <div>
// // // // //               <p className="text-sm text-gray-500">Profile</p>
// // // // //               <p className="font-semibold">Update your details</p>
// // // // //             </div>
// // // // //             <span className="text-2xl">👤</span>
// // // // //           </Link>

// // // // //           <Link
// // // // //             href="/rider/support"
// // // // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // // // //           >
// // // // //             <div>
// // // // //               <p className="text-sm text-gray-500">Support</p>
// // // // //               <p className="font-semibold">Get help</p>
// // // // //             </div>
// // // // //             <span className="text-2xl">🆘</span>
// // // // //           </Link>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // C:\Users\USER\Desktop\Projects\shaddyena\app\shd-pages\shd-pages\rider\dashboard\page.tsx
// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import { useRouter } from 'next/navigation';
// // // // import Link from 'next/link';

// // // // interface Delivery {
// // // //   id: string;
// // // //   orderId: string;
// // // //   customerName: string;
// // // //   customerPhone: string;
// // // //   pickupLocation: string;
// // // //   dropoffLocation: string;
// // // //   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed';
// // // //   distance: number;
// // // //   earnings: number;
// // // //   createdAt: string;
// // // //   estimatedTime: string;
// // // //   confirmationCode?: string;
// // // //   codeExpiresAt?: string;
// // // // }

// // // // interface RiderStats {
// // // //   totalDeliveries: number;
// // // //   totalEarned: number;
// // // //   pendingPayout: number;
// // // //   rating: number;
// // // //   isAvailable: boolean;
// // // //   onlineTime: string;
// // // // }

// // // // export default function RiderDashboard() {
// // // //   const router = useRouter();
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [stats, setStats] = useState<RiderStats>({
// // // //     totalDeliveries: 0,
// // // //     totalEarned: 0,
// // // //     pendingPayout: 0,
// // // //     rating: 5.0,
// // // //     isAvailable: true,
// // // //     onlineTime: '0h 0m'
// // // //   });
// // // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // // //   const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
// // // //   const [isOnline, setIsOnline] = useState(true);
// // // //   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
// // // //   const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
// // // //   const [confirmationCode, setConfirmationCode] = useState('');
// // // //   const [verifying, setVerifying] = useState(false);

// // // //   // Fetch dashboard data
// // // //   useEffect(() => {
// // // //     const fetchDashboardData = async () => {
// // // //       try {
// // // //         const token = localStorage.getItem('token');
// // // //         if (!token) {
// // // //           router.push('/shd-pages/login');
// // // //           return;
// // // //         }

// // // //         // Fetch rider stats
// // // //         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`
// // // //           }
// // // //         });

// // // //         if (statsResponse.ok) {
// // // //           const data = await statsResponse.json();
// // // //           setStats(data);
// // // //           setIsOnline(data.isAvailable);
// // // //         }

// // // //         // Fetch deliveries
// // // //         const deliveriesResponse = await fetch('/api/shd-api/api/riders/deliveries', {
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`
// // // //           }
// // // //         });

// // // //         if (deliveriesResponse.ok) {
// // // //           const data = await deliveriesResponse.json();
// // // //           setDeliveries(data);
// // // //         }

// // // //       } catch (error) {
// // // //         console.error('Error fetching dashboard data:', error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchDashboardData();
// // // //   }, [router]);

// // // //   const toggleAvailability = async () => {
// // // //     try {
// // // //       const token = localStorage.getItem('token');
// // // //       const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         },
// // // //         body: JSON.stringify({ isAvailable: !isOnline })
// // // //       });

// // // //       if (response.ok) {
// // // //         setIsOnline(!isOnline);
// // // //         setStats(prev => ({ ...prev, isAvailable: !isOnline }));
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error toggling availability:', error);
// // // //     }
// // // //   };

// // // //   const acceptDelivery = async (deliveryId: string) => {
// // // //     try {
// // // //       const token = localStorage.getItem('token');
// // // //       const response = await fetch(`/api/shd-api/api/riders/accept-delivery/${deliveryId}`, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       });

// // // //       if (response.ok) {
// // // //         setDeliveries(prev => 
// // // //           prev.map(d => 
// // // //             d.id === deliveryId 
// // // //               ? { ...d, status: 'accepted' } 
// // // //               : d
// // // //           )
// // // //         );
// // // //         alert('Delivery accepted!');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error accepting delivery:', error);
// // // //     }
// // // //   };

// // // //   const updateDeliveryStatus = async (deliveryId: string, status: string) => {
// // // //     try {
// // // //       const token = localStorage.getItem('token');
// // // //       const response = await fetch(`/api/shd-api/api/riders/update-delivery/${deliveryId}`, {
// // // //         method: 'PUT',
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         },
// // // //         body: JSON.stringify({ status })
// // // //       });

// // // //       if (response.ok) {
// // // //         const data = await response.json();
        
// // // //         if (status === 'delivered') {
// // // //           // Show confirmation code to rider
// // // //           const code = data.delivery?.confirmationCode || 'Code generated';
// // // //           alert(`✅ Delivery marked as delivered!\n\nConfirmation Code: ${code}\n\nPlease provide this code to the customer. They need to confirm receipt.`);
          
// // // //           setDeliveries(prev => 
// // // //             prev.map(d => 
// // // //               d.id === deliveryId 
// // // //                 ? { ...d, status: 'awaiting_confirmation', confirmationCode: data.delivery?.confirmationCode } 
// // // //                 : d
// // // //             )
// // // //           );
// // // //         } else {
// // // //           setDeliveries(prev => 
// // // //             prev.map(d => 
// // // //               d.id === deliveryId 
// // // //                 ? { ...d, status: status as any } 
// // // //                 : d
// // // //             )
// // // //           );
// // // //         }
        
// // // //         // Refresh stats after delivery completion
// // // //         if (status === 'delivered' || status === 'completed') {
// // // //           const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // // //             headers: {
// // // //               'Authorization': `Bearer ${token}`
// // // //             }
// // // //           });
// // // //           if (statsResponse.ok) {
// // // //             const data = await statsResponse.json();
// // // //             setStats(data);
// // // //           }
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error updating delivery status:', error);
// // // //     }
// // // //   };

// // // //   const handleVerifyConfirmation = async () => {
// // // //     if (!selectedDeliveryId || !confirmationCode) {
// // // //       alert('Please enter the confirmation code');
// // // //       return;
// // // //     }

// // // //     setVerifying(true);
// // // //     try {
// // // //       const token = localStorage.getItem('token');
// // // //       const response = await fetch('/api/shd-api/api/riders/verify-confirmation', {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         },
// // // //         body: JSON.stringify({
// // // //           deliveryId: selectedDeliveryId,
// // // //           confirmationCode: confirmationCode
// // // //         })
// // // //       });

// // // //       if (response.ok) {
// // // //         const data = await response.json();
// // // //         alert(`✅ ${data.message}`);
        
// // // //         // Update delivery status
// // // //         setDeliveries(prev => 
// // // //           prev.map(d => 
// // // //             d.id === selectedDeliveryId 
// // // //               ? { ...d, status: 'completed' } 
// // // //               : d
// // // //           )
// // // //         );
        
// // // //         // Refresh stats
// // // //         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`
// // // //           }
// // // //         });
// // // //         if (statsResponse.ok) {
// // // //           const data = await statsResponse.json();
// // // //           setStats(data);
// // // //         }
        
// // // //         // Close modal
// // // //         setShowConfirmationModal(false);
// // // //         setConfirmationCode('');
// // // //         setSelectedDeliveryId(null);
// // // //       } else {
// // // //         const error = await response.json();
// // // //         alert(`❌ ${error.error || 'Invalid confirmation code'}`);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error verifying confirmation:', error);
// // // //       alert('Failed to verify confirmation code');
// // // //     } finally {
// // // //       setVerifying(false);
// // // //     }
// // // //   };

// // // //   const getStatusBadgeColor = (status: string) => {
// // // //     const colors = {
// // // //       pending: 'bg-yellow-100 text-yellow-800',
// // // //       accepted: 'bg-blue-100 text-blue-800',
// // // //       picked_up: 'bg-purple-100 text-purple-800',
// // // //       in_transit: 'bg-indigo-100 text-indigo-800',
// // // //       delivered: 'bg-green-100 text-green-800',
// // // //       awaiting_confirmation: 'bg-orange-100 text-orange-800',
// // // //       completed: 'bg-green-200 text-green-900'
// // // //     };
// // // //     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
// // // //   };

// // // //   const getStatusLabel = (status: string) => {
// // // //     const labels: Record<string, string> = {
// // // //       pending: 'PENDING',
// // // //       accepted: 'ACCEPTED',
// // // //       picked_up: 'PICKED UP',
// // // //       in_transit: 'IN TRANSIT',
// // // //       delivered: 'DELIVERED',
// // // //       awaiting_confirmation: 'AWAITING CONFIRMATION',
// // // //       completed: '✅ COMPLETED'
// // // //     };
// // // //     return labels[status] || status.replace('_', ' ').toUpperCase();
// // // //   };

// // // //   const filteredDeliveries = deliveries.filter(d => {
// // // //     if (activeTab === 'available') return d.status === 'pending';
// // // //     if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status);
// // // //     if (activeTab === 'history') return d.status === 'completed' || d.status === 'delivered';
// // // //     return true;
// // // //   });

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center">
// // // //         <div className="text-center">
// // // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
// // // //           <p className="mt-4 text-gray-600">Loading dashboard...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50 py-6">
// // // //       <div className="max-w-6xl mx-auto px-4">
// // // //         {/* Header */}
// // // //         <div className="bg-white rounded-xl shadow p-6 mb-6">
// // // //           <div className="flex flex-wrap items-center justify-between">
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold text-gray-900">🏍️ Rider Dashboard</h1>
// // // //               <p className="text-sm text-gray-600">Manage your deliveries and earnings</p>
// // // //             </div>
// // // //             <div className="flex items-center space-x-4">
// // // //               <button
// // // //                 onClick={toggleAvailability}
// // // //                 className={`px-6 py-2 rounded-lg font-semibold transition ${
// // // //                   isOnline 
// // // //                     ? 'bg-green-600 text-white hover:bg-green-700' 
// // // //                     : 'bg-red-600 text-white hover:bg-red-700'
// // // //                 }`}
// // // //               >
// // // //                 {isOnline ? '🟢 Online' : '🔴 Offline'}
// // // //               </button>
// // // //               <Link
// // // //                 href="/rider/profile"
// // // //                 className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
// // // //               >
// // // //                 👤
// // // //               </Link>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Stats Cards */}
// // // //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// // // //           <div className="bg-white rounded-xl shadow p-6">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm text-gray-500">Total Deliveries</p>
// // // //                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
// // // //               </div>
// // // //               <div className="bg-blue-100 p-3 rounded-full">
// // // //                 📦
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="bg-white rounded-xl shadow p-6">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm text-gray-500">Total Earned</p>
// // // //                 <p className="text-2xl font-bold text-green-600">KSh {stats.totalEarned}</p>
// // // //               </div>
// // // //               <div className="bg-green-100 p-3 rounded-full">
// // // //                 💰
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="bg-white rounded-xl shadow p-6">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm text-gray-500">Pending Payout</p>
// // // //                 <p className="text-2xl font-bold text-orange-600">KSh {stats.pendingPayout}</p>
// // // //               </div>
// // // //               <div className="bg-orange-100 p-3 rounded-full">
// // // //                 ⏳
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="bg-white rounded-xl shadow p-6">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="text-sm text-gray-500">Rating</p>
// // // //                 <p className="text-2xl font-bold text-yellow-500">⭐ {stats.rating}</p>
// // // //               </div>
// // // //               <div className="bg-yellow-100 p-3 rounded-full">
// // // //                 ⭐
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Delivery Tabs */}
// // // //         <div className="bg-white rounded-xl shadow">
// // // //           <div className="border-b">
// // // //             <div className="flex space-x-4 p-4 overflow-x-auto">
// // // //               <button
// // // //                 onClick={() => setActiveTab('available')}
// // // //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// // // //                   activeTab === 'available'
// // // //                     ? 'bg-purple-600 text-white'
// // // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // // //                 }`}
// // // //               >
// // // //                 Available ({deliveries.filter(d => d.status === 'pending').length})
// // // //               </button>
// // // //               <button
// // // //                 onClick={() => setActiveTab('ongoing')}
// // // //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// // // //                   activeTab === 'ongoing'
// // // //                     ? 'bg-blue-600 text-white'
// // // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // // //                 }`}
// // // //               >
// // // //                 Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status)).length})
// // // //               </button>
// // // //               <button
// // // //                 onClick={() => setActiveTab('history')}
// // // //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// // // //                   activeTab === 'history'
// // // //                     ? 'bg-gray-600 text-white'
// // // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // // //                 }`}
// // // //               >
// // // //                 History ({deliveries.filter(d => d.status === 'completed' || d.status === 'delivered').length})
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Deliveries List */}
// // // //           <div className="p-4">
// // // //             {filteredDeliveries.length === 0 ? (
// // // //               <div className="text-center py-12">
// // // //                 <p className="text-4xl mb-4">🚚</p>
// // // //                 <h3 className="text-lg font-semibold text-gray-700">No deliveries</h3>
// // // //                 <p className="text-sm text-gray-500">
// // // //                   {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
// // // //                   {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
// // // //                   {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
// // // //                 </p>
// // // //               </div>
// // // //             ) : (
// // // //               <div className="space-y-4">
// // // //                 {filteredDeliveries.map((delivery) => (
// // // //                   <div
// // // //                     key={delivery.id}
// // // //                     className="border rounded-lg p-4 hover:shadow-md transition"
// // // //                   >
// // // //                     <div className="flex flex-wrap items-start justify-between">
// // // //                       <div className="flex-1">
// // // //                         <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
// // // //                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
// // // //                             {getStatusLabel(delivery.status)}
// // // //                           </span>
// // // //                           <span className="text-sm text-gray-500">Order #{delivery.orderId}</span>
// // // //                           {delivery.status === 'awaiting_confirmation' && (
// // // //                             <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
// // // //                               ⚠️ AWAITING CUSTOMER CONFIRMATION
// // // //                             </span>
// // // //                           )}
// // // //                           {delivery.confirmationCode && delivery.status === 'awaiting_confirmation' && (
// // // //                             <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-mono">
// // // //                               Code: {delivery.confirmationCode}
// // // //                             </span>
// // // //                           )}
// // // //                         </div>

// // // //                         <div className="space-y-1">
// // // //                           <p className="text-sm">
// // // //                             <span className="font-medium">Customer:</span> {delivery.customerName}
// // // //                           </p>
// // // //                           <p className="text-sm">
// // // //                             <span className="font-medium">Phone:</span> {delivery.customerPhone}
// // // //                           </p>
// // // //                           <p className="text-sm">
// // // //                             <span className="font-medium">Pickup:</span> {delivery.pickupLocation}
// // // //                           </p>
// // // //                           <p className="text-sm">
// // // //                             <span className="font-medium">Dropoff:</span> {delivery.dropoffLocation}
// // // //                           </p>
// // // //                           <p className="text-sm">
// // // //                             <span className="font-medium">Distance:</span> {delivery.distance} km
// // // //                           </p>
// // // //                           <p className="text-sm">
// // // //                             <span className="font-medium">Earnings:</span> KSh {delivery.earnings}
// // // //                           </p>
// // // //                           <p className="text-sm text-gray-500">
// // // //                             <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
// // // //                           </p>
// // // //                           {delivery.codeExpiresAt && delivery.status === 'awaiting_confirmation' && (
// // // //                             <p className="text-xs text-red-500">
// // // //                               ⏰ Code expires at: {new Date(delivery.codeExpiresAt).toLocaleTimeString()}
// // // //                             </p>
// // // //                           )}
// // // //                         </div>
// // // //                       </div>

// // // //                       <div className="flex flex-col space-y-2 mt-3 md:mt-0">
// // // //                         {delivery.status === 'pending' && (
// // // //                           <button
// // // //                             onClick={() => acceptDelivery(delivery.id)}
// // // //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// // // //                           >
// // // //                             Accept Delivery
// // // //                           </button>
// // // //                         )}

// // // //                         {delivery.status === 'accepted' && (
// // // //                           <button
// // // //                             onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
// // // //                             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
// // // //                           >
// // // //                             Mark as Picked Up
// // // //                           </button>
// // // //                         )}

// // // //                         {delivery.status === 'picked_up' && (
// // // //                           <button
// // // //                             onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
// // // //                             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
// // // //                           >
// // // //                             Start Delivery
// // // //                           </button>
// // // //                         )}

// // // //                         {delivery.status === 'in_transit' && (
// // // //                           <button
// // // //                             onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
// // // //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// // // //                           >
// // // //                             Mark as Delivered
// // // //                           </button>
// // // //                         )}

// // // //                         {delivery.status === 'awaiting_confirmation' && (
// // // //                           <button
// // // //                             onClick={() => {
// // // //                               setSelectedDeliveryId(delivery.id);
// // // //                               setShowConfirmationModal(true);
// // // //                             }}
// // // //                             className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition text-sm font-semibold animate-pulse"
// // // //                           >
// // // //                             🔑 Enter Confirmation Code
// // // //                           </button>
// // // //                         )}

// // // //                         <Link
// // // //                           href={`/shd-pages/rider/delivery/${delivery.id}`}
// // // //                           className="text-purple-600 hover:underline text-sm text-center"
// // // //                         >
// // // //                           View Details →
// // // //                         </Link>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>

// // // //         {/* Quick Actions */}
// // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// // // //           <Link
// // // //             href="/rider/earnings"
// // // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // // //           >
// // // //             <div>
// // // //               <p className="text-sm text-gray-500">My Earnings</p>
// // // //               <p className="font-semibold">View payment history</p>
// // // //             </div>
// // // //             <span className="text-2xl">💰</span>
// // // //           </Link>

// // // //           <Link
// // // //             href="/rider/profile"
// // // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // // //           >
// // // //             <div>
// // // //               <p className="text-sm text-gray-500">Profile</p>
// // // //               <p className="font-semibold">Update your details</p>
// // // //             </div>
// // // //             <span className="text-2xl">👤</span>
// // // //           </Link>

// // // //           <Link
// // // //             href="/rider/support"
// // // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // // //           >
// // // //             <div>
// // // //               <p className="text-sm text-gray-500">Support</p>
// // // //               <p className="font-semibold">Get help</p>
// // // //             </div>
// // // //             <span className="text-2xl">🆘</span>
// // // //           </Link>
// // // //         </div>
// // // //       </div>

// // // //       {/* Confirmation Code Modal */}
// // // //       {showConfirmationModal && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //           <div className="bg-white rounded-xl max-w-md w-full p-6">
// // // //             <h3 className="text-xl font-bold text-gray-900 mb-2">🔑 Enter Confirmation Code</h3>
// // // //             <p className="text-sm text-gray-600 mb-4">
// // // //               Please enter the confirmation code provided by the customer to complete this delivery.
// // // //             </p>
            
// // // //             <div className="mb-4">
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Confirmation Code
// // // //               </label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={confirmationCode}
// // // //                 onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
// // // //                 placeholder="Enter 6-digit code"
// // // //                 className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-mono focus:outline-none focus:border-purple-600 transition"
// // // //                 maxLength={6}
// // // //                 autoFocus
// // // //               />
// // // //             </div>

// // // //             <div className="flex gap-3">
// // // //               <button
// // // //                 onClick={handleVerifyConfirmation}
// // // //                 disabled={verifying || confirmationCode.length !== 6}
// // // //                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
// // // //                   verifying || confirmationCode.length !== 6
// // // //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// // // //                     : 'bg-green-600 text-white hover:bg-green-700'
// // // //                 }`}
// // // //               >
// // // //                 {verifying ? 'Verifying...' : '✅ Verify & Complete'}
// // // //               </button>
// // // //               <button
// // // //                 onClick={() => {
// // // //                   setShowConfirmationModal(false);
// // // //                   setConfirmationCode('');
// // // //                   setSelectedDeliveryId(null);
// // // //                 }}
// // // //                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // C:\Users\USER\Desktop\Projects\shaddyena\app\shd-pages\shd-pages\rider\dashboard\page.tsx
// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';

// // // interface Delivery {
// // //   id: string;
// // //   orderId: string;
// // //   customerName: string;
// // //   customerPhone: string;
// // //   pickupLocation: string;
// // //   dropoffLocation: string;
// // //   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed';
// // //   distance: number;
// // //   earnings: number;
// // //   createdAt: string;
// // //   estimatedTime: string;
// // //   customerConfirmed?: boolean;
// // //   codeExpiresAt?: string;
// // // }

// // // interface RiderStats {
// // //   totalDeliveries: number;
// // //   totalEarned: number;
// // //   pendingPayout: number;
// // //   rating: number;
// // //   isAvailable: boolean;
// // //   onlineTime: string;
// // // }

// // // export default function RiderDashboard() {
// // //   const router = useRouter();
// // //   const [loading, setLoading] = useState(true);
// // //   const [stats, setStats] = useState<RiderStats>({
// // //     totalDeliveries: 0,
// // //     totalEarned: 0,
// // //     pendingPayout: 0,
// // //     rating: 5.0,
// // //     isAvailable: true,
// // //     onlineTime: '0h 0m'
// // //   });
// // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // //   const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
// // //   const [isOnline, setIsOnline] = useState(true);
// // //   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
// // //   const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
// // //   const [confirmationCode, setConfirmationCode] = useState('');
// // //   const [verifying, setVerifying] = useState(false);

// // //   // Fetch dashboard data
// // //   useEffect(() => {
// // //     const fetchDashboardData = async () => {
// // //       try {
// // //         const token = localStorage.getItem('token');
// // //         if (!token) {
// // //           router.push('/shd-pages/login');
// // //           return;
// // //         }

// // //         // Fetch rider stats
// // //         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`
// // //           }
// // //         });

// // //         if (statsResponse.ok) {
// // //           const data = await statsResponse.json();
// // //           setStats(data);
// // //           setIsOnline(data.isAvailable);
// // //         }

// // //         // Fetch deliveries
// // //         const deliveriesResponse = await fetch('/api/shd-api/api/riders/deliveries', {
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`
// // //           }
// // //         });

// // //         if (deliveriesResponse.ok) {
// // //           const data = await deliveriesResponse.json();
// // //           setDeliveries(data);
// // //         }

// // //       } catch (error) {
// // //         console.error('Error fetching dashboard data:', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchDashboardData();
// // //   }, [router]);

// // //   const toggleAvailability = async () => {
// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({ isAvailable: !isOnline })
// // //       });

// // //       if (response.ok) {
// // //         setIsOnline(!isOnline);
// // //         setStats(prev => ({ ...prev, isAvailable: !isOnline }));
// // //       }
// // //     } catch (error) {
// // //       console.error('Error toggling availability:', error);
// // //     }
// // //   };

// // //   const acceptDelivery = async (deliveryId: string) => {
// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       const response = await fetch(`/api/shd-api/api/riders/accept-delivery/${deliveryId}`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       });

// // //       if (response.ok) {
// // //         setDeliveries(prev => 
// // //           prev.map(d => 
// // //             d.id === deliveryId 
// // //               ? { ...d, status: 'accepted' } 
// // //               : d
// // //           )
// // //         );
// // //         alert('Delivery accepted!');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error accepting delivery:', error);
// // //     }
// // //   };

// // //   const updateDeliveryStatus = async (deliveryId: string, status: string) => {
// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       const response = await fetch(`/api/shd-api/api/riders/update-delivery/${deliveryId}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({ status })
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
        
// // //         if (status === 'delivered') {
// // //           // Show instruction to rider - NO CODE displayed
// // //           alert(`✅ Delivery marked as delivered!\n\n📱 Please ask the customer to confirm receipt in their app.\n\n⚠️ The customer will receive a confirmation code to share with you.\n\n⏰ You have 15 minutes to enter the code.`);
          
// // //           setDeliveries(prev => 
// // //             prev.map(d => 
// // //               d.id === deliveryId 
// // //                 ? { ...d, status: 'awaiting_confirmation' } 
// // //                 : d
// // //             )
// // //           );
// // //         } else {
// // //           setDeliveries(prev => 
// // //             prev.map(d => 
// // //               d.id === deliveryId 
// // //                 ? { ...d, status: status as any } 
// // //                 : d
// // //             )
// // //           );
// // //         }
        
// // //         // Refresh stats after delivery completion
// // //         if (status === 'delivered') {
// // //           const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // //             headers: {
// // //               'Authorization': `Bearer ${token}`
// // //             }
// // //           });
// // //           if (statsResponse.ok) {
// // //             const data = await statsResponse.json();
// // //             setStats(data);
// // //           }
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error('Error updating delivery status:', error);
// // //     }
// // //   };

// // //   const handleVerifyConfirmation = async () => {
// // //     if (!selectedDeliveryId || !confirmationCode) {
// // //       alert('Please enter the confirmation code');
// // //       return;
// // //     }

// // //     if (confirmationCode.length !== 6) {
// // //       alert('Please enter a valid 6-digit code');
// // //       return;
// // //     }

// // //     setVerifying(true);
// // //     try {
// // //       const token = localStorage.getItem('token');
// // //       const response = await fetch('/api/shd-api/api/riders/verify-confirmation', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({
// // //           deliveryId: selectedDeliveryId,
// // //           confirmationCode: confirmationCode
// // //         })
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         alert(`✅ ${data.message}\n\n💰 Earnings: KSh ${data.delivery?.earnings || 0}`);
        
// // //         // Update delivery status
// // //         setDeliveries(prev => 
// // //           prev.map(d => 
// // //             d.id === selectedDeliveryId 
// // //               ? { ...d, status: 'completed' } 
// // //               : d
// // //           )
// // //         );
        
// // //         // Refresh stats
// // //         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`
// // //           }
// // //         });
// // //         if (statsResponse.ok) {
// // //           const data = await statsResponse.json();
// // //           setStats(data);
// // //         }
        
// // //         // Close modal
// // //         setShowConfirmationModal(false);
// // //         setConfirmationCode('');
// // //         setSelectedDeliveryId(null);
// // //       } else {
// // //         const error = await response.json();
// // //         alert(`❌ ${error.error || 'Invalid confirmation code'}`);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error verifying confirmation:', error);
// // //       alert('Failed to verify confirmation code. Please try again.');
// // //     } finally {
// // //       setVerifying(false);
// // //     }
// // //   };

// // //   const getStatusBadgeColor = (status: string) => {
// // //     const colors = {
// // //       pending: 'bg-yellow-100 text-yellow-800',
// // //       accepted: 'bg-blue-100 text-blue-800',
// // //       picked_up: 'bg-purple-100 text-purple-800',
// // //       in_transit: 'bg-indigo-100 text-indigo-800',
// // //       delivered: 'bg-green-100 text-green-800',
// // //       awaiting_confirmation: 'bg-orange-100 text-orange-800',
// // //       completed: 'bg-green-200 text-green-900'
// // //     };
// // //     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
// // //   };

// // //   const getStatusLabel = (status: string) => {
// // //     const labels: Record<string, string> = {
// // //       pending: 'PENDING',
// // //       accepted: 'ACCEPTED',
// // //       picked_up: 'PICKED UP',
// // //       in_transit: 'IN TRANSIT',
// // //       delivered: 'DELIVERED',
// // //       awaiting_confirmation: '⏳ AWAITING CUSTOMER CODE',
// // //       completed: '✅ COMPLETED'
// // //     };
// // //     return labels[status] || status.replace('_', ' ').toUpperCase();
// // //   };

// // //   const filteredDeliveries = deliveries.filter(d => {
// // //     if (activeTab === 'available') return d.status === 'pending';
// // //     if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status);
// // //     if (activeTab === 'history') return d.status === 'completed' || d.status === 'delivered';
// // //     return true;
// // //   });

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
// // //           <p className="mt-4 text-gray-600">Loading dashboard...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 py-6">
// // //       <div className="max-w-6xl mx-auto px-4">
// // //         {/* Header */}
// // //         <div className="bg-white rounded-xl shadow p-6 mb-6">
// // //           <div className="flex flex-wrap items-center justify-between">
// // //             <div>
// // //               <h1 className="text-2xl font-bold text-gray-900">🏍️ Rider Dashboard</h1>
// // //               <p className="text-sm text-gray-600">Manage your deliveries and earnings</p>
// // //             </div>
// // //             <div className="flex items-center space-x-4">
// // //               <button
// // //                 onClick={toggleAvailability}
// // //                 className={`px-6 py-2 rounded-lg font-semibold transition ${
// // //                   isOnline 
// // //                     ? 'bg-green-600 text-white hover:bg-green-700' 
// // //                     : 'bg-red-600 text-white hover:bg-red-700'
// // //                 }`}
// // //               >
// // //                 {isOnline ? '🟢 Online' : '🔴 Offline'}
// // //               </button>
// // //               <Link
// // //                 href="/rider/profile"
// // //                 className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
// // //               >
// // //                 👤
// // //               </Link>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Stats Cards */}
// // //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// // //           <div className="bg-white rounded-xl shadow p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500">Total Deliveries</p>
// // //                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
// // //               </div>
// // //               <div className="bg-blue-100 p-3 rounded-full">
// // //                 📦
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-xl shadow p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500">Total Earned</p>
// // //                 <p className="text-2xl font-bold text-green-600">KSh {stats.totalEarned}</p>
// // //               </div>
// // //               <div className="bg-green-100 p-3 rounded-full">
// // //                 💰
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-xl shadow p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500">Pending Payout</p>
// // //                 <p className="text-2xl font-bold text-orange-600">KSh {stats.pendingPayout}</p>
// // //               </div>
// // //               <div className="bg-orange-100 p-3 rounded-full">
// // //                 ⏳
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-xl shadow p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm text-gray-500">Rating</p>
// // //                 <p className="text-2xl font-bold text-yellow-500">⭐ {stats.rating}</p>
// // //               </div>
// // //               <div className="bg-yellow-100 p-3 rounded-full">
// // //                 ⭐
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Delivery Tabs */}
// // //         <div className="bg-white rounded-xl shadow">
// // //           <div className="border-b">
// // //             <div className="flex space-x-4 p-4 overflow-x-auto">
// // //               <button
// // //                 onClick={() => setActiveTab('available')}
// // //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// // //                   activeTab === 'available'
// // //                     ? 'bg-purple-600 text-white'
// // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // //                 }`}
// // //               >
// // //                 Available ({deliveries.filter(d => d.status === 'pending').length})
// // //               </button>
// // //               <button
// // //                 onClick={() => setActiveTab('ongoing')}
// // //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// // //                   activeTab === 'ongoing'
// // //                     ? 'bg-blue-600 text-white'
// // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // //                 }`}
// // //               >
// // //                 Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status)).length})
// // //               </button>
// // //               <button
// // //                 onClick={() => setActiveTab('history')}
// // //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// // //                   activeTab === 'history'
// // //                     ? 'bg-gray-600 text-white'
// // //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // //                 }`}
// // //               >
// // //                 History ({deliveries.filter(d => d.status === 'completed' || d.status === 'delivered').length})
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Deliveries List */}
// // //           <div className="p-4">
// // //             {filteredDeliveries.length === 0 ? (
// // //               <div className="text-center py-12">
// // //                 <p className="text-4xl mb-4">🚚</p>
// // //                 <h3 className="text-lg font-semibold text-gray-700">No deliveries</h3>
// // //                 <p className="text-sm text-gray-500">
// // //                   {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
// // //                   {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
// // //                   {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
// // //                 </p>
// // //               </div>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                 {filteredDeliveries.map((delivery) => (
// // //                   <div
// // //                     key={delivery.id}
// // //                     className="border rounded-lg p-4 hover:shadow-md transition"
// // //                   >
// // //                     <div className="flex flex-wrap items-start justify-between">
// // //                       <div className="flex-1">
// // //                         <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
// // //                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
// // //                             {getStatusLabel(delivery.status)}
// // //                           </span>
// // //                           <span className="text-sm text-gray-500">Order #{delivery.orderId}</span>
// // //                           {delivery.status === 'awaiting_confirmation' && (
// // //                             <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
// // //                               🔴 WAITING FOR CUSTOMER CODE
// // //                             </span>
// // //                           )}
// // //                           {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
// // //                             <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
// // //                               ✅ Customer confirmed - Enter code
// // //                             </span>
// // //                           )}
// // //                           {delivery.codeExpiresAt && delivery.status === 'awaiting_confirmation' && (
// // //                             <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
// // //                               ⏰ Expires: {new Date(delivery.codeExpiresAt).toLocaleTimeString()}
// // //                             </span>
// // //                           )}
// // //                         </div>

// // //                         <div className="space-y-1">
// // //                           <p className="text-sm">
// // //                             <span className="font-medium">Customer:</span> {delivery.customerName}
// // //                           </p>
// // //                           <p className="text-sm">
// // //                             <span className="font-medium">Phone:</span> {delivery.customerPhone}
// // //                           </p>
// // //                           <p className="text-sm">
// // //                             <span className="font-medium">Pickup:</span> {delivery.pickupLocation}
// // //                           </p>
// // //                           <p className="text-sm">
// // //                             <span className="font-medium">Dropoff:</span> {delivery.dropoffLocation}
// // //                           </p>
// // //                           <p className="text-sm">
// // //                             <span className="font-medium">Distance:</span> {delivery.distance} km
// // //                           </p>
// // //                           <p className="text-sm">
// // //                             <span className="font-medium">Earnings:</span> KSh {delivery.earnings}
// // //                           </p>
// // //                           <p className="text-sm text-gray-500">
// // //                             <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
// // //                           </p>
// // //                           {delivery.status === 'awaiting_confirmation' && (
// // //                             <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
// // //                               <p className="text-sm text-blue-700">
// // //                                 📱 Ask customer to confirm receipt in their app.
// // //                               </p>
// // //                               <p className="text-xs text-blue-600 mt-1">
// // //                                 They will receive a code to share with you.
// // //                               </p>
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       </div>

// // //                       <div className="flex flex-col space-y-2 mt-3 md:mt-0">
// // //                         {delivery.status === 'pending' && (
// // //                           <button
// // //                             onClick={() => acceptDelivery(delivery.id)}
// // //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// // //                           >
// // //                             Accept Delivery
// // //                           </button>
// // //                         )}

// // //                         {delivery.status === 'accepted' && (
// // //                           <button
// // //                             onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
// // //                             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
// // //                           >
// // //                             Mark as Picked Up
// // //                           </button>
// // //                         )}

// // //                         {delivery.status === 'picked_up' && (
// // //                           <button
// // //                             onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
// // //                             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
// // //                           >
// // //                             Start Delivery
// // //                           </button>
// // //                         )}

// // //                         {delivery.status === 'in_transit' && (
// // //                           <button
// // //                             onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
// // //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// // //                           >
// // //                             Mark as Delivered
// // //                           </button>
// // //                         )}

// // //                         {delivery.status === 'awaiting_confirmation' && (
// // //                           <button
// // //                             onClick={() => {
// // //                               setSelectedDeliveryId(delivery.id);
// // //                               setShowConfirmationModal(true);
// // //                             }}
// // //                             className={`px-6 py-2 rounded-lg transition text-sm font-semibold ${
// // //                               delivery.customerConfirmed
// // //                                 ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
// // //                                 : 'bg-gray-400 text-white cursor-not-allowed'
// // //                             }`}
// // //                             disabled={!delivery.customerConfirmed}
// // //                             title={!delivery.customerConfirmed ? 'Waiting for customer to confirm receipt' : ''}
// // //                           >
// // //                             🔑 Enter Code from Customer
// // //                           </button>
// // //                         )}

// // //                         <Link
// // //                           href={`/shd-pages/rider/delivery/${delivery.id}`}
// // //                           className="text-purple-600 hover:underline text-sm text-center"
// // //                         >
// // //                           View Details →
// // //                         </Link>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Quick Actions */}
// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// // //           <Link
// // //             href="/rider/earnings"
// // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // //           >
// // //             <div>
// // //               <p className="text-sm text-gray-500">My Earnings</p>
// // //               <p className="font-semibold">View payment history</p>
// // //             </div>
// // //             <span className="text-2xl">💰</span>
// // //           </Link>

// // //           <Link
// // //             href="/rider/profile"
// // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // //           >
// // //             <div>
// // //               <p className="text-sm text-gray-500">Profile</p>
// // //               <p className="font-semibold">Update your details</p>
// // //             </div>
// // //             <span className="text-2xl">👤</span>
// // //           </Link>

// // //           <Link
// // //             href="/rider/support"
// // //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// // //           >
// // //             <div>
// // //               <p className="text-sm text-gray-500">Support</p>
// // //               <p className="font-semibold">Get help</p>
// // //             </div>
// // //             <span className="text-2xl">🆘</span>
// // //           </Link>
// // //         </div>
// // //       </div>

// // //       {/* Confirmation Code Modal */}
// // //       {showConfirmationModal && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-xl max-w-md w-full p-6">
// // //             <div className="text-center mb-6">
// // //               <div className="text-5xl mb-4">🔑</div>
// // //               <h3 className="text-xl font-bold text-gray-900">Enter Confirmation Code</h3>
// // //               <p className="text-sm text-gray-600 mt-2">
// // //                 Please enter the 6-digit code shared by the customer to complete this delivery.
// // //               </p>
// // //             </div>

// // //             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
// // //               <p className="text-sm text-yellow-800">
// // //                 ⚠️ The customer has confirmed receipt and should have shared a 6-digit code with you.
// // //               </p>
// // //             </div>
            
// // //             <div className="mb-6">
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Confirmation Code
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 value={confirmationCode}
// // //                 onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
// // //                 placeholder="Enter 6-digit code"
// // //                 className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-mono text-center tracking-widest focus:outline-none focus:border-purple-600 transition"
// // //                 maxLength={6}
// // //                 autoFocus
// // //               />
// // //               <p className="text-xs text-gray-500 mt-2 text-center">
// // //                 Enter the 6-digit code provided by the customer
// // //               </p>
// // //             </div>

// // //             <div className="flex gap-3">
// // //               <button
// // //                 onClick={handleVerifyConfirmation}
// // //                 disabled={verifying || confirmationCode.length !== 6}
// // //                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
// // //                   verifying || confirmationCode.length !== 6
// // //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// // //                     : 'bg-green-600 text-white hover:bg-green-700'
// // //                 }`}
// // //               >
// // //                 {verifying ? 'Verifying...' : '✅ Verify & Complete'}
// // //               </button>
// // //               <button
// // //                 onClick={() => {
// // //                   setShowConfirmationModal(false);
// // //                   setConfirmationCode('');
// // //                   setSelectedDeliveryId(null);
// // //                 }}
// // //                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
// // //               >
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect, useCallback } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';

// // interface Delivery {
// //   id: string;
// //   orderId: string;
// //   customerName: string;
// //   customerPhone: string;
// //   pickupLocation: string;
// //   dropoffLocation: string;
// //   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed';
// //   distance: number;
// //   earnings: number;
// //   createdAt: string;
// //   estimatedTime: string;
// //   customerConfirmed?: boolean;
// //   codeExpiresAt?: string;
// // }

// // interface RiderStats {
// //   totalDeliveries: number;
// //   totalEarned: number;
// //   pendingPayout: number;
// //   rating: number;
// //   isAvailable: boolean;
// //   onlineTime: string;
// // }

// // export default function RiderDashboard() {
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [stats, setStats] = useState<RiderStats>({
// //     totalDeliveries: 0,
// //     totalEarned: 0,
// //     pendingPayout: 0,
// //     rating: 5.0,
// //     isAvailable: true,
// //     onlineTime: '0h 0m'
// //   });
// //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// //   const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
// //   const [isOnline, setIsOnline] = useState(true);
// //   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
// //   const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
// //   const [confirmationCode, setConfirmationCode] = useState('');
// //   const [verifying, setVerifying] = useState(false);

// //   // Fetch dashboard data
// //   const fetchDashboardData = useCallback(async (showLoading = true) => {
// //     if (showLoading) setLoading(true);
// //     setRefreshing(true);
    
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         router.push('/shd-pages/login');
// //         return;
// //       }

// //       // Fetch rider stats
// //       const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       if (statsResponse.ok) {
// //         const data = await statsResponse.json();
// //         setStats(data);
// //         setIsOnline(data.isAvailable);
// //       }

// //       // Fetch deliveries
// //       const deliveriesResponse = await fetch('/api/shd-api/api/riders/deliveries', {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       if (deliveriesResponse.ok) {
// //         const data = await deliveriesResponse.json();
// //         setDeliveries(data);
        
// //         // Check if any delivery in awaiting_confirmation has customerConfirmed = true
// //         // and show a notification
// //         const confirmedDeliveries = data.filter(
// //           (d: Delivery) => d.status === 'awaiting_confirmation' && d.customerConfirmed === true
// //         );
        
// //         if (confirmedDeliveries.length > 0) {
// //           // You could show a toast notification here
// //           console.log('Customer confirmed deliveries:', confirmedDeliveries.length);
// //         }
// //       }

// //     } catch (error) {
// //       console.error('Error fetching dashboard data:', error);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, [router]);

// //   // Initial fetch
// //   useEffect(() => {
// //     fetchDashboardData(true);
// //   }, [fetchDashboardData]);

// //   // Auto-refresh every 10 seconds when there are awaiting_confirmation deliveries
// //   useEffect(() => {
// //     const hasAwaitingConfirmation = deliveries.some(
// //       d => d.status === 'awaiting_confirmation' && !d.customerConfirmed
// //     );
    
// //     if (!hasAwaitingConfirmation) return;

// //     const interval = setInterval(() => {
// //       console.log('Auto-refreshing to check for customer confirmations...');
// //       fetchDashboardData(false);
// //     }, 10000); // Check every 10 seconds

// //     return () => clearInterval(interval);
// //   }, [deliveries, fetchDashboardData]);

// //   const toggleAvailability = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ isAvailable: !isOnline })
// //       });

// //       if (response.ok) {
// //         setIsOnline(!isOnline);
// //         setStats(prev => ({ ...prev, isAvailable: !isOnline }));
// //       }
// //     } catch (error) {
// //       console.error('Error toggling availability:', error);
// //     }
// //   };

// //   const acceptDelivery = async (deliveryId: string) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch(`/api/shd-api/api/riders/accept-delivery/${deliveryId}`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       if (response.ok) {
// //         setDeliveries(prev => 
// //           prev.map(d => 
// //             d.id === deliveryId 
// //               ? { ...d, status: 'accepted' } 
// //               : d
// //           )
// //         );
// //         alert('Delivery accepted!');
// //       }
// //     } catch (error) {
// //       console.error('Error accepting delivery:', error);
// //     }
// //   };

// //   const updateDeliveryStatus = async (deliveryId: string, status: string) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch(`/api/shd-api/api/riders/update-delivery/${deliveryId}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ status })
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
        
// //         if (status === 'delivered') {
// //           // Show instruction to rider - NO CODE displayed
// //           alert(`✅ Delivery marked as delivered!\n\n📱 Please ask the customer to confirm receipt in their app.\n\n⚠️ The customer will receive a confirmation code to share with you.\n\n⏰ You have 15 minutes to enter the code.`);
          
// //           setDeliveries(prev => 
// //             prev.map(d => 
// //               d.id === deliveryId 
// //                 ? { ...d, status: 'awaiting_confirmation' } 
// //                 : d
// //             )
// //           );
          
// //           // Start auto-refresh since we're now waiting for customer confirmation
// //           // The useEffect will handle this
// //         } else {
// //           setDeliveries(prev => 
// //             prev.map(d => 
// //               d.id === deliveryId 
// //                 ? { ...d, status: status as any } 
// //                 : d
// //             )
// //           );
// //         }
        
// //         // Refresh stats after delivery completion
// //         if (status === 'delivered') {
// //           const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// //             headers: {
// //               'Authorization': `Bearer ${token}`
// //             }
// //           });
// //           if (statsResponse.ok) {
// //             const data = await statsResponse.json();
// //             setStats(data);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error updating delivery status:', error);
// //     }
// //   };

// //   const handleVerifyConfirmation = async () => {
// //     if (!selectedDeliveryId || !confirmationCode) {
// //       alert('Please enter the confirmation code');
// //       return;
// //     }

// //     if (confirmationCode.length !== 6) {
// //       alert('Please enter a valid 6-digit code');
// //       return;
// //     }

// //     setVerifying(true);
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch('/api/shd-api/api/riders/verify-confirmation', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           deliveryId: selectedDeliveryId,
// //           confirmationCode: confirmationCode
// //         })
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         alert(`✅ ${data.message}\n\n💰 Earnings: KSh ${data.delivery?.earnings || 0}`);
        
// //         // Update delivery status
// //         setDeliveries(prev => 
// //           prev.map(d => 
// //             d.id === selectedDeliveryId 
// //               ? { ...d, status: 'completed' } 
// //               : d
// //           )
// //         );
        
// //         // Refresh stats
// //         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         });
// //         if (statsResponse.ok) {
// //           const data = await statsResponse.json();
// //           setStats(data);
// //         }
        
// //         // Close modal
// //         setShowConfirmationModal(false);
// //         setConfirmationCode('');
// //         setSelectedDeliveryId(null);
// //       } else {
// //         const error = await response.json();
// //         alert(`❌ ${error.error || 'Invalid confirmation code'}`);
// //       }
// //     } catch (error) {
// //       console.error('Error verifying confirmation:', error);
// //       alert('Failed to verify confirmation code. Please try again.');
// //     } finally {
// //       setVerifying(false);
// //     }
// //   };

// //   const getStatusBadgeColor = (status: string) => {
// //     const colors = {
// //       pending: 'bg-yellow-100 text-yellow-800',
// //       accepted: 'bg-blue-100 text-blue-800',
// //       picked_up: 'bg-purple-100 text-purple-800',
// //       in_transit: 'bg-indigo-100 text-indigo-800',
// //       delivered: 'bg-green-100 text-green-800',
// //       awaiting_confirmation: 'bg-orange-100 text-orange-800',
// //       completed: 'bg-green-200 text-green-900'
// //     };
// //     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
// //   };

// //   const getStatusLabel = (status: string) => {
// //     const labels: Record<string, string> = {
// //       pending: 'PENDING',
// //       accepted: 'ACCEPTED',
// //       picked_up: 'PICKED UP',
// //       in_transit: 'IN TRANSIT',
// //       delivered: 'DELIVERED',
// //       awaiting_confirmation: '⏳ AWAITING CUSTOMER CODE',
// //       completed: '✅ COMPLETED'
// //     };
// //     return labels[status] || status.replace('_', ' ').toUpperCase();
// //   };

// //   const filteredDeliveries = deliveries.filter(d => {
// //     if (activeTab === 'available') return d.status === 'pending';
// //     if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status);
// //     if (activeTab === 'history') return d.status === 'completed' || d.status === 'delivered';
// //     return true;
// //   });

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-6">
// //       <div className="max-w-6xl mx-auto px-4">
// //         {/* Header */}
// //         <div className="bg-white rounded-xl shadow p-6 mb-6">
// //           <div className="flex flex-wrap items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">🏍️ Rider Dashboard</h1>
// //               <p className="text-sm text-gray-600">Manage your deliveries and earnings</p>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <button
// //                 onClick={() => fetchDashboardData(false)}
// //                 disabled={refreshing}
// //                 className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold text-sm flex items-center gap-2"
// //               >
// //                 {refreshing ? (
// //                   <>
// //                     <span className="animate-spin">⟳</span> Refreshing...
// //                   </>
// //                 ) : (
// //                   '🔄 Refresh'
// //                 )}
// //               </button>
// //               <button
// //                 onClick={toggleAvailability}
// //                 className={`px-6 py-2 rounded-lg font-semibold transition ${
// //                   isOnline 
// //                     ? 'bg-green-600 text-white hover:bg-green-700' 
// //                     : 'bg-red-600 text-white hover:bg-red-700'
// //                 }`}
// //               >
// //                 {isOnline ? '🟢 Online' : '🔴 Offline'}
// //               </button>
// //               <Link
// //                 href="/rider/profile"
// //                 className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
// //               >
// //                 👤
// //               </Link>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //           <div className="bg-white rounded-xl shadow p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500">Total Deliveries</p>
// //                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
// //               </div>
// //               <div className="bg-blue-100 p-3 rounded-full">
// //                 📦
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl shadow p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500">Total Earned</p>
// //                 <p className="text-2xl font-bold text-green-600">KSh {stats.totalEarned}</p>
// //               </div>
// //               <div className="bg-green-100 p-3 rounded-full">
// //                 💰
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl shadow p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500">Pending Payout</p>
// //                 <p className="text-2xl font-bold text-orange-600">KSh {stats.pendingPayout}</p>
// //               </div>
// //               <div className="bg-orange-100 p-3 rounded-full">
// //                 ⏳
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl shadow p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500">Rating</p>
// //                 <p className="text-2xl font-bold text-yellow-500">⭐ {stats.rating}</p>
// //               </div>
// //               <div className="bg-yellow-100 p-3 rounded-full">
// //                 ⭐
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Delivery Tabs */}
// //         <div className="bg-white rounded-xl shadow">
// //           <div className="border-b">
// //             <div className="flex space-x-4 p-4 overflow-x-auto">
// //               <button
// //                 onClick={() => setActiveTab('available')}
// //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// //                   activeTab === 'available'
// //                     ? 'bg-purple-600 text-white'
// //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                 }`}
// //               >
// //                 Available ({deliveries.filter(d => d.status === 'pending').length})
// //               </button>
// //               <button
// //                 onClick={() => setActiveTab('ongoing')}
// //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// //                   activeTab === 'ongoing'
// //                     ? 'bg-blue-600 text-white'
// //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                 }`}
// //               >
// //                 Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status)).length})
// //               </button>
// //               <button
// //                 onClick={() => setActiveTab('history')}
// //                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
// //                   activeTab === 'history'
// //                     ? 'bg-gray-600 text-white'
// //                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                 }`}
// //               >
// //                 History ({deliveries.filter(d => d.status === 'completed' || d.status === 'delivered').length})
// //               </button>
// //             </div>
// //           </div>

// //           {/* Deliveries List */}
// //           <div className="p-4">
// //             {filteredDeliveries.length === 0 ? (
// //               <div className="text-center py-12">
// //                 <p className="text-4xl mb-4">🚚</p>
// //                 <h3 className="text-lg font-semibold text-gray-700">No deliveries</h3>
// //                 <p className="text-sm text-gray-500">
// //                   {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
// //                   {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
// //                   {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
// //                 </p>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {filteredDeliveries.map((delivery) => (
// //                   <div
// //                     key={delivery.id}
// //                     className="border rounded-lg p-4 hover:shadow-md transition"
// //                   >
// //                     <div className="flex flex-wrap items-start justify-between">
// //                       <div className="flex-1">
// //                         <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
// //                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
// //                             {getStatusLabel(delivery.status)}
// //                           </span>
// //                           <span className="text-sm text-gray-500">Order #{delivery.orderId}</span>
// //                           {delivery.status === 'awaiting_confirmation' && !delivery.customerConfirmed && (
// //                             <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
// //                               🔴 WAITING FOR CUSTOMER
// //                             </span>
// //                           )}
// //                           {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
// //                             <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-pulse">
// //                               ✅ CUSTOMER CONFIRMED - Enter code now!
// //                             </span>
// //                           )}
// //                           {delivery.codeExpiresAt && delivery.status === 'awaiting_confirmation' && (
// //                             <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
// //                               ⏰ Expires: {new Date(delivery.codeExpiresAt).toLocaleTimeString()}
// //                             </span>
// //                           )}
// //                         </div>

// //                         <div className="space-y-1">
// //                           <p className="text-sm">
// //                             <span className="font-medium">Customer:</span> {delivery.customerName}
// //                           </p>
// //                           <p className="text-sm">
// //                             <span className="font-medium">Phone:</span> {delivery.customerPhone}
// //                           </p>
// //                           <p className="text-sm">
// //                             <span className="font-medium">Pickup:</span> {delivery.pickupLocation}
// //                           </p>
// //                           <p className="text-sm">
// //                             <span className="font-medium">Dropoff:</span> {delivery.dropoffLocation}
// //                           </p>
// //                           <p className="text-sm">
// //                             <span className="font-medium">Distance:</span> {delivery.distance} km
// //                           </p>
// //                           <p className="text-sm">
// //                             <span className="font-medium">Earnings:</span> KSh {delivery.earnings}
// //                           </p>
// //                           <p className="text-sm text-gray-500">
// //                             <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
// //                           </p>
// //                           {delivery.status === 'awaiting_confirmation' && !delivery.customerConfirmed && (
// //                             <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
// //                               <p className="text-sm text-blue-700">
// //                                 📱 Ask customer to confirm receipt in their app.
// //                               </p>
// //                               <p className="text-xs text-blue-600 mt-1">
// //                                 They will receive a code to share with you.
// //                               </p>
// //                               <p className="text-xs text-blue-600 mt-1">
// //                                 ⏳ Waiting for customer confirmation... (auto-refreshing)
// //                               </p>
// //                             </div>
// //                           )}
// //                           {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
// //                             <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 animate-pulse">
// //                               <p className="text-sm text-green-700 font-semibold">
// //                                 ✅ Customer has confirmed receipt!
// //                               </p>
// //                               <p className="text-xs text-green-600 mt-1">
// //                                 Enter the 6-digit code they shared with you to complete the delivery.
// //                               </p>
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>

// //                       <div className="flex flex-col space-y-2 mt-3 md:mt-0">
// //                         {delivery.status === 'pending' && (
// //                           <button
// //                             onClick={() => acceptDelivery(delivery.id)}
// //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// //                           >
// //                             Accept Delivery
// //                           </button>
// //                         )}

// //                         {delivery.status === 'accepted' && (
// //                           <button
// //                             onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
// //                             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
// //                           >
// //                             Mark as Picked Up
// //                           </button>
// //                         )}

// //                         {delivery.status === 'picked_up' && (
// //                           <button
// //                             onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
// //                             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
// //                           >
// //                             Start Delivery
// //                           </button>
// //                         )}

// //                         {delivery.status === 'in_transit' && (
// //                           <button
// //                             onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
// //                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
// //                           >
// //                             Mark as Delivered
// //                           </button>
// //                         )}

// //                         {delivery.status === 'awaiting_confirmation' && (
// //                           <button
// //                             onClick={() => {
// //                               setSelectedDeliveryId(delivery.id);
// //                               setShowConfirmationModal(true);
// //                             }}
// //                             className={`px-6 py-2 rounded-lg transition text-sm font-semibold ${
// //                               delivery.customerConfirmed
// //                                 ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
// //                                 : 'bg-gray-400 text-white cursor-not-allowed'
// //                             }`}
// //                             disabled={!delivery.customerConfirmed}
// //                             title={!delivery.customerConfirmed ? 'Waiting for customer to confirm receipt' : 'Enter the code from customer'}
// //                           >
// //                             {delivery.customerConfirmed ? '🔑 Enter Code from Customer' : '⏳ Waiting for Customer'}
// //                           </button>
// //                         )}

// //                         <Link
// //                           href={`/shd-pages/rider/delivery/${delivery.id}`}
// //                           className="text-purple-600 hover:underline text-sm text-center"
// //                         >
// //                           View Details →
// //                         </Link>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Quick Actions */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// //           <Link
// //             href="/rider/earnings"
// //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// //           >
// //             <div>
// //               <p className="text-sm text-gray-500">My Earnings</p>
// //               <p className="font-semibold">View payment history</p>
// //             </div>
// //             <span className="text-2xl">💰</span>
// //           </Link>

// //           <Link
// //             href="/rider/profile"
// //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// //           >
// //             <div>
// //               <p className="text-sm text-gray-500">Profile</p>
// //               <p className="font-semibold">Update your details</p>
// //             </div>
// //             <span className="text-2xl">👤</span>
// //           </Link>

// //           <Link
// //             href="/rider/support"
// //             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
// //           >
// //             <div>
// //               <p className="text-sm text-gray-500">Support</p>
// //               <p className="font-semibold">Get help</p>
// //             </div>
// //             <span className="text-2xl">🆘</span>
// //           </Link>
// //         </div>
// //       </div>

// //       {/* Confirmation Code Modal */}
// //       {showConfirmationModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl max-w-md w-full p-6">
// //             <div className="text-center mb-6">
// //               <div className="text-5xl mb-4">🔑</div>
// //               <h3 className="text-xl font-bold text-gray-900">Enter Confirmation Code</h3>
// //               <p className="text-sm text-gray-600 mt-2">
// //                 Please enter the 6-digit code shared by the customer to complete this delivery.
// //               </p>
// //             </div>

// //             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
// //               <p className="text-sm text-green-800">
// //                 ✅ The customer has confirmed receipt and should have shared a 6-digit code with you.
// //               </p>
// //             </div>
            
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Confirmation Code
// //               </label>
// //               <input
// //                 type="text"
// //                 value={confirmationCode}
// //                 onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
// //                 placeholder="Enter 6-digit code"
// //                 className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-mono text-center tracking-widest focus:outline-none focus:border-purple-600 transition"
// //                 maxLength={6}
// //                 autoFocus
// //               />
// //               <p className="text-xs text-gray-500 mt-2 text-center">
// //                 Enter the 6-digit code provided by the customer
// //               </p>
// //             </div>

// //             <div className="flex gap-3">
// //               <button
// //                 onClick={handleVerifyConfirmation}
// //                 disabled={verifying || confirmationCode.length !== 6}
// //                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
// //                   verifying || confirmationCode.length !== 6
// //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                     : 'bg-green-600 text-white hover:bg-green-700'
// //                 }`}
// //               >
// //                 {verifying ? 'Verifying...' : '✅ Verify & Complete'}
// //               </button>
// //               <button
// //                 onClick={() => {
// //                   setShowConfirmationModal(false);
// //                   setConfirmationCode('');
// //                   setSelectedDeliveryId(null);
// //                 }}
// //                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// interface Delivery {
//   id: string;
//   orderId: string;
//   customerName: string;
//   customerPhone: string;
//   pickupLocation: string;
//   dropoffLocation: string;
//   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed';
//   distance: number;
//   earnings: number;
//   createdAt: string;
//   estimatedTime: string;
//   customerConfirmed?: boolean;
//   codeExpiresAt?: string;
//   deliveredAt?: string;
//   completedAt?: string;
//   customerConfirmedAt?: string;
// }

// interface RiderStats {
//   totalDeliveries: number;
//   totalEarned: number;
//   pendingPayout: number;
//   rating: number;
//   isAvailable: boolean;
//   onlineTime: string;
//   awaitingConfirmation?: number;
//   awaitingCustomerConfirmed?: number;
// }

// export default function RiderDashboard() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState<RiderStats>({
//     totalDeliveries: 0,
//     totalEarned: 0,
//     pendingPayout: 0,
//     rating: 5.0,
//     isAvailable: true,
//     onlineTime: '0h 0m'
//   });
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
//   const [isOnline, setIsOnline] = useState(true);
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
//   const [confirmationCode, setConfirmationCode] = useState('');
//   const [verifying, setVerifying] = useState(false);
//   const [customerConfirmedCount, setCustomerConfirmedCount] = useState(0);

//   // Fetch dashboard data
//   const fetchDashboardData = useCallback(async (showLoading = true) => {
//     if (showLoading) setLoading(true);
//     setRefreshing(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/shd-pages/login');
//         return;
//       }

//       // Fetch rider stats
//       const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (statsResponse.ok) {
//         const data = await statsResponse.json();
//         setStats(data);
//         setIsOnline(data.isAvailable);
//         setCustomerConfirmedCount(data.awaitingCustomerConfirmed || 0);
//       }

//       // Fetch deliveries
//       const deliveriesResponse = await fetch('/api/shd-api/api/riders/deliveries', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (deliveriesResponse.ok) {
//         const data = await deliveriesResponse.json();
//         setDeliveries(data);
        
//         // Log for debugging
//         console.log('Deliveries fetched:', data);
        
//         // Check for any awaiting_confirmation deliveries with customerConfirmed=true
//         const readyForCode = data.filter(
//           (d: Delivery) => d.status === 'awaiting_confirmation' && d.customerConfirmed === true
//         );
        
//         if (readyForCode.length > 0) {
//           console.log('Customer confirmed deliveries ready for code:', readyForCode.length);
//           // Optional: Show a toast notification here
//         }
//       }

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [router]);

//   // Initial fetch
//   useEffect(() => {
//     fetchDashboardData(true);
//   }, [fetchDashboardData]);

//   // Auto-refresh every 10 seconds when there are awaiting_confirmation deliveries
//   useEffect(() => {
//     const hasAwaitingConfirmation = deliveries.some(
//       d => d.status === 'awaiting_confirmation'
//     );
    
//     if (!hasAwaitingConfirmation) return;

//     const interval = setInterval(() => {
//       console.log('Auto-refreshing to check for customer confirmations...');
//       fetchDashboardData(false);
//     }, 10000); // Check every 10 seconds

//     return () => clearInterval(interval);
//   }, [deliveries, fetchDashboardData]);

//   const toggleAvailability = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ isAvailable: !isOnline })
//       });

//       if (response.ok) {
//         setIsOnline(!isOnline);
//         setStats(prev => ({ ...prev, isAvailable: !isOnline }));
//       }
//     } catch (error) {
//       console.error('Error toggling availability:', error);
//     }
//   };

//   const acceptDelivery = async (deliveryId: string) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/riders/accept-delivery/${deliveryId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         setDeliveries(prev => 
//           prev.map(d => 
//             d.id === deliveryId 
//               ? { ...d, status: 'accepted' } 
//               : d
//           )
//         );
//         alert('Delivery accepted!');
//       }
//     } catch (error) {
//       console.error('Error accepting delivery:', error);
//     }
//   };

//   const updateDeliveryStatus = async (deliveryId: string, status: string) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/shd-api/api/riders/update-delivery/${deliveryId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status })
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         if (status === 'delivered') {
//           // Show instruction to rider - NO CODE displayed
//           alert(`✅ Delivery marked as delivered!\n\n📱 Please ask the customer to confirm receipt in their app.\n\n⚠️ The customer will receive a confirmation code to share with you.\n\n⏰ You have 15 minutes to enter the code.`);
          
//           setDeliveries(prev => 
//             prev.map(d => 
//               d.id === deliveryId 
//                 ? { ...d, status: 'awaiting_confirmation', customerConfirmed: false } 
//                 : d
//             )
//           );
          
//           // Start auto-refresh since we're now waiting for customer confirmation
//           // The useEffect will handle this
//         } else {
//           setDeliveries(prev => 
//             prev.map(d => 
//               d.id === deliveryId 
//                 ? { ...d, status: status as any } 
//                 : d
//             )
//           );
//         }
        
//         // Refresh stats after delivery completion
//         if (status === 'delivered') {
//           const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
//           if (statsResponse.ok) {
//             const data = await statsResponse.json();
//             setStats(data);
//             setCustomerConfirmedCount(data.awaitingCustomerConfirmed || 0);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error updating delivery status:', error);
//     }
//   };

//   const handleVerifyConfirmation = async () => {
//     if (!selectedDeliveryId || !confirmationCode) {
//       alert('Please enter the confirmation code');
//       return;
//     }

//     if (confirmationCode.length !== 6) {
//       alert('Please enter a valid 6-digit code');
//       return;
//     }

//     setVerifying(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/shd-api/api/riders/verify-confirmation', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           deliveryId: selectedDeliveryId,
//           confirmationCode: confirmationCode
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert(`✅ ${data.message}\n\n💰 Earnings: KSh ${data.delivery?.earnings || 0}`);
        
//         // Update delivery status
//         setDeliveries(prev => 
//           prev.map(d => 
//             d.id === selectedDeliveryId 
//               ? { ...d, status: 'completed' } 
//               : d
//           )
//         );
        
//         // Refresh stats
//         const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         if (statsResponse.ok) {
//           const data = await statsResponse.json();
//           setStats(data);
//           setCustomerConfirmedCount(data.awaitingCustomerConfirmed || 0);
//         }
        
//         // Close modal
//         setShowConfirmationModal(false);
//         setConfirmationCode('');
//         setSelectedDeliveryId(null);
//       } else {
//         const error = await response.json();
//         alert(`❌ ${error.error || 'Invalid confirmation code'}`);
//       }
//     } catch (error) {
//       console.error('Error verifying confirmation:', error);
//       alert('Failed to verify confirmation code. Please try again.');
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const getStatusBadgeColor = (status: string) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       picked_up: 'bg-purple-100 text-purple-800',
//       in_transit: 'bg-indigo-100 text-indigo-800',
//       delivered: 'bg-green-100 text-green-800',
//       awaiting_confirmation: 'bg-orange-100 text-orange-800',
//       completed: 'bg-green-200 text-green-900'
//     };
//     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
//   };

//   const getStatusLabel = (status: string) => {
//     const labels: Record<string, string> = {
//       pending: 'PENDING',
//       accepted: 'ACCEPTED',
//       picked_up: 'PICKED UP',
//       in_transit: 'IN TRANSIT',
//       delivered: 'DELIVERED',
//       awaiting_confirmation: '⏳ AWAITING CUSTOMER CODE',
//       completed: '✅ COMPLETED'
//     };
//     return labels[status] || status.replace('_', ' ').toUpperCase();
//   };

//   const filteredDeliveries = deliveries.filter(d => {
//     if (activeTab === 'available') return d.status === 'pending';
//     if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status);
//     if (activeTab === 'history') return d.status === 'completed' || d.status === 'delivered';
//     return true;
//   });

//   // Count deliveries with customer confirmed
//   const customerConfirmedReady = deliveries.filter(
//     d => d.status === 'awaiting_confirmation' && d.customerConfirmed === true
//   ).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow p-6 mb-6">
//           <div className="flex flex-wrap items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">🏍️ Rider Dashboard</h1>
//               <p className="text-sm text-gray-600">Manage your deliveries and earnings</p>
//               {customerConfirmedReady > 0 && (
//                 <div className="mt-2 bg-green-100 border border-green-300 rounded-lg px-3 py-1 inline-flex items-center gap-2">
//                   <span className="text-green-600 font-semibold animate-pulse">✅ {customerConfirmedReady} customer(s) have confirmed - Enter their codes!</span>
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => fetchDashboardData(false)}
//                 disabled={refreshing}
//                 className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold text-sm flex items-center gap-2"
//               >
//                 {refreshing ? (
//                   <>
//                     <span className="animate-spin">⟳</span> Refreshing...
//                   </>
//                 ) : (
//                   '🔄 Refresh'
//                 )}
//               </button>
//               <button
//                 onClick={toggleAvailability}
//                 className={`px-6 py-2 rounded-lg font-semibold transition ${
//                   isOnline 
//                     ? 'bg-green-600 text-white hover:bg-green-700' 
//                     : 'bg-red-600 text-white hover:bg-red-700'
//                 }`}
//               >
//                 {isOnline ? '🟢 Online' : '🔴 Offline'}
//               </button>
//               <Link
//                 href="/rider/profile"
//                 className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
//               >
//                 👤
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Total Deliveries</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full">
//                 📦
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Total Earned</p>
//                 <p className="text-2xl font-bold text-green-600">KSh {stats.totalEarned}</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 💰
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Pending Payout</p>
//                 <p className="text-2xl font-bold text-orange-600">KSh {stats.pendingPayout}</p>
//               </div>
//               <div className="bg-orange-100 p-3 rounded-full">
//                 ⏳
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Rating</p>
//                 <p className="text-2xl font-bold text-yellow-500">⭐ {stats.rating}</p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 ⭐
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Delivery Tabs */}
//         <div className="bg-white rounded-xl shadow">
//           <div className="border-b">
//             <div className="flex space-x-4 p-4 overflow-x-auto">
//               <button
//                 onClick={() => setActiveTab('available')}
//                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
//                   activeTab === 'available'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 Available ({deliveries.filter(d => d.status === 'pending').length})
//               </button>
//               <button
//                 onClick={() => setActiveTab('ongoing')}
//                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
//                   activeTab === 'ongoing'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status)).length})
//               </button>
//               <button
//                 onClick={() => setActiveTab('history')}
//                 className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
//                   activeTab === 'history'
//                     ? 'bg-gray-600 text-white'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 History ({deliveries.filter(d => d.status === 'completed' || d.status === 'delivered').length})
//               </button>
//             </div>
//           </div>

//           {/* Deliveries List */}
//           <div className="p-4">
//             {filteredDeliveries.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-4xl mb-4">🚚</p>
//                 <h3 className="text-lg font-semibold text-gray-700">No deliveries</h3>
//                 <p className="text-sm text-gray-500">
//                   {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
//                   {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
//                   {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredDeliveries.map((delivery) => (
//                   <div
//                     key={delivery.id}
//                     className="border rounded-lg p-4 hover:shadow-md transition"
//                   >
//                     <div className="flex flex-wrap items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
//                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
//                             {getStatusLabel(delivery.status)}
//                           </span>
//                           <span className="text-sm text-gray-500">Order #{delivery.orderId}</span>
//                           {delivery.status === 'awaiting_confirmation' && !delivery.customerConfirmed && (
//                             <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
//                               🔴 WAITING FOR CUSTOMER
//                             </span>
//                           )}
//                           {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
//                             <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-pulse">
//                               ✅ CUSTOMER CONFIRMED - Enter code now!
//                             </span>
//                           )}
//                           {delivery.codeExpiresAt && delivery.status === 'awaiting_confirmation' && (
//                             <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
//                               ⏰ Expires: {new Date(delivery.codeExpiresAt).toLocaleTimeString()}
//                             </span>
//                           )}
//                         </div>

//                         <div className="space-y-1">
//                           <p className="text-sm">
//                             <span className="font-medium">Customer:</span> {delivery.customerName}
//                           </p>
//                           <p className="text-sm">
//                             <span className="font-medium">Phone:</span> {delivery.customerPhone}
//                           </p>
//                           <p className="text-sm">
//                             <span className="font-medium">Pickup:</span> {delivery.pickupLocation}
//                           </p>
//                           <p className="text-sm">
//                             <span className="font-medium">Dropoff:</span> {delivery.dropoffLocation}
//                           </p>
//                           <p className="text-sm">
//                             <span className="font-medium">Distance:</span> {delivery.distance} km
//                           </p>
//                           <p className="text-sm">
//                             <span className="font-medium">Earnings:</span> KSh {delivery.earnings}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
//                           </p>
//                           {delivery.status === 'awaiting_confirmation' && !delivery.customerConfirmed && (
//                             <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
//                               <p className="text-sm text-blue-700">
//                                 📱 Ask customer to confirm receipt in their app.
//                               </p>
//                               <p className="text-xs text-blue-600 mt-1">
//                                 They will receive a code to share with you.
//                               </p>
//                               <p className="text-xs text-blue-600 mt-1">
//                                 ⏳ Waiting for customer confirmation... (auto-refreshing)
//                               </p>
//                             </div>
//                           )}
//                           {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
//                             <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 animate-pulse">
//                               <p className="text-sm text-green-700 font-semibold">
//                                 ✅ Customer has confirmed receipt!
//                               </p>
//                               <p className="text-xs text-green-600 mt-1">
//                                 Enter the 6-digit code they shared with you to complete the delivery.
//                               </p>
//                               {delivery.customerConfirmedAt && (
//                                 <p className="text-xs text-green-500 mt-1">
//                                   Confirmed at: {new Date(delivery.customerConfirmedAt).toLocaleTimeString()}
//                                 </p>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex flex-col space-y-2 mt-3 md:mt-0">
//                         {delivery.status === 'pending' && (
//                           <button
//                             onClick={() => acceptDelivery(delivery.id)}
//                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
//                           >
//                             Accept Delivery
//                           </button>
//                         )}

//                         {delivery.status === 'accepted' && (
//                           <button
//                             onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
//                             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
//                           >
//                             Mark as Picked Up
//                           </button>
//                         )}

//                         {delivery.status === 'picked_up' && (
//                           <button
//                             onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
//                             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
//                           >
//                             Start Delivery
//                           </button>
//                         )}

//                         {delivery.status === 'in_transit' && (
//                           <button
//                             onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
//                             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
//                           >
//                             Mark as Delivered
//                           </button>
//                         )}

//                         {delivery.status === 'awaiting_confirmation' && (
//                           <button
//                             onClick={() => {
//                               setSelectedDeliveryId(delivery.id);
//                               setShowConfirmationModal(true);
//                             }}
//                             className={`px-6 py-2 rounded-lg transition text-sm font-semibold ${
//                               delivery.customerConfirmed
//                                 ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
//                                 : 'bg-gray-400 text-white cursor-not-allowed'
//                             }`}
//                             disabled={!delivery.customerConfirmed}
//                             title={!delivery.customerConfirmed ? 'Waiting for customer to confirm receipt' : 'Enter the code from customer'}
//                           >
//                             {delivery.customerConfirmed ? '🔑 Enter Code from Customer' : '⏳ Waiting for Customer'}
//                           </button>
//                         )}

//                         <Link
//                           href={`/shd-pages/rider/delivery/${delivery.id}`}
//                           className="text-purple-600 hover:underline text-sm text-center"
//                         >
//                           View Details →
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//           <Link
//             href="/rider/earnings"
//             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
//           >
//             <div>
//               <p className="text-sm text-gray-500">My Earnings</p>
//               <p className="font-semibold">View payment history</p>
//             </div>
//             <span className="text-2xl">💰</span>
//           </Link>

//           <Link
//             href="/rider/profile"
//             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
//           >
//             <div>
//               <p className="text-sm text-gray-500">Profile</p>
//               <p className="font-semibold">Update your details</p>
//             </div>
//             <span className="text-2xl">👤</span>
//           </Link>

//           <Link
//             href="/rider/support"
//             className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center justify-between"
//           >
//             <div>
//               <p className="text-sm text-gray-500">Support</p>
//               <p className="font-semibold">Get help</p>
//             </div>
//             <span className="text-2xl">🆘</span>
//           </Link>
//         </div>
//       </div>

//       {/* Confirmation Code Modal */}
//       {showConfirmationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-5xl mb-4">🔑</div>
//               <h3 className="text-xl font-bold text-gray-900">Enter Confirmation Code</h3>
//               <p className="text-sm text-gray-600 mt-2">
//                 Please enter the 6-digit code shared by the customer to complete this delivery.
//               </p>
//             </div>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//               <p className="text-sm text-green-800">
//                 ✅ The customer has confirmed receipt and should have shared a 6-digit code with you.
//               </p>
//             </div>
            
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirmation Code
//               </label>
//               <input
//                 type="text"
//                 value={confirmationCode}
//                 onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                 placeholder="Enter 6-digit code"
//                 className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-mono text-center tracking-widest focus:outline-none focus:border-purple-600 transition"
//                 maxLength={6}
//                 autoFocus
//               />
//               <p className="text-xs text-gray-500 mt-2 text-center">
//                 Enter the 6-digit code provided by the customer
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleVerifyConfirmation}
//                 disabled={verifying || confirmationCode.length !== 6}
//                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
//                   verifying || confirmationCode.length !== 6
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-green-600 text-white hover:bg-green-700'
//                 }`}
//               >
//                 {verifying ? 'Verifying...' : '✅ Verify & Complete'}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowConfirmationModal(false);
//                   setConfirmationCode('');
//                   setSelectedDeliveryId(null);
//                 }}
//                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed';
  distance: number;
  earnings: number;
  createdAt: string;
  estimatedTime: string;
  customerConfirmed?: boolean;
  codeExpiresAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  customerConfirmedAt?: string;
}

interface RiderStats {
  totalDeliveries: number;
  totalEarned: number;
  pendingPayout: number;
  rating: number;
  isAvailable: boolean;
  onlineTime: string;
  awaitingConfirmation?: number;
  awaitingCustomerConfirmed?: number;
}

export default function RiderDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<RiderStats>({
    totalDeliveries: 0,
    totalEarned: 0,
    pendingPayout: 0,
    rating: 5.0,
    isAvailable: true,
    onlineTime: '0h 0m'
  });
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('available');
  const [isOnline, setIsOnline] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [customerConfirmedCount, setCustomerConfirmedCount] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/shd-pages/login');
        return;
      }

      // Fetch rider stats
      const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
        setIsOnline(data.isAvailable);
        setCustomerConfirmedCount(data.awaitingCustomerConfirmed || 0);
      }

      // Fetch deliveries
      const deliveriesResponse = await fetch('/api/shd-api/api/riders/deliveries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (deliveriesResponse.ok) {
        const data = await deliveriesResponse.json();
        setDeliveries(data);
        
        // Log for debugging
        console.log('Deliveries fetched:', data);
        
        // Check for any awaiting_confirmation deliveries with customerConfirmed=true
        const readyForCode = data.filter(
          (d: Delivery) => d.status === 'awaiting_confirmation' && d.customerConfirmed === true
        );
        
        if (readyForCode.length > 0) {
          console.log('Customer confirmed deliveries ready for code:', readyForCode.length);
          // Optional: Show a toast notification here
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Auto-refresh every 10 seconds when there are awaiting_confirmation deliveries
  useEffect(() => {
    const hasAwaitingConfirmation = deliveries.some(
      d => d.status === 'awaiting_confirmation'
    );
    
    if (!hasAwaitingConfirmation) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing to check for customer confirmations...');
      fetchDashboardData(false);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [deliveries, fetchDashboardData]);

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/rider/toggle-availability', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !isOnline })
      });

      if (response.ok) {
        setIsOnline(!isOnline);
        setStats(prev => ({ ...prev, isAvailable: !isOnline }));
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const acceptDelivery = async (deliveryId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/riders/accept-delivery/${deliveryId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setDeliveries(prev => 
          prev.map(d => 
            d.id === deliveryId 
              ? { ...d, status: 'accepted' } 
              : d
          )
        );
        alert('Delivery accepted!');
      }
    } catch (error) {
      console.error('Error accepting delivery:', error);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shd-api/api/riders/update-delivery/${deliveryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (status === 'delivered') {
          // Show instruction to rider - NO CODE displayed
          alert(`✅ Delivery marked as delivered!\n\n📱 Please ask the customer to confirm receipt in their app.\n\n⚠️ The customer will receive a confirmation code to share with you.\n\n⏰ You have 15 minutes to enter the code.`);
          
          setDeliveries(prev => 
            prev.map(d => 
              d.id === deliveryId 
                ? { ...d, status: 'awaiting_confirmation', customerConfirmed: false } 
                : d
            )
          );
          
          // Start auto-refresh since we're now waiting for customer confirmation
          // The useEffect will handle this
        } else {
          setDeliveries(prev => 
            prev.map(d => 
              d.id === deliveryId 
                ? { ...d, status: status as any } 
                : d
            )
          );
        }
        
        // Refresh stats after delivery completion
        if (status === 'delivered') {
          const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (statsResponse.ok) {
            const data = await statsResponse.json();
            setStats(data);
            setCustomerConfirmedCount(data.awaitingCustomerConfirmed || 0);
          }
        }
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleVerifyConfirmation = async () => {
    if (!selectedDeliveryId || !confirmationCode) {
      alert('Please enter the confirmation code');
      return;
    }

    if (confirmationCode.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shd-api/api/riders/verify-confirmation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deliveryId: selectedDeliveryId,
          confirmationCode: confirmationCode
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}\n\n💰 Earnings: KSh ${data.delivery?.earnings || 0}`);
        
        // Update delivery status
        setDeliveries(prev => 
          prev.map(d => 
            d.id === selectedDeliveryId 
              ? { ...d, status: 'completed' } 
              : d
          )
        );
        
        // Refresh stats
        const statsResponse = await fetch('/api/shd-api/api/riders/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data);
          setCustomerConfirmedCount(data.awaitingCustomerConfirmed || 0);
        }
        
        // Close modal
        setShowConfirmationModal(false);
        setConfirmationCode('');
        setSelectedDeliveryId(null);
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Invalid confirmation code'}`);
      }
    } catch (error) {
      console.error('Error verifying confirmation:', error);
      alert('Failed to verify confirmation code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      awaiting_confirmation: 'bg-orange-100 text-orange-800',
      completed: 'bg-accent text-white'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'PENDING',
      accepted: 'ACCEPTED',
      picked_up: 'PICKED UP',
      in_transit: 'IN TRANSIT',
      delivered: 'DELIVERED',
      awaiting_confirmation: '⏳ AWAITING CUSTOMER CODE',
      completed: '✅ COMPLETED'
    };
    return labels[status] || status.replace('_', ' ').toUpperCase();
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (activeTab === 'available') return d.status === 'pending';
    if (activeTab === 'ongoing') return ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status);
    if (activeTab === 'history') return d.status === 'completed' || d.status === 'delivered';
    return true;
  });

  // Count deliveries with customer confirmed
  const customerConfirmedReady = deliveries.filter(
    d => d.status === 'awaiting_confirmation' && d.customerConfirmed === true
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-surface">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary">🏍️ Rider Dashboard</h1>
              <p className="text-sm text-muted">Manage your deliveries and earnings</p>
              {customerConfirmedReady > 0 && (
                <div className="mt-2 bg-accent bg-opacity-20 border border-primary rounded-lg px-3 py-1 inline-flex items-center gap-2">
                  <span className="text-primary font-semibold animate-pulse">✅ {customerConfirmedReady} customer(s) have confirmed - Enter their codes!</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchDashboardData(false)}
                disabled={refreshing}
                className="px-4 py-2 bg-surface text-secondary rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm flex items-center gap-2"
              >
                {refreshing ? (
                  <>
                    <span className="animate-spin">⟳</span> Refreshing...
                  </>
                ) : (
                  '🔄 Refresh'
                )}
              </button>
              <button
                onClick={toggleAvailability}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  isOnline 
                    ? 'bg-primary text-white hover:bg-accent-dark' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </button>
              <Link
                href="/rider/profile"
                className="bg-surface p-2 rounded-full hover:bg-accent hover:text-white transition"
              >
                👤
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-surface hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total Deliveries</p>
                <p className="text-2xl font-bold text-secondary">{stats.totalDeliveries}</p>
              </div>
              <div className="bg-surface p-3 rounded-full text-primary">
                📦
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-surface hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total Earned</p>
                <p className="text-2xl font-bold text-primary">KSh {stats.totalEarned}</p>
              </div>
              <div className="bg-surface p-3 rounded-full text-primary">
                💰
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-surface hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Pending Payout</p>
                <p className="text-2xl font-bold text-accent-dark">KSh {stats.pendingPayout}</p>
              </div>
              <div className="bg-surface p-3 rounded-full text-accent-dark">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-surface hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Rating</p>
                <p className="text-2xl font-bold text-primary">⭐ {stats.rating}</p>
              </div>
              <div className="bg-surface p-3 rounded-full text-primary">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-surface">
          <div className="border-b border-surface">
            <div className="flex space-x-4 p-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                  activeTab === 'available'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-secondary hover:bg-accent hover:text-white'
                }`}
              >
                Available ({deliveries.filter(d => d.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                  activeTab === 'ongoing'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-secondary hover:bg-accent hover:text-white'
                }`}
              >
                Ongoing ({deliveries.filter(d => ['accepted', 'picked_up', 'in_transit', 'awaiting_confirmation'].includes(d.status)).length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-secondary text-white'
                    : 'bg-surface text-secondary hover:bg-accent hover:text-white'
                }`}
              >
                History ({deliveries.filter(d => d.status === 'completed' || d.status === 'delivered').length})
              </button>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="p-4">
            {filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">🚚</p>
                <h3 className="text-lg font-semibold text-secondary">No deliveries</h3>
                <p className="text-sm text-muted">
                  {activeTab === 'available' && 'No deliveries available at the moment. Check back later!'}
                  {activeTab === 'ongoing' && 'You don\'t have any ongoing deliveries.'}
                  {activeTab === 'history' && 'You haven\'t completed any deliveries yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="border border-surface rounded-lg p-4 hover:shadow-lg transition bg-white"
                  >
                    <div className="flex flex-wrap items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(delivery.status)}`}>
                            {getStatusLabel(delivery.status)}
                          </span>
                          <span className="text-sm text-muted">Order #{delivery.orderId}</span>
                          {delivery.status === 'awaiting_confirmation' && !delivery.customerConfirmed && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
                              🔴 WAITING FOR CUSTOMER
                            </span>
                          )}
                          {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
                            <span className="px-2 py-1 bg-accent bg-opacity-20 text-primary rounded-full text-xs font-semibold animate-pulse">
                              ✅ CUSTOMER CONFIRMED - Enter code now!
                            </span>
                          )}
                          {delivery.codeExpiresAt && delivery.status === 'awaiting_confirmation' && (
                            <span className="px-2 py-1 bg-surface text-muted rounded-full text-xs">
                              ⏰ Expires: {new Date(delivery.codeExpiresAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium text-secondary">Customer:</span> {delivery.customerName}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-secondary">Phone:</span> {delivery.customerPhone}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-secondary">Pickup:</span> {delivery.pickupLocation}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-secondary">Dropoff:</span> {delivery.dropoffLocation}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-secondary">Distance:</span> {delivery.distance} km
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-secondary">Earnings:</span> <span className="text-primary font-semibold">KSh {delivery.earnings}</span>
                          </p>
                          <p className="text-sm text-muted">
                            <span className="font-medium">Est. Time:</span> {delivery.estimatedTime}
                          </p>
                          {delivery.status === 'awaiting_confirmation' && !delivery.customerConfirmed && (
                            <div className="mt-2 bg-surface bg-opacity-30 border border-accent rounded-lg p-3">
                              <p className="text-sm text-secondary">
                                📱 Ask customer to confirm receipt in their app.
                              </p>
                              <p className="text-xs text-muted mt-1">
                                They will receive a code to share with you.
                              </p>
                              <p className="text-xs text-primary mt-1">
                                ⏳ Waiting for customer confirmation... (auto-refreshing)
                              </p>
                            </div>
                          )}
                          {delivery.customerConfirmed && delivery.status === 'awaiting_confirmation' && (
                            <div className="mt-2 bg-accent bg-opacity-10 border border-primary rounded-lg p-3 animate-pulse">
                              <p className="text-sm text-primary font-semibold">
                                ✅ Customer has confirmed receipt!
                              </p>
                              <p className="text-xs text-secondary mt-1">
                                Enter the 6-digit code they shared with you to complete the delivery.
                              </p>
                              {delivery.customerConfirmedAt && (
                                <p className="text-xs text-muted mt-1">
                                  Confirmed at: {new Date(delivery.customerConfirmedAt).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 mt-3 md:mt-0">
                        {delivery.status === 'pending' && (
                          <button
                            onClick={() => acceptDelivery(delivery.id)}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition text-sm font-semibold"
                          >
                            Accept Delivery
                          </button>
                        )}

                        {delivery.status === 'accepted' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition text-sm font-semibold"
                          >
                            Mark as Picked Up
                          </button>
                        )}

                        {delivery.status === 'picked_up' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition text-sm font-semibold"
                          >
                            Start Delivery
                          </button>
                        )}

                        {delivery.status === 'in_transit' && (
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition text-sm font-semibold"
                          >
                            Mark as Delivered
                          </button>
                        )}

                        {delivery.status === 'awaiting_confirmation' && (
                          <button
                            onClick={() => {
                              setSelectedDeliveryId(delivery.id);
                              setShowConfirmationModal(true);
                            }}
                            className={`px-6 py-2 rounded-lg transition text-sm font-semibold ${
                              delivery.customerConfirmed
                                ? 'bg-primary text-white hover:bg-accent-dark animate-pulse'
                                : 'bg-muted text-white cursor-not-allowed'
                            }`}
                            disabled={!delivery.customerConfirmed}
                            title={!delivery.customerConfirmed ? 'Waiting for customer to confirm receipt' : 'Enter the code from customer'}
                          >
                            {delivery.customerConfirmed ? '🔑 Enter Code from Customer' : '⏳ Waiting for Customer'}
                          </button>
                        )}

                        <Link
                          href={`/shd-pages/rider/delivery/${delivery.id}`}
                          className="text-primary hover:text-accent-dark underline text-sm text-center"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link
            href="/rider/earnings"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-surface flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted">My Earnings</p>
              <p className="font-semibold text-secondary">View payment history</p>
            </div>
            <span className="text-2xl">💰</span>
          </Link>

          <Link
            href="/rider/profile"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-surface flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted">Profile</p>
              <p className="font-semibold text-secondary">Update your details</p>
            </div>
            <span className="text-2xl">👤</span>
          </Link>

          <Link
            href="/rider/support"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-surface flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted">Support</p>
              <p className="font-semibold text-secondary">Get help</p>
            </div>
            <span className="text-2xl">🆘</span>
          </Link>
        </div>
      </div>

      {/* Confirmation Code Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-surface shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-xl font-bold text-secondary">Enter Confirmation Code</h3>
              <p className="text-sm text-muted mt-2">
                Please enter the 6-digit code shared by the customer to complete this delivery.
              </p>
            </div>

            <div className="bg-accent bg-opacity-10 border border-primary rounded-lg p-4 mb-6">
              <p className="text-sm text-secondary">
                ✅ The customer has confirmed receipt and should have shared a 6-digit code with you.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Confirmation Code
              </label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full border-2 border-surface rounded-lg px-4 py-3 text-lg font-mono text-center tracking-widest focus:outline-none focus:border-primary transition"
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-muted mt-2 text-center">
                Enter the 6-digit code provided by the customer
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyConfirmation}
                disabled={verifying || confirmationCode.length !== 6}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  verifying || confirmationCode.length !== 6
                    ? 'bg-muted text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-accent-dark'
                }`}
              >
                {verifying ? 'Verifying...' : '✅ Verify & Complete'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  setConfirmationCode('');
                  setSelectedDeliveryId(null);
                }}
                className="flex-1 bg-surface text-secondary py-3 rounded-lg hover:bg-accent hover:text-white transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}