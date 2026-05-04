import { z } from 'zod';
import { Receipt } from '../../models/Receipt.js';
import { Payment } from '../../models/Payment.js';
import { Purchase } from '../../models/Purchase.js';
import { serialize } from '../../utils/serialize.js';
import { assertOwnerOrStaff } from '../../utils/ownership.js';

export async function receiptRoutes(app) {
  app.get('/', { preHandler: app.authenticate }, async (request) => {
    if (['admin', 'staff'].includes(request.user.role)) {
      const receipts = await Receipt.find().sort({ issuedAt: -1 });
      return { receipts: serialize(receipts) };
    }

    const payments = await Payment.find({ userId: request.user.id }).select('_id');
    const receipts = await Receipt.find({ paymentId: { $in: payments.map((payment) => payment._id) } }).sort({
      issuedAt: -1
    });
    return { receipts: serialize(receipts) };
  });

  app.post('/', { preHandler: app.requireRole(['admin', 'staff']) }, async (request, reply) => {
    const body = z.object({ paymentId: z.string(), pdfUrl: z.string().optional() }).parse(request.body);
    const payment = await Payment.findById(body.paymentId);
    if (!payment) throw app.httpErrors.notFound('Payment not found');
    assertOwnerOrStaff(request, payment.userId);

    const receipt = await Receipt.create({
      paymentId: payment._id,
      receiptNumber: `HAP-${Date.now()}`,
      pdfUrl: body.pdfUrl
    });
    return reply.code(201).send({ receipt: serialize(receipt) });
  });

  app.get('/:id/download', { preHandler: app.authenticate }, async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const receipt = await Receipt.findById(id);
    if (!receipt) throw app.httpErrors.notFound('Receipt not found');
    const payment = await Payment.findById(receipt.paymentId);
    if (!payment) throw app.httpErrors.notFound('Payment not found');
    assertOwnerOrStaff(request, payment.userId);

    return {
      receipt: serialize(receipt),
      payment: serialize(payment),
      downloadUrl: receipt.pdfUrl || `/api/receipts/${receipt._id}/download-placeholder`
    };
  });

  app.get('/:id', { preHandler: app.authenticate }, async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const receipt = await Receipt.findById(id);
    if (!receipt) throw app.httpErrors.notFound('Receipt not found');
    const payment = await Payment.findById(receipt.paymentId);
    if (!payment) throw app.httpErrors.notFound('Payment not found');
    assertOwnerOrStaff(request, payment.userId);
    const purchase = await Purchase.findById(payment.purchaseId);

    return {
      receipt: serialize(receipt),
      payment: serialize(payment),
      purchase: serialize(purchase)
    };
  });
}
