import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface OrderInformationProps {
  order: Order;
  effectiveSuborder?: Suborder;
  role?: string;
}

export default function OrderInformation({ order, effectiveSuborder, role }: OrderInformationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Order ID</h3>
            <p className="text-sm text-gray-900 font-mono">{order.orderId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Order Date</h3>
            <p className="text-sm text-gray-900">{OrderService.formatDate(order.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
            <p className="text-sm text-gray-900">{order.paymentMethod}</p>
          </div>
          {order.mpesaTransactionId && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">MPESA Transaction ID</h3>
              <p className="text-sm text-gray-900 font-mono">{order.mpesaTransactionId}</p>
            </div>
          )}
          {effectiveSuborder && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  {role === 'vendor' ? 'Your Net Amount' : 
                   role === 'delivery' ? 'Your Delivery Fee' :
                   'Selected Vendor Net Amount'}
                </h3>
                <p className={`text-sm font-semibold ${
                  role === 'delivery' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {OrderService.formatCurrency(
                    role === 'delivery' ? effectiveSuborder.deliveryFee : effectiveSuborder.netAmount, 
                    order.currency
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.paymentStatus === 'PAID' 
                    ? 'Payment received - Earnings available 24h after delivery'
                    : 'Pending payment'}
                </p>
              </div>
              {effectiveSuborder.riderId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Assigned Rider</h3>
                  <p className="text-sm text-gray-900">{OrderService.getRiderName(effectiveSuborder.riderId)}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}