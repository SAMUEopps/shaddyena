/*import { Order, Suborder } from '@/components/orders/details/types/orders';
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
}*/

'use client';

import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import { 
  Receipt, 
  DollarSign, 
  TrendingDown, 
  Truck, 
  CreditCard,
  CheckCircle
} from 'lucide-react';

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

  const getIcon = () => {
    switch (type) {
      case 'vendor':
        return <Receipt className="w-5 h-5 text-emerald-500" />;
      case 'delivery':
        return <Truck className="w-5 h-5 text-blue-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />;
    }
  };

  const renderVendorAdminSummary = () => {
    if (!suborder) return null;

    return (
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
          <span className="text-sm font-medium text-[var(--color-text)]">
            {OrderService.formatCurrency(suborder.amount, order.currency)}
          </span>
        </div>
        
        {/* Commission */}
        <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm text-[var(--color-text-muted)]">Platform Commission</span>
          </div>
          <span className="text-sm font-medium text-red-500">
            -{OrderService.formatCurrency(suborder.commission, order.currency)}
          </span>
        </div>
        
        {/* Delivery Fee */}
        {suborder.deliveryFee > 0 && (
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-400" />
              <span className="text-sm text-[var(--color-text-muted)]">Delivery Fee</span>
            </div>
            <span className="text-sm font-medium text-green-600">
              +{OrderService.formatCurrency(suborder.deliveryFee, order.currency)}
            </span>
          </div>
        )}
        
        {/* Net Amount */}
        <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-[var(--color-border)]">
          <span className="text-base font-bold text-[var(--color-text)]">Net Amount</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[var(--color-primary)]">
              {OrderService.formatCurrency(suborder.netAmount, order.currency)}
            </span>
            {type === 'vendor' && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                After 24h delivery confirmation
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerSummary = () => {
    const subtotal = order.totalAmount - order.shippingFee - order.platformFee;
    
    return (
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
          <span className="text-sm font-medium text-[var(--color-text)]">
            {OrderService.formatCurrency(subtotal, order.currency)}
          </span>
        </div>
        
        {/* Shipping */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-[var(--color-text-muted)]">Shipping Fee</span>
          </div>
          <span className="text-sm font-medium text-[var(--color-text)]">
            {OrderService.formatCurrency(order.shippingFee, order.currency)}
          </span>
        </div>
        
        {/* Platform Fee */}
        <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-text-muted)]">Platform Fee</span>
          <span className="text-sm font-medium text-[var(--color-text)]">
            {OrderService.formatCurrency(order.platformFee, order.currency)}
          </span>
        </div>
        
        {/* Delivery Total */}
        {order.deliveryFeeTotal > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-[var(--color-text-muted)]">Delivery Total</span>
            <span className="text-sm font-medium text-green-600">
              +{OrderService.formatCurrency(order.deliveryFeeTotal, order.currency)}
            </span>
          </div>
        )}
        
        {/* Total */}
        <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-[var(--color-border)]">
          <span className="text-base font-bold text-[var(--color-text)]">Total Paid</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[var(--color-primary)]">
              {OrderService.formatCurrency(order.totalAmount, order.currency)}
            </span>
            {order.paymentStatus === 'PAID' && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <p className="text-xs text-green-600">Payment confirmed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            {getIcon()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {getTitle()}
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {type === 'customer' ? 'Breakdown of charges' : 'Financial breakdown'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {type === 'customer' ? renderCustomerSummary() : renderVendorAdminSummary()}
      </div>
    </div>
  );
}