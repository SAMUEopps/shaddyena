// Updated Order Model with ObjectId support
/*import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: Types.ObjectId; // Changed from string to ObjectId
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  suborders: {
    vendorId: string;
    shopId: string;
    items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
    amount: number;
    commission: number;
    netAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  }[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
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
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  mpesaTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, unique: true, required: true },
  draftToken: { type: String, required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Now using ObjectId
  items: [{
    productId: { type: String, required: true },
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  suborders: [{
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    items: [{
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }],
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    }
  }],
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  currency: { type: String, default: 'KES' },
  paymentMethod: { type: String, default: 'M-PESA' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: 'Kenya' },
    phone: { type: String, required: true },
    instructions: { type: String }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  mpesaTransactionId: { type: String }
}, { timestamps: true });

// Update indexes for better performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });
OrderSchema.index({ createdAt: -1 }); // Add this for better sorting performance

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);*/



/*import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: Types.ObjectId;
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  suborders: {
    vendorId: string;
    shopId: string;
    riderId?: Types.ObjectId; // NEW: Delivery guy assigned
    deliveryFee: number; // NEW: Fee for delivery
    riderPayoutStatus: 'PENDING' | 'PAID' | 'HOLD'; // NEW: Rider payment status
    items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
    amount: number;
    commission: number;
    netAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED';
    deliveryDetails?: {
      pickupAddress?: string;
      dropoffAddress: string;
      estimatedTime?: Date;
      actualTime?: Date;
      notes?: string;
      confirmationCode?: string;
      confirmedAt?: Date; // When customer confirmed
      riderConfirmedAt?: Date; // When rider entered code
    };
  }[];
  totalAmount: number;
  platformFee: number;
  shippingFee: number;
  deliveryFeeTotal: number; // NEW: Sum of all delivery fees
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
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' |'CONFIRMED';
  mpesaTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, unique: true, required: true },
  draftToken: { type: String, required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  suborders: [{
    vendorId: { type: String, required: true },
    shopId: { type: String, required: true },
    riderId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User with role 'delivery'
    deliveryFee: { type: Number, default: 0 },
    riderPayoutStatus: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'PAID', 'HOLD'],
      default: 'PROCESSING'
    },
    items: [{
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }],
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'CANCELLED'],
      default: 'PROCESSING'
    },
    deliveryDetails: {
      pickupAddress: { type: String },
      dropoffAddress: { type: String, required: false },
      estimatedTime: { type: Date },
      actualTime: { type: Date },
      notes: { type: String },
      confirmationCode: { type: String },
      confirmedAt: { type: Date },
      riderConfirmedAt: { type: Date }
    }
  }],
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  deliveryFeeTotal: { type: Number, default: 0 }, // Sum of suborder delivery fees
  currency: { type: String, default: 'KES' },
  paymentMethod: { type: String, default: 'M-PESA' },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: 'Kenya' },
    phone: { type: String, required: true },
    instructions: { type: String }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CONFIRMED' , 'COMPLETED', 'CANCELLED'],
    default: 'PROCESSING'
  },
  mpesaTransactionId: { type: String }
}, { timestamps: true });

// Indexes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });
OrderSchema.index({ 'suborders.riderId': 1 });
OrderSchema.index({ 'suborders.status': 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save hook to update deliveryFeeTotal
OrderSchema.pre('save', function(next) {
  if (this.isModified('suborders')) {
    this.deliveryFeeTotal = this.suborders.reduce((sum, suborder) => sum + (suborder.deliveryFee || 0), 0);
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);*/


/*import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the delivery details interface for better type safety
export interface DeliveryDetails {
  pickupAddress?: string;
  dropoffAddress: string;
  estimatedTime?: Date;
  actualTime?: Date;
  notes?: string;
  confirmationCode?: string;
  confirmedAt?: Date;
  riderConfirmedAt?: Date;
  // Delivery fee payment fields
  deliveryFeePaymentRef?: string;
  deliveryFeePaid?: boolean;
  deliveryFeePaidAt?: Date;
  deliveryFeeReceipt?: string;
  deliveryFeePaymentFailed?: boolean;
  deliveryFeePaymentError?: string;
}

export interface ISuborder {
  vendorId: string;
  shopId: string;
  riderId?: Types.ObjectId;
  deliveryFee: number;
  riderPayoutStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'HOLD';
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED';
  deliveryDetails?: DeliveryDetails;
}

export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: Types.ObjectId;
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  suborders: ISuborder[];
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
  createdAt: Date;
  updatedAt: Date;
}



const OrderSchema = new Schema<IOrder>({
  orderId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  draftToken: { 
    type: String, 
    required: true 
  },
  buyerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    productId: { 
      type: String, 
      required: true 
    },
    vendorId: { 
      type: String, 
      required: true 
    },
    shopId: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    image: { 
      type: String 
    }
  }],
  suborders: [{
    vendorId: { 
      type: String, 
      required: true 
    },
    shopId: { 
      type: String, 
      required: true 
    },
    riderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    deliveryFee: { 
      type: Number, 
      default: 0 
    },
    riderPayoutStatus: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'PAID', 'HOLD'],
      default: 'PROCESSING'
    },
    items: [{
      productId: { 
        type: String, 
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
      price: { 
        type: Number, 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      image: { 
        type: String 
      }
    }],
    amount: { 
      type: Number, 
      required: true 
    },
    commission: { 
      type: Number, 
      required: true 
    },
    netAmount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PROCESSING'
    },
    deliveryDetails: {
      pickupAddress: { 
        type: String 
      },
      dropoffAddress: { 
        type: String, 
        required: false 
      },
      estimatedTime: { 
        type: Date 
      },
      actualTime: { 
        type: Date 
      },
      notes: { 
        type: String 
      },
      confirmationCode: { 
        type: String 
      },
      confirmedAt: { 
        type: Date 
      },
      riderConfirmedAt: { 
        type: Date 
      },
      // Delivery fee payment fields
      deliveryFeePaymentRef: { 
        type: String,
        index: true // Add index for faster queries
      },
      deliveryFeePaid: { 
        type: Boolean, 
        default: false 
      },
      deliveryFeePaidAt: { 
        type: Date 
      },
      deliveryFeeReceipt: { 
        type: String 
      },
      deliveryFeePaymentFailed: { 
        type: Boolean, 
        default: false 
      },
      deliveryFeePaymentError: { 
        type: String 
      }
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  platformFee: { 
    type: Number, 
    default: 0 
  },
  shippingFee: { 
    type: Number, 
    default: 0 
  },
  deliveryFeeTotal: { 
    type: Number, 
    default: 0 
  },
  currency: { 
    type: String, 
    default: 'KES' 
  },
  paymentMethod: { 
    type: String, 
    default: 'M-PESA' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  shipping: {
    address: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true, 
      default: 'Kenya' 
    },
    phone: { 
      type: String, 
      required: true 
    },
    instructions: { 
      type: String 
    }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PROCESSING'
  },
  mpesaTransactionId: { 
    type: String 
  }
}, { 
  timestamps: true 
});

interface IOrderModel extends mongoose.Model<IOrder> {
  getRiderEarnings(riderId: string): Promise<number>;
}

// Indexes for better query performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });
OrderSchema.index({ 'suborders.riderId': 1 });
OrderSchema.index({ 'suborders.status': 1 });
OrderSchema.index({ 'suborders.deliveryDetails.deliveryFeePaymentRef': 1 }); // Add index for payment ref queries
OrderSchema.index({ createdAt: -1 });

OrderSchema.statics.getRiderEarnings = async function (riderId: string): Promise<number> {
  const result = await this.aggregate([
    {
      $match: {
        "suborders.riderId": new mongoose.Types.ObjectId(riderId),
        "suborders.status": "COMPLETED"
      }
    },
    { $unwind: "$suborders" },
    {
      $match: {
        "suborders.riderId": new mongoose.Types.ObjectId(riderId),
        "suborders.status": "COMPLETED"
      }
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$suborders.deliveryFee" }
      }
    }
  ]);

  return result[0]?.totalEarnings || 0;
};

// Pre-save hook to update deliveryFeeTotal
OrderSchema.pre('save', function(next) {
  if (this.isModified('suborders')) {
    this.deliveryFeeTotal = this.suborders.reduce((sum, suborder) => sum + (suborder.deliveryFee || 0), 0);
  }
  next();
});

// Method to check if delivery fee is paid for a suborder
OrderSchema.methods.isDeliveryFeePaid = function(suborderId: string): boolean {
  const suborder = this.suborders.id(suborderId);
  return suborder?.deliveryDetails?.deliveryFeePaid === true;
};

// Method to get confirmation code for a suborder
OrderSchema.methods.getConfirmationCode = function(suborderId: string): string | undefined {
  const suborder = this.suborders.id(suborderId);
  return suborder?.deliveryDetails?.confirmationCode;
};

//export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
const Order = (mongoose.models.Order ||
  mongoose.model<IOrder, IOrderModel>('Order', OrderSchema)) as IOrderModel;

export default Order;*/

// models/Order.ts (UPDATED with proper typing)
import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the delivery details interface for better type safety
export interface DeliveryDetails {
  pickupAddress?: string;
  dropoffAddress?: string;
  estimatedTime?: Date;
  actualTime?: Date;
  notes?: string;
  confirmationCode?: string;
  confirmedAt?: Date;
  riderConfirmedAt?: Date;
  // Delivery fee payment fields
  deliveryFeePaymentRef?: string;
  deliveryFeePaid?: boolean;
  deliveryFeePaidAt?: Date;
  deliveryFeeReceipt?: string;
  deliveryFeePaymentFailed?: boolean;
  deliveryFeePaymentError?: string;
}

// Define Suborder interface with _id
export interface ISuborder {
  _id?: Types.ObjectId; // Add _id as optional
  vendorId: string;
  shopId: string;
  riderId?: Types.ObjectId;
  deliveryFee: number;
  riderPayoutStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'HOLD';
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  amount: number;
  commission: number;
  netAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'CONFIRMED' | 'COMPLETED';
  deliveryDetails?: DeliveryDetails;
}

// Define Order interface with proper subdocument typing
export interface IOrder extends Document {
  orderId: string;
  draftToken: string;
  buyerId: Types.ObjectId;
  items: {
    productId: string;
    vendorId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    _id?: Types.ObjectId;
  }[];
  suborders: Types.DocumentArray<ISuborder & Document>; // Use DocumentArray for subdocuments
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
    _id?: Types.ObjectId;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
  mpesaTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  isDeliveryFeePaid(suborderId: string): boolean;
  getConfirmationCode(suborderId: string): string | undefined;
}

// Define Order model interface with statics
export interface IOrderModel extends mongoose.Model<IOrder> {
  getRiderEarnings(riderId: string): Promise<number>;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  draftToken: { 
    type: String, 
    required: true 
  },
  buyerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    productId: { 
      type: String, 
      required: true 
    },
    vendorId: { 
      type: String, 
      required: true 
    },
    shopId: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    image: { 
      type: String 
    }
  }],
  suborders: [{
    vendorId: { 
      type: String, 
      required: true 
    },
    shopId: { 
      type: String, 
      required: true 
    },
    riderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    deliveryFee: { 
      type: Number, 
      default: 0 
    },
    riderPayoutStatus: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'PAID', 'HOLD'],
      default: 'PROCESSING'
    },
    items: [{
      productId: { 
        type: String, 
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
      price: { 
        type: Number, 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      image: { 
        type: String 
      }
    }],
    amount: { 
      type: Number, 
      required: true 
    },
    commission: { 
      type: Number, 
      required: true 
    },
    netAmount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PROCESSING'
    },
    deliveryDetails: {
      pickupAddress: { 
        type: String 
      },
      dropoffAddress: { 
        type: String, 
        required: false 
      },
      estimatedTime: { 
        type: Date 
      },
      actualTime: { 
        type: Date 
      },
      notes: { 
        type: String 
      },
      confirmationCode: { 
        type: String 
      },
      confirmedAt: { 
        type: Date 
      },
      riderConfirmedAt: { 
        type: Date 
      },
      // Delivery fee payment fields
      deliveryFeePaymentRef: { 
        type: String,
        index: true
      },
      deliveryFeePaid: { 
        type: Boolean, 
        default: false 
      },
      deliveryFeePaidAt: { 
        type: Date 
      },
      deliveryFeeReceipt: { 
        type: String 
      },
      deliveryFeePaymentFailed: { 
        type: Boolean, 
        default: false 
      },
      deliveryFeePaymentError: { 
        type: String 
      }
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  platformFee: { 
    type: Number, 
    default: 0 
  },
  shippingFee: { 
    type: Number, 
    default: 0 
  },
  deliveryFeeTotal: { 
    type: Number, 
    default: 0 
  },
  currency: { 
    type: String, 
    default: 'KES' 
  },
  paymentMethod: { 
    type: String, 
    default: 'M-PESA' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  shipping: {
    address: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true, 
      default: 'Kenya' 
    },
    phone: { 
      type: String, 
      required: true 
    },
    instructions: { 
      type: String 
    }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PROCESSING'
  },
  mpesaTransactionId: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ draftToken: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'suborders.vendorId': 1 });
OrderSchema.index({ 'suborders.riderId': 1 });
OrderSchema.index({ 'suborders.status': 1 });
OrderSchema.index({ 'suborders.deliveryDetails.deliveryFeePaymentRef': 1 });
OrderSchema.index({ createdAt: -1 });

// Static method to get rider earnings
OrderSchema.statics.getRiderEarnings = async function(riderId: string): Promise<number> {
  const result = await this.aggregate([
    {
      $match: {
        "suborders.riderId": new mongoose.Types.ObjectId(riderId),
        "suborders.status": "COMPLETED"
      }
    },
    { $unwind: "$suborders" },
    {
      $match: {
        "suborders.riderId": new mongoose.Types.ObjectId(riderId),
        "suborders.status": "COMPLETED"
      }
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$suborders.deliveryFee" }
      }
    }
  ]);

  return result[0]?.totalEarnings || 0;
};

// Pre-save hook to update deliveryFeeTotal
OrderSchema.pre('save', function(next) {
  if (this.isModified('suborders')) {
    this.deliveryFeeTotal = this.suborders.reduce((sum, suborder) => sum + (suborder.deliveryFee || 0), 0);
  }
  next();
});

// Method to check if delivery fee is paid for a suborder
OrderSchema.methods.isDeliveryFeePaid = function(suborderId: string): boolean {
  const suborder = this.suborders.id(suborderId);
  return suborder?.deliveryDetails?.deliveryFeePaid === true;
};

// Method to get confirmation code for a suborder
OrderSchema.methods.getConfirmationCode = function(suborderId: string): string | undefined {
  const suborder = this.suborders.id(suborderId);
  return suborder?.deliveryDetails?.confirmationCode;
};

// Create or get the model
const Order = (mongoose.models.Order as IOrderModel) || 
  mongoose.model<IOrder, IOrderModel>('Order', OrderSchema);

export default Order;