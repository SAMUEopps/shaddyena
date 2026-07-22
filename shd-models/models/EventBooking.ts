// // // C:\Users\USER\Desktop\Projects\my-app\models\EventBooking.ts
// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IEventBooking extends Document {
// //   eventId: mongoose.Types.ObjectId;
// //   userId: mongoose.Types.ObjectId;
// //   bookingReference: string;
// //   numberOfTickets: number;
// //   totalAmount: number;
// //   ticketType: 'regular' | 'vip' | 'early_bird' | 'group';
// //   attendeeDetails: {
// //     name: string;
// //     email: string;
// //     phone: string;
// //   }[];
// //   specialRequests?: string;
// //   status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
// //   paymentStatus: 'pending' | 'paid' | 'refunded';
// //   transactionId?: string;
// //   checkedIn: boolean;
// //   checkInTime?: Date;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const EventBookingSchema = new Schema<IEventBooking>({
// //   eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
// //   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// //   bookingReference: { type: String, required: true, unique: true },
// //   numberOfTickets: { type: Number, required: true, min: 1 },
// //   totalAmount: { type: Number, required: true },
// //   ticketType: {
// //     type: String,
// //     enum: ['regular', 'vip', 'early_bird', 'group'],
// //     default: 'regular'
// //   },
// //   attendeeDetails: [{
// //     name: { type: String, required: true },
// //     email: { type: String, required: true },
// //     phone: { type: String, required: true }
// //   }],
// //   specialRequests: { type: String },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'confirmed', 'cancelled', 'attended'],
// //     default: 'pending'
// //   },
// //   paymentStatus: {
// //     type: String,
// //     enum: ['pending', 'paid', 'refunded'],
// //     default: 'pending'
// //   },
// //   transactionId: { type: String },
// //   checkedIn: { type: Boolean, default: false },
// //   checkInTime: { type: Date },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Generate unique booking reference
// // EventBookingSchema.pre('save', function(next) {
// //   if (!this.bookingReference) {
// //     const prefix = 'EVT';
// //     const timestamp = Date.now().toString().slice(-6);
// //     const random = Math.random().toString(36).substring(2, 6).toUpperCase();
// //     this.bookingReference = `${prefix}-${timestamp}-${random}`;
// //   }

// // });

// // export default mongoose.models.EventBooking || mongoose.model<IEventBooking>('EventBooking', EventBookingSchema);


// // C:\Users\Administrator\Desktop\my-app\models\EventBooking.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IEventBooking extends Document {
//   eventId: mongoose.Types.ObjectId;
//   userId: mongoose.Types.ObjectId;
//   bookingReference: string;
//   ticketType: string; // Now stores the custom ticket type name
//   numberOfTickets: number;
//   pricePerTicket: number; // Store the price at time of booking
//   totalAmount: number;
//   attendeeDetails: {
//     name: string;
//     email: string;
//     phone: string;
//   }[];
//   specialRequests?: string;
//   status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
//   paymentStatus: 'pending' | 'paid' | 'refunded';
//   transactionId?: string;
//   checkedIn: boolean;
//   checkInTime?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const EventBookingSchema = new Schema<IEventBooking>({
//   eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   bookingReference: { type: String, required: true, unique: true },
//   ticketType: { type: String, required: true }, // Custom ticket type name
//   numberOfTickets: { type: Number, required: true, min: 1 },
//   pricePerTicket: { type: Number, required: true }, // Price at booking time
//   totalAmount: { type: Number, required: true },
//   attendeeDetails: [{
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true }
//   }],
//   specialRequests: { type: String },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'attended'],
//     default: 'pending'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'refunded'],
//     default: 'pending'
//   },
//   transactionId: { type: String },
//   checkedIn: { type: Boolean, default: false },
//   checkInTime: { type: Date },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Generate unique booking reference
// EventBookingSchema.pre('save', function(next) {
//   if (!this.bookingReference) {
//     const prefix = 'EVT';
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.random().toString(36).substring(2, 6).toUpperCase();
//     this.bookingReference = `${prefix}-${timestamp}-${random}`;
//   }

// });

// export default mongoose.models.EventBooking || mongoose.model<IEventBooking>('EventBooking', EventBookingSchema);

// C:\Users\Administrator\Desktop\my-app\models\EventBooking.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEventBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bookingReference: string;
  ticketType: string;
  numberOfTickets: number;
  pricePerTicket: number;
  totalAmount: number;
  attendeeDetails: {
    name: string;
    email: string;
    phone: string;
  }[];
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  transactionId?: string;
  checkoutRequestId?: string;
  checkedIn: boolean;
  checkInTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventBookingSchema = new Schema<IEventBooking>({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookingReference: { type: String, required: false, unique: true },
  ticketType: { type: String, required: true },
  numberOfTickets: { type: Number, required: true, min: 1 },
  pricePerTicket: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  attendeeDetails: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  }],
  specialRequests: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String },
  checkoutRequestId: { type: String },
  checkedIn: { type: Boolean, default: false },
  checkInTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique booking reference - FIXED
EventBookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const prefix = 'EVT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `${prefix}-${timestamp}-${random}`;
  }
 
});

// Generate booking reference for findOneAndUpdate operations
EventBookingSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (!update.bookingReference) {
    const prefix = 'EVT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    update.bookingReference = `${prefix}-${timestamp}-${random}`;
  }

});

export default mongoose.models.EventBooking || mongoose.model<IEventBooking>('EventBooking', EventBookingSchema);