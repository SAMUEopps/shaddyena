import { Order, Suborder, VendorSuborderData } from '@/components/orders/details/types/orders';
import OrderInformation from './OrderInformation';
import CustomerInformation from './CustomerInformation';
import PaymentSummary from './PaymentSummary';
import DeliveryTracking from './DeliveryTracking';

interface OrderSidebarProps {
  order: Order;
  role?: string;
  effectiveSuborder?: Suborder;
  isVendor: boolean;
  isAdmin: boolean;
  isRider: boolean;
  vendorView: boolean;
  adminView: boolean;
  vendorSuborder: VendorSuborderData | null;
  selectedSuborderData: { suborder: Suborder; items: any[] } | null;
}

export default function OrderSidebar({
  order,
  role,
  effectiveSuborder,
  isVendor,
  isAdmin,
  isRider,
  vendorView,
  adminView,
  vendorSuborder,
  selectedSuborderData
}: OrderSidebarProps) {
  /*const getPaymentSummaryData = () => {
    const isVendorView = isVendor && vendorSuborder;
    const suborderData = isVendorView ? vendorSuborder : selectedSuborderData;
    
    if (suborderData && (isVendor || (isAdmin && adminView))) {
      return {
        type: isVendor ? 'vendor' : isAdmin ? 'admin' : 'customer',
        suborder: suborderData.suborder,
        order
      };
    }
    
    return {
      type: 'customer',
      order
    };
  };*/

  const getPaymentSummaryData = () => {
  const isVendorView = isVendor && vendorSuborder;
  const suborderData = isVendorView ? vendorSuborder : selectedSuborderData;
  
  if (suborderData && (isVendor || (isAdmin && adminView))) {
    return {
      type: isVendor ? 'vendor' : 'admin',
      suborder: suborderData.suborder,
      order
    } as const;
  }
  
  return {
    type: 'customer',
    order
  } as const;
};

  return (
    <div className="space-y-6">
      {/* Order Information */}
      <OrderInformation 
        order={order}
        effectiveSuborder={effectiveSuborder}
        role={role}
      />

      {/* Customer Information */}
      {(role === 'admin' || isVendor || isRider) && (
        <CustomerInformation order={order} />
      )}

      {/* Payment Summary */}
      <PaymentSummary data={getPaymentSummaryData()} />

      {/* Delivery Tracking (for riders and assigned orders) */}
      {(isRider || effectiveSuborder?.riderId) && effectiveSuborder && (
        <DeliveryTracking suborder={effectiveSuborder} />
      )}
    </div>
  );
}