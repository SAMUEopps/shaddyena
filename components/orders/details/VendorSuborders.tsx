/*import { Order, Suborder } from '@/components/orders/details/types/orders';
import { User } from '@/contexts/AuthContext';
import { OrderService } from '@/components/orders/details/services/orderService';

interface VendorSubordersProps {
  suborders: Suborder[];
  order: Order;
  selectedSuborderId: string | null;
  onSelectSuborder: (id: string) => void;
  user: User;
  onStatusUpdate: (status: string, isMainOrder: boolean, suborderId?: string) => Promise<void>;
  updatingStatus: boolean;
}

export default function VendorSuborders({
  suborders,
  order,
  selectedSuborderId,
  onSelectSuborder,
  user,
  onStatusUpdate,
  updatingStatus
}: VendorSubordersProps) {
  const isRider = user.role === 'delivery';
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Vendor Orders</h2>
        <p className="text-sm text-gray-600">{suborders.length} vendor{suborders.length !== 1 ? 's' : ''} involved</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {suborders.map((suborder, index) => {
            const isSelected = suborder._id === selectedSuborderId;
            const vendorItems = order.items.filter(item => item.vendorId === suborder.vendorId);
            const isAssignedToCurrentRider = isRider && suborder.riderId === user._id;
            
            return (
              <div 
                key={index} 
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-[#bf2c7e] bg-pink-50' : 
                  isAssignedToCurrentRider ? 'border-blue-300 bg-blue-50' : 
                  'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onSelectSuborder(suborder._id || '')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        Vendor Order #{index + 1} 
                        {isSelected && ' (Selected)'}
                        {isAssignedToCurrentRider && ' (Your Delivery)'}
                      </h3>
                      {isSelected && (
                        <span className="text-xs bg-[#bf2c7e] text-white px-2 py-0.5 rounded">Active</span>
                      )}
                      {isAssignedToCurrentRider && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Your Assignment</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Vendor ID: {suborder.vendorId.substring(0, 8)}...</p>
                    <p className="text-xs text-gray-500">{vendorItems.length} item{vendorItems.length !== 1 ? 's' : ''}</p>
                    {suborder.riderId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Rider: {OrderService.getRiderName(suborder.riderId)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${OrderService.getStatusColor(suborder.status)}`}>
                      {suborder.status.replace('_', ' ')}
                    </span>
                    {isRider && isAssignedToCurrentRider && suborder.status === 'ASSIGNED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusUpdate('PICKED_UP', false, suborder._id);
                        }}
                        disabled={updatingStatus}
                        className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        {updatingStatus ? 'Processing...' : 'Mark as Picked Up'}
                      </button>
                    )}
                    {isRider && isAssignedToCurrentRider && suborder.status === 'PICKED_UP' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusUpdate('IN_TRANSIT', false, suborder._id);
                        }}
                        disabled={updatingStatus}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updatingStatus ? 'Processing...' : 'Mark as In Transit'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-gray-900">{OrderService.formatCurrency(suborder.amount, order.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="text-red-600">-{OrderService.formatCurrency(suborder.commission, order.currency)}</span>
                  </div>
                  {suborder.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="text-green-600">+{OrderService.formatCurrency(suborder.deliveryFee, order.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span className="text-gray-900">Net Amount:</span>
                    <span className="text-green-700">{OrderService.formatCurrency(suborder.netAmount, order.currency)}</span>
                  </div>
                  {suborder.deliveryDetails && (
                    <div className="pt-2 border-t mt-2">
                      <p className="text-xs text-gray-600">
                        <strong>Pickup:</strong> {suborder.deliveryDetails.pickupAddress || 'Vendor Shop'}
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Dropoff:</strong> {suborder.deliveryDetails.dropoffAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}*/

// components/orders/details/VendorSuborders.tsx
'use client';

import { Order, Suborder } from '@/components/orders/details/types/orders';
import { User } from '@/contexts/AuthContext';
import { OrderService } from '@/components/orders/details/services/orderService';
import { Store, Package, ChevronRight, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';

interface VendorSubordersProps {
  suborders: Suborder[];
  order: Order;
  selectedSuborderId: string | null;
  onSelectSuborder: (id: string) => void;
  user: User;
  onStatusUpdate: (status: string, isMainOrder: boolean, suborderId?: string) => Promise<void>;
  updatingStatus: boolean;
}

export default function VendorSuborders({
  suborders,
  order,
  selectedSuborderId,
  onSelectSuborder,
  user,
  onStatusUpdate,
  updatingStatus
}: VendorSubordersProps) {
  const isRider = user.role === 'delivery';
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_TRANSIT':
      case 'SHIPPED':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'READY_FOR_PICKUP':
        return <Package className="w-4 h-4 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'border-emerald-200 bg-emerald-50/50';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'border-green-200 bg-green-50/50';
      case 'IN_TRANSIT':
      case 'SHIPPED':
        return 'border-blue-200 bg-blue-50/50';
      case 'READY_FOR_PICKUP':
        return 'border-yellow-200 bg-yellow-50/50';
      case 'ASSIGNED':
      case 'PICKED_UP':
        return 'border-purple-200 bg-purple-50/50';
      case 'PENDING':
      case 'PROCESSING':
        return 'border-gray-200 bg-gray-50/50';
      case 'CANCELLED':
        return 'border-red-200 bg-red-50/50';
      default:
        return 'border-gray-200 bg-gray-50/50';
    }
  };
  
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Store className="w-5 h-5 text-[var(--color-primary)]" />
              Vendor Orders
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {suborders.length} vendor{suborders.length !== 1 ? 's' : ''} involved
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {suborders.map((suborder, index) => {
            const isSelected = suborder._id === selectedSuborderId;
            const vendorItems = order.items.filter(item => item.vendorId === suborder.vendorId);
            const totalItems = vendorItems.reduce((sum, item) => sum + item.quantity, 0);
            const isAssignedToCurrentRider = isRider && suborder.riderId === user._id;
            
            return (
              <div 
                key={index} 
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isSelected 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-md' 
                    : isAssignedToCurrentRider 
                      ? 'border-blue-300 bg-blue-50/30' 
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                }`}
                onClick={() => onSelectSuborder(suborder._id || '')}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(suborder.status)}
                        <h3 className="font-semibold text-[var(--color-text)]">
                          Vendor Order #{index + 1}
                        </h3>
                      </div>
                      {isSelected && (
                        <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                      {isAssignedToCurrentRider && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Your Delivery
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </p>
                    
                    {suborder.riderId && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Rider: {OrderService.getRiderName(suborder.riderId)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(suborder.status)} border`}>
                      {suborder.status.replace('_', ' ')}
                    </span>
                    
                    {isRider && isAssignedToCurrentRider && suborder.status === 'ASSIGNED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusUpdate('PICKED_UP', false, suborder._id);
                        }}
                        disabled={updatingStatus}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-all duration-300 disabled:opacity-50"
                      >
                        {updatingStatus ? 'Processing...' : 'Mark as Picked Up'}
                      </button>
                    )}
                    
                    {isRider && isAssignedToCurrentRider && suborder.status === 'PICKED_UP' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusUpdate('IN_TRANSIT', false, suborder._id);
                        }}
                        disabled={updatingStatus}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                      >
                        {updatingStatus ? 'Processing...' : 'Mark as In Transit'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--color-text-muted)]">Subtotal</p>
                      <p className="font-semibold text-[var(--color-text)]">
                        {OrderService.formatCurrency(suborder.amount, order.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--color-text-muted)]">Commission</p>
                      <p className="font-semibold text-red-500">
                        -{OrderService.formatCurrency(suborder.commission, order.currency)}
                      </p>
                    </div>
                    {suborder.deliveryFee > 0 && (
                      <div>
                        <p className="text-[var(--color-text-muted)]">Delivery Fee</p>
                        <p className="font-semibold text-green-500">
                          +{OrderService.formatCurrency(suborder.deliveryFee, order.currency)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-[var(--color-text-muted)]">Net Amount</p>
                      <p className="font-bold text-[var(--color-primary)]">
                        {OrderService.formatCurrency(suborder.netAmount, order.currency)}
                      </p>
                    </div>
                  </div>
                  
                  {suborder.deliveryDetails && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <strong>Pickup:</strong> {suborder.deliveryDetails.pickupAddress || 'Vendor Shop'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <strong>Dropoff:</strong> {suborder.deliveryDetails.dropoffAddress}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onSelectSuborder(suborder._id || '')}
                    className="text-[var(--color-primary)] text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}