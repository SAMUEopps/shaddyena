// // app/api/callback/types/index.ts

// import { Document, Types } from 'mongoose';

// export interface MpesaCallbackMetadata {
//   MpesaReceiptNumber?: string;
//   Amount?: number;
//   PhoneNumber?: string;
//   [key: string]: any;
// }

// export interface StkCallbackResponse {
//   CheckoutRequestID: string;
//   ResultCode: string;
//   ResultDesc: string;
//   CallbackMetadata?: {
//     Item: Array<{
//       Name: string;
//       Value: any;
//     }>;
//   };
// }

// export interface C2BCallbackData {
//   TransactionType: string;
//   TransID: string;
//   TransAmount: string;
//   BillRefNumber: string;
//   MSISDN: string;
//   BusinessShortCode: string;
//   OrgAccountBalance?: string;
//   FirstName?: string;
//   LastName?: string;
//   TransTime?: string;
// }

// // export interface TransactionDocument extends Document {
// //   _id: Types.ObjectId;
// //   transactionId: string;
// //   checkoutRequestId?: string;
// //   accountReference?: string;
// //   type: 'order' | 'membership' | 'savings' | 'investment' | 'advertisement' | 'subscription';
// //   status: 'pending' | 'success' | 'failed';
// //   amount: number;
// //   phoneNumber: string;
// //   userId: Types.ObjectId;
// //   receiptNumber?: string;
// //   errorMessage?: string;
// //   metadata?: {
// //     orders?: string[];
// //     customerId?: string;
// //     referredBy?: string;
// //     adId?: string;
// //     vendorId?: string;
// //     subscriptionId?: string;
// //     investmentId?: string;
// //     description?: string;
// //     accountReference?: string;
// //     checkoutRequestId?: string;
// //     [key: string]: any;
// //   };
// //   //save(): Promise<this>;
// // }

// export interface TransactionDocument extends Document {
//   _id: Types.ObjectId;
//   transactionId: string;
//   checkoutRequestId?: string;
//   accountReference?: string;
//   type: 'order' | 'membership' | 'savings' | 'investment' | 'payout' | 'refund' | 'advertisement' | 'subscription' | 'petty_cash_deposit' | 'petty_cash_payout';
//   status: 'pending' | 'success' | 'failed' | 'cancelled';
//   amount: number;
//   phoneNumber: string;
//   userId: Types.ObjectId;
//   budgetId?: Types.ObjectId;
//   receiptNumber?: string;
//   errorMessage?: string;
//   metadata?: {
//     orders?: string[];
//     customerId?: string;
//     referredBy?: string;
//     adId?: string;
//     vendorId?: string;
//     subscriptionId?: string;
//     investmentId?: string;
//     budgetId?: string;
//     description?: string;
//     accountReference?: string;
//     checkoutRequestId?: string;
//     [key: string]: any;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface PaymentResult {
//   success: boolean;
//   message?: string;
//   data?: any;
// }


// app/api/callback/types/index.ts

import { Document, Types } from 'mongoose';

export interface MpesaCallbackMetadata {
  MpesaReceiptNumber?: string;
  Amount?: number;
  PhoneNumber?: string;
  [key: string]: any;
}

export interface StkCallbackResponse {
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: Array<{
      Name: string;
      Value: any;
    }>;
  };
}

export interface C2BCallbackData {
  TransactionType: string;
  TransID: string;
  TransAmount: string;
  BillRefNumber: string;
  MSISDN: string;
  BusinessShortCode: string;
  OrgAccountBalance?: string;
  FirstName?: string;
  LastName?: string;
  TransTime?: string;
}

// FIXED: Aligned with actual ITransaction model from shd-models/models/Transaction.ts
export interface TransactionDocument extends Document {
  _id: Types.ObjectId;
  transactionId: string;
  organizationId: Types.ObjectId;
  type: 'payment' | 'deposit' | 'payout' | 'refund';
  category: 'order' | 'membership' | 'savings' | 'investment' | 'petty_cash' | 'advertisement' | 'subscription' | 'vendor_payout' | 'customer_payment' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  phoneNumber?: string;
  accountReference?: string;
  externalReference?: string;
  externalEntityId?: string;
  externalEntityType?: string;
  provider?: 'mpesa' | 'paystack' | 'stripe' | 'paypal' | 'other';
  providerTransactionId?: string;
  checkoutRequestId?: string;
  receiptNumber?: string;
  purpose?: string;
  metadata?: Record<string, any>;
  errorMessage?: string;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResult {
  success: boolean;
  message?: string;
  data?: any;
}