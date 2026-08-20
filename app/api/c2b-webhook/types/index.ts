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

export interface TransactionDocument extends Document {
  _id: Types.ObjectId;
  transactionId: string;
  checkoutRequestId?: string;
  accountReference?: string;
  type: 'order' | 'membership' | 'savings' | 'investment' | 'advertisement' | 'subscription';
  status: 'pending' | 'success' | 'failed';
  amount: number;
  phoneNumber: string;
  userId: Types.ObjectId;
  receiptNumber?: string;
  errorMessage?: string;
  metadata?: {
    orders?: string[];
    customerId?: string;
    referredBy?: string;
    adId?: string;
    vendorId?: string;
    subscriptionId?: string;
    investmentId?: string;
    description?: string;
    accountReference?: string;
    checkoutRequestId?: string;
    [key: string]: any;
  };
  save(): Promise<this>;
}

export interface PaymentResult {
  success: boolean;
  message?: string;
  data?: any;
}