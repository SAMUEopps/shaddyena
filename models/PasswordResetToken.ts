import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPasswordResetToken extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// TTL index - auto-delete after 15 minutes
PasswordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 });

// Compound index for faster lookups
PasswordResetTokenSchema.index({ userId: 1, token: 1 });

// Ensure one active token per user
PasswordResetTokenSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.PasswordResetToken || 
  mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);