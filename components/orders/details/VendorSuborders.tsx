import { Order, Suborder } from '@/components/orders/details/types/orders';
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
}