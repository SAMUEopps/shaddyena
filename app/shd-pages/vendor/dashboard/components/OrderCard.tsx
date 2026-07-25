// 'use client';

// interface Order {
//   _id: string;
//   orderNumber: string;
//   totalAmount: number;
//   status: string;
//   customerId: {
//     name: string;
//   };
//   products: any[];
//   createdAt: string;
// }

// interface OrderCardProps {
//   order: Order;
//   onStatusChange: (orderId: string, status: string) => void;
// }

// export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
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

//   const statusOptions = [
//     { value: 'pending', label: '⏳ Pending' },
//     { value: 'processing', label: '⚙️ Processing' },
//     { value: 'packed', label: '📦 Packed' },
//     { value: 'shipped', label: '🚚 Shipped' },
//     { value: 'delivered', label: '✅ Delivered' },
//     { value: 'cancelled', label: '❌ Cancelled' }
//   ];

//   return (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 border border-surface">
//       <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
//             <h3 className="font-bold text-sm sm:text-base text-secondary">
//               Order #{order.orderNumber}
//             </h3>
//             <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(order.status)}`}>
//               {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//             </span>
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs sm:text-sm">
//             <p className="text-muted truncate">
//               👤 <span className="text-secondary font-medium">{order.customerId?.name || 'Unknown'}</span>
//             </p>
//             <p className="text-muted truncate">
//               💰 <span className="text-primary font-bold">KSh {order.totalAmount.toLocaleString()}</span>
//             </p>
//             <p className="text-muted truncate">
//               📅 <span className="text-secondary font-medium">
//                 {new Date(order.createdAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'short',
//                   day: 'numeric'
//                 })}
//               </span>
//             </p>
//             <p className="text-muted sm:col-span-2 lg:col-span-3 truncate">
//               📦 <span className="text-secondary font-medium">{order.products.length} items</span>
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto lg:min-w-[200px]">
//           <select
//             value={order.status}
//             onChange={(e) => onStatusChange(order._id, e.target.value)}
//             className="flex-1 lg:flex-none border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary text-xs sm:text-sm font-medium"
//           >
//             {statusOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={() => alert('Print invoice functionality coming soon')}
//             className="flex-1 lg:flex-none bg-surface hover:bg-surface/70 text-secondary px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap"
//           >
//             🖨️ Invoice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/shd-pages/vendor/components/OrderCard.tsx
'use client';

import { Order, Rider } from '@/types/vendor';
import { useState } from 'react';


interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
  onAssignRider: (orderId: string, riderId: string) => void;
  availableRiders: Rider[];
}

export default function OrderCard({ 
  order, 
  onStatusChange, 
  onAssignRider,
  availableRiders 
}: OrderCardProps) {
  const [showRiderSelect, setShowRiderSelect] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');

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

  const getDeliveryStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; emoji: string }> = {
      pending: { color: 'bg-gray-100 text-gray-700', emoji: '⏳' },
      assigned: { color: 'bg-blue-100 text-blue-700', emoji: '👤' },
      picked_up: { color: 'bg-purple-100 text-purple-700', emoji: '📦' },
      in_transit: { color: 'bg-indigo-100 text-indigo-700', emoji: '🚚' },
      delivered: { color: 'bg-green-100 text-green-700', emoji: '✅' }
    };
    const config = configs[status] || configs.pending;
    return `${config.emoji} ${status.replace('_', ' ').toUpperCase()}`;
  };

  const handleAssignRider = () => {
    if (selectedRider) {
      onAssignRider(order._id, selectedRider);
      setShowRiderSelect(false);
      setSelectedRider('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 border border-surface">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-bold text-sm sm:text-base text-secondary">
              Order #{order.orderNumber}
            </h3>
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.deliveryStatus && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
                {getDeliveryStatusBadge(order.deliveryStatus)}
              </span>
            )}
          </div>
          
          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <p className="text-muted truncate">
              👤 <span className="text-secondary font-medium">{order.customerId?.name || 'Unknown'}</span>
            </p>
            <p className="text-muted truncate">
              📱 <span className="text-secondary font-medium">{order.deliveryPhone || 'N/A'}</span>
            </p>
            <p className="text-muted truncate">
              💰 <span className="text-primary font-bold">KSh {order.totalAmount.toLocaleString()}</span>
            </p>
            <p className="text-muted sm:col-span-2 truncate">
              📍 <span className="text-secondary font-medium">{order.deliveryAddress}</span>
            </p>
            <p className="text-muted truncate">
              📅 <span className="text-secondary font-medium">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </p>
            <p className="text-muted truncate">
              📦 <span className="text-secondary font-medium">{order.products.length} items</span>
            </p>
          </div>

          {/* Rider Info */}
          {order.rider && (
            <div className="mt-2 p-2 bg-surface/50 rounded-lg flex items-center gap-3">
              <span className="text-lg">🏍️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary">{order.rider.name}</p>
                <p className="text-xs text-muted">
                  📱 {order.rider.phone} • 🚗 {order.rider.vehicleType} • ⭐ {order.rider.rating}
                </p>
              </div>
              {order.riderAssignedAt && (
                <span className="text-xs text-muted">
                  Assigned: {new Date(order.riderAssignedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full lg:w-auto lg:min-w-[200px]">
          {/* Status Update */}
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="w-full border-2 border-surface bg-background rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:border-primary transition-colors duration-200 text-secondary text-xs sm:text-sm font-medium"
          >
            <option value="pending">⏳ Pending</option>
            <option value="processing">⚙️ Processing</option>
            <option value="packed">📦 Packed</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="delivered">✅ Delivered</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>

          {/* Assign Rider Button */}
          {!order.rider && order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={() => setShowRiderSelect(!showRiderSelect)}
              className="w-full bg-primary text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium text-xs sm:text-sm"
            >
              🏍️ Assign Rider
            </button>
          )}

          {/* Rider Selection Dropdown */}
          {showRiderSelect && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary mb-2"
              >
                <option value="">Select a rider...</option>
                {availableRiders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.name} - {rider.vehicleType} (⭐ {rider.rating})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAssignRider}
                  disabled={!selectedRider}
                  className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowRiderSelect(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-400 transition text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => alert('Print invoice functionality coming soon')}
            className="w-full bg-surface hover:bg-surface/70 text-secondary px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm"
          >
            🖨️ Invoice
          </button>
        </div>
      </div>
    </div>
  );
}