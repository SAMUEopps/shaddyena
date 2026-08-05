// export interface Rider {
//   id: string;
//   name: string;
//   phone: string;
//   vehicleType: string;
//   rating: number;
//   totalDeliveries: number;
// }

// export interface Order {
//   _id: string;
//   orderNumber: string;
//   totalAmount: number;
//   status: string;
//   deliveryStatus?: string;

//   customerId: {
//     name: string;
//     phone: string;
//   };

//   products: any[];

//   createdAt: string;

//   deliveryAddress?: string;
//   deliveryPhone?: string;

//   rider?: Rider | null;
//   riderAssignedAt?: Date;
// }

// types/vendor.ts
export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  rating: number;
  totalDeliveries: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  deliveryStatus?: string;
  customerId: {
    name: string;
    phone: string;
  };
  products: any[];
  createdAt: string;
  deliveryAddress?: string;
  deliveryPhone?: string;
  rider?: Rider | null;
  riderAssignedAt?: Date;
  // New fields for revenue
  vendorAmount?: number;
  immediateWithdrawable?: number;
  pendingWithdrawable?: number;
  isImmediatePayoutAvailable?: boolean;
  isPendingPayoutReleased?: boolean;
}

export interface VendorProfile {
  _id: string;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  businessLocation: string;
  payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
  payoutDetails: {
    mpesaNumber?: string;
    pochiNumber?: string;
    tillNumber?: string;
    paybillNumber?: string;
    paybillAccount?: string;
  };
  profileImage?: string;
  coverImage?: string;
  totalEarned: number;
  pendingPayout: number;
  createdAt: string;
  // New revenue fields
  totalRevenue?: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  lifetimeEarnings: number;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'expired' | 'cancelled';
  subscriptionTier?: string;
  subscriptionEndDate?: string;
  isActive?: boolean;
}

export interface RevenueStats {
  totalRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  lifetimeEarnings: number;
}

export interface WithdrawalHistory {
  _id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'MPESA' | 'BANK';
  reference: string;
  transactionId?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}