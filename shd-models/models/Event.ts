// // C:\Users\USER\Desktop\Projects\my-app\models\Event.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IEvent extends Document {
//   title: string;
//   description: string;
//   category: 'workshop' | 'seminar' | 'conference' | 'networking' | 'training' | 'other';
//   image?: string;
//   venue: string;
//   address: string;
//   city: string;
//   startDate: Date;
//   endDate: Date;
//   startTime: string;
//   endTime: string;
//   price: number;
//   capacity: number;
//   bookedCount: number;
//   availableSlots: number;
//   status: 'draft' | 'published' | 'cancelled' | 'completed';
//   featured: boolean;
//   organizer: string;
//   organizerEmail: string;
//   organizerPhone: string;
//   tags: string[];
//   highlights: string[];
//   requirements: string[];
//   whatsIncluded: string[];
//   createdBy: mongoose.Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const EventSchema = new Schema<IEvent>({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   category: {
//     type: String,
//     enum: ['workshop', 'seminar', 'conference', 'networking', 'training', 'other'],
//     required: true
//   },
//   image: { type: String },
//   venue: { type: String, required: true },
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   startTime: { type: String, required: true },
//   endTime: { type: String, required: true },
//   price: { type: Number, required: true, default: 0 },
//   capacity: { type: Number, required: true },
//   bookedCount: { type: Number, default: 0 },
//   availableSlots: { type: Number, default: 0 },
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'cancelled', 'completed'],
//     default: 'draft'
//   },
//   featured: { type: Boolean, default: false },
//   organizer: { type: String, required: true },
//   organizerEmail: { type: String, required: true },
//   organizerPhone: { type: String, required: true },
//   tags: [{ type: String }],
//   highlights: [{ type: String }],
//   requirements: [{ type: String }],
//   whatsIncluded: [{ type: String }],
//   createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Pre-save middleware to calculate available slots
// EventSchema.pre('save', function(next) {
//   this.availableSlots = this.capacity - this.bookedCount;
 
// });

// export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

// C:\Users\Administrator\Desktop\my-app\models\Event.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketType {
  name: string;
  price: number;
  description?: string;
  capacity?: number; // Optional: limit per ticket type
}

export interface IEvent extends Document {
  title: string;
  description: string;
  category: 'workshop' | 'seminar' | 'conference' | 'networking' | 'training' | 'other';
  image?: string;
  venue: string;
  address: string;
  city: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  ticketTypes: ITicketType[]; // Variable ticket types with pricing
  capacity: number; // Total capacity across all ticket types
  bookedCount: number;
  availableSlots: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  featured: boolean;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string[];
  highlights: string[];
  requirements: string[];
  whatsIncluded: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['workshop', 'seminar', 'conference', 'networking', 'training', 'other'],
    required: true
  },
  image: { type: String },
  venue: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  ticketTypes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    capacity: { type: Number } // Individual ticket type capacity
  }],
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },
  availableSlots: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  organizer: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  organizerPhone: { type: String, required: true },
  tags: [{ type: String }],
  highlights: [{ type: String }],
  requirements: [{ type: String }],
  whatsIncluded: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate available slots
EventSchema.pre('save', function(next) {
  this.availableSlots = this.capacity - this.bookedCount;
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);