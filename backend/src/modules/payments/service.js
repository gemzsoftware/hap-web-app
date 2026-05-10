import crypto from 'node:crypto';
import { Payment } from '../../models/Payment.js';
import { Purchase } from '../../models/Purchase.js';
import { Property } from '../../models/Property.js';
import { Receipt } from '../../models/Receipt.js';
import { Notification } from '../../models/Notification.js';

export function generatePaymentReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `HAP-${date}-${random}`;
}

export async function createPendingPayment({ purchase, amount, type }) {
  const providerReference = generatePaymentReference();
  return Payment.create({
    purchaseId: purchase._id,
    userId: purchase.userId,
    amount,
    type,
    status: 'pending',
    provider: 'stub',
    providerReference
  });
}

export async function applyStubPaymentStatus({ providerReference, status }) {
  const payment = await Payment.findOne({ providerReference });
  if (!payment) return null;

  // TODO: Replace this stub status update with real Paystack/Flutterwave verification if payment providers are introduced.
  if (payment.status === 'successful') {
    return payment;
  }

  if (status === 'failed') {
    payment.status = 'failed';
    await payment.save();
    return payment;
  }

  payment.status = 'successful';
  payment.paidAt = new Date();
  await payment.save();

  const purchase = await Purchase.findById(payment.purchaseId);
  if (!purchase) return payment;

  purchase.amountPaid += payment.amount;

  if (purchase.amountPaid >= purchase.agreedPrice) {
    purchase.status = 'completed';
    purchase.completedAt = new Date();
    await Property.findByIdAndUpdate(purchase.propertyId, { status: 'sold' });
  } else if (payment.type === 'deposit') {
    purchase.status = 'active';
    await Property.findByIdAndUpdate(purchase.propertyId, { status: 'reserved' });
  }

  await purchase.save();

  const existingReceipt = await Receipt.findOne({ paymentId: payment._id });
  if (!existingReceipt) {
    // TODO: Replace placeholder metadata when receipt PDF generation is introduced.
    await Receipt.create({
      paymentId: payment._id,
      receiptNumber: `HAP-RCPT-${Date.now()}`,
      pdfUrl: `/receipts/${payment._id}.pdf`
    });
  }

  // TODO: Trigger email/SMS delivery here if those integrations are added later.
  await Notification.create({
    userId: payment.userId,
    title: 'Payment confirmed',
    message: `Your ${payment.type.replace('_', ' ')} payment has been confirmed.`,
    type: 'payment'
  });

  return payment;
}
