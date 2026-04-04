/*import Link from 'next/link';
import { Order, OrderItem } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import PDFGenerator from './PDFGenerator';

interface OrderHeaderProps {
  order: Order;
  isRider: boolean;
  isVendorViewingOrder: boolean;
  displayItems: OrderItem[];
  role?: string;
}

export default function OrderHeader({ 
  order, 
  isRider, 
  isVendorViewingOrder, 
  displayItems, 
  role 
}: OrderHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Link 
          href={isRider ? "/delivery/dashboard" : "/orders"}
          className="inline-flex items-center text-[#bf2c7e] hover:text-[#a8246e] transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {isRider ? "Back to Dashboard" : "Back to Orders"}
        </Link>
        
        {!isRider && <PDFGenerator order={order} />}
      </div>
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-2">Order placed on {OrderService.formatDate(order.createdAt)}</p>
          <p className="text-sm text-gray-500 mt-1">
            Viewing as: <span className="capitalize font-medium">{role}</span>
            {isVendorViewingOrder && ' (Vendor View)'}
          </p>
          {isVendorViewingOrder && (
            <p className="text-sm text-gray-500 mt-1">
              Showing your items only ({displayItems.length} item{displayItems.length !== 1 ? 's' : ''})
            </p>
          )}
        </div>
      </div>
    </>
  );
}*/

// components/orders/details/OrderHeader.tsx
'use client';

import Link from 'next/link';
import { Order, OrderItem } from '@/components/orders/details/types/orders';
import { OrderService } from '@/components/orders/details/services/orderService';
import PDFGenerator from './PDFGenerator';
import { ArrowLeft, Package, Eye, FileText } from 'lucide-react';

interface OrderHeaderProps {
  order: Order;
  isRider: boolean;
  isVendorViewingOrder: boolean;
  displayItems: OrderItem[];
  role?: string;
}

export default function OrderHeader({ 
  order, 
  isRider, 
  isVendorViewingOrder, 
  displayItems, 
  role 
}: OrderHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent rounded-2xl p-6 md:p-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Link 
            href={isRider ? "/delivery/dashboard" : "/orders"}
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{isRider ? "Back to Dashboard" : "Back to Orders"}</span>
          </Link>
          
          {!isRider && <PDFGenerator order={order} />}
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
              <Package className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-primary)] font-medium">
                {role === 'vendor' ? 'Vendor View' : role === 'admin' ? 'Admin View' : 'Order Details'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
              Order #{order.orderId}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2">
              Placed on {OrderService.formatDate(order.createdAt)}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Viewing as: <span className="capitalize font-medium text-[var(--color-primary)]">{role}</span>
              {isVendorViewingOrder && ' (Vendor View)'}
            </p>
            {isVendorViewingOrder && (
              <p className="text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 inline-block px-3 py-1 rounded-full mt-2">
                Showing your items only ({displayItems.length} item{displayItems.length !== 1 ? 's' : ''})
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {displayItems.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full bg-[var(--color-background-soft)] border-2 border-[var(--color-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-text-muted)]"
                >
                  {item.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {displayItems.length > 3 && (
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)]">
                  +{displayItems.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}