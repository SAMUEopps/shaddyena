/*import { Order } from '@/components/orders/details/types/orders';
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
}*/

'use client';

import { Order } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import { User, Mail, Phone, MapPin, UserCircle } from 'lucide-react';

interface CustomerInformationProps {
  order: Order;
}

export default function CustomerInformation({ order }: CustomerInformationProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            <UserCircle className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Customer Information
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Contact details for this order
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <User className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Full Name</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {OrderService.getBuyerName(order.buyerId)}
              </p>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <Mail className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Email Address</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {OrderService.getBuyerEmail(order.buyerId)}
              </p>
            </div>
          </div>
          
          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <Phone className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Contact Phone</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {order.shipping.phone}
              </p>
            </div>
          </div>
          
          {/* Shipping Address (compact) */}
          <div className="flex items-start gap-3 pt-2 border-t border-[var(--color-border)]">
            <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Shipping Address</p>
              <p className="text-sm text-[var(--color-text)]">
                {order.shipping.address}<br />
                {order.shipping.city}, {order.shipping.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}