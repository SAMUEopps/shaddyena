// import mongoose, { Schema, Document } from 'mongoose';

// export interface IVendor extends Document {
//   userId: mongoose.Types.ObjectId;
//   businessName: string;
//   ownerName: string;
//   nationalId: string;
//   kraPin?: string;
//   phoneNumber: string;
//   businessLocation: string;
//   payoutMethod: 'MPESA' | 'POCHI' | 'TILL' | 'PAYBILL';
//   payoutDetails: {
//     mpesaNumber?: string;
//     pochiNumber?: string;
//     tillNumber?: string;
//     paybillNumber?: string;
//     paybillAccount?: string;
//   };
//   isActive: boolean;
//   totalEarned: number;
//   pendingPayout: number;
//   createdAt: Date;
// }

// const VendorSchema = new Schema<IVendor>({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   businessName: { type: String, required: true },
//   ownerName: { type: String, required: true },
//   nationalId: { type: String, required: true },
//   kraPin: { type: String },
//   phoneNumber: { type: String, required: true },
//   businessLocation: { type: String, required: true },
//   payoutMethod: { type: String, enum: ['MPESA', 'POCHI', 'TILL', 'PAYBILL'], default: 'MPESA' },
//   payoutDetails: {
//     mpesaNumber: String,
//     pochiNumber: String,
//     tillNumber: String,
//     paybillNumber: String,
//     paybillAccount: String,
//   },
//   isActive: { type: Boolean, default: true },
//   totalEarned: { type: Number, default: 0 },
//   pendingPayout: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);

// models/Vendor.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  ownerName: string;
  nationalId: string;
  kraPin?: string;
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
  profileImagePublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  isActive: boolean;
  totalEarned: number;
  pendingPayout: number;
  createdAt: Date;
}

const VendorSchema = new Schema<IVendor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  nationalId: { type: String, required: true },
  kraPin: { type: String },
  phoneNumber: { type: String, required: true },
  businessLocation: { type: String, required: true },
  payoutMethod: { type: String, enum: ['MPESA', 'POCHI', 'TILL', 'PAYBILL'], default: 'MPESA' },
  payoutDetails: {
    mpesaNumber: String,
    pochiNumber: String,
    tillNumber: String,
    paybillNumber: String,
    paybillAccount: String,
  },
  profileImage: { type: String },
  profileImagePublicId: { type: String },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  isActive: { type: Boolean, default: true },
  totalEarned: { type: Number, default: 0 },
  pendingPayout: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);