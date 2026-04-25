import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRiderRequest extends Document {
  userId: Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  email: string;
  vehicleType: string;
  vehicleModel: string;
  vehiclePlate: string;
  idNumber: string;
  licenseNumber: string;
  location: string;
  emergencyContact: string;
  emergencyPhone: string;
  experienceYears: string;
  availability: string;
  referralCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  documents: {
    idDocument?: string;
    licenseDocument?: string;
    vehicleDocument?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const riderRequestSchema = new Schema<IRiderRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One request per user
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Motorcycle', 'Bicycle', 'Car', 'Truck/Van'],
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    vehiclePlate: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    idNumber: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContact: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'weekend', 'evening'],
    },
    referralCode: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    documents: {
      idDocument: { type: String },
      licenseDocument: { type: String },
      vehicleDocument: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
riderRequestSchema.index({ userId: 1 });
riderRequestSchema.index({ status: 1 });
riderRequestSchema.index({ createdAt: -1 });
riderRequestSchema.index({ email: 1 });
riderRequestSchema.index({ phoneNumber: 1 });

export default mongoose.models.RiderRequest ||
  mongoose.model<IRiderRequest>('RiderRequest', riderRequestSchema);