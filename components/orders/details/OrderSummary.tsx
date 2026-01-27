import { OrderItem } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface OrderSummaryProps {
  items: OrderItem[];
  orderId: string;
  isVendorViewingOrder: boolean;
  currency?: string;
}

export default function OrderSummary({ 
  items, 
  orderId, 
  isVendorViewingOrder,
  currency = 'KES'
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {isVendorViewingOrder ? 'Your Order Items' : 'Order Summary'}
        </h2>
        <p className="text-sm text-gray-600">
          {isVendorViewingOrder 
            ? `Showing ${items.length} item${items.length !== 1 ? 's' : ''} from your store`
            : `Order ID: ${orderId}`}
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  {!isVendorViewingOrder && (
                    <p className="text-xs text-gray-400">Vendor ID: {item.vendorId.substring(0, 8)}...</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {OrderService.formatCurrency(item.price * item.quantity, currency)}
                  </p>
                  <p className="text-xs text-gray-500">{OrderService.formatCurrency(item.price, currency)} each</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}