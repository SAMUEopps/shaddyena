/*import { Order, Suborder } from '@/components/orders/details/types/orders';
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
}*/

'use client';

import { Order, Suborder } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import { 
  Hash, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Truck,
  Package,
  Building2
} from 'lucide-react';

interface OrderInformationProps {
  order: Order;
  effectiveSuborder?: Suborder;
  role?: string;
}

export default function OrderInformation({ order, effectiveSuborder, role }: OrderInformationProps) {
  
  const getRoleInfo = () => {
    if (!effectiveSuborder) return null;
    
    if (role === 'vendor') {
      return {
        label: 'Your Net Amount',
        amount: effectiveSuborder.netAmount,
        icon: <Package className="w-4 h-4" />,
        color: 'text-emerald-600'
      };
    } else if (role === 'delivery') {
      return {
        label: 'Your Delivery Fee',
        amount: effectiveSuborder.deliveryFee,
        icon: <Truck className="w-4 h-4" />,
        color: 'text-blue-600'
      };
    } else {
      return {
        label: 'Selected Vendor Net Amount',
        amount: effectiveSuborder.netAmount,
        icon: <Building2 className="w-4 h-4" />,
        color: 'text-purple-600'
      };
    }
  };
  
  const roleInfo = getRoleInfo();
  
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            <Hash className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Order Information
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Key details about this order
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {/* Order ID */}
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <Hash className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Order ID</p>
              <p className="text-sm font-mono font-medium text-[var(--color-text)]">{order.orderId}</p>
            </div>
          </div>
          
          {/* Order Date */}
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Order Date</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {OrderService.formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <CreditCard className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Payment Method</p>
              <p className="text-sm font-medium text-[var(--color-text)]">{order.paymentMethod}</p>
            </div>
          </div>
          
          {/* MPESA Transaction ID */}
          {order.mpesaTransactionId && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                <Smartphone className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">MPESA Transaction ID</p>
                <p className="text-sm font-mono font-medium text-[var(--color-text)]">
                  {order.mpesaTransactionId}
                </p>
              </div>
            </div>
          )}
          
          {/* Role-specific Amount */}
          {roleInfo && roleInfo.amount > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{roleInfo.label}</p>
                  <p className={`text-xl font-bold ${roleInfo.color}`}>
                    {OrderService.formatCurrency(roleInfo.amount, order.currency)}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {order.paymentStatus === 'PAID' 
                      ? '✓ Payment received - Earnings available 24h after delivery'
                      : '⏳ Pending payment'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Assigned Rider */}
          {effectiveSuborder?.riderId && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                <Truck className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Assigned Rider</p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {OrderService.getRiderName(effectiveSuborder.riderId)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}