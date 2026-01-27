import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';

interface PaymentSummaryProps {
  data: {
    type: 'customer' | 'vendor' | 'admin' | 'delivery';
    order: Order;
    suborder?: Suborder;
  };
}

export default function PaymentSummary({ data }: PaymentSummaryProps) {
  const { type, order, suborder } = data;

  const getTitle = () => {
    switch (type) {
      case 'vendor':
        return 'Vendor Payment Summary';
      case 'delivery':
        return 'Delivery Payment Summary';
      case 'admin':
        return 'Selected Vendor Payment';
      default:
        return 'Payment Summary';
    }
  };

  const renderVendorAdminSummary = () => {
    if (!suborder) return null;

    return (
      <>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm text-gray-900">
            {OrderService.formatCurrency(suborder.amount, order.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Commission</span>
          <span className="text-sm text-gray-900">
            {OrderService.formatCurrency(suborder.commission, order.currency)}
          </span>
        </div>
        {suborder.deliveryFee > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Delivery Fee</span>
            <span className="text-sm text-gray-900">
              {OrderService.formatCurrency(suborder.deliveryFee, order.currency)}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="text-base font-semibold text-gray-900">Net Amount</span>
          <span className="text-base font-semibold text-gray-900">
            {OrderService.formatCurrency(suborder.netAmount, order.currency)}
          </span>
        </div>
      </>
    );
  };

  const renderCustomerSummary = () => {
    return (
      <>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm text-gray-900">
            {OrderService.formatCurrency(
              order.totalAmount - order.shippingFee - order.platformFee,
              order.currency
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Shipping</span>
          <span className="text-sm text-gray-900">
            {OrderService.formatCurrency(order.shippingFee, order.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Platform Fee</span>
          <span className="text-sm text-gray-900">
            {OrderService.formatCurrency(order.platformFee, order.currency)}
          </span>
        </div>
        {order.deliveryFeeTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Delivery Total</span>
            <span className="text-sm text-gray-900">
              {OrderService.formatCurrency(order.deliveryFeeTotal, order.currency)}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">
            {OrderService.formatCurrency(order.totalAmount, order.currency)}
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {getTitle()}
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {type === 'customer' ? renderCustomerSummary() : renderVendorAdminSummary()}
        </div>
      </div>
    </div>
  );
}