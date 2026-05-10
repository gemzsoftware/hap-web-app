import mongoose from 'mongoose';
import { Purchase } from '../../models/Purchase.js';
import { Payment } from '../../models/Payment.js';
import { Document } from '../../models/Document.js';

export async function dashboardRoutes(app) {
  app.get('/summary', { preHandler: app.authenticate }, async (request) => {
    const isStaff = ['admin', 'staff'].includes(request.user.role);
    const userFilter = isStaff ? {} : { userId: new mongoose.Types.ObjectId(request.user.id) };
    const paymentFilter = isStaff
      ? { status: 'successful' }
      : { userId: new mongoose.Types.ObjectId(request.user.id), status: 'successful' };

    const [activePurchases, completedPurchases, totalPaid, documentsAvailable, purchases] = await Promise.all([
      Purchase.countDocuments({ ...userFilter, status: { $in: ['deposit_pending', 'active'] } }),
      Purchase.countDocuments({ ...userFilter, status: 'completed' }),
      Payment.aggregate([{ $match: paymentFilter }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Document.countDocuments({ ...userFilter, status: 'available' }),
      Purchase.find({ ...userFilter, status: { $in: ['deposit_pending', 'active'] } }).sort({ startedAt: 1 })
    ]);

    const outstandingBalance = purchases.reduce(
      (total, purchase) => total + Math.max(purchase.agreedPrice - purchase.amountPaid, 0),
      0
    );
    const nextPurchase = purchases.find((purchase) => purchase.monthlyAmount > 0);
    const nextPaymentDue = nextPurchase
      ? {
          purchaseId: nextPurchase._id.toString(),
          amount: nextPurchase.status === 'deposit_pending' ? nextPurchase.initialDeposit : nextPurchase.monthlyAmount,
          dueAt: nextPurchase.startedAt || nextPurchase.createdAt
        }
      : null;

    return {
      summary: {
        activePurchases,
        completedPurchases,
        totalPaid: totalPaid[0]?.total || 0,
        outstandingBalance,
        nextPaymentDue,
        documentsAvailable
      }
    };
  });
}
