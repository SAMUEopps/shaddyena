const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
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

    // Referral system
    referralCode: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4().substring(0, 8).toUpperCase()
    },
    referredBy: { type: String },
    referralCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
