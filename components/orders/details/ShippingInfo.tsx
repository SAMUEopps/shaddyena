/*import { Order } from '@/components/orders/details/types/orders';

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
}*/

// components/orders/details/ShippingInfo.tsx
'use client';

import { Order } from '@/components/orders/details/types/orders';
import { MapPin, Phone, FileText } from 'lucide-react';

interface ShippingInfoProps {
  shipping: Order['shipping'];
}

export default function ShippingInfo({ shipping }: ShippingInfoProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
        <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
          Shipping Information
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Shipping Address</h3>
              <p className="text-[var(--color-text)]">{shipping.address}</p>
              <p className="text-[var(--color-text)]">{shipping.city}, {shipping.country}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                Contact Phone
              </h3>
              <p className="text-[var(--color-text)]">{shipping.phone}</p>
            </div>
          </div>
          
          {shipping.instructions && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Delivery Instructions
              </h3>
              <p className="text-[var(--color-text)] bg-[var(--color-background-soft)] p-3 rounded-xl">
                {shipping.instructions}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}