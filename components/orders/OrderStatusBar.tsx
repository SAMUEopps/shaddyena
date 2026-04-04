/*'use client';

import { useState } from 'react';
import { Types } from 'mongoose';

export interface StatusBarSuborder {
  _id?: string;
  vendorId: string;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED' | 'SHIPPED';
  amount: number;
  commission: number;
  netAmount: number;
  deliveryFee?: number;
  riderId?: string | Types.ObjectId | undefined;
  deliveryDetails?: {
    pickupAddress?: string;
    dropoffAddress?: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
    confirmedAt?: string | Date;
    riderConfirmedAt?: string | Date;
  };
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
  onDeliveryFeePayment?: (suborderId: string, amount: number) => Promise<void>; 
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
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
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


  const getCustomerActions = () => {
  if (role !== 'customer') return null;

  // For customer, we need to check if ANY suborder is DELIVERED or IN_TRANSIT
  const canConfirmSuborder = suborders.find(so => 
    ['DELIVERED'].includes(so.status) && 
    !so.deliveryDetails?.confirmationCode // Check if code hasn been generated yet
  );
  
  const hasCodeSuborder = suborders.find(so => 
    so.deliveryDetails?.confirmationCode && !so.deliveryDetails?.riderConfirmedAt
  );
  
  const confirmedSuborder = suborders.find(so => 
    so.status === 'CONFIRMED' || so.deliveryDetails?.riderConfirmedAt
  );
  
  if (canConfirmSuborder) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
          📦 Package delivered. Please confirm receipt.
        </div>
        <button
          onClick={() => onStatusUpdate('DELIVERED', false, canConfirmSuborder._id)}
          disabled={isLoading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Confirming...' : 'Confirm Delivery Received.'}
        </button>
        <p className="text-xs text-gray-500">
          Once confirmed, a delivery code will be generated for the rider.
        </p>
      </div>
    );
  }
  
  if (hasCodeSuborder?.deliveryDetails?.confirmationCode) {
    return (
      <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
        ✅ Confirmation code generated! 
        <div className="mt-1 font-mono text-lg font-bold">
          Code: {hasCodeSuborder.deliveryDetails.confirmationCode}
        </div>
        <p className="text-xs mt-1">Share this code with the delivery rider.</p>
        <p className="text-xs text-yellow-600 mt-1">
          ⏳ Waiting for rider to verify the code...
        </p>
      </div>
    );
  }
  
  if (confirmedSuborder) {
    return (
      <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
        ✅ Delivery fully confirmed by both parties!
        {confirmedSuborder.deliveryDetails?.riderConfirmedAt && (
          <p className="text-xs mt-1">
            Verified at: {new Date(confirmedSuborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  
  return null;
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
            ✅ Delivered! Waiting for customer confirmation.
          </div>
        );
      
      case 'CONFIRMED':
        return (
          <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
            ✅ Delivery confirmed by customer! Earnings will be processed soon.
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
              {isLoading ? 'Confirming...' : 'Mark as Delivered'}
            </button>
          );
        
        case 'DELIVERED':
          return (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              ✅ Delivered. Waiting for customer confirmation.
            </div>
          );
        
        case 'CONFIRMED':
          return (
            <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              ✅ Delivery confirmed by customer.
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
          so.status === 'DELIVERED' || so.status === 'CANCELLED' || so.status === 'CONFIRMED'
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
            {isLoading ? 'Processing...' : 'Mark as Delivered'}
          </button>
        );
      
      case 'DELIVERED':
        // Check if customer has confirmed
        if (effectiveSuborder.deliveryDetails?.confirmationCode) {
          return (
            <div className="space-y-3">
              <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                ⏳ Customer has confirmed. Ask for confirmation code.
              </div>
              <button
                onClick={() => {
                  const code = prompt('Enter the 8-digit confirmation code from customer:');
                  if (code && code === effectiveSuborder.deliveryDetails?.confirmationCode) {
                    // Code matches, update to CONFIRMED
                    onStatusUpdate('CONFIRMED', false, effectiveSuborder._id);
                  } else if (code) {
                    alert('Invalid confirmation code');
                  }
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Enter Confirmation Code'}
              </button>
            </div>
          );
        }
        return (
          <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
            📦 Delivered. Waiting for customer confirmation.
          </div>
        );
      
      case 'CONFIRMED':
        return (
          <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
            ✅ Delivery fully confirmed! Payment will be processed soon.
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

  // For customer view, show a summary of suborder statuses
  const getCustomerStatusSummary = () => {
    if (role !== 'customer' || suborders.length === 0) return null;

    const statusCounts: Record<string, number> = {
      CONFIRMED: 0,
      DELIVERED: 0,
      IN_TRANSIT: 0,
      PICKED_UP: 0,
      ASSIGNED: 0,
      READY_FOR_PICKUP: 0,
      PROCESSING: 0,
      PENDING: 0,
      CANCELLED: 0,
      SHIPPED: 0
    };

    suborders.forEach(suborder => {
      const status = suborder.status as keyof typeof statusCounts;
      statusCounts[status]++;
    });

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(statusCounts).map(([status, count]) => {
          if (count > 0) {
            return (
              <span
                key={status}
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}
              >
                {status.replace('_', ' ')}: {count}
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Status Display *
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              role === 'customer' ? orderStatus : 
              role === 'vendor' && effectiveSuborder ? effectiveSuborder.status : 
              orderStatus
            )}`}>
              {role === 'customer' 
                ? `Order Status: ${orderStatus}`
                : role === 'vendor' && effectiveSuborder 
                  ? `Your Status: ${effectiveSuborder.status.replace('_', ' ')}` 
                  : orderStatus}
            </span>
            {getVendorActions()}
            {getCustomerActions()}
            {getAdminActions()}
            {getRiderActions()}
          </div>
          
          {getCustomerStatusSummary()}
          
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

        {/* Suborder Selector (Admin & Rider) *
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

      {/* Instructions *
      <div className={`p-4 rounded-lg ${
        role === 'vendor' ? 'bg-blue-50 border border-blue-200' : 
        role === 'delivery' ? 'bg-green-50 border border-green-200' : 
        role === 'customer' ? 'bg-indigo-50 border border-indigo-200' :
        'bg-purple-50 border border-purple-200'
      }`}>
        <div className="flex items-start">
          <svg className={`w-5 h-5 mt-0.5 mr-2 ${
            role === 'vendor' ? 'text-blue-600' : 
            role === 'delivery' ? 'text-green-600' : 
            role === 'customer' ? 'text-indigo-600' :
            'text-purple-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className={`font-medium ${
              role === 'vendor' ? 'text-blue-800' : 
              role === 'delivery' ? 'text-green-800' : 
              role === 'customer' ? 'text-indigo-800' :
              'text-purple-800'
            }`}>
              {role === 'vendor' ? 'Status Update Instructions' : 
               role === 'delivery' ? 'Delivery Instructions' : 
               role === 'customer' ? 'Order Status Information' :
               'Admin Controls'}
            </h4>
            <ul className={`text-sm mt-1 space-y-1 ${
              role === 'vendor' ? 'text-blue-700' : 
              role === 'delivery' ? 'text-green-700' : 
              role === 'customer' ? 'text-indigo-700' :
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
                  <li>• Ask customer for <strong>confirmation code</strong> after delivery</li>
                  <li>• Your delivery fee will be paid 24 hours after confirmation</li>
                </>
              ) : role === 'customer' ? (
                <>
                  <li>• Track each vendor's package status separately (see above)</li>
                  <li>• Click <strong>Confirm Delivery Received</strong> after verifying items</li>
                  <li>• A unique <strong>confirmation code</strong> will be generated</li>
                  <li>• Share the code with the delivery rider for verification</li>
                  <li>• Confirmation helps ensure successful delivery completion</li>
                </>
              ) : (
                <>
                  <li>• Assign a rider when vendor marks order as <strong>Ready for Pickup</strong></li>
                  <li>• Monitor delivery progress through each status</li>
                  <li>• Mark main order as <strong>Completed</strong> when all suborders are delivered/confirmed</li>
                  <li>• Use <strong>Cancel</strong> only for problematic orders</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}*/

/*'use client';

import { useState } from 'react';
import { Types } from 'mongoose';

export interface StatusBarSuborder {
  _id?: string;
  vendorId: string;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED' | 'SHIPPED';
  amount: number;
  commission: number;
  netAmount: number;
  deliveryFee?: number;
  riderId?: string | Types.ObjectId | undefined;
  deliveryDetails?: {
    pickupAddress?: string;
    dropoffAddress?: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
    confirmedAt?: string | Date;
    riderConfirmedAt?: string | Date;
    // New fields for delivery fee payment
    deliveryFeePaymentRef?: string;
    deliveryFeePaid?: boolean;
    deliveryFeePaidAt?: Date;
    deliveryFeeReceipt?: string;
    deliveryFeePaymentFailed?: boolean;
    deliveryFeePaymentError?: string;
  };
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
  onDeliveryFeePayment?: (suborderId: string, amount: number) => Promise<void>;
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
  isLoading = false,
  onDeliveryFeePayment
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
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
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

  const getCustomerActions = () => {
    if (role !== 'customer') return null;

    // Check if there's a suborder that's DELIVERED but needs delivery fee payment
    const needsPaymentSuborder = suborders.find(so => 
      so.status === 'DELIVERED' && 
      so.deliveryFee && 
      so.deliveryFee > 0 && 
      !so.deliveryDetails?.deliveryFeePaid
    );
    
    // Suborder that's DELIVERED and delivery fee is paid, awaiting confirmation
    const canConfirmSuborder = suborders.find(so => 
      so.status === 'DELIVERED' && 
      (!so.deliveryFee || so.deliveryFee === 0 || so.deliveryDetails?.deliveryFeePaid) &&
      !so.deliveryDetails?.confirmationCode
    );
    
    const hasCodeSuborder = suborders.find(so => 
      so.deliveryDetails?.confirmationCode && !so.deliveryDetails?.riderConfirmedAt
    );
    
    const confirmedSuborder = suborders.find(so => 
      so.status === 'CONFIRMED' || so.deliveryDetails?.riderConfirmedAt
    );

    // Show delivery fee payment first
    if (needsPaymentSuborder) {
      return (
        <div className="space-y-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-medium text-yellow-800">Delivery Fee Payment Required</h3>
          </div>
          <p className="text-sm text-yellow-700">
            Please pay the delivery fee of <span className="font-bold">KSh {needsPaymentSuborder.deliveryFee}</span> to confirm delivery.
          </p>
          <button
            onClick={() => onDeliveryFeePayment?.(needsPaymentSuborder._id!, needsPaymentSuborder.deliveryFee!)}
            disabled={isLoading}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 w-full"
          >
            {isLoading ? 'Processing...' : `Pay KSh ${needsPaymentSuborder.deliveryFee} Now`}
          </button>
          <p className="text-xs text-gray-500">
            This fee goes to the delivery rider. Payment is via M-PESA.
          </p>
        </div>
      );
    }
    
    if (canConfirmSuborder) {
      return (
        <div className="space-y-3">
          <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
            📦 Package delivered. Please confirm receipt.
          </div>
          <button
            onClick={() => onStatusUpdate('CONFIRMED', false, canConfirmSuborder._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Confirming...' : 'Confirm Delivery Received'}
          </button>
          <p className="text-xs text-gray-500">
            Once confirmed, a delivery code will be generated for the rider.
          </p>
        </div>
      );
    }
    
    if (hasCodeSuborder?.deliveryDetails?.confirmationCode) {
      return (
        <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
          ✅ Confirmation code generated! 
          <div className="mt-1 font-mono text-lg font-bold">
            Code: {hasCodeSuborder.deliveryDetails.confirmationCode}
          </div>
          <p className="text-xs mt-1">Share this code with the delivery rider.</p>
          <p className="text-xs text-yellow-600 mt-1">
            ⏳ Waiting for rider to verify the code...
          </p>
        </div>
      );
    }
    
    if (confirmedSuborder) {
      return (
        <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
          ✅ Delivery fully confirmed by both parties!
          {confirmedSuborder.deliveryDetails?.riderConfirmedAt && (
            <p className="text-xs mt-1">
              Verified at: {new Date(confirmedSuborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    
    return null;
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
            ✅ Delivered! Waiting for customer confirmation.
          </div>
        );
      
      case 'CONFIRMED':
        return (
          <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
            ✅ Delivery confirmed by customer! Earnings will be processed soon.
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
              {isLoading ? 'Confirming...' : 'Mark as Delivered'}
            </button>
          );
        
        case 'DELIVERED':
          return (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              ✅ Delivered. Waiting for customer confirmation.
            </div>
          );
        
        case 'CONFIRMED':
          return (
            <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              ✅ Delivery confirmed by customer.
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
          so.status === 'DELIVERED' || so.status === 'CANCELLED' || so.status === 'CONFIRMED'
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
            {isLoading ? 'Processing...' : 'Mark as Delivered'}
          </button>
        );
      
      case 'DELIVERED':
        // Check if customer has confirmed
        if (effectiveSuborder.deliveryDetails?.confirmationCode) {
          return (
            <div className="space-y-3">
              <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                ⏳ Customer has confirmed. Ask for confirmation code.
              </div>
              <button
                onClick={() => {
                  const code = prompt('Enter the 8-digit confirmation code from customer:');
                  if (code && code === effectiveSuborder.deliveryDetails?.confirmationCode) {
                    // Code matches, update to CONFIRMED
                    onStatusUpdate('CONFIRMED', false, effectiveSuborder._id);
                  } else if (code) {
                    alert('Invalid confirmation code');
                  }
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Enter Confirmation Code'}
              </button>
            </div>
          );
        }
        return (
          <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
            📦 Delivered. Waiting for customer confirmation.
          </div>
        );
      
      case 'CONFIRMED':
        return (
          <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
            ✅ Delivery fully confirmed! Payment will be processed soon.
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

  // For customer view, show a summary of suborder statuses
  const getCustomerStatusSummary = () => {
    if (role !== 'customer' || suborders.length === 0) return null;

    const statusCounts: Record<string, number> = {
      CONFIRMED: 0,
      DELIVERED: 0,
      IN_TRANSIT: 0,
      PICKED_UP: 0,
      ASSIGNED: 0,
      READY_FOR_PICKUP: 0,
      PROCESSING: 0,
      PENDING: 0,
      CANCELLED: 0,
      SHIPPED: 0
    };

    suborders.forEach(suborder => {
      const status = suborder.status as keyof typeof statusCounts;
      statusCounts[status]++;
    });

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(statusCounts).map(([status, count]) => {
          if (count > 0) {
            return (
              <span
                key={status}
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}
              >
                {status.replace('_', ' ')}: {count}
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Status Display *
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              role === 'customer' ? orderStatus : 
              role === 'vendor' && effectiveSuborder ? effectiveSuborder.status : 
              orderStatus
            )}`}>
              {role === 'customer' 
                ? `Order Status: ${orderStatus}`
                : role === 'vendor' && effectiveSuborder 
                  ? `Your Status: ${effectiveSuborder.status.replace('_', ' ')}` 
                  : orderStatus}
            </span>
            {getVendorActions()}
            {getCustomerActions()}
            {getAdminActions()}
            {getRiderActions()}
          </div>
          
          {getCustomerStatusSummary()}
          
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

        {/* Suborder Selector (Admin & Rider) *
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

      {/* Instructions *
      <div className={`p-4 rounded-lg ${
        role === 'vendor' ? 'bg-blue-50 border border-blue-200' : 
        role === 'delivery' ? 'bg-green-50 border border-green-200' : 
        role === 'customer' ? 'bg-indigo-50 border border-indigo-200' :
        'bg-purple-50 border border-purple-200'
      }`}>
        <div className="flex items-start">
          <svg className={`w-5 h-5 mt-0.5 mr-2 ${
            role === 'vendor' ? 'text-blue-600' : 
            role === 'delivery' ? 'text-green-600' : 
            role === 'customer' ? 'text-indigo-600' :
            'text-purple-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className={`font-medium ${
              role === 'vendor' ? 'text-blue-800' : 
              role === 'delivery' ? 'text-green-800' : 
              role === 'customer' ? 'text-indigo-800' :
              'text-purple-800'
            }`}>
              {role === 'vendor' ? 'Status Update Instructions' : 
               role === 'delivery' ? 'Delivery Instructions' : 
               role === 'customer' ? 'Order Status Information' :
               'Admin Controls'}
            </h4>
            <ul className={`text-sm mt-1 space-y-1 ${
              role === 'vendor' ? 'text-blue-700' : 
              role === 'delivery' ? 'text-green-700' : 
              role === 'customer' ? 'text-indigo-700' :
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
                  <li>• Ask customer for <strong>confirmation code</strong> after delivery</li>
                  <li>• Your delivery fee will be paid 24 hours after confirmation</li>
                </>
              ) : role === 'customer' ? (
                <>
                  <li>• Track each vendor's package status separately (see above)</li>
                  <li>• Click <strong>Confirm Delivery Received</strong> after verifying items</li>
                  <li>• A unique <strong>confirmation code</strong> will be generated</li>
                  <li>• Share the code with the delivery rider for verification</li>
                  <li>• Confirmation helps ensure successful delivery completion</li>
                </>
              ) : (
                <>
                  <li>• Assign a rider when vendor marks order as <strong>Ready for Pickup</strong></li>
                  <li>• Monitor delivery progress through each status</li>
                  <li>• Mark main order as <strong>Completed</strong> when all suborders are delivered/confirmed</li>
                  <li>• Use <strong>Cancel</strong> only for problematic orders</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}*/


'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  CreditCard,
  UserCheck,
  MapPin,
  DollarSign
} from 'lucide-react';

export interface StatusBarSuborder {
  _id?: string;
  vendorId: string;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED' | 'SHIPPED';
  amount: number;
  commission: number;
  netAmount: number;
  deliveryFee?: number;
  riderId?: string | Types.ObjectId | undefined;
  deliveryDetails?: {
    pickupAddress?: string;
    dropoffAddress?: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
    confirmedAt?: string | Date;
    riderConfirmedAt?: string | Date;
    deliveryFeePaymentRef?: string;
    deliveryFeePaid?: boolean;
    deliveryFeePaidAt?: Date;
    deliveryFeeReceipt?: string;
    deliveryFeePaymentFailed?: boolean;
    deliveryFeePaymentError?: string;
  };
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
  onDeliveryFeePayment?: (suborderId: string, amount: number) => Promise<void>;
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
  isLoading = false,
  onDeliveryFeePayment
}: OrderStatusBarProps) {
  const [localSelectedSuborderId, setLocalSelectedSuborderId] = useState<string | null>(selectedSuborderId || null);

  const effectiveSuborder = role === 'vendor' 
    ? vendorSuborder 
    : localSelectedSuborderId 
      ? suborders.find(so => so._id === localSelectedSuborderId)
      : null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
      case 'DELIVERED':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'IN_TRANSIT':
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'PICKED_UP':
      case 'ASSIGNED':
        return <UserCheck className="w-4 h-4" />;
      case 'READY_FOR_PICKUP':
      case 'PROCESSING':
        return <Package className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCustomerActions = () => {
    if (role !== 'customer') return null;

    const needsPaymentSuborder = suborders.find(so => 
      so.status === 'DELIVERED' && 
      so.deliveryFee && 
      so.deliveryFee > 0 && 
      !so.deliveryDetails?.deliveryFeePaid
    );
    
    const canConfirmSuborder = suborders.find(so => 
      so.status === 'DELIVERED' && 
      (!so.deliveryFee || so.deliveryFee === 0 || so.deliveryDetails?.deliveryFeePaid) &&
      !so.deliveryDetails?.confirmationCode
    );
    
    const hasCodeSuborder = suborders.find(so => 
      so.deliveryDetails?.confirmationCode && !so.deliveryDetails?.riderConfirmedAt
    );
    
    const confirmedSuborder = suborders.find(so => 
      so.status === 'CONFIRMED' || so.deliveryDetails?.riderConfirmedAt
    );

    if (needsPaymentSuborder) {
      return (
        <div className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800">Delivery Fee Payment Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please pay the delivery fee of <span className="font-bold text-lg">KSh {needsPaymentSuborder.deliveryFee}</span> to confirm delivery.
              </p>
              <button
                onClick={() => onDeliveryFeePayment?.(needsPaymentSuborder._id!, needsPaymentSuborder.deliveryFee!)}
                disabled={isLoading}
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : `Pay KSh ${needsPaymentSuborder.deliveryFee} via M-PESA`}
              </button>
              <p className="text-xs text-gray-500 mt-3">
                This fee goes to the delivery rider. Payment is via M-PESA.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (canConfirmSuborder) {
      return (
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-800">Package Delivered</h3>
              <p className="text-sm text-emerald-700 mt-1">Please confirm you've received your order.</p>
              <button
                onClick={() => onStatusUpdate('CONFIRMED', false, canConfirmSuborder._id)}
                disabled={isLoading}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Confirming...' : 'Confirm Delivery Received'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (hasCodeSuborder?.deliveryDetails?.confirmationCode) {
      return (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Confirmation Code Generated</h3>
            <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">Share this code with the delivery rider</p>
              <p className="font-mono text-2xl font-bold text-blue-700 tracking-wider">
                {hasCodeSuborder.deliveryDetails.confirmationCode}
              </p>
            </div>
            <p className="text-xs text-yellow-600 mt-3">
              ⏳ Waiting for rider to verify the code...
            </p>
          </div>
        </div>
      );
    }
    
    if (confirmedSuborder) {
      return (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-800">Delivery fully confirmed by both parties!</p>
              {confirmedSuborder.deliveryDetails?.riderConfirmedAt && (
                <p className="text-xs text-emerald-600 mt-1">
                  Verified at: {new Date(confirmedSuborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getVendorActions = () => {
    if (role !== 'vendor' || !effectiveSuborder) return null;

    switch (effectiveSuborder.status) {
      case 'PROCESSING':
        return (
          <button
            onClick={() => onStatusUpdate('READY_FOR_PICKUP', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Mark as Ready for Pickup'}
          </button>
        );
      default:
        return null;
    }
  };

  const getRiderActions = () => {
    if (role !== 'delivery' || !effectiveSuborder) return null;

    switch (effectiveSuborder.status) {
      case 'ASSIGNED':
        return (
          <button
            onClick={() => onStatusUpdate('PICKED_UP', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Mark as Picked Up'}
          </button>
        );
      
      case 'PICKED_UP':
        return (
          <button
            onClick={() => onStatusUpdate('IN_TRANSIT', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Mark as In Transit'}
          </button>
        );
      
      case 'IN_TRANSIT':
        return (
          <button
            onClick={() => onStatusUpdate('DELIVERED', false, effectiveSuborder._id)}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Mark as Delivered'}
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Status Bar */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              role === 'customer' ? orderStatus : 
              role === 'vendor' && effectiveSuborder ? effectiveSuborder.status : 
              orderStatus
            )}`}>
              {getStatusIcon(role === 'customer' ? orderStatus : 
                role === 'vendor' && effectiveSuborder ? effectiveSuborder.status : 
                orderStatus)}
              <span>
                {role === 'customer' 
                  ? `Order: ${orderStatus.replace('_', ' ')}`
                  : role === 'vendor' && effectiveSuborder 
                    ? `Your Status: ${effectiveSuborder.status.replace('_', ' ')}` 
                    : orderStatus.replace('_', ' ')}
              </span>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(paymentStatus)}`}>
              <CreditCard className="w-4 h-4" />
              <span>Payment: {paymentStatus}</span>
            </div>
            
            {effectiveSuborder?.deliveryFee && effectiveSuborder.deliveryFee > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                <Truck className="w-4 h-4" />
                <span>Delivery: KSh {effectiveSuborder.deliveryFee}</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {getVendorActions()}
            {getRiderActions()}
          </div>
        </div>
        
        {/* Suborder Selector */}
        {(role === 'admin' || role === 'delivery') && suborders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-[var(--color-text-muted)]">Manage Suborder:</span>
              <select
                value={localSelectedSuborderId || ''}
                onChange={(e) => {
                  setLocalSelectedSuborderId(e.target.value);
                  onSuborderSelect?.(e.target.value);
                }}
                className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              >
                <option value="">Select Vendor Order</option>
                {suborders.map((suborder, index) => (
                  <option key={suborder._id} value={suborder._id}>
                    Vendor {index + 1} - {suborder.status.replace('_', ' ')} (KSh {suborder.netAmount})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Customer Actions Section */}
      {role === 'customer' && getCustomerActions()}
      
      {/* Instructions Card */}
      <div className="p-5 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl border border-[var(--color-border)]">
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-5 h-5 mt-0.5 ${
            role === 'vendor' ? 'text-blue-500' : 
            role === 'delivery' ? 'text-green-500' : 
            role === 'customer' ? 'text-indigo-500' :
            'text-purple-500'
          }`} />
          <div>
            <h4 className={`font-semibold ${
              role === 'vendor' ? 'text-blue-700' : 
              role === 'delivery' ? 'text-green-700' : 
              role === 'customer' ? 'text-indigo-700' :
              'text-purple-700'
            }`}>
              {role === 'vendor' ? 'Vendor Instructions' : 
               role === 'delivery' ? 'Delivery Instructions' : 
               role === 'customer' ? 'Order Information' :
               'Admin Controls'}
            </h4>
            <ul className={`text-sm mt-2 space-y-1 ${
              role === 'vendor' ? 'text-blue-600' : 
              role === 'delivery' ? 'text-green-600' : 
              role === 'customer' ? 'text-indigo-600' :
              'text-purple-600'
            }`}>
              {role === 'vendor' ? (
                <>
                  <li>• Mark as <strong>Ready for Pickup</strong> when package is prepared</li>
                  <li>• Rider will be assigned by admin after marking as ready</li>
                  <li>• Your earnings will be available 24 hours after delivery confirmation</li>
                </>
              ) : role === 'delivery' ? (
                <>
                  <li>• Mark as <strong>Picked Up</strong> after collecting from vendor</li>
                  <li>• Mark as <strong>In Transit</strong> when en route to customer</li>
                  <li>• Mark as <strong>Delivered</strong> after successful delivery</li>
                  <li>• Ask customer for <strong>confirmation code</strong> after delivery</li>
                </>
              ) : role === 'customer' ? (
                <>
                  <li>• Track each vendor's package status separately</li>
                  <li>• Click <strong>Confirm Delivery Received</strong> after verifying items</li>
                  <li>• A unique <strong>confirmation code</strong> will be generated</li>
                  <li>• Share the code with the delivery rider for verification</li>
                </>
              ) : (
                <>
                  <li>• Assign a rider when vendor marks order as <strong>Ready for Pickup</strong></li>
                  <li>• Monitor delivery progress through each status</li>
                  <li>• Mark main order as <strong>Completed</strong> when all suborders are delivered</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
