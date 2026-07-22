import { connectToDatabase } from './mongodb';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import Payout from '@/models/Payout';
import Transaction from '@/models/Transaction';
import { processB2CPayment, processB2BPayment } from './mpesa';

export async function processVendorPayout(orderId: string) {
  try {
    await connectToDatabase();
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.isPayoutComplete) {
      console.log(`Payout already processed for order ${orderId}`);
      return { success: true, message: 'Already processed' };
    }

    if (order.status !== 'delivered') {
      console.log(`Order ${orderId} not delivered yet`);
      return { success: false, message: 'Order not delivered' };
    }

    // Get vendor
    const vendor = await Vendor.findById(order.vendorId);
    if (!vendor) {
      throw new Error(`Vendor ${order.vendorId} not found`);
    }

    // Check if payout already exists
    let payout = await Payout.findOne({ orderId: order._id });
    
    if (!payout) {
      // Create new payout record
      payout = await Payout.create({
        orderId: order._id,
        vendorId: vendor._id,
        amount: order.vendorAmount,
        commission: order.commission,
        totalPayout: order.vendorAmount,
        payoutMethod: vendor.payoutMethod,
        payoutDetails: vendor.payoutDetails,
        status: 'pending',
        retryCount: 0
      });
    }

    // Process the payout
    return await executePayout(payout._id);

  } catch (error) {
    console.error('Payout processing error:', error);
    throw error;
  }
}

export async function executePayout(payoutId: string) {
  try {
    await connectToDatabase();
    
    const payout = await Payout.findById(payoutId);
    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`);
    }

    if (payout.status === 'completed') {
      return { success: true, message: 'Already completed' };
    }

    // Get vendor
    const vendor = await Vendor.findById(payout.vendorId);
    if (!vendor) {
      throw new Error(`Vendor ${payout.vendorId} not found`);
    }

    // Update status to processing
    payout.status = 'processing';
    await payout.save();

    let result;
    let transactionId;

    // Process based on payout method
    switch (payout.payoutMethod) {
      case 'MPESA': {
        const phoneNumber = payout.payoutDetails?.mpesaNumber || vendor.phoneNumber;
        console.log(`Processing B2C to ${phoneNumber} for KSh ${payout.totalPayout}`);
        
        result = await processB2CPayment(
          phoneNumber,
          payout.totalPayout,
          'BusinessPayment',
          `Payout Order ${payout.orderId}`,
          `SHAD-${Date.now()}`
        );
        
        transactionId = result.ConversationID || result.CheckoutRequestID;
        break;
      }

      case 'POCHI': {
        const pochiNumber = payout.payoutDetails?.pochiNumber || vendor.phoneNumber;
        console.log(`Processing B2Pochi to ${pochiNumber} for KSh ${payout.totalPayout}`);
        
        result = await processB2CPayment(
          pochiNumber,
          payout.totalPayout,
          'BusinessPayment',
          `Payout Order ${payout.orderId} (POCHI)`,
          `SHAD-${Date.now()}`
        );
        
        transactionId = result.ConversationID || result.CheckoutRequestID;
        break;
      }

      case 'TILL': {
        const tillNumber = payout.payoutDetails?.tillNumber;
        if (!tillNumber) {
          throw new Error('Till number not configured');
        }
        
        console.log(`Processing B2B to Till ${tillNumber} for KSh ${payout.totalPayout}`);
        
        result = await processB2BPayment(
          tillNumber,
          payout.orderId.toString(),
          payout.totalPayout,
          'BusinessBuyGoods'
        );
        
        transactionId = result.ConversationID || result.CheckoutRequestID;
        break;
      }

      case 'PAYBILL': {
        const paybillNumber = payout.payoutDetails?.paybillNumber;
        const accountNumber = payout.payoutDetails?.paybillAccount || payout.orderId.toString();
        
        if (!paybillNumber) {
          throw new Error('PayBill number not configured');
        }
        
        console.log(`Processing B2B to PayBill ${paybillNumber} (${accountNumber}) for KSh ${payout.totalPayout}`);
        
        result = await processB2BPayment(
          paybillNumber,
          accountNumber,
          payout.totalPayout,
          'BusinessPayBill'
        );
        
        transactionId = result.ConversationID || result.CheckoutRequestID;
        break;
      }

      default:
        throw new Error(`Unsupported payout method: ${payout.payoutMethod}`);
    }

    // Update payout
    payout.status = 'completed';
    payout.transactionId = transactionId;
    payout.updatedAt = new Date();
    await payout.save();

    // Update order
    await Order.findByIdAndUpdate(payout.orderId, {
      isPayoutComplete: true,
      updatedAt: new Date()
    });

    // Create transaction record
    await Transaction.create({
      transactionId: transactionId || `PAYOUT-${Date.now()}`,
      phoneNumber: vendor.phoneNumber,
      amount: payout.totalPayout,
      status: 'success',
      type: 'payout',
      orderId: payout.orderId,
      vendorId: payout.vendorId,
      metadata: {
        payoutMethod: payout.payoutMethod,
        result: result
      }
    });

    // Update vendor earnings
    await Vendor.findByIdAndUpdate(payout.vendorId, {
      $inc: { totalEarned: payout.totalPayout, pendingPayout: -payout.totalPayout }
    });

    console.log(`✅ Payout ${payoutId} completed successfully`);
    return { success: true, payout, result };

  } catch (error: any) {
    console.error(`❌ Payout ${payoutId} failed:`, error);
    
    // Update payout as failed
    await Payout.findByIdAndUpdate(payoutId, {
      status: 'failed',
      errorMessage: error.message || 'Unknown error',
      updatedAt: new Date(),
      $inc: { retryCount: 1 }
    });

    return { 
      success: false, 
      error: error.message,
      payoutId 
    };
  }
}