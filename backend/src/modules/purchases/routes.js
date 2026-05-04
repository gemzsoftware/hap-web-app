import { z } from 'zod';
import { Purchase } from '../../models/Purchase.js';
import { Property } from '../../models/Property.js';
import { InstallmentPlan } from '../../models/InstallmentPlan.js';
import { Payment } from '../../models/Payment.js';
import { Receipt } from '../../models/Receipt.js';
import { Document } from '../../models/Document.js';
import { serialize } from '../../utils/serialize.js';
import { assertOwnerOrStaff } from '../../utils/ownership.js';
import { createPendingPayment } from '../payments/service.js';

const createPurchaseSchema = z.object({
  propertyId: z.string(),
  paymentMode: z.enum(['installment', 'full_payment'])
});

const initializePaymentSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['deposit', 'installment', 'full_payment'])
});

export async function purchaseRoutes(app) {
  app.get('/', { preHandler: app.authenticate }, async (request) => {
    const filter = ['admin', 'staff'].includes(request.user.role) ? {} : { userId: request.user.id };
    const purchases = await Purchase.find(filter).populate('propertyId').sort({ createdAt: -1 });
    return { purchases: serialize(purchases) };
  });

  app.post('/', { preHandler: app.authenticate }, async (request, reply) => {
    const body = createPurchaseSchema.parse(request.body);
    const property = await Property.findById(body.propertyId);
    if (!property) throw app.httpErrors.notFound('Property not found');
    if (property.status !== 'available') throw app.httpErrors.badRequest('Property is not available');

    const plan = await InstallmentPlan.findOne({ propertyId: property._id, isActive: true });
    if (!plan) throw app.httpErrors.badRequest('Active installment plan is required');

    const purchase = await Purchase.create({
      userId: request.user.id,
      propertyId: property._id,
      installmentPlanId: plan._id,
      status: 'deposit_pending',
      agreedPrice: property.price,
      initialDeposit: plan.initialDeposit,
      monthlyAmount: body.paymentMode === 'full_payment' ? 0 : plan.monthlyAmount,
      totalMonths: body.paymentMode === 'full_payment' ? 0 : plan.totalMonths,
      amountPaid: 0,
      startedAt: new Date()
    });

    return reply.code(201).send({ purchase: serialize(purchase) });
  });

  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    const purchases = await Purchase.find({ userId: request.user.id }).populate('propertyId').sort({ createdAt: -1 });
    const data = await Promise.all(
      purchases.map(async (purchase) => {
        const [payments, receiptsCount, documentsCount] = await Promise.all([
          Payment.find({ purchaseId: purchase._id }).sort({ createdAt: -1 }),
          Receipt.countDocuments({ paymentId: { $in: await Payment.find({ purchaseId: purchase._id }).distinct('_id') } }),
          Document.countDocuments({ purchaseId: purchase._id })
        ]);
        const outstandingBalance = Math.max(purchase.agreedPrice - purchase.amountPaid, 0);
        return {
          ...serialize(purchase),
          paymentProgress: {
            amountPaid: purchase.amountPaid,
            agreedPrice: purchase.agreedPrice,
            outstandingBalance,
            percentPaid: purchase.agreedPrice ? Math.round((purchase.amountPaid / purchase.agreedPrice) * 100) : 0
          },
          payments: serialize(payments),
          receiptsCount,
          documentsCount
        };
      })
    );
    return { data };
  });

  app.post('/:id/payments/initialize', { preHandler: app.authenticate }, async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const body = initializePaymentSchema.parse(request.body);
    const purchase = await Purchase.findById(id);
    if (!purchase) throw app.httpErrors.notFound('Purchase not found');
    assertOwnerOrStaff(request, purchase.userId);

    const expectedAmounts = {
      deposit: purchase.initialDeposit,
      installment: purchase.monthlyAmount,
      full_payment: Math.max(purchase.agreedPrice - purchase.amountPaid, 0)
    };
    const expectedAmount = expectedAmounts[body.type];
    if (body.amount !== expectedAmount) {
      throw app.httpErrors.badRequest('Payment amount does not match the current purchase terms');
    }

    const payment = await createPendingPayment({ purchase, amount: expectedAmount, type: body.type });
    return reply.code(201).send({
      authorizationUrl: `/api/payments/stub-checkout/${payment._id}`,
      reference: payment.providerReference
    });
  });

  app.get('/:id', { preHandler: app.authenticate }, async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const purchase = await Purchase.findById(id).populate('propertyId installmentPlanId');
    if (!purchase) throw app.httpErrors.notFound('Purchase not found');
    assertOwnerOrStaff(request, purchase.userId);
    const payments = await Payment.find({ purchaseId: purchase._id }).sort({ createdAt: -1 });
    const receipts = await Receipt.find({ paymentId: { $in: payments.map((payment) => payment._id) } }).sort({ issuedAt: -1 });
    const documents = await Document.find({ purchaseId: purchase._id }).sort({ createdAt: -1 });
    return {
      purchase: {
        ...serialize(purchase),
        payments: serialize(payments),
        receipts: serialize(receipts),
        documents: serialize(documents)
      }
    };
  });
}
