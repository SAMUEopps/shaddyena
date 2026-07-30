// shd-models/models/Advertisement.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertisement extends Document {
  vendorId: mongoose.Types.ObjectId;
  imageUrl: string;
  imagePublicId: string;
  title: string;
  description?: string;
  link?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentStatus: 'pending' | 'paid' | 'expired';
  paymentAmount: number;
  transactionId?: string;
  position: number;
  views: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>({
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  imagePublicId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  link: { 
    type: String 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'expired'], 
    default: 'pending' 
  },
  paymentAmount: { 
    type: Number, 
    required: true 
  },
  transactionId: { 
    type: String 
  },
  position: { 
    type: Number, 
    default: 0 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  clicks: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Index for efficient queries
AdvertisementSchema.index({ isActive: 1, endDate: 1 });
AdvertisementSchema.index({ vendorId: 1, startDate: -1 });

export default mongoose.models.Advertisement || 
  mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);