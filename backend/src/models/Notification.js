import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, default: 'general' },
    readAt: { type: Date }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
