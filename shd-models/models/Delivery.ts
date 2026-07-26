// // // C:\Users\USER\Desktop\Projects\my-app\models\Delivery.ts
// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IDelivery extends Document {
// //   orderId: mongoose.Types.ObjectId;
// //   customerName: string;
// //   customerPhone: string;
// //   pickupLocation: string;
// //   dropoffLocation: string;
// //   assignedRiderId?: mongoose.Types.ObjectId;
// //   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
// //   distance: number;
// //   earnings: number;
// //   pickupCoordinates?: {
// //     lat: number;
// //     lng: number;
// //   };
// //   dropoffCoordinates?: {
// //     lat: number;
// //     lng: number;
// //   };
// //   estimatedTime: string;
// //   acceptedAt?: Date;
// //   pickedUpAt?: Date;
// //   inTransitAt?: Date;
// //   deliveredAt?: Date;
// //   createdAt: Date;
// // }

// // const DeliverySchema = new Schema<IDelivery>({
// //   orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
// //   customerName: { type: String, required: true },
// //   customerPhone: { type: String, required: true },
// //   pickupLocation: { type: String, required: true },
// //   dropoffLocation: { type: String, required: true },
// //   assignedRiderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
// //     default: 'pending'
// //   },
// //   distance: { type: Number, default: 0 },
// //   earnings: { type: Number, default: 0 },
// //   pickupCoordinates: {
// //     lat: Number,
// //     lng: Number
// //   },
// //   dropoffCoordinates: {
// //     lat: Number,
// //     lng: Number
// //   },
// //   estimatedTime: { type: String, default: '30 min' },
// //   acceptedAt: Date,
// //   pickedUpAt: Date,
// //   inTransitAt: Date,
// //   deliveredAt: Date,
// //   createdAt: { type: Date, default: Date.now }
// // });

// // export default mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);

// // C:\Users\USER\Desktop\Projects\shaddyena\shd-models\models\Delivery.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IDelivery extends Document {
//   orderId: mongoose.Types.ObjectId;
//   customerName: string;
//   customerPhone: string;
//   pickupLocation: string;
//   dropoffLocation: string;
//   assignedRiderId?: mongoose.Types.ObjectId;
//   status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed' | 'cancelled';
//   distance: number;
//   earnings: number;
//   pickupCoordinates?: {
//     lat: number;
//     lng: number;
//   };
//   dropoffCoordinates?: {
//     lat: number;
//     lng: number;
//   };
//   estimatedTime: string;
//   acceptedAt?: Date;
//   pickedUpAt?: Date;
//   inTransitAt?: Date;
//   deliveredAt?: Date;
//   completedAt?: Date;
//   confirmationCode?: string;
//   codeGeneratedAt?: Date;
//   codeExpiresAt?: Date;
//   createdAt: Date;
// }

// const DeliverySchema = new Schema<IDelivery>({
//   orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
//   customerName: { type: String, required: true },
//   customerPhone: { type: String, required: true },
//   pickupLocation: { type: String, required: true },
//   dropoffLocation: { type: String, required: true },
//   assignedRiderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'awaiting_confirmation', 'completed', 'cancelled'],
//     default: 'pending'
//   },
//   distance: { type: Number, default: 0 },
//   earnings: { type: Number, default: 0 },
//   pickupCoordinates: {
//     lat: Number,
//     lng: Number
//   },
//   dropoffCoordinates: {
//     lat: Number,
//     lng: Number
//   },
//   estimatedTime: { type: String, default: '30 min' },
//   acceptedAt: Date,
//   pickedUpAt: Date,
//   inTransitAt: Date,
//   deliveredAt: Date,
//   completedAt: Date,
//   confirmationCode: { type: String, unique: true, sparse: true },
//   codeGeneratedAt: Date,
//   codeExpiresAt: Date,
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);

// C:\Users\USER\Desktop\Projects\shaddyena\shd-models\models\Delivery.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDelivery extends Document {
  orderId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  assignedRiderId?: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'awaiting_confirmation' | 'completed' | 'cancelled';
  distance: number;
  earnings: number;
  pickupCoordinates?: {
    lat: number;
    lng: number;
  };
  dropoffCoordinates?: {
    lat: number;
    lng: number;
  };
  estimatedTime: string;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  confirmationCode?: string;
  codeGeneratedAt?: Date;
  codeExpiresAt?: Date;
  customerConfirmed?: boolean;
  customerConfirmedAt?: Date;
  createdAt: Date;
}

const DeliverySchema = new Schema<IDelivery>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  assignedRiderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'awaiting_confirmation', 'completed', 'cancelled'],
    default: 'pending'
  },
  distance: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  pickupCoordinates: {
    lat: Number,
    lng: Number
  },
  dropoffCoordinates: {
    lat: Number,
    lng: Number
  },
  estimatedTime: { type: String, default: '30 min' },
  acceptedAt: Date,
  pickedUpAt: Date,
  inTransitAt: Date,
  deliveredAt: Date,
  completedAt: Date,
  confirmationCode: { type: String, unique: true, sparse: true },
  codeGeneratedAt: Date,
  codeExpiresAt: Date,
  customerConfirmed: { type: Boolean, default: false },
  customerConfirmedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);