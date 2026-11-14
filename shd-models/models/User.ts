// // // // import mongoose, { Schema, Document } from 'mongoose';

// // // // export interface IUser extends Document {
// // // //   name: string;
// // // //   phoneNumber: string;
// // // //   email: string;
// // // //   password: string;
// // // //   isVerified: boolean;
// // // //   role: 'customer' | 'vendor' | 'admin';
// // // //   createdAt: Date;
// // // // }

// // // // const UserSchema = new Schema<IUser>({
// // // //   name: { type: String, required: true },
// // // //   phoneNumber: { type: String, required: true, unique: true },
// // // //   email: { type: String, required: true, unique: true },
// // // //   password: { type: String, required: true },
// // // //   isVerified: { type: Boolean, default: false },
// // // //   role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
// // // //   createdAt: { type: Date, default: Date.now }
// // // // });

// // // // export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// // // // C:\Users\USER\Desktop\Projects\my-app\models\User.ts
// // // import mongoose, { Schema, Document } from 'mongoose';

// // // export interface IUser extends Document {
// // //   name: string;
// // //   phoneNumber: string;
// // //   email: string;
// // //   password: string;
// // //   isVerified: boolean;
// // //   role: 'customer' | 'vendor' | 'admin';
// // //   referralCode: string;
// // //   referredBy: string | null; // referral code of the person who referred them
// // //   referrals: string[]; // array of user IDs who used this user's referral code
// // //   referralEarnings: number;
// // //   createdAt: Date;
// // // }

// // // const UserSchema = new Schema<IUser>({
// // //   name: { type: String, required: true },
// // //   phoneNumber: { type: String, required: true, unique: true },
// // //   email: { type: String, required: true, unique: true },
// // //   password: { type: String, required: true },
// // //   isVerified: { type: Boolean, default: false },
// // //   role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
// // //   referralCode: { type: String, unique: true },
// // //   referredBy: { type: String, default: null },
// // //   referrals: [{ type: String }],
// // //   referralEarnings: { type: Number, default: 0 },
// // //   createdAt: { type: Date, default: Date.now }
// // // });

// // // export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// // // C:\Users\USER\Desktop\Projects\my-app\models\User.ts
// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IUser extends Document {
// //   name: string;
// //   phoneNumber: string;
// //   email: string;
// //   password: string;
// //   isVerified: boolean;
// //   role: 'customer' | 'vendor' | 'admin' | 'rider';
// //   referralCode: string;
// //   referredBy: string | null;
// //   referrals: string[];
// //   referralEarnings: number;
// //   createdAt: Date;
// // }

// // const UserSchema = new Schema<IUser>({
// //   name: { type: String, required: true },
// //   phoneNumber: { type: String, required: true, unique: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true },
// //   isVerified: { type: Boolean, default: false },
// //   role: { type: String, enum: ['customer', 'vendor', 'admin', 'rider'], default: 'customer' },
// //   referralCode: { type: String, unique: true },
// //   referredBy: { type: String, default: null },
// //   referrals: [{ type: String }],
// //   referralEarnings: { type: Number, default: 0 },
// //   createdAt: { type: Date, default: Date.now }
// // });

// // export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// // C:\Users\USER\Desktop\Projects\my-app\models\User.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUser extends Document {
//   name: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   isVerified: boolean;
//   role: 'customer' | 'vendor' | 'admin' | 'rider';
//   referralCode: string;
//   referredBy: string | null;
//   referrals: string[];
//   referralEarnings: number;
//   // Membership fields
//   isMember: boolean;
//   memberSince?: Date;
//   totalSavings: number;
//   totalInvestments: number;
//   availableBalance: number;
//   createdAt: Date;
// }

// const UserSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   phoneNumber: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isVerified: { type: Boolean, default: false },
//   role: { type: String, enum: ['customer', 'vendor', 'admin', 'rider'], default: 'customer' },
//   referralCode: { type: String, unique: true },
//   referredBy: { type: String, default: null },
//   referrals: [{ type: String }],
//   referralEarnings: { type: Number, default: 0 },
//   // Membership fields
//   isMember: { type: Boolean, default: false },
//   memberSince: { type: Date },
//   totalSavings: { type: Number, default: 0 },
//   totalInvestments: { type: Number, default: 0 },
//   availableBalance: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// // models/User.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUser extends Document {
//   name: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   isVerified: boolean;
//   role: 'customer' | 'vendor' | 'admin' | 'rider';
//   referralCode: string;
//   referredBy: string | null;
//   referrals: string[];
//   referralEarnings: number;
//   referralCommissionEarnings: number; // New: earnings from order commissions
//   referralSubscriptionEarnings: number; // New: earnings from subscription commissions
//   // Membership fields
//   isMember: boolean;
//   memberSince?: Date;
//   totalSavings: number;
//   totalInvestments: number;
//   availableBalance: number;
//   createdAt: Date;
// }

// const UserSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   phoneNumber: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isVerified: { type: Boolean, default: false },
//   role: { type: String, enum: ['customer', 'vendor', 'admin', 'rider'], default: 'customer' },
//   referralCode: { type: String, unique: true },
//   referredBy: { type: String, default: null },
//   referrals: [{ type: String }],
//   referralEarnings: { type: Number, default: 0 },
//   referralCommissionEarnings: { type: Number, default: 0 },
//   referralSubscriptionEarnings: { type: Number, default: 0 },
//   // Membership fields
//   isMember: { type: Boolean, default: false },
//   memberSince: { type: Date },
//   totalSavings: { type: Number, default: 0 },
//   totalInvestments: { type: Number, default: 0 },
//   availableBalance: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);


// shd-models/models/User.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUser extends Document {
//   name: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   isVerified: boolean;
//   role: 'customer' | 'vendor' | 'admin' | 'rider';
//   referralCode: string;
//   referredBy: string | null;
//   referrals: string[];
//   referralEarnings: number;
//   referralCommissionEarnings: number;
//   referralSubscriptionEarnings: number;
//   // Membership fields
//   isMember: boolean;
//   memberSince?: Date;
//   totalSavings: number;
//   totalInvestments: number;
//   availableBalance: number;
//   organizationId?: mongoose.Types.ObjectId; // Add this
//   createdAt: Date;
// }

// const UserSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   phoneNumber: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isVerified: { type: Boolean, default: false },
//   role: { type: String, enum: ['customer', 'vendor', 'admin', 'rider'], default: 'customer' },
//   referralCode: { type: String, unique: true },
//   referredBy: { type: String, default: null },
//   referrals: [{ type: String }],
//   referralEarnings: { type: Number, default: 0 },
//   referralCommissionEarnings: { type: Number, default: 0 },
//   referralSubscriptionEarnings: { type: Number, default: 0 },
//   // Membership fields
//   isMember: { type: Boolean, default: false },
//   memberSince: { type: Date },
//   totalSavings: { type: Number, default: 0 },
//   totalInvestments: { type: Number, default: 0 },
//   availableBalance: { type: Number, default: 0 },
//   organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' }, 
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// shd-models/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: 'customer' | 'vendor' | 'admin' | 'rider' | 'marketer';
  referralCode: string;
  referredBy: string | null;
  referrals: string[];
  referralEarnings: number;
  referralCommissionEarnings: number;
  referralSubscriptionEarnings: number;
  // Membership fields
  isMember: boolean;
  memberSince?: Date;
  totalSavings: number;
  totalInvestments: number;
  availableBalance: number;
  organizationId?: mongoose.Types.ObjectId;
  // Marketer-specific fields
  marketerStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  marketerTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalCommissions: number;
  totalReferralsMade: number;
  payoutMethod?: 'mpesa' | 'bank';
  payoutDetails?: {
    phoneNumber?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin', 'rider', 'marketer'],
    default: 'customer',
  },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  referrals: [{ type: String }],
  referralEarnings: { type: Number, default: 0 },
  referralCommissionEarnings: { type: Number, default: 0 },
  referralSubscriptionEarnings: { type: Number, default: 0 },
  // Membership fields
  isMember: { type: Boolean, default: false },
  memberSince: { type: Date },
  totalSavings: { type: Number, default: 0 },
  totalInvestments: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  // Marketer-specific fields
  marketerStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  marketerTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  totalCommissions: { type: Number, default: 0 },
  totalReferralsMade: { type: Number, default: 0 },
  payoutMethod: { type: String, enum: ['mpesa', 'bank'] },
  payoutDetails: {
    phoneNumber: String,
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);