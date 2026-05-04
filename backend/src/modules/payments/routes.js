import { z } from 'zod';
import { Payment } from '../../models/Payment.js';
import { Purchase } from '../../models/Purchase.js';
import { serialize } from '../../utils/serialize.js';
import { assertOwnerOrStaff } from '../../utils/ownership.js';
import { applyStubPaymentStatus } from './service.js';

const webhookSchema = z.object({
  providerReference: z.string().min(1),
  status: z.enum(['successful', 'failed'])
});

export async function paymentRoutes(app) {
  app.get('/', { preHandler: app.authenticate }, async (request) => {
    const filter = ['admin', 'staff'].includes(request.user.role) ? {} : { userId: request.user.id };
    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    return { payments: serialize(payments) };
  });

  app.get('/stub-checkout/:paymentId', async (request) => {
    const { paymentId } = z.object({ paymentId: z.string() }).parse(request.params);
    const payment = await Payment.findById(paymentId);
    if (!payment) throw app.httpErrors.notFound('Payment not found');

    return {
      checkout: {
        paymentId: payment._id.toString(),
        amount: payment.amount,
        type: payment.type,
        status: payment.status,
        provider: payment.provider,
        reference: payment.providerReference,
        webhookUrl: '/api/payments/webhook'
      }
    };
  });

  app.post('/webhook', async (request) => {
    const body = webhookSchema.parse(request.body);
    const payment = await applyStubPaymentStatus(body);
    if (!payment) throw app.httpErrors.notFound('Payment not found');
    return {
      received: true,
      payment: serialize(payment)
    };
  });

  app.get('/:id', { preHandler: app.authenticate }, async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const payment = await Payment.findById(id);
    if (!payment) throw app.httpErrors.notFound('Payment not found');
    assertOwnerOrStaff(request, payment.userId);

    const purchase = await Purchase.findById(payment.purchaseId);
    return {
      payment: {
        ...serialize(payment),
        purchase: serialize(purchase)
      }
    };
  });
}
