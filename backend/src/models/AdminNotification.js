// ============================================
// FILE: backend/src/models/AdminNotification.js
// ============================================
// NEW FILE - Admin notification model
// For system notifications shown to admins/staff
// ============================================

import mongoose from 'mongoose';

const AdminNotificationSchema = new mongoose.Schema(
  {
    // What type of notification
    type: {
      type: String,
      enum: [
        'new_payment',
        'new_purchase',
        'new_application',
        'new_user',
        'new_inquiry',
        'property_added',
        'property_updated',
        'system_alert',
        'purchase_cancelled',
        'user_suspended',
        'user_restored',
        'user_deleted'
      ],
      required: true,
      index: true
    },

    // Title and message
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },

    // Link to related record
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel',
      default: null
    },
    relatedModel: {
      type: String,
      enum: ['User', 'Property', 'Purchase', 'Payment', 'Application', 'Inquiry', 'Document'],
      default: null
    },

    // Who created this notification (system = auto-generated)
    source: {
      type: String,
      enum: ['system', 'admin'],
      default: 'system'
    },

    // Who this notification is for (null = all admins)
    targetAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },

    // Read status
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date,
      default: null
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    // Extra data
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============================================
// INDEXES
// ============================================

AdminNotificationSchema.index({ read: 1, createdAt: -1 });
AdminNotificationSchema.index({ type: 1, createdAt: -1 });
AdminNotificationSchema.index({ createdAt: -1 });

// ============================================
// VIRTUALS
// ============================================

AdminNotificationSchema.virtual('isUnread').get(function () {
  return !this.read;
});

// ============================================
// INSTANCE METHODS
// ============================================

AdminNotificationSchema.methods.markAsRead = function () {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
  }
  return this;
};

AdminNotificationSchema.methods.markAsUnread = function () {
  this.read = false;
  this.readAt = null;
  return this;
};

// ============================================
// STATIC METHODS
// ============================================

// Get unread count
AdminNotificationSchema.statics.getUnreadCount = async function () {
  return this.countDocuments({ read: false });
};

// Get all unread notifications
AdminNotificationSchema.statics.getUnread = async function (limit = 20) {
  return this.find({ read: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Mark all as read
AdminNotificationSchema.statics.markAllAsRead = async function () {
  return this.updateMany(
    { read: false },
    { read: true, readAt: new Date() }
  );
};

// Delete old read notifications (cleanup)
AdminNotificationSchema.statics.deleteOld = async function (days = 90) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return this.deleteMany({
    read: true,
    createdAt: { $lt: cutoff }
  });
};

// Create notification helper
AdminNotificationSchema.statics.createNotification = async function (data) {
  const { type, title, message, relatedId, relatedModel, priority = 'medium', metadata = {} } = data;

  const notification = new this({
    type,
    title,
    message,
    relatedId,
    relatedModel,
    priority,
    metadata,
    source: 'system',
    read: false
  });

  await notification.save();
  return notification;
};

export const AdminNotification = mongoose.model('AdminNotification', AdminNotificationSchema);

// ============================================
// END OF FILE: AdminNotification.js
// ============================================