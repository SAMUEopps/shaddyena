// /utils/orderTransformers.ts
import { Suborder } from '@/components/orders/details/types/orders';
import { StatusBarSuborder } from '@/components/orders/OrderStatusBar';

export const transformSuborderForStatusBar = (suborder: Suborder): StatusBarSuborder => {
  return {
    _id: suborder._id,
    vendorId: suborder.vendorId,
    status: suborder.status,
    amount: suborder.amount,
    commission: suborder.commission,
    netAmount: suborder.netAmount,
    deliveryFee: suborder.deliveryFee,
    riderId: suborder.riderId,
    deliveryDetails: suborder.deliveryDetails ? {
      pickupAddress: suborder.deliveryDetails.pickupAddress,
      dropoffAddress: suborder.deliveryDetails.dropoffAddress,
      estimatedTime: suborder.deliveryDetails.estimatedTime,
      actualTime: suborder.deliveryDetails.actualTime,
      notes: suborder.deliveryDetails.notes,
      confirmationCode: suborder.deliveryDetails.confirmationCode,
      confirmedAt: typeof suborder.deliveryDetails.confirmedAt === 'string' 
        ? suborder.deliveryDetails.confirmedAt 
        : suborder.deliveryDetails.confirmedAt?.toISOString(),
      riderConfirmedAt: typeof suborder.deliveryDetails.riderConfirmedAt === 'string'
        ? suborder.deliveryDetails.riderConfirmedAt
        : suborder.deliveryDetails.riderConfirmedAt?.toISOString()
    } : undefined
  };
};

export const transformSubordersForStatusBar = (suborders: Suborder[]): StatusBarSuborder[] => {
  return suborders.map(transformSuborderForStatusBar);
};