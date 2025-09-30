/*import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin';
  phone: string;
  avatar?: string;
  businessName?: string; 
  businessType?: string; 
  businessDocuments?: string[];
  mpesaNumber?: string; 
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      required: true, 
      enum: ['customer', 'vendor', 'admin', 'delivery'],
      default: 'customer'
    },
    phone: { type: String, required: true, trim: true },
    avatar: { type: String },
    businessName: { type: String, trim: true }, // For vendors
    businessType: { type: String, trim: true }, // For vendors
    businessDocuments: [{ type: String }], // For vendors - store file paths
    mpesaNumber: { type: String, trim: true }, // For M-Pesa payments
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);*/

// lib/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin' | 'delivery';
  phone: string;
  avatar?: string;
  businessName?: string;
  businessType?: string;
  businessDocuments?: string[];
  mpesaNumber?: string;
  isVerified: boolean;
  isActive: boolean;

  referralCode: string;
  referredBy?: string;
  referralCount: {
    type: Number,
    default: 0,
  },

  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      required: true, 
      enum: ['customer', 'vendor', 'admin', 'delivery'],
      default: 'customer'
    },
    phone: { type: String, required: true, trim: true },
    avatar: { type: String },
    businessName: { type: String, trim: true },
    businessType: { type: String, trim: true },
    businessDocuments: [{ type: String }],
    mpesaNumber: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    // Referral schema
    referralCode: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4().substring(0, 8).toUpperCase()
    },
    referredBy: {
      type: String,
      required: false
    },
    referralCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ referralCode: 1 }); // For referral lookups

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);