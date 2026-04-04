/*import { Suborder } from '@/components/orders/details/types/orders';

interface DeliveryTrackingProps {
  suborder: Suborder;
}

export default function DeliveryTracking({ suborder }: DeliveryTrackingProps) {
  const isStatusComplete = (statuses: string[]) => {
    return statuses.includes(suborder.status);
  };

  const getStatusDot = (isComplete: boolean) => (
    <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
  );

  const getStatusCheckmark = (isComplete: boolean) => (
    isComplete ? <span className="text-xs text-green-600">✓ Complete</span> : null
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Delivery Tracking</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {/* Order Ready *
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Order Ready</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* Picked Up *
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Picked Up</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* In Transit *
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">In Transit</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* Delivered *
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Delivered</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* Confirmed *
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Confirmed</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['CONFIRMED']))}
          </div>
          
          {/* Estimated Delivery Time *
          {suborder.deliveryDetails?.estimatedTime && (
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">
                <strong>Estimated Delivery:</strong>{' '}
                {new Date(suborder.deliveryDetails.estimatedTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          )}
          
          {/* Actual Delivery Time *
          {suborder.deliveryDetails?.actualTime && (
            <div className="pt-2">
              <p className="text-sm text-gray-600">
                <strong>Actual Delivery:</strong>{' '}
                {new Date(suborder.deliveryDetails.actualTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { Suborder } from '@/components/orders/details/types/orders';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock,
  Calendar,
  Navigation
} from 'lucide-react';

interface DeliveryTrackingProps {
  suborder: Suborder;
}

export default function DeliveryTracking({ suborder }: DeliveryTrackingProps) {
  
  const getStatusStep = (status: string) => {
    const steps = [
      { status: 'READY_FOR_PICKUP', label: 'Ready', icon: <Package className="w-4 h-4" />, completed: false },
      { status: 'ASSIGNED', label: 'Assigned', icon: <Navigation className="w-4 h-4" />, completed: false },
      { status: 'PICKED_UP', label: 'Picked Up', icon: <Package className="w-4 h-4" />, completed: false },
      { status: 'IN_TRANSIT', label: 'In Transit', icon: <Truck className="w-4 h-4" />, completed: false },
      { status: 'DELIVERED', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" />, completed: false },
      { status: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, completed: false },
    ];
    
    let found = false;
    return steps.map(step => {
      if (step.status === status) found = true;
      return { ...step, completed: found };
    });
  };
  
  const steps = getStatusStep(suborder.status);
  const currentStepIndex = steps.findIndex(s => s.status === suborder.status);
  
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            <Navigation className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Delivery Tracking
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Real-time delivery status
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Timeline Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[var(--color-border)]" />
          
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Status Icon */}
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${step.completed 
                    ? `bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] text-white shadow-md` 
                    : 'bg-[var(--color-background-soft)] text-[var(--color-text-muted)] border-2 border-[var(--color-border)]'
                  }
                `}>
                  {step.icon}
                </div>
                
                {/* Status Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className={`font-semibold ${
                      step.completed ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
                    }`}>
                      {step.label}
                    </h3>
                    {step.completed && idx === currentStepIndex && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  {/* Show time info for completed steps */}
                  {step.completed && step.status === 'READY_FOR_PICKUP' && suborder.deliveryDetails?.estimatedTime && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Estimated: {new Date(suborder.deliveryDetails.estimatedTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  )}
                  
                  {step.completed && step.status === 'DELIVERED' && suborder.deliveryDetails?.actualTime && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Delivered at: {new Date(suborder.deliveryDetails.actualTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  )}
                  
                  {step.completed && step.status === 'CONFIRMED' && suborder.deliveryDetails?.riderConfirmedAt && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Confirmed at: {new Date(suborder.deliveryDetails.riderConfirmedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Address Info */}
        {suborder.deliveryDetails && (
          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Pickup Address</p>
                  <p className="text-sm text-[var(--color-text)]">
                    {suborder.deliveryDetails.pickupAddress || 'Vendor Shop Location'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Delivery Address</p>
                  <p className="text-sm text-[var(--color-text)]">
                    {suborder.deliveryDetails.dropoffAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}