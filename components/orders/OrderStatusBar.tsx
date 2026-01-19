/*'use client';

import { useState } from 'react';

interface Suborder {
  _id?: string;
  vendorId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT';
  amount: number;
  commission: number;
  netAmount: number;
}

interface OrderStatusBarProps {
  role: 'customer' | 'vendor' | 'admin' |'delivery';
  orderStatus: string;
  paymentStatus: string;
  vendorSuborder?: Suborder | null;
  suborders?: Suborder[];
  onStatusUpdate: (status: string, isMainOrder?: boolean, suborderId?: string) => Promise<void>;
  onSuborderSelect?: (suborderId: string) => void;
  selectedSuborderId?: string | null;
  isLoading?: boolean;
}

export default function OrderStatusBar({
  role,
  orderStatus,
  paymentStatus,
  vendorSuborder,
  suborders = [],
  onStatusUpdate,
  onSuborderSelect,
  selectedSuborderId,
  isLoading = false
}: OrderStatusBarProps) {
  const [localSelectedSuborderId, setLocalSelectedSuborderId] = useState<string | null>(selectedSuborderId || null);

  // Determine which suborder we're working with
  const effectiveSuborder = role === 'vendor' 
    ? vendorSuborder 
    : localSelectedSuborderId 
      ? suborders.find(so => so._id === localSelectedSuborderId)
      : null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'PAID': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SHIPPED': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
      case 'PROCESSING': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
      case 'FAILED':
      case 'REFUNDED': 
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Vendor actions
  const getVendorActions = () => {
    if (role !== 'vendor' || !effectiveSuborder) return null;

    switch (effectiveSuborder.status) {
      case 'PENDING':
        return (
          <button
            onClick={() => onStatusUpdate('SHIPPED', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Mark as Shipped'}
          </button>
        );
      
      case 'SHIPPED':
        return (
          <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            Waiting for admin to confirm delivery
          </div>
        );
      
      default:
        return null;
    }
  };

  // Admin actions
  const getAdminActions = () => {
    if (role !== 'admin') return null;

    // If we have a selected suborder
    if (effectiveSuborder) {
      switch (effectiveSuborder.status) {
        case 'SHIPPED':
          return (
            <button
              onClick={() => onStatusUpdate('DELIVERED', false, effectiveSuborder._id)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm Delivery'}
            </button>
          );
        
        case 'DELIVERED':
          return (
            <div className="text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-lg">
              Delivered ✓
            </div>
          );
        
        default:
          return null;
      }
    }

    // Main order actions (no specific suborder selected)
    switch (orderStatus) {
      case 'DELIVERED':
        return (
          <button
            onClick={() => onStatusUpdate('COMPLETED', true)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Mark as Completed'}
          </button>
        );
      
      case 'CANCELLED':
      case 'COMPLETED':
        return null;
      
      default:
        return (
          <button
            onClick={() => onStatusUpdate('CANCELLED', true)}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 ml-2"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        );
    }
  };

  const handleSuborderSelect = (suborderId: string) => {
    setLocalSelectedSuborderId(suborderId);
    if (onSuborderSelect) {
      onSuborderSelect(suborderId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Display *
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(orderStatus)}`}>
              {role === 'vendor' && effectiveSuborder ? `Your Status: ${effectiveSuborder.status}` : orderStatus}
            </span>
            {getVendorActions()}
            {getAdminActions()}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(paymentStatus)}`}>
              Payment: {paymentStatus}
            </span>
            {paymentStatus === 'PAID' && (
              <span className="text-xs text-green-600">
                ✓ Paid
              </span>
            )}
          </div>
        </div>

        {/* Admin Suborder Selector *
        {role === 'admin' && suborders.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Manage Suborder:</span>
            <select
              value={localSelectedSuborderId || ''}
              onChange={(e) => handleSuborderSelect(e.target.value)}
              className="text-sm border rounded px-3 py-1 bg-white"
            >
              <option value="">Select Vendor Order</option>
              {suborders.map((suborder, index) => (
                <option key={suborder._id} value={suborder._id}>
                  Vendor {index + 1} - {suborder.status} (KSh {suborder.netAmount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Instructions *
      {(role === 'vendor' || role === 'admin') && (
        <div className={`p-4 rounded-lg ${
          role === 'vendor' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
        }`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 mt-0.5 mr-2 ${role === 'vendor' ? 'text-blue-600' : 'text-purple-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className={`font-medium ${role === 'vendor' ? 'text-blue-800' : 'text-purple-800'}`}>
                {role === 'vendor' ? 'Status Update Instructions' : 'Admin Controls'}
              </h4>
              <ul className={`text-sm mt-1 space-y-1 ${role === 'vendor' ? 'text-blue-700' : 'text-purple-700'}`}>
                {role === 'vendor' ? (
                  <>
                    <li>• Mark as <strong>Shipped</strong> when you have dispatched the items</li>
                    <li>• Only admin can mark orders as <strong>Delivered</strong> after confirming with customer</li>
                    <li>• Your earnings will be available 24 hours after delivery confirmation</li>
                  </>
                ) : (
                  <>
                    <li>• Select a vendor order from the dropdown to manage it</li>
                    <li>• Confirm <strong>Delivery</strong> after verifying with customer</li>
                    <li>• Mark main order as <strong>Completed</strong> when all suborders are delivered</li>
                    <li>• Use <strong>Cancel</strong> only for problematic orders</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useState } from 'react';

// Define a simplified Suborder interface for OrderStatusBar
interface StatusBarSuborder {
  _id?: string;
  vendorId: string;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  amount: number;
  commission: number;
  netAmount: number;
  deliveryFee?: number;
  riderId?: string; // Keep as string only for StatusBar
}

interface OrderStatusBarProps {
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
  orderStatus: string;
  paymentStatus: string;
  vendorSuborder?: StatusBarSuborder | null;
  suborders?: StatusBarSuborder[];
  onStatusUpdate: (status: string, isMainOrder?: boolean, suborderId?: string) => Promise<void>;
  onSuborderSelect?: (suborderId: string) => void;
  selectedSuborderId?: string | null;
  isLoading?: boolean;
}

export default function OrderStatusBar({
  role,
  orderStatus,
  paymentStatus,
  vendorSuborder,
  suborders = [],
  onStatusUpdate,
  onSuborderSelect,
  selectedSuborderId,
  isLoading = false
}: OrderStatusBarProps) {
  const [localSelectedSuborderId, setLocalSelectedSuborderId] = useState<string | null>(selectedSuborderId || null);

  // Determine which suborder we're working with
  const effectiveSuborder = role === 'vendor' 
    ? vendorSuborder 
    : localSelectedSuborderId 
      ? suborders.find(so => so._id === localSelectedSuborderId)
      : null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED':
      case 'COMPLETED':
      case 'PAID': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_TRANSIT':
      case 'SHIPPED': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PICKED_UP':
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'READY_FOR_PICKUP':
      case 'PROCESSING': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
      case 'FAILED':
      case 'REFUNDED': 
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Vendor actions
  const getVendorActions = () => {
    if (role !== 'vendor' || !effectiveSuborder) return null;

    switch (effectiveSuborder.status) {
      case 'PROCESSING':
        return (
          <button
            onClick={() => onStatusUpdate('READY_FOR_PICKUP', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Mark as Ready for Pickup'}
          </button>
        );
      
      case 'READY_FOR_PICKUP':
        return (
          <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-lg">
            ✅ Package ready. Waiting for rider assignment...
          </div>
        );
      
      case 'ASSIGNED':
        return (
          <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            🚚 Rider assigned. Awaiting pickup...
          </div>
        );
      
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return (
          <div className="text-sm text-gray-600 bg-purple-50 px-4 py-2 rounded-lg">
            📦 Package in transit with rider
          </div>
        );
      
      case 'DELIVERED':
        return (
          <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            ✅ Delivered! Earnings will be processed soon.
          </div>
        );
      
      default:
        return null;
    }
  };

  // Admin actions
  const getAdminActions = () => {
    if (role !== 'admin') return null;

    // If we have a selected suborder
    if (effectiveSuborder) {
      switch (effectiveSuborder.status) {
        case 'READY_FOR_PICKUP':
          return (
            <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
              📦 Ready for pickup. Assign a rider.
            </div>
          );
        
        case 'ASSIGNED':
          return (
            <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              🚚 Rider assigned. Awaiting pickup.
            </div>
          );
        
        case 'PICKED_UP':
          return (
            <div className="text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
              📦 Package picked up by rider.
            </div>
          );
        
        case 'IN_TRANSIT':
          return (
            <button
              onClick={() => onStatusUpdate('DELIVERED', false, effectiveSuborder._id)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm Delivery'}
            </button>
          );
        
        case 'DELIVERED':
          return (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              ✅ Delivered
            </div>
          );
        
        default:
          return null;
      }
    }

    // Main order actions (no specific suborder selected)
    switch (orderStatus) {
      case 'DELIVERED':
        // Check if all suborders are delivered
        const allDelivered = suborders.every(so => 
          so.status === 'DELIVERED' || so.status === 'CANCELLED'
        );
        
        if (allDelivered) {
          return (
            <button
              onClick={() => onStatusUpdate('COMPLETED', true)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Mark as Completed'}
            </button>
          );
        } else {
          return (
            <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
              ⏳ Waiting for all vendor orders to be delivered
            </div>
          );
        }
      
      case 'CANCELLED':
      case 'COMPLETED':
        return null;
      
      default:
        return (
          <button
            onClick={() => onStatusUpdate('CANCELLED', true)}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 ml-2"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        );
    }
  };

  // Rider actions
  const getRiderActions = () => {
    if (role !== 'delivery' || !effectiveSuborder) return null;

    switch (effectiveSuborder.status) {
      case 'ASSIGNED':
        return (
          <button
            onClick={() => onStatusUpdate('PICKED_UP', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Mark as Picked Up'}
          </button>
        );
      
      case 'PICKED_UP':
        return (
          <button
            onClick={() => onStatusUpdate('IN_TRANSIT', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Mark as In Transit'}
          </button>
        );
      
      case 'IN_TRANSIT':
        return (
          <button
            onClick={() => onStatusUpdate('DELIVERED', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm Delivery'}
          </button>
        );
      
      case 'DELIVERED':
        return (
          <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            ✅ Delivery completed
          </div>
        );
      
      default:
        return null;
    }
  };

  const handleSuborderSelect = (suborderId: string) => {
    setLocalSelectedSuborderId(suborderId);
    if (onSuborderSelect) {
      onSuborderSelect(suborderId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Display */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              role === 'vendor' && effectiveSuborder ? effectiveSuborder.status : orderStatus
            )}`}>
              {role === 'vendor' && effectiveSuborder 
                ? `Your Status: ${effectiveSuborder.status.replace('_', ' ')}` 
                : orderStatus}
            </span>
            {getVendorActions()}
            {getAdminActions()}
            {getRiderActions()}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(paymentStatus)}`}>
              Payment: {paymentStatus}
            </span>
            {paymentStatus === 'PAID' && (
              <span className="text-xs text-green-600">
                ✓ Paid
              </span>
            )}
            {effectiveSuborder?.deliveryFee && effectiveSuborder.deliveryFee > 0 && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                🚚 Delivery: {effectiveSuborder.deliveryFee} KES
              </span>
            )}
          </div>
        </div>

        {/* Suborder Selector (Admin & Rider) */}
        {(role === 'admin' || role === 'delivery') && suborders.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Manage Suborder:</span>
            <select
              value={localSelectedSuborderId || ''}
              onChange={(e) => handleSuborderSelect(e.target.value)}
              className="text-sm border rounded px-3 py-1 bg-white"
            >
              <option value="">Select Vendor Order</option>
              {suborders.map((suborder, index) => (
                <option key={suborder._id} value={suborder._id}>
                  Vendor {index + 1} - {suborder.status.replace('_', ' ')} (KSh {suborder.netAmount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Instructions */}
      {(role === 'vendor' || role === 'admin' || role === 'delivery') && (
        <div className={`p-4 rounded-lg ${
          role === 'vendor' ? 'bg-blue-50 border border-blue-200' : 
          role === 'delivery' ? 'bg-green-50 border border-green-200' : 
          'bg-purple-50 border border-purple-200'
        }`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 mt-0.5 mr-2 ${
              role === 'vendor' ? 'text-blue-600' : 
              role === 'delivery' ? 'text-green-600' : 
              'text-purple-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className={`font-medium ${
                role === 'vendor' ? 'text-blue-800' : 
                role === 'delivery' ? 'text-green-800' : 
                'text-purple-800'
              }`}>
                {role === 'vendor' ? 'Status Update Instructions' : 
                 role === 'delivery' ? 'Delivery Instructions' : 
                 'Admin Controls'}
              </h4>
              <ul className={`text-sm mt-1 space-y-1 ${
                role === 'vendor' ? 'text-blue-700' : 
                role === 'delivery' ? 'text-green-700' : 
                'text-purple-700'
              }`}>
                {role === 'vendor' ? (
                  <>
                    <li>• Mark as <strong>Ready for Pickup</strong> when package is prepared</li>
                    <li>• Rider will be assigned by admin after marking as ready</li>
                    <li>• Your earnings will be available 24 hours after delivery confirmation</li>
                    <li>• Delivery fee is paid by customer separately from your earnings</li>
                  </>
                ) : role === 'delivery' ? (
                  <>
                    <li>• Mark as <strong>Picked Up</strong> after collecting from vendor</li>
                    <li>• Mark as <strong>In Transit</strong> when en route to customer</li>
                    <li>• Mark as <strong>Delivered</strong> after successful delivery</li>
                    <li>• Your delivery fee will be paid 24 hours after delivery confirmation</li>
                  </>
                ) : (
                  <>
                    <li>• Assign a rider when vendor marks order as <strong>Ready for Pickup</strong></li>
                    <li>• Confirm <strong>Delivery</strong> after verifying with customer</li>
                    <li>• Mark main order as <strong>Completed</strong> when all suborders are delivered</li>
                    <li>• Use <strong>Cancel</strong> only for problematic orders</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}