import Link from 'next/link';
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
          href={isRider ? "/delivery/dashboard" : "/?tab=orders"}
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
}