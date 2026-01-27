import { Order, Suborder } from '@/components/orders/details/types/orders';
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
}