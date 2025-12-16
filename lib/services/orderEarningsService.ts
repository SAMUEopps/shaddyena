import Order from '@/models/Order';
import VendorEarnings from '@/models/VendorEarnings';
import dbConnect from '@/lib/dbConnect';

export async function createVendorEarningsFromOrder(orderId: string) {
  try {
    await dbConnect();

    const order = await Order.findOne({ orderId });
    
    if (!order || order.paymentStatus !== 'PAID') {
      console.log(`Order ${orderId} not found or not paid`);
      return false;
    }

    console.log(`Processing earnings for order ${orderId} with ${order.suborders.length} suborders`);

    // Process each suborder
    for (const suborder of order.suborders) {
      // Create earnings record for each suborder
      const earnings = new VendorEarnings({
        vendorId: suborder.vendorId,
        orderId: order.orderId,
        suborderId: suborder._id,
        amount: suborder.amount,
        commission: suborder.commission,
        netAmount: suborder.netAmount,
        status: 'PENDING'
      });

      await earnings.save();
      
      console.log(`Created earnings for vendor ${suborder.vendorId}: Amount=${suborder.amount}, Commission=${suborder.commission}, Net=${suborder.netAmount}`);
    }

    console.log(`Successfully created vendor earnings for order ${orderId}`);
    return true;

  } catch (error) {
    console.error('Error creating vendor earnings from order:', error);
    return false;
  }
}

export async function updateOrderWithEarnings(orderId: string) {
  try {
    await dbConnect();

    const order = await Order.findOne({ orderId });
    
    if (!order || order.paymentStatus !== 'PAID') {
      return false;
    }

    // Mark order as completed if all suborders are delivered
    const allDelivered = order.suborders.every((sub: { status: string; }) => sub.status === 'DELIVERED');
    
    if (allDelivered && order.status !== 'COMPLETED') {
      // Update order status to COMPLETED
      await Order.findOneAndUpdate(
        { orderId },
        { status: 'COMPLETED' }
      );

      // Create vendor earnings
      await createVendorEarningsFromOrder(orderId);
      
      console.log(`Order ${orderId} marked as COMPLETED and earnings created`);
      return true;
    }

    return false;

  } catch (error) {
    console.error('Error updating order with earnings:', error);
    return false;
  }
}