// models/Order.js
import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

// Define Order Schema
const OrderSchema = new Schema({
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
    riderId: { type: Schema.Types.ObjectId, ref: 'User' },
    deliveryFee: { type: Number, default: 0 },
    riderPayoutStatus: { type: String, enum: ['PENDING','PROCESSING','PAID','HOLD'], default: 'PROCESSING' },
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
    status: { type: String, enum: ['PENDING','PROCESSING','READY_FOR_PICKUP','ASSIGNED','PICKED_UP','IN_TRANSIT','DELIVERED','CONFIRMED','COMPLETED','CANCELLED'], default: 'PROCESSING' },
    deliveryDetails: {
      pickupAddress: { type: String },
      dropoffAddress: { type: String },
      estimatedTime: { type: Date },
      actualTime: { type: Date },
      notes: { type: String },
      confirmationCode: { type: String },
      confirmedAt: { type: Date },
      riderConfirmedAt: { type: Date },
      deliveryFeePaymentRef: { type: String, index: true },
      deliveryFeePaid: { type: Boolean, default: false },
      deliveryFeePaidAt: { type: Date },
      deliveryFeeReceipt: { type: String },
      deliveryFeePaymentFailed: { type: Boolean, default: false },
      deliveryFeePaymentError: { type: String }
    }
  }],
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  deliveryFeeTotal: { type: Number, default: 0 },
  currency: { type: String, default: 'KES' },
  paymentMethod: { type: String, default: 'M-PESA' },
  paymentStatus: { type: String, enum: ['PENDING','PAID','FAILED','REFUNDED'], default: 'PENDING' },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: 'Kenya' },
    phone: { type: String, required: true },
    instructions: { type: String }
  },
  status: { type: String, enum: ['PENDING','PROCESSING','SHIPPED','DELIVERED','CONFIRMED','COMPLETED','CANCELLED'], default: 'PROCESSING' },
  mpesaTransactionId: { type: String },
  isViewed: { type: Boolean, default: false, index: true }
}, { timestamps: true });

// Indexes
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
OrderSchema.statics.getRiderEarnings = async function(riderId) {
  const result = await this.aggregate([
    { $unwind: '$suborders' },
    { $match: { 'suborders.riderId': new Types.ObjectId(riderId), 'suborders.status': 'COMPLETED' } },
    { $group: { _id: null, totalEarnings: { $sum: '$suborders.deliveryFee' } } }
  ]);
  return result[0]?.totalEarnings || 0;
};

// Pre-save hook to update deliveryFeeTotal
OrderSchema.pre('save', function(next) {
  if (this.isModified('suborders')) {
    this.deliveryFeeTotal = this.suborders.reduce((sum, s) => sum + (s.deliveryFee || 0), 0);
  }
  next();
});

// Method to check if delivery fee is paid
OrderSchema.methods.isDeliveryFeePaid = function(suborderId) {
  const suborder = this.suborders.id(suborderId);
  return suborder?.deliveryDetails?.deliveryFeePaid === true;
};

// Method to get confirmation code
OrderSchema.methods.getConfirmationCode = function(suborderId) {
  const suborder = this.suborders.id(suborderId);
  return suborder?.deliveryDetails?.confirmationCode;
};

// Create or get model
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;