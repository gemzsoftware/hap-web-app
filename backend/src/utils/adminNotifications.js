import { AdminNotification } from '../models/AdminNotification.js';
import { emitAdminNotification } from '../modules/admin/realtime.js';

function formatCurrency(amount) {
  if (!amount) return '₦0';

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Create an admin notification in MongoDB and immediately
 * broadcast it to connected admin/staff WebSocket clients.
 *
 * MongoDB remains the source of truth.
 * WebSocket is only the real-time delivery mechanism.
 */
async function createAdminNotification(data) {
  const notification =
    await AdminNotification.createNotification(data);

  try {
    emitAdminNotification(notification);
  } catch (error) {
    // A WebSocket failure must never break the business operation
    // that created the notification.
    console.error(
      'Failed to emit admin notification in real time:',
      error.message
    );
  }

  return notification;
}

export async function notifyNewPayment(
  user,
  purchase,
  amount,
  propertyTitle = ''
) {
  const propertyName =
    propertyTitle ||
    purchase?.propertyTitle ||
    'a property';

  return createAdminNotification({
    type: 'new_payment',
    title: '💰 Payment Submitted for Review',
    message: `${user?.fullName || 'A user'} submitted a payment of ${formatCurrency(amount)} for ${propertyName}. The payment is awaiting admin approval.`,
    relatedId: purchase?._id || purchase?.id,
    relatedModel: 'Purchase',
    priority: 'high',
    metadata: {
      userId: user?._id || user?.id,
      amount,
      purchaseId: purchase?._id || purchase?.id,
      propertyTitle: propertyName
    }
  });
}

export async function notifyNewPurchase(
  user,
  purchase,
  propertyTitle = ''
) {
  const propertyName =
    propertyTitle ||
    purchase?.propertyTitle ||
    'a property';

  const amount =
    purchase?.agreedPrice ||
    purchase?.totalPrice ||
    0;

  return createAdminNotification({
    type: 'new_purchase',
    title: '🏡 New Property Purchase',
    message: `${user?.fullName || 'A user'} purchased ${propertyName} for ${formatCurrency(amount)}`,
    relatedId: purchase?._id || purchase?.id,
    relatedModel: 'Purchase',
    priority: 'high',
    metadata: {
      userId: user?._id || user?.id,
      propertyId: purchase?.propertyId,
      amount,
      propertyTitle: propertyName
    }
  });
}

export async function notifyNewApplication(application) {
  return createAdminNotification({
    type: 'new_application',
    title: '📋 New Application Submitted',
    message: `${application?.fullName || 'A user'} submitted an application for ${application?.propertyTitle || 'a property'}`,
    relatedId: application?._id || application?.id,
    relatedModel: 'Application',
    priority: 'medium',
    metadata: {
      userId: application?.userId,
      propertyId: application?.propertyId
    }
  });
}

export async function notifyNewUser(user) {
  return createAdminNotification({
    type: 'new_user',
    title: '👤 New User Registered',
    message: `${user?.fullName || 'A new user'} registered (${user?.email || ''})`,
    relatedId: user?._id || user?.id,
    relatedModel: 'User',
    priority: 'medium',
    metadata: {
      userId: user?._id || user?.id,
      email: user?.email
    }
  });
}

export async function notifyNewInquiry(inquiry) {
  const message =
    inquiry?.message?.substring(0, 100) || '';

  return createAdminNotification({
    type: 'new_inquiry',
    title: '✉️ New Inquiry Received',
    message: `${inquiry?.name || 'Someone'} sent an inquiry: "${message}${message.length >= 100 ? '...' : ''}"`,
    relatedId: inquiry?._id || inquiry?.id,
    relatedModel: 'Inquiry',
    priority: 'low',
    metadata: {
      name: inquiry?.name,
      email: inquiry?.email
    }
  });
}

export async function notifyCancellationRequested(
  user,
  purchase,
  refundableAmount
) {
  return createAdminNotification({
    type: 'purchase_cancelled',
    title: '⚠️ Cancellation Requested',
    message: `${user?.fullName || 'A user'} requested cancellation for ${purchase?.propertyTitle || 'a property'}${
      Number(refundableAmount) > 0
        ? ` — refundable ${formatCurrency(refundableAmount)}`
        : ''
    }`,
    relatedId: purchase?._id || purchase?.id,
    relatedModel: 'Purchase',
    priority: 'high',
    metadata: {
      userId: user?._id || user?.id,
      propertyId: purchase?.propertyId,
      refundableAmount
    }
  });
}

export async function notifyPurchaseCancelled(
  user,
  purchase
) {
  return createAdminNotification({
    type: 'purchase_cancelled',
    title: '❌ Purchase Cancelled',
    message: `${user?.fullName || 'A user'} cancelled purchase for ${purchase?.propertyTitle || 'a property'}`,
    relatedId: purchase?._id || purchase?.id,
    relatedModel: 'Purchase',
    priority: 'high',
    metadata: {
      userId: user?._id || user?.id,
      propertyId: purchase?.propertyId
    }
  });
}

export async function notifyUserSuspended(
  admin,
  user,
  reason
) {
  return createAdminNotification({
    type: 'user_suspended',
    title: '🔒 User Suspended',
    message: `${admin?.fullName || 'Admin'} suspended ${user?.fullName || 'a user'}${reason ? `: ${reason}` : ''}`,
    relatedId: user?._id || user?.id,
    relatedModel: 'User',
    priority: 'high',
    metadata: {
      adminId: admin?._id || admin?.id,
      userId: user?._id || user?.id,
      reason
    }
  });
}

export async function notifyUserRestored(
  admin,
  user
) {
  return createAdminNotification({
    type: 'user_restored',
    title: '🔓 User Restored',
    message: `${admin?.fullName || 'Admin'} restored ${user?.fullName || 'a user'}`,
    relatedId: user?._id || user?.id,
    relatedModel: 'User',
    priority: 'medium',
    metadata: {
      adminId: admin?._id || admin?.id,
      userId: user?._id || user?.id
    }
  });
}

export async function notifyUserDeleted(
  admin,
  user
) {
  return createAdminNotification({
    type: 'user_deleted',
    title: '🗑️ User Deleted',
    message: `${admin?.fullName || 'Admin'} deleted ${user?.fullName || 'a user'}`,
    relatedId: user?._id || user?.id,
    relatedModel: 'User',
    priority: 'high',
    metadata: {
      adminId: admin?._id || admin?.id,
      userId: user?._id || user?.id
    }
  });
}