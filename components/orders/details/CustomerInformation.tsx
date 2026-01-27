import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface CustomerInformationProps {
  order: Order;
}

export default function CustomerInformation({ order }: CustomerInformationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Name</h3>
            <p className="text-sm text-gray-900">{OrderService.getBuyerName(order.buyerId)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Email</h3>
            <p className="text-sm text-gray-900">{OrderService.getBuyerEmail(order.buyerId)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Contact Phone</h3>
            <p className="text-sm text-gray-900">{order.shipping.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}