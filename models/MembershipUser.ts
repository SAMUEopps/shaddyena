// models/MembershipUser.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMembershipUser extends Document {
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  role: 'member';
  membershipNumber: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const membershipUserSchema = new Schema<IMembershipUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'member', enum: ['member'] },
    membershipNumber: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

membershipUserSchema.index({ email: 1 });
membershipUserSchema.index({ membershipNumber: 1 });

membershipUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const bcrypt = await import('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

membershipUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.MembershipUser || mongoose.model<IMembershipUser>('MembershipUser', membershipUserSchema);