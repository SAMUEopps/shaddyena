// C:\Users\USER\Desktop\Projects\my-app\models\Rider.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRider extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  kraPin?: string;
  vehicleType: 'MOTORCYCLE' | 'BICYCLE' | 'CAR' | 'VAN';
  vehicleRegistration: string;
  driverLicense: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    updatedAt: Date;
  };
  isActive: boolean;
  isAvailable: boolean;
  totalDeliveries: number;
  rating: number;
  totalEarned: number;
  pendingPayout: number;
  payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
  payoutDetails: {
    mpesaNumber?: string;
    pochiNumber?: string;
    tillNumber?: string;
    paybillNumber?: string;
    paybillAccount?: string;
  };
  deliveryRadius: number; // in kilometers
  createdAt: Date;
}

const RiderSchema = new Schema<IRider>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  kraPin: { type: String },
  vehicleType: { 
    type: String, 
    enum: ['MOTORCYCLE', 'BICYCLE', 'CAR', 'VAN'], 
    required: true 
  },
  vehicleRegistration: { type: String, required: true },
  driverLicense: { type: String, required: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    updatedAt: { type: Date, default: Date.now }
  },
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  totalDeliveries: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0, min: 1, max: 5 },
  totalEarned: { type: Number, default: 0 },
  pendingPayout: { type: Number, default: 0 },
  payoutMethod: { type: String, enum: ['MPESA', 'POCHI', 'TILL', 'PAYBILL'], default: 'MPESA' },
  payoutDetails: {
    mpesaNumber: String,
    pochiNumber: String,
    tillNumber: String,
    paybillNumber: String,
    paybillAccount: String,
  },
  deliveryRadius: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Rider || mongoose.model<IRider>('Rider', RiderSchema);