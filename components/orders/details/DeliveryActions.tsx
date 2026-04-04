/*import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface DeliveryActionsProps {
  suborder: Suborder;
  order: Order;
  onStatusUpdate: (status: string, isMainOrder: boolean, suborderId?: string) => Promise<void>;
  updatingStatus: boolean;
  confirmationCode: string;
  onConfirmationCodeChange: (code: string) => void;
  onConfirmDelivery: (suborderId?: string, code?: string) => Promise<void>;
}

export default function DeliveryActions({
  suborder,
  order,
  onStatusUpdate,
  updatingStatus,
  confirmationCode,
  onConfirmationCodeChange,
  onConfirmDelivery
}: DeliveryActionsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Delivery Actions</h2>
        <p className="text-sm text-gray-600">Manage your delivery assignment</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {suborder.status === 'DELIVERED' && !suborder.deliveryDetails?.riderConfirmedAt && (
            <div className="space-y-3">
              <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                ⏳ Waiting for customer confirmation. Ask customer for confirmation code.
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter Confirmation Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 8-digit code from customer"
                  value={confirmationCode}
                  onChange={(e) => onConfirmationCodeChange(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-mono text-lg tracking-wider"
                  maxLength={8}
                />
                <button
                  onClick={() => onConfirmDelivery(suborder._id, confirmationCode)}
                  disabled={updatingStatus || !confirmationCode || confirmationCode.length !== 8}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? 'Verifying...' : 'Verify & Complete Delivery'}
                </button>
              </div>
            </div>
          )}

          {suborder.status === 'CONFIRMED' && (
            <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              ✅ Delivery confirmed by customer!
              {suborder.deliveryDetails?.riderConfirmedAt && (
                <p className="mt-1 text-xs">
                  Verified at: {new Date(suborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Pickup Location</h3>
              <p className="text-sm text-gray-900">
                {suborder.deliveryDetails?.pickupAddress || `Vendor Shop: ${suborder.shopId}`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Fee</h3>
              <p className="text-sm font-semibold text-green-700">
                {OrderService.formatCurrency(suborder.deliveryFee, order.currency)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {suborder.status === 'ASSIGNED' && (
              <button
                onClick={() => onStatusUpdate('PICKED_UP', false, suborder._id)}
                disabled={updatingStatus}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Processing...' : 'Mark as Picked Up'}
              </button>
            )}
            
            {suborder.status === 'PICKED_UP' && (
              <button
                onClick={() => onStatusUpdate('IN_TRANSIT', false, suborder._id)}
                disabled={updatingStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Processing...' : 'Mark as In Transit'}
              </button>
            )}
            
            {suborder.status === 'IN_TRANSIT' && (
              <button
                onClick={() => onStatusUpdate('DELIVERED', false, suborder._id)}
                disabled={updatingStatus}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Processing...' : 'Confirm Delivery'}
              </button>
            )}
            
            {suborder.status === 'DELIVERED' && !suborder.deliveryDetails?.confirmationCode && (
              <div className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                ✓ Delivery completed. Payment will be processed soon.
              </div>
            )}
          </div>
          
          {suborder.deliveryDetails?.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Notes</h3>
              <p className="text-sm text-gray-600">{suborder.deliveryDetails.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import { 
  Package, 
  Truck, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Phone,
  Navigation,
  UserCheck
} from 'lucide-react';

interface DeliveryActionsProps {
  suborder: Suborder;
  order: Order;
  onStatusUpdate: (status: string, isMainOrder: boolean, suborderId?: string) => Promise<void>;
  updatingStatus: boolean;
  confirmationCode: string;
  onConfirmationCodeChange: (code: string) => void;
  onConfirmDelivery: (suborderId?: string, code?: string) => Promise<void>;
}

export default function DeliveryActions({
  suborder,
  order,
  onStatusUpdate,
  updatingStatus,
  confirmationCode,
  onConfirmationCodeChange,
  onConfirmDelivery
}: DeliveryActionsProps) {
  
  const getStatusStep = () => {
    const steps = [
      { status: 'ASSIGNED', label: 'Assigned', icon: <UserCheck className="w-4 h-4" />, action: 'PICKED_UP', actionLabel: 'Mark as Picked Up', color: 'purple' },
      { status: 'PICKED_UP', label: 'Picked Up', icon: <Package className="w-4 h-4" />, action: 'IN_TRANSIT', actionLabel: 'Mark as In Transit', color: 'blue' },
      { status: 'IN_TRANSIT', label: 'In Transit', icon: <Truck className="w-4 h-4" />, action: 'DELIVERED', actionLabel: 'Mark as Delivered', color: 'green' },
      { status: 'DELIVERED', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" />, action: null, actionLabel: null, color: 'emerald' },
    ];
    
    const currentStepIndex = steps.findIndex(s => s.status === suborder.status);
    return { steps, currentStepIndex };
  };
  
  const { steps, currentStepIndex } = getStatusStep();
  const currentStep = steps[currentStepIndex];
  const isWaitingForConfirmation = suborder.status === 'DELIVERED' && !suborder.deliveryDetails?.riderConfirmedAt;
  const isConfirmed = suborder.status === 'CONFIRMED';
  
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            <Navigation className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Delivery Actions
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Manage your delivery assignment
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Delivery Progress Steps */}
          <div className="relative">
            <div className="flex justify-between">
              {steps.map((step, idx) => (
                <div key={step.status} className="flex-1 text-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300
                    ${idx <= currentStepIndex 
                      ? `bg-${step.color}-500 text-white shadow-lg` 
                      : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                    }
                  `}>
                    {step.icon}
                  </div>
                  <p className={`text-xs font-medium ${
                    idx <= currentStepIndex ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
                  }`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--color-border)] -z-10">
              <div 
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[var(--color-background-soft)] rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Pickup Location</p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {suborder.deliveryDetails?.pickupAddress || `Vendor Shop: ${suborder.shopId}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Delivery Fee</p>
                <p className="text-sm font-bold text-green-600">
                  {OrderService.formatCurrency(suborder.deliveryFee, order.currency)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Status-specific Actions */}
          {currentStep?.action && (
            <button
              onClick={() => onStatusUpdate(currentStep.action, false, suborder._id)}
              disabled={updatingStatus}
              className={`
                w-full px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 
                hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                bg-gradient-to-r from-${currentStep.color}-500 to-${currentStep.color}-600
              `}
            >
              {updatingStatus ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                currentStep.actionLabel
              )}
            </button>
          )}
          
          {/* Confirmation Code Section */}
          {isWaitingForConfirmation && (
            <div className="p-5 bg-yellow-50/50 rounded-xl border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-2">Waiting for Customer Confirmation</h3>
                  <p className="text-sm text-yellow-700 mb-4">
                    Ask the customer for the 8-digit confirmation code to complete delivery.
                  </p>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-yellow-800">
                      Enter Confirmation Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 8-digit code"
                      value={confirmationCode}
                      onChange={(e) => onConfirmationCodeChange(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 bg-white border-2 border-yellow-300 rounded-xl text-center font-mono text-lg tracking-wider text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                      maxLength={8}
                    />
                    <button
                      onClick={() => onConfirmDelivery(suborder._id, confirmationCode)}
                      disabled={updatingStatus || !confirmationCode || confirmationCode.length !== 8}
                      className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {updatingStatus ? 'Verifying...' : 'Verify & Complete Delivery'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Confirmed Success State */}
          {isConfirmed && (
            <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">Delivery Fully Confirmed!</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Your delivery fee payment will be processed within 24 hours.
                  </p>
                  {suborder.deliveryDetails?.riderConfirmedAt && (
                    <p className="text-xs text-emerald-600 mt-2">
                      Verified at: {new Date(suborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Delivery Notes */}
          {suborder.deliveryDetails?.notes && (
            <div className="p-4 bg-[var(--color-background-soft)] rounded-xl">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                Delivery Notes
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {suborder.deliveryDetails.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}