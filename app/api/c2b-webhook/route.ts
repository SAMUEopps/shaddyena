// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import Order from '@/shd-models/models/Order';
import Product from '@/shd-models/models/Product';
import Vendor from '@/shd-models/models/Vendor';
import User from '@/shd-models/models/User';
import Delivery from '@/shd-models/models/Delivery';
import Investment from '@/shd-models/models/Investment';
import Savings from '@/shd-models/models/Savings';
import mongoose from 'mongoose';
import Advertisement from '@/shd-models/models/Advertisement';
import VendorSubscription from '@/shd-models/models/VendorSubscription';
import Subscription from '@/shd-models/models/Subscription';

// Helper function to calculate delivery fee
function calculateDeliveryFee(totalAmount: number): number {
  if (totalAmount < 500) return 100;
  if (totalAmount < 1000) return 150;
  if (totalAmount < 2000) return 200;
  if (totalAmount < 5000) return 300;
  return 400;
}

// Process successful payment for orders
// async function processOrderPayment(transaction: any, receiptNumber: string, amount: string, phoneNumber: string) {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Update transaction
//     transaction.status = 'success';
//     transaction.receiptNumber = receiptNumber;
//     transaction.metadata = {
//       ...transaction.metadata,
//       mpesaReceipt: receiptNumber,
//       amount: amount,
//       phoneNumber: phoneNumber
//     };
//     await transaction.save({ session });

//     // Get ALL order IDs from metadata
//     const orderIds = transaction.metadata?.orders || [];
//     const customerId = transaction.metadata?.customerId;
//     const referredBy = transaction.metadata?.referredBy;
    
//     console.log(`📦 Processing ${orderIds.length} orders for payment ${receiptNumber}`);

//     // Update ALL orders
//     const updatedOrders = [];
//     for (const orderId of orderIds) {
//       const order = await Order.findById(orderId).session(session);
//       if (!order) {
//         console.warn(`⚠️ Order ${orderId} not found, skipping...`);
//         continue;
//       }

//       // Create delivery record for this order
//       const customer = await User.findById(order.customerId).session(session);
//       const vendor = await Vendor.findById(order.vendorId).session(session);

//       // Only create delivery if not already created
//       if (!order.deliveryId) {
//         const delivery = await Delivery.create([{
//           orderId: order._id,
//           customerName: customer?.name || 'Customer',
//           customerPhone: order.deliveryPhone || customer?.phoneNumber || 'N/A',
//           pickupLocation: vendor?.businessLocation || 'Vendor Location',
//           dropoffLocation: order.deliveryAddress,
//           status: 'pending',
//           distance: 0,
//           earnings: calculateDeliveryFee(order.totalAmount),
//           estimatedTime: '30 min',
//           createdAt: new Date()
//         }], { session });

//         // Update order with delivery ID
//         order.deliveryId = delivery[0]._id;
//         order.deliveryStatus = 'pending';
//         await order.save({ session });
//       }

//       // Mark as paid
//       order.isPaid = true;
//       order.transactionId = transaction.transactionId;
//       order.status = 'processing';
//       await order.save({ session });
//       updatedOrders.push(order.orderNumber);

//       // Update product stock
//       for (const item of order.products) {
//         await Product.findByIdAndUpdate(
//           item.productId,
//           { $inc: { stock: -item.quantity } },
//           { session }
//         );
//       }

//       // Update vendor's pending payout
//       await Vendor.findByIdAndUpdate(
//         order.vendorId,
//         { $inc: { pendingPayout: order.vendorAmount } },
//         { session }
//       );

//       console.log(`✅ Order ${order.orderNumber} (${order.vendorId}) marked as paid`);
//     }

//     // Handle referral commission (once for the entire transaction)
//     if (referredBy && customerId) {
//       const commissionAmount = transaction.amount * 0.005; // 0.5% of total
      
//       await User.findByIdAndUpdate(
//         referredBy,
//         { 
//           $inc: { 
//             referralCommissionEarnings: commissionAmount,
//             referralEarnings: commissionAmount,
//             availableBalance: commissionAmount
//           } 
//         },
//         { session }
//       );
      
//       console.log(`💰 Added ${commissionAmount} referral commission to user ${referredBy}`);
//     }

//     await session.commitTransaction();
//     console.log(`✅ Successfully processed ${updatedOrders.length} orders: ${updatedOrders.join(', ')}`);
//     return true;

//   } catch (error) {
//     await session.abortTransaction();
//     console.error('❌ Error processing order payment:', error);
//     return false;
//   } finally {
//     session.endSession();
//   }
// }


// app/api/callback/route.ts - Update the processOrderPayment function

async function processOrderPayment(transaction: any, receiptNumber: string, amount: string, phoneNumber: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update transaction
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    transaction.metadata = {
      ...transaction.metadata,
      mpesaReceipt: receiptNumber,
      amount: amount,
      phoneNumber: phoneNumber
    };
    await transaction.save({ session });

    // Get ALL order IDs from metadata
    const orderIds = transaction.metadata?.orders || [];
    const customerId = transaction.metadata?.customerId;
    const referredBy = transaction.metadata?.referredBy;
    
    console.log(`📦 Processing ${orderIds.length} orders for payment ${receiptNumber}`);

    // Update ALL orders
    const updatedOrders = [];
    for (const orderId of orderIds) {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        console.warn(`⚠️ Order ${orderId} not found, skipping...`);
        continue;
      }

      // Find vendor
      const vendor = await Vendor.findById(order.vendorId).session(session);
      if (!vendor) {
        console.warn(`⚠️ Vendor ${order.vendorId} not found, skipping...`);
        continue;
      }

      // Create delivery record for this order
      const customer = await User.findById(order.customerId).session(session);

      // Only create delivery if not already created
      if (!order.deliveryId) {
        const delivery = await Delivery.create([{
          orderId: order._id,
          customerName: customer?.name || 'Customer',
          customerPhone: order.deliveryPhone || customer?.phoneNumber || 'N/A',
          pickupLocation: vendor?.businessLocation || 'Vendor Location',
          dropoffLocation: order.deliveryAddress,
          status: 'pending',
          distance: 0,
          earnings: calculateDeliveryFee(order.totalAmount),
          estimatedTime: '30 min',
          createdAt: new Date()
        }], { session });

        // Update order with delivery ID
        order.deliveryId = delivery[0]._id;
        order.deliveryStatus = 'pending';
      }

      // Mark as paid and make immediate payout available
      order.isPaid = true;
      order.transactionId = transaction.transactionId;
      order.status = 'processing';
      order.isImmediatePayoutAvailable = true; // Available for withdrawal
      
      await order.save({ session });
      updatedOrders.push(order.orderNumber);

      // Update product stock
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }

      // CRITICAL: Update vendor's balances
      const immediateAmount = order.immediateWithdrawable || (order.vendorAmount * 0.8);
      const pendingAmount = order.pendingWithdrawable || (order.vendorAmount * 0.2);
      
      // Update vendor balances
      vendor.availableBalance = (vendor.availableBalance || 0) + immediateAmount;
      vendor.pendingBalance = (vendor.pendingBalance || 0) + pendingAmount;
      vendor.totalRevenue = (vendor.totalRevenue || 0) + order.vendorAmount;
      vendor.lifetimeEarnings = (vendor.lifetimeEarnings || 0) + order.vendorAmount;
      
      // Also update legacy fields for compatibility
      vendor.totalEarned = vendor.totalRevenue;
      vendor.pendingPayout = vendor.pendingBalance;
      
      await vendor.save({ session });
      
      console.log(`💰 Vendor ${vendor.businessName} balance updated:
        Available: ${vendor.availableBalance}, 
        Pending: ${vendor.pendingBalance},
        Total Revenue: ${vendor.totalRevenue}`);

      console.log(`✅ Order ${order.orderNumber} marked as paid with immediate payout available`);
    }

    // Handle referral commission (once for the entire transaction)
    if (referredBy && customerId) {
      const commissionAmount = transaction.amount * 0.005; // 0.5% of total
      
      await User.findByIdAndUpdate(
        referredBy,
        { 
          $inc: { 
            referralCommissionEarnings: commissionAmount,
            referralEarnings: commissionAmount,
            availableBalance: commissionAmount
          } 
        },
        { session }
      );
      
      console.log(`💰 Added ${commissionAmount} referral commission to user ${referredBy}`);
    }

    await session.commitTransaction();
    console.log(`✅ Successfully processed ${updatedOrders.length} orders: ${updatedOrders.join(', ')}`);
    return true;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing order payment:', error);
    return false;
  } finally {
    session.endSession();
  }
}

// Process membership activation payment
async function processMembershipPayment(
  transaction: any,
  receiptNumber: string
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(
      `🔄 Processing membership payment ${transaction._id}`
    );

    const user = await User.findById(transaction.userId)
      .session(session);

    if (!user) {
      throw new Error("User not found");
    }

    // Prevent duplicate callback processing
    if (user.isMember) {
      console.log(
        `⚠️ ${user.name} already activated membership`
      );

      transaction.status = "success";
      transaction.receiptNumber = receiptNumber;

      await transaction.save({ session });

      await session.commitTransaction();

      return true;
    }

    const amount = transaction.amount;

    // Create savings record
    const reference =
      `MEM-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2,7)
      .toUpperCase()}`;

    await Savings.create(
      [
        {
          userId: user._id,
          amount,
          type: "deposit",
          description:
            "Initial membership deposit",
          status: "completed",
          reference,
          transactionId: transaction._id
        }
      ],
      { session }
    );

    // Activate membership
    user.isMember = true;
    user.memberSince = new Date();

    user.totalSavings =
      (user.totalSavings || 0) + amount;

    user.availableBalance =
      (user.availableBalance || 0) + amount;

    await user.save({ session });

    // Only mark success after everything completed
    transaction.status = "success";
    transaction.receiptNumber = receiptNumber;

    transaction.metadata = {
      ...transaction.metadata,
      mpesaReceipt: receiptNumber,
      activatedAt: new Date()
    };

    await transaction.save({ session });

    await session.commitTransaction();

    console.log(
      `✅ Membership activated ${user.name}`
    );

    return true;

  } catch(error) {
    await session.abortTransaction();
    console.error(
      "❌ Membership activation failed:",
      error
    );
    return false;
  } finally {
    session.endSession();
  }
}

// Process savings deposit payment
async function processSavingsPayment(transaction: any, receiptNumber: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update transaction
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    await transaction.save({ session });

    const userId = transaction.userId;
    const amount = transaction.amount;
    const description = transaction.metadata?.description || 'Savings deposit';

    // Find user
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isMember) {
      throw new Error('User must be a member to save');
    }

    // Generate reference number
    const reference = `SAV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create savings record
    await Savings.create([{
      userId: user._id,
      amount: amount,
      type: 'deposit',
      description: description,
      status: 'completed',
      reference: reference,
      transactionId: transaction._id
    }], { session });

    // Update user balance
    user.totalSavings = (user.totalSavings || 0) + amount;
    user.availableBalance = (user.availableBalance || 0) + amount;
    await user.save({ session });

    await session.commitTransaction();
    console.log(`✅ Savings deposit of ${amount} for user ${user.name}`);
    return true;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing savings payment:', error);
    return false;
  } finally {
    session.endSession();
  }
}

// Process advertisement payment
async function processAdvertisementPayment(transaction: any, receiptNumber: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(`🔄 Processing advertisement payment for transaction: ${transaction._id}`);
    
    // Update transaction
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    await transaction.save({ session });

    const adId = transaction.metadata?.adId;
    const vendorId = transaction.metadata?.vendorId;

    if (!adId) {
      throw new Error('Advertisement ID not found');
    }

    // Update advertisement payment status
    const advertisement = await Advertisement.findById(adId).session(session);
    if (!advertisement) {
      throw new Error('Advertisement not found');
    }

    // Prevent duplicate processing
    if (advertisement.paymentStatus === 'paid') {
      console.log(`⚠️ Advertisement ${adId} already paid`);
      await session.commitTransaction();
      return true;
    }

    advertisement.paymentStatus = 'paid';
    advertisement.isActive = true;
    await advertisement.save({ session });

    console.log(`✅ Advertisement ${adId} payment confirmed - Status: ${advertisement.paymentStatus}`);

    await session.commitTransaction();
    return true;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing advertisement payment:', error);
    return false;
  } finally {
    session.endSession();
  }
}

// Add this function to your c2b-webhook/route.ts

// Process subscription payment
async function processSubscriptionPayment(transaction: any, receiptNumber: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(`🔄 Processing subscription payment for transaction: ${transaction._id}`);
    
    // Update transaction status
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    await transaction.save({ session });

    const subscriptionId = transaction.metadata?.subscriptionId;
    const vendorId = transaction.metadata?.vendorId;

    if (!subscriptionId || !vendorId) {
      throw new Error('Missing subscription or vendor ID');
    }

    // Get subscription details
    const subscription = await Subscription.findById(subscriptionId).session(session);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    // Check if vendor already has an active subscription
    const existingVendorSub = await VendorSubscription.findOne({
      vendorId: vendorId,
      status: 'active'
    }).session(session);

    // End current subscription if exists
    if (existingVendorSub) {
      existingVendorSub.status = 'expired';
      existingVendorSub.endDate = new Date();
      await existingVendorSub.save({ session });
      console.log(`📅 Ended existing subscription for vendor ${vendorId}`);
    }

    // Calculate end date based on billing cycle
    const startDate = new Date();
    let endDate = new Date();
    
    switch (subscription.billingCycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1); // Default to monthly
    }

    // Create vendor subscription record
    const vendorSubscription = await VendorSubscription.create([{
      vendorId: vendorId,
      subscriptionId: subscriptionId,
      status: 'active',
      startDate: startDate,
      endDate: endDate,
      autoRenew: true,
      paymentMethod: 'mpesa',
      amountPaid: transaction.amount,
      transactionId: transaction._id,
      features: subscription.features,
      maxProducts: subscription.maxProducts,
      maxOrders: subscription.maxOrders,
      commissionRate: subscription.commissionRate,
      prioritySupport: subscription.prioritySupport,
      analyticsAccess: subscription.analyticsAccess,
      promoFeatures: subscription.promoFeatures,
      customDomain: subscription.customDomain,
      apiAccess: subscription.apiAccess,
      teamMembers: subscription.teamMembers,
      storageLimit: subscription.storageLimit,
      renewalDate: endDate
    }], { session });

    // Update vendor with subscription details
    await Vendor.findByIdAndUpdate(
      vendorId,
      {
        subscriptionId: subscriptionId,
        subscriptionStatus: 'active',
        subscriptionTier: subscription.tier,
        subscriptionEndDate: endDate
      },
      { session }
    );

    // Handle referral commission if applicable
    const user = await User.findById(transaction.userId).session(session);
    if (user?.referredBy) {
      const referrer = await User.findById(user.referredBy).session(session);
      if (referrer) {
        const commissionAmount = transaction.amount * 0.01; // 1% referral commission
        referrer.referralSubscriptionEarnings = (referrer.referralSubscriptionEarnings || 0) + commissionAmount;
        referrer.referralEarnings = (referrer.referralEarnings || 0) + commissionAmount;
        referrer.availableBalance = (referrer.availableBalance || 0) + commissionAmount;
        await referrer.save({ session });
        console.log(`💰 Added ${commissionAmount} subscription referral commission to ${referrer.name}`);
      }
    }

    await session.commitTransaction();
    console.log(`✅ Subscription activated for vendor ${vendorId} - Plan: ${subscription.name}`);
    return true;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing subscription payment:', error);
    return false;
  } finally {
    session.endSession();
  }
}

// Process investment payment
async function processInvestmentPayment(transaction: any, receiptNumber: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update transaction
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    await transaction.save({ session });

    const userId = transaction.userId;
    const amount = transaction.amount;
    const investmentId = transaction.metadata?.investmentId;

    // Find user
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isMember) {
      throw new Error('User must be a member to invest');
    }

    // Find investment
    const investment = await Investment.findById(investmentId).session(session);
    if (!investment) {
      throw new Error('Investment not found');
    }

    // Check if user has enough balance
    if ((user.availableBalance || 0) < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from user balance
    user.availableBalance = (user.availableBalance || 0) - amount;
    user.totalInvestments = (user.totalInvestments || 0) + amount;
    await user.save({ session });

    // Update investment status to active
    investment.status = 'active';
    investment.startDate = new Date();
    await investment.save({ session });

    await session.commitTransaction();
    console.log(`✅ Investment of ${amount} activated for user ${user.name}`);
    return true;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing investment payment:', error);
    return false;
  } finally {
    session.endSession();
  }
}

// Process failed payment (generic)
async function processFailedPayment(transaction: any, reason: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    transaction.status = 'failed';
    transaction.errorMessage = reason;
    await transaction.save({ session });

    // Handle different transaction types
    switch (transaction.type) {
      case 'order':
        // Cancel orders
        const orderIds = transaction.metadata?.orders || [];
        for (const orderId of orderIds) {
          await Order.findByIdAndUpdate(
            orderId, 
            { 
              status: 'cancelled',
              isPaid: false
            },
            { session }
          );
        }
        console.log(`❌ Orders ${orderIds} cancelled due to payment failure`);
        break;

      case 'advertisement':
        // Mark advertisement as payment failed
        if (transaction.metadata?.adId) {
          await Advertisement.findByIdAndUpdate(
            transaction.metadata.adId,
            { 
              paymentStatus: 'pending',
              isActive: false
            },
            { session }
          );
          console.log(`❌ Advertisement ${transaction.metadata.adId} payment failed`);
        }
        break;

      case 'investment':
        // Cancel investment
        if (transaction.metadata?.investmentId) {
          await Investment.findByIdAndUpdate(
            transaction.metadata.investmentId,
            { status: 'cancelled' },
            { session }
          );
          console.log(`❌ Investment ${transaction.metadata.investmentId} cancelled due to payment failure`);
        }
        break;

      case 'membership':
        // No action needed for membership failure
        console.log(`❌ Membership activation failed for user ${transaction.userId}`);
        break;

      case 'savings':
        // No action needed for savings failure
        console.log(`❌ Savings deposit failed for user ${transaction.userId}`);
        break;
    }

    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing failed payment:', error);
    return false;
  } finally {
    session.endSession();
  }
}

// Main webhook handler - HANDLES BOTH STK AND C2B CALLBACKS
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const callbackData = await req.json();
    console.log('📥 Received M-Pesa callback:', JSON.stringify(callbackData, null, 2));

    // Check for STK Push callback (Has Body.stkCallback)
    if (callbackData.Body?.stkCallback) {
      const response = callbackData.Body.stkCallback;
      const { 
        CheckoutRequestID, 
        ResultCode, 
        ResultDesc,
        CallbackMetadata 
      } = response;

      console.log(`Processing STK callback for: ${CheckoutRequestID}`);

      // Find transaction by checkoutRequestId
      const transaction = await Transaction.findOne({ 
        checkoutRequestId: CheckoutRequestID 
      });

      if (!transaction) {
        console.error('Transaction not found for checkout ID:', CheckoutRequestID);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }

      let processed = false;

      if (String(ResultCode) === "0") {
        const metadataMap: any = {};
        CallbackMetadata?.Item?.forEach((item: any) => {
          metadataMap[item.Name] = item.Value;
        });

        const receiptNumber = metadataMap.MpesaReceiptNumber;

        console.log(`✅ Payment successful ${receiptNumber}`);

        switch(transaction.type) {
          case "order":
            processed = await processOrderPayment(
              transaction,
              receiptNumber,
              metadataMap.Amount,
              metadataMap.PhoneNumber
            );
            break;

          case "membership":
            processed = await processMembershipPayment(
              transaction,
              receiptNumber
            );
            break;

          case "savings":
            processed = await processSavingsPayment(
              transaction,
              receiptNumber
            );
            break;

          case "investment":
            processed = await processInvestmentPayment(
              transaction,
              receiptNumber
            );
            break;

          case 'advertisement':
            processed = await processAdvertisementPayment(transaction, receiptNumber);
            break;

              case "subscription":  // ADD THIS CASE
    processed = await processSubscriptionPayment(transaction, receiptNumber);
    break;

          default:
            transaction.status = "success";
            transaction.receiptNumber = receiptNumber;
            await transaction.save();
            processed = true;
        }
      } else {
        // Payment failed
        console.log(`❌ STK Payment failed: ${ResultDesc}`);
        await processFailedPayment(transaction, ResultDesc);
      }
    } 
    // Check for C2B Pay Bill callback (Has TransactionType and BillRefNumber)
    else if (callbackData.TransactionType) {
      console.log('Processing C2B Pay Bill callback');
      
      const {
        TransID,
        TransAmount,
        BillRefNumber,
        MSISDN,
        BusinessShortCode,
        OrgAccountBalance,
        FirstName,
        LastName
      } = callbackData;

      console.log(`C2B Callback details:
        - TransID: ${TransID}
        - TransAmount: ${TransAmount}
        - BillRefNumber: ${BillRefNumber}
        - MSISDN: ${MSISDN}
        - BusinessShortCode: ${BusinessShortCode}`);

      let phoneNumber = MSISDN;
      if (MSISDN && MSISDN.length > 20) {
        console.log('MSISDN appears hashed, will use from transaction metadata');
      }

      // Try to find transaction by accountReference (BillRefNumber)
      let transaction = await Transaction.findOne({ 
        accountReference: BillRefNumber 
      });

      // If not found, try to find by transactionId (some implementations use this)
      if (!transaction) {
        transaction = await Transaction.findOne({ 
          'metadata.accountReference': BillRefNumber 
        });
      }

      // If still not found, try to find by checkoutRequestId as fallback
      if (!transaction) {
        transaction = await Transaction.findOne({ 
          'metadata.checkoutRequestId': BillRefNumber 
        });
      }

      if (!transaction) {
        console.error(`Transaction not found for BillRefNumber: ${BillRefNumber}`);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }

      console.log(`Found transaction: ${transaction._id}, Type: ${transaction.type}`);

      // Process the C2B payment
      const receiptNumber = TransID;
      const amount = parseFloat(TransAmount);

      // Update transaction with receipt
      transaction.receiptNumber = receiptNumber;
      transaction.metadata = {
        ...transaction.metadata,
        mpesaReceipt: TransID,
        transactionDate: new Date().toISOString(),
        c2bCallback: {
          TransactionType: callbackData.TransactionType,
          TransID: TransID,
          TransTime: callbackData.TransTime,
          TransAmount: TransAmount,
          BusinessShortCode: BusinessShortCode,
          BillRefNumber: BillRefNumber,
          OrgAccountBalance: OrgAccountBalance,
          MSISDN: MSISDN,
          FirstName: FirstName,
          LastName: LastName
        }
      };

      // Process based on transaction type
      let processed = false;
      switch (transaction.type) {
        case 'order':
          processed = await processOrderPayment(transaction, receiptNumber, amount.toString(), phoneNumber || transaction.phoneNumber);
          break;
        case 'membership':
          processed = await processMembershipPayment(transaction, receiptNumber);
          break;
        case 'savings':
          processed = await processSavingsPayment(transaction, receiptNumber);
          break;
        case 'investment':
          processed = await processInvestmentPayment(transaction, receiptNumber);
          break;
        case 'advertisement': // THIS IS THE FIX - ADD THIS CASE
          processed = await processAdvertisementPayment(transaction, receiptNumber);
          break;

          case 'subscription':  // ADD THIS CASE
    processed = await processSubscriptionPayment(transaction, receiptNumber);
    break;  
        default:
          console.log(`Unknown transaction type: ${transaction.type}`);
          transaction.status = 'success';
          await transaction.save();
          processed = true;
      }

      if (processed) {
        console.log(`✅ C2B ${transaction.type} payment processed successfully`);
      } else {
        console.error(`❌ Failed to process C2B ${transaction.type} payment`);
      }
    } 
    else {
      console.error('Unknown callback format:', callbackData);
    }

    // Always return success to M-Pesa
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: "Success" },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Callback processing error:', error);
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: "Success" },
      { status: 200 }
    );
  }
}