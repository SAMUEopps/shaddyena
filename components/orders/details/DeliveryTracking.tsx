import { Suborder } from '@/components/orders/details/types/orders';

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
          {/* Order Ready */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Order Ready</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* Picked Up */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Picked Up</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* In Transit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">In Transit</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['IN_TRANSIT', 'DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* Delivered */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['DELIVERED', 'CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Delivered</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['DELIVERED', 'CONFIRMED']))}
          </div>
          
          {/* Confirmed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusDot(isStatusComplete(['CONFIRMED']))}
              <span className="ml-2 text-sm text-gray-700">Confirmed</span>
            </div>
            {getStatusCheckmark(isStatusComplete(['CONFIRMED']))}
          </div>
          
          {/* Estimated Delivery Time */}
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
          
          {/* Actual Delivery Time */}
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
}