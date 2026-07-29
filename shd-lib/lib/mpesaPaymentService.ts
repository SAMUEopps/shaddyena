// // // shd-lib/services/mpesaPaymentService.ts
// // import { initSTKPush, queryTransactionStatus } from '@/shd-lib/lib/mpesa';
// // import { connectToDatabase } from '@/shd-lib/lib/mongodb';
// // import Transaction from '@/shd-models/models/Transaction';
// // import User from '@/shd-models/models/User';
// // import mongoose from 'mongoose';

// // export class MpesaPaymentService {
// //   private userId: string;
// //   private user: any;

// //   constructor(userId: string) {
// //     this.userId = userId;
// //   }

// //   private async getUser() {
// //     if (!this.user) {
// //       await connectToDatabase();
// //       this.user = await User.findById(this.userId);
// //     }
// //     return this.user;
// //   }

// //   private generateReference(prefix: string): string {
// //     return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
// //   }

// //   async initiatePayment(
// //     amount: number,
// //     purpose: 'membership' | 'savings' | 'investment',
// //     metadata: any = {}
// //   ): Promise<{ checkoutRequestId: string; transactionId: string }> {
// //     const user = await this.getUser();
// //     if (!user) throw new Error('User not found');

// //     // Generate reference based on purpose
// //     const referencePrefix = purpose === 'membership' ? 'MEM' : 
// //                            purpose === 'savings' ? 'SAV' : 'INV';
// //     const accountReference = this.generateReference(referencePrefix);

// //     // Create transaction record
// //     const transaction = await Transaction.create({
// //       userId: this.userId,
// //       transactionId: `STK-${Date.now()}`,
// //       amount: amount,
// //       type: 'payment',
// //       status: 'pending',
// //       purpose: purpose,
// //       accountReference: accountReference,
// //       metadata: {
// //         ...metadata,
// //         userPhoneNumber: user.phoneNumber,
// //         userEmail: user.email,
// //         purpose: purpose,
// //         amount: amount
// //       }
// //     });

// //     try {
// //       // Initiate STK Push
// //       const response = await initSTKPush(
// //         user.phoneNumber,
// //         amount,
// //         accountReference
// //       );

// //       // Update transaction with checkout request ID
// //       transaction.checkoutRequestId = response.CheckoutRequestID;
// //       transaction.transactionId = response.CheckoutRequestID;
// //       await transaction.save();

// //       return {
// //         checkoutRequestId: response.CheckoutRequestID,
// //         transactionId: transaction._id.toString()
// //       };

// //     } catch (error) {
// //       // Update transaction as failed
// //       transaction.status = 'failed';
// //       //transaction.errorMessage = error.message;
// //       await transaction.save();
// //       throw error;
// //     }
// //   }

// //   async queryPaymentStatus(checkoutRequestId: string): Promise<any> {
// //     try {
// //       const result = await queryTransactionStatus(checkoutRequestId);
      
// //       // Update transaction status
// //       const transaction = await Transaction.findOne({ 
// //         checkoutRequestId: checkoutRequestId 
// //       });

// //       if (transaction) {
// //         if (result.ResultCode === 0) {
// //           transaction.status = 'success';
// //           transaction.metadata = {
// //             ...transaction.metadata,
// //             mpesaReceipt: result.CallbackMetadata?.Item?.find(
// //               (item: any) => item.Name === 'MpesaReceiptNumber'
// //             )?.Value,
// //             transactionDate: result.CallbackMetadata?.Item?.find(
// //               (item: any) => item.Name === 'TransactionDate'
// //             )?.Value
// //           };
// //         } else {
// //           transaction.status = 'failed';
// //           transaction.errorMessage = result.ResultDesc;
// //         }
// //         await transaction.save();
// //       }

// //       return {
// //         status: result.ResultCode === 0 ? 'success' : 'failed',
// //         message: result.ResultDesc,
// //         transaction: transaction
// //       };

// //     } catch (error) {
// //       console.error('Payment status query error:', error);
// //       throw error;
// //     }
// //   }

// //   async handleSuccessfulPayment(transactionId: string): Promise<any> {
// //     const session = await mongoose.startSession();
// //     session.startTransaction();

// //     try {
// //       const transaction = await Transaction.findById(transactionId).session(session);
// //       if (!transaction) throw new Error('Transaction not found');

// //       const user = await User.findById(transaction.userId).session(session);
// //       if (!user) throw new Error('User not found');

// //       let result = {};

// //       switch (transaction.purpose) {
// //         case 'membership':
// //           result = await this.processMembershipActivation(user, transaction, session);
// //           break;
// //         case 'savings':
// //           result = await this.processSavingsDeposit(user, transaction, session);
// //           break;
// //         case 'investment':
// //           result = await this.processInvestmentPayment(user, transaction, session);
// //           break;
// //         default:
// //           throw new Error('Unknown payment purpose');
// //       }

// //       transaction.status = 'completed';
// //       await transaction.save({ session });

// //       await session.commitTransaction();
// //       return result;

// //     } catch (error) {
// //       await session.abortTransaction();
// //       throw error;
// //     } finally {
// //       session.endSession();
// //     }
// //   }

// //   private async processMembershipActivation(
// //     user: any,
// //     transaction: any,
// //     session: any
// //   ) {
// //     if (user.isMember) {
// //       throw new Error('Already a member');
// //     }

// //     // Update user to member
// //     user.isMember = true;
// //     user.memberSince = new Date();
// //     user.totalSavings += transaction.amount;
// //     user.availableBalance += transaction.amount;
// //     await user.save({ session });

// //     return {
// //       success: true,
// //       message: 'Membership activated successfully!',
// //       user: {
// //         isMember: user.isMember,
// //         memberSince: user.memberSince,
// //         totalSavings: user.totalSavings,
// //         availableBalance: user.availableBalance
// //       }
// //     };
// //   }

// //   private async processSavingsDeposit(
// //     user: any,
// //     transaction: any,
// //     session: any
// //   ) {
// //     if (!user.isMember) {
// //       throw new Error('Must be a member to save');
// //     }

// //     user.totalSavings += transaction.amount;
// //     user.availableBalance += transaction.amount;
// //     await user.save({ session });

// //     return {
// //       success: true,
// //       message: 'Deposit successful!',
// //       user: {
// //         totalSavings: user.totalSavings,
// //         availableBalance: user.availableBalance
// //       }
// //     };
// //   }

// //   private async processInvestmentPayment(
// //     user: any,
// //     transaction: any,
// //     session: any
// //   ) {
// //     if (!user.isMember) {
// //       throw new Error('Must be a member to invest');
// //     }

// //     const { investmentId, investmentType, expectedReturn } = transaction.metadata;

// //     if (user.availableBalance < transaction.amount) {
// //       throw new Error('Insufficient balance');
// //     }

// //     user.availableBalance -= transaction.amount;
// //     user.totalInvestments += transaction.amount;
// //     await user.save({ session });

// //     return {
// //       success: true,
// //       message: 'Investment payment confirmed!',
// //       user: {
// //         totalInvestments: user.totalInvestments,
// //         availableBalance: user.availableBalance
// //       }
// //     };
// //   }
// // }

// shd-lib/services/mpesaPaymentService.ts
import { initSTKPush, queryTransactionStatus } from '@/shd-lib/lib/mpesa';
import { connectToDatabase } from '@/shd-lib/lib/mongodb';
import Transaction from '@/shd-models/models/Transaction';
import User from '@/shd-models/models/User';
import mongoose from 'mongoose';

export class MpesaPaymentService {
  private userId: string;
  private user: any;

  constructor(userId: string) {
    this.userId = userId;
  }

  private async getUser() {
    if (!this.user) {
      await connectToDatabase();
      this.user = await User.findById(this.userId);
    }
    return this.user;
  }

  private generateReference(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }

  async initiatePayment(
    amount: number,
    purpose: 'membership' | 'savings' | 'investment',
    metadata: any = {}
  ): Promise<{ checkoutRequestId: string; transactionId: string }> {
    const user = await this.getUser();
    if (!user) throw new Error('User not found');

    // Generate reference based on purpose
    const referencePrefix = purpose === 'membership' ? 'MEM' : 
                           purpose === 'savings' ? 'SAV' : 'INV';
    const accountReference = this.generateReference(referencePrefix);
    const transactionId = `STK-${Date.now()}`;

    // Create transaction record
    const transaction = await Transaction.create({
      transactionId: transactionId,
      phoneNumber: user.phoneNumber,
      amount: amount,
      status: 'pending',
      type: purpose, // 'membership', 'savings', or 'investment'
      purpose: purpose,
      userId: user._id,
      accountReference: accountReference,
      metadata: {
        ...metadata,
        userPhoneNumber: user.phoneNumber,
        userEmail: user.email,
        purpose: purpose,
        amount: amount,
        userName: user.name
      }
    });

    try {
      // Initiate STK Push
      const response = await initSTKPush(
        user.phoneNumber,
        amount,
        accountReference
      );

      // Update transaction with checkout request ID
      transaction.checkoutRequestId = response.CheckoutRequestID;
      transaction.transactionId = response.CheckoutRequestID;
      transaction.metadata = {
        ...transaction.metadata,
        checkoutRequestId: response.CheckoutRequestID,
        merchantRequestId: response.MerchantRequestID
      };
      await transaction.save();

      return {
        checkoutRequestId: response.CheckoutRequestID,
        transactionId: transaction._id.toString()
      };

    } catch (error: any) {
      // Update transaction as failed
      transaction.status = 'failed';
      transaction.errorMessage = error.message || 'Failed to initiate payment';
      await transaction.save();
      throw error;
    }
  }

    // New method - accepts custom phone number
//   async initiatePaymentWithPhone(
//     amount: number,
//     purpose: 'membership' | 'savings' | 'investment',
//     phoneNumber: string,
//     metadata: any = {}
//   ): Promise<{ checkoutRequestId: string; transactionId: string }> {
//     const user = await this.getUser();
//     if (!user) throw new Error('User not found');

//     // Clean and validate phone number
//     let cleanPhone = phoneNumber.replace(/[+\s]/g, '');
//     if (cleanPhone.startsWith('0')) {
//       cleanPhone = '254' + cleanPhone.substring(1);
//     }
//     if (!cleanPhone.startsWith('254')) {
//       cleanPhone = '254' + cleanPhone;
//     }

//     if (!/^254[0-9]{9}$/.test(cleanPhone)) {
//       throw new Error('Invalid phone number format');
//     }

//     // Generate reference based on purpose
//     const referencePrefix = purpose === 'membership' ? 'MEM' : 
//                            purpose === 'savings' ? 'SAV' : 'INV';
//     const accountReference = this.generateReference(referencePrefix);
//     const transactionId = `STK-${Date.now()}`;

//     // Create transaction record
//     const transaction = await Transaction.create({
//       transactionId: transactionId,
//       phoneNumber: cleanPhone, // Use the provided phone number
//       amount: amount,
//       status: 'pending',
//       type: purpose,
//       purpose: purpose,
//       userId: user._id,
//       accountReference: accountReference,
//       metadata: {
//         ...metadata,
//         userPhoneNumber: user.phoneNumber, // Store original number
//         providedPhone: cleanPhone, // Store provided number
//         userEmail: user.email,
//         purpose: purpose,
//         amount: amount,
//         userName: user.name
//       }
//     });

//     try {
//       // Initiate STK Push with the provided phone number
//       const response = await initSTKPush(
//         cleanPhone, // Use provided phone number
//         amount,
//         accountReference
//       );

//       // Update transaction with checkout request ID
//       transaction.checkoutRequestId = response.CheckoutRequestID;
//       transaction.transactionId = response.CheckoutRequestID;
//       transaction.metadata = {
//         ...transaction.metadata,
//         checkoutRequestId: response.CheckoutRequestID,
//         merchantRequestId: response.MerchantRequestID
//       };
//       await transaction.save();

//       return {
//         checkoutRequestId: response.CheckoutRequestID,
//         transactionId: transaction._id.toString()
//       };

//     } catch (error: any) {
//       // Update transaction as failed
//       transaction.status = 'failed';
//       transaction.errorMessage = error.message || 'Failed to initiate payment';
//       await transaction.save();
//       throw error;
//     }
//   }
// shd-lib/services/mpesaPaymentService.ts - Add accountReference to transaction
async initiatePaymentWithPhone(
  amount: number,
  purpose: 'membership' | 'savings' | 'investment',
  phoneNumber: string,
  metadata: any = {}
): Promise<{ checkoutRequestId: string; transactionId: string }> {
  const user = await this.getUser();
  if (!user) throw new Error('User not found');

  let cleanPhone = phoneNumber.replace(/[+\s]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '254' + cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith('254')) {
    cleanPhone = '254' + cleanPhone;
  }

  if (!/^254[0-9]{9}$/.test(cleanPhone)) {
    throw new Error('Invalid phone number format');
  }

  // Generate reference based on purpose
  const referencePrefix = purpose === 'membership' ? 'MEM' : 
                         purpose === 'savings' ? 'SAV' : 'INV';
  const accountReference = this.generateReference(referencePrefix);
  const transactionId = `STK-${Date.now()}`;

  // Create transaction record with BOTH checkoutRequestId and accountReference
  const transaction = await Transaction.create({
    transactionId: transactionId,
    phoneNumber: cleanPhone,
    amount: amount,
    status: 'pending',
    type: purpose,
    purpose: purpose,
    userId: user._id,
    accountReference: accountReference, // IMPORTANT: Store for C2B callback matching
    metadata: {
      ...metadata,
      userPhoneNumber: user.phoneNumber,
      providedPhone: cleanPhone,
      userEmail: user.email,
      purpose: purpose,
      amount: amount,
      userName: user.name,
      accountReference: accountReference // Also store in metadata
    }
  });

  try {
    // Initiate STK Push
    const response = await initSTKPush(
      cleanPhone,
      amount,
      accountReference
    );

    // Update transaction with checkout request ID
    transaction.checkoutRequestId = response.CheckoutRequestID;
    transaction.transactionId = response.CheckoutRequestID;
    transaction.metadata = {
      ...transaction.metadata,
      checkoutRequestId: response.CheckoutRequestID,
      merchantRequestId: response.MerchantRequestID
    };
    await transaction.save();

    return {
      checkoutRequestId: response.CheckoutRequestID,
      transactionId: transaction._id.toString()
    };

  } catch (error: any) {
    transaction.status = 'failed';
    transaction.errorMessage = error.message || 'Failed to initiate payment';
    await transaction.save();
    throw error;
  }
}
//   async queryPaymentStatus(checkoutRequestId: string): Promise<any> {
//     try {
//       const result = await queryTransactionStatus(checkoutRequestId);
      
//       // Update transaction status
//       const transaction = await Transaction.findOne({ 
//         checkoutRequestId: checkoutRequestId 
//       });

//       if (transaction) {
//         if (result.ResultCode === 0) {
//           // Payment successful
//           transaction.status = 'success';
          
//           // Extract M-Pesa receipt from callback metadata
//           const metadataItems = result.CallbackMetadata?.Item || [];
//           const receiptNumber = metadataItems.find(
//             (item: any) => item.Name === 'MpesaReceiptNumber'
//           )?.Value;
//           const transactionDate = metadataItems.find(
//             (item: any) => item.Name === 'TransactionDate'
//           )?.Value;

//           transaction.receiptNumber = receiptNumber || transaction.receiptNumber;
//           transaction.metadata = {
//             ...transaction.metadata,
//             mpesaReceipt: receiptNumber,
//             transactionDate: transactionDate,
//             callbackMetadata: result.CallbackMetadata
//           };
//         } else {
//           transaction.status = 'failed';
//           transaction.errorMessage = result.ResultDesc || 'Payment failed';
//         }
//         await transaction.save();
//       }

//       return {
//         status: result.ResultCode === 0 ? 'success' : 'failed',
//         message: result.ResultDesc,
//         transaction: transaction
//       };

//     } catch (error) {
//       console.error('Payment status query error:', error);
//       throw error;
//     }
//   }

async queryPaymentStatus(
  checkoutRequestId:string
): Promise<any>{

  try {


    const result =
      await queryTransactionStatus(
        checkoutRequestId
      );


    const transaction =
      await Transaction.findOne({
        checkoutRequestId
      });



    if(!transaction){

      throw new Error(
        "Transaction not found"
      );

    }



    console.log(
      "M-Pesa Result:",
      result
    );



    /*
      ResultCode 0
      = success

      ResultCode 1032
      = cancelled

      ResultCode 1037
      = timeout

      Other codes may mean processing
    */



    if(result.ResultCode === 0){


      transaction.status="success";

      await this.handleSuccessfulPayment(
        transaction._id.toString()
      );


      const items =
        result.CallbackMetadata?.Item || [];


      const receipt =
        items.find(
          (i:any)=>
            i.Name==="MpesaReceiptNumber"
        )?.Value;



      transaction.receiptNumber =
        receipt ||
        transaction.receiptNumber;



      transaction.metadata={
        ...transaction.metadata,

        mpesaReceipt:receipt,

        callbackMetadata:
          result.CallbackMetadata

      };



    }


    else if(

      result.ResultDesc
      ?.toLowerCase()
      .includes(
        "still under processing"
      )

    ){

      // VERY IMPORTANT
      // DO NOT FAIL IT

      transaction.status="pending";

      transaction.errorMessage =
        undefined;


    }



    else if(

      result.ResultCode === 1032 ||
      result.ResultCode === 1037

    ){


      transaction.status="failed";


      transaction.errorMessage =
        result.ResultDesc ||
        "Payment cancelled";

    }



    else {


      /*
        Unknown responses stay pending
        because callbacks are the source
        of truth.
      */


      transaction.status="pending";


    }



    await transaction.save();



    return {

      status:
        transaction.status,

      message:
        result.ResultDesc,

      transaction

    };


  }

  catch(error){

    console.error(
      "Payment query error:",
      error
    );

    throw error;

  }

}

  async handleSuccessfulPayment(transactionId: string): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findById(transactionId).session(session);
      if (!transaction) throw new Error('Transaction not found');

      const user = await User.findById(transaction.userId).session(session);
      if (!user) throw new Error('User not found');

      let result = {};

      // Process based on transaction type
      switch (transaction.type) {
        case 'membership':
          result = await this.processMembershipActivation(user, transaction, session);
          break;
        case 'savings':
          result = await this.processSavingsDeposit(user, transaction, session);
          break;
        case 'investment':
          result = await this.processInvestmentPayment(user, transaction, session);
          break;
        default:
          throw new Error('Unknown transaction type');
      }

      // Mark transaction as completed
      transaction.status = 'success';
      await transaction.save({ session });

      await session.commitTransaction();
      return result;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async processMembershipActivation(
    user: any,
    transaction: any,
    session: any
  ) {
    if (user.isMember) {
      throw new Error('Already a member');
    }

    // Update user to member
    user.isMember = true;
    user.memberSince = new Date();
    user.totalSavings = (user.totalSavings || 0) + transaction.amount;
    user.availableBalance = (user.availableBalance || 0) + transaction.amount;
    await user.save({ session });

    return {
      success: true,
      message: 'Membership activated successfully!',
      user: {
        isMember: user.isMember,
        memberSince: user.memberSince,
        totalSavings: user.totalSavings,
        availableBalance: user.availableBalance
      }
    };
  }

  private async processSavingsDeposit(
    user: any,
    transaction: any,
    session: any
  ) {
    if (!user.isMember) {
      throw new Error('Must be a member to save');
    }

    user.totalSavings = (user.totalSavings || 0) + transaction.amount;
    user.availableBalance = (user.availableBalance || 0) + transaction.amount;
    await user.save({ session });

    return {
      success: true,
      message: 'Deposit successful!',
      user: {
        totalSavings: user.totalSavings,
        availableBalance: user.availableBalance
      }
    };
  }

  private async processInvestmentPayment(
    user: any,
    transaction: any,
    session: any
  ) {
    if (!user.isMember) {
      throw new Error('Must be a member to invest');
    }

    const { investmentId, investmentType, expectedReturn } = transaction.metadata;

    // Check if user has enough balance (they should since we're processing payment)
    if ((user.availableBalance || 0) < transaction.amount) {
      throw new Error('Insufficient balance');
    }

    user.availableBalance = (user.availableBalance || 0) - transaction.amount;
    user.totalInvestments = (user.totalInvestments || 0) + transaction.amount;
    await user.save({ session });

    // Update investment status to active
    if (investmentId) {
      const Investment = mongoose.model('Investment');
      await Investment.findByIdAndUpdate(
        investmentId,
        { 
          status: 'active',
          startDate: new Date()
        },
        { session }
      );
    }

    return {
      success: true,
      message: 'Investment payment confirmed!',
      user: {
        totalInvestments: user.totalInvestments,
        availableBalance: user.availableBalance
      }
    };
  }
}