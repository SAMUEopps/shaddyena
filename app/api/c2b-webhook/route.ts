// // // // app/api/shd-api/api/callback/route.ts

// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // // import Transaction from '@/shd-models/models/Transaction';
// // // import Order from '@/shd-models/models/Order';
// // // import Product from '@/shd-models/models/Product';
// // // import Vendor from '@/shd-models/models/Vendor';

// // // // Helper function to process successful payment
// // // async function processSuccessfulPayment(transaction: any, responseData: any) {
// // //   try {
// // //     // Update transaction
// // //     transaction.status = 'success';
// // //     transaction.receiptNumber = responseData.MpesaReceiptNumber;
// // //     transaction.metadata = {
// // //       ...transaction.metadata,
// // //       mpesaResponse: responseData
// // //     };
// // //     await transaction.save();

// // //     // Get all order IDs from metadata
// // //     const orderIds = transaction.metadata?.orders || [];
    
// // //     // Update each order
// // //     for (const orderId of orderIds) {
// // //       const order = await Order.findById(orderId);
// // //       if (!order) continue;

// // //       // Mark as paid
// // //       order.isPaid = true;
// // //       order.transactionId = transaction.transactionId;
// // //       order.status = 'processing'; // Move from pending to processing
// // //       await order.save();

// // //       // Update product stock
// // //       for (const item of order.products) {
// // //         await Product.findByIdAndUpdate(
// // //           item.productId,
// // //           { $inc: { stock: -item.quantity } }
// // //         );
// // //       }

// // //       // Update vendor's pending payout
// // //       await Vendor.findByIdAndUpdate(
// // //         order.vendorId,
// // //         { $inc: { pendingPayout: order.vendorAmount } }
// // //       );
// // //     }

// // //     return true;
// // //   } catch (error) {
// // //     console.error('Error processing successful payment:', error);
// // //     return false;
// // //   }
// // // }

// // // // Helper function to process failed payment
// // // async function processFailedPayment(transaction: any) {
// // //   try {
// // //     transaction.status = 'failed';
// // //     await transaction.save();

// // //     // Optionally cancel the orders
// // //     const orderIds = transaction.metadata?.orders || [];
// // //     for (const orderId of orderIds) {
// // //       await Order.findByIdAndUpdate(orderId, { 
// // //         status: 'cancelled',
// // //         isPaid: false
// // //       });
// // //     }

// // //     return true;
// // //   } catch (error) {
// // //     console.error('Error processing failed payment:', error);
// // //     return false;
// // //   }
// // // }

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     await connectToDatabase();

// // //     // Parse the callback data
// // //     const callbackData = await req.json();
// // //     console.log('Received callback:', JSON.stringify(callbackData, null, 2));

// // //     // Extract the relevant data from M-Pesa response
// // //     const response = callbackData.Body?.stkCallback;
    
// // //     if (!response) {
// // //       console.error('Invalid callback structure:', callbackData);
// // //       return NextResponse.json(
// // //         { error: 'Invalid callback data' },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const { 
// // //       MerchantRequestID,
// // //       CheckoutRequestID,
// // //       ResultCode,
// // //       ResultDesc,
// // //       CallbackMetadata
// // //     } = response;

// // //     // Find the transaction
// // //     const transaction = await Transaction.findOne({ transactionId: CheckoutRequestID });
    
// // //     if (!transaction) {
// // //       console.error('Transaction not found:', CheckoutRequestID);
// // //       return NextResponse.json(
// // //         { error: 'Transaction not found' },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     console.log('Found transaction:', transaction);

// // //     // Process based on ResultCode
// // //     if (ResultCode === 0) {
// // //       // Payment successful
// // //       console.log('Payment successful for transaction:', CheckoutRequestID);
      
// // //       // Extract metadata
// // //       const metadataMap: { [key: string]: string } = {};
// // //       if (CallbackMetadata?.Item) {
// // //         CallbackMetadata.Item.forEach((item: any) => {
// // //           metadataMap[item.Name] = item.Value;
// // //         });
// // //       }

// // //       const responseData = {
// // //         MpesaReceiptNumber: metadataMap.MpesaReceiptNumber,
// // //         TransactionDate: metadataMap.TransactionDate,
// // //         PhoneNumber: metadataMap.PhoneNumber,
// // //         Amount: metadataMap.Amount
// // //       };

// // //       const success = await processSuccessfulPayment(transaction, responseData);
      
// // //       if (success) {
// // //         console.log('Successfully processed payment for orders:', transaction.metadata?.orders);
// // //       }

// // //     } else {
// // //       // Payment failed
// // //       console.log(`Payment failed for transaction ${CheckoutRequestID}: ${ResultDesc}`);
// // //       await processFailedPayment(transaction);
// // //     }

// // //     // Always respond with success to M-Pesa (they expect a 200 OK)
// // //     return NextResponse.json(
// // //       { 
// // //         ResultCode: 0, 
// // //         ResultDesc: "Success" 
// // //       },
// // //       { status: 200 }
// // //     );

// // //   } catch (error) {
// // //     console.error('Callback error:', error);
// // //     // Always return success to M-Pesa even on error
// // //     return NextResponse.json(
// // //       { 
// // //         ResultCode: 0, 
// // //         ResultDesc: "Success" 
// // //       },
// // //       { status: 200 }
// // //     );
// // //   }
// // // }

// // // api/c2b-webhook/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import Transaction from '@/shd-models/models/Transaction';
// // import Order from '@/shd-models/models/Order';
// // import Product from '@/shd-models/models/Product';
// // import Vendor from '@/shd-models/models/Vendor';
// // import User from '@/shd-models/models/User';
// // import mongoose from 'mongoose';
// // import Delivery from '@/shd-models/models/Delivery';

// // // Process successful payment
// // /*async function processSuccessfulPayment(transaction: any, receiptNumber: string, amount: string, phoneNumber: string) {
// //   const session = await mongoose.startSession();
// //   session.startTransaction();

// //   try {
// //     // Update transaction
// //     transaction.status = 'success';
// //     transaction.receiptNumber = receiptNumber;
// //     transaction.metadata = {
// //       ...transaction.metadata,
// //       mpesaReceipt: receiptNumber,
// //       amount: amount,
// //       phoneNumber: phoneNumber
// //     };
// //     await transaction.save({ session });

// //     // Get all order IDs from metadata
// //     const orderIds = transaction.metadata?.orders || [];
// //     const customerId = transaction.metadata?.customerId;
// //     const referredBy = transaction.metadata?.referredBy;
    
// //     // Update each order
// //     for (const orderId of orderIds) {
// //       const order = await Order.findById(orderId).session(session);
// //       if (!order) continue;

// //       // ✅ Mark as paid - THIS IS WHERE ORDER GETS UPDATED
// //       order.isPaid = true;
// //       order.transactionId = transaction.transactionId;
// //       order.status = 'processing'; // Move from pending to processing
// //       await order.save({ session });

// //       // Update product stock
// //       for (const item of order.products) {
// //         await Product.findByIdAndUpdate(
// //           item.productId,
// //           { $inc: { stock: -item.quantity } },
// //           { session }
// //         );
// //       }

// //       // Update vendor's pending payout
// //       await Vendor.findByIdAndUpdate(
// //         order.vendorId,
// //         { $inc: { pendingPayout: order.vendorAmount } },
// //         { session }
// //       );
// //     }

// //     // Handle referral commission if applicable
// //     if (referredBy && customerId) {
// //       const commissionAmount = transaction.amount * 0.005; // 0.5%
      
// //       // ✅ Update user's referral commission earnings
// //       await User.findByIdAndUpdate(
// //         referredBy,
// //         { 
// //           $inc: { 
// //             referralCommissionEarnings: commissionAmount,
// //             referralEarnings: commissionAmount,
// //             availableBalance: commissionAmount // If you want to add to available balance
// //           } 
// //         },
// //         { session }
// //       );
      
// //       console.log(`Added ${commissionAmount} referral commission to user ${referredBy}`);
// //     }

// //     await session.commitTransaction();
// //     console.log(`✅ Successfully processed payment. Orders ${orderIds} marked as paid.`);
// //     return true;

// //   } catch (error) {
// //     await session.abortTransaction();
// //     console.error('Error processing successful payment:', error);
// //     return false;
// //   } finally {
// //     session.endSession();
// //   }
// // }*/
// // function calculateDeliveryFee(totalAmount: number): number {
// //   if (totalAmount < 500) return 100;
// //   if (totalAmount < 1000) return 150;
// //   if (totalAmount < 2000) return 200;
// //   if (totalAmount < 5000) return 300;
// //   return 400;
// // }

// // // api/c2b-webhook/route.ts (updated processSuccessfulPayment)
// // async function processSuccessfulPayment(transaction: any, receiptNumber: string, amount: string, phoneNumber: string) {
// //   const session = await mongoose.startSession();
// //   session.startTransaction();

// //   try {
// //     // Update transaction
// //     transaction.status = 'success';
// //     transaction.receiptNumber = receiptNumber;
// //     transaction.metadata = {
// //       ...transaction.metadata,
// //       mpesaReceipt: receiptNumber,
// //       amount: amount,
// //       phoneNumber: phoneNumber
// //     };
// //     await transaction.save({ session });

// //     // ✅ Get ALL order IDs from metadata
// //     const orderIds = transaction.metadata?.orders || [];
// //     const customerId = transaction.metadata?.customerId;
// //     const referredBy = transaction.metadata?.referredBy;
    
// //     console.log(`📦 Processing ${orderIds.length} orders for payment ${receiptNumber}`);

// //     // ✅ Update ALL orders
// //     const updatedOrders = [];
// //     for (const orderId of orderIds) {
// //       const order = await Order.findById(orderId).session(session);
// //       if (!order) {
// //         console.warn(`⚠️ Order ${orderId} not found, skipping...`);
// //         continue;
// //       }

// //       // Create delivery record for this order
// //       const customer = await User.findById(order.customerId).session(session);
// //       const vendor = await Vendor.findById(order.vendorId).session(session);

// //       // Only create delivery if not already created
// //       if (!order.deliveryId) {
// //         const delivery = await Delivery.create([{
// //           orderId: order._id,
// //           customerName: customer?.name || 'Customer',
// //           customerPhone: order.deliveryPhone || customer?.phoneNumber || 'N/A',
// //           pickupLocation: vendor?.businessLocation || 'Vendor Location',
// //           dropoffLocation: order.deliveryAddress,
// //           status: 'pending',
// //           distance: 0, // Will be calculated when rider assigned
// //           earnings: calculateDeliveryFee(order.totalAmount),
// //           estimatedTime: '30 min',
// //           createdAt: new Date()
// //         }], { session });

// //         // Update order with delivery ID
// //         order.deliveryId = delivery[0]._id;
// //         order.deliveryStatus = 'pending';
// //         await order.save({ session });
// //       }

// //       // Mark as paid
// //       order.isPaid = true;
// //       order.transactionId = transaction.transactionId;
// //       order.status = 'processing';
// //       await order.save({ session });
// //       updatedOrders.push(order.orderNumber);

// //       // Update product stock
// //       for (const item of order.products) {
// //         await Product.findByIdAndUpdate(
// //           item.productId,
// //           { $inc: { stock: -item.quantity } },
// //           { session }
// //         );
// //       }

// //       // Update vendor's pending payout
// //       await Vendor.findByIdAndUpdate(
// //         order.vendorId,
// //         { $inc: { pendingPayout: order.vendorAmount } },
// //         { session }
// //       );

// //       console.log(`✅ Order ${order.orderNumber} (${order.vendorId}) marked as paid`);
// //     }

// //     // Handle referral commission (once for the entire transaction)
// //     if (referredBy && customerId) {
// //       const commissionAmount = transaction.amount * 0.005; // 0.5% of total
      
// //       await User.findByIdAndUpdate(
// //         referredBy,
// //         { 
// //           $inc: { 
// //             referralCommissionEarnings: commissionAmount,
// //             referralEarnings: commissionAmount,
// //             availableBalance: commissionAmount
// //           } 
// //         },
// //         { session }
// //       );
      
// //       console.log(`💰 Added ${commissionAmount} referral commission to user ${referredBy}`);
// //     }

// //     await session.commitTransaction();
// //     console.log(`✅ Successfully processed ${updatedOrders.length} orders: ${updatedOrders.join(', ')}`);
// //     return true;

// //   } catch (error) {
// //     await session.abortTransaction();
// //     console.error('❌ Error processing successful payment:', error);
// //     return false;
// //   } finally {
// //     session.endSession();
// //   }
// // }

// // // Process failed payment
// // async function processFailedPayment(transaction: any) {
// //   const session = await mongoose.startSession();
// //   session.startTransaction();

// //   try {
// //     transaction.status = 'failed';
// //     await transaction.save({ session });

// //     // Cancel the orders
// //     const orderIds = transaction.metadata?.orders || [];
// //     for (const orderId of orderIds) {
// //       await Order.findByIdAndUpdate(
// //         orderId, 
// //         { 
// //           status: 'cancelled',
// //           isPaid: false
// //         },
// //         { session }
// //       );
// //     }

// //     await session.commitTransaction();
// //     console.log(`❌ Payment failed. Orders ${orderIds} cancelled.`);
// //     return true;
// //   } catch (error) {
// //     await session.abortTransaction();
// //     console.error('Error processing failed payment:', error);
// //     return false;
// //   } finally {
// //     session.endSession();
// //   }
// // }

// // // Handle STK Push Callback
// // async function handleSTKCallback(data: any) {
// //   const response = data.Body?.stkCallback;
  
// //   if (!response) {
// //     console.error('Invalid STK callback structure:', data);
// //     return false;
// //   }

// //   const { 
// //     CheckoutRequestID,
// //     ResultCode,
// //     ResultDesc,
// //     CallbackMetadata
// //   } = response;

// //   const transaction = await Transaction.findOne({ transactionId: CheckoutRequestID });
  
// //   if (!transaction) {
// //     console.error('Transaction not found:', CheckoutRequestID);
// //     return false;
// //   }

// //   if (ResultCode === 0) {
// //     const metadataMap: { [key: string]: string } = {};
// //     if (CallbackMetadata?.Item) {
// //       CallbackMetadata.Item.forEach((item: any) => {
// //         metadataMap[item.Name] = item.Value;
// //       });
// //     }

// //     await processSuccessfulPayment(
// //       transaction,
// //       metadataMap.MpesaReceiptNumber,
// //       metadataMap.Amount,
// //       metadataMap.PhoneNumber
// //     );
// //     console.log('✅ STK Payment successful:', CheckoutRequestID);
// //   } else {
// //     await processFailedPayment(transaction);
// //     console.log(`❌ STK Payment failed: ${ResultDesc}`);
// //   }

// //   return true;
// // }

// // // Handle C2B Callback
// // async function handleC2BCallback(data: any) {
// //   try {
// //     console.log('Processing C2B callback:', data);

// //     const {
// //       TransID,
// //       TransAmount,
// //       BillRefNumber,
// //       MSISDN
// //     } = data;

// //     // Find the transaction by accountReference in metadata
// //     const transaction = await Transaction.findOne({ 
// //       'metadata.accountReference': BillRefNumber 
// //     });
    
// //     if (!transaction) {
// //       console.error('Transaction not found for BillRefNumber:', BillRefNumber);
// //       return false;
// //     }

// //     // Check if payment amount matches
// //     const expectedAmount = transaction.amount;
// //     const receivedAmount = parseFloat(TransAmount);
    
// //     if (receivedAmount >= expectedAmount) {
// //       // ✅ This will mark orders as paid
// //       await processSuccessfulPayment(
// //         transaction,
// //         TransID,
// //         TransAmount,
// //         MSISDN
// //       );
// //       console.log('✅ C2B Payment processed successfully:', TransID);
// //     } else {
// //       console.error(`❌ Amount mismatch: Expected ${expectedAmount}, got ${receivedAmount}`);
// //       await processFailedPayment(transaction);
// //     }

// //     return true;

// //   } catch (error) {
// //     console.error('Error processing C2B callback:', error);
// //     return false;
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectToDatabase();

// //     const callbackData = await req.json();
// //     console.log('📥 Received callback:', JSON.stringify(callbackData, null, 2));

// //     let handled = false;
    
// //     // Check for STK Push callback (has Body.stkCallback)
// //     if (callbackData.Body?.stkCallback) {
// //       handled = await handleSTKCallback(callbackData);
// //     }
// //     // Check for C2B callback (has TransactionType and TransID)
// //     else if (callbackData.TransactionType) {
// //       handled = await handleC2BCallback(callbackData);
// //     }
// //     else {
// //       console.error('❌ Unknown callback format:', callbackData);
// //     }

// //     // Always return success to M-Pesa
// //     return NextResponse.json(
// //       { ResultCode: 0, ResultDesc: "Success" },
// //       { status: 200 }
// //     );

// //   } catch (error) {
// //     console.error('❌ Callback error:', error);
// //     return NextResponse.json(
// //       { ResultCode: 0, ResultDesc: "Success" },
// //       { status: 200 }
// //     );
// //   }
// // }

// // app/api/callback/route.ts (Update your callback handler)
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// import Transaction from '@/shd-models/models/Transaction';

// import mongoose from 'mongoose';
// import { MpesaPaymentService } from '@/shd-lib/lib/mpesaPaymentService';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();
    
//     const callbackData = await req.json();
//     console.log('📥 Received callback:', JSON.stringify(callbackData, null, 2));

//     // Check for STK Push callback
//     if (callbackData.Body?.stkCallback) {
//       const response = callbackData.Body.stkCallback;
//       const { CheckoutRequestID, ResultCode, CallbackMetadata } = response;

//       // Find transaction
//       const transaction = await Transaction.findOne({ 
//         checkoutRequestId: CheckoutRequestID 
//       });

//       if (!transaction) {
//         console.error('Transaction not found:', CheckoutRequestID);
//         return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
//       }

//       if (ResultCode === 0) {
//         // Payment successful
//         const mpesaService = new MpesaPaymentService(transaction.userId);
        
//         // Process the successful payment based on purpose
//         const result = await mpesaService.handleSuccessfulPayment(
//           transaction._id
//         );

//         console.log(`✅ ${transaction.purpose} payment successful:`, CheckoutRequestID);
//       } else {
//         // Payment failed
//         transaction.status = 'failed';
//         transaction.errorMessage = response.ResultDesc;
//         await transaction.save();

//         // Update investment status if exists
//         if (transaction.purpose === 'investment' && transaction.metadata?.investmentId) {
//           const Investment = mongoose.model('Investment');
//           await Investment.findByIdAndUpdate(
//             transaction.metadata.investmentId,
//             { status: 'cancelled' }
//           );
//         }

//         console.log(`❌ ${transaction.purpose} payment failed:`, response.ResultDesc);
//       }
//     }

//     // Always return success to M-Pesa
//     return NextResponse.json(
//       { ResultCode: 0, ResultDesc: "Success" },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('❌ Callback error:', error);
//     return NextResponse.json(
//       { ResultCode: 0, ResultDesc: "Success" },
//       { status: 200 }
//     );
//   }
// }

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

// Helper function to calculate delivery fee
function calculateDeliveryFee(totalAmount: number): number {
  if (totalAmount < 500) return 100;
  if (totalAmount < 1000) return 150;
  if (totalAmount < 2000) return 200;
  if (totalAmount < 5000) return 300;
  return 400;
}

// Process successful payment for orders
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

      // Create delivery record for this order
      const customer = await User.findById(order.customerId).session(session);
      const vendor = await Vendor.findById(order.vendorId).session(session);

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
        await order.save({ session });
      }

      // Mark as paid
      order.isPaid = true;
      order.transactionId = transaction.transactionId;
      order.status = 'processing';
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

      // Update vendor's pending payout
      await Vendor.findByIdAndUpdate(
        order.vendorId,
        { $inc: { pendingPayout: order.vendorAmount } },
        { session }
      );

      console.log(`✅ Order ${order.orderNumber} (${order.vendorId}) marked as paid`);
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
async function processMembershipPayment(transaction: any, receiptNumber: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update transaction
    transaction.status = 'success';
    transaction.receiptNumber = receiptNumber;
    await transaction.save({ session });

    const userId = transaction.userId;
    const amount = transaction.amount;

    // Find user
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already a member
    if (user.isMember) {
      throw new Error('User is already a member');
    }

    // Generate reference number for savings
    const reference = `MEM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create savings record for initial deposit
    const saving = await Savings.create([{
      userId: user._id,
      amount: amount,
      type: 'deposit',
      description: 'Initial membership deposit',
      status: 'completed',
      reference: reference,
      transactionId: transaction._id
    }], { session });

    // Update user to member
    user.isMember = true;
    user.memberSince = new Date();
    user.totalSavings = (user.totalSavings || 0) + amount;
    user.availableBalance = (user.availableBalance || 0) + amount;
    await user.save({ session });

    await session.commitTransaction();
    console.log(`✅ Membership activated for user ${user.name} (${user._id})`);
    return true;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error processing membership payment:', error);
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
    const saving = await Savings.create([{
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

// Main webhook handler
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const callbackData = await req.json();
    console.log('📥 Received M-Pesa callback:', JSON.stringify(callbackData, null, 2));

    // Check for STK Push callback
    if (callbackData.Body?.stkCallback) {
      const response = callbackData.Body.stkCallback;
      const { 
        CheckoutRequestID, 
        ResultCode, 
        ResultDesc,
        CallbackMetadata 
      } = response;

      console.log(`Processing STK callback for: ${CheckoutRequestID}`);

      // Find transaction
      const transaction = await Transaction.findOne({ 
        checkoutRequestId: CheckoutRequestID 
      });

      if (!transaction) {
        console.error('Transaction not found for checkout ID:', CheckoutRequestID);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }

      let processed = false;

      if (ResultCode === 0) {
        // Payment successful - extract metadata
        const metadataMap: { [key: string]: any } = {};
        if (CallbackMetadata?.Item) {
          CallbackMetadata.Item.forEach((item: any) => {
            metadataMap[item.Name] = item.Value;
          });
        }

        const receiptNumber = metadataMap.MpesaReceiptNumber;
        const amount = metadataMap.Amount;
        const phoneNumber = metadataMap.PhoneNumber;

        console.log(`✅ Payment successful! Receipt: ${receiptNumber}, Amount: ${amount}`);

        // Process based on transaction type
        switch (transaction.type) {
          case 'order':
            processed = await processOrderPayment(transaction, receiptNumber, amount, phoneNumber);
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
          default:
            console.log(`Unknown transaction type: ${transaction.type}`);
            // Just mark as success
            transaction.status = 'success';
            transaction.receiptNumber = receiptNumber;
            await transaction.save();
            processed = true;
        }

        if (processed) {
          console.log(`✅ ${transaction.type} payment processed successfully`);
        } else {
          console.error(`❌ Failed to process ${transaction.type} payment`);
        }

      } else {
        // Payment failed
        console.log(`❌ Payment failed: ${ResultDesc}`);
        await processFailedPayment(transaction, ResultDesc);
      }
    }

    // Always return success to M-Pesa
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: "Success" },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Callback processing error:', error);
    // Always return success to M-Pesa even if we have errors
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: "Success" },
      { status: 200 }
    );
  }
}