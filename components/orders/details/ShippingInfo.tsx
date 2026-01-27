import { Order } from '@/components/orders/details/types/orders';

interface ShippingInfoProps {
  shipping: Order['shipping'];
}

export default function ShippingInfo({ shipping }: ShippingInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-900">{shipping.address}</p>
            <p className="text-sm text-gray-900">{shipping.city}, {shipping.country}</p>
            <p className="text-sm text-gray-600 mt-2">Phone: {shipping.phone}</p>
          </div>
          {shipping.instructions && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Instructions</h3>
              <p className="text-sm text-gray-900">{shipping.instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}