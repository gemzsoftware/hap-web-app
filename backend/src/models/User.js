import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: ['investor', 'admin', 'staff'], default: 'investor' },
    status: { type: String, enum: ['pending_verification', 'active', 'suspended'], default: 'pending_verification' },
    emailVerifiedAt: { type: Date },
    phoneVerifiedAt: { type: Date }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
