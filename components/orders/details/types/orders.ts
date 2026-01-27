/*import { Types } from 'mongoose';

// Common interfaces used across all order modules
export interface OrderItem {
  productId: string;
  vendorId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Suborder {
  _id?: string;
  vendorId: string;
  riderId?: Types.ObjectId | string;
  shopId: string;
  items: OrderItem[];
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'READY_FOR_PICKUP';
  deliveryFee?: number;
  riderPayoutStatus?: 'PENDING' | 'PAID' | 'HOLD';
  deliveryDetails?: {
    pickupAddress?: string;
    dropoffAddress: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
    riderConfirmedAt?: string | Date;
  };
}

export interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  buyerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  suborders: Suborder[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  deliveryFeeTotal: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
  mpesaTransactionId?: string;
}

export interface ApiResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface VendorSuborderData {
  suborder: Suborder;
  items: OrderItem[];
}*/





/*import { Types } from 'mongoose';

// Common interfaces used across all order modules
export interface OrderItem {
  productId: string;
  vendorId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Suborder {
  _id?: string;
  vendorId: string;
  riderId?: Types.ObjectId | string;
  shopId: string;
  items: OrderItem[];
  amount: number;
  commission: number;
  netAmount: number;
  // Extended to include rider workflow statuses
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT';
  deliveryFee?: number;
  riderPayoutStatus?: 'PENDING' | 'PAID' | 'HOLD';
  deliveryDetails?: {
    confirmedAt: any;
    pickupAddress?: string;
    dropoffAddress: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
    riderConfirmedAt?: string | Date;
  };
}

export interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  buyerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  suborders: Suborder[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  deliveryFeeTotal: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
  mpesaTransactionId?: string;
}

export interface ApiResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface VendorSuborderData {
  suborder: Suborder;
  items: OrderItem[];
}*/

import { Types } from 'mongoose';

// Common interfaces used across all order modules
export interface OrderItem {
  productId: string;
  vendorId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Suborder {
  _id: string;  // Make required - MongoDB always provides this
  vendorId: string;
  riderId?: Types.ObjectId | string;
  shopId: string;
  items: OrderItem[];
  amount: number;
  commission: number;
  netAmount: number;
  // Added 'CONFIRMED' status for customer confirmation workflow
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 
          'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 
          'CONFIRMED';  // ← Added for rider delivery confirmation
  deliveryFee: number;  // ← Make required for delivery orders (or keep optional if not all have delivery)
  riderPayoutStatus?: 'PENDING' | 'PAID' | 'HOLD';
  deliveryDetails?: {
    confirmedAt?: Date | string;  // ← Made optional (was required)
    pickupAddress?: string;
    dropoffAddress: string;
    estimatedTime?: string;
    actualTime?: string;
    notes?: string;
    confirmationCode?: string;
    riderConfirmedAt?: Date | string;  // Consistent type with confirmedAt
    customerConfirmedAt?: Date | string;  // Track when customer confirmed
  };
}

export interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  buyerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  suborders: Suborder[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  deliveryFeeTotal: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping: {
    address: string;
    city: string;
    country: string;
    phone: string;
    instructions?: string;
  };
  // Note: Order-level status might differ from suborder-level status
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
  mpesaTransactionId?: string;
}

export interface ApiResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface VendorSuborderData {
  suborder: Suborder;
  items: OrderItem[];
}