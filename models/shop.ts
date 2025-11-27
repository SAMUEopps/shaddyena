import mongoose, { Document, Schema } from 'mongoose';

export interface IShop extends Document {
  vendorId: mongoose.Types.ObjectId;
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    //website?: string;
  };
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  policies: {
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  rating?: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const operatingHoursSchema = new Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  open: { type: String, required: true },
  close: { type: String, required: true },
  isClosed: { type: Boolean, default: false }
});

const shopSchema = new Schema<IShop>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    businessType: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    logo: { type: String },
    banner: { type: String },
    location: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      country: { type: String, required: true, default: 'Kenya', trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    contact: {
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      website: { type: String, trim: true }
    },
    operatingHours: [operatingHoursSchema],
    socialMedia: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      youtube: { type: String, trim: true }
    },
    policies: {
      returnPolicy: { type: String, trim: true },
      shippingPolicy: { type: String, trim: true },
      privacyPolicy: { type: String, trim: true }
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    }
  },
  { timestamps: true } 
);

// Index for better query performance
shopSchema.index({ vendorId: 1 });
shopSchema.index({ businessName: 'text', description: 'text' });
shopSchema.index({ 'location.city': 1 });
shopSchema.index({ isActive: 1, isVerified: 1 });

export default mongoose.models.Shop || mongoose.model<IShop>('Shop', shopSchema);