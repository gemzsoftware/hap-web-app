import { Notification } from '../models/Notification.js';

function formatCurrency(amount) {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Creates an in-app notification for an investor.
 *
 * The project deliberately ships in-app notifications only; external email
 * or SMS delivery is an integration that has to be configured separately.
 * A notification failure must never roll back the business action that
 * triggered it, so errors are reported and swallowed.
 */
export async function notifyUser({
  userId,
  title,
  message,
  type = 'general',
  priority = 'medium',
  entityType = null,
  entityId = null,
  metadata = {},
  app = null
}) {
  if (!userId || !title || !message) return null;

  try {
    return await Notification.create({
      userId,
      title,
      message,
      type,
      priority,
      entityType,
      entityId,
      metadata,
      isSystem: true
    });
  } catch (error) {
    app?.log?.error?.(error, 'Failed to create user notification');
    return null;
  }
}

/* ---------------------------------------------------------------
 * Application lifecycle
 * ------------------------------------------------------------- */

export function notifyApplicationSubmitted({ userId, propertyTitle, app }) {
  return notifyUser({
    userId,
    type: 'application_submitted',
    title: 'Application received',
    message: `We have received your application for ${propertyTitle}. Our team will review it shortly.`,
    entityType: 'Application',
    app
  });
}

export function notifyApplicationUnderReview({ userId, propertyTitle, app }) {
  return notifyUser({
    userId,
    type: 'application_under_review',
    title: 'Application under review',
    message: `Your application for ${propertyTitle} is now being reviewed.`,
    entityType: 'Application',
    app
  });
}

export function notifyApplicationApproved({ userId, propertyTitle, app }) {
  return notifyUser({
    userId,
    type: 'application_approved',
    title: 'Application approved',
    message: `Congratulations. Your application for ${propertyTitle} has been approved. Please proceed with your payment.`,
    priority: 'high',
    entityType: 'Application',
    app
  });
}

export function notifyApplicationRejected({ userId, propertyTitle, reason, app }) {
  return notifyUser({
    userId,
    type: 'application_rejected',
    title: 'Application not approved',
    message: `Your application for ${propertyTitle} was not approved.${reason ? ` Reason: ${reason}` : ''}`,
    priority: 'high',
    entityType: 'Application',
    app
  });
}

export function notifyApplicationInfoRequested({ userId, propertyTitle, notes, app }) {
  return notifyUser({
    userId,
    type: 'application_info_requested',
    title: 'More information needed',
    message: `We need more information about your application for ${propertyTitle}.${notes ? ` ${notes}` : ''}`,
    priority: 'high',
    entityType: 'Application',
    app
  });
}

/* ---------------------------------------------------------------
 * Purchase lifecycle
 * ------------------------------------------------------------- */

export function notifyPurchaseStarted({ userId, propertyTitle, amount, app }) {
  return notifyUser({
    userId,
    type: 'purchase_started',
    title: 'Purchase started',
    message: `Your purchase for ${propertyTitle} is now active. Agreed price: ${formatCurrency(amount)}.`,
    entityType: 'Purchase',
    app
  });
}

export function notifyPurchaseCompleted({ userId, propertyTitle, app }) {
  return notifyUser({
    userId,
    type: 'purchase_completed',
    title: 'Purchase completed',
    message: `Your purchase for ${propertyTitle} is fully paid and complete. Your documents will be issued shortly.`,
    priority: 'high',
    entityType: 'Purchase',
    app
  });
}

export function notifyPurchaseCancelled({ userId, propertyTitle, refundableAmount, app }) {
  return notifyUser({
    userId,
    type: 'purchase_cancelled',
    title: 'Purchase cancelled',
    message: `Your purchase for ${propertyTitle} has been cancelled.${
      refundableAmount > 0
        ? ` Refundable amount: ${formatCurrency(refundableAmount)}.`
        : ''
    }`,
    priority: 'high',
    entityType: 'Purchase',
    app
  });
}

/* ---------------------------------------------------------------
 * Payment lifecycle
 * ------------------------------------------------------------- */

export function notifyPaymentInitiated({ userId, amount, type, reference, app }) {
  return notifyUser({
    userId,
    type: 'payment_initiated',
    title: 'Payment started',
    message: `A ${String(type).replace('_', ' ')} payment of ${formatCurrency(amount)} was started. Reference ${reference}.`,
    entityType: 'Payment',
    app
  });
}

export function notifyPaymentVerified({ userId, amount, type, app }) {
  return notifyUser({
    userId,
    type: 'payment_verified',
    title: 'Payment confirmed',
    message: `Your ${String(type).replace('_', ' ')} payment of ${formatCurrency(amount)} has been verified.`,
    priority: 'high',
    entityType: 'Payment',
    app
  });
}

export function notifyPaymentFailed({ userId, amount, type, app }) {
  return notifyUser({
    userId,
    type: 'payment_failed',
    title: 'Payment failed',
    message: `Your ${String(type).replace('_', ' ')} payment of ${formatCurrency(amount)} did not go through. You can try again.`,
    priority: 'high',
    entityType: 'Payment',
    app
  });
}

export function notifyInstallmentDue({ userId, amount, dueDate, propertyTitle, app }) {
  return notifyUser({
    userId,
    type: 'installment_due',
    title: 'Installment due',
    message: `Your next installment of ${formatCurrency(amount)} for ${propertyTitle} is due on ${new Date(dueDate).toDateString()}.`,
    entityType: 'Purchase',
    app
  });
}

export function notifyInstallmentOverdue({ userId, amount, dueDate, propertyTitle, app }) {
  return notifyUser({
    userId,
    type: 'installment_overdue',
    title: 'Installment overdue',
    message: `Your installment of ${formatCurrency(amount)} for ${propertyTitle} was due on ${new Date(dueDate).toDateString()} and is now overdue.`,
    priority: 'high',
    entityType: 'Purchase',
    app
  });
}

/* ---------------------------------------------------------------
 * Documents and account
 * ------------------------------------------------------------- */

export function notifyDocumentAdded({ userId, title, documentId, app }) {
  return notifyUser({
    userId,
    type: 'document_added',
    title: 'New document available',
    message: `"${title}" has been added to your document vault.`,
    entityType: 'Document',
    entityId: documentId,
    app
  });
}

export function notifyAccountStatus({ userId, suspended, reason, app }) {
  return notifyUser({
    userId,
    type: suspended ? 'account_suspended' : 'account_restored',
    title: suspended ? 'Account suspended' : 'Account restored',
    message: suspended
      ? `Your account has been suspended.${reason ? ` Reason: ${reason}` : ''}`
      : 'Your account has been restored. You can access your dashboard again.',
    priority: 'high',
    entityType: 'User',
    entityId: userId,
    app
  });
}
